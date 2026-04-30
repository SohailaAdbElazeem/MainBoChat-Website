/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import PostCard, { Post } from "./PostCard";
import GlobalLoader from "@/components/GlobalLoader";

export default function PostsFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shuffledOnce, setShuffledOnce] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const LIMIT = 20;
  // const API_BASE = "http://bo-chat.space/postsTest/686695914211804ef3875338";
  const API_BASE = "https://bo-chat.space/home_posts/686695914211804ef3875338?page=1&limit=100";
  const STORAGE_KEY = "posts_feed_cache";



  // --------------------------------------------------------------------
  // ✅ تحميل البيانات - FIXED (بدون loop)
  // --------------------------------------------------------------------
    const token = process.env.ACTIVE_USERS_TOKEN;
  // const loadPosts = useCallback(
  //   async (newPage: number) => {
  //     if (loadingMore || !hasMore) return;

  //     try {
  //       setLoadingMore(true);
  //       setError(null);
  //       const res = await fetch(`${API_BASE}&page=${newPage}&limit=${LIMIT}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },

  //       // const res = await fetch(`${API_BASE}?page=${newPage}&limit=${LIMIT}`);
  //       if (!res.ok) throw new Error(`HTTP ${res.status}`);

  //       const data = await res.json();
  //       const newPosts = Array.isArray(data) ? data : [];

  //       if (newPosts.length < LIMIT) setHasMore(false);

  //       setPosts((prev) => {
  //         const existingIds = new Set(prev.map((p) => p._id));
  //         const uniqueNew = newPosts.filter(
  //           (post: Post) => !existingIds.has(post._id)
  //         );

  //         const combined = [...prev, ...uniqueNew];

  //         // 👇 اعمل shuffle مرة واحدة بس بعد أول تحميل
  //         if (!shuffledOnce && newPage === 1) {
  //           for (let i = combined.length - 1; i > 0; i--) {
  //             const j = Math.floor(Math.random() * (i + 5));
  //             [combined[i], combined[j]] = [combined[j], combined[i]];
  //           }
  //           setShuffledOnce(true);
  //         }

  //         return combined;
  //       });

  //       setPage(newPage);
  //     } catch (err: any) {
  //       setError(err.message || "تعذر تحميل البيانات");
  //     } finally {
  //       setLoading(false);
  //       setTimeout(() => setLoadingMore(false), 250); // 🌙 smooth scroll
  //     }
  //   },
  //   [hasMore, loadingMore] // ← مش هنحط loadPosts ف dependency
  // );

  // --------------------------------------------------------------------
  // ✅ أول تحميل
  // --------------------------------------------------------------------
const loadPosts = useCallback(
  async (newPage: number) => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      setError(null);

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;

      const res = await fetch(
        `${API_BASE}&page=${newPage}&limit=${LIMIT}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const newPosts = Array.isArray(data) ? data : [];

      if (newPosts.length < LIMIT) setHasMore(false);

      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p._id));
        const uniqueNew = newPosts.filter(
          (post: Post) => !existingIds.has(post._id)
        );

        const combined = [...prev, ...uniqueNew];

        if (!shuffledOnce && newPage === 1) {
          for (let i = combined.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [combined[i], combined[j]] = [combined[j], combined[i]];
          }
          setShuffledOnce(true);
        }

        return combined;
      });

      setPage(newPage);
    } catch (err: any) {
      setError(err.message || "تعذر تحميل البيانات");
    } finally {
      setLoading(false);
      setTimeout(() => setLoadingMore(false), 250);
    }
  },
  [hasMore, loadingMore, shuffledOnce]
);
  useEffect(() => {
  const cached = sessionStorage.getItem(STORAGE_KEY);

  if (cached) {
    const parsed = JSON.parse(cached);
    setPosts(parsed.posts || []);
    setPage(parsed.page || 1);
    setHasMore(parsed.hasMore ?? true);
    setLoading(false);
  } else {
    loadPosts(1);
  }
}, []);

  // --------------------------------------------------------------------
  // ✅ OBSERVER — smooth + ما يحملش مرتين
  // --------------------------------------------------------------------
  useEffect(() => {
    if (!sentinelRef.current) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && hasMore && !loadingMore) {
          loadPosts(page + 1);
        }
      },
      {
        root: scrollContainerRef.current,
        rootMargin: "400px", 
        threshold: 0.1,
      }
    );

    observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [page, hasMore, loadingMore, loadPosts]);

  // --------------------------------------------------------------------
  // ✅ Manual scroll fallback - smooth
  // --------------------------------------------------------------------
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    let timeout: any;

    const onScroll = () => {
      if (timeout) clearTimeout(timeout);

      timeout = setTimeout(() => {
        if (loadingMore || !hasMore) return;

        const { scrollTop, scrollHeight, clientHeight } = el;
        if (scrollHeight - scrollTop - clientHeight < 600) {
          loadPosts(page + 1);
        }
      }, 120); // ← smooth delay
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [page, hasMore, loadingMore, loadPosts]);

  // --------------------------------------------------------------------
  // ✅ تقسيم الأعمدة + حذف الفيديوهات
  // --------------------------------------------------------------------
  const { colA, colB } = useMemo(() => {
    const filtered = posts.filter((p) => p.type !== "video");

    const a: Post[] = [];
    const b: Post[] = [];
    filtered.forEach((p, i) => ((i % 2 === 0 ? a : b).push(p)));

    return { colA: a, colB: b };
  }, [posts]);

  // --------------------------------------------------------------------
  // UI
  // --------------------------------------------------------------------
  if (loading && posts.length === 0)
    return (
      <div dir="rtl" className="p-4">
        جارِ التحميل…
      </div>
    );

  if (error)
    return (
      <div dir="rtl" className="p-4 text-red-600">
        خطأ: {error}
      </div>
    );

  if (!posts.length)
    return (
      <div dir="rtl" className="p-4">
        لا توجد منشورات.
      </div>
    );

  return (
    <div dir="rtl" className="overflow-hidden">
      <div
        ref={scrollContainerRef}
        className="w-full overflow-y-auto scrollbar-hidden px-[10px]"
        style={{ height: "calc(100vh - 95px)" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div className="space-y-5">
            {colA.map((p, i) => (
              <PostCard key={`${p._id}-${i}`} post={p} />
            ))}
          </div>

          <div className="space-y-4">
            {colB.map((p, i) => (
              <PostCard key={`${p._id}-${i}`} post={p} />
            ))}
          </div>
        </div>

        {loadingMore && (
          <div className="py-3 text-center text-sm text-black/60">
            <GlobalLoader/>
          </div>
        )}

        <div ref={sentinelRef} style={{ height: 2 }} />
        <div className="p-3" />
      </div>
    </div>
  );
}
