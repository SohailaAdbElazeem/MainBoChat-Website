// // app/chats/_components/MessageMenu.tsx
// /* eslint-disable @next/next/no-img-element */
// /* eslint-disable jsx-a11y/alt-text */
// 'use client';

// import React, { useState } from 'react';
// import { Message } from '@/types/types';

// interface MessageMenuProps {
//   message: Message;
//   myId: string | null;
//   isGroupAdmin?: boolean;
//   onReact: (messageId: string, emoji: string) => void;
//   onCopy: (text: string) => void;
//   onEdit: (message: Message) => void;
//   onReply: (message: Message) => void;
//   onTranslate: (message: Message) => void;
//   onDelete: (message: Message) => void;
//   onClose: () => void;
//   position: { x: number; y: number };
// }

// const emojis = ['❤️', '😂', '😮', '😢', '👍', '👎', '🔥', '⭐', '💯', '🤣', '😍', '🥰'];

// export const MessageMenu: React.FC<MessageMenuProps> = ({
//   message,
//   myId,
//   isGroupAdmin = false,
//   onReact,
//   onCopy,
//   onEdit,
//   onReply,
//   onTranslate,
//   onDelete,
//   onClose,
//   position,
// }) => {
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const isMyMessage = message.sender === myId;

//   // بناء قائمة الخيارات
//   const menuItems = [
//     {
//       id: 'react',
//       label: 'تفاعل',
//       icon: '/imgs/reaction.svg',
//       onClick: () => setShowEmojiPicker(!showEmojiPicker),
//     },
//     {
//       id: 'copy',
//       label: 'نسخ',
//       icon: '/imgs/copy.svg',
//       onClick: () => {
//         if (message.message) {
//           onCopy(message.message);
//           onClose();
//         }
//       },
//     },
//     {
//       id: 'reply',
//       label: 'رد',
//       icon: '/imgs/reply.svg',
//       onClick: () => {
//         onReply(message);
//         onClose();
//       },
//     },
//     {
//       id: 'translate',
//       label: 'ترجمة',
//       icon: '/imgs/translate.svg',
//       onClick: () => {
//         onTranslate(message);
//         onClose();
//       },
//     },
//   ];

//   // فقط صاحب الرسالة أو المشرف يمكنه التعديل والحذف
//   if (isMyMessage || isGroupAdmin) {
//     menuItems.push(
//       {
//         id: 'edit',
//         label: 'تعديل',
//         icon: '/imgs/edit.svg',
//         onClick: () => {
//           onEdit(message);
//           onClose();
//         },
//       },
//       {
//         id: 'delete',
//         label: 'حذف',
//         icon: '/imgs/delete.svg',
//         onClick: () => {
//           onDelete(message);
//           onClose();
//         },
//       }
//     );
//   }

//   // ضبط الموقع ليكون داخل الشاشة
//   const adjustedPosition = {
//     x: Math.min(position.x, window.innerWidth - 220),
//     y: Math.min(position.y, window.innerHeight - (menuItems.length * 48 + 80)),
//   };

//   return (
//     <div
//       className="fixed z-[99999]"
//       style={{
//         top: adjustedPosition.y,
//         left: adjustedPosition.x,
//       }}
//       onClick={(e) => e.stopPropagation()}
//     >
//       {/* خلفية شفافة لإغلاق القائمة عند النقر خارجها */}
//       <div
//         className="fixed inset-0 z-[-1]"
//         onClick={onClose}
//       />

//       <div
//         className="bg-[#F5F5F5] rounded-[20px] shadow-xl min-w-[170px] overflow-hidden"
//         style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.25)' }}
//       >
//         {showEmojiPicker && (
//           <div className="flex flex-wrap gap-1 p-3 border-b border-gray-200 bg-white">
//             {emojis.map((emoji) => (
//               <button
//                 key={emoji}
//                 onClick={() => {
//                   onReact(message._id, emoji);
//                   setShowEmojiPicker(false);
//                   onClose();
//                 }}
//                 className="w-10 h-10 text-2xl hover:bg-gray-100 rounded-full transition"
//               >
//                 {emoji}
//               </button>
//             ))}
//           </div>
//         )}

//         {menuItems.map((item, index) => (
//           <button
//             key={item.id}
//             onClick={item.onClick}
//             className={`w-full px-4 py-3 text-sm hover:bg-white flex items-center justify-between gap-3 transition ${
//               index === menuItems.length - 1 ? 'rounded-b-[20px]' : ''
//             }`}
//             style={{
//               borderBottom: index < menuItems.length - 1 ? '0.33px solid rgba(60,60,67,0.3)' : 'none',
//             }}
//           >
//             <span
//               className={`font-semibold text-[14px] ${
//                 item.id === 'delete' ? 'text-[#D72229]' : 'text-black'
//               }`}
//             >
//               {item.label}
//             </span>
//             <img src={item.icon} alt={item.label} className="w-4 h-4" />
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };


// app/chats/_components/MessageMenu.tsx
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
'use client';

import React, { useState, useEffect } from 'react';
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

  // بناء قائمة الخيارات
  const menuItems = [
    {
      id: 'react',
      label: 'تفاعل',
      icon: '/imgs/reaction.svg',
      onClick: () => setShowEmojiPicker(!showEmojiPicker),
    },
    {
      id: 'copy',
      label: 'نسخ',
      icon: '/imgs/copy.svg',
      onClick: () => {
        if (message.message) {
          onCopy(message.message);
          onClose();
        }
      },
    },
    {
      id: 'reply',
      label: 'رد',
      icon: '/imgs/reply.svg',
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
    },
  ];

  // فقط صاحب الرسالة أو المشرف يمكنه التعديل والحذف
  if (isMyMessage || isGroupAdmin) {
    menuItems.push(
      {
        id: 'edit',
        label: 'تعديل',
        icon: '/imgs/edit.svg',
        onClick: () => {
          onEdit(message);
          onClose();
        },
      },
      {
        id: 'delete',
        label: 'حذف',
        icon: '/imgs/delete.svg',
        onClick: () => {
          onDelete(message);
          onClose();
        },
      }
    );
  }

  // ====== حساب الموقع النهائي ======
  const calculateAdjustedPosition = () => {
    const menuWidth = 200;
    const menuHeight = menuItems.length * 48 + 60;

    let x = position.x;
    let y = position.y;

    // تعديل الموقع ليكون داخل الشاشة
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
      <div
        className="fixed inset-0 z-[-1]"
        onClick={onClose}
      />

      <div
        className="bg-[#F5F5F5] rounded-[20px]  min-w-[170px] overflow-hidden"
        // style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.25)' }}
      >
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
              borderBottom: index < menuItems.length - 1 ? '0.33px solid rgba(60,60,67,0.3)' : 'none',
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