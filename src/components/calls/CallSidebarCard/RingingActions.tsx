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
  const buttonWidth = 90;

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
        position: 'relative', width: '100%', maxWidth: '240px', height: '70px',
        borderRadius: '38.5px', background: COLORS.swipeTrack,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', overflow: 'hidden', userSelect: 'none', touchAction: 'none',
      }}
    >
      {/* ✅ خلفية موحّدة في الاتجاهين */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0,
        ...(dragX > 0
          ? { right: 0, left: 'auto', width: `${Math.abs(dragX) * 100}%` }
          : { left: 0, right: 'auto', width: `${Math.abs(dragX) * 100}%` }),
        background: 'linear-gradient(90deg, rgba(234, 248, 228, 0) 21.92%, #FFFFFF 53.96%)',
        // background: '#FFFFFF',
        transition: isDragging ? 'none' : 'width 0.3s',
        opacity: dragX !== 0 ? 1 : 0,
        pointerEvents: 'none',
      }} />

      {/* كلمة "رفض" */}
      <span style={{
        position: 'absolute', left: '20px',
        fontFamily: FONT.cairo, fontWeight: 600, fontSize: '14px', color: COLORS.danger,
        opacity: dragX !== 0 ? 0 : 1,
        pointerEvents: 'none', zIndex: 1,
        transition: 'opacity 0.2s ease',
      }}>رفض</span>

      {/* كلمة "قبول" */}
      <span style={{
        position: 'absolute', right: '20px',
        fontFamily: FONT.cairo, fontWeight: 600, fontSize: '14px', color: COLORS.success,
        opacity: dragX !== 0 ? 0 : 1,
        pointerEvents: 'none', zIndex: 1,
        transition: 'opacity 0.2s ease',
      }}>قبول</span>

      
  
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
    width: '90px',
    height: '60px',
    // ✅ الحدود والخلفية بيختفوا وقت السحب
    borderRadius: isDragging ? 0 : '38.5px',
    background: isDragging ? 'transparent' : '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: isDragging ? 'grabbing' : 'grab',
    transition: isDragging ? 'none' : 'transform 0.3s, background 0.2s',
    zIndex: 10,
    userSelect: 'none',
    touchAction: 'none',
  }}
>
  <img
    src={dragX < 0 ? '/imgs/RejectedBtn.svg' : '/imgs/RingingButton.svg'}
    alt="Ringing Button"
    width="22"
    height="22"
    style={{
      pointerEvents: 'none',
      transition: isDragging ? 'none' : 'transform 0.3s ease',
    }}
  />
</div>
    </div>
  );
}