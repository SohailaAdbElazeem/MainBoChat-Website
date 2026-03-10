/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useRef, useState } from "react";

type ActionMenuProps = {
  onMessage?: () => void;
  onReport?: () => void;
  onBlock?: () => void;
  avatarUrl?: string; // optional: to show in header if you want
};

export default function ActionMenu({ onMessage, onReport, onBlock }: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handle);
    return () => document.removeEventListener("click", handle);
  }, []);


  return (
    <div className="relative z-[999]" ref={ref}>
      {/* trigger */}
      <button
        onClick={() => setOpen((s) => !s)}
        aria-haspopup="true"
        aria-expanded={open}
        className="block p-3 rounded-[17px] cursor-pointer mt-4 w-[40px] h-[40px] flex items-center justify-center border border-[#EBEBEB] bg-white"
      >
        <img src="/imgs/dots.svg" alt="menu" className={`w-4 h-4 focus:transform  focus:rotate-90 ${open ? "rotate-90 transition-all" : "rotate-0 transition-all"}`}  />
      </button>

      {/* dropdown */}
      <div
        className={`absolute top-20 left-0 transform origin-top-right transition-all duration-150 ${
          open ? "scale-100 opacity-100 pointer-events-auto" : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="w-64 rounded-[30px] p-3 shadow-2xl bg-black/10 backdrop-blur-md border border-white/30"
          style={{ minWidth: 240 }}
        >


          {/* items */}
          <div className="flex flex-col gap-3 mt-1">
            <button
              onClick={() => {
                setOpen(false);
                onMessage?.();
              }}
              className="flex items-center gap-3 px-3 py-3 rounded-[20px] border border-[#D8D8D8] cursor-pointer bg-white/40 hover:backdrop-blur-sm"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600">
                <img src="/icons/rate.svg" alt="rate" />
              </div>
              <div className="text-right">
                <div className="text-[#D72229] font-semibold">تقييم</div>
              </div>
            </button>

            <button
              onClick={() => {
                setOpen(false);
                onReport?.();
              }}
              className="flex items-center  gap-3 px-3 py-3 rounded-[20px] border border-[#D8D8D8] cursor-pointer bg-[#000]/40 hover:backdrop-blur-sm"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600">
                <img src="/icons/flag.svg" className="invert brightness-0" alt="" />
              </div>
              <div className="text-right">
                <div className="text-white/90 font-semibold ">ابلاغ</div>
              </div>
            </button>

            <button
              onClick={() => {
                setOpen(false);
                onBlock?.();
              }}
              className="flex items-center gap-3 px-3 py-3 rounded-[20px] border border-[#D8D8D8] cursor-pointer bg-[#000]/40 hover:backdrop-blur-sm"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600">
                <img src="/icons/block.svg" alt="" />
              </div>
               <div className="text-right">
                <div className="text-white/90 font-semibold">حجب</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
