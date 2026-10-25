// src/components/calls/CallSidebarCard/AddPersonView.tsx
'use client';

import React, { useState } from 'react';
import WavyAvatar from '../_shared/WavyAvatar';
import { COLORS, DUMMY_CONTACTS, FONT, IMAGES, RADIUS } from '../constants';

interface Contact {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

interface Props {
  callDuration: string;
  peerName: string;
  peerAvatar: string;
  onClose: () => void;
  onAddToCall: (ids: string[]) => void;
}

export default function AddPersonView({
  callDuration, peerName, peerAvatar, onClose, onAddToCall,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const contacts: Contact[] = DUMMY_CONTACTS;

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
        width: '100%', borderRadius: RADIUS.card, background: COLORS.bg,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxSizing: 'border-box', position: 'relative',
      }}
    >
      {/* الهيدر */}
      <div style={{
        width: '100%', height: '84px', borderRadius: RADIUS.card,
        border: `4px solid ${COLORS.panelBorder}`, background: COLORS.panelBg,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 14px', boxSizing: 'border-box', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            position: 'relative',
            width: participants.length > 1 ? '80px' : '52px',
            height: '52px', flexShrink: 0,
            display: 'flex', alignItems: 'center',
          }}>
            {participants.length <= 1 ? (
              <WavyAvatar clipId="wavyHeaderSingle" src={participants[0]?.avatar} />
            ) : (
              <>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '52px', height: '52px', zIndex: 2 }}>
                  <WavyAvatar clipId="wavyHeaderFirst" src={participants[0].avatar} />
                </div>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '52px', height: '52px', zIndex: 1 }}>
                  <WavyAvatar clipId="wavyHeaderSecond" src={participants[1].avatar} />
                </div>
              </>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontFamily: FONT.cairo, fontWeight: 600, fontSize: '13px', color: COLORS.text }}>
              مكالمة فردية
            </span>
            <span style={{ fontFamily: FONT.cairo, fontWeight: 600, fontSize: '12px', color: COLORS.textMuted }}>
              {callDuration}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={onClose} aria-label="إغلاق المكالمة" style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: COLORS.danger, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img src={IMAGES.endCall} alt="close" style={{ width: '16px', height: '16px', filter: 'brightness(0) invert(1)' }} />
          </button>
          <button onClick={onClose} aria-label="رجوع" style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: COLORS.white, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img src={IMAGES.back} alt="رجوع" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
          </button>
        </div>
      </div>

      {/* المحتوى */}
      <div style={{
        flex: 1, marginTop: '8px',
        borderRadius: `${RADIUS.card} ${RADIUS.card} 0 0`,
        border: `4px solid ${COLORS.panelBg}`, borderBottom: 'none',
        background: COLORS.panelBg, display: 'flex', flexDirection: 'column',
        padding: '16px 14px', boxSizing: 'border-box', overflow: 'hidden',
      }}>
        <h3 style={{ fontFamily: FONT.cairo, fontWeight: 600, fontSize: '15px', color: COLORS.text, textAlign: 'center', margin: '0 0 12px 0' }}>
          أضف أشخاص إلى المكالمة
        </h3>

        <div style={{ position: 'relative', marginBottom: '12px', width: '100%' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن اسم الشخص"
            style={{
              width: '100%', height: '45px', borderRadius: RADIUS.input,
              background: COLORS.inputBg, border: 'none', outline: 'none',
              padding: '0 32px 0 16px', fontFamily: FONT.cairo, fontWeight: 400,
              fontSize: '15px', color: COLORS.text, textAlign: 'right', direction: 'rtl',
              boxSizing: 'border-box', display: 'block',
            }}
          />
          <img src={IMAGES.search} alt="بحث" style={{
            position: 'absolute', right: '10px', top: '50%',
            transform: 'translateY(-50%)', width: '18px', height: '18px',
            objectFit: 'contain', pointerEvents: 'none',
          }} />
        </div>

        <h4 style={{ fontFamily: FONT.cairo, fontWeight: 600, fontSize: '15px', color: COLORS.text, textAlign: 'right', margin: '0 0 8px 0' }}>
          أشخاص تعرفهم
        </h4>

        <div style={{ flex: 1, maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {filteredContacts.length === 0 ? (
            <p style={{ fontFamily: FONT.cairo, fontSize: '13px', color: COLORS.textMuted, textAlign: 'center', marginTop: '20px' }}>
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
                    display: 'flex', alignItems: 'center', padding: '8px',
                    borderRadius: '16px', background: 'transparent', border: 'none',
                    cursor: 'pointer', width: '100%', boxSizing: 'border-box',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                    <img src={isSelected ? IMAGES.checked : IMAGES.unchecked}
                      alt={isSelected ? 'Selected' : 'Not Selected'}
                      style={{ width: '14px', height: '14px', objectFit: 'contain', flexShrink: 0 }} />
                    <img src={contact.avatar || IMAGES.defaultAvatar} alt={contact.name}
                      style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <span style={{ fontFamily: FONT.cairo, fontWeight: 600, fontSize: '15px', color: COLORS.text }}>
                        {contact.name}
                      </span>
                      <span style={{ fontFamily: FONT.cairo, fontWeight: 400, fontSize: '10px', color: COLORS.textMuted }}>
                        @{contact.username}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* زر الإضافة */}
      <div style={{
        width: '100%', height: '80px', background: 'rgba(0, 0, 0, 0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, boxSizing: 'border-box', padding: '10px',
      }}>
        <button
          onClick={handleAdd}
          disabled={selectedIds.length === 0}
          style={{
            width: '90%', height: '50px', borderRadius: RADIUS.button,
            background: COLORS.white, border: 'none',
            cursor: selectedIds.length === 0 ? 'not-allowed' : 'pointer',
            fontFamily: FONT.cairo, fontWeight: 600, fontSize: '17px', color: COLORS.text,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
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