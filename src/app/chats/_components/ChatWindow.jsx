// src/app/messages/_components/ChatWindow.jsx
"use client";
import React, { useEffect, useRef, useState } from "react";

/**
 * ChatWindow (JSX version)
 * - مكان الحفظ: src/app/messages/_components/ChatWindow.jsx
 * - لا يحتوي على تعريفات TypeScript ليعمل مع بيئة JS/Turbopack
 *
 * Props:
 *  - userId, otherId, otherInfo, apiBase, wsUrl, token, onClose, onMessageSent
 */

export default function ChatWindow({
  userId,
  otherId,
  otherInfo = {},
  apiBase = "http://bo-chat.space",
  wsUrl = "wss://bo-chat.space/ws",
  token = "",
  onClose,
  onMessageSent,
}) {
  const [messages, setMessages] = useState([]); // oldest -> newest
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [input, setInput] = useState("");
  const wsRef = useRef(null);
  const listRef = useRef(null);

  const fetchUrl = `${apiBase}/chats/${userId}?receiver=${otherId}`;

  // ---------- Load history ----------
  
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(fetchUrl, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // expected shape: { resp: { messages: [...] } }
        let msgs = [];
        if (data && data.resp && Array.isArray(data.resp.messages)) msgs = data.resp.messages;
        else if (Array.isArray(data)) msgs = data;
        else if (Array.isArray(data.messages)) msgs = data.messages;
        // normalize: ensure timestamp present and order oldest->newest
        msgs = msgs
          .map((m) => ({ ...m, timestamp: normalizeTs(m.timestamp) }))
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        if (mounted) setMessages(msgs);
      } catch (e) {
        console.error("load messages error", e);
        if (mounted) setErr((e && e.message) || "خطأ في جلب الرسائل");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [fetchUrl, token]);

  // ---------- Scroll to bottom on new messages ----------
  useEffect(() => {
    if (listRef.current) {
      setTimeout(() => {
        try { listRef.current.scrollTop = listRef.current.scrollHeight; } catch (e) {}
      }, 40);
    }
  }, [messages.length]);

  // ---------- WebSocket for realtime ----------
  useEffect(() => {
    try {
      const ws = new WebSocket(`${wsUrl}?token=${encodeURIComponent(token || "")}`);
      wsRef.current = ws;

      ws.onopen = () => {
        // inform server which chat/room we care about (optional; server-dependent)
        try {
          ws.send(JSON.stringify({ type: "join_chat", userId, otherId }));
        } catch (e) {}
      };

      // ws.onmessage = (ev) => {
      //   try {
      //     const payload = JSON.parse(ev.data);
      //     // handle incoming events
      //     if (payload && payload.type === "message_new" && payload.message) {
      //       const msg = normalizeMessage(payload.message);
      //       if (belongsToChat(msg, userId, otherId)) addUniqueMessage(msg);
      //     } else if (payload && payload.type === "message_created" && payload.data) {
      //       const msg = normalizeMessage(payload.data);
      //       if (belongsToChat(msg, userId, otherId)) addUniqueMessage(msg);
      //     } else if (payload && payload.type === "message_seen" && payload.chatWith) {
      //       if (String(payload.chatWith) === String(otherId)) markAllSeenLocal();
      //     }
      //   } catch (e) {
      //     console.error("WS parse error", e);
      //   }
      // };
ws.onmessage = (ev) => {
  try {
    const payload = JSON.parse(ev.data);

    // TEXT / MEDIA MESSAGE (نفس نظامك)
    if (payload.event === "message") {
      const msg = payload.metadata;

      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    }

    // TYPING
    if (payload.event === "typing") {
      if (
        payload.metadata?.sender === otherId &&
        payload.metadata?.reicever === userId
      ) {
        setRemoteTyping(true);

        setTimeout(() => {
          setRemoteTyping(false);
        }, 1500);
      }
    }

    // SEEN
    if (payload.event === "seen") {
      setMessages((prev) =>
        prev.map((m) => ({
          ...m,
          seenBy: Array.isArray(m.seenBy)
            ? [...new Set([...m.seenBy, otherId])]
            : [otherId],
        }))
      );
    }
  } catch (e) {
    console.log("WS error", e);
  }
};
      ws.onclose = () => {};
      ws.onerror = (e) => {
        console.error("ChatWindow WS error", e);
      };
    } catch (e) {
      console.error("ChatWindow ws init failed", e);
    }

    return () => {
      try { wsRef.current && wsRef.current.close(); } catch (e) {}
    };
  }, [wsUrl, token, userId, otherId]);

  // ---------- Helpers ----------
  function normalizeTs(ts) {
    if (!ts) return new Date().toISOString();
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(ts)) return ts.replace(" ", "T");
    return ts;
  }

  function normalizeMessage(m) {
    return { ...m, timestamp: normalizeTs(m.timestamp) };
  }

  function belongsToChat(msg, me, other) {
    return (
      (String(msg.sender) === String(other) && String(msg.receiver) === String(me)) ||
      (String(msg.sender) === String(me) && String(msg.receiver) === String(other))
    );
  }

  function addUniqueMessage(msg) {
    setMessages((prev) => {
      if (!msg) return prev || [];
      if (msg._id && Array.isArray(prev) && prev.some((m) => m._id === msg._id)) return prev;
      const next = [...(prev || []), msg].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      return next;
    });
  }

  function markAllSeenLocal() {
    setMessages((prev) => (prev || []).map((m) => ({ ...m, seenBy: Array.isArray(m.seenBy) ? m.seenBy : m.seenBy ? [m.seenBy] : [] })));
  }

  // ---------- Mark seen on open ----------
  useEffect(() => {
    if (!messages || messages.length === 0) return;
    try {
      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "message_seen", chatWith: otherId, by: userId }));
      } else {
        fetch(`${apiBase}/message/mark-seen`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
          body: JSON.stringify({ userId, otherId }),
        }).catch(() => {});
      }
    } catch (e) {}
    setMessages((prev) =>
      (prev || []).map((m) => {
        const seenArr = Array.isArray(m.seenBy) ? [...m.seenBy] : m.seenBy ? [m.seenBy] : [];
        if (!seenArr.includes(userId)) seenArr.push(userId);
        return { ...m, seenBy: seenArr };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherId]);

  // ---------- Send message (optimistic) ----------
  async function handleSend(e) {
    e && e.preventDefault();
    const txt = (input || "").trim();
    if (!txt) return;
    const clientId = "c-" + Date.now();
    const optimistic = {
      _id: clientId,
      message: txt,
      sender: userId,
      receiver: otherId,
      timestamp: new Date().toISOString(),
      type: "text",
      seenBy: [],
    };
    setMessages((p) => [...(p || []), optimistic]);
    setInput("");

    const payload = { type: "message_send", clientId, from: userId, to: otherId, body: txt, timestamp: new Date().toISOString() };

    try {
      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(payload));
      } else {
        await fetch(`${apiBase}/message/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
          body: JSON.stringify({ from: userId, to: otherId, message: txt, type: "text", clientId }),
        });
      }
    } catch (e) {
      console.error("send failed", e);
    } finally {
      onMessageSent && onMessageSent(optimistic);
    }
  }

  // ---------- Like message ----------
  async function likeMessage(messageId) {
    if (!messageId) return;
    setMessages((prev) => (prev || []).map((m) => (m._id === messageId ? { ...m, likes: Array.isArray(m.likes) ? [...m.likes, userId] : [userId] } : m)));
    try {
      await fetch(`${apiBase}/message/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
        body: JSON.stringify({ messageId }),
      });
    } catch (e) {
      // ignore
    }
  }

  function renderContent(m) {
    if (!m) return null;
    if (m.type === "text") return <div style={{ whiteSpace: "pre-wrap" }}>{m.message}</div>;
    if (m.type === "image") {
      const url = typeof m.media === "string" ? m.media : (m.media && m.media.url) ? m.media.url : null;
      return url ? <img src={url} alt="img" className="rounded-md max-w-full h-auto" /> : <div>صورة</div>;
    }
    if (m.type === "voice") {
      const audioUrl = typeof m.media === "string" ? m.media : (m.media && m.media.url) ? m.media.url : (m.waveData && m.waveData.url) ? m.waveData.url : null;
      return audioUrl ? <audio controls src={audioUrl} /> : <div>رسالة صوتية</div>;
    }
    return <div>{m.message || m.type}</div>;
  }

  // ---------- UI ----------
  return (
    <div className="max-w-3xl mx-auto h-[600px] border rounded-lg flex flex-col bg-white">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={(otherInfo && otherInfo.img) || "/imgs/user.png"} alt={(otherInfo && otherInfo.name) || otherId} className="w-10 h-10 rounded-full object-cover" />
          <div>
            <div className="font-medium text-sm">{(otherInfo && otherInfo.name) || (otherInfo && otherInfo.username) || otherId}</div>
            <div className="text-xs text-gray-400">{otherInfo && otherInfo.username}</div>
          </div>
        </div>
        <div>
          <button onClick={() => onClose && onClose()} className="text-sm text-gray-600 px-3 py-1 rounded">اغلاق</button>
        </div>
      </div>

      <div ref={listRef} className="flex-1 overflow-auto p-4 bg-[#FAFAFA]">
        {loading ? <div className="text-center text-gray-500">جارٍ التحميل...</div> : null}
        {err ? <div className="text-red-500">{err}</div> : null}
        {!loading && (!messages || messages.length === 0) ? <div className="text-center text-gray-400">لا يوجد رسائل بعد</div> : null}

        {(messages || []).map((m) => {
          const mine = String((m && m.sender) || "") === String(userId);
          const seen = Array.isArray(m && m.seenBy) && (m.seenBy || []).includes(otherId);
          return (
            <div key={(m && m._id) || (m && m.timestamp) || Math.random()} className={`mb-4 flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`rounded-lg px-4 py-2 max-w-[72%] shadow-sm ${mine ? "bg-red-500 text-white" : "bg-white text-gray-900"}`}>
                <div className="mb-1">{renderContent(m)}</div>

                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <div className="flex items-center gap-2">
                    <div>{formatTs(m && m.timestamp)}</div>
                    <button onClick={() => likeMessage(m && m._id)} className="text-red-500 text-sm" aria-label="like">
                      👍 {Array.isArray(m && m.likes) ? (m.likes || []).length : 0}
                    </button>
                  </div>

                  <div>{mine ? <span className="text-[11px]">{seen ? "✓✓" : "✓"}</span> : null}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSend} className="p-3 border-t flex items-center gap-2">
        <button type="button" className="p-2 rounded-full bg-gray-100">📎</button>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="اكتب رسالتك هنا..." className="flex-1 px-4 py-2 rounded-full border outline-none" />
        <button type="submit" className="px-4 py-2 rounded-full bg-red-600 text-white">ارسال</button>
      </form>
    </div>
  );
}

/* helpers */
function formatTs(ts) {
  if (!ts) return "";
  let d = null;
  if (typeof ts === "number") d = new Date(ts);
  else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(ts)) d = new Date(ts.replace(" ", "T"));
  else d = new Date(ts);
  if (!d || isNaN(d.getTime())) return "";
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return "الآن";
  if (diff < 3600) return `${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ساعة`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} يوم`;
  return d.toLocaleDateString();
}
