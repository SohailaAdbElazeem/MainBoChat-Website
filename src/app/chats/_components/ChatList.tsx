/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import wsService from "@/lib/websocketService";
import { isChatSeen, markChatSeen } from "@/lib/seenGuard";
import { ChatItem, Message } from "@/types/types";
import { Search } from "lucide-react";
import { usePathname } from "next/navigation";

type Props = {
  userId: string;
  apiBase: string;
};
/* ================= NORMALIZE ================= */
function normalizeChats(messages: Message[], myId: string): ChatItem[] {
  const map: Record<string, ChatItem> = {};
  messages.forEach((msg) => {
    const isMe = msg.sender === myId;
    const otherId = isMe ? msg.receiver : msg.sender;

    if (!map[otherId]) {
      map[otherId] = {
        chatId: otherId,
        userinfo: msg.receiverinfo,
        lastMessage: {
          ...msg,
          seenBy: false, 
        },

        unreadCount: 0,
        typing: false,
      };
    }

    if (
      !isMe &&
      msg.seenBy === false &&
      !isChatSeen(otherId) 
    ) {
      map[otherId].unreadCount += 1;
    }

    if (
      new Date(msg.timestamp) >
      new Date(map[otherId].lastMessage.timestamp)
    ) {
      map[otherId].lastMessage = msg;
    }
  });

  return Object.values(map).sort(
    (a, b) =>
      new Date(b.lastMessage.timestamp).getTime() -
      new Date(a.lastMessage.timestamp).getTime()
  );
}
/* ================= COMPONENT ================= */
// export default function ChatList({ userId, apiBase }: Props) 
export default function ChatList({ apiBase }: { apiBase: string }) {
  const [myUserId, setMyUserId] = useState("");
  const router = useRouter();
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);

  const typingTimers = useRef<Record<string, any>>({});
  const bcRef = useRef<BroadcastChannel | null>(null);
  
useEffect(() => {
  const raw = localStorage.getItem("userData");

  if (!raw) return;

  try {
    const parsed = JSON.parse(raw);
    setMyUserId(parsed._id); // 🔥 ده الصح
  } catch (e) {
    console.error("Invalid userData in localStorage");
  }
}, []);
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;
      // console.log("USER ID:", myUserId);
      //  console.log("ACCESS TOKEN:", token);
  const pathname = usePathname();
  const activeChatId = pathname?.split("/").pop();

  /* ================= 1️⃣ LOAD FROM API ================= */


  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const res = await fetch(
          `${apiBase}/chats/${myUserId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
console.log("Status:", res.status);
console.log("OK:", res.ok);
console.log("Token:", token);

const data = await res.json();

console.log("Full Response:", data);
        // const data = await res.json();

        const normalized = normalizeChats(
          data.userchats || [],
          myUserId
        );

        setChats(normalized);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }

    if (myUserId && token) load();
  }, [myUserId, token, apiBase]);

  /* ================= 2️⃣ WEBSOCKET (SHARED) ================= */

  useEffect(() => {
    if (!myUserId) return;

    wsService.connect(myUserId);

    const unsub = wsService.addHandler((payload: any) => {
      handleWsEvent(payload);
    });

    return () => {
      unsub(); // ❗ بنشيل handler بس
    };
  }, [myUserId]);

  /* ================= 3️⃣ BROADCAST (INTERNAL) ================= */

  useEffect(() => {
    bcRef.current = new BroadcastChannel("bochat-typing");

    bcRef.current.onmessage = (ev) => {
      if (ev.data?.type === "chat_update") {
        // اعتبره WS event حقيقي
        handleWsEvent({
          event: ev.data.event,
          metadata: ev.data.metadata,
        });
      }}
    return () => {
      bcRef.current?.close();
      bcRef.current = null;
    };
  }, []);

  /* ================= 4️⃣ EVENT ROUTER ================= */

function handleWsEvent(payload: any) {
  if (!payload) return;


  /**
   * 🟢 CASE 1
   * Server sends wrapped event
   * { event: "message", metadata: {...} }
   */
  if (payload.event === "message" && payload.metadata) {
    onWsMessage(payload.metadata);
    return;
  }

  if (payload.event === "typing" && payload.metadata) {
    onTyping(payload.metadata);
    return;
  }

  if (payload.event === "seen" && payload.metadata) {
    onSeen(payload.metadata);
    return;
  }

  /**
   * 🟢 CASE 2
   * Server sends RAW message directly
   * { _id, sender, receiver, message, ... }
   */
  if (
    payload._id &&
    payload.sender &&
    payload.receiver &&
    payload.message
  ) {
    onWsMessage(payload);
    return;
  }
}



  /* ================= 5️⃣ MESSAGE ================= */

function onWsMessage(msg: Message) {
  setChats((prev) => {
    const isMe = msg.sender === myUserId;
    const otherId = isMe ? msg.receiver : msg.sender;

    const list = [...prev];
    const idx = list.findIndex((c) => c.chatId === otherId);

    if (idx === -1) {
      return prev; // 🔥 مهم جدًا
    }

    const chat = { ...list[idx] };

    chat.lastMessage = {
      ...msg,
      seenBy: isMe ? chat.lastMessage.seenBy : false,
    };
    chat.typing = false;

    if (!isMe) chat.unreadCount += 1;

    list.splice(idx, 1);
    return [chat, ...list];
  });
}


  /* ================= 6️⃣ TYPING ================= */

function onTyping(payload: any) {
  const sender = payload.sender;
  // const to = payload.reicever || payload.receiver;
  const to = payload.receiver|| payload.receiver;

  if (!sender || to !== myUserId) return;

  setChats((prev) =>
    prev.map((c) =>
      c.chatId === sender
        ? { ...c, typing: true }
        : c
    )
  );

  clearTimeout(typingTimers.current[sender]);
  typingTimers.current[sender] = setTimeout(() => {
    setChats((prev) =>
      prev.map((c) =>
        c.chatId === sender
          ? { ...c, typing: false }
          : c
      )
    );
  }, 1500);
}


  /* ================= 7️⃣ SEEN ================= */

function onSeen({ sender }: any) {
  console.log("🔥 SEEN EVENT RECEIVED:", sender);

  markChatSeen(sender);

  setChats(prev =>
    prev.map(c => {
      if (c.chatId !== sender) return c;
      if (c.lastMessage.sender !== myUserId) return c;

      return {
        ...c,
        unreadCount: 0,
        lastMessage: {
          ...c.lastMessage,
          seenBy: true,
        },
      };
    })
  );
}




useEffect(() => {
  if (!myUserId || !token) return;

  const poll = async () => {
    try {
      const res = await fetch(
        `${apiBase}/chats/${myUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      // console.log("API DATA", data);
      const messages = data.userchats || [];

      setChats(prev => {
        const map = new Map(prev.map(c => [c.chatId, c]));
        let changed = false;

        messages.forEach(msg => {
          const isMe = msg.sender === myUserId;
          const otherId = isMe ? msg.receiver : msg.sender;

          const existing = map.get(otherId);

if (!existing) {
  return; // 🔥 متضيفش شات من polling
}

          if (
            new Date(msg.timestamp) >
            new Date(existing.lastMessage.timestamp)
          ) {
            map.set(otherId, {
              ...existing,
              lastMessage: {
                ...msg,
                seenBy: existing.lastMessage.seenBy,
              },
              unreadCount:
                !isMe && !msg.seenBy
                  ? existing.unreadCount + 1
                  : existing.unreadCount,
            });
            changed = true;
          }
        });

        return changed
          ? Array.from(map.values()).sort(
              (a, b) =>
                new Date(b.lastMessage.timestamp).getTime() -
                new Date(a.lastMessage.timestamp).getTime()
            )
          : prev;
      });
    } catch {}
  };

  poll(); // أول مرة فورًا
  const id = setInterval(poll, 2500); // كل 2.5 ثانية

  return () => clearInterval(id);
}, [myUserId, token, apiBase]);

  /* ================= 8️⃣ RENDER ================= */

  if (loading) {
    return <div className="p-4">جارٍ التحميل...</div>;
  }

  return (
    <div>
      <h1 className="text-[25px] mb-5 px-4">الكلام بينا</h1>
      <div className="flex items-center justify-center w-full mb-3">
        <div className="w-[90%] bg-[#F2F2F2] flex h-[61px] items-center px-4 gap-1 rounded-[27px]  ">
          <Search className="text-[#B6B7B7]"/>
          <input type="text" placeholder="اكتب هنا ما تريد ان تكتشفه" className="focus:outline-none placeholder:text-[#B6B7B7] " />
        </div>
      </div>

        <div className="flex flex-col gap-1">

          {chats.map((chat) => {
            const isLastFromMe =
              chat.lastMessage.sender === myUserId;

            return (
              <div
                key={chat.chatId}
                onClick={() => {
                  markChatSeen(chat.chatId); // 🔥 مهم

                  setChats(prev =>
                    prev.map(c =>
                      c.chatId === chat.chatId
                        ? { ...c, unreadCount: 0 }
                        : c
                    )
                  );

                  router.push(`/chats/${chat.chatId}`);
                }}


                  className={`
                    flex items-center gap-3 px-3 py-1 transition cursor-pointer
                    ${activeChatId === chat.chatId
                      ? "active-chat"
                      : "hover:bg-gray-100"}
                  `}
                dir="ltr"
              >
                <img
                  src={chat.userinfo?.img || "/imgs/user.png"}
                  className="w-[60px] h-[60px] rounded-[25px]"
                />

                <div className="flex-1">
                  <div className="font-medium">
                    {chat.userinfo?.name}
                  </div>

                  <div className="text-sm text-[#B4B4B9] truncate max-w-[120px] overflow-hidden">
                    {chat.typing
                      ? "يكتب الان ..."
                      : chat.lastMessage.type === "image" ||
                        chat.lastMessage.type === "sticker"
                        ? "صورة 📷"
                        : chat.lastMessage.message || ""}
                  </div> 
                </div>

                {/* ✓ / ✓✓ */}
                {isLastFromMe && (
                  <span className="text-xs">
                    {chat.lastMessage.seenBy ? (
                      <img src="/icons/read.svg" alt="read" />
                    ) : (
                      <img src="/icons/unread.svg" alt="unread" />

                    )}
                  </span>
                )}


                {/* unread */}
                {!isLastFromMe && chat.unreadCount > 0 && (
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                )}

              </div>
            );
          })}
        </div>
    </div>

  );
}

