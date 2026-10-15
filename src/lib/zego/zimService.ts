

// src/lib/zego/zimService.ts

export type InvitationType = "audio" | "video";

export interface CallInvitation {
  callID: string;
  callerID: string;
  callerName: string;
  callerUsername?: string;
  callerAvatar?: string;
  type: InvitationType;
  roomID: string;
  timestamp: number;
}

export interface CallResponseInfo {
  callID: string;
  payeeID?: string;
  extendedData?: string;
}

// ============================================================
// Helpers
// ============================================================

function stringToUint8Array(str: string): Uint8Array {
  const utf8 = unescape(encodeURIComponent(str));
  const arr = new Uint8Array(utf8.length);
  for (let i = 0; i < utf8.length; i++) {
    arr[i] = utf8.charCodeAt(i);
  }
  return arr;
}

function uint8ArrayToString(arr: Uint8Array | number[]): string {
  const bytes = arr instanceof Uint8Array ? arr : new Uint8Array(arr);
  let str = "";
  for (let i = 0; i < bytes.length; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return decodeURIComponent(escape(str));
}

// ============================================================
// ZimService
// ============================================================

class ZimService {
  private zim: any = null;
  private ZIM: any = null;
  private config: {
    appId: number;
    userId: string;
    userName: string;
    token: string;
  } | null = null;

  private onInvitationReceived?: (invitation: CallInvitation) => void;
  private onInvitationCancelled?: (callID: string) => void;
  private onInvitationTimeout?: (callID: string) => void;
  private onInvitationAccepted?: (info: CallResponseInfo) => void;
  private onInvitationRejected?: (info: CallResponseInfo) => void;

  async init(config: {
    appId: number;
    userId: string;
    userName: string;
    token: string;
  }): Promise<boolean> {
    if (typeof window === "undefined") return false;
    if (this.zim) return true;

    this.config = config;

    try {
      const zimModule = await import("zego-zim-web");
      this.ZIM = zimModule.ZIM;
      if (!this.ZIM) return false;

      this.zim = this.ZIM.create({ appID: config.appId });

      console.log("🔍 [DEBUG] sendMessage?", typeof this.zim.sendMessage);
      console.log("🔍 [DEBUG] sendPeerMessage?", typeof this.zim.sendPeerMessage);

      // 1) استقبال دعوة
      this.zim.on("callInvitationReceived", (zim: any, info: any) => {
        console.log("📥 [callInvitationReceived] RAW:", info);
        let extendedData: any = {};
        try {
          if (info.extendedData) {
            extendedData =
              typeof info.extendedData === "string"
                ? JSON.parse(info.extendedData)
                : info.extendedData;
          }
        } catch (e) {}

        const invitation: CallInvitation = {
          callID: info.callID,
          callerID: info.callerID || info.inviter || "",
          callerName: info.callerName || extendedData.callerName || "مستخدم",
          callerUsername: extendedData.callerUsername,
          callerAvatar: extendedData.callerAvatar,
          type: (info.type === 1 || extendedData.type === "video"
            ? "video"
            : "audio") as InvitationType,
          roomID: extendedData.roomID || "",
          timestamp: Date.now(),
        };
        console.log("📥 [callInvitationReceived] Parsed:", invitation);
        this.onInvitationReceived?.(invitation);
      });

      // 2) إلغاء الدعوة
      this.zim.on("callInvitationCancelled", (zim: any, info: any) => {
        console.log("📥 [callInvitationCancelled] RAW:", info);
        this.onInvitationCancelled?.(info.callID);
      });

      // 3) انتهاء وقت الدعوة
      this.zim.on("callInvitationTimeout", (zim: any, info: any) => {
        console.log("📥 [callInvitationTimeout] RAW:", info);
        this.onInvitationTimeout?.(info.callID);
      });

      // 4) القبول (احتياطي)
      this.zim.on("callInviteAccepted", (zim: any, info: any) => {
        console.log("📥 [callInviteAccepted] RAW:", info);
        this.onInvitationAccepted?.({
          callID: info.callID,
          payeeID: info.payeeID || info.callee,
          extendedData: info.extendedData,
        });
      });

      // 5) الرفض (احتياطي)
      this.zim.on("callInviteRejected", (zim: any, info: any) => {
        console.log("📥 [callInviteRejected] RAW:", info);
        this.onInvitationRejected?.({
          callID: info.callID,
          payeeID: info.payeeID || info.callee,
          extendedData: info.extendedData,
        });
      });

      // 6) peerMessageReceived
      this.zim.on("peerMessageReceived", (zim: any, data: any) => {
        console.log("📥 [peerMessageReceived] RAW DATA:", JSON.stringify(data, null, 2));

        try {
          for (const msg of data.messageList || []) {
            console.log("📥 [peerMessageReceived] msg:", msg, "type:", msg.type);

            if (msg.type === 2 && msg.message) {
              // Command Message (Uint8Array)
              try {
                const jsonText = uint8ArrayToString(msg.message);
                console.log("📥 Decoded (Command):", jsonText);
                const parsed = JSON.parse(jsonText);

                if (parsed.action === "REJECT_CALL") {
                  console.log("📥 → REJECT_CALL");
                  this.onInvitationRejected?.({ callID: parsed.callID });
                } else if (parsed.action === "ACCEPT_CALL") {
                  console.log("📥 → ACCEPT_CALL");
                  this.onInvitationAccepted?.({
                    callID: parsed.callID,
                    extendedData: parsed.extendedData,
                  });
                }
              } catch (e) {
                console.error("❌ Decode Command error:", e);
              }
            } else if (msg.type === 1 && msg.message) {
              // Text Message (string)
              try {
                const jsonText =
                  typeof msg.message === "string"
                    ? msg.message
                    : uint8ArrayToString(msg.message);
                console.log("📥 Decoded (Text):", jsonText);
                const parsed = JSON.parse(jsonText);

                if (parsed.action === "REJECT_CALL") {
                  console.log("📥 → REJECT_CALL");
                  this.onInvitationRejected?.({ callID: parsed.callID });
                } else if (parsed.action === "ACCEPT_CALL") {
                  console.log("📥 → ACCEPT_CALL");
                  this.onInvitationAccepted?.({
                    callID: parsed.callID,
                    extendedData: parsed.extendedData,
                  });
                }
              } catch (e) {
                console.error("❌ Decode Text error:", e);
              }
            }
          }
        } catch (e) {
          console.error("❌ [peerMessageReceived] error:", e);
        }
      });

      await this.zim.login(
        { userID: config.userId, userName: config.userName },
        config.token
      );
      console.log("✅ ZIM login success");
      return true;
    } catch (err) {
      console.error("❌ zimService init error:", err);
      this.zim = null;
      return false;
    }
  }

  // ================== إرسال إشارة ==================
  async sendSignalMessage(
    targetUserId: string,
    action: string,
    callID: string,
    extendedData?: string
  ): Promise<boolean> {
    console.log(`📤 [sendSignalMessage] START → ${action} → ${targetUserId}`);

    if (!this.zim) {
      console.error("❌ zim is null");
      return false;
    }

    if (typeof this.zim.sendMessage !== "function") {
      console.error("❌ sendMessage not available");
      return false;
    }

    const payload = JSON.stringify({ action, callID, extendedData });
    const uint8Array = stringToUint8Array(payload);
    const commandMessage = { type: 2, message: uint8Array };
    const textMessage = { type: 1, message: payload };

    // محاولة 1: Command + config {priority:1}
    try {
      console.log("📤 Trying: sendMessage(cmd, user, 0, {priority:1})");
      const result = await this.zim.sendMessage(commandMessage, targetUserId, 0, { priority: 1 });
      console.log("✅ SUCCESS (cmd + priority):", result);
      return true;
    } catch (e: any) {
      console.warn("⚠️ Failed:", e?.code, e?.message);
    }

    // محاولة 2: Command + config {}
    try {
      console.log("📤 Trying: sendMessage(cmd, user, 0, {})");
      const result = await this.zim.sendMessage(commandMessage, targetUserId, 0, {});
      console.log("✅ SUCCESS (cmd + empty):", result);
      return true;
    } catch (e: any) {
      console.warn("⚠️ Failed:", e?.code, e?.message);
    }

    // محاولة 3: Command بدون config
    try {
      console.log("📤 Trying: sendMessage(cmd, user, 0)");
      const result = await this.zim.sendMessage(commandMessage, targetUserId, 0);
      console.log("✅ SUCCESS (cmd no config):", result);
      return true;
    } catch (e: any) {
      console.warn("⚠️ Failed:", e?.code, e?.message);
    }

    // محاولة 4: Text + config {priority:1}
    try {
      console.log("📤 Trying: sendMessage(text, user, 0, {priority:1})");
      const result = await this.zim.sendMessage(textMessage, targetUserId, 0, { priority: 1 });
      console.log("✅ SUCCESS (text + priority):", result);
      return true;
    } catch (e: any) {
      console.warn("⚠️ Failed:", e?.code, e?.message);
    }

    // محاولة 5: Text + config {}
    try {
      console.log("📤 Trying: sendMessage(text, user, 0, {})");
      const result = await this.zim.sendMessage(textMessage, targetUserId, 0, {});
      console.log("✅ SUCCESS (text + empty):", result);
      return true;
    } catch (e: any) {
      console.warn("⚠️ Failed:", e?.code, e?.message);
    }

    // محاولة 6: Text بدون config
    try {
      console.log("📤 Trying: sendMessage(text, user, 0)");
      const result = await this.zim.sendMessage(textMessage, targetUserId, 0);
      console.log("✅ SUCCESS (text no config):", result);
      return true;
    } catch (e: any) {
      console.warn("⚠️ Failed:", e?.code, e?.message);
    }

    console.error(`❌ [sendSignalMessage] All attempts failed for: ${action}`);
    return false;
  }

  // ================== دعوة ==================
  async sendInvitation(params: {
    targetUserId: string;
    targetUserName: string;
    callType: InvitationType;
    roomID: string;
    callerAvatar?: string;
    callerUsername?: string;
  }): Promise<{ success: boolean; callID?: string }> {
    if (!this.zim || !this.config) return { success: false };

    try {
      const callees = [params.targetUserId];
      const config = {
        timeout: 60,
        type: params.callType === "video" ? 1 : 0,
        extendedData: JSON.stringify({
          roomID: params.roomID,
          callerName: this.config.userName,
          callerUsername: params.callerUsername || "",
          callerAvatar: params.callerAvatar || "",
          type: params.callType,
        }),
      };

      const result = await this.zim.callInvite(callees, config);
      console.log("✅ [sendInvitation] success:", result);
      return { success: true, callID: result.callID };
    } catch (err) {
      console.error("❌ [sendInvitation] error:", err);
      return { success: false };
    }
  }

  async acceptInvitation(callID: string): Promise<boolean> {
    if (!this.zim) return false;
    try {
      await this.zim.callAccept(callID, { extendedData: "" });
      return true;
    } catch (err) {
      console.error("❌ acceptInvitation:", err);
      return false;
    }
  }

  async rejectInvitation(callID: string): Promise<boolean> {
    if (!this.zim) return false;
    try {
      await this.zim.callReject(callID, { extendedData: "" });
      return true;
    } catch (err) {
      console.error("❌ rejectInvitation:", err);
      return false;
    }
  }

  async cancelInvitation(callID: string, targetUserId: string): Promise<boolean> {
    if (!this.zim) return false;
    try {
      await this.zim.callCancel([targetUserId], callID, { extendedData: "" });
      return true;
    } catch (err) {
      console.error("❌ cancelInvitation:", err);
      return false;
    }
  }

  setOnInvitationReceived(cb: (invitation: CallInvitation) => void) { this.onInvitationReceived = cb; }
  setOnInvitationCancelled(cb: (callID: string) => void) { this.onInvitationCancelled = cb; }
  setOnInvitationTimeout(cb: (callID: string) => void) { this.onInvitationTimeout = cb; }
  setOnInvitationAccepted(cb: (info: CallResponseInfo) => void) { this.onInvitationAccepted = cb; }
  setOnInvitationRejected(cb: (info: CallResponseInfo) => void) { this.onInvitationRejected = cb; }

  async destroy(): Promise<void> {
    if (this.zim) {
      try {
        await this.zim.logout();
        this.zim.destroy();
      } catch (e) {}
      this.zim = null;
    }
  }
}

export const zimService = new ZimService();

// ✅ ضيفه على window عشان تقدر توصل له من الـ Console
if (typeof window !== "undefined") {
  (window as any).__zimService = zimService;
}