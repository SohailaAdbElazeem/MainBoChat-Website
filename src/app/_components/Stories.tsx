/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";

/** ===== Types coming from API ===== */
type APIStory = {
  _id: string;
  type: "image" | "text" | "video" | string;
  content?: string | string[] | null;
  title?: string | null;
  likes?: any[];
  comments?: any[];
  time?: string | number | null;
  subImage?: string | null;
  color?: string | number | null;
  expireAt?: string | null;
  createdAt?: string | null;
  vip?: boolean;
  watched?: boolean;
};

type APIUserStories = {
  userid: string;
  img: string;
  username: string;
  name: string;
  stories: APIStory[];
};

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
  stories: APIStory[];
};

/* ======================= Helpers ======================= */
function fixMediaUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  let fixed = url.replace(/C:\\Users\\.*?media\\/, "/media/");
  if (!/^https?:\/\//i.test(fixed)) {
    fixed = "https://bo-chat.cfd" + (fixed.startsWith("/") ? fixed : "/" + fixed);
  }
  return fixed;
}

function androidArgbToRgba(input?: string | number | null): string | undefined {
  if (input == null) return undefined;
  let n: number;
  if (typeof input === "string") {
    const t = input.trim();
    n = /^\d+$/.test(t) ? Number(t) : Number.parseInt(t, 16);
  } else n = input;
  if (!Number.isFinite(n)) return undefined;
  const a = (n >>> 24) & 0xff;
  const r = (n >>> 16) & 0xff;
  const g = (n >>> 8) & 0xff;
  const b = n & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`;
}

/** ✅ نجمع كل الاستوريز بتاعة كل مستخدم مرة واحدة */
function normalizeAllStories(raw: any): StoryCard[] {
  const list: APIUserStories[] = Array.isArray(raw)
    ? raw
    : raw?.resp || raw?.data || [];

  if (!Array.isArray(list)) return [];

  const out: StoryCard[] = [];

  list.forEach((u) => {
    if (!Array.isArray(u?.stories) || !u.stories.length) return;

    const stories = u.stories.map((s) => ({
      ...s,
      content: Array.isArray(s.content)
        ? s.content.map(fixMediaUrl)
        : fixMediaUrl(s.content),
      subImage: fixMediaUrl(s.subImage),
    }));

    const first = stories[0];
    const type = (first.type || "image").toLowerCase() as
      | "image"
      | "video"
      | "text";

    const card: StoryCard = {
      id: u.userid,
      userId: u.userid,
      coverType: type,
      coverImage:
        type === "image" || type === "video"
          ? first.subImage || first.content || u.img
          : undefined,
      text: type === "text" ? (first.content as string) ?? "" : undefined,
      bgColor: type === "text" ? androidArgbToRgba(first.color ?? null) : undefined,
      authorName: u.name || u.username || "مستخدم",
      img: u.img,
      watched: stories.every((s) => s.watched),
      vip: stories.some((s) => s.vip),
      expireAt: first.expireAt ?? null,
      stories,
    };
    out.push(card);
  });

  return out;
}
async function preloadMedia(urls: string[]) {
  const promises = urls.map((url) => {
    if (!url) return;
    return new Promise<void>((resolve) => {
      if (url.endsWith(".mp4") || url.includes("/video")) {
        const video = document.createElement("video");
        video.src = url;
        video.preload = "auto";
        video.oncanplaythrough = () => resolve();
        video.onerror = () => resolve();
      } else {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve();
        img.onerror = () => resolve();
      }
    });
  });
  await Promise.all(promises);
}
/* ======================= Component ======================= */
export default function StoriesCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [cards, setCards] = useState<StoryCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [showOverlay, setShowOverlay] = useState(false);
  const [userIndex, setUserIndex] = useState(0);
  const [storyIndex, setStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  /** ✅ Fetch from proxy API */
  const fetchStories = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch("/api/stories", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
      const norm = normalizeAllStories(data);
      setCards(norm);
    } catch (e: any) {
      setError(e?.message || "تعذر تحميل القصص");
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  /** ============ progress logic ============ */
  const startProgress = (durationMs = 4000) => {
    clearInterval(progressRef.current!);
    setProgress(0);
    const total = 100;
    const step = durationMs / total;
    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progressRef.current!);
          handleNextStory();
          return 100;
        }
        return p + 1;
      });
    }, step);
  };

  const handleOpenStory = (idx: number) => {
    clearInterval(progressRef.current!);
    setUserIndex(idx);
    setStoryIndex(0);
    setShowOverlay(true);
    startProgress();
  };

  const handleCloseOverlay = () => {
    clearInterval(progressRef.current!);
    setShowOverlay(false);
    setProgress(0);
  };

  const handleNextStory = () => {
    const user = cards[userIndex];
    if (!user) return;
    const totalStories = user.stories.length;

    if (storyIndex < totalStories - 1) {
      setStoryIndex((p) => p + 1);
      setProgress(0);
      startProgress();
      return;
    }

    if (userIndex < cards.length - 1) {
      setUserIndex((p) => p + 1);
      setStoryIndex(0);
      setProgress(0);
      startProgress();
      return;
    }

    handleCloseOverlay();
  };

  const handlePrevStory = () => {
    if (storyIndex > 0) {
      setStoryIndex((p) => p - 1);
      setProgress(0);
      startProgress();
    } else if (userIndex > 0) {
      setUserIndex((p) => p - 1);
      setStoryIndex(cards[userIndex - 1].stories.length - 1);
      setProgress(0);
      startProgress();
    }
  };

  const scrollBy = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const delta = dir === "left" ? -1 : 1;
    el.scrollBy({ left: delta * 180, behavior: "smooth" });
  };

  /* ============ UI ============ */
  if (loading) return <div dir="rtl" className="p-4">جارِ التحميل…</div>;
  if (error) return <div dir="rtl" className="p-4 text-red-600">خطأ: {error}</div>;
  if (!cards.length) return <div dir="rtl" className="p-4">لا توجد قصص.</div>;

  return (
    <section className="w-full">
      <h2 className="text-[25px] font-semibold mb-2 text-right">القصص</h2>

      <div className="relative">
        {cards.length > 2 && (
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
          {cards.map((c, idx) => (
            <article
              key={c.id}
              onClick={() => handleOpenStory(idx)}
              className="relative shrink-0 snap-start rounded-[26px] overflow-hidden cursor-pointer w-[150px] h-[215px] bg-neutral-200 shadow transition-transform"
            >
              {c.coverType === "video" ? (
                <video
                  src={c.coverImage ?? ""}
                  poster={c.coverImage ?? ""}
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
          ))}
        </div>
      </div>
{/* ✅ عرض أول ستوري بشكل مباشر خارج الـ overlay */}
{/* {cards.length > 0 && (
  
)} */}

      {showOverlay && cards[userIndex] && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center">
          <div className="relative max-h-[90vh] max-w-[90vw w-full flex items-center justify-center rounded-[20px]">
            <div className="absolute top-0 left-0 w-full px-3 pt-3 flex gap-[4px] z-20">
              {cards[userIndex].stories.map((_, i) => (
                <div key={i} className="flex-1 h-[3px] bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-100"
                    style={{
                      width:
                        i === storyIndex ? `${progress}%` : i < storyIndex ? "100%" : "0%",
                    }}
                  ></div>
                </div>
              ))}
            </div>

            {/* محتوى الاستوري */}
            {(() => {
  const story = cards[userIndex].stories[storyIndex];

  // ✅ وظيفة مساعدة توقف الـ progress
  const pauseProgress = () => clearInterval(progressRef.current!);
  const resumeProgress = (durationMs = 4000) => startProgress(durationMs);

  if (story.type === "video") {
    return (
      <video
        ref={videoRef}
        src={
          Array.isArray(story.content)
            ? story.content[0]
            : story.content || ""
        }
        className="w-full h-full object-cover rounded-[20px]"
        autoPlay
        playsInline
        muted={false}
        onWaiting={pauseProgress} // ⛔ أوقف العداد لو الفيديو بيعمل buffering
        onPause={pauseProgress}
        onCanPlay={(e) => {
          const vid = e.currentTarget;
          // ✅ أول ما يجهز التشغيل فعليًا
          pauseProgress();
          resumeProgress((vid.duration || 4) * 1000);
        }}
        onPlaying={(e) => {
          const vid = e.currentTarget;
          pauseProgress();
          resumeProgress((vid.duration || 4) * 1000);
        }}
      />
    );
  }

  // ✅ الصورة
  if (story.type === "image") {
    return (
      <img
        src={
          Array.isArray(story.content)
            ? story.content[0]
            : story.content || ""
        }
        alt=""
        className="w-full h-full object-cover rounded-[20px]"
        onLoad={() => {
          pauseProgress();
          resumeProgress(4000); // ٤ ثواني بعد تحميل الصورة
        }}
        onError={() => {
          // لو الصورة فشلت نحسبها زي loaded
          pauseProgress();
          resumeProgress(4000);
        }}
      />
    );
  }

  // ✅ النصوص
  return (
    <div
      className="w-full h-full flex items-center justify-center text-white text-xl font-medium p-8 text-center rounded-[20px]"
      style={{ background: androidArgbToRgba(story.color) || "#222" }}
    >
      {story.content}
    </div>
  );
})()}

            <div className="absolute top-10 right-5 flex items-center gap-3">
              <img
                src={cards[userIndex].img}
                className="w-10 h-10 rounded-full border border-white/30"
                alt={cards[userIndex].authorName}
              />
              <div>
                <p className="text-white font-semibold">
                  {cards[userIndex].authorName}
                </p>
              </div>
            </div>

            {/* الأزرار */}
            <button
              onClick={handlePrevStory}
              className="absolute left-[50px] -top-12 bg-[#fff]/15 w-[40px] h-[40px] flex items-center justify-center cursor-pointer backdrop-blur-md rounded-full text-white opacity-50 hover:opacity-100"
            >
              <img src="/imgs/arrowright.svg" alt="" />
            </button>
            <button
              onClick={handleNextStory}
              className="absolute left-0 -top-12 bg-[#fff]/15 w-[40px] h-[40px] flex items-center justify-center cursor-pointer backdrop-blur-md rounded-full text-white opacity-50 hover:opacity-100"
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
