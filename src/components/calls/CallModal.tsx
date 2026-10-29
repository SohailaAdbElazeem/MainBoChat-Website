// src/components/calls/CallSidebarCard/RingingActions.tsx
'use client';

import React, { useRef, useState } from 'react';
import { COLORS, FONT } from '../constants';

interface Props {
  onAccept: () => void;
  onReject: () => void;
}

export default function RingingActions({ onAccept, onReject }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragStartX = useRef(0);
  const buttonWidth = 60;

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
    if (dragX > 0.7) onAccept();
    else if (dragX < -0.7) onReject();
    else setDragX(0);
    try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
  };

  const buttonOffset = dragX * 70;

  // ✅ اختيار الأيقونة حسب اتجاه السحب
  const iconSrc = dragX < 0 ? '/imgs/call.svg' : '/imgs/RingingButton.svg';

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative', width: '100%', maxWidth: '240px', height: '60px',
        // borderRadius: '30px', background: COLORS.swipeTrack,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', overflow: 'hidden', userSelect: 'none', touchAction: 'none',
      }}
    >
      {/* خلفية خضراء */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: `${Math.max(0, dragX * 100)}%`,
        background: 'linear-gradient(90deg, rgba(234, 248, 228, 0) 21.92%, #FFFFFF 53.96%)',
        transition: isDragging ? 'none' : 'width 0.3s',
        opacity: dragX > 0 ? 1 : 0, pointerEvents: 'none',
      }} />

      {/* خلفية حمراء */}
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0,
        width: `${Math.max(0, -dragX * 100)}%`,
        background: 'linear-gradient(90deg, rgba(234, 248, 228, 0) 21.92%, #FFFFFF 53.96%)',
        transition: isDragging ? 'none' : 'width 0.3s',
        opacity: dragX < 0 ? 1 : 0, pointerEvents: 'none',
      }} />

      {/* ❌ شلنا span "رفض" */}
      {/* ❌ شلنا span "قبول" */}

      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: `translate(calc(-50% + ${buttonOffset}px), -50%)`,
          width: '60px', height: '60px', borderRadius: '50%',
          background: isDragging
            ? dragX > 0.3 ? '#4CAF50' : dragX < -0.3 ? '#D72229' : '#FFFFFF'
            : '#FFFFFF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: isDragging ? 'grabbing' : 'grab',
          transition: isDragging ? 'background 0.2s' : 'transform 0.3s, background 0.2s',
          zIndex: 10, userSelect: 'none', touchAction: 'none',
        }}
      >
        <img
          src={iconSrc}
          alt={dragX < 0 ? 'رفض' : 'قبول'}
          width="22"
          height="22"
          style={{ pointerEvents: 'none' }}
        />
      </div>
    </div>
  );
}