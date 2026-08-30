/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';


type FilterType = 'all' | 'read' | 'unread' | 'starred' | 'groups' | 'calls';;

//   Props
type ChatFiltersProps = {
  onFilterChange: (filter: FilterType) => void;
  activeFilter: FilterType;
  counts?: {
    all: number;
    read: number;
    unread: number;
    starred: number;
    groups: number;
    calls: number;
  };
};

//  مصفوفة الفلاتر بالترتيب المطلوب
const filters: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'الكل' },
  { key: 'read', label: 'مقروء' },
  { key: 'unread', label: 'غير مقروء' },
  { key: 'starred', label: 'مميز' },
  { key: 'groups', label: 'المجموعات' },
  { key: 'calls', label: 'المكالمات' },
 
];

export default function ChatFilters({ 
  onFilterChange, 
  activeFilter,
  counts = { all: 0, read: 0, unread: 0, favorite: 0, groups: 0, calls: 0 }
}: ChatFiltersProps) {
  const [hoveredFilter, setHoveredFilter] = useState<FilterType | null>(null);

  return (
    <div className="flex items-center justify-center gap-2 mb-4 px-4 w-full">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.key;
        const isHovered = hoveredFilter === filter.key;
        const count = counts[filter.key] || 0;
        
        return (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            onMouseEnter={() => setHoveredFilter(filter.key)}
            onMouseLeave={() => setHoveredFilter(null)}
            style={{
              // width: '50px',
              width: 'auto',
              padding: '0 6px',  
              height: '31px',
              borderRadius: '9px',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 600,
              fontSize: '12px',
              lineHeight: '100%',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              transition: 'all 0.2s ease',
              border: isActive ? '1px solid #F2F2F2' : 'none',
              cursor: 'pointer',
              opacity: 1,
               backgroundColor: isActive ? '#FFFFFF' : '#F2F2F2',
               color: '#B4B4B9',
              transform: isHovered && !isActive ? 'scale(1.05)' : 'scale(1)',
              // boxShadow: isActive ? '0px 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
            }}
          >
            <span style={{ fontSize: '10px' }}>{filter.label}</span>
            {/* {count > 0 && (
              <span
                style={{
                  fontSize: '8px',
                  backgroundColor: isActive ? '#F2F2F2' : '#E5E7EB',
                  color: isActive ? '#D72229' : '#6B7280',
                  padding: '1px 4px',
                  borderRadius: '4px',
                  marginRight: '1px',
                }}
              >
                {count}
              </span>
            )} */}
          </button>
        );
      })}
    </div>
  );
}