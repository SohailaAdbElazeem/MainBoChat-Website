// app/chats/[receiverId]/page.tsx
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import wsService from "@/lib/websocketService";
import { TypingBubble } from "../_components/TypingBubble";
import { MessageItem } from "../_components/MessageItem";
import VoiceRecorderBar from "../_components/VoiceRecorderBar";
import { Message } from "@/types/types";
import Loader from "@/components/Loader";
import Stickers from "../_components/Stickers";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';
import { useZegoCall } from '@/components/ZegoCallProvider';
import BlockConfirmModal from '../_components/BlockConfirmModal';
import BlockSuccessModal from '../_components/BlockSuccessModal';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

// ================= Wrappers لأن react-hot-toast مفيهاش .info/.warning =================
const toastInfo = (msg: string, opts?: any) => toast(msg, opts);
const toastWarning = (msg: string, opts?: any) => toast(msg, { icon: '⚠️', ...opts });
// ================= Helper: Broadcast =================
function emitChatUpdate(event: "message" | "typing" | "typing_stop" | "seen", metadata: any) {
  try {
    const bc = new BroadcastChannel("bochat-typing");
    bc.postMessage({ type: "chat_update", event, metadata });
    bc.close();
  } catch {}
}

// ================= Helper: Audio peaks (للموجة في الرسالة الصوتية) =================
const getPeaks = async (blob: Blob, count = 40): Promise<number[]> => {
  try {
    const ctx = new AudioContext();
    const buf = await ctx.decodeAudioData(await blob.arrayBuffer());
    ctx.close();
    const data = buf.getChannelData(0);
    const step = Math.floor(data.length / count) || 1;
    const peaks = Array.from({ length: count }, (_, i) => {
      let max = 0;
      for (let j = i * step; j < (i + 1) * step && j < data.length; j++)
        max = Math.max(max, Math.abs(data[j]));
      return max;
    });
    const top = Math.max(...peaks) || 1;
    return peaks.map((p) => +(p / top).toFixed(2));
  } catch {
    return [];
  }
};
// ================= Helper: Arabic plural =================
const pluralAr = (n: number, one: string, two: string, few: string, many: string) => {
  if (n === 1) return one;
  if (n === 2) return two;
  if (n >= 3 && n <= 10) return `${n} ${few}`;
  return `${n} ${many}`;
};
// ================= Helper: Format last seen =================
function formatLastSeen(user: any): string | null {
  if (!user) return null;

  const isOnline =
    user.online === true ||
    user.isOnline === true ||
    user.status === 'online' ||
    user.presence === 'online';

  if (isOnline) return 'متصل الآن';

  let raw =
    user.lastLogIn ??        // ← الحقل بتاع الـ API
    user.lastSeen ??
    user.lastSeenAt ??
    user.last_seen ??
    user.lastOnline ??
    user.lastActive ??
    user.lastActivity ??
    null;

  if (!raw) return null;

  if (typeof raw === 'object') raw = raw.timestamp ?? raw.at ?? raw.time ?? null;
  if (!raw) return null;

  // إصلاح صيغة "2026-10-29 14:58:50" → "2026-10-29T14:58:50"
  let rawStr = String(raw);
  if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}/.test(rawStr)) {
    rawStr = rawStr.replace(' ', 'T');
  }

  const date = new Date(rawStr);
  if (isNaN(date.getTime())) return null;

  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);

  if (diffSec < 60) return 'نشط الآن';

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60)
      return `نشط منذ ${pluralAr(diffMin, 'دقيقة', 'دقيقتين', 'دقائق', 'دقيقة')}`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24)
    return ` نشط منذ ${pluralAr(diffHour, 'ساعة', 'ساعتين', 'ساعات', 'ساعة')}`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30)
    return `نشط منذ ${pluralAr(diffDay, 'يوم', 'يومين', 'أيام', 'يوم')}`;

  return ` نشط منذ ${date.toLocaleDateString('ar-EG', {
    day: '2-digit',
    month: '2-digit',
  })}`;
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
        border: '1px solid rgba(0,0,0,0.05)',
      },
    }
  );
};

interface PendingImage {
  id: string;
  file: File;
  url: string;
}

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

        <div className="relative flex-1 flex items-center justify-center px-4 overflow-hidden my-auto">
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
                  }}
                />
              </div>
            </div>
          )}

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

            <div className="absolute top-3 inset-x-0 flex items-center justify-center gap-[5px] z-20 px-3 pointer-events-none">
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
                  }}
                />
              </div>
            </div>
          </div>

          {nextIndex !== null && (
            <div
              onClick={onNext}
              className="absolute right-6 cursor-pointer opacity-70 hover:opacity-100 transition-all transform -translate-y-1/2 top-1/2"
              style={{ width: '125px', height: '255px', borderRadius: '20px', overflow: 'hidden', background: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 14.83%, #FFFFFF 79.89%)' }}
            >
              <img src={images[nextIndex]} alt="التالية" className="w-full h-full object-cover" />
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
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center items-center gap-2 py-1">
          {images.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-black w-6' : 'bg-gray-300 w-2'
                }`}
            />
          ))}
        </div>

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

// ================= Last Seen Text (re-renders every 30s) =================
const LastSeenText = ({ user }: { user: any }) => {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const label = formatLastSeen(user);

  if (!label) {
    return user?.username ? (
      <bdi className="text-xs text-[#B4B4B9]">@{user.username}</bdi>
    ) : null;
  }

  if (label === 'متصل الآن') {
    return (
      <span className="text-xs font-semibold text-[#22C55E]">
        متصل الآن
      </span>
    );
  }

  return <span className="text-xs text-[#B4B4B9]">{label}</span>;
};
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
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStopped, setRecordingStopped] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [blockConfirmVisible, setBlockConfirmVisible] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [showBlockSuccess, setShowBlockSuccess] = useState(false);
  // ================= Block target (chat or member) =================
  const [blockTarget, setBlockTarget] = useState<{ id: string; name: string; isMember: boolean } | null>(null);
  const [blockSuccessAction, setBlockSuccessAction] = useState<'block' | 'unblock'>('block');
   // ================= Delete Chat Modal states =================
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [deleteSuccessVisible, setDeleteSuccessVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
   // ================= Leave Group Modal states =================
  const [leaveGroupConfirmVisible, setLeaveGroupConfirmVisible] = useState(false);
  const [leaveGroupSuccessVisible, setLeaveGroupSuccessVisible] = useState(false);
  const [isLeavingGroup, setIsLeavingGroup] = useState(false);
  // ================= Promote (ترقية مشرف) =================
  const [promoteSelectionVisible, setPromoteSelectionVisible] = useState(false);
  const [selectedPromoteMember, setSelectedPromoteMember] = useState<string>('');
  const [isPromoting, setIsPromoting] = useState(false);
    // ================= Promote Admin Modal states =================
  const [promoteAdminModalVisible, setPromoteAdminModalVisible] = useState(false);
  const [selectedPromoteAdminMember, setSelectedPromoteAdminMember] = useState<string>('');
  const [isPromotingAdmin, setIsPromotingAdmin] = useState(false);
  const [promoteAdminSuccessVisible, setPromoteAdminSuccessVisible] = useState(false);
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
  // ================= Member Admin/Remove states =================
  const [isUpdatingMemberAdmin, setIsUpdatingMemberAdmin] = useState<string | null>(null);
  const [isRemovingMember, setIsRemovingMember] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
 // ================= Archive (Favorite) states =================
  const [isFavorited, setIsFavorited] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
    // ================= Add Members Modal states =================
  const [addMembersModalVisible, setAddMembersModalVisible] = useState(false);
  const [addMembersSuccessVisible, setAddMembersSuccessVisible] = useState(false);
  const [selectedMembersToAdd, setSelectedMembersToAdd] = useState<string[]>([]);
  const [contactsList, setContactsList] = useState<any[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [isAddingMembers, setIsAddingMembers] = useState(false);
  const [contactsSearchQuery, setContactsSearchQuery] = useState('');
  // ================= State for pending images =================
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);

  // ================= State for Image Viewer =================
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const [viewerCurrentIndex, setViewerCurrentIndex] = useState(0);

  const router = useRouter();

  const { startCall } = useZegoCall();

  // ================= Recording timer =================
  useEffect(() => {
    if (!isRecording) return;
    setRecordSeconds(0);
    const t = setInterval(() => setRecordSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [isRecording]);

  const recordDuration = `${Math.floor(recordSeconds / 60)}:${String(recordSeconds % 60).padStart(2, "0")}`;

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

  // const handleBlockMember = (member: any) => {
  //   toast.success(`تم حظر المستخدم ${member.name}`);
  // };
const handleBlockMember = useCallback((member: any) => {
  if (!member?.userId || !token) return;
  setActiveMemberMenuId(null);
  setBlockTarget({
    id: member.userId,
    name: member.name || 'هذا المستخدم',
    isMember: true,
  });
  setBlockConfirmVisible(true);
}, [token]);
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
      try { bcRef.current?.close(); } catch { }
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

  // // ================= جلب بيانات المستخدم =================
  // const fetchReceiverData = useCallback(async () => {
  //   if (!receiverId || !token || !myId) return;

  //   try {
  //     let currentUserData = null;
  //     try {
  //       const currentUserRes = await fetch(`${API_BASE}/users/${myId}`, {
  //         headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  //       });
  //       if (currentUserRes.ok) {
  //         const currentUserJson = await currentUserRes.json();
  //         currentUserData = currentUserJson.userpersonaldata;
  //       }
  //     } catch (e) {
  //       console.error('Failed to fetch current user data:', e);
  //     }

  //     const chatResponse = await fetch(`${API_BASE}/chats/chats/${myId}`, {
  //       headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  //     });

  //     let isGroupChat = false;
  //     let groupName = '';
  //     let isAdmin = false;

  //     if (chatResponse.ok) {
  //       const chatData = await chatResponse.json();
  //       const chatList = chatData.response || chatData.userchats || [];

  //       const foundChat = chatList.find((chat: any) => {
  //         const otherId = chat.otherUserId || chat.id;
  //         return otherId === receiverId;
  //       });

  //       if (foundChat) {
  //         isGroupChat = foundChat.chatType === 'group' || foundChat.isGroup === true;
  //         groupName = foundChat.groupName || foundChat.name || '';
  //         isAdmin = foundChat.admin === myId || foundChat.owner === myId;

  //         setIsGroup(isGroupChat);
  //         setIsGroupAdmin(isAdmin);

  //         if (!isGroupChat) {
  //           const members = foundChat.memberAvatars || foundChat.members || [];
  //           setGroupMembers(members);
  //         }

  //         if (isGroupChat && groupName) {
  //           setChatName(groupName);
  //         }
  //       }
  //     }

  //     if (!isGroupChat) {
  //       const userResponse = await fetch(`${API_BASE}/users/${receiverId}`, {
  //         headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  //       });
  //       const userData = await userResponse.json();
  //       setReceiverData(userData.userpersonaldata);
 
  //       if (userData.userpersonaldata?.name) {
  //         setChatName(userData.userpersonaldata.name);
  //       } else {
  //         setChatName('مستخدم');
  //       }
  //     } else {
  //       setReceiverData(null);
  //     }

  //   } catch (error) {
  //     console.error("Failed to fetch receiver data", error);
  //   }
  // }, [receiverId, token, myId]);
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

        // 🔍 Debug: اطبعي كل حقول الشات عشان تعرفي اسم حقل الأرشفة
        console.log('🟦 foundChat keys:', Object.keys(foundChat));
        console.log('🟦 foundChat full:', foundChat);

        // ✅ قراءة حالة الأرشفة — بتجرب كل الاحتمالات
        const favState =
          foundChat.favorite === true ||
          foundChat.isFavorite === true ||
          foundChat.isFavorited === true ||
          foundChat.favorited === true ||
          foundChat.archived === true ||
          foundChat.isArchived === true ||
          foundChat.starred === true ||
          foundChat.isStarred === true ||
          foundChat.pinned === true ||
          foundChat.isPinned === true;

        console.log('🟦 isFavorited detected:', favState);
        setIsFavorited(favState);

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
      const formData = new FormData();
      formData.append('name', editName.trim());

      const res = await fetch(`${API_BASE}/chats/groups/UpdateGroup/${receiverId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
         },
        body: formData,
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (res.ok && data.success) {
        setChatName(editName.trim());
        toast.success('تم تحديث اسم المجموعة بنجاح');
      } else {
        toast.error(`فشل التحديث: ${data.response || data.message || `HTTP ${res.status}`}`);
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
      const formData = new FormData();
      formData.append('description', editDescription.trim());

      const res = await fetch(`${API_BASE}/chats/groups/UpdateGroup/${receiverId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
         },
        body: formData,
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (res.ok && data.success) {
        setGroupDescription(editDescription.trim());
        toast.success('تم تحديث وصف المجموعة بنجاح');
      } else {
        toast.error(`فشل التحديث: ${data.response || data.message || `HTTP ${res.status}`}`);
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

    // بناء كائن الرسالة مع الـ Reply
    const tempMsg: Message = {
      _id: tempId,
      message: text,
      sender: effMy,
      receiver: effRec,
      timestamp: new Date().toISOString(),
      type: "text",
      fileData: undefined,
    };

    // إذا كان هناك رد، نضيفه للرسالة
    if (replyTo) {
      tempMsg.replyTo = {
        _id: replyTo._id,
        message: replyTo.message || '',
        sender: replyTo.sender,
        senderName: replyTo.sender === effMy ? 'أنت' : receiverData?.name || 'مستخدم',
        type: replyTo.type || 'text',
        fileName: replyTo.fileName || '',
      };
    }

    setMessages((prev) => [...prev, tempMsg]);
    setText("");

    // حفظ الـ replyTo مؤقتاً للإرسال
    const currentReply = replyTo;
    setReplyTo(null); // إعادة تعيين الـ Reply بعد الإرسال

    emitChatUpdate("message", { ...tempMsg, seenBy: false });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    const stopPayload = { event: "typing_stop", metadata: { sender: effMy, reicever: effRec } };
    try { wsService.send(stopPayload); } catch {}

    try {
      // بناء الجسم مع الـ replyTo
      const bodyData: any = {
        message: tempMsg.message,
        receiver: effRec,
        sender: effMy
      };

      // إضافة الـ replyTo إذا كان موجود
      if (currentReply) {
        bodyData.replyTo = {
          messageId: currentReply._id,
          message: currentReply.message || '',
          sender: currentReply.sender,
          type: currentReply.type || 'text',
        };
      }

      const res = await fetch(REST_SEND, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) throw new Error("Send failed");
      const data = await res.json();
      const savedMsg = data.message || data;
      if (savedMsg && savedMsg._id) {
        // الحفاظ على الـ replyTo في الرسالة المحفوظة
        if (currentReply) {
          savedMsg.replyTo = {
            _id: currentReply._id,
            message: currentReply.message || '',
            sender: currentReply.sender,
            senderName: currentReply.sender === effMy ? 'أنت' : receiverData?.name || 'مستخدم',
            type: currentReply.type || 'text',
            fileName: currentReply.fileName || '',
          };
        }
        replaceTempMessage(tempId, savedMsg);
      } else {
        setMessages((prev) => prev.map((m) => (m._id === tempId ? { ...m, _sendFailed: true } : m)));
      }
    } catch (err) {
      console.error("Send error:", err);
      setMessages((prev) => prev.map((m) => (m._id === tempId ? { ...m, _sendFailed: true } : m)));
    }
  }, [text, token, replaceTempMessage, replyTo, receiverData]);

  // ================= عرض الـ Reply في شريط الإدخال =================
  const renderReplyInput = () => {
    if (!replyTo) return null;

    const replyText = replyTo.message || 'رسالة';
    const senderName = replyTo.sender === myId ? 'أنت' : receiverData?.name || 'مستخدم';

    // تحديد نوع الميديا للعرض
    let mediaPreview = '';
    if (replyTo.type === 'image') mediaPreview = '📷 صورة';
    else if (replyTo.type === 'video') mediaPreview = '🎬 فيديو';
    else if (replyTo.type === 'audio') mediaPreview = '🎵 رسالة صوتية';
    else if (replyTo.type === 'sticker') mediaPreview = '🎨 ملصق';
    else if (replyTo.type === 'pdf') mediaPreview = '📄 PDF';
    else if (replyTo.type === 'word') mediaPreview = '📄 مستند Word';
    else if (replyTo.type === 'excel') mediaPreview = '📊 جدول Excel';
    else if (replyTo.type === 'powerpoint') mediaPreview = '📊 عرض تقديمي';
    else if (replyTo.type === 'file') mediaPreview = '📎 ملف';

    const displayText = mediaPreview || replyText;

    return (
      <div
        dir="rtl"
        className="relative flex items-center justify-between w-full max-w-[930px] h-[70px] rounded-[15px] overflow-hidden shadow-[0px_0px_5px_0px_rgba(0,0,0,0.05)] bg-[linear-gradient(0deg,#FFFFFF_26.92%,#F3F5FF_66.8%)] p-1.5  pl-4"
      >
        {/* المحتوى الداخلي بخلفية بيضاء كاملة */}
        <div className="flex items-center justify-between w-full h-[56px] bg-[#FEFEFF] rounded-[11px] p-2">

          {/* الجزء الأيمن: الشريط الجانبي والنص */}
          <div className="flex items-center gap-3 flex-1 min-w-0 h-full">
            {/* الشريط العمودي الجانبي المتدرج */}
            <div
              className="w-[27px] h-full rounded-r-[11px] bg-[linear-gradient(270deg,#FFFFFF_0%,#B4B4B9_100%)] shrink-0"
            />

            {/* محتوى النص */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <span className="block text-xs font-bold text-[#000000]">
                الرد على {senderName}
              </span>
              <span className="block text-xs text-gray-500 truncate max-w-[200px]">
                {displayText}
              </span>
            </div>
          </div>

          {/* زر إلغاء الرد (على الشمال) */}
          <button
            type="button"
            onClick={() => {
              setReplyTo(null);

              const input = document.querySelector('input[type="text"]');
              if (input) {
                (input as HTMLInputElement).focus();
              }
            }}
            className="w-6 h-6 flex items-center justify-center rounded-full border border-[#B4B4B9] bg-white hover:bg-gray-50 transition shrink-0 mr-2"
            title="إلغاء الرد"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M4 4L12 12M12 4L4 12"
                stroke="#B4B4B9"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

        </div>
      </div>
    );
  };

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
        } catch { }
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
       console.log("🎤 startRecording called");   // ← ضيفي ده
    setIsRecording(true);
    setRecordingStopped(false);
    setAudioBlob(null);
    recordStartRef.current = Date.now();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          console.log("✅ got stream");   // ← ضيفي ده
      mediaStreamRef.current = stream;
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      drawWave();

      // دعم Safari/iPhone: بنختار أول صيغة المتصفح بيدعمها
      const mimeType = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"]
        .find((t) => MediaRecorder.isTypeSupported(t));
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
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
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || "audio/webm" });
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

    const blob = audioBlob;
    const peaks = await getPeaks(blob);
    const mime = (blob.type || "audio/webm").split(";")[0];
    const ext = mime.includes("mp4") ? "m4a" : "webm";

    const tempId = `tmp-audio-${Date.now()}`;
    const tempMsg = {
      _id: tempId,
      sender: effMy,
      receiver: effRec,
      timestamp: new Date().toISOString(),
      type: "audio",
      message: "رسالة صوتية",
      media: blob,
      waveData: peaks,
    } as any as Message;
    setMessages((prev) => [...prev, tempMsg]);
    resetRecording(); // يقفل الشريط فوراً

    try {
      const base64 = await blobToPureBase64(blob);
      const res = await fetch(`${API_BASE}/message/send_media`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          metadata: { sender: effMy, reicever: effRec, type: "audio", waveData: peaks },
          fileData: [{
            fileName: `voice-${Date.now()}.${ext}`,
            fileContent: `data:${mime};base64,${base64}`,
            mimetype: mime,
          }],
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
  }, [audioBlob, token, resetRecording]);

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

  // ================= Send File =================
  const sendFile = useCallback(async (file: File) => {
    const effMy = myIdRef.current;
    const effRec = receiverIdRef.current;
    if (!effMy || !effRec || !token) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    let fileType = 'file';
    if (['pdf'].includes(fileExtension)) fileType = 'pdf';
    else if (['doc', 'docx'].includes(fileExtension)) fileType = 'word';
    else if (['xls', 'xlsx'].includes(fileExtension)) fileType = 'excel';
    else if (['ppt', 'pptx'].includes(fileExtension)) fileType = 'powerpoint';
    else if (['txt'].includes(fileExtension)) fileType = 'text';
    else if (['zip', 'rar', '7z'].includes(fileExtension)) fileType = 'archive';

    const tempId = `tmp-file-${Date.now()}-${Math.random()}`;
    const tempMsg: Message = {
      _id: tempId,
      sender: effMy,
      receiver: effRec,
      timestamp: new Date().toISOString(),
      type: fileType,
      message: file.name,
      media: file,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
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
          type: fileType,
          fileName: file.name,
          fileSize: file.size,
          fileMimeType: file.type,
          clientTempId: tempId
        },
        fileData: [{
          fileName: file.name,
          fileContent: `data:${file.type};base64,${base64}`,
          mimetype: file.type
        }],
      })
    );
  }, [token]);

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
      const fileType = img.file.type;
      const fileExtension = img.file.name.split('.').pop()?.toLowerCase() || '';

      if (fileType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension)) {
        sendImageFile(img.file);
      } else {
        sendFile(img.file);
      }
    });

    e.target.value = "";
  }, [sendImageFile, sendFile]);

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

 
  // ================= فتح مودال الحظر =================
// const handleBlockUser = useCallback(() => {
//   if (!receiverId || !myId || !token) return;
//   setShowMenu(false);
//   setShowGroupDetails(false);
//   setShowSettingsMenu(false);
//   setBlockConfirmVisible(true);
// }, [receiverId, myId, token]);
const handleBlockUser = useCallback(() => {
  if (!receiverId || !myId || !token) return;
  setShowMenu(false);
  setShowGroupDetails(false);
  setShowSettingsMenu(false);

  const displayName =
    chatName ||
    receiverData?.name ||
    (isGroup ? 'هذه المجموعة' : 'هذا المستخدم');

  setBlockTarget({ id: receiverId, name: displayName, isMember: false });
  setBlockConfirmVisible(true);
}, [receiverId, myId, token, chatName, receiverData, isGroup]);
// ================= إبلاغ عن المستخدم =================
const handleReport = useCallback(() => {
  setShowMenu(false);
  setShowGroupDetails(false);
  setShowSettingsMenu(false);
  toast.success('✅ تم إرسال الإبلاغ، شكرًا لك');
}, []);
//  const handleConfirmBlock = useCallback(async () => {
//   if (!receiverId || !myId || !token) return;

//   setIsBlocking(true);
//   const isBlocked = isUserBlocked(receiverId);

//   try {
//     const url = isBlocked
//       ? `${API_BASE}/chats/unblock`
//       : `${API_BASE}/chats/block`;

//     const res = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ blocked_user_id: receiverId }),
//     });

//     if (res.ok) {
//       if (isBlocked) {
//         setBlockedUsers(prev => prev.filter(id => id !== receiverId));
//         setIBlockedHim(false);
//         localStorage.removeItem(`blocked_${receiverId}`);
//       } else {
//         setBlockedUsers(prev => [...prev, receiverId as string]);
//         setIBlockedHim(true);
//         localStorage.setItem(`blocked_${receiverId}`, 'true');
//       }

//       // ✅ بدل toast: نفتح مودال النجاح
//       setShowBlockSuccess(true);
//     } else {
//       let errMsg = `فشل ${isBlocked ? 'رفع الحظر' : 'الحظر'}`;
//       try {
//         const errData = await res.json();
//         if (errData?.message || errData?.response) {
//           errMsg += `: ${errData.message || errData.response}`;
//         }
//       } catch {}
//       toast.error(errMsg);
//     }
//   } catch (error) {
//     console.error("Failed to block/unblock user", error);
//     toast.error("حدث خطأ أثناء محاولة تنفيذ العملية");
//   } finally {
//     setIsBlocking(false);
//     setBlockConfirmVisible(false);
//   }
// }, [receiverId, myId, token, isUserBlocked]);
const handleConfirmBlock = useCallback(async () => {
  if (!blockTarget || !token) return;

  setIsBlocking(true);
  const targetId = blockTarget.id;
  const isBlocked = blockedUsers.includes(targetId);

  try {
    const url = isBlocked
      ? `${API_BASE}/chats/unblock`
      : `${API_BASE}/chats/block`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ blocked_user_id: targetId }),
    });

    if (res.ok) {
      if (isBlocked) {
        setBlockedUsers((prev) => prev.filter((id) => id !== targetId));
        // لو بنرفع الحظر عن المحادثة الحالية نفسها
        if (targetId === receiverId) {
          setIBlockedHim(false);
          localStorage.removeItem(`blocked_${targetId}`);
        }
      } else {
        setBlockedUsers((prev) => [...prev, targetId]);
        // لو بنحظر المحادثة الحالية نفسها
        if (targetId === receiverId) {
          setIBlockedHim(true);
          localStorage.setItem(`blocked_${targetId}`, 'true');
        }
      }

      setBlockSuccessAction(isBlocked ? 'unblock' : 'block');
      setShowBlockSuccess(true);
    } else {
      let errMsg = `فشل ${isBlocked ? 'رفع الحظر' : 'الحظر'}`;
      try {
        const errData = await res.json();
        if (errData?.message || errData?.response) {
          errMsg += `: ${errData.message || errData.response}`;
        }
      } catch {}
      toast.error(errMsg);
    }
  } catch (error) {
    console.error("Failed to block/unblock user", error);
    toast.error("حدث خطأ أثناء محاولة تنفيذ العملية");
  } finally {
    setIsBlocking(false);
    setBlockConfirmVisible(false);
    setBlockTarget(null);
  }
}, [blockTarget, token, blockedUsers, receiverId]);
  // ================= إلغاء الحظر =================
  // const handleCancelBlock = useCallback(() => {
  //   setBlockConfirmVisible(false);
  // }, []);
const handleCancelBlock = useCallback(() => {
  setBlockConfirmVisible(false);
  setBlockTarget(null);
}, []);
  // ================= فتح مودال حذف المحادثة =================
  const handleDeleteChat = useCallback(() => {
    if (!receiverId || !token) return;
    setShowMenu(false);
    setShowGroupDetails(false);
    setShowSettingsMenu(false);
    setDeleteConfirmVisible(true);
  }, [receiverId, token]);

  // ================= تنفيذ الحذف الفعلي =================
  const handleConfirmDelete = useCallback(async () => {
    if (!receiverId || !token) return;

    setIsDeleting(true);

    try {
      const res = await fetch(`${API_BASE}/chats/delete`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: receiverId,
          chatType: isGroup ? 'group' : 'private',
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessages([]);
        setDeleteConfirmVisible(false);
        setDeleteSuccessVisible(true);
      } else {
        toast.error(`فشل حذف المحادثة: ${data.response || data.message || 'خطأ غير معروف'}`);
        setDeleteConfirmVisible(false);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast.error('حدث خطأ أثناء محاولة حذف المحادثة');
      setDeleteConfirmVisible(false);
    } finally {
      setIsDeleting(false);
    }
  }, [receiverId, token, isGroup]);

  // ================= إغلاق مودال الحذف =================
  const handleCancelDelete = useCallback(() => {
    setDeleteConfirmVisible(false);
  }, []);

  // ================= إغلاق مودال النجاح والانتقال =================
  const handleDeleteSuccessClose = useCallback(() => {
    setDeleteSuccessVisible(false);
    router.push('/chats');
  }, [router]);
    // ================= هل المستخدم مشرف وحيد؟ =================
  const isOnlyAdmin = useMemo(() => {
    if (!isGroupAdmin) return false;
    // لو هو المالك نفسه → الحالة مالك مش مشرف
    if (groupOwner?.userId === myId) return false;
    // هل فيه مشرف أو مالك تاني؟
    const otherAdmins = groupMembers.filter(
      (m) => m.userId !== myId && (m.isAdmin || m.isOwner)
    );
    return otherAdmins.length === 0;
  }, [isGroupAdmin, groupOwner, groupMembers, myId]);

  // ================= الأعضاء القابلين للترقية =================
  const promotableMembers = useMemo(() => {
    return groupMembers.filter(
      (m) => m.userId !== myId && !m.isAdmin && !m.isOwner
    );
  }, [groupMembers, myId]);
    // ================= الأصدقاء المتاحين للإضافة =================
  const availableContacts = useMemo(() => {
    const existingIds = new Set(
      groupMembers.map((m: any) => m.userId || m._id || m.id).filter(Boolean)
    );

    let list = contactsList.filter((c: any) => {
      if (c.isGroup === true || c.chatType === 'group') return false;

      const id = c.chatId || c.otherUserId || c._id || c.id;
      if (!id) return false;
      if (existingIds.has(id)) return false;
      return true;
    });

    if (contactsSearchQuery.trim()) {
      const q = contactsSearchQuery.trim().toLowerCase();
      list = list.filter((c: any) => {
        const name = (c.name || c.userinfo?.name || '').toLowerCase();
        return name.includes(q);
      });
    }

    return list;
  }, [contactsList, groupMembers, contactsSearchQuery]);
   
  // ================= فتح مودال الخروج =================
  const handleLeaveGroup = useCallback(() => {
    if (!receiverId || !token || !isGroup) return;
    setShowMenu(false);
    setShowGroupDetails(false);
    setShowSettingsMenu(false);
    setSelectedPromoteMember('');
    setLeaveGroupConfirmVisible(true);
  }, [receiverId, token, isGroup]);

  // ================= تنفيذ الخروج =================
  const handleConfirmLeaveGroup = useCallback(async () => {
    if (!receiverId || !token) return;

    setIsLeavingGroup(true);

    try {
      // 🔹 لو مشرف وحيد → لازم يرقّي عضو الأول
      if (isOnlyAdmin) {
        if (!selectedPromoteMember) {
          toast.error('لازم تختاري عضو ترفعيه مشرف قبل الخروج');
          setIsLeavingGroup(false);
          return;
        }

        setIsPromoting(true);
        const promoteRes = await fetch(
          `${API_BASE}/chats/groups/PromoteAdmin/${receiverId}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ memberid: selectedPromoteMember }),
          }
        );
        const promoteData = await promoteRes.json();
        setIsPromoting(false);

        if (!promoteData.success) {
          toast.error(
            `فشل ترقية العضو: ${promoteData.response || promoteData.message || 'خطأ غير معروف'}`
          );
          setIsLeavingGroup(false);
          return;
        }
      }

      // 🔹 الخروج من المجموعة
      const res = await fetch(`${API_BASE}/chats/groups/LeaveGroup/${receiverId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (data.success) {
        setLeaveGroupConfirmVisible(false);
        setLeaveGroupSuccessVisible(true);
      } else if (data.response?.toLowerCase().includes('transfer ownership')) {
        setLeaveGroupConfirmVisible(false);
        toast.error('يجب تحويل ملكية المجموعة أولاً قبل الخروج');
      } else {
        setLeaveGroupConfirmVisible(false);
        toast.error(`فشل الخروج: ${data.response || data.message || 'خطأ غير معروف'}`);
      }
    } catch (error) {
      console.error('Error leaving group:', error);
      toast.error('حدث خطأ أثناء محاولة الخروج');
      setLeaveGroupConfirmVisible(false);
    } finally {
      setIsLeavingGroup(false);
    }
  }, [receiverId, token, isOnlyAdmin, selectedPromoteMember]);
    // ================= إغلاق مودال الخروج =================
  const handleCancelLeaveGroup = useCallback(() => {
    setLeaveGroupConfirmVisible(false);
  }, []);
  const handleLeaveSuccessClose = useCallback(() => {
    setLeaveGroupSuccessVisible(false);
    router.push('/chats');
  }, [router]);
  
  // ================= فتح مودال ترقية عضو =================
  const handleRequestAdmin = useCallback(() => {
    if (!receiverId || !token || !isGroup) return;
    setShowMenu(false);
    setShowGroupDetails(false);
    setShowSettingsMenu(false);
    setSelectedPromoteAdminMember('');
    setPromoteAdminModalVisible(true);
  }, [receiverId, token, isGroup]);

  // ================= تنفيذ ترقية العضو =================
  const handleConfirmPromoteAdmin = useCallback(async () => {
    if (!receiverId || !token || !selectedPromoteAdminMember) {
      toast.error('لازم تختاري عضو الأول');
      return;
    }

    setIsPromotingAdmin(true);

    try {
      const res = await fetch(`${API_BASE}/chats/groups/PromoteAdmin/${receiverId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memberid: selectedPromoteAdminMember }),
      });

      const data = await res.json();

      if (data.success) {
        setPromoteAdminModalVisible(false);
        setPromoteAdminSuccessVisible(true);
      } else {
        toast.error(
          `فشل ترقية العضو: ${data.response || data.message || 'خطأ غير معروف'}`
        );
      }
    } catch (error) {
      console.error('Error promoting admin:', error);
      toast.error('حدث خطأ أثناء محاولة الترقية');
    } finally {
      setIsPromotingAdmin(false);
    }
  }, [receiverId, token, selectedPromoteAdminMember]);

  // ================= إغلاق مودال الترقية =================
  const handleCancelPromoteAdmin = useCallback(() => {
    setPromoteAdminModalVisible(false);
    setSelectedPromoteAdminMember('');
  }, []);
// ================= ترقية/تنزيل عضو من الإشراف =================
const handleToggleMemberAdmin = useCallback(async (member: any) => {
  if (!receiverId || !token) return;

  setIsUpdatingMemberAdmin(member.userId);
  const endpoint = member.isAdmin ? 'DemoteAdmin' : 'PromoteAdmin';

  try {
    const res = await fetch(
      `${API_BASE}/chats/groups/${endpoint}/${receiverId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memberid: member.userId }),
      }
    );

    let data: any = {};
    try { data = await res.json(); } catch {}

    if (res.ok && data.success !== false) {
      toast.success(member.isAdmin ? '✅ تم إزالة الإشراف' : '✅ تم ترقية العضو لمشرف');
      fetchGroupData();
    } else {
      toast.error(data.response || data.message || `فشل: HTTP ${res.status}`);
    }
  } catch (e) {
    console.error('Error toggling member admin:', e);
    toast.error('حدث خطأ أثناء محاولة التحديث');
  } finally {
    setIsUpdatingMemberAdmin(null);
  }
}, [receiverId, token, fetchGroupData]);

// ================= حذف عضو من المجموعة =================
const handleRemoveMember = useCallback((member: any) => {
  if (!receiverId || !token) return;

  showConfirmToast(
    `هل أنت متأكد من حذف "${member.name || 'هذا العضو'}" من المجموعة؟`,
    async () => {
      setIsRemovingMember(member.userId);

      try {
        const res = await fetch(
          `${API_BASE}/chats/groups/RemoveMember/${receiverId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ memberid: member.userId }),
          }
        );

        let data: any = {};
        try { data = await res.json(); } catch {}

        if (res.ok && data.success !== false) {
          toast.success('✅ تم حذف العضو من المجموعة');
          fetchGroupData();
        } else {
          toast.error(data.response || data.message || `فشل: HTTP ${res.status}`);
        }
      } catch (e) {
        console.error('Error removing member:', e);
        toast.error('حدث خطأ أثناء محاولة الحذف');
      } finally {
        setIsRemovingMember(null);
      }
    },
    undefined,
    'نعم، احذف',
    'إلغاء'
  );
}, [receiverId, token, fetchGroupData]);
  // ================= إغلاق مودال نجاح الترقية =================
  const handlePromoteAdminSuccessClose = useCallback(() => {
    setPromoteAdminSuccessVisible(false);
    fetchGroupData();
  }, [fetchGroupData]);
    // ================= أرشفة / إلغاء أرشفة المحادثة =================
  const handleToggleArchive = useCallback(async () => {
    if (!receiverId || !token) return;

    setIsArchiving(true);

    const endpoint = isFavorited ? 'unfavorite' : 'favorite';

    try {
      const res = await fetch(`${API_BASE}/chats/${endpoint}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: receiverId,
          chatType: isGroup ? 'group' : 'private',
        }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (res.ok && data.success !== false) {
        setIsFavorited((prev) => !prev);
        toast.success(
          isFavorited ? '✅ تم إلغاء أرشفة المحادثة' : '✅ تم أرشفة المحادثة بنجاح'
        );
        setShowGroupDetails(false);
      } else {
        toast.error(
          data.response || data.message || `فشل: HTTP ${res.status}`
        );
      }
    } catch (error) {
      console.error('Error toggling archive:', error);
      toast.error('حدث خطأ أثناء محاولة الأرشفة');
    } finally {
      setIsArchiving(false);
    }
  }, [receiverId, token, isGroup, isFavorited]);
    // ================= جلب قائمة الأصدقاء =================
  const fetchContactsForAdding = useCallback(async () => {
    if (!token || !myId) return;

    setIsLoadingContacts(true);
    try {
      // ✅ نستخدم /chats/chats/:myId زي CreateGroupModal
      const res = await fetch(`${API_BASE}/chats/chats/${myId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (!res.ok) {
        console.error('Failed to fetch contacts:', res.status);
        setContactsList([]);
        return;
      }

      const data = await res.json();
      const list = data.response || data.userchats || [];
      setContactsList(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error('Error fetching contacts:', e);
      setContactsList([]);
    } finally {
      setIsLoadingContacts(false);
    }
  }, [token, myId]);

    // ================= فتح مودال إضافة أعضاء =================
  const handleOpenAddMembers = useCallback(() => {
    if (!isGroup || !receiverId || !token) return;
    setShowGroupDetails(false);
    setSelectedMembersToAdd([]);
    setContactsSearchQuery('');
    setAddMembersModalVisible(true);
    fetchContactsForAdding();
  }, [isGroup, receiverId, token, fetchContactsForAdding]);

  // ================= تحديد / إلغاء تحديد عضو =================
  const handleToggleMemberSelection = useCallback((userId: string) => {
    setSelectedMembersToAdd((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  }, []);

  // ================= تنفيذ إضافة الأعضاء =================
  const handleConfirmAddMembers = useCallback(async () => {
    if (!receiverId || !token || selectedMembersToAdd.length === 0) return;

    setIsAddingMembers(true);

    try {
      const res = await fetch(`${API_BASE}/chats/groups/AddMembers/${receiverId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ members: selectedMembersToAdd }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (res.ok && data.success !== false) {
        setAddMembersModalVisible(false);
        setAddMembersSuccessVisible(true);
      } else {
        toast.error(
          data.response || data.message || `فشل: HTTP ${res.status}`
        );
      }
    } catch (e) {
      console.error('Error adding members:', e);
      toast.error('حدث خطأ أثناء إضافة الأعضاء');
    } finally {
      setIsAddingMembers(false);
    }
  }, [receiverId, token, selectedMembersToAdd]);

  // ================= إغلاق مودال الإضافة =================
  const handleCancelAddMembers = useCallback(() => {
    setAddMembersModalVisible(false);
    setSelectedMembersToAdd([]);
    setContactsSearchQuery('');
  }, []);

  // ================= إغلاق مودال النجاح =================
  const handleAddMembersSuccessClose = useCallback(() => {
    setAddMembersSuccessVisible(false);
    fetchGroupData();
  }, [fetchGroupData]);
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
  const canSendVoice = !isTyping && recordingStopped && !!audioBlob;
  const showRecorderBar = isRecording || canSendVoice;
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
            // onClick={() => router.back()}
            onClick={() => router.push('/chats')}
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
                }}
                onClick={(e) => e.stopPropagation()}
              >
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
                           <img
                        src="/imgs/AditGroup.svg"
                        alt="تعديل"
                        style={{
                          width: '15.027753829956055px',
                          height: '14.929990768432617px',
                          opacity: 1,
                        }}
                      />
                        </button>
                      )}
                    </>
                  )}
                </div>

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
                          {/* <img src="/imgs/edit.svg" alt="تعديل" className="w-3.5 h-3.5" /> */}
                          <img
                            src="/imgs/AditGroup.svg"
                            alt="تعديل"
                            style={{
                              width: '15.027753829956055px',
                              height: '14.929990768432617px',
                              opacity: 1,
                            }}
                          />
                        </button>
                      )}
                    </div>
                  )}
                </div>

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

                <div className="flex items-center justify-center mb-1 py-1 -mt-2 flex-wrap gap-2">
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

                  <button
                    className="flex flex-col items-center gap-1 group transition-all duration-200"
                    onClick={() => {
                      setShowGroupDetails(false);
                      toast.info('جاري البحث في المجموعة...');
                    }}
                  >
                    <div className="w-[45px] h-[45px] rounded-full bg-[#FFFFFF] flex items-center justify-center group-hover:bg-[#F5F5F5] transition-all duration-200">
                      <img src="/imgs/search.svg" alt="بحث" className="w-[18px] h-[18px]" />
                    </div>
                    <span className="text-[10px] text-[#B4B4B9]">بحث</span>
                  </button>

                 
                  {isGroupAdmin && (
                    <button
                      className="flex flex-col items-center gap-1 group transition-all duration-200"
                      onClick={handleOpenAddMembers}
                    >
                      <div className="w-[45px] h-[45px] rounded-full bg-[#FFFFFF] flex items-center justify-center group-hover:bg-[#F5F5F5] transition-all duration-200">
                        <img src="/imgs/addperson.svg" alt="إضافة" className="w-[18px] h-[18px]" />
                      </div>
                      <span className="text-[10px] text-[#B4B4B9]">إضافة</span>
                    </button>
                  )}

                 

                  <button
                className="flex flex-col items-center gap-1 group transition-all duration-200"
                onClick={handleToggleArchive}
                disabled={isArchiving}
              >
                <div
                  className={`w-[45px] h-[45px] rounded-full flex items-center justify-center transition-all duration-200 ${
                    isFavorited
                      ? 'bg-[#FFFFFF] group-hover:bg-[#F5F5F5] text-white'
                      : 'bg-[#FFFFFF] group-hover:bg-[#F5F5F5]'
                  } ${isArchiving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isArchiving ? (
                    <svg
                      className="animate-spin"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke={isFavorited ? 'white' : '#D72229'}
                        strokeWidth="3"
                        opacity="0.3"
                      />
                      <path
                        d="M12 2a10 10 0 0 1 10 10"
                        stroke={isFavorited ? 'white' : 'white'}
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <img
                      src="/imgs/archiveIntrChat.svg"
                      alt="أرشفة"
                      className="w-[18px] h-[18px]"
                       
                    />
                  )}
                </div>
                <span className="text-[10px] text-[#B4B4B9]">
                  {isArchiving
                    ? 'جاري...'
                    : isFavorited
                      ? 'إلغاء الأرشفة'
                      : 'أرشفة'}
                </span>
              </button>

                  <div className="relative settings-menu-container">
                    <button
                      className="flex flex-col items-center gap-1 group transition-all duration-200"
                      onClick={() => {
                        setShowSettingsMenu(!showSettingsMenu);
                      }}
                    >
                      <div className="w-[45px] h-[45px] rounded-full bg-[#FFFFFF] flex items-center justify-center group-hover:bg-[#F5F5F5] transition-all duration-200">
                        <img src="/imgs/proChat.svg" alt="إعدادات" className="w-[18px] h-[18px]" />
                      </div>
                      <span className="text-[10px] text-[#B4B4B9]">إعدادات</span>
                    </button>

                    {showSettingsMenu && (
                      <div
                        className="absolute z-[99999] top-full left-1/2 -translate-x-1/2 mt-2"
                        style={{
                          width: '154px',
                          borderRadius: '20px',
                          backgroundColor: "#F5F5F5",
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

                  <button
                    className="flex flex-col items-center gap-1 group transition-all duration-200"
                    onClick={() => {
                      setShowGroupDetails(false);
                      handleLeaveGroup();
                    }}
                  >
                    <div className="w-[45px] h-[45px] rounded-full bg-[#FFFFFF] flex items-center justify-center group-hover:bg-[#F5F5F5] transition-all duration-200">
                      <img src="/imgs/leave.svg" alt="خروج" className="w-[18px] h-[18px]" />
                    </div>
                    <span className="text-[10px] text-[#B4B4B9]">خروج</span>
                  </button>
                </div>

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
{/* 
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
                          )} */}
                          {member.userId !== myId && (
  <div className="flex items-center gap-1">
    {/* زر أدمن / مش أدمن */}
    {isGroupAdmin && !member.isOwner && (
      <button
  onClick={(e) => {
    e.stopPropagation();
    handleToggleMemberAdmin(member);
  }}
  disabled={isUpdatingMemberAdmin === member.userId}
  // className="flex items-center justify-center transition disabled:opacity-50"
  // style={{
  //   width: '30px',
  //   height: '30px',
  //   borderRadius: '20px',
  //   background: '#FFFFFF',
  // }}
   className="flex items-center justify-center transition-colors duration-200 disabled:opacity-50 bg-white hover:bg-[#F5F5F5] active:bg-[#EBEBEB]"
  style={{
    width: '35px',
    height: '35px',
    borderRadius: '20px',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
  }}
  title={member.isAdmin ? 'إزالة الإشراف' : 'ترقية لمشرف'}
>
  {isUpdatingMemberAdmin === member.userId ? (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#D72229" strokeWidth="3" opacity="0.3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="#D72229" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ) : (
    <img
      src={member.isAdmin ? '/imgs/AdmineGroup.svg' : '/imgs/NoAdminGroup.svg'}
      alt={member.isAdmin ? 'Admin' : 'Not Admin'}
      className="w-[14px] h-[14px] object-contain"
    />
  )}
</button>
      // <button
      //   onClick={(e) => {
      //     e.stopPropagation();
      //     handleToggleMemberAdmin(member);
      //   }}
      //   disabled={isUpdatingMemberAdmin === member.userId}
      //   className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50"
      //   title={member.isAdmin ? 'إزالة الإشراف' : 'ترقية لمشرف'}
      // >
      //   {isUpdatingMemberAdmin === member.userId ? (
      //     <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
      //       <circle cx="12" cy="12" r="10" stroke="#D72229" strokeWidth="3" opacity="0.3" />
      //       <path d="M12 2a10 10 0 0 1 10 10" stroke="#D72229" strokeWidth="3" strokeLinecap="round" />
      //     </svg>
      //   ) : (
      //     <img
      //       src={member.isAdmin ? '/imgs/AdmineGroup.svg' : '/imgs/NoAdminGroup.svg'}
      //       alt={member.isAdmin ? 'Admin' : 'Not Admin'}
      //       className="w-[14px] h-[14px] object-contain"
      //     />
      //   )}
      // </button>
    )}

    {/* زر حذف العضو */}
    {isGroupAdmin && !member.isOwner && (
      // <button
      //   onClick={(e) => {
      //     e.stopPropagation();
      //     handleRemoveMember(member);
      //   }}
      //   disabled={isRemovingMember === member.userId}
      //   className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 transition disabled:opacity-50"
      //   title="حذف من المجموعة"
      // >
      //   {isRemovingMember === member.userId ? (
      //     <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
      //       <circle cx="12" cy="12" r="10" stroke="#D72229" strokeWidth="3" opacity="0.3" />
      //       <path d="M12 2a10 10 0 0 1 10 10" stroke="#D72229" strokeWidth="3" strokeLinecap="round" />
      //     </svg>
      //   ) : (
      //     <img src="/imgs/delete.svg" alt="حذف" className="w-4 h-4" />
      //   )}
      // </button>
<button
  onClick={(e) => {
    e.stopPropagation();
    handleRemoveMember(member);
  }}
  disabled={isRemovingMember === member.userId}
  className="flex items-center justify-center transition-colors duration-200 disabled:opacity-50 bg-white hover:bg-[#F5F5F5] active:bg-[#EBEBEB]"
  style={{
    width: '35px',
    height: '35px',
    borderRadius: '20px',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
  }}
  title="حذف من المجموعة"
>
  {isRemovingMember === member.userId ? (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#D72229" strokeWidth="3" opacity="0.3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="#D72229" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ) : (
    <img src="/imgs/deletePerson.svg" alt="حذف" className="w-4 h-4" />
  )}
</button>
    )}

    {/* زر الإعدادات القديم (زي ما هو) */}
    <div className="relative">
      {/* <button
        onClick={(e) => {
          e.stopPropagation();
          setActiveMemberMenuId(isMemberMenuOpen ? null : (member.userId || index));
        }}
        // className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
 
      >
        <img src="/imgs/setting (3).svg" alt="إعدادات العضو" className="w-4 h-4" />
      </button> */}
<button
  onClick={(e) => {
    e.stopPropagation();
    setActiveMemberMenuId(isMemberMenuOpen ? null : (member.userId || index));
  }}
  className="flex items-center justify-center transition-colors duration-200 bg-white hover:bg-[#F5F5F5] active:bg-[#EBEBEB]"
  style={{
    width: '30px',
    height: '30px',
    borderRadius: '20px',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
  }}
  title="إعدادات العضو"
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

            {/* {!isGroup && (
              <bdi className="text-xs text-[#B4B4B9]">
                @{receiverData?.username}
              </bdi>
            )} */}
                 {!isGroup && <LastSeenText user={receiverData} />}
          </div>
        </div>
        <div className="flex items-center justify-start gap-2 relative">
          <div
            onClick={() => {
              if (receiverId && myId) {
                startCall(
                  receiverId,
                  chatName || receiverData?.name || 'مستخدم',
                  false, // false = مكالمة صوتية، خليها true لو عايزة فيديو
                  receiverData?.img
                );
              }
            }}
            className="rounded-[17px] bg-[#F5F5F5] w-[40px] h-[40px] flex items-center justify-center cursor-pointer"
          >
            {/* <img src="/imgs/phoneChat.svg" className="w-[16px] h-[16px]" alt="phoneChat" /> */}
            <img
              src={isGroup ? "/imgs/phonegrope.svg" : "/imgs/phoneChat.svg"}
              className="w-[16px] h-[16px]"
              alt={isGroup ? "groupCall" : "phoneChat"}
            />
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
          className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#d7222897] text-white rounded-2xl px-4 py-2 z-[99999] text-sm border-none cursor-pointer"
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

      {/* ================= Pending Images Display ================= */}
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
                  className="absolute rounded-[18px] overflow-hidden border-2 border-white"
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

      {/* ================= Input Area with Reply ================= */}
  {/* تتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتت */}
  {!shouldHideInput && (
  <div className={`w-full relative transition-all duration-200 ${showRecorderBar ? 'h-[90px]' : 'h-[55px] mt-3'}`}>
    
    {/* ================= عرض الـ Reply في شريط الإدخال ================= */}
    {replyTo && !showRecorderBar && (
      <div className="absolute bottom-[55px] left-0 w-full z-20">
        {renderReplyInput()}
      </div>
    )}

    {/* ================= شريط التسجيل الصوتي (ثابت في القاع تماماً بدون قص للأزرار) ================= */}
    {showRecorderBar && (
      <div
        className="absolute bottom-0 left-0 right-0 z-50 bg-white rounded-t-[20px] shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
      >
        <VoiceRecorderBar
          isRecording={isRecording}
          analyserRef={analyserRef}
          canvasRef={canvasRef}
          duration={recordDuration}
          previewBlob={audioBlob}
          onDelete={isRecording ? cancelRecording : resetRecording}
          onStop={stopRecording}
          onSend={sendVoiceMessage}
        />
      </div>
    )}

    {/* ================= حقل الإدخال والأزرار ================= */}
    {!showRecorderBar && (
      <div className="flex gap-2 items-center w-full h-[55px]">
        {/* زر الإرسال - يظهر فقط عند كتابة نص */}
        {isTyping && (
          <button
            onClick={handleSend}
            className="w-[80px] h-[55px] text-[#D72229] flex items-center justify-center rounded-l-[20px] bg-[#F3F5FF] hover:bg-[#e8eaf0] transition-all duration-200"
          >
            <img
              src="/imgs/sendBtn.svg"
              alt="send"
              className="w-[22px] h-[22px]"
            />
          </button>
        )}

        {/* زر الميكروفون */}
        {!isTyping && canShowMic && (
          <button
            onPointerDown={startRecording}
            className="w-[80px] h-[55px] flex items-center justify-center rounded-l-[20px] bg-[#F3F5FF] hover:bg-[#e8eaf0] transition-all duration-200"
          >
            <img src="/icons/mic.svg" alt="mic" className="w-5 h-5" />
          </button>
        )}

        {/* حقل الإدخال */}
        <div className="flex bg-[#F3F5FF] w-full h-[55px] px-4 py-2 rounded-r-[20px] text-[15px] items-center relative gap-2">
          {/* زر الستكرز */}
          <div className="flex items-center gap-2">
            <Stickers onSelectSticker={handleSendSticker} />
          </div>

          {/* حقل النص */}
          <input
            value={text}
            onChange={(e) => onInputChange(e.target.value)}
            disabled={isRecording}
            placeholder={isRecording ? "تسجيل..." : "اكتب رسالتك هنا"}
            className="w-full outline-none bg-transparent text-right"
            onKeyDown={(e) => {
              if (e.key === "Enter" && isTyping) handleSend();
            }}
          />

          {/* ================= Inputs المخفية ================= */}
          <input
            type="file"
            ref={cameraInputRef}
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleSelectMedia}
            multiple
          />
          <input
            type="file"
            ref={galleryInputRef}
            accept="image/*,video/*"
            className="hidden"
            onChange={handleSelectMedia}
            multiple
          />
          <input
            type="file"
            ref={documentInputRef}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.7z,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
            className="hidden"
            onChange={handleSelectMedia}
            multiple
          />

          {/* الأزرار الجانبية */}
          <div className="flex items-center gap-1 relative">
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              className="p-2 hover:bg-gray-200 rounded-full transition flex items-center justify-center"
              title="اختيار من المعرض"
            >
              <img src="/imgs/gellery.svg" alt="معرض" style={{ width: '24px', height: '24px' }} />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className="p-2 hover:bg-gray-200 rounded-full transition flex items-center justify-center"
                title="رفع ملف"
              >
                <img src="/imgs/fileUpload.svg" alt="upload" style={{ width: '24px', height: '24px' }} />
              </button>

              {showAttachMenu && (
                <div
                  className="absolute bottom-full mb-2 -right-10 translate-x-4 rounded-[20px] flex flex-col gap-1 border border-gray-200 z-50 shadow-lg"
                  style={{
                    width: '169px',
                    background: '#F3F5FF',
                    borderRadius: '20px',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      cameraInputRef.current?.click();
                      setShowAttachMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/50 transition-all duration-200"
                    style={{ borderBottom: '1px solid rgba(60,60,67,0.1)' }}
                  >
                    <span style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '15px', color: '#000000', textAlign: 'right' }}>
                      الكاميرا
                    </span>
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <img src="/imgs/camera.svg" alt="كاميرا" style={{ width: '20px', height: '20px' }} />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      galleryInputRef.current?.click();
                      setShowAttachMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/50 transition-all duration-200"
                    style={{ borderBottom: '1px solid rgba(60,60,67,0.1)' }}
                  >
                    <span style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '15px', color: '#000000', textAlign: 'right' }}>
                      المعرض
                    </span>
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <img src="/imgs/gellery (2).svg" alt="معرض" style={{ width: '20px', height: '20px' }} />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      documentInputRef.current?.click();
                      setShowAttachMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/50 transition-all*/ duration-200"
                  >
                    <span style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '15px', color: '#000000', textAlign: 'right' }}>
                      مستند
                    </span>
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <img src="/imgs/document.svg" alt="مستند" style={{ width: '20px', height: '20px' }} />
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )}
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
      {/* {blockConfirmVisible && (
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
      )} */}

{/* Block Confirmation Modal */}
{/* <BlockConfirmModal
  open={blockConfirmVisible}
  username={chatName || receiverData?.name || (isGroup ? 'هذه المجموعة' : 'هذا المستخدم')}
  action={isUserCurrentlyBlocked ? 'unblock' : 'block'}
  onCancel={handleCancelBlock}
  onConfirm={handleConfirmBlock}
  loading={isBlocking}
/> */}
{/* Block Success Modal */}
{/* <BlockSuccessModal
  open={showBlockSuccess}
  action={isUserCurrentlyBlocked ?  'block':'unblock' }
  onClose={() => setShowBlockSuccess(false)}
/> */}
<div
  style={{
    position: 'relative',
    zIndex: 2147483647, // أقصى قيمة ممكنة للـ z-index
  }}
>
  <BlockConfirmModal
    open={blockConfirmVisible}
    username={
      blockTarget?.name ||
      chatName ||
      receiverData?.name ||
      (isGroup ? 'هذه المجموعة' : 'هذا المستخدم')
    }
    action={
      blockTarget && blockedUsers.includes(blockTarget.id)
        ? 'unblock'
        : 'block'
    }
    onCancel={handleCancelBlock}
    onConfirm={handleConfirmBlock}
    loading={isBlocking}
  />

  <BlockSuccessModal
    open={showBlockSuccess}
    action={blockSuccessAction}
    onClose={() => setShowBlockSuccess(false)}
  />
</div>
      {/* ================= Delete Chat Confirmation Modal ================= */}
      {deleteConfirmVisible && (
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={handleCancelDelete}
        >
          <div
            className="bg-white rounded-[25px] w-full max-w-[420px] p-6 shadow-2xl"
            style={{ fontFamily: 'Cairo, sans-serif' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className="text-center mb-4"
              style={{
                fontWeight: 600,
                fontSize: '20px',
                color: '#D72229',
              }}
            >
              {isGroup ? 'حذف المجموعة' : 'حذف المحادثة'}
            </h2>

            <p
              className="text-center mb-6 whitespace-pre-line"
              style={{
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '1.7',
                color: '#000000',
              }}
            >
              {isGroup
                ? `أنت على وشك حذف المجموعة "${chatName || 'هذه المجموعة'}" بالكامل\n\nسيتم حذف جميع الرسائل والمحتوى الخاص بالمجموعة، ولن تتمكن من استعادتها بعد الحذف.`
                : `أنت على وشك حذف المحادثة مع "${chatName || receiverData?.name || 'هذا المستخدم'}"\n\nسيتم حذف جميع الرسائل والمحتوى الخاص بالمحادثة، ولن تتمكن من استعادتها بعد الحذف.`}
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="flex-1 h-[50px] rounded-[15px] border border-[#D72229] text-[#D72229] font-semibold text-[15px] hover:bg-[#D72229]/5 transition disabled:opacity-50"
              >
                إلغاء
              </button>

              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 h-[50px] rounded-[15px] bg-[#D72229] text-white font-semibold text-[15px] hover:bg-[#b81e24] transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <svg
                      className="animate-spin"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" opacity="0.3" />
                      <path
                        d="M12 2a10 10 0 0 1 10 10"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                    جاري الحذف...
                  </>
                ) : (
                  'نعم، احذف'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= Delete Chat Success Modal ================= */}
      {deleteSuccessVisible && (
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={handleDeleteSuccessClose}
        >
          <div
            className="bg-white rounded-[25px] w-full max-w-[380px] p-6 shadow-2xl text-center"
            style={{ fontFamily: 'Cairo, sans-serif' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-[70px] h-[70px] mx-auto mb-4 rounded-full bg-[#22C55E]/10 flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 6L9 17L4 12"
                  stroke="#22C55E"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2
              className="mb-2"
              style={{
                fontWeight: 600,
                fontSize: '18px',
                color: '#000000',
              }}
            >
              {isGroup ? 'تم حذف المجموعة' : 'تم حذف المحادثة'}
            </h2>

            <p
              className="mb-6"
              style={{
                fontWeight: 400,
                fontSize: '14px',
                color: '#7C7D7E',
              }}
            >
              {isGroup
                ? 'تم حذف المجموعة وجميع رسائلها بنجاح'
                : 'تم حذف المحادثة وجميع رسائلها بنجاح'}
            </p>

            <button
              onClick={handleDeleteSuccessClose}
              className="w-full h-[50px] rounded-[15px] bg-[#D72229] text-white font-semibold text-[15px] hover:bg-[#b81e24] transition"
            >
              حسناً
            </button>
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

            {/* ================= Leave Group Confirmation Modal ================= */}
      {leaveGroupConfirmVisible && (
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={handleCancelLeaveGroup}
        >
          <div
            className="bg-white rounded-[25px] w-full max-w-[420px] p-6 shadow-2xl"
            style={{ fontFamily: 'Cairo, sans-serif' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className="text-center mb-4"
              style={{
                fontWeight: 600,
                fontSize: '20px',
                color: '#D72229',
              }}
            >
              الخروج من المجموعة
            </h2>

            <p
              className="text-center mb-6 whitespace-pre-line"
              style={{
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '1.7',
                color: '#000000',
              }}
            >
              {`أنت على وشك الخروج من المجموعة "${chatName || 'هذه المجموعة'}"\n\nبعد الخروج، لن تتمكن من رؤية الرسائل الجديدة أو التفاعل مع أعضاء المجموعة.`}
            </p>

            {/* تحذير المشرف الوحيد */}
            {isOnlyAdmin && (
              <div className="mb-4 p-3 bg-[#FFF7E6] border border-[#F59E0B]/30 rounded-[12px]">
                <p
                  className="text-right mb-2"
                  style={{
                    fontWeight: 600,
                    fontSize: '13px',
                    color: '#B45309',
                  }}
                >
                  ⚠️ أنت المشرف الوحيد في المجموعة
                </p>
                <p
                  className="text-right mb-3"
                  style={{
                    fontWeight: 400,
                    fontSize: '12px',
                    color: '#7C7D7E',
                  }}
                >
                  لازم تختاري عضو ترفعيه مشرف قبل الخروج:
                </p>

                {promotableMembers.length === 0 ? (
                  <p
                    className="text-right"
                    style={{ fontSize: '12px', color: '#D72229' }}
                  >
                    مفيش أعضاء قابلين للترقية
                  </p>
                ) : (
                  <select
                    value={selectedPromoteMember}
                    onChange={(e) => setSelectedPromoteMember(e.target.value)}
                    disabled={isLeavingGroup}
                    className="w-full h-[42px] px-3 rounded-[10px] border border-[#F59E0B]/40 bg-white text-right outline-none"
                    style={{ fontFamily: 'Cairo, sans-serif', fontSize: '14px' }}
                  >
                    <option value="">-- اختاري عضو --</option>
                    {promotableMembers.map((member) => (
                      <option key={member.userId} value={member.userId}>
                        {member.name || 'مستخدم'}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={handleCancelLeaveGroup}
                disabled={isLeavingGroup}
                className="flex-1 h-[50px] rounded-[15px] border border-[#D72229] text-[#D72229] font-semibold text-[15px] hover:bg-[#D72229]/5 transition disabled:opacity-50"
              >
                إلغاء
              </button>

              <button
                onClick={handleConfirmLeaveGroup}
                disabled={isLeavingGroup || (isOnlyAdmin && !selectedPromoteMember)}
                className="flex-1 h-[50px] rounded-[15px] bg-[#D72229] text-white font-semibold text-[15px] hover:bg-[#b81e24] transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLeavingGroup ? (
                  <>
                    <svg
                      className="animate-spin"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" opacity="0.3" />
                      <path
                        d="M12 2a10 10 0 0 1 10 10"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                    {isOnlyAdmin ? 'جاري الترقية والخروج...' : 'جاري الخروج...'}
                  </>
                ) : (
                  isOnlyAdmin ? 'ترقية وخروج' : 'نعم، أخرج'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= Leave Group Success Modal ================= */}
      {leaveGroupSuccessVisible && (
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={handleLeaveSuccessClose}
        >
          <div
            className="bg-white rounded-[25px] w-full max-w-[380px] p-6 shadow-2xl text-center"
            style={{ fontFamily: 'Cairo, sans-serif' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-[70px] h-[70px] mx-auto mb-4 rounded-full bg-[#22C55E]/10 flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 6L9 17L4 12"
                  stroke="#22C55E"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2
              className="mb-2"
              style={{
                fontWeight: 600,
                fontSize: '18px',
                color: '#000000',
              }}
            >
              تم الخروج من المجموعة
            </h2>

            <p
              className="mb-6"
              style={{
                fontWeight: 400,
                fontSize: '14px',
                color: '#7C7D7E',
              }}
            >
              تم الخروج من المجموعة بنجاح
            </p>

            <button
              onClick={handleLeaveSuccessClose}
              className="w-full h-[50px] rounded-[15px] bg-[#D72229] text-white font-semibold text-[15px] hover:bg-[#b81e24] transition"
            >
              حسناً
            </button>
          </div>
        </div>
      )}



            {/* ================= Promote Admin Modal ================= */}
      {/* {promoteAdminModalVisible && (
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={handleCancelPromoteAdmin}
        >
          <div
            className="bg-white rounded-[25px] w-full max-w-[420px] p-6 shadow-2xl max-h-[80vh] flex flex-col"
            style={{ fontFamily: 'Cairo, sans-serif' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className="text-center mb-2"
              style={{
                fontWeight: 600,
                fontSize: '20px',
                color: '#D72229',
              }}
            >
              ترقية عضو لأدمن
            </h2>

            <p
              className="text-center mb-4"
              style={{
                fontWeight: 400,
                fontSize: '13px',
                color: '#7C7D7E',
                lineHeight: '1.6',
              }}
            >
              {`اختاري عضو عشان يترقّى أدمن معاك في المجموعة "${chatName || 'هذه المجموعة'}"`}
            </p>

            {promotableMembers.length === 0 ? (
              <p
                className="text-center py-6"
                style={{ fontSize: '14px', color: '#D72229', fontWeight: 500 }}
              >
                مفيش أعضاء قابلين للترقية
              </p>
            ) : (
              <div
                className="flex flex-col gap-2 overflow-y-auto mb-4"
                style={{ maxHeight: '300px' }}
              >
                {promotableMembers.map((member) => {
                  const isSelected = selectedPromoteAdminMember === member.userId;
                  return (
                    <button
                      key={member.userId}
                      onClick={() => setSelectedPromoteAdminMember(member.userId)}
                      disabled={isPromotingAdmin}
                      className={`flex items-center justify-between p-3 rounded-[15px] border-2 transition-all disabled:opacity-50 text-right ${
                        isSelected
                          ? 'border-[#D72229] bg-[#D72229]/5'
                          : 'border-transparent bg-[#F5F5F5] hover:bg-[#EEEEEE]'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img
                          src={member.img || member.avatar || '/imgs/user.png'}
                          alt={member.name}
                          className="w-[42px] h-[42px] rounded-[12px] object-cover flex-shrink-0"
                        />
                        <div className="flex flex-col text-right min-w-0">
                          <span
                            className="text-sm font-semibold text-black truncate"
                            style={{ fontFamily: 'Cairo' }}
                          >
                            {member.name || 'مستخدم'}
                          </span>
                          <span
                            className="text-[11px] text-[#B4B4B9] truncate"
                            style={{ fontFamily: 'Cairo' }}
                          >
                            @{member.username || member.name || 'مستخدم'}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          isSelected
                            ? 'border-[#D72229] bg-[#D72229]'
                            : 'border-[#B4B4B9] bg-white'
                        }`}
                      >
                        {isSelected && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M20 6L9 17L4 12"
                              stroke="white"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={handleCancelPromoteAdmin}
                disabled={isPromotingAdmin}
                className="flex-1 h-[50px] rounded-[15px] border border-[#D72229] text-[#D72229] font-semibold text-[15px] hover:bg-[#D72229]/5 transition disabled:opacity-50"
              >
                إلغاء
              </button>

              <button
                onClick={handleConfirmPromoteAdmin}
                disabled={isPromotingAdmin || !selectedPromoteAdminMember}
                className="flex-1 h-[50px] rounded-[15px] bg-[#D72229] text-white font-semibold text-[15px] hover:bg-[#b81e24] transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isPromotingAdmin ? (
                  <>
                    <svg
                      className="animate-spin"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" opacity="0.3" />
                      <path
                        d="M12 2a10 10 0 0 1 10 10"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                    جاري الترقية...
                  </>
                ) : (
                  'ترقية'
                )}
              </button>
            </div>
          </div>
        </div>
      )} */}
            {/* ================= Promote Admin Modal ================= */}
      {promoteAdminModalVisible && (
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={handleCancelPromoteAdmin}
        >
          <div
            className="bg-white rounded-[25px] w-full max-w-[420px] p-6 shadow-2xl max-h-[80vh] flex flex-col"
            style={{ fontFamily: 'Cairo, sans-serif' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className="text-center mb-2"
              style={{
                fontWeight: 600,
                fontSize: '20px',
                color: '#D72229',
              }}
            >
              ترقية عضو لأدمن
            </h2>

            {/* ❌ لو مش أدمن/مالك → رسالة صلاحية */}
            {!isGroupAdmin ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-[70px] h-[70px] mb-4 rounded-full bg-[#D72229]/10 flex items-center justify-center">
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#D72229"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </div>

                <p
                  className="text-center mb-2"
                  style={{
                    fontWeight: 700,
                    fontSize: '16px',
                    color: '#D72229',
                  }}
                >
                  ليس لديك صلاحية
                </p>

                <p
                  className="text-center px-4"
                  style={{
                    fontWeight: 400,
                    fontSize: '13px',
                    color: '#7C7D7E',
                    lineHeight: '1.7',
                  }}
                >
                  ترقية الأعضاء متاحة للأدمن والمالك فقط.
                  <br />
                  من فضلك اطلب من أحد المشرفين ترقيتك.
                </p>
              </div>
            ) : promotableMembers.length === 0 ? (
              /* ✅ أدمن بس مفيش أعضاء قابلين للترقية */
              <p
                className="text-center py-6"
                style={{ fontSize: '14px', color: '#D72229', fontWeight: 500 }}
              >
                مفيش أعضاء قابلين للترقية
              </p>
            ) : (
              /* ✅ أدمن + فيه أعضاء → اعرضي القائمة */
              <>
                <p
                  className="text-center mb-4"
                  style={{
                    fontWeight: 400,
                    fontSize: '13px',
                    color: '#7C7D7E',
                    lineHeight: '1.6',
                  }}
                >
                  {`اختاري عضو عشان يترقّى أدمن معاك في المجموعة "${chatName || 'هذه المجموعة'}"`}
                </p>

                <div
                  className="flex flex-col gap-2 overflow-y-auto mb-4"
                  style={{ maxHeight: '300px' }}
                >
                  {promotableMembers.map((member) => {
                    const isSelected = selectedPromoteAdminMember === member.userId;
                    return (
                      <button
                        key={member.userId}
                        onClick={() => setSelectedPromoteAdminMember(member.userId)}
                        disabled={isPromotingAdmin}
                        className={`flex items-center justify-between p-3 rounded-[15px] border-2 transition-all disabled:opacity-50 text-right ${
                          isSelected
                            ? 'border-[#D72229] bg-[#D72229]/5'
                            : 'border-transparent bg-[#F5F5F5] hover:bg-[#EEEEEE]'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <img
                            src={member.img || member.avatar || '/imgs/user.png'}
                            alt={member.name}
                            className="w-[42px] h-[42px] rounded-[12px] object-cover flex-shrink-0"
                          />
                          <div className="flex flex-col text-right min-w-0">
                            <span
                              className="text-sm font-semibold text-black truncate"
                              style={{ fontFamily: 'Cairo' }}
                            >
                              {member.name || 'مستخدم'}
                            </span>
                            <span
                              className="text-[11px] text-[#B4B4B9] truncate"
                              style={{ fontFamily: 'Cairo' }}
                            >
                              @{member.username || member.name || 'مستخدم'}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            isSelected
                              ? 'border-[#D72229] bg-[#D72229]'
                              : 'border-[#B4B4B9] bg-white'
                          }`}
                        >
                          {isSelected && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M20 6L9 17L4 12"
                                stroke="white"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* الأزرار */}
            <div className="flex gap-3 justify-center mt-auto pt-2">
              <button
                onClick={handleCancelPromoteAdmin}
                disabled={isPromotingAdmin}
                className="flex-1 h-[50px] rounded-[15px] border border-[#D72229] text-[#D72229] font-semibold text-[15px] hover:bg-[#D72229]/5 transition disabled:opacity-50"
              >
                {isGroupAdmin && promotableMembers.length > 0 ? 'إلغاء' : 'حسناً'}
              </button>

              {/* زرار الترقية يظهر للأدمن بس + لو فيه أعضاء */}
              {isGroupAdmin && promotableMembers.length > 0 && (
                <button
                  onClick={handleConfirmPromoteAdmin}
                  disabled={isPromotingAdmin || !selectedPromoteAdminMember}
                  className="flex-1 h-[50px] rounded-[15px] bg-[#D72229] text-white font-semibold text-[15px] hover:bg-[#b81e24] transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPromotingAdmin ? (
                    <>
                      <svg
                        className="animate-spin"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" opacity="0.3" />
                        <path
                          d="M12 2a10 10 0 0 1 10 10"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                      جاري الترقية...
                    </>
                  ) : (
                    'ترقية'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= Promote Admin Success Modal ================= */}
      {promoteAdminSuccessVisible && (
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={handlePromoteAdminSuccessClose}
        >
          <div
            className="bg-white rounded-[25px] w-full max-w-[380px] p-6 shadow-2xl text-center"
            style={{ fontFamily: 'Cairo, sans-serif' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-[70px] h-[70px] mx-auto mb-4 rounded-full bg-[#22C55E]/10 flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 6L9 17L4 12"
                  stroke="#22C55E"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2
              className="mb-2"
              style={{
                fontWeight: 600,
                fontSize: '18px',
                color: '#000000',
              }}
            >
              تمت الترقية بنجاح
            </h2>

            <p
              className="mb-6"
              style={{
                fontWeight: 400,
                fontSize: '14px',
                color: '#7C7D7E',
              }}
            >
              العضو أصبح أدمن في المجموعة
            </p>

            <button
              onClick={handlePromoteAdminSuccessClose}
              className="w-full h-[50px] rounded-[15px] bg-[#D72229] text-white font-semibold text-[15px] hover:bg-[#b81e24] transition"
            >
              حسناً
            </button>
          </div>
        </div>
      )}

            {/* ================= Add Members Modal ================= */}
      {addMembersModalVisible && (
        <motion.div
          drag
          dragMomentum={false}
          className="fixed z-[999999] flex flex-col p-6 bg-[#F5F5F5] cursor-grab active:cursor-grabbing"
          initial={{ x: 0, y: 0 }}
          style={{
            top: '130px',
            left: '18px',
            bottom: '24px',
            width: '420px',
            direction: 'rtl',
            borderRadius: '35px',
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-4 flex-shrink-0">
            <button
              onClick={handleCancelAddMembers}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors p-0"
            >
              <img
                src="/imgs/close.svg"
                alt="returnPage"
                style={{ width: '17px', height: '17px', opacity: 1 }}
              />
            </button>
            <h2
              style={{
                fontFamily: 'Cairo',
                fontWeight: 500,
                fontSize: '25px',
                lineHeight: '100%',
                color: '#000000',
              }}
            >
              اضافة اشخاص
            </h2>
          </div>

          {/* Search */}
          <div
            className="flex items-center bg-white rounded-xl px-3 py-2 mb-3 shadow-sm mx-auto w-full flex-shrink-0"
            style={{ maxWidth: '402px' }}
          >
            <Search className="text-[#B6B7B7] w-4 h-4 ml-2" />
            <input
              type="text"
              placeholder="ابحث عن اسم شخص..."
              value={contactsSearchQuery}
              onChange={(e) => setContactsSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-none"
              style={{ fontFamily: 'Cairo', fontSize: '14px' }}
            />
          </div>

          {/* Counter */}
          <div className="flex items-center justify-between px-2 mb-3 flex-shrink-0">
            <div className="flex items-center gap-2">
              <img
                src="/imgs/addperson.svg"
                alt="صورة المستخدم"
                className="w-[13px] h-[13px] object-cover"
              />
              <span className="text-sm font-semibold text-black">
                عدد الاعضاء
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm">{selectedMembersToAdd.length}</span>
              <span className="text-sm text-gray-500">الأشخاص</span>
            </div>
          </div>

          {/* Members List */}
          <div
            className="flex-1 overflow-y-auto flex flex-col gap-2 mb-4 mx-auto w-full"
            style={{ maxWidth: '402px', minHeight: '150px' }}
          >
            {isLoadingContacts ? (
              <div
                className="flex-1 flex items-center justify-center h-full"
                style={{ minHeight: '200px' }}
              >
                <svg
                  className="animate-spin"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle cx="12" cy="12" r="10" stroke="#D72229" strokeWidth="3" opacity="0.3" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="#D72229" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
            ) : availableContacts.length === 0 ? (
              <div
                className="flex-1 flex items-center justify-center h-full"
                style={{ minHeight: '200px' }}
              >
                <div className="text-center">
                  <img
                    src="/imgs/noMember.svg"
                    alt="لا يوجد أعضاء"
                    className="w-[71px] h-[71px] object-contain mx-auto"
                  />
                </div>
              </div>
            ) : (
              availableContacts.map((contact: any) => {
                const contactId =
                  contact.chatId ||
                  contact.otherUserId ||
                  contact._id ||
                  contact.id;

                const isChecked = selectedMembersToAdd.includes(contactId);
                const displayName =
                  contact.name || contact.userinfo?.name || 'مستخدم';
    
              const imgSrc =
              (Array.isArray(contact.memberAvatars) && contact.memberAvatars.length > 0
                ? (typeof contact.memberAvatars[0] === 'string'
                    ? contact.memberAvatars[0]
                    : contact.memberAvatars[0]?.img ||
                      contact.memberAvatars[0]?.avatar ||
                      contact.memberAvatars[0]?.image)
                : null) ||
              contact.userinfo?.img ||
              contact.otherUser?.img ||
              contact.img ||
              contact.image ||
              contact.avatar ||
              '/imgs/user.png';

                return (
                  <div
                    key={contactId}
                    onClick={() => handleToggleMemberSelection(contactId)}
                    className={`flex items-center justify-between px-2 py-3 rounded-2xl cursor-pointer transition-all ${
                      isChecked
                        ? 'border-2 border-[#D72229] shadow-sm'
                        : 'border-2 border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={imgSrc}
                        className="w-10 h-10 rounded-full object-cover"
                        alt={displayName}
                      />
                      <span className="text-sm font-semibold text-black">
                        {displayName}
                      </span>
                    </div>

                    <div
                      className={`w-[20px] h-[20px] rounded-[20px] flex items-center justify-center shadow-sm transition-all ${
                        isChecked ? 'bg-[#D72229]' : 'bg-white'
                      }`}
                    >
                      {isChecked && (
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M20 6L9 17L4 12"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Submit Footer */}
          <div
            className="flex justify-center items-center flex-shrink-0"
            style={{
              width: 'calc(100% + 48px)',
              marginLeft: '-24px',
              marginRight: '-24px',
              marginBottom: '-24px',
              padding: '16px 24px',
              background: '#E3E3E366',
              backdropFilter: 'blur(35px)',
              borderBottomLeftRadius: '35px',
              borderBottomRightRadius: '35px',
              minHeight: '82px',
            }}
          >
            <button
              onClick={handleConfirmAddMembers}
              disabled={isAddingMembers || selectedMembersToAdd.length === 0}
              style={{
                width: '100%',
                maxWidth: '285px',
                height: '50px',
                borderRadius: '20px',
                background: '#FFFFFF',
                fontFamily: 'Cairo',
                fontWeight: 600,
                fontSize: '17px',
                border: 'none',
                cursor:
                  isAddingMembers || selectedMembersToAdd.length === 0
                    ? 'not-allowed'
                    : 'pointer',
                transition: 'all 0.2s ease',
                opacity:
                  isAddingMembers || selectedMembersToAdd.length === 0
                    ? 0.5
                    : 1,
              }}
              className="hover:bg-gray-100 shadow-md text-black"
            >
              {isAddingMembers ? 'جاري الإضافة...' : 'اضافة الاعضاء'}
            </button>
          </div>
        </motion.div>
      )}

      {/* ================= Add Members Success Modal ================= */}
      {addMembersSuccessVisible && (
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={handleAddMembersSuccessClose}
        >
          <div
            className="bg-white rounded-[25px] w-full max-w-[380px] p-6 shadow-2xl text-center"
            style={{ fontFamily: 'Cairo, sans-serif' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-[70px] h-[70px] mx-auto mb-4 rounded-full bg-[#22C55E]/10 flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 6L9 17L4 12"
                  stroke="#22C55E"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2
              className="mb-2"
              style={{
                fontWeight: 600,
                fontSize: '18px',
                color: '#000000',
              }}
            >
              تمت الإضافة بنجاح
            </h2>

            <p
              className="mb-6"
              style={{
                fontWeight: 400,
                fontSize: '14px',
                color: '#7C7D7E',
              }}
            >
              تم إضافة الأعضاء للمجموعة
            </p>

            <button
              onClick={handleAddMembersSuccessClose}
              className="w-full h-[50px] rounded-[15px] bg-[#D72229] text-white font-semibold text-[15px] hover:bg-[#b81e24] transition"
            >
              حسناً
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
