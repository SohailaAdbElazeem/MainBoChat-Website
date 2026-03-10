/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type UserRaw = {
  rate: string;
  _id: string;
  name?: string;
  username?: string;
  img?: string;
  visit?: number;
};


function shuffleArray<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function AllUsersSlider({
  endpoint = "https://bo-chat.space/allUsers",
}: {
  endpoint?: string;
}) {
  const [users, setUsers] = useState<UserRaw[] | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
const TOKEN = localStorage.getItem("boChatToken") || "";

    (async () => {
      try {
        const res = await fetch(endpoint, {
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        const rows = Array.isArray(data) ? data : data?.data ?? [];

        // ترتيب عشوائي مرة واحدة
        setUsers(shuffleArray(rows));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [endpoint]);

  const scrollByAmount = 320; // مقدار حركة السلايدر يمين/شمال

  const moveLeft = () => {
    scrollerRef.current?.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
  };

  const moveRight = () => {
    scrollerRef.current?.scrollBy({ left: scrollByAmount, behavior: "smooth" });
  };

  const goToProfile = (id: string) => {
    // ينتقل إلى المسار profile/{id}
    router.push(`/profile/${id}`);
  };

  if (loading) {
    return (
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="w-[240px] h-[320px] bg-gray-200 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!users || users.length === 0) {
    return <p className="text-gray-500">لا يوجد مستخدمين.</p>;
  }
const truncate = (str: string | undefined, max: number) => {
  if (!str) return "";
  return str.length > max ? str.slice(0, max) + "..." : str;
};
  return (
    <section className="relative w-full">
      <h2 className="text-2xl mb-3 px-2">أشخاص على مزاجك</h2>

      {/* ====== السهمين ======= */}
      <button
        onClick={moveLeft}
        className="absolute z-10 left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#000000]/10 backdrop-blur flex items-center justify-center"
        aria-label="Move left"
      >
        <img src="/imgs/arrowleft.svg" className="w-6 h-6 " alt="left" />
      </button>

      <button
        onClick={moveRight}
        className="absolute z-10 right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#000000]/10 backdrop-blur flex items-center justify-center"
        aria-label="Move right"
      >
        <img src="/imgs/arrowright.svg" className="w-6 h-6 " alt="right" />
      </button>

      {/* ====== السلايدر ======= */}
      <div
        ref={scrollerRef}
        className="flex gap-3 overflow-x-auto scrollbar-hidden px-2 py-3 scroll-smooth"
        dir="ltr"
      >
        {users.filter(u => u._id !== "697c63efd671ce6c29e6f84d").map((u) => (
          <div
            key={u._id}
            className="bg-[#F6F6F6] rounded-tl-[127.5px] rounded-tr-[127px] rounded-b-[20px] pt-1 pb-2 w-[163px]  shrink-0"
          >
            <div
              role="button"
              tabIndex={0}
              onClick={() => goToProfile(u._id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") goToProfile(u._id);
              }}
              className="relative w-[153px] h-[153px] rounded-full mx-auto flex items-center justify-center cursor-pointer"
              aria-label={`افتح بروفايل ${u.name ?? "المستخدم"}`}
            >
              <img
                className="w-[153px] h-[153px] rounded-full object-cover "
                alt={u.name ?? "User"}
                src={u?.img || "/icons/user.svg"}
                onError={(e) => {
                  e.currentTarget.src = "/icons/user.svg";
                }}
              />
              <div className="rounded-full bg-white absolute bottom-0 left-3 w-8 h-8 flex items-center justify-center gap-1">
                <img src="/icons/star.svg" width={10} alt="" />
                <p >{u.rate}</p>
              </div>
            </div>

            <h3 className="mt-4 me-2 text-[14px] text-right font-semibold">
                {truncate(u.name, 10)}
            </h3>

            <p className="text-gray-500 me-2 text-right text-[9px]">
                @{truncate(u.username, 10)}
            </p>

            <div className="mt-3 flex justify-center">
              <span className="px-4 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2">
                👁 {u.visit ?? 0}
              </span>
              <button className="px-3 py-2 flex items-center gap-3 rounded-full border border-[#D72229] text-[#D72229] cursor-pointer text-sm">
                <img src="/icons/follow.svg" className="w-4 h-4" alt="" />
                متابعه
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
