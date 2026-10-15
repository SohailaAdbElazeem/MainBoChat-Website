 


// src/components/calls/CallSidebarCard.tsx
'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useZegoCall } from '@/components/ZegoCallProvider';

// ============================================================
// Helper
// ============================================================
function generateWavyCirclePath(
  cx: number,
  cy: number,
  radius: number,
  waveCount: number,
  amplitude: number
): string {
  const steps = waveCount * 12;
  const step = (Math.PI * 2) / steps;
  let path = '';

  for (let i = 0; i <= steps; i++) {
    const angle = i * step - Math.PI / 2;
    const r = radius + amplitude * Math.sin(waveCount * angle);
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);

    if (i === 0) {
      path += `M ${x.toFixed(2)} ${y.toFixed(2)}`;
    } else {
      path += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
    }
  }

  return path + ' Z';
}

// ============================================================
// Add Person View (inline في الـ Sidebar — نفس تصميم AddPersonModal)
// ============================================================
function AddPersonView({
  callDuration,
  peerName,
  peerAvatar,
  onClose,
  onAddToCall,
}: {
  callDuration: string;
  peerName: string;
  peerAvatar: string;
  onClose: () => void;
  onAddToCall: (ids: string[]) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // ⚠️ مؤقتاً: بيانات ثابتة — استبدليها بجلب جهات الاتصال من API
  const contacts = [
    { id: 'user1', name: 'أحمد محمد', username: '@ahmed', avatar: '/imgs/user.png' },
    { id: 'user2', name: 'سارة علي', username: '@sara', avatar: '/imgs/user.png' },
    { id: 'user3', name: 'محمد حسن', username: '@mohamed', avatar: '/imgs/user.png' },
  ];

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAdd = () => {
    if (selectedIds.length === 0) return;
    onAddToCall(selectedIds);
  };

  // جهات الاتصال المختارة (لعرضها في الهيدر)
  const participants = [
    { id: 'peer', name: peerName, avatar: peerAvatar },
    ...selectedIds.map((id) => {
      const c = contacts.find((x) => x.id === id);
      return { id, name: c?.name, avatar: c?.avatar };
    }),
  ];

  return (
    <div
      dir="rtl"
      style={{
        width: '100%',
        borderRadius: '28px',
        background: '#F1F4F9',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      {/* ===== الجزء الأول: الهيدر ===== */}
      <div
        style={{
          width: '100%',
          height: '84px',
          borderRadius: '28px',
          border: '4px solid #FFFFFF',
          background: '#EAEDF6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 14px',
          boxSizing: 'border-box',
          flexShrink: 0,
        }}
      >
        {/* يسار: صورة/صور موجية + معلومات المكالمة */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              position: 'relative',
              width: participants.length > 1 ? '80px' : '52px',
              height: '52px',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {participants.length === 0 ? (
              <svg width="52" height="52" viewBox="0 0 160 160" style={{ display: 'block' }}>
                <defs>
                  <clipPath id="wavyHeaderDefaultSidebar">
                    <path d={generateWavyCirclePath(80, 80, 70, 14, 3)} />
                  </clipPath>
                </defs>
                <image
                  href="/imgs/user.png"
                  x="0"
                  y="0"
                  width="160"
                  height="160"
                  preserveAspectRatio="xMidYMid slice"
                  clipPath="url(#wavyHeaderDefaultSidebar)"
                />
              </svg>
            ) : participants.length === 1 ? (
              <svg width="52" height="52" viewBox="0 0 160 160" style={{ display: 'block' }}>
                <defs>
                  <clipPath id="wavyHeaderOneSidebar">
                    <path d={generateWavyCirclePath(80, 80, 70, 14, 3)} />
                  </clipPath>
                </defs>
                <image
                  href={participants[0].avatar || '/imgs/user.png'}
                  x="0"
                  y="0"
                  width="160"
                  height="160"
                  preserveAspectRatio="xMidYMid slice"
                  clipPath="url(#wavyHeaderOneSidebar)"
                />
              </svg>
            ) : (
              <>
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '52px',
                    height: '52px',
                    zIndex: 2,
                  }}
                >
                  <svg width="52" height="52" viewBox="0 0 160 160" style={{ display: 'block' }}>
                    <defs>
                      <clipPath id="wavyHeaderFirstSidebar">
                        <path d={generateWavyCirclePath(80, 80, 70, 14, 3)} />
                      </clipPath>
                    </defs>
                    <image
                      href={participants[0].avatar || '/imgs/user.png'}
                      x="0"
                      y="0"
                      width="160"
                      height="160"
                      preserveAspectRatio="xMidYMid slice"
                      clipPath="url(#wavyHeaderFirstSidebar)"
                    />
                  </svg>
                </div>

                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '52px',
                    height: '52px',
                    zIndex: 1,
                  }}
                >
                  <svg width="52" height="52" viewBox="0 0 160 160" style={{ display: 'block' }}>
                    <defs>
                      <clipPath id="wavyHeaderSecondSidebar">
                        <path d={generateWavyCirclePath(80, 80, 70, 14, 3)} />
                      </clipPath>
                    </defs>
                    <image
                      href={participants[1].avatar || '/imgs/user.png'}
                      x="0"
                      y="0"
                      width="160"
                      height="160"
                      preserveAspectRatio="xMidYMid slice"
                      clipPath="url(#wavyHeaderSecondSidebar)"
                    />
                  </svg>
                </div>
              </>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span
              style={{
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                color: '#000',
              }}
            >
              مكالمة فردية
            </span>
            <span
              style={{
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 600,
                fontSize: '12px',
                color: '#7C7D7E',
              }}
            >
              {callDuration}
            </span>
          </div>
        </div>

        {/* يمين: زر الإغلاق + سهم الرجوع */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#D72229',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="إغلاق المكالمة"
          >
            <img
              src="/imgs/call.svg"
              alt="close"
              style={{
                width: '16px',
                height: '16px',
                filter: 'brightness(0) invert(1)',
              }}
            />
          </button>

          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="رجوع"
          >
            <img
              src="/imgs/Back.svg"
              alt="رجوع"
              style={{
                width: '16px',
                height: '16px',
                objectFit: 'contain',
              }}
            />
          </button>
        </div>
      </div>

      {/* ===== الجزء الثاني: إضافة أشخاص ===== */}
      <div
        style={{
          flex: 1,
          marginTop: '8px',
          borderRadius: '28px 28px 0 0',
          border: '4px solid #EAEDF6',
          borderBottom: 'none',
          background: '#EAEDF6',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 14px',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <h3
          style={{
            fontFamily: 'Cairo, sans-serif',
            fontWeight: 600,
            fontSize: '15px',
            color: '#000000',
            textAlign: 'center',
            margin: '0 0 12px 0',
          }}
        >
          أضف أشخاص إلى المكالمة
        </h3>

        {/* Input البحث */}
        <div
          style={{
            position: 'relative',
            marginBottom: '12px',
            width: '100%',
          }}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن اسم الشخص"
            style={{
              width: '100%',
              height: '45px',
              borderRadius: '18px',
              background: '#F2F2F2',
              border: 'none',
              outline: 'none',
              padding: '0 32px 0 16px',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 400,
              fontSize: '15px',
              color: '#000000',
              textAlign: 'right',
              direction: 'rtl',
              boxSizing: 'border-box',
              display: 'block',
            }}
          />
          <img
            src="/imgs/GlobalSearch.svg"
            alt="بحث"
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '18px',
              height: '18px',
              objectFit: 'contain',
              pointerEvents: 'none',
            }}
          />
        </div>

        <h4
          style={{
            fontFamily: 'Cairo, sans-serif',
            fontWeight: 600,
            fontSize: '15px',
            color: '#000000',
            textAlign: 'right',
            margin: '0 0 8px 0',
          }}
        >
          أشخاص تعرفهم
        </h4>

        {/* قائمة الأسماء */}
        <div
          style={{
            flex: 1,
            maxHeight: '220px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {filteredContacts.length === 0 ? (
            <p
              style={{
                fontFamily: 'Cairo, sans-serif',
                fontSize: '13px',
                color: '#7C7D7E',
                textAlign: 'center',
                marginTop: '20px',
              }}
            >
              لا يوجد أشخاص مطابقين
            </p>
          ) : (
            filteredContacts.map((contact) => {
              const isSelected = selectedIds.includes(contact.id);
              return (
                <button
                  key={contact.id}
                  onClick={() => toggleSelect(contact.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px',
                    borderRadius: '16px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: '100%',
                    }}
                  >
                    <img
                      src={isSelected ? '/imgs/check (2).svg' : '/imgs/uncheck.svg'}
                      alt={isSelected ? 'Selected' : 'Not Selected'}
                      style={{
                        width: '14px',
                        height: '14px',
                        objectFit: 'contain',
                        flexShrink: 0,
                      }}
                    />
                    <img
                      src={contact.avatar || '/imgs/user.png'}
                      alt={contact.name}
                      style={{
                        width: '45px',
                        height: '45px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        flexShrink: 0,
                      }}
                    />
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'Cairo, sans-serif',
                          fontWeight: 600,
                          fontSize: '15px',
                          color: '#000',
                        }}
                      >
                        {contact.name}
                      </span>
                      <span
                        style={{
                          fontFamily: 'Cairo, sans-serif',
                          fontWeight: 400,
                          fontSize: '10px',
                          color: '#7C7D7E',
                        }}
                      >
                        {contact.username}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ===== الجزء الثالث: زر الإضافة ===== */}
      <div
        style={{
          width: '100%',
          height: '80px',
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxSizing: 'border-box',
          padding: '10px',
        }}
      >
        <button
          onClick={handleAdd}
          disabled={selectedIds.length === 0}
          style={{
            width: '90%',
            height: '50px',
            borderRadius: '20px',
            background: '#FFFFFF',
            border: 'none',
            cursor: selectedIds.length === 0 ? 'not-allowed' : 'pointer',
            fontFamily: 'Cairo, sans-serif',
            fontWeight: 600,
            fontSize: '17px',
            color: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            opacity: selectedIds.length === 0 ? 0.5 : 1,
          }}
        >
          {selectedIds.length > 0
            ? `إضافة ${selectedIds.length} إلى المكالمة`
            : 'إضافة إلى المكالمة'}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// Main Component
// ============================================================
export default function CallSidebarCard() {
  const {
    callState,
    isMicMuted,
    isSpeakerOn,
    endCall,
    toggleMic,
    toggleSpeaker,
    acceptCall,
    rejectCall,
  } = useZegoCall() as any;

  const [callDuration, setCallDuration] = useState('00:00');
  const [countdown, setCountdown] = useState(60);
  const [showAddPerson, setShowAddPerson] = useState(false);

  // Swipe state (للرنين فقط)
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragStartX = useRef(0);
  const buttonWidth = 60;

  const isRinging = callState?.status === 'ringing';
  const isCalling = callState?.status === 'calling';
  const isConnected = callState?.status === 'connected';

  // ================== المؤقت ==================
  useEffect(() => {
    if (!isConnected) {
      setCallDuration('00:00');
      return;
    }
    let seconds = 0;
    const interval = setInterval(() => {
      seconds++;
      const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
      const secs = (seconds % 60).toString().padStart(2, '0');
      setCallDuration(`${mins}:${secs}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [isConnected]);

  // ================== العد التنازلي ==================
  useEffect(() => {
    if (!isRinging) {
      setCountdown(60);
      setDragX(0);
      return;
    }
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (rejectCall) rejectCall();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRinging, rejectCall]);

  // ================== Swipe Handlers ==================
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const maxDrag = (rect.width - buttonWidth) / 2;
    const deltaX = e.clientX - dragStartX.current;
    const clamped = Math.max(-maxDrag, Math.min(maxDrag, deltaX));
    setDragX(clamped / maxDrag);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragX > 0.7) acceptCall?.();
    else if (dragX < -0.7) rejectCall ? rejectCall() : endCall();
    else setDragX(0);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // ================== Handlers ==================
  const handleEndCall = () => endCall();
  const handleAddPerson = () => setShowAddPerson(true);
  const handleAddToCall = (ids: string[]) => {
    console.log('➕ Adding:', ids);
    setShowAddPerson(false);
  };

  // ================== Wavy Path ==================
  const wavyPath = useMemo(() => generateWavyCirclePath(80, 80, 70, 14, 3), []);
  const buttonOffset = dragX * 70;

  // ============================================================
  // Render
  // ============================================================
  return (
    <div
      dir="rtl"
      style={{
        width: '100%',
        borderRadius: '28px',
        background: '#F1F4F9',
        paddingTop: showAddPerson ? 0 : '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
      }}
    >
      {/* ============ لو فاتح إضافة أشخاص ============ */}
      {showAddPerson ? (
        <AddPersonView
          callDuration={callDuration}
          peerName={callState?.peerName || 'مستخدم'}
          peerAvatar="/imgs/user.png"
          onClose={() => setShowAddPerson(false)}
          onAddToCall={handleAddToCall}
        />
      ) : (
        <>
          {/* ============ نص الحالة ============ */}
          <p
            style={{
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 600,
              fontSize: '13px',
              textAlign: 'center',
              color: isRinging ? '#D72229' : '#7C7D7E',
              margin: '0 0 8px 0',
              padding: '0 12px',
            }}
          >
            {isConnected
              ? 'مكالمة جارية'
              : isCalling
              ? 'جاري الاتصال...'
              : isRinging
              ? 'مكالمة واردة'
              : 'مكالمة صوتية'}
          </p>

          {/* ============ المؤقت (لما متصل) ============ */}
          {isConnected && (
            <p
              style={{
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 400,
                fontSize: '11px',
                textAlign: 'center',
                color: '#7C7D7E',
                margin: '0 0 8px 0',
              }}
            >
              {callDuration}
            </p>
          )}

          {/* ============ العد التنازلي (لما رنين) ============ */}
          {isRinging && (
            <p
              style={{
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 400,
                fontSize: '11px',
                textAlign: 'center',
                color: '#7C7D7E',
                margin: '0 0 8px 0',
              }}
            >
              {countdown} ثانية
            </p>
          )}

          {/* ============ الاسم ============ */}
          <h3
            style={{
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 600,
              fontSize: '18px',
              textAlign: 'center',
              color: '#000',
              margin: '0 0 4px 0',
              padding: '0 12px',
            }}
          >
            {callState?.peerName || 'مستخدم'}
          </h3>

          {/* ============ اليوزرنيم ============ */}
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: '11px',
              textAlign: 'center',
              color: '#000',
              margin: '0 0 12px 0',
              padding: '0 12px',
            }}
          >
            @{callState?.peerUserId?.slice(-8) || 'user'}
          </p>

          {/* ============ الصورة الموجية ============ */}
          <div
            style={{
              position: 'relative',
              width: '120px',
              height: '120px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="120" height="120" viewBox="0 0 160 160" style={{ display: 'block' }}>
              <defs>
                <clipPath id="sidebarCallWavyClip">
                  <path d={wavyPath} />
                </clipPath>
              </defs>
              <image
                href="/imgs/user.png"
                x="0"
                y="0"
                width="160"
                height="160"
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#sidebarCallWavyClip)"
              />
              <path d={wavyPath} fill="none" stroke="transparent" strokeWidth="1.5" />
            </svg>
          </div>

          {/* ============ الأزرار ============ */}
          <div
            style={{
              width: '100%',
              background: '#EAEDF6',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '14px 12px',
            }}
          >
            {/* ============ حالة ringing: Swipe ============ */}
            {isRinging && (
              <div
                ref={containerRef}
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '240px',
                  height: '60px',
                  borderRadius: '30px',
                  background: '#DEE1EA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 20px',
                  overflow: 'hidden',
                  userSelect: 'none',
                  touchAction: 'none',
                }}
              >
                {/* خلفية خضراء */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: `${Math.max(0, dragX * 100)}%`,
                    background: 'linear-gradient(270deg, #4CAF50 0%, rgba(76,175,80,0) 100%)',
                    transition: isDragging ? 'none' : 'width 0.3s',
                    opacity: dragX > 0 ? 1 : 0,
                    pointerEvents: 'none',
                  }}
                />
                {/* خلفية حمراء */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: `${Math.max(0, -dragX * 100)}%`,
                    background: 'linear-gradient(90deg, #D72229 0%, rgba(215,34,41,0) 100%)',
                    transition: isDragging ? 'none' : 'width 0.3s',
                    opacity: dragX < 0 ? 1 : 0,
                    pointerEvents: 'none',
                  }}
                />

                {/* كلمة رفض */}
                <span
                  style={{
                    position: 'absolute',
                    left: '20px',
                    fontFamily: 'Cairo, sans-serif',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#D72229',
                    opacity: dragX < 0 ? 1 - Math.abs(dragX) * 0.5 : 1,
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                >
                  رفض
                </span>

                {/* كلمة قبول */}
                <span
                  style={{
                    position: 'absolute',
                    right: '20px',
                    fontFamily: 'Cairo, sans-serif',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#4CAF50',
                    opacity: dragX > 0 ? 1 - Math.abs(dragX) * 0.5 : 1,
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                >
                  قبول
                </span>

                {/* الزر المسحوب */}
                <div
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: `translate(calc(-50% + ${buttonOffset}px), -50%)`,
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: isDragging
                      ? dragX > 0.3
                        ? '#4CAF50'
                        : dragX < -0.3
                        ? '#D72229'
                        : '#FFFFFF'
                      : '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: isDragging ? 'grabbing' : 'grab',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: isDragging
                      ? 'background 0.2s'
                      : 'transform 0.3s, background 0.2s',
                    zIndex: 10,
                    userSelect: 'none',
                    touchAction: 'none',
                  }}
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isDragging && (dragX > 0.3 || dragX < -0.3) ? '#FFFFFF' : '#000000'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ pointerEvents: 'none' }}
                  >
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </div>
              </div>
            )}

            {/* ============ حالة calling: زر إنهاء فقط ============ */}
            {isCalling && (
              <button
                onClick={handleEndCall}
                style={{
                  width: '150px',
                  height: '50px',
                  borderRadius: '38.5px',
                  background: '#D72229',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(215,34,41,0.4)',
                }}
                aria-label="إنهاء المكالمة"
              >
                <img
                  src="/imgs/call.svg"
                  alt="إنهاء"
                  style={{
                    width: '24px',
                    height: '24px',
                    filter: 'brightness(0) invert(1)',
                    transform: 'rotate(135deg)',
                  }}
                />
              </button>
            )}

            {/* ============ حالة connected: 3 أزرار + إنهاء ============ */}
            {isConnected && (
              <>
                {/* صف الأزرار الصغيرة */}
                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {/* كتم المايك */}
                  <button
                    onClick={toggleMic}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: isMicMuted ? '#D72229' : '#FFFFFF',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    }}
                    aria-label="كتم الميكروفون"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={isMicMuted ? '#FFF' : '#000'}
                      strokeWidth="2"
                    >
                      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                      <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
                      {isMicMuted && <line x1="3" y1="3" x2="21" y2="21" />}
                    </svg>
                  </button>

                  {/* مكبر الصوت */}
                  <button
                    onClick={toggleSpeaker}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: isSpeakerOn ? '#4CAF50' : '#FFFFFF',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    }}
                    aria-label="مكبر الصوت"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={isSpeakerOn ? '#FFF' : '#000'}
                      strokeWidth="2"
                    >
                      <path d="M11 5L6 9H2v6h4l5 4V5z" />
                      {isSpeakerOn ? (
                        <>
                          <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
                        </>
                      ) : (
                        <>
                          <line x1="23" y1="9" x2="17" y2="15" />
                          <line x1="17" y1="9" x2="23" y2="15" />
                        </>
                      )}
                    </svg>
                  </button>

                  {/* إضافة أشخاص */}
                  <button
                    onClick={handleAddPerson}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: '#FFFFFF',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    }}
                    aria-label="إضافة أشخاص"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#000"
                      strokeWidth="2"
                    >
                      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <line x1="20" y1="8" x2="20" y2="14" />
                      <line x1="23" y1="11" x2="17" y2="11" />
                    </svg>
                  </button>
                </div>

                {/* زر إنهاء المكالمة */}
                <button
                  onClick={handleEndCall}
                  style={{
                    width: '150px',
                    height: '50px',
                    borderRadius: '38.5px',
                    background: '#D72229',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(215,34,41,0.4)',
                  }}
                  aria-label="إنهاء المكالمة"
                >
                  <img
                    src="/imgs/call.svg"
                    alt="إنهاء"
                    style={{
                      width: '24px',
                      height: '24px',
                      filter: 'brightness(0) invert(1)',
                      transform: 'rotate(135deg)',
                    }}
                  />
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}