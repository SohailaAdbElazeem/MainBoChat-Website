/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/** ===== Types coming from API ===== */
type APIStory = {
  _id: string;
  type: "image" | "text" | "video" | string;
  content?: string | null;
  title?: string | null;
  likes?: any[];
  comments?: any[];
  time?: string | number | null;
  isComment?: "true" | "false" | boolean;
  isScreenShot?: "true" | "false" | boolean;
  reported?: any[];
  subImage?: string | null;
  color?: string | number | null;
  expireAt?: string | null;
  createdAt?: string | null;
  song?: string | null;
  safety?: [boolean, any] | null;
  isReported?: boolean;
  vip?: boolean;
  watched?: boolean;
};

type APIUserStories = {
  userid: string;
  img: string;
  username: string;
  name: string;
  isFollow: boolean;
  stories: APIStory[];
};

type RawResponse = { resp?: APIUserStories[]; data?: APIUserStories[] } | any;

type StoryCard = {
  id: string;
  userId: string;
  coverType: "image" | "text" | "video";
  coverImage?: string;
  text?: string;
  bgColor?: string;
  authorName: string;
  img: string;
  watched?: boolean;
  vip?: boolean;
  expireAt?: string | null;
  stories?: APIStory;
};

type Props = {
  tokenKey?: string;
  tokenOverride?: string;
  className?: string;
  cardWidth?: number;
  pollIntervalMs?: number;
  sortByExpireAtDesc?: boolean;
};

/** يحوّل Android ARGB integer إلى rgba(...) */
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

/** ✅ قراءة كل الاستوريز بدون تقطيع */
function normalizeAllStories(resp: APIUserStories[] | undefined): StoryCard[] {
  const out: StoryCard[] = [];
  (resp ?? []).forEach((u) => {
    (u.stories ?? []).forEach((s) => {
      const t = (s?.type || "").toLowerCase();
      const card: StoryCard = {
        id: s._id || `${u.userid}-${Math.random().toString(36).slice(2, 9)}`,
        userId: u.userid,
        coverType: t as "image" | "text" | "video",
        coverImage:
          t === "image" || t === "video"
            ? s.subImage || s.content || u.img || undefined
            : undefined,
        text: t === "text" ? s.content ?? "" : undefined,
        bgColor: t === "text" ? androidArgbToRgba(s.color ?? null) : undefined,
        authorName: u.name || u.username || "مستخدم",
        img: u.img,
        watched: s.watched,
        vip: s.vip,
        expireAt: s.expireAt ?? null,
        stories: s,
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
  pollIntervalMs = 60000,
  sortByExpireAtDesc = true,
}: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [cards, setCards] = useState<StoryCard[] | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [showOverlay, setShowOverlay] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const token = useMemo(() => {
    if (typeof window === "undefined") return "";
    if (tokenOverride) return tokenOverride;
    try {
      return localStorage.getItem(tokenKey) || "";
    } catch {
      return "";
    }
  }, [tokenKey, tokenOverride]);

  const abortRef = useRef<AbortController | null>(null);
  const pollRef = useRef<number | null>(null);

  const fetchStories = useCallback(async () => {
    setError(null);
    setLoading((prev) => prev && cards === null);

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/stories", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: "no-store",
        signal: abortRef.current.signal,
      });

      const text = await res.text();
      let json: RawResponse = {};
      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        json = {};
      }

      if (!res.ok)
        throw new Error((json as any)?.message || `HTTP ${res.status}`);

      const array: APIUserStories[] = Array.isArray(json)
        ? (json as unknown as APIUserStories[])
        : json?.resp ?? json?.data ?? [];

      let norm = normalizeAllStories(array);
      if (sortByExpireAtDesc) {
        norm = norm.sort((a, b) => {
          const ta = toTime(a.expireAt) ?? -Infinity;
          const tb = toTime(b.expireAt) ?? -Infinity;
          return tb - ta;
        });
      }

      setCards(norm);
      setActive(norm[0]?.id ?? null);
    } catch (e: any) {
      if (e.name !== "AbortError") setError(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  useEffect(() => {
    if (!pollIntervalMs || pollIntervalMs <= 0) return;
    const startPoll = () => {
      if (pollRef.current) return;
      pollRef.current = window.setInterval(() => {
        if (document.visibilityState === "visible" && !showOverlay) {
          fetchStories();
        }
      }, pollIntervalMs);
    };
    const stopPoll = () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
    startPoll();
    return stopPoll;
  }, [pollIntervalMs, fetchStories, showOverlay]);

  const scrollBy = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const delta = dir === "left" ? -1 : 1;
    el.scrollBy({ left: delta * (cardWidth + 16), behavior: "smooth" });
  };

  const onCardFocus = (id: string) => setActive(id);
  const isEmpty =
    !loading && !error && Array.isArray(cards) && cards.length === 0;

  const startProgress = (durationMs = 4000) => {
    setProgress(0);
    clearInterval(progressRef.current!);
    const totalSteps = 100;
    const stepTime = durationMs / totalSteps;
    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressRef.current!);
          handleNextStory();
          return 100;
        }
        return prev + 1;
      });
    }, stepTime);
  };

  const handleOpenStory = (index: number) => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    clearInterval(progressRef.current!);
    setProgress(0);
    setCurrentIndex(index);
    setShowOverlay(true);
    const currentCard = cards?.[index];
    if (currentCard?.coverType === "video") {
      const vid = videoRef.current;
      if (vid && vid.readyState >= 2) {
        startProgress(vid.duration * 1000 || 4000);
      }
    } else {
      startProgress();
    }
  };

  const handleCloseOverlay = () => {
    clearInterval(progressRef.current!);
    setShowOverlay(false);
    setProgress(0);
  };

  const handleNextStory = () => {
    if (!cards || cards.length === 0) return;
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((p) => p + 1);
      setProgress(0);
      const next = cards[currentIndex + 1];
      if (next?.coverType === "video") {
        const vid = videoRef.current;
        if (vid && vid.readyState >= 2) {
          startProgress(vid.duration * 1000 || 4000);
        }
      } else {
        startProgress();
      }
    } else {
      clearInterval(progressRef.current!);
      setProgress(100);
      handleCloseOverlay();
    }
  };

  const handlePrevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex((p) => p - 1);
      setProgress(0);
      startProgress();
    }
  };

  return (
    <section className={`w-full ${className}`}>
      <h2 className="text-[25px] font-semibold mb-2 text-right">القصص</h2>

      <div className="relative">
        {cards && cards.length > 2 && (
          <>
            <button
              aria-label="السابق"
              onClick={() => scrollBy("left")}
              className="absolute left-0 top-[15px] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#000000]/15 backdrop-blur flex items-center justify-center shadow"
            >
              <img src={"imgs/arrowleft.svg"} alt="" />
            </button>
            <button
              aria-label="التالي"
              onClick={() => scrollBy("right")}
              className="absolute right-0 top-[15px] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#000000]/15 backdrop-blur flex items-center justify-center shadow"
            >
              <img src={"imgs/arrowright.svg"} alt="" />
            </button>
          </>
        )}

        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto !pr-5 pl-1 py-2 scroll-smooth scrollbar-hidden"
          dir="rtl"
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
            cards?.map((c, idx) => {
              const isActive = active === c.id;
              return (
                <article
                  key={c.id}
                  tabIndex={0}
                  onFocus={() => onCardFocus(c.id)}
                  onMouseEnter={() => onCardFocus(c.id)}
                  onClick={() => handleOpenStory(idx)}
                  className={[
                    "relative shrink-0 snap-start rounded-[26px] overflow-hidden cursor-pointer",
                    "w-[150px] h-[215px] bg-neutral-200",
                    "transition-shadow",
                    isActive ? "shadow-[0_0_0_2px] shadow-red-500" : "shadow",
                  ].join(" ")}
                >
                  {c.coverType === "video" ? (
                    <video
                      src={c.stories?.content ?? ""}
                      poster={c.stories?.subImage ?? ""}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                    />
                  ) : c.coverType === "image" ? (
                    <img
                      src={c.coverImage || c.img}
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

                  <div className="absolute w-full bottom-0 right-0 rounded-b-[26px]">
                    <div className="bg-white/70 backdrop-blur px-3 py-2 flex items-center gap-2">
                      <div className="w-[40px] h-[40px] rounded-[17px] overflow-hidden">
                        <img
                          src={c.img || "/imgs/user.png"}
                          alt={c.authorName}
                          className="w-full h-full object-cover rounded-[17px]"
                        />
                      </div>
                      <span className="text-gray-800 text-sm">
                        {c.authorName.length > 8
                          ? c.authorName.slice(0, 8) + "..."
                          : c.authorName}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
        </div>
      </div>

      {/* ✅ Overlay */}
      {showOverlay && cards && cards[currentIndex] && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center">
          <div className="relative w-[350px] h-[550px] max-w-[400px] max-h-[85vh] w-full flex items-center justify-center rounded-[20px]">
            <div className="absolute top-0 left-0 w-full px-3 pt-3 flex gap-[4px] z-20">
              {cards.map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-[3px] bg-white/30 rounded-full overflow-hidden"
                >
                  <div
                    className="h-full bg-white transition-all duration-100"
                    style={{
                      width:
                        i === currentIndex
                          ? `${progress}%`
                          : i < currentIndex
                          ? "100%"
                          : "0%",
                    }}
                  ></div>
                </div>
              ))}
            </div>

            {cards[currentIndex].coverType === "text" ? (
              <div
                className="w-full rounded-[20px] h-full flex items-center justify-center text-white text-xl font-medium p-8 text-center"
                style={{
                  background: cards[currentIndex].bgColor || "#222",
                }}
              >
                {cards[currentIndex].text}
              </div>
            ) : cards[currentIndex].coverType === "video" ? (
              <video
                ref={videoRef}
                src={cards[currentIndex].stories?.content ?? ""}
                className="w-full h-full object-cover rounded-[20px]"
                autoPlay
                
                playsInline
                onPlay={(e) => {
                  const vid = e.currentTarget;
                  vid.muted = false;
                  clearInterval(progressRef.current!);
                  startProgress(vid.duration * 1000 || 4000);
                }}
                onPause={() => clearInterval(progressRef.current!)}
                onWaiting={() => clearInterval(progressRef.current!)}
                onPlaying={(e) => {
                  const vid = e.currentTarget;
                  clearInterval(progressRef.current!);
                  startProgress(vid.duration * 1000 || 4000);
                }}
              />
            ) : (
              <img
                src={
                  cards[currentIndex].stories?.content ??
                  cards[currentIndex].coverImage ??
                  cards[currentIndex].img
                }
                alt=""
                className="w-full h-full object-cover rounded-[20px]"
              />
            )}

            <div className="absolute top-10 right-5 flex items-center gap-3">
              <img
                src={cards[currentIndex].img}
                className="w-10 h-10 rounded-full border border-white/30"
                alt={cards[currentIndex].authorName}
              />
              <div>
                <p className="text-white font-semibold">
                  {cards[currentIndex].authorName}
                </p>
              </div>
            </div>

            <button
              onClick={handlePrevStory}
              className="absolute left-[50px] -top-12 bg-[#fff]/15 w-[40px] h-[40px] flex items-center justify-center cursor-pointer backdrop-blur-md rounded-full text-white text-3xl opacity-50 hover:opacity-100"
            >
              <img src="/imgs/arrowright.svg" alt="" />
            </button>
            <button
              onClick={handleNextStory}
              className="absolute left-0 -top-12 bg-[#fff]/15 w-[40px] h-[40px] flex items-center justify-center cursor-pointer backdrop-blur-md rounded-full text-white text-3xl opacity-50 hover:opacity-100"
            >
              <img src="/imgs/arrowleft.svg" alt="" />
            </button>
            <button
              onClick={handleCloseOverlay}
              className="absolute -top-12 z-[99999] cursor-pointer right-0 rounded-full w-[40px] h-[40px] flex items-center justify-center bg-[#FFFFFF]/15 backdrop-blur-md hover:bg-[#fff]/25 transition"
            >
              <img src="/icons/close.svg" alt="" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
