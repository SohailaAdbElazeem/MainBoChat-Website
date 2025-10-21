/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/** ===== Types coming from API ===== */
type APIStory = {
  _id: string;
  type: "image" | "text" | string;
  content?: string | null;   // للصورة: URL داخل content | للنص: محتوى نصي
  title?: string | null;
  likes?: any[];
  comments?: any[];
  time?: string | number | null;
  isComment?: "true" | "false" | boolean;
  isScreenShot?: "true" | "false" | boolean;
  reported?: any[];
  subImage?: string | null;
  color?: string | number | null; // مثال: "4282339765" (ARGB)
  expireAt?: string | null;       // ISO
  createdAt?: string | null;      // أحيانًا "Invalid DateTime"
  song?: string | null;
  safety?: [boolean, any] | null;
  isReported?: boolean;
  vip?: boolean;
  watched?: boolean;
};

type APIUserStories = {
  userid: string;
  img: string; // صورة البروفايل
  username: string;
  name: string;
  isFollow: boolean;
  stories: APIStory[];
};

type RawResponse = { resp?: APIUserStories[]; data?: APIUserStories[] } | any;

/** ===== UI Types ===== */
type StoryCard = {
  id: string;               // story id (unique)
  userId: string;
  coverType: "image" | "text";
  coverImage?: string;      // URL للصورة
  text?: string;            // نص الستوري
  bgColor?: string;         // rgba(...) للنص
  authorName: string;
  img: string;
  watched?: boolean;
  vip?: boolean;
  expireAt?: string | null;
};

type Props = {
  /** مفتاح التوكن داخل localStorage */
  tokenKey?: string; // مثال: 'access_token'
  /** تمرير توكن صراحةً (يغلب قيمة localStorage) */
  tokenOverride?: string;
  className?: string;
  /** عرض الكارت التقريبي (يُستخدم في حساب التمرير) */
  cardWidth?: number; // px
  /** مدة التحديث التلقائي (ms). 0 لإيقافه */
  pollIntervalMs?: number;
  /** هل نرتب بالأحدث حسب expireAt؟ */
  sortByExpireAtDesc?: boolean;
};

/** يحوّل Android ARGB integer (مثل "4282339765") إلى rgba(...) */
function androidArgbToRgba(input?: string | number | null): string | undefined {
  if (input == null) return undefined;
  let n: number;
  if (typeof input === "string") {
    const t = input.trim();
    n = /^\d+$/.test(t) ? Number(t) : Number.parseInt(t, 16);
  } else {
    n = input;
  }
  if (!Number.isFinite(n)) return undefined;
  const a = (n >>> 24) & 0xff;
  const r = (n >>> 16) & 0xff;
  const g = (n >>> 8) & 0xff;
  const b = n & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`;
}

function toTime(value?: string | null): number | null {
  if (!value) return null;
  const t = Date.parse(value);
  return Number.isFinite(t) ? t : null;
}

/** طبّع كل stories من كل users إلى كروت العرض (كل ستوري = كارت) */
function normalizeAllStories(resp: APIUserStories[] | undefined): StoryCard[] {
  const out: StoryCard[] = [];
  (resp ?? []).forEach((u) => {
    (u.stories ?? []).forEach((s) => {
      const t = (s?.type || "").toLowerCase();
      const isText = t === "text";
      const isImage = t === "image";
      const card: StoryCard = {
        id: s._id || `${u.userid}-${Math.random().toString(36).slice(2, 9)}`,
        userId: u.userid,
        coverType: isText ? "text" : "image",
        coverImage: isImage ? (s.content || s.subImage || u.img || undefined) : undefined,
        text: isText ? (s.content ?? "") : undefined,
        bgColor: isText ? androidArgbToRgba(s.color ?? null) : undefined,
        authorName: u.name || u.username || "مستخدم",
        img: u.img,
        watched: s.watched,
        vip: s.vip,
        expireAt: s.expireAt ?? null,
      };
      out.push(card);
    });
  });
  return out;
}

export default function StoriesCarousel({
  tokenKey = "access_token",
  tokenOverride,
  className = "",
  cardWidth = 150,
  pollIntervalMs = 60000, // 1 دقيقة افتراضياً
  sortByExpireAtDesc = true,
}: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [cards, setCards] = useState<StoryCard[] | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // اقرأ التوكن
  const token = useMemo(() => {
    if (typeof window === "undefined") return "";
    if (tokenOverride) return tokenOverride;
    try {
      return localStorage.getItem(tokenKey) || "";
    } catch {
      return "";
    }
  }, [tokenKey, tokenOverride]);

  // جلب الداتا
  const fetchStories = useCallback(async () => {
    setError(null);
    setLoading((prev) => prev && cards === null); // اظهر السكلتون أول مرة فقط
    try {
      const res = await fetch("/api/stories", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: "no-store",
      });

      const text = await res.text();
      let json: RawResponse = {};
      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        json = {};
      }

      if (!res.ok) {
        throw new Error((json as any)?.message || `HTTP ${res.status}`);
      }

      // دعم {resp:[...]}, {data:[...]}, أو Array مباشرةً
      const array: APIUserStories[] = Array.isArray(json)
        ? (json as unknown as APIUserStories[])
        : json?.resp ?? json?.data ?? [];

      let norm = normalizeAllStories(array);

      if (sortByExpireAtDesc) {
        norm = norm.sort((a, b) => {
          const ta = toTime(a.expireAt) ?? -Infinity;
          const tb = toTime(b.expireAt) ?? -Infinity;
          return tb - ta; // desc
        });
      }

      setCards(norm);
      setActive(norm[0]?.id ?? null);
    } catch (e: any) {
      setError(e?.message || "Failed to load");
      setCards([]); // لعرض حالة فاضية بدل السكلتون
    } finally {
      setLoading(false);
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  // Polling تلقائي + إيقاف عند إخفاء التبويب
  useEffect(() => {
    if (!pollIntervalMs || pollIntervalMs <= 0) return;
    let timer: number | null = null;

    const start = () => {
      if (timer) return;
      timer = window.setInterval(() => {
        if (document.visibilityState === "visible") fetchStories();
      }, pollIntervalMs);
    };
    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
    const onVis = () => {
      if (document.visibilityState === "visible") {
        fetchStories();
        start();
      } else {
        stop();
      }
    };

    start();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [pollIntervalMs, fetchStories]);

  const scrollBy = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const delta = dir === "left" ? -1 : 1;
    el.scrollBy({ left: delta * (cardWidth + 16), behavior: "smooth" });
  };

  const onCardFocus = (id: string) => setActive(id);
  const isEmpty = !loading && !error && Array.isArray(cards) && cards.length === 0;

  return (
    <section className={`w-full ${className}`}>
      <h2 className="text-[25px] font-semibold mb-2 text-right">القصص</h2>

      <div className="relative">
        {/* أزرار الاتجاه */}
        <button
          aria-label="السابق"
          onClick={() => scrollBy("left")}
          className="absolute left-0 top-2 -translate-y-0 z-20 w-12 h-12 rounded-full bg-[#000000]/15 cursor-pointer backdrop-blur flex items-center justify-center  shadow"
        >
          <img src={"imgs/arrowleft.svg"} alt="" />
        </button>
        <button
          aria-label="التالي"
          onClick={() => scrollBy("right")}
          className="absolute right-3 top-2 -translate-y-0 z-20 w-12 h-12 rounded-full bg-[#000000]/15 cursor-pointer backdrop-blur flex items-center justify-center  shadow"
        >
          <img src={"imgs/arrowright.svg"} alt="" />
        </button>

        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto pr-5 pl-1 py-2 snap-x snap-mandatory scroll-smooth"
        >
          {loading &&
            Array.from({ length: 2 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="shrink-0 snap-start rounded-3xl w-[150px] h-[215px] bg-gray-200 animate-pulse"
              />
            ))}

          {!loading && error && (
            <div className="text-red-600 font-medium">{error}</div>
          )}

          {isEmpty && (
            <div className="text-gray-600 font-medium bg-gray-100 rounded-2xl px-4 py-3">
              لا يوجد حالات منشورة
            </div>
          )}

          {!loading &&
            !isEmpty &&
            cards?.map((c) => {
              const isActive = active === c.id;
              return (
                <article
                  key={c.id}
                  tabIndex={0}
                  onFocus={() => onCardFocus(c.id)}
                  onMouseEnter={() => onCardFocus(c.id)}
                  className={[
                    "relative shrink-1 snap-start rounded-[26px] overflow-hidden",
                    "w-[150] h-[215px] bg-neutral-200",
                    "transition-shadow",
                    isActive ? "shadow-[0_0_0_2px] shadow-red-500" : "shadow",
                  ].join(" ")}
                >
                  {c.coverType === "image" ? (
                    <img
                      src={c.coverImage || c.img }
                      alt={c.authorName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center p-4 text-center"
                      style={{ background: c.bgColor || "#1f2937" }}
                    >
                      <p className="text-white text-lg leading-snug drop-shadow">
                        {c.text}
                      </p>
                    </div>
                  )}

                  <div className="absolute w-full bottom-0 right-0 rounded-b-[26px] ">
                    <div className="bg-white/70 backdrop-blur px-3 py-2 flex items-center gap-2">
                      <div className="w-[40px] h-[40px] rounded-[17px] overflow-hidden">
                        <img
                          src={c.img || "/imgs/user.png"}
                          alt={c.authorName}
                          className="w-full h-full object-cover rounded-[17px]"
                        />
                      </div>
                      <span className="text-gray-800 text-sm">
                        {c.authorName.length > 8 ? c.authorName.slice(0, 8) + "..." : c.authorName}
                      </span>
                    </div>
                  </div>

                  {isActive && (
                    <div className="pointer-events-none absolute inset-0 rounded-3xl " />
                  )}
                </article>
              );
            })}
        </div>
      </div>
    </section>
  );
}
