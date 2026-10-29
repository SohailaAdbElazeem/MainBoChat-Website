// src/components/calls/_shared/EndCallButton.tsx
'use client';

import React from 'react';
import { COLORS, IMAGES, RADIUS } from '../constants';

interface Props {
  onClick: () => void;
  width?: number;
  height?: number;
  iconSize?: number;
}

export default function EndCallButton({
  onClick,
  width = 150,        
  height = 64,       
  iconSize = 24,
}: Props) {
  return (
    <button
      onClick={onClick}
      aria-label="إنهاء المكالمة"
      style={{
        width,
        height,
        borderRadius: '38.5px',      // ✅ 38.5 مباشرة (بدل RADIUS.endBtn)
        background: '#D72229',       // ✅ اللون المطلوب (بدل COLORS.danger)
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 1,                  // ✅ (افتراضي، بس للتأكيد)
        transition: 'background 0.2s ease',
      }}
    >
      <img
        src={IMAGES.endCall}
        alt="إنهاء"
        style={{
          width: iconSize,
          height: iconSize,
        }}
      />
    </button>
  );
}