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

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative', width: '100%', maxWidth: '240px', height: '60px',
        borderRadius: '30px', background: COLORS.swipeTrack,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', overflow: 'hidden', userSelect: 'none', touchAction: 'none',
      }}
    >
      {/* خلفية خضراء */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: `${Math.max(0, dragX * 100)}%`,
        background: 'linear-gradient(270deg, #4CAF50 0%, rgba(76,175,80,0) 100%)',
        transition: isDragging ? 'none' : 'width 0.3s',
        opacity: dragX > 0 ? 1 : 0, pointerEvents: 'none',
      }} />
      {/* خلفية حمراء */}
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0,
        width: `${Math.max(0, -dragX * 100)}%`,
        background: 'linear-gradient(90deg, #D72229 0%, rgba(215,34,41,0) 100%)',
        transition: isDragging ? 'none' : 'width 0.3s',
        opacity: dragX < 0 ? 1 : 0, pointerEvents: 'none',
      }} />

      <span style={{
        position: 'absolute', left: '20px',
        fontFamily: FONT.cairo, fontWeight: 600, fontSize: '14px', color: COLORS.danger,
        opacity: dragX < 0 ? 1 - Math.abs(dragX) * 0.5 : 1,
        pointerEvents: 'none', zIndex: 1,
      }}>رفض</span>

      <span style={{
        position: 'absolute', right: '20px',
        fontFamily: FONT.cairo, fontWeight: 600, fontSize: '14px', color: COLORS.success,
        opacity: dragX > 0 ? 1 - Math.abs(dragX) * 0.5 : 1,
        pointerEvents: 'none', zIndex: 1,
      }}>قبول</span>

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
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          transition: isDragging ? 'background 0.2s' : 'transform 0.3s, background 0.2s',
          zIndex: 10, userSelect: 'none', touchAction: 'none',
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
          stroke={isDragging && (dragX > 0.3 || dragX < -0.3) ? '#FFFFFF' : '#000000'}
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ pointerEvents: 'none' }}>
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
        </svg>
      </div>
    </div>
  );
}