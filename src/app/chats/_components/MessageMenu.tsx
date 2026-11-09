// app/chats/_components/MessageMenu.tsx
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
'use client';

import React, { useState } from 'react';
import { Message } from '@/types/types';

interface MessageMenuProps {
  message: Message;
  myId: string | null;
  isGroupAdmin?: boolean;
  onReact: (messageId: string, emoji: string) => void;
  onCopy: (text: string) => void;
  onEdit: (message: Message) => void;
  onReply: (message: Message) => void;
  onTranslate: (message: Message) => void;
  onDelete: (message: Message) => void;
  onClose: () => void;
  position: { x: number; y: number };
}

type MenuItem = {
  id: string;
  label: string;
  icon: string;
  onClick: () => void;
};

const emojis = ['❤️', '😂', '😮', '😢', '👍', '👎', '🔥', '⭐', '💯', '🤣', '😍', '🥰'];

export const MessageMenu: React.FC<MessageMenuProps> = ({
  message,
  myId,
  isGroupAdmin = false,
  onReact,
  onCopy,
  onEdit,
  onReply,
  onTranslate,
  onDelete,
  onClose,
  position,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const isMyMessage = message.sender === myId;
  const canModify = isMyMessage || isGroupAdmin;

  // الأنواع اللي بتعرض بس: تفاعل / رد / حذف
  const limitedTypes = ['audio', 'call', 'sticker', 'image'];
  const isLimitedMessage = limitedTypes.includes(message.type || '');

  // ====== بناء قائمة الخيارات ======
  const menuItems: MenuItem[] = [];

  // تفاعل دايماً موجود
  menuItems.push({
    id: 'react',
    label: 'تفاعل',
    icon: '/imgs/reaction.svg',
    onClick: () => setShowEmojiPicker((prev) => !prev),
  });

  if (isLimitedMessage) {
    // ====== صورة / ستيكر / صوت / مكالمة: تفاعل · رد · حذف ======
    menuItems.push({
      id: 'reply',
      label: 'رد',
      icon: '/imgs/replyMsg.svg',
      onClick: () => {
        onReply(message);
        onClose();
      },
    });

    if (canModify) {
      menuItems.push({
        id: 'delete',
        label: 'حذف',
        icon: '/imgs/delete.svg',
        onClick: () => {
          onDelete(message);
          onClose();
        },
      });
    }
  } else {
    // ====== رسالة عادية: تفاعل · نسخ · تعديل · رد · ترجمة · حذف ======
    menuItems.push({
      id: 'copy',
      label: 'نسخ',
      icon: '/imgs/copy.svg',
      onClick: () => {
        if (message.message) {
          onCopy(message.message);
          onClose();
        }
      },
    });

    if (canModify) {
      menuItems.push({
        id: 'edit',
        label: 'تعديل',
        icon: '/imgs/edit.svg',
        onClick: () => {
          onEdit(message);
          onClose();
        },
      });
    }

    menuItems.push(
      {
        id: 'reply',
        label: 'رد',
        icon: '/imgs/replyMsg.svg',
        onClick: () => {
          onReply(message);
          onClose();
        },
      },
      {
        id: 'translate',
        label: 'ترجمة',
        icon: '/imgs/translate.svg',
        onClick: () => {
          onTranslate(message);
          onClose();
        },
      }
    );

    if (canModify) {
      menuItems.push({
        id: 'delete',
        label: 'حذف',
        icon: '/imgs/delete.svg',
        onClick: () => {
          onDelete(message);
          onClose();
        },
      });
    }
  }

  // ====== حساب الموقع النهائي ======
  const calculateAdjustedPosition = () => {
    const menuWidth = 200;
    const menuHeight = menuItems.length * 48 + (showEmojiPicker ? 100 : 0);

    let x = position.x;
    let y = position.y;

    if (x + menuWidth > window.innerWidth - 10) {
      x = window.innerWidth - menuWidth - 10;
    }
    if (x < 10) {
      x = 10;
    }
    if (y + menuHeight > window.innerHeight - 10) {
      y = window.innerHeight - menuHeight - 10;
    }
    if (y < 10) {
      y = 10;
    }

    return { x, y };
  };

  const adjustedPosition = calculateAdjustedPosition();

  return (
    <div
      className="fixed z-[99999]"
      style={{
        top: adjustedPosition.y,
        left: adjustedPosition.x,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* خلفية شفافة لإغلاق القائمة عند النقر خارجها */}
      <div className="fixed inset-0 z-[-1]" onClick={onClose} />

      <div className="bg-[#F5F5F5] rounded-[20px] min-w-[170px] overflow-hidden">
        {showEmojiPicker && (
          <div className="flex flex-wrap gap-1 p-3 border-b border-gray-200 bg-white">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  onReact(message._id, emoji);
                  setShowEmojiPicker(false);
                  onClose();
                }}
                className="w-10 h-10 text-2xl hover:bg-gray-100 rounded-full transition"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {menuItems.map((item, index) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className={`w-full px-4 py-3 text-sm hover:bg-white flex items-center justify-between gap-3 transition ${
              index === menuItems.length - 1 ? 'rounded-b-[20px]' : ''
            }`}
            style={{
              borderBottom:
                index < menuItems.length - 1
                  ? '0.33px solid rgba(60,60,67,0.3)'
                  : 'none',
            }}
          >
            <span
              className={`font-semibold text-[14px] ${
                item.id === 'delete' ? 'text-[#D72229]' : 'text-black'
              }`}
            >
              {item.label}
            </span>
            <img src={item.icon} alt={item.label} className="w-4 h-4" />
          </button>
        ))}
      </div>
    </div>
  );
};