/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/chats/[receiverId]/page.tsx
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import wsService from "@/lib/websocketService";
import { TypingBubble } from "../_components/TypingBubble";
import { MessageItem } from "../_components/MessageItem";
import { Message } from "@/types/types";
import WaveSurfer from "wavesurfer.js";
import Loader from "@/components/Loader";
import Stickers from "../_components/Stickers";
 import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

// ================= Helper: Broadcast =================
function emitChatUpdate(event: "message" | "typing" | "typing_stop" | "seen", metadata: any) {
  try {
    const bc = new BroadcastChannel("bochat-typing");
    bc.postMessage({ type: "chat_update", event, metadata });
    bc.close();
  } catch {}
}

// ================= Constants =================
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://bo-chat.space";
const REST_SEND = `${API_BASE}/sendmessage`;
const REST_HISTORY_BASE = `${API_BASE}/message`;
const TYPING_STOP_DELAY = 1500;
const LOCAL_TYPING_THROTTLE = 700;
 
export default function ChatPage() {
  const params = useParams();
  const receiverId = params?.receiverId as string | undefined;
  const { token, userId: myId, loading: authLoading } = useAuth();

  // Refs
  const myIdRef = useRef<string | null>(null);
  const receiverIdRef = useRef<string | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const localTypingTimerRef = useRef<number | null>(null);
  const bcRef = useRef<BroadcastChannel | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const waveRef = useRef<HTMLDivElement | null>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordStartRef = useRef<number>(0);
  const isCancelingRef = useRef(false);
  const sentMessageIdsRef = useRef<Set<string>>(new Set());

  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remoteTyping, setRemoteTyping] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [receiverData, setReceiverData] = useState<any>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [iBlockedHim, setIBlockedHim] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [waveData, setWaveData] = useState<number[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStopped, setRecordingStopped] = useState(false);
 
// Add receiverId
const router = useRouter();

useEffect(() => {
  if (authLoading) return;

  if (!token) {
    router.replace("/login");
  }
}, [token, authLoading, router]);
useEffect(() => {
  console.log("🔥 useEffect for saving receiverId, receiverId =", receiverId);
  if (receiverId) {
    localStorage.setItem("lastChatId", receiverId);
    console.log("✅ تم حفظ lastChatId:", receiverId);
  } else {
    console.log("❌ receiverId is undefined, cannot save");
  }
}, [receiverId]);
   useEffect(() => {
    myIdRef.current = myId;
  }, [myId]);
  useEffect(() => {
    receiverIdRef.current = receiverId ?? null;
  }, [receiverId]);

  // ================= Broadcast Channel (cross-tab) =================
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      bcRef.current = new BroadcastChannel("bochat-typing");
      bcRef.current.onmessage = (ev) => {
        const p = ev.data;
        const curMy = myIdRef.current;
        const curRec = receiverIdRef.current;
        if (!p || !curMy || !curRec) return;
        if (p.sender === curRec && p.reicever === curMy) {
          if (p.type === "typing") {
            setRemoteTyping(true);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = window.setTimeout(() => setRemoteTyping(false), TYPING_STOP_DELAY);
          } else if (p.type === "typing_stop") {
            setRemoteTyping(false);
          }
        }
      };
    } catch {
      bcRef.current = null;
    }
    return () => {
      try { bcRef.current?.close(); } catch {}
      bcRef.current = null;
    };
  }, []);

  // ================= Fetch receiver info =================
  const fetchReceiverData = useCallback(async () => {
    if (!receiverId || !token) return;
    try {
      const response = await fetch(`${API_BASE}/users/${receiverId}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      const data = await response.json();
      setReceiverData(data.userpersonaldata);
    } catch (error) {
      console.error("Failed to fetch receiver data", error);
    }
  }, [receiverId, token]);

  useEffect(() => {
    setReceiverData(null);
    fetchReceiverData();
  }, [fetchReceiverData]);

  // ================= Helper: Replace temp message with real one =================
  const replaceTempMessage = useCallback((tempId: string, realMessage: Message) => {
    setMessages((prev) =>
      prev.map((m) => (m._id === tempId ? { ...realMessage, _sendFailed: false } : m))
    );
  }, []);

  // ================= Send text message =================
  const handleSend = useCallback(async () => {
    const effMy = myIdRef.current;
    const effRec = receiverIdRef.current;
    if (!text.trim() || !effRec || !effMy || !token) return;

    const tempId = `tmp-${Date.now()}`;
    const tempMsg: Message = {
      _id: tempId,
      message: text,
      sender: effMy,
      receiver: effRec,
      timestamp: new Date().toISOString(),
      type: "text",
      fileData: undefined,
    };

    setMessages((prev) => [...prev, tempMsg]);
    setText("");
    emitChatUpdate("message", { ...tempMsg, seenBy: false });

    // Stop typing indicator immediately
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    const stopPayload = { event: "typing_stop", metadata: { sender: effMy, reicever: effRec } };
    try { wsService.send(stopPayload); } catch {}

    try {
      const res = await fetch(REST_SEND, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: tempMsg.message, receiver: effRec, sender: effMy }),
      });
      if (!res.ok) throw new Error("Send failed");
      const data = await res.json();
      // Assume server returns saved message in data.message or data
      const savedMsg = data.message || data;
      if (savedMsg && savedMsg._id) {
        replaceTempMessage(tempId, savedMsg);
      } else {
        setMessages((prev) => prev.map((m) => (m._id === tempId ? { ...m, _sendFailed: true } : m)));
      }
    } catch (err) {
      setMessages((prev) => prev.map((m) => (m._id === tempId ? { ...m, _sendFailed: true } : m)));
    }
  }, [text, token, replaceTempMessage]);

  // ================= Retry failed message =================
  const retrySend = useCallback(async (failedMsg: Message) => {
    const effMy = myIdRef.current;
    const effRec = receiverIdRef.current;
    if (!failedMsg._sendFailed || !effMy || !effRec || !token) return;

    const newTempId = `tmp-${Date.now()}`;
    const newTemp = { ...failedMsg, _id: newTempId, timestamp: new Date().toISOString(), _sendFailed: false };
    setMessages((prev) => prev.map((m) => (m._id === failedMsg._id ? newTemp : m)));

    try {
      const res = await fetch(REST_SEND, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: newTemp.message, receiver: effRec, sender: effMy }),
      });
      if (!res.ok) throw new Error("Retry failed");
      const data = await res.json();
      const savedMsg = data.message || data;
      if (savedMsg && savedMsg._id) {
        replaceTempMessage(newTempId, savedMsg);
      } else {
        setMessages((prev) => prev.map((m) => (m._id === newTempId ? { ...m, _sendFailed: true } : m)));
      }
    } catch {
      setMessages((prev) => prev.map((m) => (m._id === newTempId ? { ...m, _sendFailed: true } : m)));
    }
  }, [token, replaceTempMessage]);

  // ================= Typing logic =================
  const onInputChange = useCallback((val: string) => {
    setText(val);
    const effMy = myIdRef.current;
    const effRec = receiverIdRef.current;
    if (!effMy || !effRec) return;

    if (val.trim() === "") {
      setAudioBlob(null);
      setRecordingStopped(false);
    }

    // Throttled typing start
    if (!localTypingTimerRef.current) {
      const typingPayload = { event: "typing", metadata: { sender: effMy, reicever: effRec } };
      try {
        wsService.send(typingPayload);
        emitChatUpdate("typing", { sender: effMy, reicever: effRec });
      } catch {
        bcRef.current?.postMessage({ type: "typing", from: effMy, to: effRec });
      }
      localTypingTimerRef.current = window.setTimeout(() => {
        localTypingTimerRef.current = null;
      }, LOCAL_TYPING_THROTTLE);
    }

    // Debounced typing stop
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = window.setTimeout(() => {
      const stopPayload = { event: "typing_stop", metadata: { sender: effMy, reicever: effRec } };
      try {
        wsService.send(stopPayload);
        emitChatUpdate("typing_stop", { sender: effMy, reicever: effRec });
      } catch {
        bcRef.current?.postMessage({ type: "typing_stop", from: effMy, to: effRec });
      }
      typingTimeoutRef.current = null;
    }, TYPING_STOP_DELAY);
  }, []);

  // ================= Send seen event when chat opens =================
  useEffect(() => {
    if (!myId || !receiverId || !token) return;
    const seenPayload = { event: "seen", metadata: { sender: myId, receiver: receiverId } };
    wsService.send(seenPayload);
    emitChatUpdate("seen", { sender: myId, receiver: receiverId });
  }, [myId, receiverId, token]);

  // ================= WebSocket handler =================
  useEffect(() => {
    if (!receiverId || !myId) return;
    wsService.connect(myId);

    const fetchFullMediaMessage = async (messageId: string): Promise<Message | null> => {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const res = await fetch(`${REST_HISTORY_BASE}/${myIdRef.current}?receiver=${receiverIdRef.current}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            const fullMsg = (data?.resp?.messages || []).find((m: Message) => m._id === messageId);
            if (fullMsg && (fullMsg.fileData || fullMsg.media)) return fullMsg;
          }
        } catch {}
        await new Promise((r) => setTimeout(r, 500));
      }
      return null;
    };

    const handler = async (payload: any) => {
      // Typing
      if (payload.event === "typing") {
        const sender = payload.metadata?.sender;
        const receiver = payload.metadata?.reicever;
        if (sender === receiverIdRef.current && receiver === myIdRef.current) {
          setRemoteTyping(true);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = window.setTimeout(() => setRemoteTyping(false), TYPING_STOP_DELAY);
        }
        return;
      }

      // React (like)
      if (payload.event === "react") {
        const { messageid, sender } = payload.metadata || {};
        if (!messageid || !sender) return;
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageid && !(msg.likes || []).includes(sender)
              ? { ...msg, likes: [...(msg.likes || []), sender] }
              : msg
          )
        );
        return;
      }

      // New message
      if (payload.event === "message" && payload.metadata) {
        const meta = payload.metadata;
        if (meta.sender === myIdRef.current) return; // ignore own messages from other tabs

        if (["image", "video", "audio"].includes(meta.type)) {
          const fullMsg = await fetchFullMediaMessage(meta._id);
          if (fullMsg) {
            setMessages((prev) => (prev.some((m) => m._id === fullMsg._id) ? prev : [...prev, fullMsg]));
          }
        } else {
          setMessages((prev) => (prev.some((m) => m._id === meta._id) ? prev : [...prev, meta]));
        }
        return;
      }
    };

    const unsub = wsService.addHandler(handler);
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (localTypingTimerRef.current) clearTimeout(localTypingTimerRef.current);
      unsub();
    };
  }, [receiverId, myId, token]);

  // ================= Fetch initial message history (once) =================
  useEffect(() => {
    if (!receiverId || !myId || !token) return;
    const ctrl = new AbortController();
    setLoading(true);
    fetch(`${REST_HISTORY_BASE}/${myId}?receiver=${receiverId}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: ctrl.signal,
    })
      .then((res) => (res.ok ? res.json() : { resp: { messages: [] } }))
      .then((data) => setMessages(data?.resp?.messages ?? []))
      .catch((err) => {
        if (err.name !== "AbortError") setError("Failed to load messages");
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [receiverId, myId, token]);

  // ================= Scroll handling =================
  const handleScroll = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setShowScrollDown(!isAtBottom);
  }, []);

  useEffect(() => {
    if (!showScrollDown) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, showScrollDown]);

  // ================= Audio recording =================
  const drawWave = useCallback(() => {
    if (!analyserRef.current || !canvasRef.current) return;
    const analyser = analyserRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const BAR_COUNT = 50;
    const BAR_GAP = 3;
    const centerY = canvas.height / 2;

    const draw = () => {
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width - BAR_GAP * (BAR_COUNT - 1)) / BAR_COUNT;
      for (let i = 0; i < BAR_COUNT; i++) {
        const dataIndex = Math.floor((i / BAR_COUNT) * bufferLength);
        const value = dataArray[dataIndex];
        const barHeight = (value / 255) * (canvas.height / 2);
        const x = i * (barWidth + BAR_GAP);
        ctx.fillStyle = "#D72229";
        ctx.fillRect(x, centerY - barHeight, barWidth, barHeight);
        ctx.fillRect(x, centerY, barWidth, barHeight);
      }
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  }, []);

  const startRecording = useCallback(async () => {
    if (isRecording) return;
    setIsRecording(true);
    setRecordingStopped(false);
    setAudioBlob(null);
    recordStartRef.current = Date.now();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      drawWave();

      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        if (isCancelingRef.current) {
          audioChunksRef.current = [];
          return;
        }
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        if (blob.size === 0) return;
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setIsRecording(false);
      };
      recorder.start();
    } catch (err) {
      console.error("Microphone error:", err);
      setIsRecording(false);
      setError("لا يمكن الوصول إلى الميكروفون");
    }
  }, [isRecording, drawWave]);

  const stopRecording = useCallback(() => {
    isCancelingRef.current = false;
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    setIsRecording(false);
    setRecordingStopped(true);
    if (Date.now() - recordStartRef.current < 300) return;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const cancelRecording = useCallback(() => {
    isCancelingRef.current = true;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsRecording(false);
    setAudioBlob(null);
    setRecordingStopped(false);
    mediaRecorderRef.current = null;
    mediaStreamRef.current = null;
  }, []);

  const resetRecording = useCallback(() => {
    isCancelingRef.current = false;
    setIsRecording(false);
    setAudioBlob(null);
    setAudioUrl(null);
    setWaveData([]);
    setRecordingStopped(false);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    audioChunksRef.current = [];
  }, []);

  const blobToPureBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  const sendVoiceMessage = useCallback(async () => {
    const effMy = myIdRef.current;
    const effRec = receiverIdRef.current;
    if (!audioBlob || !effMy || !effRec || !token) return;

    const tempId = `tmp-audio-${Date.now()}`;
    const tempMsg: Message = {
      _id: tempId,
      sender: effMy,
      receiver: effRec,
      timestamp: new Date().toISOString(),
      type: "audio",
      message: "رسالة صوتية",
      media: audioBlob,
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const base64 = await blobToPureBase64(audioBlob);
      const res = await fetch(`${API_BASE}/message/send_media`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          metadata: { sender: effMy, reicever: effRec, type: "audio", waveData },
          fileData: [{ fileName: `voice-${Date.now()}.webm`, fileContent: `data:audio/webm;base64,${base64}`, mimetype: "audio/webm" }],
        }),
      });
      if (!res.ok) throw new Error("Send audio failed");
      const data = await res.json();
      if (data.data && data.data._id) {
        setMessages((prev) =>
          prev.map((m) =>
            m._id === tempId
              ? { ...m, _id: data.data._id, media: data.data.message[0], _sendFailed: false }
              : m
          )
        );
      } else {
        throw new Error("No real ID");
      }
    } catch {
      setMessages((prev) => prev.map((m) => (m._id === tempId ? { ...m, _sendFailed: true } : m)));
    }
    resetRecording();
  }, [audioBlob, token, waveData, resetRecording]);

  // ================= Image upload =================
  const sendImageFile = useCallback(async (file: File) => {
    const effMy = myIdRef.current;
    const effRec = receiverIdRef.current;
    if (!effMy || !effRec || !token) return;

    const tempId = `tmp-img-${Date.now()}`;
    const tempMsg: Message = {
      _id: tempId,
      sender: effMy,
      receiver: effRec,
      timestamp: new Date().toISOString(),
      type: "image",
      media: file,
      uploadProgress: 0,
      _optimistic: true,
    };
    setMessages((prev) => [...prev, tempMsg]);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE}/message/send_media`);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) {
        const percent = Math.round((ev.loaded / ev.total) * 100);
        setMessages((prev) => prev.map((m) => (m._id === tempId ? { ...m, uploadProgress: percent } : m)));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        sentMessageIdsRef.current.add(data.data._id);
        setMessages((prev) =>
          prev.map((m) =>
            m._id === tempId
              ? { ...m, _id: data.data._id, media: data.data.message[0], uploadProgress: undefined, _sendFailed: false }
              : m
          )
        );
      } else {
        setMessages((prev) => prev.map((m) => (m._id === tempId ? { ...m, _sendFailed: true } : m)));
      }
    };
    xhr.onerror = () => {
      setMessages((prev) => prev.map((m) => (m._id === tempId ? { ...m, _sendFailed: true } : m)));
    };
    const base64 = await blobToPureBase64(file);
    xhr.send(
      JSON.stringify({
        metadata: { sender: effMy, reicever: effRec, type: "image", clientTempId: tempId },
        fileData: [{ fileName: file.name, fileContent: `data:${file.type};base64,${base64}`, mimetype: file.type }],
      })
    );
  }, [token]);

  const handleSelectMedia = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) sendImageFile(file);
    e.target.value = "";
  }, [sendImageFile]);

  const handleSendSticker = useCallback(async (stickerUrl: string) => {
    const res = await fetch(stickerUrl);
    const blob = await res.blob();
    const file = new File([blob], `sticker-${Date.now()}.png`, { type: "image/png" });
    sendImageFile(file);
  }, [sendImageFile]);

  // ================= WaveSurfer effect for audio preview =================
  useEffect(() => {
    if (!audioBlob || !waveRef.current) return;
    if (waveSurferRef.current) waveSurferRef.current.destroy();
    const ws = WaveSurfer.create({
      container: waveRef.current,
      waveColor: "#cbd5e1",
      progressColor: "#0ea5a4",
      cursorColor: "transparent",
      height: 60,
      barWidth: 2,
      normalize: true,
    });
    waveSurferRef.current = ws;
    const url = URL.createObjectURL(audioBlob);
    ws.on("ready", () => {
      setWaveData(ws.exportPeaks(64));
    });
    ws.load(url);
    return () => {
      URL.revokeObjectURL(url);
      ws.destroy();
      waveSurferRef.current = null;
    };
  }, [audioBlob]);

  // ================= Block user =================
  const handleBlockUser = useCallback(async () => {
    if (!receiverId || !myId || !token) return;
    try {
      const res = await fetch(`${API_BASE}/block/${myId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ blockedid: receiverId }),
      });
      const data = await res.json();
      if (data.success) setIBlockedHim(true);
    } catch (error) {
      console.error("Failed to block user", error);
    }
    setShowMenu(false);
  }, [receiverId, myId, token]);

  const handleReport = useCallback(() => {
    // Implement report logic
    console.log("Report user", receiverId);
    setShowMenu(false);
  }, [receiverId]);

  // ================= Cleanup on unmount =================
  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  // ================= UI flags =================
  const isTyping = text.trim().length > 0;
  const canShowMic = !isTyping && !isRecording && !audioBlob && !recordingStopped;
  const canShowRecordingUI = !isTyping && isRecording;
  const canSendVoice = !isTyping && recordingStopped && audioBlob;
  // const shouldHideInput = iBlockedHim === true;
  const shouldHideInput = iBlockedHim === true || !myId || !receiverId;

  if (authLoading) return <div className="p-4">جاري التحميل...</div>;
  if (!myId || !token) return <div className="p-4 text-center">يرجى تسجيل الدخول</div>;

  // ================= Render =================
  return (
    <div className="relative" style={{ margin: "0 auto" }}>
      {/* Header */}
      <header className="flex items-center justify-between px-4 mb-4 pb-2">
        <div className="flex items-center justify-start gap-1.5">
          <Link href={`/profile/${receiverId}`}>
            <img src={receiverData?.img} className="w-[50px] h-[50px] rounded-[21px] object-cover" alt="avatar" />
          </Link>
          <div className="flex flex-col text-right">
            <h3 className="text-[15px] my-0">{receiverData?.name}</h3>
            <bdi className="text-xs text-[#B4B4B9]">@{receiverData?.username}</bdi>
          </div>
        </div>
        <div className="rounded-[17px] border border-[#EBEBEB] w-[40px] h-[40px] flex items-center justify-center rotate-90 cursor-pointer">
          <img src="/imgs/dots.svg" onClick={() => setShowMenu((prev) => !prev)} className="w-4 h-4" alt="dots" />
        </div>
      </header>

      {error && <div className="text-red-500 text-sm mb-2 px-4">{error}</div>}

      {/* Message List or Empty State */}
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-225px)]">
          <img src={receiverData?.private ? "/icons/privatechat.svg" : "/icons/empty.svg"} className="w-[82.5px]" alt="empty" />
          <h3 className="text-[35px]">{receiverData?.private ? "الدرج ده خاص" : "لسه مفيش كلام"}</h3>
          <p className="text-center">
            {receiverData?.private
              ? "ممكن تبعت رسالة واحدة بس وهتظهرله\nلما يوافق"
              : "لا يوجد رسائل في هذه المحادثة\nحتي الان"}
          </p>
        </div>
      ) : (
        <div
          ref={listRef}
          className="scrollbar-hidden px-5 h-[calc(100vh-225px)] overflow-y-auto flex flex-col gap-3 bg-white"
          onScroll={handleScroll}
        >
          {loading && messages.length === 0 && <Loader />}
          {messages.map((m, idx) => (
            <MessageItem
              key={m._id}
              m={m}
              myId={myId}
              onRetry={retrySend}
              index={idx}
              recieverImg={receiverData?.img}
              prevMessage={messages[idx - 1]}
            />
          ))}
          {remoteTyping && <TypingBubble mine={false} />}
          <div ref={bottomRef} />
        </div>
      )}

      {showScrollDown && (
        <button
          onClick={() => bottomRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#d7222897] text-white rounded-2xl px-4 py-2 z-[99999] text-sm border-none shadow-md cursor-pointer"
        >
          انزل تحت
        </button>
      )}

      {/* Input Area */}
      {!shouldHideInput && (
        <div className="mt-3 flex gap-2 items-center">
          {isTyping && (
            <button
              onClick={handleSend}
              className="w-[80px] h-[55px] text-[#D72229] flex items-center justify-center rounded-l-[20px] bg-[#F3F5FF]"
            >
              ➤
            </button>
          )}

          {!isTyping && canShowRecordingUI && (
            <>
              <button onClick={stopRecording}>⏹</button>
              <canvas ref={canvasRef} width={200} height={40} className="bg-gray-100 rounded-md" />
              <button onClick={cancelRecording}>✖</button>
            </>
          )}

          {!isTyping && canSendVoice && (
            <button
              onClick={sendVoiceMessage}
              className="w-[80px] h-[55px] text-[#D72229] flex items-center justify-center rounded-l-[20px] bg-[#F3F5FF]"
            >
              ➤
            </button>
          )}

          {!isTyping && canShowMic && (
            <button
              onPointerDown={startRecording}
              className="w-[80px] h-[55px] flex items-center justify-center rounded-l-[20px] bg-[#F3F5FF]"
            >
              <img src="/icons/mic.svg" alt="mic" />
            </button>
          )}

          <div className="flex bg-[#F3F5FF] w-full h-[55px] px-4 py-2 rounded-r-[20px] text-[15px]">
            <input
              value={text}
              onChange={(e) => onInputChange(e.target.value)}
              disabled={isRecording}
              placeholder={isRecording ? "تسجيل..." : "اكتب رسالة..."}
              className="w-full outline-none bg-transparent"
              onKeyDown={(e) => {
                if (e.key === "Enter" && isTyping) handleSend();
              }}
            />
            <input type="file" accept="image/*,video/*" hidden ref={fileInputRef} onChange={handleSelectMedia} />
            <div className="flex items-center gap-1">
              <button>
                <Stickers onSelectSticker={handleSendSticker} />
              </button>
              <button onClick={() => fileInputRef.current?.click()}>
                <img src="/icons/upload.svg" alt="upload" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Context Menu */}
      {showMenu && (
        <div className="absolute z-[9999] top-[50px] left-0">
          <div className="bg-black/10 rounded-[30px] shadow-xl backdrop-blur-[30px] p-4 w-[260px] flex flex-col gap-4">
            <button
              onClick={handleBlockUser}
              className="w-full bg-black/40 rounded-[20px] py-2 px-4 text-right flex hover:bg-black/60 items-center gap-2 cursor-pointer transition"
            >
              <div className="h-[45px] w-[45px] bg-[#D72229] flex items-center justify-center rounded-full">
                <img src="/icons/block.svg" className="w-5 h-5 invert-0 transform rotate-[160deg]" alt="block" />
              </div>
              <span className="text-white">حجب</span>
            </button>
            <button
              onClick={handleReport}
              className="w-full bg-black/40 rounded-[20px] py-2 px-4 text-right flex hover:bg-black/60 items-center gap-2 cursor-pointer transition"
            >
              <div className="h-[45px] w-[45px] bg-[#D72229] flex items-center justify-center rounded-full">
                <img src="/icons/flag.svg" className="w-4 h-4 filter invert" alt="report" />
              </div>
              <span className="text-white">إبلاغ</span>
            </button>
            <button className="w-full bg-black/40 rounded-[20px] py-2 px-4 text-right flex hover:bg-black/60 items-center gap-2 cursor-pointer transition">
              <Link href="/chats" className="flex items-center gap-2 w-full">
                <div className="h-[45px] w-[45px] bg-[#D72229] flex items-center justify-center rounded-full">
                  <img src="/icons/close.svg" className="w-4 h-4 invert brightness-0" alt="close" />
                </div>
                <span className="text-white">اقفل المحادثة</span>
              </Link>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
