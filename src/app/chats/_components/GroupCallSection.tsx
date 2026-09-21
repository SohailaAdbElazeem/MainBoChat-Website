// src/app/chats/_components/GroupCallSection.tsx
'use client';

import GroupCallModal from './components/calls/GroupCallModal';
import CallInterface from './components/calls/CallInterface';
import { useGroupCall } from './hook/useGroupCall';
import { GroupCallParticipant } from '../types';

interface GroupCallSectionProps {
  apiBase: string;
  token: string | null;
  userName: string;
  participants: GroupCallParticipant[];
  freeMinutes?: number;
}

export default function GroupCallSection({
  apiBase,
  token,
  userName,
  participants,
  freeMinutes = 60,
}: GroupCallSectionProps) {
  const groupCall = useGroupCall({
    participants,
    freeMinutes,
    apiBase,
    token,
    onCallStarted: (call) => {
      console.log('✅ Group call started:', call);
    },
    onCallEnded: () => {
      console.log('❌ Group call ended');
    },
  });

  return (
    <>
      {/* ===== زر بدء المكالمة الجماعية ===== */}
      {!groupCall.activeCall && (
        <button
          onClick={groupCall.openModal}
          style={{
            width: '200px',
            height: '50px',
            borderRadius: '25px',
            background: '#D72229',
            color: '#fff',
            border: 'none',
            fontFamily: 'Cairo',
            fontWeight: 600,
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <img
            src="/imgs/call.svg"
            alt="اتصال"
            style={{
              width: '20px',
              height: '20px',
              filter: 'brightness(0) invert(1)',
            }}
          />
          بدء مكالمة جماعية
        </button>
      )}

      {/* ===== المودال (قبل بدء المكالمة) ===== */}
      <GroupCallModal
        isOpen={groupCall.isOpen}
        participants={groupCall.participants}
        freeMinutes={groupCall.freeMinutes}
        isStarting={groupCall.isStarting}
        onClose={groupCall.closeModal}
        onStart={groupCall.startCall}
      />

      {/* ===== واجهة المكالمة النشطة ===== */}
      {groupCall.activeCall && (
        <CallInterface
          activeCall={groupCall.activeCall}
          apiBase={apiBase}
          token={token}
          userName={userName}
          onClose={groupCall.endCall}
        />
      )}
    </>
  );
}