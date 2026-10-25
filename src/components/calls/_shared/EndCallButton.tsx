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
  onClick, width = 150, height = 50, iconSize = 24,
}: Props) {
  return (
    <button
      onClick={onClick}
      aria-label="إنهاء المكالمة"
      style={{
        width, height,
        borderRadius: RADIUS.endBtn,
        background: COLORS.danger,
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
       }}
    >
      <img
        src={IMAGES.endCall}
        alt="إنهاء"
        style={{
          width: iconSize, height: iconSize,
        }}
      />
    </button>
  );
}