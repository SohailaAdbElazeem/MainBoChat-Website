 // app/chats/[receiverId]/page.tsx
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';
 
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



// ================= TOAST CONFIRMATION HELPER =================
const showConfirmToast = (
  message: string,
  onConfirm: () => void,
  onCancel?: () => void,
  confirmText?: string,
  cancelText?: string
) => {
  toast(
    (t) => (
      <div className="flex flex-col items-center gap-4 p-3">
        <div className="flex items-center gap-3 w-full">
          <p className="text-right text-sm font-medium text-gray-800 leading-relaxed flex-1 whitespace-pre-line">
            {message}
          </p>
        </div>
        <div className="flex gap-3 w-full mt-1">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
            className="flex-1 py-2.5 px-4 bg-[#D72229] text-white rounded-xl hover:bg-[#b01d23] transition-all duration-200 text-sm font-semibold"
          >
            {confirmText || 'تأكيد'}
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              if (onCancel) onCancel();
            }}
            className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 text-sm font-semibold"
          >
            {cancelText || 'إلغاء'}
          </button>
        </div>
      </div>
    ),
    {
      duration: 60000,
      position: 'top-center',
      style: {
        background: '#FFFFFF',
        borderRadius: '20px',
        padding: '20px 24px',
        maxWidth: '420px',
        width: '100%',
        // boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        border: '1px solid rgba(0,0,0,0.05)',
      },
    }
  );
};
export type MediaType = 'image' | 'video' | 'file';

interface PendingImage {
  id: string;
  file: File;
  url: string;
}

// =import React, { useState, useRef, useEffect } from 'react';

interface ImageViewerProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onAddImages?: (newFiles: FileList) => void; 
  onDeleteImage?: (index: number) => void;  
  onSendWithCaption?: (caption: string) => void; 
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ 
  images, 
  currentIndex, 
  onClose, 
  onNext, 
  onPrev,
  onAddImages,
  onDeleteImage,
  onSendWithCaption
}) => {
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  if (!images.length) return null;

  const totalImages = images.length;
  const prevIndex = totalImages > 1 ? (currentIndex - 1 + totalImages) % totalImages : null;
  const nextIndex = totalImages > 1 ? (currentIndex + 1) % totalImages : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (onAddImages) {
        onAddImages(e.target.files);
      }
      e.target.value = '';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[999999] bg-black/40 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        multiple 
        accept="image/*" 
        className="hidden" 
      />

      <div 
        className="relative bg-white rounded-[35px] flex flex-col justify-between overflow-hidden transition-all duration-300"
        style={{
          width: '572px',
          height: '569px',
          borderRadius: '35px',
          background: '#FFFFFF',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* السطر الأول: إغلاق + عنوان + إضافة صور */}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="flex items-center justify-center rounded-full transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
              style={{ width: '36px', height: '36px', background: '#0000001A' }}
              title="إغلاق"
            >
              <img src="/imgs/close.svg" alt="إغلاق" style={{ width: '17px', height: '17px' }} />
            </button>
            <span 
              className="font-medium text-black"
              style={{ fontFamily: 'Cairo, sans-serif', fontSize: '25px', lineHeight: '1', textAlign: 'right' }}
            >
              إرسال صورة
            </span>
          </div>

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center rounded-full transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            style={{ width: '36px', height: '36px', background: '#F3F5FF' }}
            title="إضافة صور أخرى من الجهاز"
          >
            <img src="/imgs/Add.svg" alt="إضافة صورة" style={{ width: '17px', height: '17px', transform: 'rotate(-90deg)' }} />
          </button>
        </div>

        {/* عرض مجموعة الصور مع العناصر العلوية داخل صورة المنتصف */}
        <div className="relative flex-1 flex items-center justify-center px-4 overflow-hidden my-auto">
          {/* الصورة السابقة (على اليسار في المعاينة) */}
          {prevIndex !== null && (
            <div 
              onClick={onPrev}
              className="absolute left-6 cursor-pointer opacity-70 hover:opacity-100 transition-all transform -translate-y-1/2 top-1/2"
              style={{ width: '125px', height: '255px', borderRadius: '20px', overflow: 'hidden', background: 'linear-gradient(270deg, rgba(255, 255, 255, 0) 14.83%, #FFFFFF 79.89%)' }}
            >
              <img src={images[prevIndex]} alt="السابقة" className="w-full h-full object-cover" />
             <div 
  className="absolute top-2 right-7 flex items-center justify-center shadow-md"
  style={{
    width: '40px',
    height: '40px',
    background: '#FFFFFF',
    border: '2px solid #F3F5FF40',
    borderRadius: '50%',
    opacity: 1,
  }}
>
  <img 
    src="/imgs/close.svg" 
    alt="إغلاق" 
    style={{
      width: '14px',
      height: '14px',
      opacity: 1,
      // filter: 'brightness(0) saturate(100%)', // لتصبح باللون الأسود
    }} 
  />
</div>
            </div>
          )}

          {/* الصورة الأساسية في المنتصف */}
          <div 
            className="relative flex items-center justify-center transition-all duration-300 z-10"
            style={{ width: '291px', height: '358px', borderRadius: '40px', border: '3px solid #B4B4B9', background: '#000', overflow: 'visible' }}
          >
            <img
              src={images[currentIndex]}
              alt={`صورة ${currentIndex + 1}`}
              className="w-full h-full object-cover"
              style={{ borderRadius: '37px' }}
            />

            {/* العناصر العلوية داخل صورة المنتصف */}
         {/* الحاوية العلوية لتوسيط الزر والأيقونة بجانب بعضهما */}
<div className="absolute top-3 inset-x-0 flex items-center justify-center gap-[5px] z-20 px-3 pointer-events-none">
  
  {/* زر الحذف */}
  <button 
    type="button"
    onClick={() => onDeleteImage && onDeleteImage(currentIndex)}
    className="pointer-events-auto flex items-center justify-center rounded-[20px] transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-md"
    style={{
      width: '61px',
      height: '60px',
      background: '#F3F5FF80',
      backdropFilter: 'blur(4px)',
      border: '2px solid #F3F5FF40',
      opacity: 1,  
    borderRadius: '50%',
    }}
    title="حذف الصورة"
  >
    <img 
      src="/imgs/deleteImg.svg" 
      alt="حذف" 
      style={{
        width: '20px',
        height: '21px',
        opacity: 1,
      }} 
    />
  </button>

  {/* أيقونة onlyOne بجانبه مباشرة */}
<div 
  className="pointer-events-auto flex items-center justify-center rounded-[20px] shadow-md"
  style={{
    width: '60px',
    height: '61px',
    background: '#F3F5FF80',
    border: '2px solid #F3F5FF40',
    borderRadius: '50%',
    opacity: 1,
  }}
>
  <img 
    src="/imgs/onlyOne.svg" 
    alt="onlyOne" 
    style={{
      width: '20px',    
      height: '20px',
      opacity: 1,
      // filter: 'brightness(0) saturate(100%)', 
    }} 
  />
</div>

</div>
          </div>

          {/* الصورة التالية (على اليمين) */}
          {nextIndex !== null && (
            <div 
              onClick={onNext}
              className="absolute right-6 cursor-pointer opacity-70 hover:opacity-100 transition-all transform -translate-y-1/2 top-1/2"
              style={{ width: '125px', height: '255px', borderRadius: '20px', overflow: 'hidden', background: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 14.83%, #FFFFFF 79.89%)' }}
            >
              <img src={images[nextIndex]} alt="التالية" className="w-full h-full object-cover" />
              {/* <div className="absolute top-2 left-10">
                <img src="/imgs/onlyOne.svg" alt="onlyOne" className="w-5 h-5 object-contain" />
              </div> */}
              <div 
  className="absolute top-2 left-10 flex items-center justify-center shadow-md"
  style={{
    width: '40px',
    height: '40px',
    background: '#F3F5FF80',
    border: '2px solid #F3F5FF40',
    borderRadius: '50%',
    opacity: 1,
  }}
>
  <img 
    src="/imgs/onlyOne.svg" 
    alt="onlyOne" 
    style={{
      width: '12px',
      height: '18px',
      opacity: 1,
      // filter: 'brightness(0) saturate(100%)', // لتصبح باللون الأسود
    }} 
  />
</div>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 py-1">
          {images.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-black w-6' : 'bg-gray-300 w-2'
              }`}
            />
          ))}
        </div>

        {/* الجزء السفلي */}
        <div className="px-6 pb-5 pt-2 flex justify-center">
          <div 
            className="flex items-center justify-between relative overflow-hidden"
            style={{ width: '528px', height: '50px', borderRadius: '20px', background: '#F3F5FF' }}
          >
            <button
              onClick={() => onSendWithCaption?.(caption)}
              className="flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
              style={{ width: '64px', height: '50px', borderRadius: '20px 0px 0px 20px', background: '#FFFFFF', border: 'none' }}
              title="إرسال"
            >
              <img src="/imgs/send.svg" alt="إرسال" style={{ width: '18px', height: '18px' }} />
            </button>

            <div className="flex items-center flex-1 px-4 gap-2">
              <input 
                type="text"
                placeholder="اضف وصف..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-right"
                style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '15px', color: '#B6B7B7' }}
              />
              <img src="/imgs/animation-icon.svg" alt="أيقونة" className="shrink-0" style={{ width: '18px', height: '18px' }} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
// interface ImageViewerProps {
//   images: string[];
//   currentIndex: number;
//   onClose: () => void;
//   onNext: () => void;
//   onPrev: () => void;
//   onAddImages?: (newFiles: FileList) => void; 
//   onDeleteImage?: (index: number) => void;  
//   onSendWithCaption?: (caption: string) => void; 
// }

//  // ================= Image Viewer Component =================
// export const ImageViewer: React.FC<ImageViewerProps> = ({ 
//   images, 
//   currentIndex, 
//   onClose, 
//   onNext, 
//   onPrev,
//   onAddImages,
//   onDeleteImage,
//   onSendWithCaption
// }) => {
//   const [caption, setCaption] = useState('');
//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   useEffect(() => {
//     document.body.style.overflow = 'hidden';
//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, []);

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') onClose();
//       if (e.key === 'ArrowRight') onNext();
//       if (e.key === 'ArrowLeft') onPrev();
//     };
//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [onClose, onNext, onPrev]);

//   if (!images.length) return null;

//   const totalImages = images.length;
//   const prevIndex = totalImages > 1 ? (currentIndex - 1 + totalImages) % totalImages : null;
//   const nextIndex = totalImages > 1 ? (currentIndex + 1) % totalImages : null;

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       if (onAddImages) {
//         onAddImages(e.target.files);
//       }
//       e.target.value = '';
//     }
//   };

//   return (
//     <div 
//       className="fixed inset-0 z-[999999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
//       onClick={onClose}
//     >
//       <input 
//         type="file" 
//         ref={fileInputRef} 
//         onChange={handleFileChange} 
//         multiple 
//         accept="image/*" 
//         className="hidden" 
//       />

//       <div 
//         className="relative bg-white rounded-[35px] flex flex-col justify-between overflow-hidden transition-all duration-300"
//         style={{
//           width: '572px',
//           height: '569px',
//           borderRadius: '35px',
//           background: '#FFFFFF',
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* السطر الأول: علامة X + كلمة إرسال صورة + زر الإتمام (+) */}
//         <div className="flex items-center justify-between px-6 py-4">
//           <div className="flex items-center gap-3">
//             <button 
//               onClick={onClose}
//               className="flex items-center justify-center rounded-full transition-all transform hover:scale-105 active:scale-95"
//               style={{
//                 width: '36px',
//                 height: '36px',
//                 background: '#0000001A',
//               }}
//               title="إغلاق"
//             >
//               <img 
//                 src="/imgs/close.svg" 
//                 alt="إغلاق" 
//                 style={{
//                   width: '17px',
//                   height: '17px',
//                 }} 
//               />
//             </button>
//             <span 
//               className="font-medium text-black"
//               style={{
//                 fontFamily: 'Cairo, sans-serif',
//                 fontSize: '25px',
//                 lineHeight: '1',
//                 letterSpacing: '0%',
//                 textAlign: 'right',
//               }}
//             >
//               إرسال صورة
//             </span>
//           </div>

//           <button 
//             onClick={() => fileInputRef.current?.click()}
//             className="flex items-center justify-center rounded-full transition-all transform hover:scale-105 active:scale-95"
//             style={{
//               width: '36px',
//               height: '36px',
//               background: '#F3F5FF',
//             }}
//             title="إضافة صور أخرى من الجهاز"
//           >
//             <img 
//               src="/imgs/Add.svg" 
//               alt="إضافة صورة" 
//               style={{
//                 width: '17px',
//                 height: '17px',
//                 transform: 'rotate(-90deg)',
//               }} 
//             />
//           </button>
//         </div>

//         {/* عرض مجموعة الصور */}
//         <div className="relative flex-1 flex items-center justify-center px-4 overflow-hidden my-auto">
//           {prevIndex !== null && (
//             <div 
//               onClick={onPrev}
//               className="absolute left-6 cursor-pointer opacity-70 hover:opacity-100 transition-all transform -translate-y-1/2 top-1/2"
//               style={{
//                 width: '125px',
//                 height: '255px',
//                 borderRadius: '20px',
//                 overflow: 'hidden',
//                 background: 'linear-gradient(270deg, rgba(255, 255, 255, 0) 14.83%, #FFFFFF 79.89%)',
//               }}
//             >
//               <img src={images[prevIndex]} alt="السابقة" className="w-full h-full object-cover" />
//             </div>
//           )}

//           <div 
//             className="relative flex items-center justify-center transition-all duration-300 z-10"
//             style={{
//               width: '291px',
//               height: '358px',
//               borderRadius: '40px',
//               border: '3px solid #B4B4B9',
//               overflow: 'hidden',
//               background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 38.73%, #000000 85.54%)',
//             }}
//           >
//             <img
//               src={images[currentIndex]}
//               alt={`صورة ${currentIndex + 1}`}
//               className="w-full h-full object-cover"
//             />

//             {onDeleteImage && (
//               <button 
//                 onClick={() => onDeleteImage(currentIndex)}
//                 className="absolute top-3 left-3 bg-black/60 hover:bg-red-600 text-white p-2 rounded-full transition text-xs"
//                 title="حذف الصورة"
//               >
//                 🗑️
//               </button>
//             )}
//           </div>

//           {nextIndex !== null && (
//             <div 
//               onClick={onNext}
//               className="absolute right-6 cursor-pointer opacity-70 hover:opacity-100 transition-all transform -translate-y-1/2 top-1/2"
//               style={{
//                 width: '125px',
//                 height: '255px',
//                 borderRadius: '20px',
//                 overflow: 'hidden',
//                 background: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 14.83%, #FFFFFF 79.89%)',
//               }}
//             >
//               <img src={images[nextIndex]} alt="التالية" className="w-full h-full object-cover" />
//             </div>
//           )}
//         </div>

//         {/* Pagination */}
//         <div className="flex justify-center items-center gap-2 py-1">
//           {images.map((_, index) => (
//             <div
//               key={index}
//               className={`h-2 rounded-full transition-all duration-300 ${
//                 index === currentIndex ? 'bg-black w-6' : 'bg-gray-300 w-2'
//               }`}
//             />
//           ))}
//         </div>

// {/* الجزء السفلي: الحاوية الموحدة بالمقاسات 528×50 */}
//         <div className="px-6 pb-5 pt-2 flex justify-center">
//           <div 
//             className="flex items-center justify-between relative overflow-hidden"
//             style={{
//               width: '528px',
//               height: '50px',
//               borderRadius: '20px',
//               background: '#F3F5FF',
//               opacity: 1,
//             }}
//           >
//             {/* 1. زر الإرسال: أصبح في البداية من جهة اليمين وملتصقاً بحافة الحاوية */}
//             <button
//               onClick={() => onSendWithCaption?.(caption)}
//               className="flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
//               style={{
//                 width: '64px',
//                 height: '50px',
//                 borderRadius: '20px 0px 0px 20px', // انحناء من جهة اليمين ليتطابق مع الحاوية
//                 background: '#FFFFFF',
//                 border: 'none',
//               }}
//               title="إرسال"
//             >
//               <img 
//                 src="/imgs/send.svg" 
//                 alt="إرسال"
//                 style={{
//                   width: '18px',
//                   height: '18px',
//                   opacity: 1,
//                 }} 
//               />
//             </button>

//             {/* 2. حقل الكتابة وأيقونة الحركة: في المساحة المتبقية باتجاه اليسار */}
//             <div className="flex items-center flex-1 px-4 gap-2">
//               <input 
//                 type="text"
//                 placeholder="اضف وصف..."
//                 value={caption}
//                 onChange={(e) => setCaption(e.target.value)}
//                 className="w-full bg-transparent focus:outline-none text-right"
//                 style={{
//                   fontFamily: 'Cairo, sans-serif',
//                   fontWeight: 600,
//                   fontSize: '15px',
//                   lineHeight: '100%',
//                   letterSpacing: '0%',
//                   color: '#B6B7B7', // اللون المطلوب للوصف
//                 }}
//               />
//               <img 
//                 src="/imgs/animation-icon.svg" 
//                 alt="أيقونة"
//                 className="shrink-0"
//                 style={{
//                   width: '18px',
//                   height: '18px',
//                   opacity: 1,
//                 }}
//               />
//             </div>

//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };
 
 
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

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

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
  const [blockConfirmVisible, setBlockConfirmVisible] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [isGroup, setIsGroup] = useState(false);
  const [chatName, setChatName] = useState<string>("");
  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const [showGroupDetails, setShowGroupDetails] = useState(false);
  const [isGroupAdmin, setIsGroupAdmin] = useState(false);
  const [editingField, setEditingField] = useState<'name' | 'description' | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupOwner, setGroupOwner] = useState<any>(null);
  const [groupCreatedAt, setGroupCreatedAt] = useState<string>('');
  const [groupOwnerName, setGroupOwnerName] = useState<string>('');
  const [groupOwnerImg, setGroupOwnerImg] = useState<string>('');
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [activeMemberMenuId, setActiveMemberMenuId] = useState<any>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  // ================= State for pending images =================
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  
  // ================= State for Image Viewer =================
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const [viewerCurrentIndex, setViewerCurrentIndex] = useState(0);
  
  const router = useRouter();

  // دالة التعامل مع الملف المرفق
const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    sendFile(file); // أو دالة الإرسال الخاصة بك
  }
  e.target.value = ""; // لإعادة تعيين الحقل
};

  // ================= Image Viewer Functions =================
  const openImageViewer = useCallback((imageUrl: string, allImages?: string[]) => {
    if (!imageUrl) return;
    
    let images: string[] = [];
    
    if (allImages && allImages.length > 0) {
      images = allImages;
    } else {
      images = messages
        .filter(msg => msg.type === 'image' && msg.media)
        .map(msg => {
          if (typeof msg.media === 'string') {
            return msg.media.startsWith('http') ? msg.media : `${API_BASE}${msg.media}`;
          } else if (msg.media && typeof msg.media === 'object') {
            return (msg.media as any).url || (msg.media as any).fileContent || '';
          }
          return '';
        })
        .filter(url => url && url.length > 0);
      
      if (images.length === 0) {
        images = [imageUrl];
      }
    }
    
    const currentIndex = images.findIndex(img => img === imageUrl);
    const index = currentIndex >= 0 ? currentIndex : 0;
    
    setViewerImages(images);
    setViewerCurrentIndex(index);
    setImageViewerOpen(true);
  }, [messages]);

  const closeImageViewer = useCallback(() => {
    setImageViewerOpen(false);
    setViewerImages([]);
    setViewerCurrentIndex(0);
  }, []);

  const nextImage = useCallback(() => {
    setViewerCurrentIndex(prev => 
      prev >= viewerImages.length - 1 ? 0 : prev + 1
    );
  }, [viewerImages.length]);

  const prevImage = useCallback(() => {
    setViewerCurrentIndex(prev => 
      prev <= 0 ? viewerImages.length - 1 : prev - 1
    );
  }, [viewerImages.length]);

  // ================= دوال معالجة الرسائل =================
  
  const handleReact = useCallback(async (messageId: string, emoji: string) => {
    if (!token || !receiverId) return;
    
    try {
      const res = await fetch(`${API_BASE}/reacttomessage`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reacter: myId,
          messageid: messageId,
        }),
      });
      
      if (res.ok) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId
              ? { ...msg, likes: [...(msg.likes || []), emoji] }
              : msg
          )
        );
        
        wsService.send({
          event: "react",
          metadata: {
            sender: myId,
            messageid: messageId,
            reciever: receiverId,
          },
        });
      }
    } catch (error) {
      console.error('Error reacting to message:', error);
    }
  }, [token, receiverId, myId]);

  const handleEditMessage = useCallback(async (updatedMessage: Message) => {
    if (!token || !receiverId) return;
    
    try {
      const res = await fetch(`${API_BASE}/message/edit`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId: updatedMessage._id,
          message: updatedMessage.message,
          receiver: receiverId,
        }),
      });
      
      if (res.ok) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === updatedMessage._id ? updatedMessage : msg
          )
        );
        toast.success('تم تعديل الرسالة بنجاح');
      } else {
        toast.error('فشل تعديل الرسالة');
      }
    } catch (error) {
      console.error('Error editing message:', error);
      toast.error('فشل تعديل الرسالة');
    }
  }, [token, receiverId]);

  const handleReply = useCallback((message: Message) => {
    setReplyTo(message);
    const input = document.querySelector('input[type="text"]');
    if (input) {
      (input as HTMLInputElement).focus();
    }
    toast.info(`جاري الرد على: ${message.message?.substring(0, 30)}...`);
  }, []);

  const handleTranslate = useCallback(async (message: Message) => {
    if (!message.message) return;
    
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ar&dt=t&q=${encodeURIComponent(message.message)}`;
      const res = await fetch(url);
      const data = await res.json();
      const translated = data[0]?.map((item: any) => item[0]).join('');
      
      if (translated) {
        toast.success(`الترجمة: ${translated}`, {
          duration: 8000,
          position: 'top-center',
        });
      } else {
        toast.error('فشل ترجمة الرسالة');
      }
    } catch (error) {
      console.error('Error translating message:', error);
      toast.error('فشل ترجمة الرسالة');
    }
  }, []);

  const handleDeleteMessage = useCallback(async (message: Message) => {
    if (!token || !receiverId) return;
    
    showConfirmToast(
      'هل أنت متأكد من حذف هذه الرسالة؟',
      async () => {
        try {
          const res = await fetch(`${API_BASE}/message/delete`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messageId: message._id,
              receiver: receiverId,
            }),
          });
          
          if (res.ok) {
            setMessages((prev) => prev.filter((msg) => msg._id !== message._id));
            toast.success('تم حذف الرسالة بنجاح');
          } else {
            toast.error('فشل حذف الرسالة');
          }
        } catch (error) {
          console.error('Error deleting message:', error);
          toast.error('فشل حذف الرسالة');
        }
      },
      undefined,
      'نعم، احذف',
      'إلغاء'
    );
  }, [token, receiverId]);

  // ================= باقي الدوال =================
  
  const handleBlockMember = (member: any) => {
    toast.success(`تم حظر المستخدم ${member.name}`);
  };

  const handleReportMember = (member: any) => {
    toast.info(`تم تقديم بلاغ ضد المستخدم ${member.name}`);
  };

  // ================= جلب المستخدمين المحظورين =================
  const fetchBlockedUsers = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE}/block`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) return;
      const data = await response.json();
      let blockedIds: string[] = [];
      if (data.success && data.response && Array.isArray(data.response)) {
        blockedIds = data.response.map((user: any) => user._id || user.id || user);
      } else if (Array.isArray(data)) {
        blockedIds = data.map((user: any) => user._id || user.id || user);
      }
      setBlockedUsers(blockedIds);
    } catch (error) {
      console.error('Error fetching blocked users:', error);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchBlockedUsers();
    }
  }, [token, fetchBlockedUsers]);

  const isUserBlocked = useCallback((chatId: string) => {
    return blockedUsers.includes(chatId);
  }, [blockedUsers]);

  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      router.replace("/login");
    }
  }, [token, authLoading, router]);

  useEffect(() => {
    if (receiverId) {
      localStorage.setItem("lastChatId", receiverId);
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

  // ================= Helper: Render Group Avatar =================
  const renderGroupAvatar = useCallback((chat: any) => {
    let members = chat?.groupMembers || chat?.members || groupMembers || [];
    
    if (members.length === 0 && receiverData) {
      const currentUser = {
        _id: myId,
        name: 'أنت',
        img: receiverData?.img || '/imgs/user.png',
        avatar: receiverData?.img || '/imgs/user.png',
      };
      const otherUser = {
        _id: receiverId,
        name: receiverData?.name || 'مستخدم',
        img: receiverData?.img || '/imgs/user.png',
        avatar: receiverData?.img || '/imgs/user.png',
      };
      members = [currentUser, otherUser];
    }
    
    const memberCount = members.length;
    
    const getMemberImage = (index: number) => {
      const member = members[index];
      return member?.img || member?.avatar || '/imgs/user.png';
    };

    const GroupIcon = () => (
      <div 
        style={{
          position: 'absolute',
          width: '19px',
          height: '19px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '8px',
          background: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          pointerEvents: 'none',
          // boxShadow: '0px 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <img 
          src="/imgs/Group.svg" 
          alt="Group" 
          style={{
            width: '10.909222602844238px',
            height: '10.909222602844238px',
          }}
        />
      </div>
    );

    if (memberCount < 2) {
      return (
        <div 
          className="relative w-[50px] h-[50px] rounded-[21px] overflow-hidden flex-shrink-0 flex items-center justify-center"
        >
          <img 
            src="/imgs/person1.svg"
            alt="Member" 
            className="w-full h-full object-cover rounded-[21px] p-1" 
          />
          <GroupIcon />
        </div>
      );
    }

    if (memberCount === 2) {
      return (
        <div
          className="relative w-[50px] h-[50px] overflow-hidden flex-shrink-0 rounded-[21px]"
        >
          <img
            src={getMemberImage(1) || "/imgs/person1.svg"}
            alt="Member 1"
            className="absolute object-cover rounded-[15px]"
            style={{
              width: '28.4094px',
              height: '28.4094px',
              top: '7px',
              right: '2px',
              objectFit: 'cover',
              borderRadius: '15px',
              zIndex: 1,
            }}
          />
          <img
            src={getMemberImage(0) || "/imgs/person2.svg"}
            alt="Member 2"
            className="absolute object-cover rounded-[15px]"
            style={{
              width: '28.4094px',
              height: '28.4094px',
              top: '7px',
              left: '2px',
              objectFit: 'cover',
              borderRadius: '15px',
              zIndex: 2,
            }}
          />
          <GroupIcon />
        </div>
      );
    }

    if (memberCount === 3) {
      return (
        <div 
          className="relative w-[50px] h-[50px] overflow-hidden flex-shrink-0 rounded-[21px]"
        >
          <img 
            src={getMemberImage(1) || "/imgs/person1.svg"}
            alt="Member 1" 
            className="absolute object-cover rounded-[15px]"
            style={{
              width: '28.41px',
              height: '28.41px',
              top: '2px',
              right: '5px',
              zIndex: 1,
            }}
          />
          <img 
            src={getMemberImage(2) || "/imgs/person2.svg"}
            alt="Member 2" 
            className="absolute object-cover rounded-[15px]"
            style={{
              width: '28.41px',
              height: '28.41px',
              top: '2px',
              left: '-1px',
              zIndex: 1,
            }}
          />
          <img 
            src={getMemberImage(0) || "/imgs/person2.svg"}
            alt="Member 3" 
            className="absolute object-cover rounded-[15px]"
            style={{
              width: '28.41px',
              height: '28.41px',
              bottom: '2px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 2,
            }}
          />
          <GroupIcon />
        </div>
      );
    }

    if (memberCount === 4) {
      return (
        <div 
          className="relative w-[50px] h-[50px] overflow-hidden flex-shrink-0 rounded-[21px]"
        >
          <img 
            src={getMemberImage(0) || "/imgs/person1.svg"}
            alt="Member 1" 
            className="absolute object-cover rounded-[15px]"
            style={{ width: '28px', height: '28px', top: '1px', left: '1px', zIndex: 3 }}
          />
          <img 
            src={getMemberImage(1) || "/imgs/person2.svg"}
            alt="Member 2" 
            className="absolute object-cover rounded-[15px]"
            style={{ width: '28px', height: '28px', top: '1px', right: '1px', zIndex: 2 }}
          />
          <img 
            src={getMemberImage(2) || "/imgs/person2.svg"}
            alt="Member 3" 
            className="absolute object-cover rounded-[15px]"
            style={{ width: '28px', height: '28px', bottom: '1px', left: '1px', zIndex: 4 }}
          />
          <img 
            src={getMemberImage(3) || "/imgs/person1.svg"}
            alt="Member 4" 
            className="absolute object-cover rounded-[15px]"
            style={{ width: '28px', height: '28px', bottom: '1px', right: '1px', zIndex: 1 }}
          />
          <GroupIcon />
        </div>
      );
    }

    if (memberCount >= 5) {
      const extraCount = memberCount - 3;
      return (
        <div className="relative w-[50px] h-[50px] overflow-hidden flex-shrink-0 rounded-[21px]">
          <img 
            src={getMemberImage(0) || "/imgs/person1.svg"}
            alt="Member 1" 
            className="absolute object-cover rounded-[15px]"
            style={{ width: '28px', height: '28px', top: '1px', left: '1px', zIndex: 3 }}
          />
          <img 
            src={getMemberImage(1) || "/imgs/person2.svg"}
            alt="Member 2" 
            className="absolute object-cover rounded-[15px]"
            style={{ width: '28px', height: '28px', top: '1px', right: '1px', zIndex: 2 }}
          />
          <div 
            className="absolute flex items-center justify-center bg-[#DADADA] text-[#000000] font-bold text-[10px] rounded-[15px]"
            style={{ width: '28px', height: '28px', bottom: '1px', left: '1px', zIndex: 4 }}
          >
            +{extraCount}
          </div>
          <img 
            src={getMemberImage(2) || "/imgs/person1.svg"}
            alt="Member 3" 
            className="absolute object-cover rounded-[15px]"
            style={{
              width: '28px',
              height: '28px',
              bottom: '1px',
              right: '1px',
              zIndex: 1,
            }}
          />
          <GroupIcon />
        </div>
      );
    }

    return (
      <div 
        className="relative w-[50px] h-[50px] rounded-[21px] border border-white overflow-hidden flex-shrink-0"
      >
        <img
          src={receiverData?.img || "/imgs/user.png"}
          className="w-full h-full object-cover rounded-[21px]"
          alt="avatar"
        />
      </div>
    );
  }, [groupMembers, receiverData, myId, receiverId]);

  // ================= جلب بيانات المستخدم =================
  const fetchReceiverData = useCallback(async () => {
    if (!receiverId || !token || !myId) return;
    
    try {
      let currentUserData = null;
      try {
        const currentUserRes = await fetch(`${API_BASE}/users/${myId}`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        if (currentUserRes.ok) {
          const currentUserJson = await currentUserRes.json();
          currentUserData = currentUserJson.userpersonaldata;
        }
      } catch (e) {
        console.error('Failed to fetch current user data:', e);
      }
      
      const chatResponse = await fetch(`${API_BASE}/chats/chats/${myId}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      
      let isGroupChat = false;
      let groupName = '';
      let isAdmin = false;
      
      if (chatResponse.ok) {
        const chatData = await chatResponse.json();
        const chatList = chatData.response || chatData.userchats || [];
        
        const foundChat = chatList.find((chat: any) => {
          const otherId = chat.otherUserId || chat.id;
          return otherId === receiverId;
        });
        
        if (foundChat) {
          isGroupChat = foundChat.chatType === 'group' || foundChat.isGroup === true;
          groupName = foundChat.groupName || foundChat.name || '';
          isAdmin = foundChat.admin === myId || foundChat.owner === myId;
          
          setIsGroup(isGroupChat);
          setIsGroupAdmin(isAdmin);
          
          if (!isGroupChat) {
            const members = foundChat.memberAvatars || foundChat.members || [];
            setGroupMembers(members);
          }
          
          if (isGroupChat && groupName) {
            setChatName(groupName);
          }
        }
      }
      
      if (!isGroupChat) {
        const userResponse = await fetch(`${API_BASE}/users/${receiverId}`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        const userData = await userResponse.json();
        setReceiverData(userData.userpersonaldata);
        
        if (userData.userpersonaldata?.name) {
          setChatName(userData.userpersonaldata.name);
        } else {
          setChatName('مستخدم');
        }
      } else {
        setReceiverData(null);
      }
      
    } catch (error) {
      console.error("Failed to fetch receiver data", error);
    }
  }, [receiverId, token, myId]);

  // ================= جلب بيانات المجموعة =================
  const fetchGroupData = useCallback(async () => {
    if (!receiverId || !token || !isGroup) return;
    
    try {
      const res = await fetch(`${API_BASE}/chats/groups/GetGroup/${receiverId}`, {
        headers: { 
          Authorization: `Bearer ${token}`, 
          Accept: "application/json" 
        },
      });
      
      if (!res.ok) {
        console.error('Failed to fetch group data:', res.status);
        return;
      }
      
      const data = await res.json();
      const groupData = data.response || data;
      
      const ownerMember = groupData.members?.find((m: any) => m.role === 'owner');
      
      if (ownerMember) {
        setGroupOwner(ownerMember);
        setGroupOwnerName(ownerMember.name || 'مستخدم');
        setGroupOwnerImg(ownerMember.image || '');
      }
      
      if (groupData.createdAt) {
        setGroupCreatedAt(groupData.createdAt);
      }
      
      if (groupData.description) {
        setGroupDescription(groupData.description);
      }
      
      if (groupData.members && Array.isArray(groupData.members)) {
        const formattedMembers = groupData.members.map((m: any) => ({
          userId: m.userId,
          name: m.name || 'مستخدم',
          img: m.image || '/imgs/user.png',
          avatar: m.image || '/imgs/user.png',
          isAdmin: m.role === 'admin' || m.role === 'owner',
          isOwner: m.role === 'owner',
          username: m.username || m.name || '',
          role: m.role,
          joinedAt: m.joinedAt,
        }));
        setGroupMembers(formattedMembers);
      }
      
      if (groupData.name) {
        setChatName(groupData.name);
      }
      
      const currentUserMember = groupData.members?.find((m: any) => m.userId === myId);
      const isAdmin = currentUserMember?.role === 'admin' || currentUserMember?.role === 'owner';
      setIsGroupAdmin(isAdmin);
      
    } catch (error) {
      console.error('Error fetching group data:', error);
    }
  }, [receiverId, token, isGroup, myId]);

  useEffect(() => {
    setReceiverData(null);
    fetchReceiverData();
  }, [fetchReceiverData]);

  useEffect(() => {
    if (isGroup && receiverId) {
      fetchGroupData();
    }
  }, [isGroup, receiverId, fetchGroupData]);

  // ================= Helper: Format group members names =================
  const formatGroupMembers = useCallback((members: any[], maxDisplay: number = 5) => {
    if (!members || members.length === 0) return '';
    
    const names = members.map(member => member.name || 'مستخدم');
    
    if (members.length <= maxDisplay) {
      return names.join('، ');
    }
    
    const firstFive = names.slice(0, maxDisplay);
    const remainingCount = members.length - maxDisplay;
    return `${firstFive.join('، ')} +${remainingCount}`;
  }, []);

  // ================= Update group name =================
  const handleUpdateGroupName = useCallback(async () => {
    if (!editName.trim() || !receiverId || !token) return;
    
    try {
      const res = await fetch(`${API_BASE}/chats/groups/update/${receiverId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupName: editName.trim() }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setChatName(editName.trim());
        toast.success('تم تحديث اسم المجموعة بنجاح');
      } else {
        toast.error(`فشل التحديث: ${data.response || data.message || 'خطأ غير معروف'}`);
      }
    } catch (error) {
      console.error('Error updating group name:', error);
      toast.error('حدث خطأ أثناء تحديث اسم المجموعة');
    }
    setEditingField(null);
  }, [editName, receiverId, token]);

  // ================= Update group description =================
  const handleUpdateGroupDescription = useCallback(async () => {
    if (!editDescription.trim() || !receiverId || !token) return;
    
    try {
      const res = await fetch(`${API_BASE}/chats/groups/update/${receiverId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: editDescription.trim() }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setGroupDescription(editDescription.trim());
        toast.success('تم تحديث وصف المجموعة بنجاح');
      } else {
        toast.error(`فشل التحديث: ${data.response || data.message || 'خطأ غير معروف'}`);
      }
    } catch (error) {
      console.error('Error updating group description:', error);
      toast.error('حدث خطأ أثناء تحديث وصف المجموعة');
    }
    setEditingField(null);
  }, [editDescription, receiverId, token]);

  // ================= التحقق من نوع المحادثة =================
  useEffect(() => {
    if (!receiverId || !token || !myId) return;
    
    const checkChatType = async () => {
      try {
        const res = await fetch(`${API_BASE}/chats/chats/${myId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (res.ok) {
          const data = await res.json();
          const chatList = data.response || data.userchats || [];
          const found = chatList.find((chat: any) => {
            const otherId = chat.otherUserId || chat.id;
            return otherId === receiverId;
          });
          
          if (found) {
            const isGroupChat = found.chatType === 'group' || found.isGroup === true;
            setIsGroup(isGroupChat);
          }
        }
      } catch (error) {
        console.error('Error checking chat type:', error);
      }
    };
    
    checkChatType();
  }, [receiverId, token, myId]);

  // ================= Helper: Replace temp message =================
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

  // ================= Send seen event =================
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

      if (payload.event === "message" && payload.metadata) {
        const meta = payload.metadata;
        if (meta.sender === myIdRef.current) return;

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

  // ================= Fetch initial message history =================
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

  // ================= Image upload with multiple files =================
  const sendImageFile = useCallback(async (file: File) => {
    const effMy = myIdRef.current;
    const effRec = receiverIdRef.current;
    if (!effMy || !effRec || !token) return;

    const tempId = `tmp-img-${Date.now()}-${Math.random()}`;
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
    
    // إضافة الرسالة المؤقتة مباشرة إلى messages
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
        // إزالة الصورة من pendingImages بعد نجاح التحميل
        setPendingImages(prev => prev.filter(img => img.file.name !== file.name || img.file.size !== file.size));
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

  // ================= Handle multiple media selection =================
  // استبدل دالة handleSelectMedia بهذه النسخة الموسعة
// app/chats/[receiverId]/page.tsx
const sendFile = useCallback(async (file: File) => {
  const effMy = myIdRef.current;
  const effRec = receiverIdRef.current;
  if (!effMy || !effRec || !token) return;

  // تحديد نوع الملف من الامتداد
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
  
  // خريطة أنواع الملفات
  const fileTypeMap: Record<string, string> = {
    'pdf': 'pdf',
    'doc': 'word',
    'docx': 'word',
    'xls': 'excel',
    'xlsx': 'excel',
    'ppt': 'powerpoint',
    'pptx': 'powerpoint',
    'txt': 'text',
    'zip': 'archive',
    'rar': 'archive',
    '7z': 'archive',
  };
  
  // تحديد نوع الملف، إذا لم يكن معروفاً استخدم 'file'
  const fileType = fileTypeMap[fileExtension] || 'file';

  const tempId = `tmp-file-${Date.now()}-${Math.random()}`;
  
  // إنشاء رسالة مؤقتة مع تحديد النوع الصحيح
  const tempMsg: Message = {
    _id: tempId,
    sender: effMy,
    receiver: effRec,
    timestamp: new Date().toISOString(),
    type: fileType, // ✅ النوع الصحيح للملف (pdf, word, excel, إلخ)
    message: file.name,
    media: file,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    fileExtension: fileExtension.toUpperCase(),
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
            ? { 
                ...m, 
                _id: data.data._id, 
                media: data.data.message[0], 
                uploadProgress: undefined, 
                _sendFailed: false,
                fileName: file.name,
                fileSize: file.size,
                fileExtension: fileExtension.toUpperCase(),
              }
            : m
        )
      );
      setPendingImages(prev => prev.filter(img => img.file.name !== file.name || img.file.size !== file.size));
      toast.success(`تم إرسال الملف: ${file.name}`);
    } else {
      setMessages((prev) => prev.map((m) => (m._id === tempId ? { ...m, _sendFailed: true } : m)));
      toast.error(`فشل إرسال الملف: ${file.name}`);
    }
  };
  
  xhr.onerror = () => {
    setMessages((prev) => prev.map((m) => (m._id === tempId ? { ...m, _sendFailed: true } : m)));
    toast.error(`فشل إرسال الملف: ${file.name}`);
  };
  
  const base64 = await blobToPureBase64(file);
  xhr.send(
    JSON.stringify({
      metadata: { 
        sender: effMy, 
        reicever: effRec, 
        type: fileType, // ✅ النوع الصحيح
        fileName: file.name,
        fileSize: file.size,
        fileMimeType: file.type,
        fileExtension: fileExtension,
        clientTempId: tempId 
      },
      fileData: [{ 
        fileName: file.name, 
        fileContent: `data:${file.type};base64,${base64}`, 
        mimetype: file.type 
      }],
    })
  );
}, [token, blobToPureBase64]);

// ================= Handle multiple media selection =================
const handleSelectMedia = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;
  
  const MAX_FILES = 10;
  const filesToSend = Math.min(files.length, MAX_FILES);
  
  if (files.length > MAX_FILES) {
    toast.warning(`يمكنك إرسال ${MAX_FILES} ملف كحد أقصى`);
  }
  
  const newImages: PendingImage[] = [];
  for (let i = 0; i < filesToSend; i++) {
    const file = files[i];
    const id = `pending-${Date.now()}-${i}`;
    const url = URL.createObjectURL(file);
    newImages.push({ id, file, url });
  }
  
  setPendingImages(prev => [...prev, ...newImages]);
  
  newImages.forEach((img) => {
    // تحديد نوع الملف
    const fileType = img.file.type;
    const fileExtension = img.file.name.split('.').pop()?.toLowerCase() || '';
    
    // التحقق إذا كان الملف صورة
    if (fileType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension)) {
      sendImageFile(img.file);
    } else {
      sendFile(img.file); // ✅ استدعاء sendFile للملفات غير الصورية
    }
  });
  
  e.target.value = "";
}, [sendImageFile, sendFile]); // ✅ تأكد من إضافة sendFile إلى التبعيات
// أضف هذه الدالة بعد sendImageFile
// const sendFile = useCallback(async (file: File) => {
//   const effMy = myIdRef.current;
//   const effRec = receiverIdRef.current;
//   if (!effMy || !effRec || !token) return;

//   // تحديد نوع الملف من الامتداد
//   const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
//   let fileType = 'file';
//   if (['pdf'].includes(fileExtension)) fileType = 'pdf';
//   else if (['doc', 'docx'].includes(fileExtension)) fileType = 'word';
//   else if (['xls', 'xlsx'].includes(fileExtension)) fileType = 'excel';
//   else if (['ppt', 'pptx'].includes(fileExtension)) fileType = 'powerpoint';
//   else if (['txt'].includes(fileExtension)) fileType = 'text';
//   else if (['zip', 'rar', '7z'].includes(fileExtension)) fileType = 'archive';

//   const tempId = `tmp-file-${Date.now()}-${Math.random()}`;
//   const tempMsg: Message = {
//     _id: tempId,
//     sender: effMy,
//     receiver: effRec,
//     timestamp: new Date().toISOString(),
//     type: fileType,
//     message: file.name,
//     media: file,
//     fileName: file.name,
//     fileSize: file.size,
//     fileType: file.type,
//     uploadProgress: 0,
//     _optimistic: true,
//   };
  
//   setMessages((prev) => [...prev, tempMsg]);

//   const xhr = new XMLHttpRequest();
//   xhr.open("POST", `${API_BASE}/message/send_media`);
//   xhr.setRequestHeader("Authorization", `Bearer ${token}`);
//   xhr.setRequestHeader("Content-Type", "application/json");
  
//   xhr.upload.onprogress = (ev) => {
//     if (ev.lengthComputable) {
//       const percent = Math.round((ev.loaded / ev.total) * 100);
//       setMessages((prev) => prev.map((m) => (m._id === tempId ? { ...m, uploadProgress: percent } : m)));
//     }
//   };
  
//   xhr.onload = () => {
//     if (xhr.status >= 200 && xhr.status < 300) {
//       const data = JSON.parse(xhr.responseText);
//       sentMessageIdsRef.current.add(data.data._id);
//       setMessages((prev) =>
//         prev.map((m) =>
//           m._id === tempId
//             ? { ...m, _id: data.data._id, media: data.data.message[0], uploadProgress: undefined, _sendFailed: false }
//             : m
//         )
//       );
//       setPendingImages(prev => prev.filter(img => img.file.name !== file.name || img.file.size !== file.size));
//     } else {
//       setMessages((prev) => prev.map((m) => (m._id === tempId ? { ...m, _sendFailed: true } : m)));
//     }
//   };
  
//   xhr.onerror = () => {
//     setMessages((prev) => prev.map((m) => (m._id === tempId ? { ...m, _sendFailed: true } : m)));
//   };
  
//   const base64 = await blobToPureBase64(file);
//   xhr.send(
//     JSON.stringify({
//       metadata: { 
//         sender: effMy, 
//         reicever: effRec, 
//         type: fileType,
//         fileName: file.name,
//         fileSize: file.size,
//         fileMimeType: file.type,
//         clientTempId: tempId 
//       },
//       fileData: [{ 
//         fileName: file.name, 
//         fileContent: `data:${file.type};base64,${base64}`, 
//         mimetype: file.type 
//       }],
//     })
//   );
// }, [token]);
// app/chats/[receiverId]/page.tsx

// ================= Send File =================
  // const handleSelectMedia = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = e.target.files;
  //   if (!files || files.length === 0) return;
    
  //   const MAX_FILES = 10;
  //   const filesToSend = Math.min(files.length, MAX_FILES);
    
  //   if (files.length > MAX_FILES) {
  //     toast.warning(`يمكنك إرسال ${MAX_FILES} صور كحد أقصى`);
  //   }
    
  //   const newImages: PendingImage[] = [];
  //   for (let i = 0; i < filesToSend; i++) {
  //     const file = files[i];
  //     const id = `pending-${Date.now()}-${i}`;
  //     const url = URL.createObjectURL(file);
  //     newImages.push({ id, file, url });
  //   }
    
  //   setPendingImages(prev => [...prev, ...newImages]);
    
  //   newImages.forEach((img) => {
  //     sendImageFile(img.file);
  //   });
    
  //   e.target.value = "";
  // }, [sendImageFile]);

  // ================= Cancel pending images =================
  const cancelPendingImages = useCallback(() => {
    pendingImages.forEach(img => URL.revokeObjectURL(img.url));
    setPendingImages([]);
    setMessages(prev => prev.filter(msg => !msg._optimistic));
  }, [pendingImages]);

  // ================= Cleanup pending image URLs =================
  useEffect(() => {
    return () => {
      pendingImages.forEach(img => URL.revokeObjectURL(img.url));
    };
  }, [pendingImages]);

  // ================= Handle send sticker =================
  const handleSendSticker = useCallback(async (stickerUrl: string) => {
    const res = await fetch(stickerUrl);
    const blob = await res.blob();
    const file = new File([blob], `sticker-${Date.now()}.png`, { type: "image/png" });
    sendImageFile(file);
  }, [sendImageFile]);

  // ================= حظر المستخدم =================
  const handleBlockUser = useCallback(async () => {
    if (!receiverId || !myId || !token) return;
    
    const isBlocked = isUserBlocked(receiverId);
    const userName = chatName || receiverData?.name || 'هذا المستخدم';
    
    const confirmMessage = isBlocked 
      ? ` أنت على وشك رفع الحظر عن "${userName}"\n\nبعد رفع الحظر، سيتمكن هذا المستخدم من التواصل معك مرة أخرى.`
      : `أنت على وشك حظر "${userName}"\n\nبعد الحظر، لن يتمكن هذا المستخدم من التواصل معك أو رؤية نشاطك.`;
    
    showConfirmToast(
      confirmMessage,
      async () => {
        try {
          const url = isBlocked 
            ? `${API_BASE}/unblock${myId}` 
            : `${API_BASE}/block${myId}`;
          
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ blockedid: receiverId }),
          });

          if (res.ok) {
            const message = isBlocked ? ' تم رفع الحظر عن المستخدم بنجاح' : ' تم حظر المستخدم بنجاح';
            toast.success(message);
            
            if (isBlocked) {
              setBlockedUsers(prev => prev.filter(id => id !== receiverId));
              setIBlockedHim(false);
              localStorage.removeItem(`blocked_${receiverId}`);
            } else {
              setBlockedUsers(prev => [...prev, receiverId as string]);
              setIBlockedHim(true);
              localStorage.setItem(`blocked_${receiverId}`, 'true');
            }
          } else {
            toast.error(`فشل ${isBlocked ? 'رفع الحظر' : 'الحظر'}`);
          }
        } catch (error) {
          console.error("Failed to block/unblock user", error);
          toast.error("حدث خطأ أثناء محاولة تنفيذ العملية");
        }
        setShowMenu(false);
      },
      () => {
        setShowMenu(false);
        toast(`تم إلغاء ${isBlocked ? 'رفع الحظر' : 'الحظر'}`, {
          icon: '↩️',
          duration: 2000,
        });
      },
      isBlocked ? 'نعم، أرفع الحظر' : 'نعم، أحظر',
      'إلغاء'
    );
  }, [receiverId, myId, token, chatName, receiverData, isUserBlocked]);

  // ================= إبلاغ عن المستخدم =================
  const handleReport = useCallback(() => {
    setBlockConfirmVisible(true);
    setShowMenu(false);
  }, []);

  // ================= تأكيد الحظر =================
  const handleConfirmBlock = useCallback(async () => {
    await handleBlockUser();
    setBlockConfirmVisible(false);
  }, [handleBlockUser]);

  // ================= إلغاء الحظر =================
  const handleCancelBlock = useCallback(() => {
    setBlockConfirmVisible(false);
  }, []);

  // ================= حذف المحادثة =================
  const handleDeleteChat = useCallback(async () => {
    if (!receiverId || !token) return;
    
    const chatNameToShow = chatName || receiverData?.name || 'هذه المحادثة';
    const isGroupChat = isGroup;
    
    const confirmMessage = isGroupChat
      ? `أنت على وشك حذف المجموعة "${chatNameToShow}" بالكامل\n\nسيتم حذف جميع الرسائل والمحتوى الخاص بالمجموعة، ولن تتمكن من استعادتها بعد الحذف.`
      : ` أنت على وشك حذف المحادثة مع "${chatNameToShow}"\n\nسيتم حذف جميع الرسائل والمحتوى الخاص بالمحادثة، ولن تتمكن من استعادتها بعد الحذف.`;
    
    showConfirmToast(
      confirmMessage,
      async () => {
        try {
          const res = await fetch(`${API_BASE}/chats/chats/delete`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              chatId: receiverId,
              chatType: isGroupChat ? 'group' : 'private'
            })
          });

          const data = await res.json();
          
          if (data.success) {
            toast.success(' تم حذف المحادثة بنجاح');
            router.push('/chats');
          } else {
            toast.error(`فشل حذف المحادثة: ${data.response || data.message || 'خطأ غير معروف'}`);
          }
        } catch (error) {
          console.error('Error deleting chat:', error);
          toast.error('حدث خطأ أثناء محاولة حذف المحادثة');
        }
        setShowMenu(false);
      },
      () => {
        setShowMenu(false);
        toast('تم إلغاء عملية الحذف', {
          icon: '↩️',
          duration: 2000,
        });
      },
      'نعم، احذف',
      'إلغاء'
    );
  }, [receiverId, token, chatName, receiverData, isGroup, router]);

  // ================= الخروج من المجموعة =================
  const handleLeaveGroup = useCallback(async () => {
    if (!receiverId || !token || !isGroup) return;
    
    const groupNameToShow = chatName || receiverData?.name || 'المجموعة';
    
    showConfirmToast(
      ` أنت على وشك الخروج من المجموعة "${groupNameToShow}"\n\nبعد الخروج، لن تتمكن من رؤية الرسائل الجديدة أو التفاعل مع أعضاء المجموعة.`,
      async () => {
        try {
          const res = await fetch(`${API_BASE}/chats/groups/LeaveGroup/${receiverId}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          const data = await res.json();

          if (data.success) {
            toast.success(' تم الخروج من المجموعة بنجاح');
            router.push('/chats');
          } else if (data.response && data.response.toLowerCase().includes('transfer ownership')) {
            toast.info('يجب تحويل ملكية المجموعة أولاً');
          } else {
            toast.error(`فشل الخروج من المجموعة: ${data.response || data.message || 'خطأ غير معروف'}`);
          }
        } catch (error) {
          console.error('Error leaving group:', error);
          toast.error('حدث خطأ أثناء محاولة الخروج من المجموعة');
        }
        setShowMenu(false);
      },
      () => {
        setShowMenu(false);
        toast('تم إلغاء الخروج من المجموعة', {
          icon: '↩️',
          duration: 2000,
        });
      },
      'نعم، أخرج',
      'إلغاء'
    );
  }, [receiverId, token, chatName, receiverData, isGroup, router]);

  // ================= طلب مشرف في المجموعة =================
  const handleRequestAdmin = useCallback(async () => {
    if (!receiverId || !token || !isGroup) return;
    
    try {
      const res = await fetch(`${API_BASE}/chats/groups/RequestAdmin/${receiverId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success('✅ تم إرسال طلب المشرف إلى مدير المجموعة بنجاح');
      } else {
        toast.error(`❌ فشل طلب المشرف: ${data.response || data.message || 'خطأ غير معروف'}`);
      }
    } catch (error) {
      console.error('Error requesting admin:', error);
      toast.error('حدث خطأ أثناء محاولة طلب المشرف');
    }
    setShowMenu(false);
  }, [receiverId, token, isGroup]);

  // ================= WaveSurfer effect =================
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

  // ================= Cleanup =================
  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  // ================= التحقق من الحظر =================
  useEffect(() => {
    if (!receiverId) return;
    const blocked = localStorage.getItem(`blocked_${receiverId}`);
    if (blocked === 'true') {
      setIBlockedHim(true);
    } else {
      setIBlockedHim(false);
    }
  }, [receiverId]);

  // ================= UI flags =================
  const isTyping = text.trim().length > 0;
  const canShowMic = !isTyping && !isRecording && !audioBlob && !recordingStopped;
  const canShowRecordingUI = !isTyping && isRecording;
  const canSendVoice = !isTyping && recordingStopped && audioBlob;
  const shouldHideInput = iBlockedHim === true || !myId || !receiverId;
  const isUserCurrentlyBlocked = receiverId ? isUserBlocked(receiverId) : false;

  if (authLoading) return <div className="p-4">جاري التحميل...</div>;
  if (!myId || !token) return <div className="p-4 text-center">يرجى تسجيل الدخول</div>;

  // ================= Render =================
  return (
    <div className="relative" style={{ margin: "0 auto" }}>
      {/* Header */}
      <header className="flex items-center justify-between px-4 mb-4 pb-2">
        <div className="flex items-center justify-start gap-3">
          <img 
            src="/imgs/prv.svg" 
            className="w-[11px] h-[18px] object-cover cursor-pointer" 
            alt="back" 
            onClick={() => router.back()} 
          />
          
          <div className="relative inline-block">
            <div 
              onClick={() => {
                if (isGroup) {
                  setShowGroupDetails(!showGroupDetails);
                } else {
                  router.push(`/profile/${receiverId}`);
                }
              }}
              className="cursor-pointer"
            >
              {isGroup ? (
                renderGroupAvatar({
                  groupMembers: groupMembers,
                  members: groupMembers,
                })
              ) : (
                <img 
                  src={receiverData?.img || "/imgs/user.png"} 
                  className="w-[50px] h-[50px] rounded-[21px] object-cover" 
                  alt="avatar" 
                />
              )}
            </div>

            {/* ================= Group Details Dropdown ================= */}
            {showGroupDetails && isGroup && (
              <div 
                className="absolute z-[99999]"
                style={{
                  top: '100%',
                  marginTop: '4px',
                  width: '432px',
                  maxHeight: '550px',
                  borderRadius: '35px',
                  background: '#F5F5F5',
                  padding: '24px 20px',
                  overflowY: 'auto',
                  // boxShadow: '0 10px 40px rgba(0,0,0,0.25)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* زر الإغلاق والعنوان معاً */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setShowGroupDetails(false)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0000001A] hover:bg-black/20 flex-shrink-0"
                  >
                    <img src="/imgs/close.svg" alt="إغلاق" className="w-[14px] h-[14px]" />
                  </button>
                  
                  <h2 
                    className="text-right flex-1"
                    style={{
                      fontFamily: 'Cairo',
                      fontWeight: 500,
                      fontSize: '25px',
                      lineHeight: '100%',
                      textAlign: 'right',
                      color: '#000000',
                      marginRight: '10px',
                    }}
                  >
                    تفاصيل المجموعة
                  </h2>
                </div>

                {/* صور الأعضاء */}
                <div className="flex items-center justify-center gap-2 mb-4 overflow-x-auto pb-2">
                  {groupMembers.length >= 2 ? (
                    <div className="relative w-[80px] h-[80px] rounded-[21px] overflow-hidden flex-shrink-0">
                      <img
                        src={groupMembers[0]?.img || groupMembers[0]?.avatar || '/imgs/user.png'}
                        alt="member"
                        className="absolute object-cover"
                        style={{
                          width: '45px',
                          height: '45px',
                          top: '1px',
                          left: '1px',
                          borderRadius: '15px',
                          zIndex: 3,
                        }}
                      />
                      <img
                        src={groupMembers[1]?.img || groupMembers[1]?.avatar || '/imgs/user.png'}
                        alt="member"
                        className="absolute object-cover"
                        style={{
                          width: '45px',
                          height: '45px',
                          top: '1px',
                          right: '1px',
                          borderRadius: '15px',
                          zIndex: 2,
                        }}
                      />
                      {groupMembers.length >= 3 && (
                        <img
                          src={groupMembers[2]?.img || groupMembers[2]?.avatar || '/imgs/user.png'}
                          alt="member"
                          className="absolute object-cover"
                          style={{
                            width: '45px',
                            height: '45px',
                            bottom: '1px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            borderRadius: '15px',
                            zIndex: 4,
                          }}
                        />
                      )}
                      {groupMembers.length >= 4 && (
                        <img
                          src={groupMembers[3]?.img || groupMembers[3]?.avatar || '/imgs/user.png'}
                          alt="member"
                          className="absolute object-cover"
                          style={{
                            width: '45px',
                            height: '45px',
                            bottom: '1px',
                            right: '1px',
                            borderRadius: '15px',
                            zIndex: 1,
                          }}
                        />
                      )}
                      {groupMembers.length >= 5 && (
                        <div 
                          className="absolute flex items-center justify-center bg-[#DADADA] text-[#000000] font-bold"
                          style={{
                            width: '45px',
                            height: '45px',
                            bottom: '1px',
                            right: '1px',
                            borderRadius: '15px',
                            zIndex: 1,
                            fontSize: '16px',
                          }}
                        >
                          +{groupMembers.length - 3}
                        </div>
                      )}
                      <div 
                        style={{
                          position: 'absolute',
                          width: '30px',
                          height: '30px',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          borderRadius: '10px',
                          background: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 10,
                          pointerEvents: 'none',
                          // boxShadow: '0px 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        <img 
                          src="/imgs/Group.svg" 
                          alt="Group" 
                          style={{
                            width: '18px',
                            height: '18px',
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <img 
                      src={groupMembers[0]?.img || groupMembers[0]?.avatar || '/imgs/user.png'} 
                      className="w-[80px] h-[80px] rounded-[21px] object-cover border-2 border-white" 
                      alt="avatar" 
                    />
                  )}
                </div>

                {/* اسم المجموعة مع علامة القلم للأدمن */}
                <div className="flex items-center justify-center gap-2 mb-0">
                  {editingField === 'name' ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-3 py-1 rounded-lg border border-gray-300 focus:outline-none focus:border-[#D72229] text-center"
                        style={{
                          fontFamily: 'Cairo',
                          fontSize: '18px',
                          fontWeight: 600,
                        }}
                        autoFocus
                      />
                      <button
                        onClick={handleUpdateGroupName}
                        className="px-4 py-1 bg-[#D72229] text-white rounded-lg text-sm hover:bg-[#b81e24] transition"
                      >
                        حفظ
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        className="px-4 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition"
                      >
                        إلغاء
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 
                        className="text-center"
                        style={{
                          fontFamily: 'Cairo',
                          fontWeight: 600,
                          fontSize: '20px',
                          lineHeight: '100%',
                          textAlign: 'center',
                          color: '#000000',
                        }}
                      >
                        {chatName || 'مجموعة'}
                      </h3>
                      {isGroupAdmin && (
                        <button 
                          onClick={() => {
                            setEditName(chatName || '');
                            setEditingField('name');
                          }}
                          className="w-6 h-6 flex items-center justify-center"
                        >
                          <img src="/imgs/edit.svg" alt="تعديل" className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>

                {/* عدد الأشخاص */}
                <p 
                  className="text-center mb-2 mt-2"
                  style={{
                    fontFamily: 'Cairo',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '100%',
                    textAlign: 'center',
                    color: '#B4B4B9',
                  }}
                >
                  مجموعة &nbsp;
                  <span style={{ color: '#D72229', fontWeight: 600 }}>
                    {groupMembers.length} &nbsp;
                    {groupMembers.length === 1 ? 'شخص' : groupMembers.length === 2 ? 'شخصان' : groupMembers.length >= 3 && groupMembers.length <= 10 ? 'أشخاص' : 'شخص'}
                  </span>
                </p>

                {/* تم إنشاء المجموعة بواسطة */}
                <div className="text-center mb-4">
                  <p 
                    style={{
                      fontFamily: 'Cairo',
                      fontWeight: 600,
                      fontSize: '13px',
                      lineHeight: '100%',
                      textAlign: 'right',
                      color: '#000000',
                      letterSpacing: '0.5px',
                    }}
                  >
                    تم إنشاء المجموعة بواسطة &nbsp;
                    <span style={{ color: '#7C7D7E', fontSize: '11px', fontWeight: 500 }}>
                      {groupOwnerName || 'مستخدم'} 
                      {' '}في{' '} &nbsp;
                    </span>
                    <span style={{ color: '#7C7D7E', fontSize: '11px', fontWeight: 500 }}>
                      {groupCreatedAt 
                        ? new Date(groupCreatedAt).toLocaleDateString('ar-EG', { 
                            year: 'numeric', 
                            month: '2-digit', 
                            day: '2-digit' 
                          })
                        : new Date().toLocaleDateString('ar-EG', { 
                            year: 'numeric', 
                            month: '2-digit', 
                            day: '2-digit' 
                          })
                      }
                    </span>
                    ،{' '}
                    <span style={{ color: '#7C7D7E', fontSize: '11px', fontWeight: 500 }}>
                      {groupCreatedAt 
                        ? new Date(groupCreatedAt).toLocaleTimeString('ar-EG', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })
                        : new Date().toLocaleTimeString('ar-EG', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })
                      }
                    </span>
                  </p>
                </div>

                {/* وصف المجموعة مع علامة القلم للأدمن */}
                <div className="mb-4">
                  {editingField === 'description' ? (
                    <div className="flex flex-col items-start gap-2">
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#D72229] text-right"
                        style={{
                          fontFamily: 'Cairo',
                          fontSize: '14px',
                          minHeight: '60px',
                        }}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdateGroupDescription}
                          className="px-4 py-1 bg-[#D72229] text-white rounded-lg text-sm hover:bg-[#b81e24] transition"
                        >
                          حفظ
                        </button>
                        <button
                          onClick={() => setEditingField(null)}
                          className="px-4 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition"
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                      <p 
                        className="text-right"
                        style={{
                          fontFamily: 'Cairo',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '100%',
                          textAlign: 'right',
                          color: '#000000',
                        }}
                      >
                        {groupDescription || receiverData?.description || receiverData?.bio || 'لا يوجد وصف للمجموعة'}
                      </p>
                      {isGroupAdmin && (
                        <button 
                          onClick={() => {
                            setEditDescription(groupDescription || receiverData?.description || receiverData?.bio || '');
                            setEditingField('description');
                          }}
                          className="w-5 h-5 flex items-center justify-center flex-shrink-0"
                        >
                          <img src="/imgs/edit.svg" alt="تعديل" className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* خط فاصل تحت الوصف */}
                <div 
                  className="w-full"
                  style={{
                    width: '100%',
                    height: '3px',
                    opacity: 1,
                    borderTop: '0.33px solid #3C3C434D',
                    marginTop: '12px',
                    marginBottom: '16px',
                  }}
                />

                {/* أيقونات الإجراءات */}
                <div className="flex items-center justify-center mb-1 py-1 -mt-2 flex-wrap gap-2">
                  {/* مكالمة */}
                  <button 
                    className="flex flex-col items-center gap-1 group transition-all duration-200"
                    onClick={() => {
                      setShowGroupDetails(false);
                      toast.info('جاري الاتصال بالمجموعة...');
                    }}
                  >
                    <div className="w-[45px] h-[45px] rounded-full bg-[#FFFFFF] flex items-center justify-center group-hover:bg-[#F5F5F5] transition-all duration-200">
                      <img src="/imgs/phoneChat.svg" alt="مكالمة" className="w-[18px] h-[18px]" />
                    </div>
                    <span className="text-[10px] text-[#B4B4B9]">مكالمة</span>
                  </button>

                  {/* بحث */}
                  <button 
                    className="flex flex-col items-center gap-1 group transition-all duration-200"
                    onClick={() => {
                      setShowGroupDetails(false);
                      toast.info('جاري البحث في المجموعة...');
                    }}
                  >
                    <div className="w-[45px] h-[45px] rounded-full bg-[#FFFFFF] flex items-center justify-center  group-hover:bg-[#F5F5F5] transition-all duration-200">
                      <img src="/imgs/search.svg" alt="بحث" className="w-[18px] h-[18px]" />
                    </div>
                    <span className="text-[10px] text-[#B4B4B9]">بحث</span>
                  </button>

                  {/* إضافة - تظهر فقط للأدمن */}
                  {isGroupAdmin && (
                    <button 
                      className="flex flex-col items-center gap-1 group transition-all duration-200"
                      onClick={() => {
                        setShowGroupDetails(false);
                        toast.info('جاري إضافة أشخاص إلى المجموعة...');
                      }}
                    >
                      <div className="w-[45px] h-[45px] rounded-full bg-[#FFFFFF] flex items-center justify-center group-hover:bg-[#F5F5F5] transition-all duration-200">
                        <img src="/imgs/addperson.svg" alt="إضافة" className="w-[18px] h-[18px]" />
                      </div>
                      <span className="text-[10px] text-[#B4B4B9]">إضافة</span>
                    </button>
                  )}

                  {/* أرشفة */}
                  <button 
                    className="flex flex-col items-center gap-1 group transition-all duration-200"
                    onClick={() => {
                      setShowGroupDetails(false);
                      toast.info('جاري أرشفة المجموعة...');
                    }}
                  >
                    <div className="w-[45px] h-[45px] rounded-full bg-[#FFFFFF] flex items-center justify-center group-hover:bg-[#F5F5F5] transition-all duration-200">
                      <img src="/imgs/archiveIntrChat.svg" alt="أرشفة" className="w-[18px] h-[18px]" />
                    </div>
                    <span className="text-[10px] text-[#B4B4B9]">أرشفة</span>
                  </button>

                  {/* إعدادات - مع قائمة منسدلة */}
                  <div className="relative settings-menu-container">
                    <button 
                      className="flex flex-col items-center gap-1 group transition-all duration-200"
                      onClick={() => {
                        setShowSettingsMenu(!showSettingsMenu);
                      }}
                    >
                      <div className="w-[45px] h-[45px] rounded-full bg-[#FFFFFF] flex items-center justify-center  group-hover:bg-[#F5F5F5] transition-all duration-200">
                        <img src="/imgs/proChat.svg" alt="إعدادات" className="w-[18px] h-[18px]" />
                      </div>
                      <span className="text-[10px] text-[#B4B4B9]">إعدادات</span>
                    </button>

                    {/* قائمة الإعدادات المنسدلة */}
                    {showSettingsMenu && (
                      <div 
                        className="absolute z-[99999] top-full left-1/2 -translate-x-1/2 mt-2"
                        style={{
                          width: '154px',
                          borderRadius: '20px',
                          backgroundColor: "#F5F5F5",
                          // boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          padding: '4px 0',
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            setShowSettingsMenu(false);
                            setShowGroupDetails(false);
                            handleBlockUser();
                          }}
                          className="w-full px-2 py-3 text-sm hover:bg-[#FFFFFF] flex items-center justify-between gap-2 rounded-t-[8px] transition"
                          style={{
                            borderBottom: '0.33px solid #3C3C434D',
                          }}
                        >
                          <span className="font-semibold text-[15px] text-black">
                            {isUserCurrentlyBlocked ? 'رفع الحظر' : 'حظر'}
                          </span>
                          <img 
                            src="/imgs/block.svg" 
                            alt={isUserCurrentlyBlocked ? "رفع الحظر" : "حظر"} 
                            className="w-4 h-4" 
                          />
                        </button>

                        <button
                          onClick={() => {
                            setShowSettingsMenu(false);
                            setShowGroupDetails(false);
                            handleReport();
                          }}
                          className="w-full px-2 py-3 text-sm hover:bg-[#FFFFFF] flex items-center justify-between gap-2 transition"
                          style={{
                            borderBottom: '0.33px solid #3C3C434D',
                          }}
                        >
                          <span className="font-semibold text-[15px] text-black">إبلاغ</span>
                          <img src="/imgs/report.svg" alt="إبلاغ" className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setShowSettingsMenu(false);
                            setShowGroupDetails(false);
                            handleDeleteChat();
                          }}
                          className="w-full px-2 py-3 text-sm hover:bg-[#FFFFFF] flex items-center justify-between gap-2 transition"
                        >
                          <span className="font-semibold text-[15px] text-[#D72229]">حذف الدردشة</span>
                          <img src="/imgs/delete.svg" alt="حذف" className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* خروج */}
                  <button 
                    className="flex flex-col items-center gap-1 group transition-all duration-200"
                    onClick={() => {
                      setShowGroupDetails(false);
                      handleLeaveGroup();
                    }}
                  >
                    <div className="w-[45px] h-[45px] rounded-full bg-[#FFFFFF] flex items-center justify-center  group-hover:bg-[#F5F5F5] transition-all duration-200">
                      <img src="/imgs/leave.svg" alt="خروج" className="w-[18px] h-[18px]" />
                    </div>
                    <span className="text-[10px] text-[#B4B4B9]">خروج</span>
                  </button>
                </div>

                {/* قسم أعضاء المجموعة */}
                <div className="flex-1 overflow-y-auto" style={{ maxHeight: '150px' }}>
                  <div className="flex items-center justify-between mb-2">
                    <p 
                      className="text-right"
                      style={{
                        fontFamily: 'Cairo',
                        fontWeight: 600,
                        fontSize: '14px',
                        lineHeight: '100%',
                        textAlign: 'right',
                        color: '#000000',
                      }}
                    >
                      أعضاء المجموعة
                    </p>
                    <button
                      onClick={() => {
                        toast.info('جاري البحث عن الأعضاء...');
                      }}
                      className="w-6 h-6 flex items-center justify-center flex-shrink-0"
                    >
                      <img src="/imgs/search_mem.svg" alt="بحث" className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <img
                        src='/imgs/addperson.svg'
                        alt="صورة المستخدم"
                        className="w-[13px] h-[13px] object-cover"
                      />
                      <span className="text-sm font-semibold text-black">
                        عدد الاعضاء 
                      </span>
                    </div>
                    <p 
                      className="text-right"
                      style={{
                        fontFamily: 'Cairo',
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '100%',
                        textAlign: 'right',
                        color: '#B4B4B9',
                      }}
                    >
                      {groupMembers.length} {groupMembers.length === 1 ? 'شخص' : groupMembers.length === 2 ? 'شخصان' : groupMembers.length >= 3 && groupMembers.length <= 10 ? 'أشخاص' : 'شخص'}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    {groupMembers.map((member: any, index: number) => {
                      const isMemberMenuOpen = activeMemberMenuId === (member.userId || index);

                      return (
                        <div 
                          key={member.userId || index}
                          className="flex items-center justify-between p-2 rounded-[15px] hover:bg-white/50 transition-colors relative"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={member.img || member.avatar || '/imgs/user.png'}
                              alt={member.name}
                              className="w-[40px] h-[40px] rounded-[15px] object-cover"
                            />
                            <div className="flex flex-col text-right">
                              <span 
                                className="text-sm font-semibold text-black"
                                style={{ fontFamily: 'Cairo' }}
                              >
                                {member.name || 'مستخدم'}
                              </span>
                              <span 
                                className="text-[10px] text-[#B4B4B9]"
                                style={{ fontFamily: 'Cairo' }}
                              >
                                @{member.username || member.name || 'مستخدم'}
                              </span>
                              {member.userId === myId && (
                                <span 
                                  className="text-[10px] text-[#D72229]"
                                  style={{ fontFamily: 'Cairo' }}
                                >
                                  أنت
                                </span>
                              )}
                            </div>
                          </div>

                          {member.userId !== myId && (
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMemberMenuId(isMemberMenuOpen ? null : (member.userId || index));
                                }}
                                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
                              >
                                <img src="/imgs/setting (3).svg" alt="إعدادات العضو" className="w-4 h-4" />
                              </button>

                              {isMemberMenuOpen && (
                                <div 
                                  className="absolute left-0 top-full mt-1 z-[99999]"
                                  style={{
                                    width: '130px',
                                    borderRadius: '15px',
                                    backgroundColor: "#F5F5F5",
                                    // boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    padding: '4px 0',
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button
                                    onClick={() => {
                                      setActiveMemberMenuId(null);
                                      handleBlockMember(member);
                                    }}
                                    className="w-full px-3 py-2 text-sm hover:bg-white flex items-center justify-between transition"
                                    style={{ borderBottom: '0.33px solid #3C3C434D' }}
                                  >
                                    <span className="font-semibold text-[13px] text-black">حظر</span>
                                    <img src="/imgs/block.svg" alt="حظر" className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => {
                                      setActiveMemberMenuId(null);
                                      handleReportMember(member);
                                    }}
                                    className="w-full px-3 py-2 text-sm hover:bg-white flex items-center justify-between transition"
                                  >
                                    <span className="font-semibold text-[13px] text-[#D72229]">إبلاغ</span>
                                    <img src="/imgs/report.svg" alt="إبلاغ" className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col text-right">
            <h3 className="text-[15px] my-0">
              {chatName || receiverData?.name || (isGroup ? 'مجموعة' : 'مستخدم')}
            </h3>
            
            {isGroup && groupMembers.length > 0 && (
              <div className="text-xs text-[#B4B4B9] max-w-[180px] truncate" dir="rtl">
                {formatGroupMembers(groupMembers, 5)}
              </div>
            )}
            
            {!isGroup && (
              <bdi className="text-xs text-[#B4B4B9]">
                @{receiverData?.username}
              </bdi>
            )}
          </div>
        </div>
        <div className="flex items-center justify-start gap-2 relative">
          <div className="rounded-[17px] bg-[#F5F5F5] w-[40px] h-[40px] flex items-center justify-center cursor-pointer">
            <img src="/imgs/phoneChat.svg" className="w-[16px] h-[16px]" alt="phoneChat" />
          </div>
          <div className="rounded-[17px] bg-[#F5F5F5] w-[40px] h-[40px] flex items-center justify-center cursor-pointer relative">
            <img 
              src="/imgs/optionChat.svg" 
              onClick={() => setShowMenu((prev) => !prev)} 
              className="w-[16px] h-[16px]" 
              alt="dots" 
            />
          </div>
        </div>
      </header>

      {error && <div className="text-red-500 text-sm mb-2 px-4">{error}</div>}

      {/* Message List or Empty State */}
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-225px)]">
          <img 
            src={receiverData?.private ? "/icons/privatechat.svg" : "/icons/empty.svg"} 
            className="w-[82.5px]" 
            alt="empty" 
          />
          <h3 className="text-[35px]">
            {receiverData?.private ? "الدرج ده خاص" : "لسه مفيش كلام"}
          </h3>
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
              recieverImg={receiverData?.img || '/imgs/user.png'}
              prevMessage={messages[idx - 1]}
              isGroupAdmin={isGroupAdmin}
              onReact={handleReact}
              onEdit={handleEditMessage}
              onReply={handleReply}
              onTranslate={handleTranslate}
              onDelete={handleDeleteMessage}
              onCopy={(text) => {
                navigator.clipboard.writeText(text);
                toast.success('تم نسخ النص');
              }}
              showReactions={true}
              onImageClick={(imageUrl) => {
                // جمع كل صور المحادثة
                const allImages = messages
                  .filter(msg => msg.type === 'image' && msg.media)
                  .map(msg => {
                    if (typeof msg.media === 'string') {
                      return msg.media.startsWith('http') ? msg.media : `${API_BASE}${msg.media}`;
                    } else if (msg.media && typeof msg.media === 'object') {
                      return (msg.media as any).url || (msg.media as any).fileContent || '';
                    }
                    return '';
                  })
                  .filter(url => url && url.length > 0);
                
                // إضافة الصور المعلقة أيضاً
                const pendingImageUrls = pendingImages.map(img => img.url);
                const allImagesWithPending = [...allImages, ...pendingImageUrls];
                
                openImageViewer(imageUrl, allImagesWithPending);
              }}
            />
          ))}
          {remoteTyping && <TypingBubble mine={false} />}
          <div ref={bottomRef} />
        </div>
      )}

      {showScrollDown && (
        <button
          onClick={() => bottomRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#d7222897] text-white rounded-2xl px-4 py-2 z-[99999] text-sm border-none  cursor-pointer"
        >
          انزل تحت
        </button>
      )}

      {/* رسالة الحظر */}
      {iBlockedHim && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center justify-center gap-2 rounded-3xl w-auto max-w-[90%]">
          <p className="font-semibold text-[20px] leading-[100%] text-center text-[#D72229]">
            ممنوع الوصول
          </p>
          <p className="font-semibold text-[15px] leading-[18px] text-center text-black max-w-[355px]">
            {chatName || receiverData?.name || (isGroup ? 'هذه المجموعة' : 'هذا المستخدم')} قفل درجه من ناحيتك مش هتقدر تشوف فضفضاته أو تكلمه
          </p>
        </div>
      )}

      {/* ================= Pending Images Display with alignment based on sender ================= */}
      {pendingImages.length > 0 && (
        <div 
          className={`flex items-center mb-2 px-4 ${myId ? 'justify-start' : 'justify-end'}`} 
          style={{ height: '180px' }}
        >
          <div className="relative" style={{ width: '140px', height: '160px' }}>
            {pendingImages.map((img, index) => {
              let angle = 0;
              let offsetX = 0;
              let offsetY = 0;
              let zIndex = 0;
              let width = '137.99998474121145px';
              let height = '156.0000152587903px';
              
              if (index === 0) {
                angle = 0;
                offsetX = 0;
                offsetY = 0;
                zIndex = 3;
                width = '137.99998474121145px';
                height = '156.0000152587903px';
              } else if (index === 1) {
                angle = 170.62;
                offsetX = -8;
                offsetY = -20;
                zIndex = 2;
                width = '137.3889608375058px';
                height = '155.70752684948891px';
              } else if (index === 2) {
                angle = -171.85;
                offsetX = -12;
                offsetY = -19;
                zIndex = 1;
                width = '137.3889642799699px';
                height = '155.70752300857416px';
              } else {
                angle = (index % 2 === 0) ? 5 + (index * 3) : -(5 + (index * 3));
                offsetX = -5 - (index * 2);
                offsetY = -10 - (index * 3);
                zIndex = Math.max(0, 5 - index);
                width = '137.3889642799699px';
                height = '155.70752300857416px';
              }
              
              return (
                <div
                  key={img.id}
                  className="absolute rounded-[18px] overflow-hidden  border-2 border-white"
                  style={{
                    width: width,
                    height: height,
                    transform: `translate(${offsetX}px, ${offsetY}px) rotate(${angle}deg)`,
                    zIndex: zIndex,
                    top: '50%',
                    left: '50%',
                    marginLeft: index === 0 ? '-69px' : '-68.7px',
                    marginTop: index === 0 ? '-78px' : '-77.85px',
                  }}
                >
                  <img 
                    src={img.url} 
                    alt={`صورة ${index + 1}`} 
                    className="w-full h-full object-cover"
                    onClick={() => {
                      const allImages = messages
                        .filter(msg => msg.type === 'image' && msg.media)
                        .map(msg => {
                          if (typeof msg.media === 'string') {
                            return msg.media.startsWith('http') ? msg.media : `${API_BASE}${msg.media}`;
                          } else if (msg.media && typeof msg.media === 'object') {
                            return (msg.media as any).url || (msg.media as any).fileContent || '';
                          }
                          return '';
                        })
                        .filter(url => url && url.length > 0);
                      
                      const pendingImageUrls = pendingImages.map(p => p.url);
                      const allImagesWithPending = [...allImages, ...pendingImageUrls];
                      
                      openImageViewer(img.url, allImagesWithPending);
                    }}
                  />
                </div>
              );
            })}
            
            {/* زر إلغاء جميع الصور المعلقة */}
            <button
              onClick={cancelPendingImages}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm z-20 hover:bg-red-600 transition"
              style={{ right: '-12px', top: '-12px' }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
   {/* ================= قائمة الإرفاق ================= */}
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

    <div className="flex bg-[#F3F5FF] w-full h-[55px] px-4 py-2 rounded-r-[20px] text-[15px] items-center relative gap-2">
     <div className="flex items-center gap-2">
    
   

  {/* 📌 مكون الستكرز جاهز ويعمل لوحده تماماً */}
  <Stickers onSelectSticker={handleSendSticker} />
</div>
      <input
        value={text}
        onChange={(e) => onInputChange(e.target.value)}
        disabled={isRecording}
        placeholder={isRecording ? "تسجيل..." : "اكتب رسالتك هنا  "}
        className="w-full outline-none bg-transparent"
        onKeyDown={(e) => {
          if (e.key === "Enter" && isTyping) handleSend();
        }}
      />

      {/* ================= Inputs المخفية ================= */}
      {/* 1. التقاط صورة بالكاميرا مباشرة */}
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileSelected}
      />

      {/* 2. اختيار صورة من المعرض */}
      <input
        type="file"
        ref={galleryInputRef}
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileSelected}
        multiple
      />

      {/* 3. اختيار مستند (PDF، ملفات نصية، إلخ) */}
      <input
        type="file"
        ref={documentInputRef}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.7z,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
        className="hidden"
        onChange={handleFileSelected}
        multiple
      />

      <div className="flex items-center gap-1 relative">
        {/* <button>
          <Stickers onSelectSticker={handleSendSticker} />
        </button> */}
        
      <button 
  type="button"
  onClick={() => galleryInputRef.current?.click()}
  className="p-2 hover:bg-gray-100 rounded-full transition flex items-center justify-center"
>
  <img 
    src="/imgs/gellery.svg" 
    alt="معرض" 
    style={{ 
      width: '20px', 
      height: '20px' 
    }} 
  />
</button>

        {/* ================= زر رفع الملفات مع القائمة المنسدلة ================= */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            className="p-1 hover:bg-white/20 rounded-lg transition"
          >
            <img src="/imgs/fileUpload.svg" alt="upload" style={{ 
      width: '20px', 
      height: '20px' 
    }}  />
          </button>

          {/* القائمة المنسدلة */}
          {showAttachMenu && (
            <div 
           className="absolute bottom-full mb-5 -right-30 translate-x-4 rounded-[20px]  flex flex-col gap-1 border border-gray-100 z-50"
            style={{ 
              width: '169px',
              height: '140px',
              background: '#F3F5FF',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
             }}
            >
             

              {/* خيار الكاميرا */}
            <button
  type="button"
  onClick={() => {
    cameraInputRef.current?.click();
    setShowAttachMenu(false);
  }}
  className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-gray-50 transition"
  style={{ 
    borderBottom: '0.33px solid #3C3C434D' 
  }}
>
  {/* الكلمة في اليمين */}
  <span 
    style={{ 
      fontFamily: 'Cairo, sans-serif',
      fontWeight: 600,
      fontSize: '15px',
      lineHeight: '100%',
      color: '#000000',
      textAlign: 'right'
    }}
  >
    الكاميرا
  </span>

  {/* الصورة في اليسار داخل الدائرة */}
  <div className="w-8 h-8 rounded-full bg-[#F3F5FF] flex items-center justify-center flex-shrink-0">
    <img 
      src="/imgs/camera.svg" 
      alt="كاميرا" 
      style={{ 
        width: '19.85px', 
        height: '19px' 
      }} 
    />
  </div>
</button>

              {/* خيار المعرض */}
             <button
  type="button"
  onClick={() => {
    galleryInputRef.current?.click();
    setShowAttachMenu(false);
  }}
  className="w-full flex items-center justify-between px-1.5 py-1 hover:bg-gray-50 transition"
  style={{ 
    borderBottom: '0.33px solid #3C3C434D' 
  }}
>
  {/* الكلمة في اليمين */}
  <span 
    style={{ 
      fontFamily: 'Cairo, sans-serif',
      fontWeight: 600,
      fontSize: '15px',
      lineHeight: '100%',
      color: '#000000',
      textAlign: 'right'
    }}
  >
    المعرض
  </span>

  {/* الصورة في اليسار داخل الدائرة */}
  <div className="w-8 h-8 rounded-full bg-[#F3F5FF] flex items-center justify-center flex-shrink-0">
    <img 
      src="/imgs/gellery (2).svg" 
      alt="معرض" 
      style={{ 
        width: '19.85px', 
        height: '19px' 
      }} 
    />
  </div>
</button>

              {/* خيار المستندات */}
              <button
  type="button"
  onClick={() => {
    documentInputRef.current?.click();
    setShowAttachMenu(false);
  }}
  className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-gray-50 transition"
>
  {/* الكلمة في اليمين */}
  <span 
    style={{ 
      fontFamily: 'Cairo, sans-serif',
      fontWeight: 600,
      fontSize: '15px',
      lineHeight: '100%',
      color: '#000000',
      textAlign: 'right'
    }}
  >
    مستند
  </span>

  {/* الصورة في اليسار داخل الدائرة */}
  <div className="w-8 h-8 rounded-full bg-[#F3F5FF] flex items-center justify-center flex-shrink-0">
    <img 
      src="/imgs/document.svg" 
      alt="مستند" 
      style={{ 
        width: '19.85px', 
        height: '19px' 
      }} 
    />
  </div>
</button>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}
      {/* ================= القائمة المنسدلة ================= */}
      {showMenu && (
        <div 
          className="absolute z-[9999] top-[60px] left-4"
          style={{
            width: '154px',
            borderRadius: '20px',
            backgroundColor: "#F5F5F5",
            // boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {!isGroup && (
            <>
              <button
                onClick={() => {
                  setShowMenu(false);
                  handleBlockUser();
                }}
                className="w-full px-2 py-3 text-sm hover:bg-[#FFFFFF] flex items-center justify-between gap-2 rounded-t-[8px] transition"
                style={{
                  borderBottom: '0.33px solid #3C3C434D',
                }}
              >
                <span className="font-semibold text-[15px] text-black">
                  {isUserCurrentlyBlocked ? 'رفع الحظر' : 'حظر'}
                </span>
                <img 
                  src="/imgs/block.svg" 
                  alt={isUserCurrentlyBlocked ? "رفع الحظر" : "حظر"} 
                  className="w-4 h-4" 
                />
              </button>

              <button
                onClick={() => {
                  setShowMenu(false);
                  handleReport();
                }}
                className="w-full px-2 py-3 text-sm hover:bg-[#FFFFFF] flex items-center justify-between gap-2 transition"
                style={{
                  borderBottom: '0.33px solid #3C3C434D',
                }}
              >
                <span className="font-semibold text-[15px] text-black">إبلاغ</span>
                <img src="/imgs/report.svg" alt="إبلاغ" className="w-4 h-4" />
              </button>
            </>
          )}

          {isGroup && (
            <>
              <button
                onClick={() => {
                  setShowMenu(false);
                  handleReport();
                }}
                className="w-full px-2 py-3 text-sm hover:bg-[#FFFFFF] flex items-center justify-between gap-2 rounded-t-[8px] transition"
                style={{
                  borderBottom: '0.33px solid #3C3C434D',
                }}
              >
                <span className="font-semibold text-[15px] text-black">إبلاغ</span>
                <img src="/imgs/report.svg" alt="إبلاغ" className="w-4 h-4" />
              </button>
            </>
          )}

          <button
            onClick={() => {
              setShowMenu(false);
              toast.info('جاري البحث في المحادثة...');
            }}
            className="w-full px-2 py-3 text-sm hover:bg-[#FFFFFF] flex items-center justify-between gap-2 transition"
            style={{
              borderBottom: '0.33px solid #3C3C434D',
            }}
          >
            <span className="font-semibold text-[15px] text-black">بحث</span>
            <img src="/imgs/search.svg" alt="بحث" className="w-4 h-4" />
          </button>

          {isGroup && (
            <>
              <button
                onClick={handleRequestAdmin}
                className="w-full px-2 py-3 text-sm hover:bg-[#FFFFFF] flex items-center justify-between gap-2 transition"
                style={{
                  borderBottom: '0.33px solid #3C3C434D',
                }}
              >
                <span className="font-semibold text-[15px] text-black">طلب مشرف</span>
                <img src="/imgs/adminChat.svg" alt="مشرف" className="w-4 h-4" />
              </button>
            </>
          )}

          <button
            onClick={handleDeleteChat}
            className="w-full px-2 py-3 text-sm hover:bg-[#FFFFFF] flex items-center justify-between gap-2 transition"
            style={{
              borderBottom: isGroup ? '0.33px solid #3C3C434D' : 'none',
            }}
          >
            <span className="font-semibold text-[15px] text-[#D72229]">حذف الدردشة</span>
            <img src="/imgs/delete.svg" alt="حذف" className="w-4 h-4" />
          </button>

          {isGroup && (
            <>
              <button
                onClick={handleLeaveGroup}
                className="w-full px-2 py-3 text-sm hover:bg-[#FFFFFF] flex items-center justify-between gap-2 transition rounded-b-[8px]"
              >
                <span className="font-semibold text-[15px] text-[#D72229]">خروج</span>
                <img src="/imgs/leave.svg" alt="خروج" className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      )}

      {/* Block Confirmation Modal */}
      {blockConfirmVisible && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center"
          onClick={handleCancelBlock}
        >
          <div 
            className="w-[386px] h-[214px] rounded-[30px] bg-[#0000001A] backdrop-blur-[30px] flex flex-col items-center justify-between py-6 px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-semibold text-[20px] leading-[100%] text-center text-[#D72229] mt-6 mb-0" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {isUserCurrentlyBlocked ? 'رفع الحظر' : 'حظر'} لـ "{chatName || receiverData?.name || (isGroup ? 'هذه المجموعة' : 'هذا المستخدم')}"؟
            </h2>
            
            <p className="font-semibold text-[14px] leading-loose text-center text-black max-w-[250px] mx-auto" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {isUserCurrentlyBlocked 
                ? 'بعد رفع الحظر، سيتمكن هذا المستخدم من التواصل معك مرة أخرى.'
                : 'مش هيقدر يكلمك أو يشوف منشوراتك بعد كدا'
              }
            </p>
            
            <div className="flex gap-4 justify-center w-full mt-2">
              <button
                onClick={handleCancelBlock}
                className="min-w-[100px] h-[50px] rounded-[19px] border border-[#D72229] text-[#D72229] font-semibold text-[17px] leading-[100%] hover:bg-white/10 transition px-4"
                style={{ fontFamily: 'Cairo, sans-serif' }}
              >
                إلغاء
              </button>

              <button
                onClick={handleConfirmBlock}
                className="w-[185px] h-[50px] rounded-[19px] border border-[#D72229] bg-[#D72229] text-white font-semibold text-[17px] leading-[100%] transition hover:bg-[#b81e24]"
                style={{ fontFamily: 'Cairo, sans-serif' }}
              >
                {isUserCurrentlyBlocked ? 'رفع الحظر' : 'حظر'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= Image Viewer Modal ================= */}
      {imageViewerOpen && viewerImages.length > 0 && (
        <ImageViewer
          images={viewerImages}
          currentIndex={viewerCurrentIndex}
          onClose={closeImageViewer}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </div>
  );
}

