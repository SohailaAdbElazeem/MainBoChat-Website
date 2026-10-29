// src/components/calls/CallSidebarCard/CallActions.tsx
'use client';

import React from 'react';
import { COLORS } from '../constants';
import EndCallButton from '../_shared/EndCallButton';

interface Props {
  isCalling: boolean;
  isConnected: boolean;
  isMicMuted: boolean;
  isSpeakerOn: boolean;
  onEnd: () => void;
  onToggleMic: () => void;
  onToggleSpeaker: () => void;
  onAddPerson: () => void;
}

// ✅ نمط موحّد لكل الأزرار
const actionBtn = (active: boolean, activeColor: string): React.CSSProperties => ({
  width: 60,
  height: 48,
  borderRadius: 24,
  background: active ? activeColor : COLORS.white,
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.2s ease',
});

// ✅ نمط النص تحت كل زرار
const labelStyle: React.CSSProperties = {
  fontFamily: 'Cairo, sans-serif',
  fontWeight: 600,
  fontSize: '12px',
  lineHeight: '100%',
  letterSpacing: 0,
  textAlign: 'center',
  color: '#7C7D7E',
};

export default function CallActions({
  isCalling, isConnected, isMicMuted, isSpeakerOn,
  onEnd, onToggleMic, onToggleSpeaker, onAddPerson,
}: Props) {
  if (isCalling) {
    return <EndCallButton onClick={onEnd} />;
  }

  if (!isConnected) return null;

  return (
    <>
      <div
        style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          alignItems: 'flex-start',   // ← flex-start عشان النصوص تتحاذي من فوق
        }}
      >
        {/* ✅ كتم المايك + النص */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={onToggleMic}
            style={actionBtn(isMicMuted, '#7C7D7E')}
            aria-label="كتم الميكروفون"
          >
            <img
              src="/imgs/Mic.svg"
              alt="ميكروفون"
              style={{
                width: '22.93px',
                height: '21.89px',
                objectFit: 'contain',
                filter: isMicMuted ? 'brightness(0) invert(1)' : 'none',
                transition: 'filter 0.2s ease',
                pointerEvents: 'none',
              }}
            />
          </button>
          <span style={labelStyle}>المايك</span>
        </div>

        {/* ✅ مكبر الصوت + النص */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={onToggleSpeaker}
            style={actionBtn(isSpeakerOn, COLORS.success)}
            aria-label="مكبر الصوت"
          >
            <img
              src="/imgs/Speaker (2).svg"
              alt="مكبر الصوت"
              style={{
                width: '20px',
                height: '20px',
                objectFit: 'contain',
                filter: isSpeakerOn ? 'brightness(0) invert(1)' : 'none',
                transition: 'filter 0.2s ease',
                pointerEvents: 'none',
              }}
            />
          </button>
          <span style={labelStyle}>مكبر الصوت</span>
        </div>

        {/* ✅ إضافة أشخاص + النص */}
        {/* <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={onAddPerson}
            style={actionBtn(false, COLORS.white)}
            aria-label="إضافة أشخاص"
          >
            <img
              src="/imgs/AddPerson.svg"
              alt="إضافة أشخاص"
              style={{
                width: '20px',
                height: '20px',
                objectFit: 'contain',
                pointerEvents: 'none',
              }}
            />
          </button>
          <span style={labelStyle}>إضافة شخص</span>
        </div> */}
      </div>

      <EndCallButton onClick={onEnd} />
    </>
  );
}