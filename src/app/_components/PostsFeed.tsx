 "use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import PostCard, { Post } from "./PostCard";
import GlobalLoader from "@/components/GlobalLoader";
import { useTranslation } from "@/contexts/TranslationContext";

interface PostsFeedProps {
  viewedUserId?: string;
  lang?: "ar" | "en"; 
}

interface TranslatablePost extends Post {
  originalContent?: string;
  translatedContent?: string;
  translationStatus?: "idle" | "loading" | "translated";
}

const PostsFeed = ({ viewedUserId, lang = "ar" }: PostsFeedProps) => {
  const params = useParams();
  const { language } = useTranslation();
  const profileOwnerId =
    viewedUserId ||
    (typeof params?.id === "string" ? params.id : null);

  const [posts, setPosts] = useState<TranslatablePost[]>([]);
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

  const handleTranslateClick = async (post: TranslatablePost) => {
    const textToTranslate = post.originalContent || post.content;
    
    if (!textToTranslate || typeof textToTranslate !== "string" || textToTranslate.trim() === "") {
      return;
    }

    if (post.translationStatus === "translated") {
      setPosts((prev) =>
        prev.map((p) =>
          p._id === post._id
            ? { ...p, content: p.originalContent, translationStatus: "idle" }
            : p
        )
      );
      return;
    }

    if (post.translatedContent) {
      setPosts((prev) =>
        prev.map((p) =>
          p._id === post._id
            ? { ...p, content: p.translatedContent, translationStatus: "translated" }
            : p
        )
      );
      return;
    }

    setPosts((prev) =>
      prev.map((p) =>
        p._id === post._id ? { ...p, translationStatus: "loading" } : p
      )
    );

    try {
      const hasArabic = /[\u0600-\u06FF]/.test(textToTranslate);
      const targetLang = hasArabic ? "en" : "ar";

      const res = await fetch("https://bo-chat.space/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToTranslate, to: targetLang }),
      });

      if (!res.ok) throw new Error("Translation API error");
      const data = await res.json();
      
      const resultText = data.translatedText || data.text || textToTranslate;

      setPosts((prev) =>
        prev.map((p) =>
          p._id === post._id
            ? {
                ...p,
                originalContent: textToTranslate,
                translatedContent: resultText,
                content: resultText,
                translationStatus: "translated",
              }
            : p
        )
      );
    } catch (e) {
      console.error("خطأ أثناء الترجمة:", e);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === post._id ? { ...p, translationStatus: "idle" } : p
        )
      );
    }
  };

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
        } else if (guestId) {
          url =
            `https://bo-chat.space/home_posts/${guestId}` +
            `?page=${newPage}` +
            `&limit=${LIMIT}`;
        } else {
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

        const formattedPosts: TranslatablePost[] = newPosts.map((p) => ({
          ...p,
          originalContent: p.content || "",
          translationStatus: "idle",
        }));

        if (newPage === 1) {
          setPosts(formattedPosts);
        } else {
          setPosts((prev) => {
            const existing = new Set(prev.map((p) => p._id));
            const unique = formattedPosts.filter((p) => !existing.has(p._id));
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
    if (!sentinelRef.current) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !fetchingRef.current) {
          loadPosts(page + 1);
        }
      },
      {
        root: scrollContainerRef.current,
        rootMargin: "300px",
        threshold: 0.1,
      }
    );

    observerRef.current.observe(sentinelRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [hasMore, page, loadPosts, posts]);

  const { colA, colB } = useMemo(() => {
    const filtered = posts.filter((p) => p.type !== "video");

    const a: TranslatablePost[] = [];
    const b: TranslatablePost[] = [];

    filtered.forEach((p, i) => {
      if (i % 2 === 0) a.push(p);
      else b.push(p);
    });

    return { colA: a, colB: b };
  }, [posts]);

  const getTranslationLabel = (post: TranslatablePost) => {
    if (post.translationStatus === "loading") {
      return language === "en" ? "Translating..." : "جاري الترجمة...";
    }
    if (post.translationStatus === "translated") {
      return language === "en" ? "Show original text" : "شوف الكلام الأصلي";
    }
    return language === "en" ? "Translate" : "ترجمة هذا";
  };

  const noPostsText = language === "en" ? "No posts yet" : "لا يوجد فضفضات حتي الان";
  const noPostsSubText =
    language === "en"
      ? "Start interacting, create a new post and let your followers engage with it."
      : "ابدأ بالتفاعل, وانشئ فضفضة جديدة ودع متابعينك يتفاعلون معها";

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
          {noPostsText}
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
          {noPostsSubText}
        </p>
      </div>
    );
  }

  const injectTranslationIntoContent = (post: TranslatablePost) => {
    const textToShow = post.content || "";
    
    // التعديل هنا: إذا كان محتوى المنشور فارغاً أو عبارة عن مسافات فقط (صورة فقط)
    // نقوم بإرجاع النص كما هو (فارغ) دون إضافة أي زر للترجمة
    if (!textToShow || (typeof textToShow === "string" && textToShow.trim() === "")) {
      return textToShow as unknown as string;
    }
    
    return (
      <div className="w-full">
        {typeof textToShow === "string" ? (
          <span className="whitespace-pre-wrap block mb-1">{textToShow}</span>
        ) : (
          textToShow
        )}
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleTranslateClick(post);
          }}
          disabled={post.translationStatus === "loading"}
          className="text-red-500 text-xs font-medium block mt-1 pb-1 hover:underline transition-all duration-200"
          style={{ fontFamily: "Cairo", cursor: "pointer" }}
        >
          {getTranslationLabel(post)}
        </button>
      </div>
    ) as unknown as string;
  };

  return (
    <div
      ref={scrollContainerRef}
      className="h-[calc(100vh-95px)] overflow-y-auto no-scrollbar px-[10px]"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* العمود الأول */}
        <div className="space-y-5">
          {colA.map((post) => {
            const modifiedPost = {
              ...post,
              content: injectTranslationIntoContent(post)
            };
            return (
              <div key={post._id} className="relative">
                <PostCard post={modifiedPost} />
              </div>
            );
          })}
        </div>

        {/* العمود الثاني */}
        <div className="space-y-5">
          {colB.map((post) => {
            const modifiedPost = {
              ...post,
              content: injectTranslationIntoContent(post)
            };
            return (
              <div key={post._id} className="relative">
                <PostCard post={modifiedPost} />
              </div>
            );
          })}
        </div>
      </div>

      {loadingMore && (
        <div className="py-5 flex justify-center">
          <GlobalLoader />
        </div>
      )}

      <div ref={sentinelRef} className="h-2" />
    </div>
  );
};

export default React.memo(PostsFeed);