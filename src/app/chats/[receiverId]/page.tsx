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

function emitChatUpdate(event: "message" | "typing" | "seen", metadata: any) {
  try {
    const bc = new BroadcastChannel("bochat-typing");
    bc.postMessage({
      type: "chat_update",
      event,
      metadata,
    });
    bc.close();
  } catch {}
}

export default function ChatPage() {
  const params = useParams();
  const receiverId = params?.receiverId as string | undefined;
  const waveRef = useRef<HTMLDivElement | null>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const [myId, setMyId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remoteTyping, setRemoteTyping] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const myIdRef = useRef<string | null>(null);
  const receiverIdRef = useRef<string | null>(null);
  const sentMessageIdsRef = useRef<Set<string>>(new Set());
  const typingTimeoutRef = useRef<number | null>(null); 
  const localTypingTimerRef = useRef<number | null>(null);
  const bcRef = useRef<BroadcastChannel | null>(null);




  useEffect(() => {
    myIdRef.current = myId;
    if (!myId && typeof window !== "undefined") {
      const stored = localStorage.getItem("userid") ?? localStorage.getItem("userId");
      if (stored) setMyId(stored);
    }
  }, [myId]);

  useEffect(() => {
    receiverIdRef.current = receiverId ?? null;
  }, [receiverId]);
  // 2. Broadcast Channel (Setup once)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      bcRef.current = new BroadcastChannel("bochat-typing");
      bcRef.current.onmessage = (ev) => {
        const p = ev.data;
        const curMy = myIdRef.current;
        const curRec = receiverIdRef.current;
        
        if (!p || !curMy || !curRec) return;

        // Logic matches Dart: Sender is the other person, To is me (or broadcast)
        if (p.sender === curRec && p.reicever === curMy) {
          if (p.type === "typing") {
              setRemoteTyping(true);
              if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
              typingTimeoutRef.current = window.setTimeout(
                () => setRemoteTyping(false),
                TYPING_STOP_DELAY
              );
            }
            else if (p.type === "typing_stop") {
          }
        }
      };
    } catch (e) { bcRef.current = null; }

    return () => {
      try { bcRef.current?.close(); } catch {}
      bcRef.current = null;
    };
  }, []);


  // Helper: Poll/Replace saved message (Optimistic UI Confirmation)
  const fetchAndReplaceSavedMessage = useCallback(async (tempId: string, tempMsg: Message) => {
    if (tempMsg.type !== "text" && tempMsg.type !== "audio") return;
    if (!myIdRef.current || !receiverIdRef.current) return;
    const maxAttempts = 6;
    
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const res = await fetch(`${REST_HISTORY_BASE}/${myIdRef.current}?receiver=${receiverIdRef.current}`, {
          headers: { Accept: "application/json", Authorization: `Bearer ${STATIC_TOKEN}` },
        });
        if (res.ok) {
          const data = await res.json();
          const msgs: Message[] = data?.resp?.messages ?? [];
          // Find the message that matches content, sender, receiver (but has a real ID)
          const saved = msgs.slice().reverse().find(m =>
            m.sender === tempMsg.sender &&
            m.receiver === tempMsg.receiver &&
            m.type === "audio"
          );
          if (saved) {
            setMessages(prev => {
              // Remove temp if real exists or replace temp with real
              const exists = prev.some(p => p._id === saved._id);
              if (exists) return prev.filter(p => p._id !== tempId);
              return prev.map(p => (p._id === tempId ? saved : p));
            });
            bcRef.current?.postMessage({
              type: "chat_update",
              event: "message",
              metadata: {
                ...tempMsg,
                sender: myId,
                receiver: receiverId,
                seenBy: false,
              },
            });
            return;
          }
        }
      } catch (err) {}
      await new Promise(r => setTimeout(r, 700));
    }
    // Mark as failed if never found
    setMessages(prev => prev.map(m => (m._id === tempId ? { ...m, _sendFailed: true } : m)));
  }, []);
// bcRef.current?.postMessage({
//   type: "chat_update",
//   event: "seen",
//   metadata: {
//     sender: receiverId,
//   },
// });
  // -- Event Handlers --

  const handleSend = async () => {
    const effMy = myIdRef.current;
    const effRec = receiverIdRef.current;
    if (!text.trim() || !effRec || !effMy) return;

    const tempId = "tmp-" + Date.now();
    const tempMsg: Message = {
      _id: tempId,
      message: text,
      sender: effMy,
      receiver: effRec,
      timestamp: new Date().toISOString(),
      type: "text",
      fileData: undefined
    };

    setMessages(prev => [...prev, tempMsg]);
    setText("");
    emitChatUpdate("message", {
      ...tempMsg,
      sender: effMy,
      receiver: effRec,
      seenBy: false,
    });
    // Stop typing indicator immediately upon send
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    const stopPayload = {
        event: "typing_stop",
        metadata: { from: effMy, reicever: effRec, receiver: effRec, isTyping: false }
    };
    try { wsService.send(stopPayload); } catch(e){}
    try {
      const res = await fetch(REST_SEND, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${STATIC_TOKEN}` },
        body: JSON.stringify({ message: tempMsg.message, receiver: effRec, sender: effMy }),
      });
      if (!res.ok) throw new Error("Send failed");
      wsService.send(payload);
      await fetchAndReplaceSavedMessage(tempId, tempMsg);
      
      // Notify via WS (Optional if server broadcasts automatically)
      try {
          wsService.send({ type: "notify_new_message", from: effMy, to: effRec, tempId, preview: tempMsg.message });
      } catch(e){}
    } catch (err) {
      setMessages(prev => prev.map(m => (m._id === tempId ? { ...m, _sendFailed: true } : m)));
    }
  };

  const retrySend = async (m: Message) => {
    const effMy = myIdRef.current;
    const effRec = receiverIdRef.current;
    if (!m._sendFailed || !effMy || !effRec) return;

    // Create new temp ID for retry
    const newTempId = "tmp-" + Date.now();
    const newTemp = { ...m, _id: newTempId, timestamp: new Date().toISOString(), _sendFailed: false };
    
    setMessages(prev => prev.map(x => (x._id === m._id ? newTemp : x)));

    try {
      const res = await fetch(REST_SEND, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${STATIC_TOKEN}` },
        body: JSON.stringify({ message: newTemp.message, receiver: effRec, sender: effMy }),
      });
      if (!res.ok) throw new Error("Retry failed");
      await fetchAndReplaceSavedMessage(newTempId, newTemp);
    } catch (err) {
      setMessages(prev => prev.map(x => (x._id === newTempId ? { ...x, _sendFailed: true } : x)));
    }
  };

  // --- TYPING LOGIC (EXACTLY AS REQUESTED) ---
  const onInputChange = (val: string) => {
    setText(val);

    const effMy = myIdRef.current ?? (typeof window !== "undefined" ? (localStorage.getItem("userid") ?? localStorage.getItem("userId")) : null);
    const effRec = receiverIdRef.current;

    // Fallback for local tabs
    if (!effMy || !effRec) {
      if (bcRef.current) bcRef.current.postMessage({ type: "typing", from: effMy, to: effRec });
      return;
    }
    if (val.trim() === "") {
    // رجّع للوضع الطبيعي
      setAudioBlob(null);
      setRecordingStopped(false);
    }
    // 1. Send Typing Event (Throttled)
    if (!localTypingTimerRef.current) {
      const typingPayload = {
        event: "typing",
        metadata: {
          sender: effMy,
          reicever: effRec,
        }
      };

      try {
        wsService.send(typingPayload);
        emitChatUpdate("typing", {
          sender: effMy,
          reicever: effRec,
        });
      } catch (err) {
        if (bcRef.current) bcRef.current.postMessage({ type: "typing", from: effMy, to: effRec });
      }

      // Throttle next send
      localTypingTimerRef.current = window.setTimeout(() => {
        localTypingTimerRef.current = null;
      }, LOCAL_TYPING_THROTTLE);
    }

    // 2. Schedule Stop Event (Debounced)
    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }

typingTimeoutRef.current = window.setTimeout(() => {


  try {
  } catch (err) {
    if (bcRef.current)
      bcRef.current.postMessage({ type: "typing_stop", from: effMy, to: effRec });
  }

  typingTimeoutRef.current = null;
}, TYPING_STOP_DELAY);

  };

  // -- Effects: WebSocket & History --
  const fetchMessageById = async (messageId: string, retries = 5): Promise<Message | null> => {
    for (let i = 0; i < retries; i++) {
      const res = await fetch(
        `${REST_HISTORY_BASE}/${myIdRef.current}?receiver=${receiverIdRef.current}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${STATIC_TOKEN}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        const messages: Message[] = data?.resp?.messages ?? [];
        const msg = messages.find(m => m._id === messageId);

        // 👇 الشرط الحاسم
        if (msg && (msg.fileData || msg.media || msg.file)) {
          return msg;
        }
      }

      // انتظر شوية قبل retry
      await new Promise(r => setTimeout(r, 700));
    }

    return null;
  };


  // 1. WebSocket Handler
  useEffect(() => {
    
    if (!receiverId || !myId) return;
    
    wsService.connect(myId);

      const handler = async (payload: any) => {

        // ① TYPING (أول حاجة)
// ================= TYPING =================
if (payload.event === "typing") {
  const sender = payload.metadata?.sender;
  const receiver = payload.metadata?.reicever;

  // لو الطرف التاني هو اللي بيكتبلي
  if (
    sender === receiverIdRef.current &&
    receiver === myIdRef.current
  ) {
    setRemoteTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = window.setTimeout(() => {
      setRemoteTyping(false);
    }, TYPING_STOP_DELAY);
  }

  return; // ⛔ مهم جدًا
}
bcRef.current?.postMessage({
  type: "chat_update",
  event: "typing",
  metadata: {
    sender: myId,
    reicever: receiverId,
  },
});

        // ================= REACT (LIKE) =================
if (payload.event === "react") {
  const { messageid, sender } = payload.metadata || {};

  if (!messageid || !sender) return;

  setMessages(prev =>
    prev.map(msg => {
      if (msg._id !== messageid) return msg;

      const likes = msg.likes || [];

      // 🔒 منع التكرار
      if (likes.includes(sender)) return msg;

      return {
        ...msg,
        likes: [...likes, sender],
      };
    })
  );

  return; // ⛔ مهم
}

        // ② MEDIA MESSAGE (هنا بالظبط 👈)
        if (
          payload.event === "message" &&
          (payload.metadata?.type === "image" ||
          payload.metadata?.type === "video" ||
          payload.metadata?.type === "audio")
        ) {
          const meta = payload.metadata;

          if (meta.sender === myIdRef.current) {
            return;
          }

          const messageId = meta._id;
          if (!messageId) return;

          const fullMessage = await fetchMessageById(messageId);
          if (!fullMessage) return;

          setMessages(prev => {
            if (prev.some(m => m._id === fullMessage._id)) return prev;
            return [...prev, fullMessage];
          });

          return;
        }

        // ③ TEXT MESSAGE (آخر حاجة)
        if (
          payload.event === "message" &&
          payload.metadata?.type === "text" &&
          payload.metadata?.message
        ) {
          const meta = payload.metadata;

          setMessages(prev => {
            if (prev.some(m => m._id === meta._id)) return prev;
            return [...prev, meta];
          });

          return;
        }
      };
    const unsub = wsService.addHandler(handler);
    return () => {
      if (typingTimeoutRef.current) window.clearTimeout(typingTimeoutRef.current);
      if (localTypingTimerRef.current) window.clearTimeout(localTypingTimerRef.current);
      unsub();
    };
  }, [receiverId, myId]);
  // 2. Fetch History (REST)
  useEffect(() => {
    if (!receiverId || !myId) return;
    const ctrl = new AbortController();
    setLoading(true);
    
    fetch(`${REST_HISTORY_BASE}/${myId}?receiver=${receiverId}`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${STATIC_TOKEN}` },
      signal: ctrl.signal,
    })
    .then(res => res.ok ? res.json()  : { resp: { messages: [] } })
    .then(data => {
      setMessages(data?.resp?.messages ?? []);
      
        
    })
    .catch(err => {
        if (err.name !== "AbortError") setError("Failed to load");
    })
    .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, [receiverId, myId]);

  // 3. Polling Fallback (Kept as requested)
  useEffect(() => {
    if (!receiverId || !myId) return;
    let timerId: number;
    const poll = async () => {
        try {
            const res = await fetch(`${REST_HISTORY_BASE}/${myId}?receiver=${receiverId}`, {
                headers: { Accept: "application/json", Authorization: `Bearer ${STATIC_TOKEN}` },
            });
            if (!res.ok) return;
            const data = await res.json();
            const msgs: Message[] = data?.resp?.messages ?? [];
            // console.log("Polling fetched messages:", msgs);
            setMessages(prev => {
                const ids = new Set(prev.map(m => m._id));
                const newOnes = msgs.filter(m =>
                  m.sender !== myId && !ids.has(m._id)
                );

                if (newOnes.length) {
                  // 🔥 ابعت آخر رسالة لليست
                  emitChatUpdate("message", newOnes[newOnes.length - 1]);
                }

                return newOnes.length ? [...prev, ...newOnes] : prev;
            });
        } catch(e){}
    };
    
    timerId = window.setInterval(poll, 1500);
    return () => clearInterval(timerId);
  }, [receiverId, myId]);

  // 4. Auto-scroll
  useEffect(() => {
    if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, remoteTyping]);


  const drawWave = () => {
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

      const barWidth =
        (canvas.width - BAR_GAP * (BAR_COUNT - 1)) / BAR_COUNT;

      for (let i = 0; i < BAR_COUNT; i++) {
        const dataIndex = Math.floor((i / BAR_COUNT) * bufferLength);
        const value = dataArray[dataIndex];

        const barHeight = (value / 255) * (canvas.height / 2);

        const x = i * (barWidth + BAR_GAP);

        ctx.fillStyle = "#D72229";

        // 🔼 فوق
        ctx.fillRect(
          x,
          centerY - barHeight,
          barWidth,
          barHeight
        );

        // 🔽 تحت
        ctx.fillRect(
          x,
          centerY,
          barWidth,
          barHeight
        );
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
  };



  // ================= AUDIO =================
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordStartRef = useRef<number>(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [waveData, setWaveData] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const startRecording = async () => {
    if (isRecording) return;
    setIsRecording(true);
    setRecordingStopped(false);
    setAudioBlob(null);
    recordStartRef.current = Date.now();

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaStreamRef.current = stream;

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyserRef.current = analyser;

    drawWave();

    const recorder = new MediaRecorder(stream, {
      mimeType: "audio/webm;codecs=opus",
    });

    mediaRecorderRef.current = recorder;
    audioChunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

  recorder.onstop = () => {

    // ⛔ لو Cancel → تجاهل
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
  };

  const stopRecording = () => {
    isCancelingRef.current = false;

    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current?.stop();
    mediaStreamRef.current?.getTracks().forEach(t => t.stop());

    setIsRecording(false);
    setRecordingStopped(true); 
    // 🛑 لو لسه بدأ التسجيل من أقل من 300ms
    if (Date.now() - recordStartRef.current < 300) {
      return;
    }

    mediaRecorderRef.current.stop();

    mediaStreamRef.current?.getTracks().forEach(t => t.stop());
    mediaStreamRef.current = null;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const resetRecording = () => {
    // 🔥 reset كل حاجة ليها علاقة بالصوت
    isCancelingRef.current = false;

    setIsRecording(false);
    setAudioBlob(null);
    setAudioUrl(null);
    setWaveData([]);
    setRecordingStopped(false); // ←←← السطر الحاسم

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    audioChunksRef.current = [];
  };



  const blobToPureBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const res = reader.result as string;
      const base64 = res.split(",")[1]; // 👈 مهم
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

  const sendVoiceMessageREST = async () => {
    const effMy = myIdRef.current;
    const effRec = receiverIdRef.current;

    if (!audioBlob || !effMy || !effRec) return;

    // optimistic UI
    const tempId = "tmp-audio-" + Date.now();
    const tempMsg: Message = {
      _id: tempId,
      sender: effMy,
      receiver: effRec,
      timestamp: new Date().toISOString(),
      type: "audio",
      message: "رسالة صوتية",
      media: audioBlob, 
    };


    setMessages(prev => [...prev, tempMsg]);

    try {
      const base64 = await blobToPureBase64(audioBlob);

      const res = await fetch("https://bo-chat.space/message/send_media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${STATIC_TOKEN}`,
        },
        body: JSON.stringify({
          metadata: {
            sender: effMy,
            reicever: effRec,
            replyTo: null,
            type: "audio",
            waveData,
          },
          fileData: [
            {
              fileName: `voice-${Date.now()}.webm`,
              fileContent: `data:audio/webm;base64,${base64}`,
              mimetype: "audio/webm",
            },
          ],
        }),
      });

      if (!res.ok) throw new Error("Send audio failed");

      const data = await res.json();

      // replace temp with real
      setMessages(prev =>
        prev.map(m =>
          m._id === tempId
            ? {
                ...m,
                _id: data.data._id,
                media: data.data.message[0], // URL الحقيقي
                type: "audio",
              }
            : m
        )
      );
    } catch (e) {
      setMessages(prev =>
        prev.map(m =>
          m._id === tempId ? { ...m, _sendFailed: true } : m
        )
      );
    }

    resetRecording();
  };

  const handleSelectMedia = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    const effMy = myIdRef.current;
    const effRec = receiverIdRef.current;
    if (file) sendImageFile(file);

    if (!file || !effMy || !effRec) return;
    if (!file.type.startsWith("image/")) return;

    const tempId = "tmp-img-" + Date.now();

    const tempMsg: Message = {
      _id: tempId,
      sender: effMy,
      receiver: effRec,
      timestamp: new Date().toISOString(),
      type: "image",
      media: file,
      uploadProgress: 0,

      // ⭐ مهم جدًا
      _optimistic: true,
      clientTempId: tempId,
    };

    setMessages(prev => [...prev, tempMsg]);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://bo-chat.space/message/send_media");

    xhr.setRequestHeader("Authorization", `Bearer ${STATIC_TOKEN}`);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.upload.onprogress = (ev) => {
      if (!ev.lengthComputable) return;
      const percent = Math.round((ev.loaded / ev.total) * 100);

      setMessages(prev =>
        prev.map(m =>
          m._id === tempId
            ? { ...m, uploadProgress: percent }
            : m
        )
      );
    };

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      const data = JSON.parse(xhr.responseText);

      // ⭐ سجّل إن الرسالة دي أنا اللي باعتها
      sentMessageIdsRef.current.add(data.data._id);

      setMessages(prev =>
        prev.map(m =>
          m._id === tempId
            ? {
                ...m,
                _id: data.data._id,
                media: data.data.message[0],
                uploadProgress: undefined,
              }
            : m
        )
      );
    } else {
      fail();
    }
  };


    xhr.onerror = fail;

    function fail() {
      setMessages(prev =>
        prev.map(m =>
          m._id === tempId
            ? { ...m, _sendFailed: true }
            : m
        )
      );
    }

    // 3️⃣ send payload
    blobToPureBase64(file).then(base64 => {
      xhr.send(
        JSON.stringify({
          metadata: {
            sender: effMy,
            reicever: effRec,
            replyTo: null,
            type: "image",

            // ⭐ ابعت tempId للسيرفر (لو حابب تستخدمه)
            clientTempId: tempId,
          },
          fileData: [
            {
              fileName: file.name,
              fileContent: `data:${file.type};base64,${base64}`,
              mimetype: file.type,
            },
          ],
        })
      );
    });

    e.target.value = "";
  };

  const sendImageFile = (file: File) => {
  const effMy = myIdRef.current;
  const effRec = receiverIdRef.current;
  if (!file || !effMy || !effRec) return;

  const tempId = "tmp-img-" + Date.now();

  const tempMsg: Message = {
    _id: tempId,
    sender: effMy,
    receiver: effRec,
    timestamp: new Date().toISOString(),
    type: "image",
    media: file,
    uploadProgress: 0,
    _optimistic: true,
    clientTempId: tempId,
  };

  setMessages(prev => [...prev, tempMsg]);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "https://bo-chat.space/message/send_media");
  xhr.setRequestHeader("Authorization", `Bearer ${STATIC_TOKEN}`);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.upload.onprogress = (ev) => {
    if (!ev.lengthComputable) return;
    const percent = Math.round((ev.loaded / ev.total) * 100);

    setMessages(prev =>
      prev.map(m =>
        m._id === tempId ? { ...m, uploadProgress: percent } : m
      )
    );
  };

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      const data = JSON.parse(xhr.responseText);

      setMessages(prev =>
        prev.map(m =>
          m._id === tempId
            ? {
                ...m,
                _id: data.data._id,
                media: data.data.message[0],
                uploadProgress: undefined,
              }
            : m
        )
      );
    } else fail();
  };

  xhr.onerror = fail;

  function fail() {
    setMessages(prev =>
      prev.map(m =>
        m._id === tempId ? { ...m, _sendFailed: true } : m
      )
    );
  }

  blobToPureBase64(file).then(base64 => {
    xhr.send(
      JSON.stringify({
        metadata: {
          sender: effMy,
          reicever: effRec,
          type: "image",
          clientTempId: tempId,
        },
        fileData: [
          {
            fileName: file.name,
            fileContent: `data:${file.type};base64,${base64}`,
            mimetype: file.type,
          },
        ],
      })
    );
  });
};

const handleSendSticker = async (stickerUrl: string) => {
  const effMy = myIdRef.current;
  const effRec = receiverIdRef.current;
  if (!effMy || !effRec) return;

  const res = await fetch(stickerUrl);
  const blob = await res.blob();

  const file = new File(
    [blob],
    `sticker-${Date.now()}.png`,
    { type: "image/png" }
  );

  sendImageFile(file);
};

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!audioBlob || !waveRef.current) return;

    if (waveSurferRef.current) {
      waveSurferRef.current.destroy();
    }

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


  // Get user data
  const [receiverData, setReceiverData] = useState<null>(null);
  // console.log(receiverData);
const fetchReceiverData = async () => {
  if (!receiverId) return;

  try {
    const response = await fetch(
      `https://bo-chat.space/users/${receiverId}`,
      {
        headers: {
          Authorization: `Bearer ${STATIC_TOKEN}`,
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await response.json();
    setReceiverData(data.userpersonaldata);
  } catch (error) {
    console.error("Failed to fetch receiver data", error);
  }
};
useEffect(() => {
  setReceiverData(null); // reset لما تدخل شات جديد
  fetchReceiverData();
}, [receiverId]);
  const isCancelingRef = useRef(false);

  const cancelRecording = () => {
    isCancelingRef.current = true; // 🔥 مهم جدًا

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    mediaStreamRef.current?.getTracks().forEach(t => t.stop());

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    setIsRecording(false);
    setAudioBlob(null);
    setRecordingStopped(false);

    mediaRecorderRef.current = null;
    mediaStreamRef.current = null;
  };





const [recordingStopped, setRecordingStopped] = useState(false);
const isTyping = text.trim().length > 0;
const canShowMic =
  !isTyping &&
  !isRecording &&
  !audioBlob &&
  !recordingStopped;

const canShowRecordingUI =
  !isTyping && isRecording;

const canSendVoice =
  !isTyping && recordingStopped && audioBlob;





  const bottomRef = useRef<HTMLDivElement>(null);

  const [showScrollDown, setShowScrollDown] = useState(false);
  const handleScroll = () => {
    const el = listRef.current;
    if (!el) return;

    const isAtBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 80;

    setShowScrollDown(!isAtBottom);
  };

      useEffect(() => {
    if (!showScrollDown) {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);


useEffect(() => {
  if (!myId || !receiverId) return;

  // الطرف التاني هو اللي هيستقبل seen
  wsService.send({
    event: "seen",
    metadata: {
      sender: receiverId, 
    },
  });

  emitChatUpdate("seen", {
    sender: receiverId,
  });
}, [receiverId]);


  //   if (document.visibilityState !== "visible") return;
  //   if (!myId || !receiverId || messages.length === 0) return;

  //   emitChatUpdate("seen", {
  //     sender: receiverId,
  //   });

  //   try {
  //     wsService.send({
  //       event: "seen",
  //       metadata: {
  //         sender: myId,
  //         reicever: receiverId,
  //       },
  //     });
  //   } catch {}
  // }, [messages.length, myId, receiverId]);
// console.log("MEssages",messages)

  const [showMenu, setShowMenu] = useState(false);
  const handleBlockUser = async () => {
    if (!receiverId || !myId) return;
    try {
      const res = await fetch(
        `https://bo-chat.space//block${myId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${STATIC_TOKEN}`,
        },
          body: JSON.stringify({ blockedid: receiverId }),
      },
      );
      const data = await res.json();
      console.log("BLOCK USER RESPONSE", data);
        if (data.success) {
          setIBlockedHim(true); 
        }

    } catch (error) {
      console.error("Failed to block user", error);
    }
    setShowMenu(false);
  };
  const [iBlockedHim, setIBlockedHim] = useState(false);
  const shouldHideInput = iBlockedHim === true;



     
  // --- Render ---
  return (
    <div className="relative" style={{ margin: "0 auto" }} >
      <header style={{ marginBottom: 16, paddingBottom: 8 }} className="flex items-center justify-between px-4">
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
          <img src="/imgs/dots.svg" 
          onClick={() => setShowMenu(prev => !prev)}
          className="w-4 h-4" alt="dots" />
        </div>
      </header>
      {/* Error / Loading */}
      {error && <div style={{ color: "red", fontSize: 14, marginBottom: 8 }}>{error}</div>}
      {
        messages.length === 0 ?
        <div className="flex flex-col items-center justify-center h-[calc(100vh-225px)]">
          {
             receiverData?.private === true ? 
             <img src="/icons/privatechat.svg" className="w-[82.5px]" alt="empty" />
             
             :
             <img src="/icons/empty.svg" className="w-[82.5px]" alt="empty" />
          }
          {
            receiverData?.private === true ?
            <h3 className="text-[35px]">الدرج ده خاص</h3> : 
            <h3 className="text-[35px]">لسه مفيش كلام</h3>
          }

          {
            receiverData?.private === true ?
              <p className="text-center">
                ممكن تبعت رسالة واحدة بس وهتظهرله
                <br /> لما يوافق
              </p>:           
              <p className="text-center">
                لا يوجد رسائل في هذه المحادثة
                <br /> حتي الان
              </p>
          }
        </div>
        : 
      <div
        ref={listRef}
        className="scrollbar-hidden px-5"
        onScroll={handleScroll}
        style={{
          height: "calc(100vh - 225px)",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          backgroundColor: "#fff",
        }}
      >
        {loading && messages.length === 0 && <Loader />}
        {showScrollDown && (
        <button
          onClick={() =>
            bottomRef.current?.scrollIntoView({ behavior: "smooth" })
          }
          style={{
            position: "fixed",
            bottom: 80,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#d7222897",
            color: "#fff",
            borderRadius: "16px",
            padding: "8px 16px",
            zIndex: 99999,
            fontSize: "14px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
          className="scroll-down-btn"
        >
          انزل تحت
        </button>
      )}
        {messages.map((m, index) => (
          <MessageItem
            key={m._id}
            m={m}
            myId={myId}
            onRetry={retrySend}
            index={index}
            recieverImg={receiverData?.img}
            prevMessage={messages[index - 1]}
          />
        ))}
        {remoteTyping && (() => {
          const last = messages[messages.length - 1];
          const mine = last ? last.sender === myId : false;
          return <TypingBubble mine={mine} />;
        })()}
        <div ref={bottomRef} />
      </div>
      }

{/* ================= INPUT AREA ================= */}
  {!shouldHideInput  && (
      <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>

        {/* ➤ SEND TEXT (أولوية أعلى) */}
        {isTyping && (
          <button
            onClick={handleSend}
            className="w-[80px] h-[55px] text-[#D72229] flex items-center justify-center rounded-l-[20px]"
            style={{ background: "#F3F5FF" }}
          >
            ➤
          </button>
        )}

        {/* 🎧 RECORDING UI */}
        {!isTyping && canShowRecordingUI && (
          <>
            <button onClick={stopRecording}>⏹</button>

            <canvas
              ref={canvasRef}
              width={200}
              height={40}
              style={{ background: "#eee", borderRadius: 6 }}
            />

            <button onClick={cancelRecording}>✖</button>
          </>
        )}

        {/* ➤ SEND VOICE (بعد Stop فقط) */}
        {!isTyping && canSendVoice && (
          <button
            onClick={sendVoiceMessageREST}
            className="w-[80px] h-[55px] text-[#D72229] flex items-center justify-center rounded-l-[20px]"
            style={{ background: "#F3F5FF" }}
          >
            ➤
          </button>
        )}

        {/* 🎤 MIC (آخر حاجة عشان يرجع دايمًا) */}
        {!isTyping && canShowMic && (
          <button
            onPointerDown={startRecording}
            className="w-[80px] h-[55px] flex items-center justify-center rounded-l-[20px]"
            style={{ background: "#F3F5FF" }}
          >
            <img src="/icons/mic.svg" alt="mic" />
          </button>
        )}

        {/* ================= TEXT INPUT ================= */}
        <div
          className="flex bg-[#F3F5FF] w-full h-[55px] px-4 py-2 rounded-r-[20px]"
          style={{ fontSize: 15 }}
        >
          <input
            value={text}
            onChange={e => onInputChange(e.target.value)}
            disabled={isRecording}
            placeholder={isRecording ? "تسجيل..." : "اكتب رسالة..."}
            className={`w-full outline-none bg-transparent ${isRecording ? "" : ""}`}
            onKeyDown={e => {
              if (e.key === "Enter" && isTyping) handleSend();
            }}
          />

          <input
            type="file"
            accept="image/*,video/*"
            hidden
            ref={fileInputRef}
            onChange={handleSelectMedia}
          />

          <div className="flex items-center gap-1">
            <button>
              <Stickers onSelectSticker={handleSendSticker} />
              {/* <img src="/icons/imoji.svg" alt="emoji" /> */}
            </button>
            <button onClick={() => fileInputRef.current?.click()}>
              <img src="/icons/upload.svg" alt="upload" />
            </button>
          </div>
        </div>
        
      </div>)}
        {showMenu && (
        <div
          className="absolute z-[9999]"
          style={{
            top: "50px",
            left: "0px",
          }}
        >
          <div className="
            bg-[#000000]/10
            rounded-[30px] 
            shadow-xl 
            backdrop-blur-[30px] 
            p-4 
            w-[260px]
            flex flex-col 
            gap-4
          ">
            <button
              onClick={() => handleBlockUser()}
            className="
              w-full 
              bg-[#000000]/40 
              rounded-[20px] 
              py-2 
              px-4 
              text-right 
              flex 
              hover:bg-[#000000]/60
              items-center 
              gap-2
              cursor-pointer
              transition
            ">
              <div className="h-[45px] w-[45px] bg-[#D72229]  flex items-center justify-center rounded-full">
                <img src="/icons/block.svg" className="w-5 h-5 invert-0 transform rotate-[160deg]" />
              </div>
              <span className="text-white">حجب</span>
            </button>

            <button 
              onClick={() => handleReport()}
              className="
                w-full 
                bg-[#000000]/40 
                rounded-[20px] 
                py-2 
                px-4 
                text-right 
                flex 
                hover:bg-[#000000]/60
                items-center 
                gap-2
                cursor-pointer
                transition
              ">
              <div className="h-[45px] w-[45px] bg-[#D72229] flex items-center justify-center rounded-full">
                <img src="/icons/flag.svg" className="w-4 h-4 filter invert-[1]" />
              </div>
              <span className="text-white">إبلاغ</span>
            </button>
            <button 
              className="
                w-full 
                bg-[#000000]/40 
                rounded-[20px] 
                py-2 
                px-4 
                text-right 
                flex 
                hover:bg-[#000000]/60
                items-center 
                gap-2
                cursor-pointer
                transition
              ">
              <Link href={`/chats`} className="flex items-center gap-2 w-full">
                <div className="h-[45px] w-[45px] bg-[#D72229] flex items-center justify-center rounded-full">
                  <img src="/icons/close.svg" className="w-4 h-4 invert brightness-0" />
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

const STATIC_TOKEN = localStorage.getItem("boChatToken") || "";
const REST_SEND = "https://bo-chat.space/sendmessage";
const REST_HISTORY_BASE = "https://bo-chat.space/message";
const TYPING_STOP_DELAY = 1500;
const LOCAL_TYPING_THROTTLE = 700;



