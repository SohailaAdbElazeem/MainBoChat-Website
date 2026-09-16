// src/app/chats/_components/hooks/useDropdown.ts
import { useState, useRef, useEffect } from 'react';

export function useDropdown() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown) {
        const ref = dropdownRefs.current[openDropdown];
        if (ref && !ref.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  const setRef = (chatId: string, el: HTMLDivElement | null) => {
    if (el) dropdownRefs.current[chatId] = el;
  };

  return { openDropdown, setOpenDropdown, setRef };
}