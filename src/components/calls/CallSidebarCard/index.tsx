 
// // src/components/calls/CallSidebarCard/index.tsx
// 'use client';

// import React, { useEffect, useState, useMemo } from 'react';
// import { useZegoCall } from '@/components/ZegoCallProvider';

// import { COLORS, IMAGES, RADIUS, CALL_STATUS_LABEL } from '../constants';
// import WavyAvatar from '../_shared/WavyAvatar';
// import RingingActions from './RingingActions';
// import CallActions from './CallActions';
// import AddPersonView from './AddPersonView';

// export default function CallSidebarCard() {
//   const {
//     callState, isMicMuted, isSpeakerOn,
//     endCall, toggleMic, toggleSpeaker, acceptCall, rejectCall,
//   } = useZegoCall() as any;

//   const [callDuration, setCallDuration] = useState('00:00');
//   const [countdown, setCountdown] = useState(60);
//   const [showAddPerson, setShowAddPerson] = useState(false);

//   const isRinging = callState?.status === 'ringing';
//   const isCalling = callState?.status === 'calling';
//   const isConnected = callState?.status === 'connected';

//   // ============ المؤقت ============
//   useEffect(() => {
//     if (!isConnected) { setCallDuration('00:00'); return; }
//     let seconds = 0;
//     const interval = setInterval(() => {
//       seconds++;
//       const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
//       const secs = (seconds % 60).toString().padStart(2, '0');
//       setCallDuration(`${mins}:${secs}`);
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [isConnected]);

//   // ============ العد التنازلي ============
//   useEffect(() => {
//     if (!isRinging) { setCountdown(60); return; }
//     setCountdown(60);
//     const interval = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev <= 1) { clearInterval(interval); rejectCall?.(); return 0; }
//         return prev - 1;
//       });
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [isRinging, rejectCall]);

//   // ============ الـ username ============
//   const displayUsername = useMemo(() => {
//     const cs = callState;
//     if (!cs) return 'user';
//     return (
//       cs.username ||
//       cs.peerUsername ||
//       cs.user?.username ||
//       cs.peer?.username ||
//       cs.callee?.username ||
//       (cs.peerName ? cs.peerName.toLowerCase().replace(/\s+/g, '_') : null) ||
//       cs.peerUserId?.slice(-8) ||
//       'user'
//     );
//   }, [callState]);

//   const handleAddToCall = (ids: string[]) => {
//     console.log('➕ Adding:', ids);
//     setShowAddPerson(false);
//   };

//   // ============ شاشة إضافة أشخاص ============
//   if (showAddPerson) {
//     return (
//       <div
//         dir="rtl"
//         style={{
//           width: '100%',
//           borderRadius: RADIUS.card,
//           background: COLORS.bg,
//           overflow: 'hidden',
//         }}
//       >
//         <AddPersonView
//           callDuration={callDuration}
//           peerName={callState?.peerName || 'مستخدم'}
//           peerAvatar={IMAGES.defaultAvatar}
//           onClose={() => setShowAddPerson(false)}
//           onAddToCall={handleAddToCall}
//         />
//       </div>
//     );
//   }

//   // ============ ✅ خلفية الأزرار حسب الحالة ============
//   // - ringing (مكالمة واردة — قبول/رفض) → #F1F4F9 (فاتح، نفس الكارت)
//   // - connected (متصل)                     → #F1F4F9 (فاتح، نفس الكارت)
//   // - calling (لسه بيتصل)                  → #EAEDF6 (غامق شوية)
//   const useLightBackground = isRinging || isConnected;

//   const buttonsAreaStyle: React.CSSProperties = {
//     width: '357px',
//     maxWidth: '100%',
//     minHeight: 80,
//     borderRadius: useLightBackground ? 0 : '35px 35px 0 0',
//     background: useLightBackground ? '#F1F4F9' : '#EAEDF6',
//     border: 'none',
//     boxShadow: 'none',
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: '12px',
//     padding: '16px 12px',
//     boxSizing: 'border-box',
//     overflow: 'hidden',
//   };

//   return (
//     <div
//       dir="rtl"
//       style={{
//         width: '100%',
//         borderRadius: RADIUS.card,
//         background: COLORS.bg,
//         paddingTop: '16px',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         position: 'relative',
//         overflow: 'hidden',
//         boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
//       }}
//     >
//       {/* نص الحالة */}
//       <p
//         style={{
//           fontFamily: 'Cairo, sans-serif',
//           fontWeight: 600,
//           fontSize: '13px',
//           textAlign: 'center',
//           color: isRinging ? COLORS.danger : COLORS.textMuted,
//           margin: '0 0 8px 0',
//           padding: '0 12px',
//         }}
//       >
//         {CALL_STATUS_LABEL[callState?.status || 'idle'] ?? CALL_STATUS_LABEL.idle}
//       </p>

//       {/* المؤقت / العد التنازلي */}
//       {isConnected && (
//         <p
//           style={{
//             fontFamily: 'Cairo, sans-serif',
//             fontWeight: 400,
//             fontSize: '11px',
//             textAlign: 'center',
//             color: COLORS.textMuted,
//             margin: '0 0 8px 0',
//           }}
//         >
//           {callDuration}
//         </p>
//       )}
//       {isRinging && (
//         <p
//           style={{
//             fontFamily: 'Cairo, sans-serif',
//             fontWeight: 400,
//             fontSize: '11px',
//             textAlign: 'center',
//             color: COLORS.textMuted,
//             margin: '0 0 8px 0',
//           }}
//         >
//           {countdown} ثانية
//         </p>
//       )}

//       {/* الاسم */}
//       <h3
//         style={{
//           fontFamily: 'Cairo, sans-serif',
//           fontWeight: 600,
//           fontSize: '18px',
//           textAlign: 'center',
//           color: COLORS.text,
//           margin: '0 0 4px 0',
//           padding: '0 12px',
//         }}
//       >
//         {callState?.peerName || 'مستخدم'}
//       </h3>

//       {/* اليوزرنيم */}
//       <p
//         style={{
//           fontFamily: 'Inter, sans-serif',
//           fontWeight: 400,
//           fontSize: '11px',
//           textAlign: 'center',
//           color: COLORS.text,
//           margin: '0 0 12px 0',
//           padding: '0 12px',
//         }}
//       >
//         @{displayUsername}
//       </p>

//       {/* الصورة الموجية */}
//       <div
//         style={{
//           position: 'relative',
//           width: '120px',
//           height: '120px',
//           marginBottom: '16px',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}
//       >
//         <WavyAvatar clipId="sidebarCallWavyClip" size={120} src={IMAGES.defaultAvatar} />
//       </div>

//       {/* ✅ الأزرار */}
//       <div style={buttonsAreaStyle}>
//         {isRinging && (
//           <RingingActions
//             onAccept={() => acceptCall?.()}
//             onReject={() => (rejectCall ? rejectCall() : endCall())}
//           />
//         )}

//         <CallActions
//           isCalling={isCalling}
//           isConnected={isConnected}
//           isMicMuted={isMicMuted}
//           isSpeakerOn={isSpeakerOn}
//           onEnd={endCall}
//           onToggleMic={toggleMic}
//           onToggleSpeaker={toggleSpeaker}
//           onAddPerson={() => setShowAddPerson(true)}
//         />
//       </div>
//     </div>
//   );
// }


// src/components/calls/CallSidebarCard/index.tsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useZegoCall } from '@/components/ZegoCallProvider';

import { COLORS, IMAGES, RADIUS, CALL_STATUS_LABEL } from '../constants';
import WavyAvatar from '../_shared/WavyAvatar';
import RingingActions from './RingingActions';
import CallActions from './CallActions';
import AddPersonView from './AddPersonView';

export default function CallSidebarCard() {
  const {
    callState, isMicMuted, isSpeakerOn,
    endCall, toggleMic, toggleSpeaker, acceptCall, rejectCall,
  } = useZegoCall() as any;

  const [callDuration, setCallDuration] = useState('00:00');
  const [countdown, setCountdown] = useState(60);
  const [showAddPerson, setShowAddPerson] = useState(false);

  const isRinging = callState?.status === 'ringing';
  const isCalling = callState?.status === 'calling';
  const isConnected = callState?.status === 'connected';

  // ============ المؤقت ============
  useEffect(() => {
    if (!isConnected) { setCallDuration('00:00'); return; }
    let seconds = 0;
    const interval = setInterval(() => {
      seconds++;
      const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
      const secs = (seconds % 60).toString().padStart(2, '0');
      setCallDuration(`${mins}:${secs}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [isConnected]);

  // ============ العد التنازلي ============
  useEffect(() => {
    if (!isRinging) { setCountdown(60); return; }
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(interval); rejectCall?.(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRinging, rejectCall]);

  // ============ الـ username ============
  const displayUsername = useMemo(() => {
    const cs = callState;
    if (!cs) return 'user';
    return (
      cs.username ||
      cs.peerUsername ||
      cs.user?.username ||
      cs.peer?.username ||
      cs.callee?.username ||
      (cs.peerName ? cs.peerName.toLowerCase().replace(/\s+/g, '_') : null) ||
      cs.peerUserId?.slice(-8) ||
      'user'
    );
  }, [callState]);

  const handleAddToCall = (ids: string[]) => {
    console.log('➕ Adding:', ids);
    setShowAddPerson(false);
  };

  // ============ شاشة إضافة أشخاص ============
  if (showAddPerson) {
    return (
      <div
        dir="rtl"
        style={{
          width: '100%',
          borderRadius: RADIUS.card,
          background: COLORS.bg,
          overflow: 'hidden',
        }}
      >
        <AddPersonView
          callDuration={callDuration}
          peerName={callState?.peerName || 'مستخدم'}
          peerAvatar={IMAGES.defaultAvatar}
          onClose={() => setShowAddPerson(false)}
          onAddToCall={handleAddToCall}
        />
      </div>
    );
  }

  // ============ ✅ أنماط منطقة الأزرار (3 حالات مختلفة) ============
  // - ringing   → #F1F4F9  | radius 0            | auto height
  // - connected → #EAEDF6  | radius 35 (كلها)    | height 215
  // - calling   → #EAEDF6  | radius 35 35 0 0     | auto height
  const buttonsAreaStyle: React.CSSProperties = isConnected
    ? {
        width: '357px',
        maxWidth: '100%',
        height: 150,
        borderRadius: '35px 35px 0 0',
        background: '#EAEDF6',
        border: 'none',
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '16px 12px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }
    : isRinging
    ? {
        width: '357px',
        maxWidth: '100%',
        minHeight: 80,
        borderRadius: 0,
        background: '#F1F4F9',
        border: 'none',
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '16px 12px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }
    : {
        width: '357px',
        maxWidth: '100%',
        minHeight: 80,
        borderRadius: '35px 35px 0 0',
        background: '#EAEDF6',
        border: 'none',
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '16px 12px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      };

  return (
    <div
      dir="rtl"
      style={{
        width: '100%',
        borderRadius: RADIUS.card,
        background: COLORS.bg,
        paddingTop: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
      }}
    >
      {/* نص الحالة */}
      <p
        style={{
          fontFamily: 'Cairo, sans-serif',
          fontWeight: 600,
          fontSize: '13px',
          textAlign: 'center',
          color: isRinging ? COLORS.danger : COLORS.textMuted,
          margin: '0 0 8px 0',
          padding: '0 12px',
        }}
      >
        {CALL_STATUS_LABEL[callState?.status || 'idle'] ?? CALL_STATUS_LABEL.idle}
      </p>

      {/* المؤقت / العد التنازلي */}
      {isConnected && (
        <p
          style={{
            fontFamily: 'Cairo, sans-serif',
            fontWeight: 400,
            fontSize: '11px',
            textAlign: 'center',
            color: COLORS.textMuted,
            margin: '0 0 8px 0',
          }}
        >
          {callDuration}
        </p>
      )}
      {isRinging && (
        <p
          style={{
            fontFamily: 'Cairo, sans-serif',
            fontWeight: 400,
            fontSize: '11px',
            textAlign: 'center',
            color: COLORS.textMuted,
            margin: '0 0 8px 0',
          }}
        >
          {countdown} ثانية
        </p>
      )}

      {/* الاسم */}
      <h3
        style={{
          fontFamily: 'Cairo, sans-serif',
          fontWeight: 600,
          fontSize: '18px',
          textAlign: 'center',
          color: COLORS.text,
          margin: '0 0 4px 0',
          padding: '0 12px',
        }}
      >
        {callState?.peerName || 'مستخدم'}
      </h3>

      {/* اليوزرنيم */}
      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: '11px',
          textAlign: 'center',
          color: COLORS.text,
          margin: '0 0 12px 0',
          padding: '0 12px',
        }}
      >
        @{displayUsername}
      </p>

      {/* الصورة الموجية */}
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
        <WavyAvatar clipId="sidebarCallWavyClip" size={120} src={IMAGES.defaultAvatar} />
      </div>

      {/* ✅ الأزرار — الأنماط الثلاثة */}
      <div style={buttonsAreaStyle}>
        {isRinging && (
          <RingingActions
            onAccept={() => acceptCall?.()}
            onReject={() => (rejectCall ? rejectCall() : endCall())}
          />
        )}

        <CallActions
          isCalling={isCalling}
          isConnected={isConnected}
          isMicMuted={isMicMuted}
          isSpeakerOn={isSpeakerOn}
          onEnd={endCall}
          onToggleMic={toggleMic}
          onToggleSpeaker={toggleSpeaker}
          onAddPerson={() => setShowAddPerson(true)}
        />
      </div>
    </div>
  );
}