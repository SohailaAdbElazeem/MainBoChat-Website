// src/components/video/OptionsMenu.tsx
"use client";

import { useEffect, useRef } from "react";

interface OptionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onBlock: () => void;
  onReport: () => void;
  isBlocking?: boolean;
  className?: string;  
}

export function OptionsMenu({
  isOpen,
  onClose,
  onBlock,
  onReport,
  isBlocking = false,
  className = "",
}: OptionsMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={menuRef} className={className}>
      <div className="bg-[#000000]/15 rounded-[30px] shadow-xl backdrop-blur-xl p-4 w-[260px] flex flex-col gap-4">
        <button
          onClick={onBlock}
          disabled={isBlocking}
          className="w-full bg-white rounded-[20px] py-3 px-4 text-right flex items-center gap-2 cursor-pointer hover:bg-[#F2F2F2] disabled:opacity-50"
        >
          <div className="h-8 w-8 bg-[#D8D8D8] flex items-center justify-center rounded-full">
            <img src="/icons/eye.svg" className="w-5 h-5 invert-0 transform" style={{ filter: "brightness(0) saturate(100%)" }} alt="block" />
          </div>
          <span className="text-black">{isBlocking ? "جاري الحظر..." : "لا أريد مشاهدة هذا"}</span>
        </button>
        <button
          onClick={onReport}
          className="w-full bg-white rounded-[20px] py-3 px-4 text-right flex items-center gap-2 cursor-pointer hover:bg-[#F2F2F2]"
        >
          <div className="h-8 w-8 bg-[#D8D8D8] flex items-center justify-center rounded-full">
            <img src="/icons/flag.svg" className="w-4 h-4" alt="report" />
          </div>
          <span className="text-black">إبلاغ عن المنشور</span>
        </button>
      </div>
    </div>
  );
}