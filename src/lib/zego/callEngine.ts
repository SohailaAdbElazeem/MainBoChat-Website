 // src/lib/zego/callEngine.ts

export type CallState = "idle" | "calling" | "ringing" | "connected" | "ended";

export interface CallEngineConfig {
  appId: number;
  userId: string;
  userName: string;
  token: string;
}

export interface RemoteStreamInfo {
  streamId: string;
  userId: string;
  userName?: string;
  mediaStream?: MediaStream;
  videoElement?: HTMLVideoElement;
}

class CallEngine {
  private zg: any = null;
  private ZegoExpressEngine: any = null;
  private localStream: any = null;
  private remoteStreams: Map<string, RemoteStreamInfo> = new Map();
  private config: CallEngineConfig | null = null;
  private currentRoomId: string | null = null;
  private isSpeakerOn: boolean = false;
  private initPromise: Promise<void> | null = null;

  // Callbacks
  private onStateChange?: (state: CallState) => void;
  private onRemoteStreamAdd?: (streamId: string) => void;
  private onRemoteStreamRemove?: (streamId: string) => void;
  private onUserJoin?: (userId: string, userName?: string) => void;
  private onUserLeave?: (userId: string) => void;
  private onError?: (error: any) => void;
  private onAutoplayFailed?: (streamId: string) => void;

  // ================== 1. إنشاء المحرك ==================
  async init(config: CallEngineConfig): Promise<void> {
    if (typeof window === "undefined") return;

    if (this.initPromise) {
      console.log("[CallEngine] ⏳ Waiting for ongoing init...");
      return this.initPromise;
    }

    if (this.zg) {
      console.log("[CallEngine] ✅ Already initialized");
      return;
    }

    console.log("[CallEngine] 🚀 Starting init...");
    this.initPromise = this._doInit(config);

    try {
      await this.initPromise;
    } finally {
      this.initPromise = null;
    }
  }

  private async _doInit(config: CallEngineConfig): Promise<void> {
    if (this.zg && this.config?.userId !== config.userId) {
      this.destroy();
    }

    this.config = config;

    if (!this.zg) {
      console.log("[CallEngine] 📦 Importing SDK...");
      const zegoModule = await import("zego-express-engine-webrtc");
      this.ZegoExpressEngine = zegoModule.ZegoExpressEngine;

      if (!this.ZegoExpressEngine) {
        throw new Error("ZegoExpressEngine not found in SDK");
      }

      console.log("[CallEngine] 🔧 Creating engine with AppID:", config.appId);
      this.zg = new this.ZegoExpressEngine(config.appId, "");
      this.setupEventListeners();
      console.log("[CallEngine] ✅ Engine ready");
    }
  }

  // ================== تسجيل الأحداث ==================
  private setupEventListeners(): void {
    if (!this.zg) return;

    this.zg.on("roomStateChanged", (roomID: string, reason: string, errorCode: number) => {
      console.log(`[ZegoEngine] 🔔 roomStateChanged: ${reason} (code: ${errorCode})`);

      if (reason === "LOGINED") {
        this.onStateChange?.("connected");
      } else if (reason === "LOGIN_FAILED") {
        this.onStateChange?.("ended");
        this.onError?.({ type: "login_failed", errorCode });
      } else if (reason === "KICKOUT") {
        this.onStateChange?.("ended");
        this.onError?.({ type: "kickout" });
      } else if (reason === "DISCONNECTED") {
        this.onStateChange?.("ended");
        this.onError?.({ type: "disconnected" });
      }
    });

    this.zg.on(
      "roomStreamUpdate",
      async (roomID: string, updateType: "ADD" | "DELETE", streamList: any[]) => {
        console.log(`[ZegoEngine] 🔔 roomStreamUpdate: ${updateType}`, streamList);

        if (updateType === "ADD") {
          for (const stream of streamList) {
            const streamId = stream.streamID;
            const userId = stream.user?.userID || "";
            const userName = stream.user?.userName || "";

            if (userId === this.config?.userId) continue;

            this.remoteStreams.set(streamId, {
              streamId,
              userId,
              userName,
            });

            // 🔊 الحل الجذري: تشغيل الصوت فوراً داخل الإيفنت لضمان سماعه دون انتظار أي ملفات خارجية
            try {
              console.log("🔊 [CallEngine] Auto-playing stream on ADD:", streamId);
              await this.startPlayingForCall(streamId);
            } catch (playErr) {
              console.error("❌ [CallEngine] Auto-play error:", playErr);
            }

            this.onRemoteStreamAdd?.(streamId);
          }
        } else if (updateType === "DELETE") {
          for (const stream of streamList) {
            const streamId = stream.streamID;
            
            if (typeof document !== "undefined") {
              const audioElement = document.getElementById(`audio_${streamId}`);
              if (audioElement) {
                audioElement.remove();
              }
            }

            this.remoteStreams.delete(streamId);
            this.onRemoteStreamRemove?.(streamId);
          }
        }
      }
    );

    this.zg.on("roomUserUpdate", (roomID: string, updateType: "ADD" | "DELETE", userList: any[]) => {
      console.log(`[ZegoEngine] 🔔 roomUserUpdate: ${updateType}`, userList);

      if (updateType === "ADD") {
        for (const user of userList) {
          this.onUserJoin?.(user.userID, user.userName);
        }
      } else {
        for (const user of userList) {
          this.onUserLeave?.(user.userID);
        }
      }
    });

    this.zg.on("autoplayFailed", (streamID: string) => {
      console.warn("[CallEngine] ⚠️ Autoplay blocked for stream:", streamID);
      this.onAutoplayFailed?.(streamID);
    });
  }

  // ================== 2. الانضمام للغرفة ==================
  async joinRoom(roomId: string): Promise<boolean> {
    if (!this.zg || !this.config) {
      if (this.initPromise) {
        await this.initPromise;
      }
      if (!this.zg || !this.config) {
        throw new Error("CallEngine not initialized");
      }
    }

    if (this.currentRoomId && this.currentRoomId !== roomId) {
      try {
        await this.leaveRoom();
      } catch (e) {}
    }

    if (this.currentRoomId === roomId) {
      try {
        await this.leaveRoom();
      } catch (e) {}
    }

    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error("loginRoom TIMEOUT after 15s"));
        }, 15000);
      });

      const loginPromise = this.zg.loginRoom(
        roomId,
        this.config.token,
        {
          userID: this.config.userId,
          userName: this.config.userName,
        },
        { userUpdate: true }
      );

      const result = await Promise.race([loginPromise, timeoutPromise]);

      if (result) {
        this.currentRoomId = roomId;
      }
      return result;
    } catch (err: any) {
      this.onError?.({ type: "join_failed", error: err });
      return false;
    }
  }

  // ================== 3. بدء النشر ==================
  async startPublishing(withVideo: boolean = false): Promise<void> {
    if (!this.zg || !this.config) {
      throw new Error("CallEngine not initialized");
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      stream.getTracks().forEach((track) => track.stop());

      this.localStream = await this.zg.createZegoStream({
        camera: {
          audio: true,
          video: withVideo,
        },
      });

      const streamId = `stream_${this.config.userId}_${Date.now()}`;
      await this.zg.startPublishingStream(streamId, this.localStream);
      this.localStream.streamID = streamId;
    } catch (err) {
      this.onError?.({ type: "publish_failed", error: err });
      throw err;
    }
  }

  // ================== 4. ربط الفيديو المحلي ==================
  attachLocalVideo(container: HTMLElement): void {
    if (!this.localStream || !container) return;

    try {
      container.innerHTML = "";
      const videoElement = document.createElement("video");
      videoElement.autoplay = true;
      videoElement.playsInline = true;
      videoElement.muted = true;

      if ("srcObject" in videoElement) {
        videoElement.srcObject = this.localStream;
      } else {
        const view = this.localStream.getVideoView();
        if (view) container.appendChild(view);
        return;
      }

      videoElement.style.width = "100%";
      videoElement.style.height = "100%";
      videoElement.style.objectFit = "cover";

      container.appendChild(videoElement);
    } catch (err) {}
  }

  // ================== 5. بدء سحب stream ==================
  async startPlaying(streamId: string, container: HTMLElement): Promise<void> {
    if (!this.zg) throw new Error("CallEngine not initialized");

    try {
      const remoteMediaStream = await this.zg.startPlayingStream(streamId);

      if (container) {
        container.innerHTML = "";
        const videoElement = document.createElement("video");
        videoElement.autoplay = true;
        videoElement.playsInline = true;

        if (remoteMediaStream instanceof MediaStream) {
          videoElement.srcObject = remoteMediaStream;
        } else if (remoteMediaStream?.getVideoView) {
          const view = remoteMediaStream.getVideoView();
          container.appendChild(view);
          return;
        }

        videoElement.style.width = "100%";
        videoElement.style.height = "100%";
        videoElement.style.objectFit = "cover";

        container.appendChild(videoElement);

        const info = this.remoteStreams.get(streamId);
        if (info) {
          info.mediaStream = remoteMediaStream;
          info.videoElement = videoElement;
        }
      }
    } catch (err) {
      this.onError?.({ type: "play_failed", error: err });
    }
  }

  async resumePlaying(streamId: string): Promise<void> {
    if (!this.zg) return;
    try {
      await this.zg.startPlayingStream(streamId);
    } catch (err) {}
  }

  stopPlaying(streamId: string): void {
    if (!this.zg) return;
    try {
      if (typeof document !== "undefined") {
        const audioElement = document.getElementById(`audio_${streamId}`);
        if (audioElement) audioElement.remove();
      }
      this.zg.stopPlayingStream(streamId);
      this.remoteStreams.delete(streamId);
    } catch (err) {}
  }

  muteMicrophone(mute: boolean): void {
    if (!this.zg || !this.localStream) return;
    try {
      this.zg.mutePublishStreamAudio(this.localStream, mute);
    } catch (err) {}
  }

  muteCamera(mute: boolean): void {
    if (!this.zg || !this.localStream) return;
    try {
      this.zg.mutePublishStreamVideo(this.localStream, mute);
    } catch (err) {}
  }

  useFrontCamera(isFront: boolean): void {
    if (!this.zg) return;
    try {
      if (typeof this.zg.useFrontCamera === "function") {
        this.zg.useFrontCamera(isFront);
      }
    } catch (err) {}
  }

  setSpeakerOn(on: boolean): void {
    if (!this.zg) return;
    try {
      this.isSpeakerOn = on;
      if (typeof this.zg.setAudioRouteToSpeaker === "function") {
        this.zg.setAudioRouteToSpeaker(on);
      }
    } catch (err) {}
  }

  getIsSpeakerOn(): boolean {
    return this.isSpeakerOn;
  }

  async leaveRoom(): Promise<void> {
    if (!this.zg) return;

    try {
      if (this.localStream) {
        try {
          if (this.localStream.streamID) {
            this.zg.stopPublishingStream(this.localStream.streamID);
          }
          this.zg.destroyStream(this.localStream);
        } catch (e) {}
        this.localStream = null;
      }

      for (const [streamId] of this.remoteStreams) {
        try {
          if (typeof document !== "undefined") {
            const audioElement = document.getElementById(`audio_${streamId}`);
            if (audioElement) audioElement.remove();
          }
          this.zg.stopPlayingStream(streamId);
        } catch (e) {}
      }
      this.remoteStreams.clear();

      if (this.currentRoomId) {
        try {
          await this.zg.logoutRoom(this.currentRoomId);
        } catch (e) {}
        this.currentRoomId = null;
      }

      this.isSpeakerOn = false;
      this.onStateChange?.("idle");
    } catch (err) {}
  }

  destroy(): void {
    if (this.zg) {
      try {
        if (this.currentRoomId) {
          try {
            this.zg.logoutRoom(this.currentRoomId);
          } catch (e) {}
          this.currentRoomId = null;
        }

        this.zg.off("roomStateChanged");
        this.zg.off("roomStreamUpdate");
        this.zg.off("roomUserUpdate");
        this.zg.off("autoplayFailed");
        this.zg.destroyEngine();
      } catch (e) {}
      this.zg = null;
    }
    this.localStream = null;
    this.remoteStreams.clear();
    this.currentRoomId = null;
    this.config = null;
    this.isSpeakerOn = false;
    this.initPromise = null;
  }

  getRemoteStreams(): RemoteStreamInfo[] {
    return Array.from(this.remoteStreams.values());
  }

  getCurrentRoomId(): string | null {
    return this.currentRoomId;
  }

  isPublishing(): boolean {
    return !!this.localStream;
  }

  isEngineReady(): boolean {
    return !!this.zg && !!this.config;
  }

  getConfig(): CallEngineConfig | null {
    return this.config;
  }

  setOnStateChange(cb: (state: CallState) => void) {
    this.onStateChange = cb;
  }

  setOnRemoteStreamAdd(cb: (streamId: string) => void) {
    this.onRemoteStreamAdd = cb;
  }

  setOnRemoteStreamRemove(cb: (streamId: string) => void) {
    this.onRemoteStreamRemove = cb;
  }

  setOnUserJoin(cb: (userId: string, userName?: string) => void) {
    this.onUserJoin = cb;
  }

  setOnUserLeave(cb: (userId: string) => void) {
    this.onUserLeave = cb;
  }

  setOnError(cb: (error: any) => void) {
    this.onError = cb;
  }

  setOnAutoplayFailed(cb: (streamId: string) => void) {
    this.onAutoplayFailed = cb;
  }

  async initForCall(appId: number, userId: string, token: string): Promise<void> {
    await this.init({
      appId,
      userId,
      userName: userId,
      token,
    });
  }

  async loginRoom(
    roomId: string,
    userId: string,
    userName: string,
    token: string
  ): Promise<boolean> {
    if (this.config) {
      this.config.userId = userId;
      this.config.userName = userName;
      this.config.token = token;
    } else {
      await this.init({ appId: 0, userId, userName, token });
    }

    return this.joinRoom(roomId);
  }

  async startPublishingForCall(streamId: string): Promise<void> {
    if (!this.zg || !this.config) {
      throw new Error("CallEngine not initialized");
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      stream.getTracks().forEach((track) => track.stop());

      this.localStream = await this.zg.createZegoStream({
        camera: {
          audio: true,
          video: false,
        },
      });

      await this.zg.startPublishingStream(streamId, this.localStream);
      this.localStream.streamID = streamId;
    } catch (err) {
      this.onError?.({ type: "publish_failed", error: err });
      throw err;
    }
  }

  /**
   * startPlayingForCall — تشغيل عنصر <audio> تلقائياً لسماع صوت الطرف الآخر
   */
  async startPlayingForCall(streamId: string, container?: HTMLElement): Promise<void> {
    if (container) {
      await this.startPlaying(streamId, container);
    } else {
      if (!this.zg) throw new Error("CallEngine not initialized");
      try {
        console.log("[CallEngine] 🎬 startPlayingForCall:", streamId);
        
        const remoteStream = await this.zg.startPlayingStream(streamId, {
          roomID: this.currentRoomId || "",
        });

        if (typeof window !== "undefined") {
          let audioElement = document.getElementById(`audio_${streamId}`) as HTMLAudioElement;
          if (!audioElement) {
            audioElement = document.createElement("audio");
            audioElement.id = `audio_${streamId}`;
            audioElement.autoplay = true;
            audioElement.playsInline = true;
            document.body.appendChild(audioElement);
          }

          if (remoteStream instanceof MediaStream) {
            audioElement.srcObject = remoteStream;
          }

          try {
            await audioElement.play();
            console.log("[CallEngine] ✅ Remote audio playing successfully");
          } catch (playErr) {
            console.warn("[CallEngine] ⚠️ Browser blocked audio autoplay, waiting for interaction");
          }
        }

        const info = this.remoteStreams.get(streamId);
        if (info) {
          info.mediaStream = remoteStream;
        } else {
          this.remoteStreams.set(streamId, {
            streamId,
            userId: "",
            mediaStream: remoteStream,
          });
        }
      } catch (err) {
        console.error("[CallEngine] ❌ startPlayingForCall failed:", err);
        this.onError?.({ type: "play_failed", error: err });
      }
    }
  }

  stopPublishing(_streamId?: string): void {
    if (!this.zg || !this.localStream) return;
    try {
      if (this.localStream.streamID) {
        this.zg.stopPublishingStream(this.localStream.streamID);
      }
      this.zg.destroyStream(this.localStream);
      this.localStream = null;
    } catch (err) {}
  }
}

export const callEngine = new CallEngine();

if (typeof window !== "undefined") {
  (window as any).__callEngine = callEngine;
}