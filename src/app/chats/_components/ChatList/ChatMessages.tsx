/* eslint-disable @next/next/no-img-element */
'use client';
import { ChatItem } from "@/types/types";
import { markChatSeen } from "@/lib/seenGuard";

type ChatMessagesProps = {
  chats: ChatItem[];
  myUserId: string;
  activeChatId?: string;
  searchTerm: string;
  onChatClick: (chatId: string) => void;
};

export default function ChatMessages({
  chats,
  myUserId,
  activeChatId,
  searchTerm,
  onChatClick,
}: ChatMessagesProps) {
  if (chats.length === 0 && searchTerm.trim() !== '') {
    return (
      <div className="text-center text-gray-500 py-10">
        لا توجد محادثات مع <span className="font-bold">"{searchTerm}"</span>
      </div>
    );
  }

  if (chats.length === 0 && searchTerm.trim() === '') {
    return (
      <div className="text-center text-gray-500 py-10">
        ليس لديك أي محادثات حالياً
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {chats.map((chat) => {
        const isLastFromMe = chat.lastMessage.sender === myUserId;

        return (
          <div
            key={chat.chatId}
            onClick={() => {
              markChatSeen(chat.chatId);
              onChatClick(chat.chatId);
            }}
            className={`
              flex items-center gap-3 px-3 py-1 transition cursor-pointer
              ${activeChatId === chat.chatId ? "active-chat" : "hover:bg-gray-100"}
            `}
            dir="ltr"
          >
            <img
              src={chat.userinfo?.img || "/imgs/user.png"}
              className="w-[60px] h-[60px] rounded-[25px]"
              alt="avatar"
            />

            <div className="flex-1">
              <div className="font-medium">{chat.userinfo?.name}</div>
              <div className="text-sm text-[#B4B4B9] truncate max-w-[120px] overflow-hidden">
                {chat.typing
                  ? "يكتب الان ..."
                  : chat.lastMessage.type === "image" || chat.lastMessage.type === "sticker"
                  ? "صورة 📷"
                  : chat.lastMessage.message || ""}
              </div> 
            </div>

            {isLastFromMe && (
              <span className="text-xs">
                {chat.lastMessage.seenBy ? (
                  <img src="/icons/read.svg" alt="read" />
                ) : (
                  <img src="/icons/unread.svg" alt="unread" />
                )}
              </span>
            )}

            {!isLastFromMe && chat.unreadCount > 0 && (
              <span className="w-2 h-2 bg-red-500 rounded-full" />
            )}
          </div>
        );
      })}
    </div>
  );
}