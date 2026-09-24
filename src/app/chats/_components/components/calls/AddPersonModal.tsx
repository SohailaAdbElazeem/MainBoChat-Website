// src/app/chats/_components/components/calls/AddPersonModal.tsx
'use client';

import { useState } from 'react';

/**
 * دالة توليد مسار دائري بموجات جيبية ناعمة
 */
function generateWavyCirclePath(
  cx: number,
  cy: number,
  radius: number,
  waveCount: number,
  amplitude: number
): string {
  const steps = waveCount * 12;
  const step = (Math.PI * 2) / steps;
  let path = '';

  for (let i = 0; i <= steps; i++) {
    const angle = i * step - Math.PI / 2;
    const r = radius + amplitude * Math.sin(waveCount * angle);
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);

    if (i === 0) {
      path += `M ${x.toFixed(2)} ${y.toFixed(2)}`;
    } else {
      path += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
    }
  }

  return path + ' Z';
}

interface Contact {
  id: string;
  name: string;
  username: string;
  avatar?: string;
}

interface Participant {
  id: string;
  name?: string;
  avatar?: string;
}

interface AddPersonModalProps {
  callType?: 'video' | 'audio';
  callDuration?: string;
  contacts?: Contact[];
  participants?: Participant[];
  onClose: () => void;
  onBack: () => void;
  onAddToCall: (selectedIds: string[]) => void;
}

export default function AddPersonModal({
  callType = 'audio',
  callDuration = '00:00',
  contacts = [],
  participants = [],
  onClose,
  onBack,
  onAddToCall,
}: AddPersonModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // فلترة الأشخاص حسب البحث
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

  return (
    <div
      style={{
        width: '357px',
        maxHeight: '566px',
        borderRadius: '35px',
        background: '#F1F4F9',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxSizing: 'border-box',
        position: 'relative',
        marginRight: '20px',
      }}
    >
      {/* ===== الجزء الأول: الهيدر ===== */}
      <div
        style={{
          width: '100%',
          height: '84px',
          borderRadius: '32px',
          border: '4px solid #FFFFFF',
          background: '#EAEDF6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 14px',
          boxSizing: 'border-box',
          flexShrink: 0,
        }}
      >
        {/* يسار: صورة/صور موجية + معلومات المكالمة */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              position: 'relative',
              width: participants.length > 1 ? '80px' : '52px',
              height: '52px',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {participants.length === 0 ? (
              <svg
                width="52"
                height="52"
                viewBox="0 0 160 160"
                style={{ display: 'block' }}
              >
                <defs>
                  <clipPath id="wavyHeaderDefault">
                    <path d={generateWavyCirclePath(80, 80, 70, 14, 3)} />
                  </clipPath>
                </defs>
                <image
                  href="/imgs/user.png"
                  x="0"
                  y="0"
                  width="160"
                  height="160"
                  preserveAspectRatio="xMidYMid slice"
                  clipPath="url(#wavyHeaderDefault)"
                />
              </svg>
            ) : participants.length === 1 ? (
              <svg
                width="52"
                height="52"
                viewBox="0 0 160 160"
                style={{ display: 'block' }}
              >
                <defs>
                  <clipPath id="wavyHeaderOne">
                    <path d={generateWavyCirclePath(80, 80, 70, 14, 3)} />
                  </clipPath>
                </defs>
                <image
                  href={participants[0].avatar || '/imgs/user.png'}
                  x="0"
                  y="0"
                  width="160"
                  height="160"
                  preserveAspectRatio="xMidYMid slice"
                  clipPath="url(#wavyHeaderOne)"
                />
              </svg>
            ) : (
              <>
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '52px',
                    height: '52px',
                    zIndex: 2,
                  }}
                >
                  <svg
                    width="52"
                    height="52"
                    viewBox="0 0 160 160"
                    style={{ display: 'block' }}
                  >
                    <defs>
                      <clipPath id="wavyHeaderFirst">
                        <path d={generateWavyCirclePath(80, 80, 70, 14, 3)} />
                      </clipPath>
                    </defs>
                    <image
                      href={participants[0].avatar || '/imgs/user.png'}
                      x="0"
                      y="0"
                      width="160"
                      height="160"
                      preserveAspectRatio="xMidYMid slice"
                      clipPath="url(#wavyHeaderFirst)"
                    />
                  </svg>
                </div>

                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '52px',
                    height: '52px',
                    zIndex: 1,
                  }}
                >
                  <svg
                    width="52"
                    height="52"
                    viewBox="0 0 160 160"
                    style={{ display: 'block' }}
                  >
                    <defs>
                      <clipPath id="wavyHeaderSecond">
                        <path d={generateWavyCirclePath(80, 80, 70, 14, 3)} />
                      </clipPath>
                    </defs>
                    <image
                      href={participants[1].avatar || '/imgs/user.png'}
                      x="0"
                      y="0"
                      width="160"
                      height="160"
                      preserveAspectRatio="xMidYMid slice"
                      clipPath="url(#wavyHeaderSecond)"
                    />
                  </svg>
                </div>
              </>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span
              style={{
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                color: '#000',
              }}
            >
              {callType === 'video' ? 'مكالمة جماعية' : 'مكالمة فردية'}
            </span>
            <span
              style={{
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 600,
                fontSize: '12px',
                color: '#7C7D7E',
              }}
            >
              {callDuration}
            </span>
          </div>
        </div>

        {/* يمين: زر الإغلاق + سهم الرجوع */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#D72229',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="إغلاق المكالمة"
          >
            <img
              src="/imgs/call.svg"
              alt="close"
              style={{
                width: '16px',
                height: '16px',
                filter: 'brightness(0) invert(1)',
              }}
            />
          </button>

          <button
            onClick={onBack}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="رجوع"
          >
            <img
              src="/imgs/Back.svg"
              alt="رجوع"
              style={{
                width: '16px',
                height: '16px',
                objectFit: 'contain',
              }}
            />
          </button>
        </div>
      </div>

      {/* ===== الجزء الثاني: إضافة أشخاص (القائمة) ===== */}
      <div
        style={{
          flex: 1,
          marginTop: '8px',
          borderRadius: '32px 32px 0 0',
          border: '4px solid #EAEDF6',
          borderBottom: 'none',
          background: '#EAEDF6',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 14px',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <h3
          style={{
            fontFamily: 'Cairo, sans-serif',
            fontWeight: 600,
            fontSize: '15px',
            lineHeight: '100%',
            color: '#000000',
            textAlign: 'center',
            margin: '0 0 12px 0',
          }}
        >
          أضف أشخاص إلى المكالمة
        </h3>

        {/* Input البحث */}
        <div
          style={{
            position: 'relative',
            marginBottom: '12px',
            width: '100%',
          }}
        >
          <style>
            {`
              .custom-search-input::placeholder {
                font-family: 'Cairo', sans-serif;
                font-weight: 400;
                font-size: 15px;
                color: #B6B7B7;
                opacity: 1;
              }
            `}
          </style>

          <input
            type="text"
            className="custom-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن اسم الشخص"
            style={{
              width: '100%',
              height: '45px',
              borderRadius: '18px',
              background: '#F2F2F2',
              border: 'none',
              outline: 'none',
              padding: '0 32px 0 16px',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 400,
              fontSize: '15px',
              color: '#000000',
              textAlign: 'right',
              direction: 'rtl',
              boxSizing: 'border-box',
              display: 'block',
            }}
          />

          <img
            src="/imgs/GlobalSearch.svg"
            alt="بحث"
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '18px',
              height: '18px',
              objectFit: 'contain',
              pointerEvents: 'none',
            }}
          />
        </div>

        <h4
          style={{
            fontFamily: 'Cairo, sans-serif',
            fontWeight: 600,
            fontSize: '15px',
            color: '#000000',
            textAlign: 'right',
            margin: '0 0 8px 0',
          }}
        >
          أشخاص تعرفهم
        </h4>

        {/* قائمة الأسماء القابلة للتمرير */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {filteredContacts.length === 0 ? (
            <p
              style={{
                fontFamily: 'Cairo, sans-serif',
                fontSize: '13px',
                color: '#7C7D7E',
                textAlign: 'center',
                marginTop: '20px',
              }}
            >
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
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px',
                    borderRadius: '16px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: '100%',
                    }}
                  >
                    <img
                      src={
                        isSelected
                          ? '/imgs/check (2).svg'
                          : '/imgs/uncheck.svg'
                      }
                      alt={isSelected ? 'Selected' : 'Not Selected'}
                      style={{
                        width: '14px',
                        height: '14px',
                        objectFit: 'contain',
                        flexShrink: 0,
                      }}
                    />

                    <img
                      src={contact.avatar || '/imgs/user.png'}
                      alt={contact.name}
                      style={{
                        width: '45px',
                        height: '45px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        flexShrink: 0,
                      }}
                    />

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'Cairo, sans-serif',
                          fontWeight: 600,
                          fontSize: '15px',
                          color: '#000',
                        }}
                      >
                        {contact.name}
                      </span>
                      <span
                        style={{
                          fontFamily: 'Cairo, sans-serif',
                          fontWeight: 400,
                          fontSize: '10px',
                          color: '#7C7D7E',
                        }}
                      >
                        {contact.username}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ===== الجزء الثالث: الفوتر (زر الإضافة) ===== */}
      <div
        style={{
          width: '100%',
          height: '80px',
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxSizing: 'border-box',
          padding: '10px',
        }}
      >
        <button
          onClick={handleAdd}
          disabled={selectedIds.length === 0}
          style={{
            width: '90%',
            height: '50px',
            borderRadius: '20px',
            background: '#FFFFFF',
            border: 'none',
            cursor: selectedIds.length === 0 ? 'not-allowed' : 'pointer',
            fontFamily: 'Cairo, sans-serif',
            fontWeight: 600,
            fontSize: '17px',
            color: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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