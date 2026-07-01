 // //////////////////////
"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import PostCard, { Post } from "./PostCard";
import GlobalLoader from "@/components/GlobalLoader";

interface PostsFeedProps {
  viewedUserId?: string;
}

const PostsFeed = ({ viewedUserId }: PostsFeedProps) => {
  //  console.log("🚀 PostsFeed rendered");

  const params = useParams();

  const profileOwnerId =
    viewedUserId ||
    (typeof params?.id === "string" ? params.id : null);

  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const fetchingRef = useRef(false);

  const LIMIT = 10;

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  }, []);

  const guestId = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      return userData?._id || null;
    } catch {
      return null;
    }
  }, []);

  const loadPosts = useCallback(
    async (newPage: number) => {
      if (fetchingRef.current) return;

      try {
        fetchingRef.current = true;

        if (newPage === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        setError(null);

        let url = "";
        const headers: HeadersInit = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        if (profileOwnerId) {
          url =
            `https://bo-chat.space/myposts/${profileOwnerId}` +
            `?guestid=${guestId}` +
            `&page=${newPage}` +
            `&limit=${LIMIT}`;
        }
         else if (guestId) {
          url =
            `https://bo-chat.space/home_posts/${guestId}` +
            `?page=${newPage}` +
            `&limit=${LIMIT}`;
        }
         else {
          url =
            `https://bo-chat.space/home_posts/687736386e7486ecbd002950` +
            `?page=${newPage}` +
            `&limit=${LIMIT}`;
        }

        const res = await fetch(url, { headers });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        let newPosts: Post[] = [];

        if (Array.isArray(data)) {
          newPosts = data;
        } else if (Array.isArray(data.posts)) {
          newPosts = data.posts;
        } else if (Array.isArray(data.data)) {
          newPosts = data.data;
        }

        if (newPage === 1) {
          setPosts(newPosts);
        } else {
          setPosts((prev) => {
            const existing = new Set(prev.map((p) => p._id));
            const unique = newPosts.filter((p) => !existing.has(p._id));
            return [...prev, ...unique];
          });
        }

         setHasMore(newPosts.length > 0);
        setPage(newPage);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "تعذر تحميل المنشورات");
      } finally {
        fetchingRef.current = false;
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [token, guestId, profileOwnerId]
  );

   useEffect(() => {
     loadPosts(1);
  }, [profileOwnerId, loadPosts]);



  useEffect(() => {
  // console.log("🟢 Observer useEffect is running...");
  // console.log("🟢 sentinelRef.current:", sentinelRef.current);

  if (!sentinelRef.current) {
    // console.log("⚠️ sentinelRef is null, cannot attach observer.");
    return;
  }

  observerRef.current?.disconnect();

  observerRef.current = new IntersectionObserver(
    (entries) => {
      // console.log("🔍 Intersection observer triggered!", entries[0]);
      // console.log("🔍 hasMore:", hasMore, " | fetchingRef:", fetchingRef.current);

      if (entries[0].isIntersecting && hasMore && !fetchingRef.current) {
        // console.log("🚀 جاري تحميل الصفحة التالية...");
        loadPosts(page + 1);
      } else {
        console.log("⛔ Skipping load:", {
          isIntersecting: entries[0].isIntersecting,
          hasMore,
          fetching: fetchingRef.current,
        });
      }
    },
    {
      root: scrollContainerRef.current, 
      rootMargin: "300px",
      threshold: 0.1,
    }
  );

  observerRef.current.observe(sentinelRef.current);
  // console.log("✅ Observer attached to sentinel successfully!");

  return () => {
    // console.log("🧹 Observer disconnected.");
    observerRef.current?.disconnect();
  };
}, [hasMore, page, loadPosts, posts]);

  const { colA, colB } = useMemo(() => {
    const filtered = posts.filter((p) => p.type !== "video");

    const a: Post[] = [];
    const b: Post[] = [];

    filtered.forEach((p, i) => {
      if (i % 2 === 0) a.push(p);
      else b.push(p);
    });

    return { colA: a, colB: b };
  }, [posts]);

  // --- حالات العرض ---

  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <GlobalLoader />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-600 text-center">{error}</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-4">
        <h3
          className="mb-2"
          style={{
            fontFamily: "Cairo",
            fontWeight: 400,
            fontSize: "20px",
            lineHeight: "100%",
            textAlign: "center",
            color: "#000000",
          }}
        >
          لا يوجد فضفضات حتي الان
        </h3>
        <p
          className="mt-2"
          style={{
            fontFamily: "Cairo",
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "28px",
            textAlign: "center",
            color: "#B6B7B7",
            width: "325px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          ابدأ بالتفاعل, وانشئ فضفضة جديدة ودع متابعينك يتفاعلون معها
        </p>
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      className="h-[calc(100vh-95px)] overflow-y-auto no-scrollbar px-[10px]"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-5">
          {colA.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>

        <div className="space-y-5">
          {colB.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>

      {loadingMore && (
        <div className="py-5 flex justify-center">
          <GlobalLoader />
        </div>
      )}

      {/* ✅ عنصر المراقبة - تأكد من وجوده في الـ DOM */}
      <div ref={sentinelRef} className="h-2" />
    </div>
  );
};

export default React.memo(PostsFeed);