/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useMemo, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLoginModal } from "@/contexts/LoginModalContext";

type ItemId = "home" | "videos" | "messages" | "notifications" | "settings" | "profile";

type MenuItem = {
  id: ItemId;
  label: string;
  href?: string;
  icon: JSX.Element;
  badgeCount?: number;
  dot?: boolean;
};

export default function SidebarArabic({
  unreadMessages = 2,
}: {
  unreadMessages?: number;
}) {
  const pathname = usePathname();
  const { openLoginModal } = useLoginModal();
  const [userId, setUserId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // دالة تحديث userId من localStorage
  const updateUserData = () => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      try {
        const user = JSON.parse(storedUserData);
        setUserId(user?._id || null);
      } catch (error) {
        console.error("Failed to parse userData", error);
        setUserId(null);
      }
    } else {
      setUserId(null);
    }
  };

  useEffect(() => {
    setMounted(true);
    updateUserData(); // قراءة أولية

    // الاستماع لحدث مخصص (يُطلق عند تسجيل الدخول/الخروج)
    window.addEventListener("userDataUpdated", updateUserData);

    // الاستماع لتغييرات localStorage من التبويبات الأخرى
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "userData") {
        updateUserData();
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("userDataUpdated", updateUserData);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // تحديد العنصر النشط
  const active = pathname === "/"
    ? "home"
    : pathname?.startsWith?.("/chats")
    ? "chats"
    : pathname?.startsWith?.("/profile")
    ? "profile"
    : undefined;

  const icons = {
    home: <img src="/icons/home.svg" width={"25px"} alt="home" />,
    play: <img src="/icons/videos.svg" width={"20px"} alt="videos" />,
    mail: <img src="/icons/messages.svg" width={"20px"} alt="chats" />,
    bell: <img src="/icons/notfications.svg" width={"20px"} alt="notfications" />,
    gear: <img src="/icons/settings.svg" width={"20px"} alt="settings" />,
    user: <img src="/icons/user.svg" width={"20px"} alt="user" />,
  };

  const items: MenuItem[] = useMemo(
    () => [
      { id: "home", label: "الصفحة الرئيسية", href: "/", icon: icons.home },
      {
        id: "chats",
        label: "الرسائل",
        href: userId ? "/chats" : "#",
        icon: icons.mail,
        badgeCount: unreadMessages,
      },
      {
        id: "profile",
        label: "الدرج الشخصي",
        href: userId ? `/profile/${userId}` : "#",
        icon: icons.user,
      },
    ],
    [unreadMessages, userId]
  );

  const activeClass =
    "bg-gradient-to-l from-white to-[#D72229] text-white rounded-tl-[24px] rounded-bl-[24px] py-3 flex items-center gap-2";

  if (!mounted) {
    return (
      <aside
        dir="rtl"
        className="select-none text-right text-[#111] overflow-y-auto scrollbar-hidden"
        style={{ height: "calc(100vh - 90px)" }}
      >
        <nav className="space-y-2 mb-1">
          <div className="h-10 rounded bg-gray-100 animate-pulse" />
          <div className="h-10 rounded bg-gray-100 animate-pulse" />
          <div className="h-10 rounded bg-gray-100 animate-pulse" />
        </nav>
      </aside>
    );
  }

  return (
    <aside
      dir="rtl"
      className="select-none text-right text-[#111] overflow-y-auto scrollbar-hidden flex flex-col"
      style={{ height: "calc(100vh - 90px)" }}
    >
      <nav className="space-y-2 mb-1">
        {items.map((item) => {
          const isActive = active === item.id;
          const isProtected = (item.id === "chats" || item.id === "profile") && !userId;

          return (
            <Link
              key={item.id}
              href={item.href ?? "#"}
              onClick={(e) => {
                if (isProtected) {
                  e.preventDefault();
                  openLoginModal();
                }
              }}
              className={`${isActive ? activeClass : ""} flex justify-between !pr-10`}
            >
              <span className="flex items-center">
                <span
                  className={[
                    "relative inline-flex h-9 w-9 items-center justify-center",
                    "rounded-[26px]",
                  ].join(" ")}
                >
                  <span className={`${isActive ? "text-white filter invert" : "text-black"}`}>
                    {item.icon}
                  </span>
                  {item.dot && (
                    <span
                      className="
                        absolute bottom-[-5px] left-[50%] -translate-x-1/2
                        h-[8px] w-[8px]
                        rounded-full bg-[#D72229]
                      "
                    />
                  )}
                </span>
                {item.label}
              </span>
              {item.badgeCount ? (
                <span className="grid h-[28px] w-[26px] place-items-center ml-3 rounded-[11px] bg-[#D72229] text-sm text-white">
                  {item.badgeCount}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
      <div className="max-w-[380px] mb-2">{/* banner */}</div>
      <div className="space-y-3 text-sm text-black/70 mt-auto mr-5 pb-4">
        <div className="flex flex-wrap items-center gap-x-3">
          <Link href="https://bo-eg.online/PrivacyPolicies.html" className="hover:underline text-[#D72229]">
            سياسة الخصوصية
          </Link>
          <span className="opacity-60">|</span>
          <Link href="https://bo-eg.online/PrivacyCenter.html" className="hover:underline text-[#D72229]">
            مركز الخصوصية
          </Link>
          <span className="opacity-60">|</span>
          <Link href="https://bo-eg.online/ContactUs.html" className="hover:underline text-[#D72229]">
            اتصل بنا
          </Link>
          <span className="opacity-60">|</span>
          <Link href="https://bo-eg.online/SocialGuiedLines.html" className="hover:underline text-[#D72229]">
            إرشادات المجتمع
          </Link>
          <span className="opacity-60">|</span>
          <p className="text-xs opacity-70">
            Powered by <span className="font-semibold text-[#D72229]">panda oracle</span>
          </p>
        </div>
      </div>
    </aside>
  );
}