"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  tokenKey?: string;
  registerHref?: string;
};

export default function LoginBanner({
  tokenKey = "token",
  registerHref = "/login",
}: Props) {
  const router = useRouter();
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // منع مشاكل SSR: نفّذ الفحص بعد الـ mount
    const hasToken = typeof window !== "undefined" && !!localStorage.getItem(tokenKey);
    setShouldShow(!hasToken);

    // تحدّث الحالة لو التوكن اتغيّر من تبويب تاني
    const onStorage = (e: StorageEvent) => {
      if (e.key === tokenKey) {
        const present = !!localStorage.getItem(tokenKey);
        setShouldShow(!present);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [tokenKey]);

  if (!shouldShow) return null;

  return (
    <div dir="rtl" className="w-full fixed bottom-0 left-0 bg-[#D72229] text-white z-[999]">
      <div className="mx-auto flex  items-center justify-between gap-4 px-10 py-3">
        <p className="text-sm md:text-base">
          كن أول من يعرف الجديد… مستخدمو باندا أوراكل يعرفون الأحداث لحظة بلحظة
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(registerHref)}
            className="
              rounded-[17px]  bg-white px-10 h-[45px] text-[#D72229]
              text-sm font-semibold shadow-sm hover:opacity-90
              focus:outline-none focus:ring-2 focus:ring-white/60
            "
          >
            تسجيل
          </button>
        </div>
      </div>
    </div>
  );
}
