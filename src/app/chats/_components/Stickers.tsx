/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from "react";

type StickersProps = {
  onSelectSticker: (url: string) => void;
};

const stickersData = [
  {
    key: "big",
    title: "الباندا العملاقة",
    items: [
      "1.png","2.png","3.png","4.png","5.png","6.png",
      "7.png","8.png","9.png","10.png","11.png","12.png",
    ],
  },
  {
    key: "blue",
    title: "الباندا الزرقاء",
    items: [
      "1.png","2.png","3.png","4.png","5.png","6.png",
      "7.png","8.png","9.png","10.png","11.png",
    ],
  },
  {
    key: "black",
    title: "الباندا السوداء",
    items: [
      "1.png","2.png","3.png","4.png","5.png","6.png","7.png",
      "8.png","9.png","10.png","11.png","12.png","13.png","14.png",
    ],
  },
  {
    key: "emoji",
    title: "ايموجي",
    items: [
      "1.png","2.png","3.png","4.png","5.png","6.png",
      "7.png","8.png","9.png","10.png","11.png",
    ],
  },
];

export default function Stickers({ onSelectSticker }: StickersProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* زر فتح الستكرز */}
      <img
        src="/icons/imoji.svg"
        alt="stickers"
        className="w-6 h-6 cursor-pointer"
        onClick={() => setOpen(!open)}
      />

      {/* قائمة الستكرز */}
      {open && (
        <div
          dir="rtl"
          className="
            absolute bottom-12 left-0
            w-80
            bg-white
            border border-gray-300
            rounded-xl
            shadow-lg
            max-h-[420px]
            overflow-y-auto
            p-3
            z-50
            scrollbar-hidden
          "
        >
          {stickersData.map((section) => (
            <div key={section.key} className="mb-5 ">
              {/* عنوان القسم */}
              <div className="text-sm text-red-400 font-semibold mb-2 text-right">
                {section.title}
              </div>

              {/* Grid */}
              <div className="grid grid-cols-6 gap-2">
                {section.items.map((img) => (
                  <img
                    key={img}
                    src={`/imgs/stickers/${section.key}/${img}`}
                    alt={img}
                    loading="lazy"
                    className="
                      cursor-pointer
                      transition
                      hover:scale-110
                    "
                    onError={(e) => {
                      // لو الصورة مش موجودة تختفي
                      e.currentTarget.style.display = "none";
                    }}
                    onClick={() => {
                      onSelectSticker(
                        `/imgs/stickers/${section.key}/${img}`
                      );
                      setOpen(false);
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
