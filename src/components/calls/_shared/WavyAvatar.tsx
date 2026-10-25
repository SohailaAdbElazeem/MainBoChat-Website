// src/components/calls/_shared/WavyAvatar.tsx
'use client';

import React, { useMemo } from 'react';
import { IMAGES } from '../constants';

function generateWavyCirclePath(
  cx: number, cy: number, radius: number, waveCount: number, amplitude: number
): string {
  const steps = waveCount * 12;
  const step = (Math.PI * 2) / steps;
  let path = '';
  for (let i = 0; i <= steps; i++) {
    const angle = i * step - Math.PI / 2;
    const r = radius + amplitude * Math.sin(waveCount * angle);
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    path += i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return path + ' Z';
}

interface Props {
  src?: string | null;
  size?: number;
  clipId: string;
}

export default function WavyAvatar({ src, size = 52, clipId }: Props) {
  const path = useMemo(() => generateWavyCirclePath(80, 80, 70, 14, 3), []);
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" style={{ display: 'block' }}>
      <defs>
        <clipPath id={clipId}><path d={path} /></clipPath>
      </defs>
      <image
        href={src || IMAGES.defaultAvatar}
        x="0" y="0" width="160" height="160"
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${clipId})`}
      />
    </svg>
  );
}