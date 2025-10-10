/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @next/next/no-img-element */

'use client'
import React, { useEffect, useMemo, useRef, useState } from "react";
import './css/style.css'

type RawUser = Record<string, any>;

type User = {
  id: string;
  name: string;
  img: string;
  isActive: boolean;
};

type Props = {
  endpoint?: string;
  token?: string;         
  initialData?: RawUser[];
  className?: string;
};

const DOT_COLOR = "#D72229";

export default function ActiveUsersCarousel({
  endpoint = "http://bo-chat.space/activeusers/680a8b19eda7ff2c948a0c49",
  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2ODc3ZDU0OTdiMDRhM2M4Mzc1OWYxMjIiLCJyb2xlIjpbImRlbGV0ZSIsInJlcG9ydCIsInB1Ymxpc2giLCJhZGQiLCJibG9ja2VkQ29udGVudCIsImJsb2NrIiwidmVyaWZ5IiwiYWNjZXB0Iiwid2F0Y2giXSwiaWF0IjoxNzYwMDMwNTAzLCJleHAiOjE3NjA2MzUzMDN9.6Epqh9alcsC5ra4IGScugiP2e9YnkETQUmRf4EGp8jk",
  initialData,
  className = "",
}: Props) {
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Normalizer
  const normalize = (rows: RawUser[] = []): User[] =>
    rows
      .map((r, idx) => {
        const id = (r.id ?? r._id ?? r.userId ?? r.userid ?? String(idx)) as string;
        const name =
          (r.name ?? r.username ?? r.fullName ?? r.displayName ?? "Member") as string;
        const img =
          (r.img ??
            r.photo ??
            r.image ??
            r.profileImage ??
            r.profile_photo ??
            r.pic ??
            "") as string;
        const isActive =
          (r.isActive ?? r.active ?? r.online ?? (r.status === "online") ?? true) as boolean;

        return { id, name, img, isActive };
      })
      .filter(Boolean);

  useEffect(() => {
    if (initialData) {
      setUsers(normalize(initialData));
      return;
    }
    const abort = new AbortController();
    (async () => {
      try {
        setError(null);
        setUsers(null);
        const res = await fetch(endpoint, {
          signal: abort.signal,
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as RawUser[] | { data: RawUser[] };
        const rows = Array.isArray(data) ? data : (data as any).data ?? [];
        setUsers(normalize(rows));
      } catch (e: any) {
        if (e?.name !== "AbortError") setError(e?.message || "Failed to load active users");
      }
    })();
    return () => abort.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, token]);

  const scrollBy = (px: number) => scrollerRef.current?.scrollBy({ left: px, behavior: "smooth" });

  const content = useMemo(() => {
    if (error) {
      return (
        <div className="text-sm text-red-600 px-3 py-2 rounded-[21px] bg-red-50 border border-red-200">
          حصل خطأ أثناء جلب الأعضاء النشطين: {error}
        </div>
      );
    }
    if (!users) {
      return (
        <div className="flex gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200 animate-pulse" />
          ))}
        </div>
      );
    }
    if (users.length === 0) {
      return <div className="text-sm text-gray-500 h-[50px] flex items-center justify-center">لا يوجد أعضاء نشطون الآن.</div>;
    }

    return (
      <div
        dir="rtl"
        ref={scrollerRef}
        className="relative flex gap-4 overflow-x-auto  no-scrollbar py-2 scroll-smooth"
      >
        {users.map((u) => (
          <button
            key={u.id}
            title={u.name}
            className="relative cursor-pointer shrink-0 focus:outline-none m-r-[-20px]"
            onClick={() => { /* TODO: افتح بروفايل */ }}
          >
            <div className="w-[54px] h-[54px] rounded-[23px]  shadow-md online">
              {u.img ? (
                <img src={u.img} alt={u.name} className="w-full h-full object-cover rounded-[23px]" />
              ) : (
                <div className="w-full h-full grid place-items-center bg-gray-200 text-xs text-gray-600">
                  {u.name?.slice(0, 2) ?? "NA"}
                </div>
              )}
            </div>

            {u.isActive && (
              <span
                style={{ backgroundColor: DOT_COLOR }}
                className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full ring-2 ring-white"
              />
            )}
          </button>
        ))}
      </div>
    );
  }, [users, error]);

  // لو مفيش ناس نشطة أو أقل من 5 -> اخفي الأسهم
  const activeCount = (users ?? []).filter((u) => u.isActive).length;
  const showArrows = activeCount >= 5;

  return (
    <section className={`relative ${className} `}>
      <h2 className="text-2xl font-semibold mb-4 !px-4" dir="rtl">أعضاء نشطين</h2>
        <div className="relative min-w-[350px] ">
          {/* أسهم التنقل (تظهر فقط لو activeCount >= 5) */}
          {showArrows && (
            <>
              <button
                aria-label="السابق"
                onClick={() => scrollBy(-240)}
                className="absolute z-10 left-4 top-1/2 -translate-y-1/2 w-[55px] h-[55px] rounded-full backdrop-blur-[20px] bg-[#000000]/10 shadow flex items-center justify-center"
              >
                < img src={'/imgs/arrowleft.svg'} alt="arrow" className="w-5 h-5" />
              </button>

              {/* يمين */}
              <button
                aria-label="التالي"
                onClick={() => scrollBy(240)}
                className="absolute z-10 right-4 top-1/2 -translate-y-1/2  w-[55px] h-[55px] rounded-full backdrop-blur-[20px] bg-[#000000]/10 shadow flex items-center justify-center"
              >
                <img src={'/imgs/arrowright.svg'} alt="arrow" className="w-5 h-5" />
              </button>
            </>
          )} 

          {/* الإطار الخلفي + المحتوى */}
          <div className="rounded-[21px] bg-[#F6F6F6] p-[5px]">{content}</div>
        </div>

    </section>
  );
}



/* Tailwind helper (اختياري): أخفي السكروول بار */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
        dir?: "rtl" | "ltr" | "auto";
      };
    }
  }
}
