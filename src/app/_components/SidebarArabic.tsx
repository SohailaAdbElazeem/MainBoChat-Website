/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useMemo } from "react";

type ItemId = "home" | "videos" | "messages" | "notifications" | "settings" | "profile";

type MenuItem = {
  id: ItemId;
  label: string;
  href?: string;
  icon: JSX.IntrinsicElements;
  // شارة رقمية أو نقطة تنبيه
  badgeCount?: number;
  dot?: boolean;
};

export default function SidebarArabic({
  active = "home",
  unreadMessages = 2,
}: {
  active?: ItemId;
  unreadMessages?: number;
}) {
  // SVGs خفيفة بدون أي تبعيات
  const icons = {
    home: (
      <img src="/icons/home.svg" width={"25px"} alt="home" />
    ),
    play: (
      <img src="/icons/videos.svg" width={"20px"} alt="videos" />

    ),
    mail: (
      <img src="/icons/messages.svg" width={"20px"} alt="messages" />
    ),
    bell: (
      <img src="/icons/notfications.svg" width={"20px"} alt="notfications" />
    ),
    gear: (
      <img src="/icons/settings.svg" width={"20px"} alt="settings" />
    ),
    user: (
      <img src="/icons/user.svg" width={"20px"} alt="user" />
    ),
  };

  const items: MenuItem[] = useMemo(
    () => [
      { id: "home", label: "الصفحة الرئيسية", href: "#", icon: icons.home },
      { id: "videos", label: "الفيديوهات", href: "#", icon: icons.play },
      { id: "messages", label: "الرسائل", href: "#", icon: icons.mail, badgeCount: unreadMessages },
      { id: "notifications", label: "التنبيهات", href: "#", icon: icons.bell, dot:true},
      { id: "settings", label: "الاعدادات", href: "#", icon: icons.gear },
      { id: "profile", label: "الملف الشخصي", href: "#", icon: icons.user },
    ],
    [unreadMessages]
  );

  return (
    <aside
      dir="rtl"
      className="w-88 select-none text-right text-[#111] max-h-[315px] px-3 mt-5 overflow-auto scrollbar-hidden"
      aria-label="القائمة الجانبية"
    >
      {/* الهيدر الأحمر */}
      <div
        className="
          bg-[#D72229] text-white
          rounded-[24px] px-5 py-4 mb-6
          shadow-sm
          flex items-center gap-2
        "
      >
        <span className="inline-flex h-7 w-7 items-center justify-center ">
          {icons.home}
        </span>
        <span className="text-lg font-semibold ">الصفحة الرئيسية</span>
      </div>

      {/* العناصر */}
      <nav className="space-y-3 px-3">
        {items
          .filter((i) => i.id !== "home")
          .map((item) => {
            const isActive = active === item.id;
            return (
              <Link
                key={item.id}
                href={item.href ?? "#"}
                className={[
                  "group flex items-center justify-between",
                  "text-base font-medium",
                  isActive ? "text-black" : "text-black/80",
                ].join(" ")}
              >
                <span className="flex items-center">
                  <span
                    className={[
                      "relative inline-flex h-9 w-9 items-center justify-center",
                      "rounded-[26px]",
                      isActive ? "bg-black/5" : "bg-white",
                    ].join(" ")}
                  >
                    <span className="text-black">{item.icon}</span>

                    {/* النقطة الحمراء (تحت الأيقونة نفسها) */}
                    {item.dot && (
                      <span
                        className="
                          absolute bottom-[-5px] left-[50%] -translate-x-1/2
                          h-[8px] w-[8px]
                          rounded-full bg-[#D72229]
                          shadow-[0_0_0_2px_white]
                        "
                      />
                    )}
                  </span>
                  {item.label}
                </span>

                {/* الشارة العددية (badge) */}
                {item.badgeCount ? (
                  <span className="grid h-[28px] w-[26px] place-items-center rounded-[11px] bg-[#D72229] px-2 text-sm text-white">
                    {item.badgeCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
      </nav>

      {/* الفوتر */}
      <div className="mt-10 space-y-3 text-sm text-black/70">
        <div className="flex flex-wrap items-center gap-x-3">
          <Link href="#" className="hover:underline text-[#D72229]">
            سياسة الخصوصية
          </Link>
          <span className="opacity-60">|</span>
          <Link href="#" className="hover:underline text-[#D72229]">
            مركز الخصوصية
          </Link>
          <span className="opacity-60">|</span>
          <Link href="#" className="hover:underline text-[#D72229]">
            اتصل بنا
          </Link>
          <span className="opacity-60">|</span>
          <Link href="#" className="hover:underline text-[#D72229]">
            إرشادات المجتمع
          </Link>
        </div>

        <p className="text-xs opacity-70">
          Powered by <span className="font-semibold text-[#D72229]">panda oracle</span>
        </p>
      </div>
    </aside>
  );
}
