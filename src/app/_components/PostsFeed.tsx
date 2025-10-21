/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import PostCard, { Post } from "./PostCard";

const BATCH = 20;

// ✅ تحليل التاريخ (للمقارنة فقط)
function parseDateFlexible(dateStr?: string | null): number {
  if (!dateStr) return 0;
  const s = String(dateStr).trim();
  if (!s || s.toLowerCase().includes("invalid")) return 0;
  const maybeSpaced = s.includes("T") ? s : s.replace(" ", "T");
  const d = new Date(maybeSpaced);
  if (!isNaN(d.getTime())) return d.getTime();
  const n = Number(s);
  if (!isNaN(n)) return n;
  return 0;
}

// ✅ ترتيب البوستات
function mixSort(posts: Post[], alpha = 0.8): Post[] {
  if (!posts.length) return posts.slice();
  const withTs = posts.map((p) => ({ p, ts: parseDateFlexible(p.createdAt) }));
  const max = Math.max(...withTs.map((x) => x.ts));
  const min = Math.min(...withTs.map((x) => x.ts));
  const range = Math.max(1, max - min);
  const scored = withTs.map(({ p, ts }) => {
    const recNorm = (ts - min) / range;
    const noise = Math.random();
    const score = alpha * recNorm + (1 - alpha) * noise;
    return { p, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.p);
}

export default function PostsFeed() {
  const [allMixed, setAllMixed] = useState<Post[]>([]);
  const [visible, setVisible] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const obsRef = useRef<IntersectionObserver | null>(null);

useEffect(() => {
  let cancelled = false;

  async function run() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/bo-posts`, { cache: "no-store" });
      if (!res.ok) {
        const msg = `HTTP ${res.status}`;
        if (!cancelled) setError(msg);
        return;
      }

      const data = await res.json();
      const arr = (Array.isArray(data) ? data : []) as Post[];

      // ✅ معالجة مشكلة Invalid DateTime
      const cleaned = arr.map((p) => {
        const val = String(p?.createdAt || "").trim();
        if (!val || val.toLowerCase() === "invalid datetime") {
          // استخدم التاريخ الحالي بدل الفاسد
          return { ...p, createdAt: new Date().toISOString() };
        }
        return { ...p, createdAt: val };
      });

      // ✅ إزالة التكرارات
      const unique = Array.from(new Map(cleaned.map((p) => [p?._id, p])).values());

      if (cancelled) return;

      const mixed = mixSort(unique, 0.8);
      setAllMixed(mixed);
      setPage(1);
      setVisible(mixed.slice(0, BATCH));
    } catch (e: any) {
      if (!cancelled) setError(e?.message ?? "تعذر التحميل");
    } finally {
      if (!cancelled) setLoading(false);
    }
  }

  run();
  return () => {
    cancelled = true;
  };
}, []);


  const hasMore = allMixed.length > page * BATCH;

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const next = page + 1;
    setVisible(allMixed.slice(0, next * BATCH));
    setPage(next);
    setLoadingMore(false);
  }, [loadingMore, hasMore, page, allMixed]);

  useEffect(() => {
    obsRef.current?.disconnect();
    obsRef.current = null;

    if (scrollerRef.current && sentinelRef.current) {
      const io = new IntersectionObserver(
        (entries) => {
          const first = entries[0];
          if (first?.isIntersecting) loadMore();
        },
        { root: scrollerRef.current, rootMargin: "200px 0px", threshold: 0.01 }
      );
      io.observe(sentinelRef.current);
      obsRef.current = io;
    }

    return () => obsRef.current?.disconnect();
  }, [loadMore]);

  const { colA, colB } = useMemo(() => {
    const a: Post[] = [];
    const b: Post[] = [];
    visible.forEach((p, i) => {
      (i % 2 === 0 ? a : b).push(p);
    });
    return { colA: a, colB: b };
  }, [visible]);

  if (loading) return <div dir="rtl" className="p-4">جارِ التحميل…</div>;
  if (error) return <div dir="rtl" className="p-4 text-red-600">خطأ: {error}</div>;
  if (!visible.length) return <div dir="rtl" className="p-4">لا توجد منشورات.</div>;

  return (
    <div dir="rtl" className="overflow-hidden">
      <div
        ref={scrollerRef}
        className="overflow-y-auto scrollbar-hidden px-[25px]"
        style={{ height: "calc(100vh - 90px)" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div className="space-y-5">
            {colA.map((p) => (
              <PostCard key={p._id} post={p} />
            ))}
          </div>
          <div className="space-y-4">
            {colB.map((p) => (
              <PostCard key={p._id} post={p} />
            ))}
          </div>
        </div>

        {loadingMore && (
          <div className="py-3 text-center text-sm text-black/60">
            جارِ تحميل المزيد…
          </div>
        )}

        <div ref={sentinelRef} style={{ height: 1 }} />
        <div className="p-2" />
      </div>
    </div>
  );
}
