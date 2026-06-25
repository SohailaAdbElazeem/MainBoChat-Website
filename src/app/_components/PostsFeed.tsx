// "use client";

// import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
// import PostCard, { Post } from "./PostCard";
// import GlobalLoader from "@/components/GlobalLoader";

// const PostsFeed = () => {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const shuffledRef = useRef(false);
//   const sentinelRef = useRef<HTMLDivElement | null>(null);
//   const scrollContainerRef = useRef<HTMLDivElement | null>(null);
//   const observerRef = useRef<IntersectionObserver | null>(null);
//   const fetchingRef = useRef(false);
//   const didInitRef = useRef(false);

//   const LIMIT = 20;
//   const STORAGE_KEY = "posts_feed_cache";

//   // Stable User Data
//   const { userId, token, API_BASE } = useMemo(() => {
//     if (typeof window === "undefined") {
//       return { userId: null, token: null, API_BASE: null };
//     }
//     const savedToken = localStorage.getItem("accessToken");
//     const userData = JSON.parse(localStorage.getItem("userData") || "{}");

//     return {
//       userId: userData?._id || null,
//       token: savedToken,
//       API_BASE: userData?._id ? `https://bo-chat.space/home_posts/${userData._id}` : null,
//     };
//   }, []);

//   const loadPosts = useCallback(async (newPage: number) => {
//     if (fetchingRef.current || !hasMore || !token || !API_BASE) return;

//     try {
//       fetchingRef.current = true;
//       newPage === 1 ? setLoading(true) : setLoadingMore(true);
//       setError(null);

//       const res = await fetch(`${API_BASE}?page=${newPage}&limit=${LIMIT}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!res.ok) throw new Error(`HTTP ${res.status}`);

//       const data = await res.json();
//       const newPosts: Post[] = Array.isArray(data) ? data : data.posts || data.data || [];

//       if (newPosts.length < LIMIT) setHasMore(false);

//       setPosts((prev) => {
//         const existing = new Set(prev.map((p) => p._id));
//         const unique = newPosts.filter((p: Post) => !existing.has(p._id));
//         let combined = [...prev, ...unique];

//         if (!shuffledRef.current && newPage === 1) {
//           combined = combined.sort(() => Math.random() - 0.5);
//           shuffledRef.current = true;
//         }

//         sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
//           posts: combined,
//           page: newPage,
//           hasMore: newPosts.length >= LIMIT,
//         }));

//         return combined;
//       });

//       setPage(newPage);
//     } catch (err: any) {
//       setError(err.message || "تعذر تحميل المنشورات");
//     } finally {
//       fetchingRef.current = false;
//       setLoading(false);
//       setLoadingMore(false);
//     }
//   }, [hasMore, token, API_BASE]);

//   // Initial Load
//   useEffect(() => {
//     if (didInitRef.current || !token || !userId) return;
//     didInitRef.current = true;

//     const cached = sessionStorage.getItem(STORAGE_KEY);
//     if (cached) {
//       try {
//         const parsed = JSON.parse(cached);
//         setPosts(parsed.posts || []);
//         setPage(parsed.page || 1);
//         setHasMore(parsed.hasMore ?? true);
//         setLoading(false);
//       } catch {
//         loadPosts(1);
//       }
//     } else {
//       loadPosts(1);
//     }
//   }, [token, userId, loadPosts]);

//   // Infinite Scroll
//   useEffect(() => {
//     if (!sentinelRef.current) return;

//     observerRef.current?.disconnect();

//     observerRef.current = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && hasMore && !fetchingRef.current) {
//           loadPosts(page + 1);
//         }
//       },
//       { root: scrollContainerRef.current, rootMargin: "300px", threshold: 0.1 }
//     );

//     observerRef.current.observe(sentinelRef.current);

//     return () => observerRef.current?.disconnect();
//   }, [hasMore, loadPosts, page]);

//   const { colA, colB } = useMemo(() => {
//     const filtered = posts.filter((p) => p.type !== "video");
//     const a: Post[] = [];
//     const b: Post[] = [];
//     filtered.forEach((p, i) => (i % 2 === 0 ? a : b).push(p));
//     return { colA: a, colB: b };
//   }, [posts]);

//   if (loading && posts.length === 0) {
//     return <div className="flex justify-center items-center h-[300px]"><GlobalLoader /></div>;
//   }

//   if (error) return <div className="p-4 text-red-600 text-center">{error}</div>;
//   if (!posts.length) return <div className="p-4 text-center">لا توجد منشورات</div>;

//   return (
//     <div ref={scrollContainerRef} 
//    className="h-[calc(100vh-95px)] overflow-y-auto no-scrollbar px-[10px]"
//     >
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="space-y-5">{colA.map((p) => <PostCard key={p._id} post={p} />)}</div>
//         <div className="space-y-5">{colB.map((p) => <PostCard key={p._id} post={p} />)}</div>
//       </div>

//       {loadingMore && <div className="py-5 flex justify-center"><GlobalLoader /></div>}
//       <div ref={sentinelRef} />
//     </div>
//   );
// };

// export default React.memo(PostsFeed);



 "use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import PostCard, { Post } from "./PostCard";
import GlobalLoader from "@/components/GlobalLoader";

interface PostsFeedProps {
  viewedUserId?: string;
}

const PostsFeed = ({ viewedUserId }: PostsFeedProps) => {
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

  const LIMIT = 100;

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  }, []);

  const guestId = useMemo(() => {
    if (typeof window === "undefined") return null;

    try {
      const userData = JSON.parse(
        localStorage.getItem("userData") || "{}"
      );

      return userData?._id || null;
    } catch {
      return null;
    }
  }, []);

  // const loadPosts = useCallback(
  //   async (newPage: number) => {
  //     if (fetchingRef.current || !token) return;

  //     try {
  //       fetchingRef.current = true;

  //       if (newPage === 1) {
  //         setLoading(true);
  //       } else {
  //         setLoadingMore(true);
  //       }

  //       setError(null);

  //       let url = "";

  //       // Profile Posts
  //       if (profileOwnerId) {
  //         url =
  //           `https://bo-chat.space/myposts/${profileOwnerId}` +
  //           `?guestid=${guestId}` +
  //           `&page=${newPage}` +
  //           `&limit=${LIMIT}`;
  //       }
  //       // Home Feed
  //       else if (guestId) {
  //         url =
  //           `https://bo-chat.space/home_posts/${guestId}` +
  //           `?page=${newPage}` +
  //           `&limit=${LIMIT}`;
  //       } else {
  //         return;
  //       }

 
  //       const res = await fetch(url, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       if (!res.ok) {
  //         throw new Error(`HTTP ${res.status}`);
  //       }

  //       const data = await res.json();

  //       let newPosts: Post[] = [];

  //       if (Array.isArray(data)) {
  //         newPosts = data;
  //       } else if (Array.isArray(data.posts)) {
  //         newPosts = data.posts;
  //       } else if (Array.isArray(data.data)) {
  //         newPosts = data.data;
  //       }

  //       if (newPage === 1) {
  //         setPosts(newPosts);
  //       } else {
  //         setPosts((prev) => {
  //           const existing = new Set(prev.map((p) => p._id));

  //           const unique = newPosts.filter(
  //             (p) => !existing.has(p._id)
  //           );

  //           return [...prev, ...unique];
  //         });
  //       }

  //       setHasMore(newPosts.length >= LIMIT);
  //       setPage(newPage);
  //     } catch (err: any) {
  //       console.error(err);
  //       setError(err.message || "تعذر تحميل المنشورات");
  //     } finally {
  //       fetchingRef.current = false;
  //       setLoading(false);
  //       setLoadingMore(false);
  //     }
  //   },
  //   [token, guestId, profileOwnerId]
  // );

  const loadPosts = useCallback(
  async (newPage: number) => {
    // ✅ إزالة شرط token
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

      // Profile Posts
      if (profileOwnerId) {
        url =
          `https://bo-chat.space/myposts/${profileOwnerId}` +
          `?guestid=${guestId}` +
          `&page=${newPage}` +
          `&limit=${LIMIT}`;
      }
      // Home Feed (مسجل دخول)
      else if (guestId) {
        url =
          `https://bo-chat.space/home_posts/${guestId}` +
          `?page=${newPage}` +
          `&limit=${LIMIT}`;
      }
      // ✅ زيارة غير مسجل (الصفحة الرئيسية)
      else {
        url =
          `https://bo-chat.space/home_posts/686695a04211804ef3875339` +
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

      setHasMore(newPosts.length >= LIMIT);
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
  [token, guestId, profileOwnerId] // يمكنك إضافة LIMIT إذا أردت
);

// ✅ تعديل useEffect لإزالة شرط token
useEffect(() => {
  loadPosts(1);
}, [profileOwnerId, guestId, loadPosts]);
  useEffect(() => {
    if (!token) return;

    loadPosts(1);
  }, [token, profileOwnerId, loadPosts]);

  useEffect(() => {
    if (!sentinelRef.current) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !fetchingRef.current
        ) {
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

    return () => observerRef.current?.disconnect();
  }, [hasMore, page, loadPosts]);

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

  // if (loading && posts.length === 0) {
  //   return (
  //     <div className="flex justify-center items-center h-[300px]">
  //       <GlobalLoader />
  //     </div>
  //   );
  // }
  if (loading && posts.length === 0) {
  return <div className="flex justify-center items-center h-[300px]"><GlobalLoader /></div>;
}

if (error) return <div className="p-4 text-red-600 text-center">{error}</div>;

if (!posts.length) {
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
          // width: "215px",
          marginLeft: "auto",
          marginRight: "auto",
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
ابدأ بالتفاعل, وانشئ فضفضة جديدة ودع متابعينك 
يتفاعلون معها      </p>
    </div>
  );
}

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        {/* <img src="/imgs/Group 9156.svg" alt="No Posts" /> */}
        <p
          className="text-black mt-4"
          style={{
            fontFamily: "Cairo",
            fontWeight: 400,
            fontSize: "20px",
            lineHeight: "100%",
          }}
        >
          لا توجد فضفضات حتى الآن
        </p>

        <p
          className="text-#B6B7B7 mt-2"
          style={{
            fontFamily: "Cairo",
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "28px",
          }}
        >
          لسه مفيش فضفضات للعرض، لما تنزل فضفضة هتظهر هنا
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

      <div ref={sentinelRef} />
    </div>
  );
};

export default React.memo(PostsFeed);