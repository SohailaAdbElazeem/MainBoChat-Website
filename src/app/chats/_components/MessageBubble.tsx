/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import AudioBubble from "./AudioPupple";

export default function MessageBubble({ msg, isMe }: { msg: any; isMe: boolean }) {
  return (
    <div className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
      
      {/* Avatar */}
      {!isMe && (
        <img
          src={msg.avatar}
          className="w-8 h-8 rounded-full object-cover"
        />
      )}

      {/* Bubble */}
      <div className="flex flex-col max-w-[70%]">
        <div
          className={`
            px-4 py-2 rounded-2xl text-sm shadow
            ${isMe
              ? "bg-red-500 text-white rounded-br-md"
              : "bg-white text-gray-900 rounded-bl-md border"
            }
          `}
        >
          {/* TEXT */}
          {msg.type === "text" && <p>{msg.message}</p>}

          {/* IMAGE */}
          {msg.type === "image" && (
            <img
              src={msg.fileUrl}
              className="rounded-xl max-w-full"
            />
          )}

          {/* AUDIO */}
          {msg.type === "audio" && (
            <AudioBubble
              duration={msg.duration}
              isMe={isMe}
            />
          )}
        </div>

        {/* Meta */}
        <div
          className={`flex items-center gap-2 mt-1 text-[11px] text-gray-400
            ${isMe ? "justify-end" : "justify-start"}
          `}
        >
          <span>{msg.time}</span>

          {isMe && (
            <span className="text-white/80">
              ✓✓
            </span>
          )}

          <button className="hover:text-red-500">👍</button>
        </div>
      </div>

      {/* Avatar right */}
      {isMe && (
        <img
          src={msg.avatar}
          className="w-8 h-8 rounded-full object-cover"
        />
      )}
    </div>
  );
}




