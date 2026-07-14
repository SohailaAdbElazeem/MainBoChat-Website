

// // // /* eslint-disable jsx-a11y/alt-text */
// // // /* eslint-disable @next/next/no-img-element */
// // // "use client";
// // // import React, { useEffect, useState, useCallback ,useRef} from "react";

// // // import Image from "next/image";
// // // import { useParams } from "next/navigation";
// // // import PostsFeed from "@/app/_components/PostsFeed";
// // // import ActionAreaClient from "../_components/ActionAreaClient";
// // // import FollowersMenu from "../_components/followersMenu";
// // // import ClientVisibilityGate from "../_components/ProfileGateClient";
// // // import { UserAPIResponse } from "@/types/types";
// // // import GlobalLoader from "@/components/GlobalLoader";
// // // import StyledQRCode from "@/app/_components/StyledQRCode";
// // // // import StyledQRCode, { StyledQRCodeRef } from "@/app/_components/StyledQRCode";
// // // import Link from "next/link";
// // // // import html2canvas from 'html2canvas';
// // // // import { toPng } from "html-to-image";
// // // import domtoimage from 'dom-to-image-more';

// // // function safeCount<T>(val?: T[] | Record<string, unknown> | number | null) {
// // //   if (val == null) return 0;
// // //   if (typeof val === "number") return val;
// // //   if (Array.isArray(val)) return val.length;
// // //   if (typeof val === "object") return Object.keys(val).length;
// // //   return 0;
// // // }

// // // export default function ProfilePageClient() {
// // //   const params = useParams();
// // //   const id = params && typeof params === "object" ? (params as any).id : undefined;
    
// // // //Rating
// // // const [stars, setStars] = useState<number>(5);
// // // const [commentText, setCommentText] = useState<string>('');
// // // const [ratingLoading, setRatingLoading] = useState<boolean>(false);

// // // //
// // // const [aboutExpanded, setAboutExpanded] = useState(false);
// // //   const [data, setData] = useState<UserAPIResponse | null>(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState<string | null>(null);
// // //   const [isRateOverlayOpen, setIsRateOverlayOpen] = useState(false);
// // //   const [userData, setUserData] = useState<any>(null);

// // //   const [isOverlayOpen, setIsOverlayOpen] = useState(false);
// // //   const [toast, setToast] = useState<string | null>(null);

// // //   const closeOverlay = useCallback(() => setIsOverlayOpen(false), []);
// // //   const openOverlay = useCallback(() => setIsOverlayOpen(true), []);
// // // //  const [posts, setPosts] = useState<any[]>([]);
// // //   // const profileUserId = params?.id as string | undefined;
// // //   const [postsCount, setPostsCount] = useState<number | null>(null);

// // //  const [ratings, setRatings] = useState<any[]>([]);
// // // const [ratingsLoading, setRatingsLoading] = useState(false);

// // // // ظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظ
// // // // QR Overlay
// // // const [showQROverlay, setShowQROverlay] = useState(false);
// // // const [isClient, setIsClient] = useState(false);
// // // const [profileUrl, setProfileUrl] = useState("");

// // // // فتح وإغلاق QR
// // // const handleOpenQR = () => setShowQROverlay(true);
// // // const handleCloseQR = () => setShowQROverlay(false);
// // // const qrCardRef = useRef<HTMLDivElement>(null);
// // // const qrRef = useRef<StyledQRCodeRef>(null);
// // // const qrValue = profileUrl || "";
// // // // تعيين الرابط بعد التحميل (لتجنب Hydration mismatch)
 

// // //  const downloadQRImage = async () => {
// // //   if (!qrCardRef.current) {
// // //     setToast('⚠️ البطاقة غير جاهزة');
// // //     setTimeout(() => setToast(null), 3000);
// // //     return;
// // //   }

// // //   try {
// // //     // تحويل البطاقة بأكملها إلى صورة PNG
// // //     const dataUrl = await domtoimage.toPng(qrCardRef.current, {
// // //       scale: 2,                 // جودة عالية (2x)
// // //       bgColor: '#ffffff',       // خلفية بيضاء للتأكد من عدم الشفافية
// // //       quality: 1,
// // //       useCORS: true,            // لتحميل الصور الخارجية
// // //       cacheBust: true,          // منع التخزين المؤقت
// // //     });

// // //     // إنشاء رابط التحميل
// // //     const link = document.createElement('a');
// // //     link.download = `qr-${user.username || 'user'}.png`;
// // //     link.href = dataUrl;
// // //     document.body.appendChild(link);
// // //     link.click();
// // //     document.body.removeChild(link);

// // //     setToast('✅ تم تنزيل البطاقة بنجاح');
// // //     setTimeout(() => setToast(null), 2000);
// // //     handleCloseQR(); // إغلاق النافذة بعد التنزيل (اختياري)
// // //   } catch (error: any) {
// // //     console.error('❌ خطأ في التنزيل:', error);
// // //     setToast(`❌ فشل التنزيل: ${error.message || 'خطأ غير معروف'}`);
// // //     setTimeout(() => setToast(null), 4000);
// // //   }
// // // };
// // // useEffect(() => {
// // //   setIsClient(true);
// // //   if (typeof window !== "undefined") {
// // //     setProfileUrl(`${window.location.origin}/profile/${id}`);
// // //   }
// // // }, [id]);


// // // // ظظظظظظظظظظظظظظظظظظظظظظظظظ
// // // const [menuState, setMenuState] = useState<{
// // //   id: string | null;
// // //   top: number;
// // //   left: number;
// // // }>({
// // //   id: null,
// // //   top: 0,
// // //   left: 0,
// // // });
// // // const [toastMessage, setToastMessage] = useState<string | null>(null);
// // // const [toastType, setToastType] = useState<'success' | 'error'>('success');

// // // const showToast = (message: string, type: 'success' | 'error' = 'success') => {
// // //   setToastMessage(message);
// // //   setToastType(type);
// // //   setTimeout(() => setToastMessage(null), 3000);
// // // };
// // // const toggleMenu = (rateId: string, e: React.MouseEvent) => {
// // //   const rect = e.currentTarget.getBoundingClientRect();
// // //   console.log('🔔 toggleMenu called for', rateId, 'rect:', rect); 
// // //   setMenuState({
// // //     id: menuState.id === rateId ? null : rateId,
// // //     top: rect.bottom + 10, 
// // //     left: rect.left, 
// // //   });
// // // };
 
// // // const handleBlock = async (userIdToBlock: string, userName: string) => {
// // //   try {
// // //     const token = getAccessToken();
// // //     if (!token) {
// // //       setToast('يجب تسجيل الدخول أولاً');
// // //       setTimeout(() => setToast(null), 3000);
// // //       return;
// // //     }

// // //     let myUserId = "";
// // //     try {
// // //       const raw = localStorage.getItem("userData");
// // //       if (raw) {
// // //         const parsed = JSON.parse(raw);
// // //         myUserId = parsed._id;
// // //       }
// // //     } catch (e) {
// // //       console.error("Error getting myUserId:", e);
// // //     }

// // //     if (!myUserId) {
// // //       setToast('لم يتم العثور على معرف المستخدم');
// // //       setTimeout(() => setToast(null), 3000);
// // //       return;
// // //     }

// // //     const res = await fetch(`https://bo-chat.space/block${myUserId}`, {
// // //       method: 'POST',
// // //       headers: {
// // //         'Authorization': `Bearer ${token}`,
// // //         'Content-Type': 'application/json',
// // //       },
// // //       body: JSON.stringify({ blockedid: userIdToBlock }),
// // //     });

// // //     const responseText = await res.text();
 
// // //     if (!res.ok) {
// // //       throw new Error(responseText || `HTTP ${res.status}`);
// // //     }

// // //     setToast(`✅ تم حظر ${userName} بنجاح`);
// // //     setTimeout(() => setToast(null), 3000);
// // //     setMenuState({ id: null, top: 90, left: 0 });

// // //   } catch (error) {
// // //     console.error('Block error:', error);
// // //     setToast('❌ حدث خطأ أثناء محاولة الحظر');
// // //     setTimeout(() => setToast(null), 3000);
// // //     setMenuState({ id: null, top: 0, left: 0 });
// // //   }
// // // };
// // // //   handleReportUser
// // // const handleReportUser = async (userIdToReport: string, userName: string) => {
// // //   const token = getAccessToken();
// // //   let myUserId = "";
// // //   try {
// // //     const raw = localStorage.getItem("userData");
// // //     if (raw) {
// // //       const parsed = JSON.parse(raw);
// // //       myUserId = parsed._id;
// // //     }
// // //   } catch (e) {
// // //     console.error("Error getting myUserId:", e);
// // //   }

// // //   if (!token || !myUserId) {
// // //     setToast('يجب تسجيل الدخول أولاً');
// // //     setTimeout(() => setToast(null), 3000);
// // //     return;
// // //   }

// // //   try {
// // //     const res = await fetch(`https://bo-chat.space/report${myUserId}`, {
// // //       method: "POST",
// // //       headers: {
// // //         "Content-Type": "application/json",
// // //         Authorization: `Bearer ${token}`,
// // //       },
// // //       body: JSON.stringify({
// // //         userid: userIdToReport, 
// // //         email: "",
// // //       }),
// // //     });
// // //     const text = await res.text();
// // //     if (!res.ok) throw new Error(text || "فشل إرسال البلاغ");
// // //     setToast(`✅ تم الإبلاغ عن ${userName} بنجاح`);
// // //     setTimeout(() => setToast(null), 3000);
// // //     setMenuState({ id: null, top: 0, left: 0 });
// // //   } catch (err) {
// // //     console.error("REPORT ERROR:", err);
// // //     setToast('❌ حدث خطأ أثناء إرسال البلاغ');
// // //     setTimeout(() => setToast(null), 3000);
// // //     setMenuState({ id: null, top: 0, left: 0 });
// // //   }
// // // };

// // // // دالة تقييم المستخدم
// // // const handleRateUser = async () => {
// // //   const token = getAccessToken();
// // //   let myUserId = "";
// // //   try {
// // //     const raw = localStorage.getItem("userData");
// // //     if (raw) {
// // //       const parsed = JSON.parse(raw);
// // //       myUserId = parsed._id;
// // //     }
// // //   } catch (e) {
// // //     console.error("Error getting myUserId:", e);
// // //   }

// // //   if (!token || !myUserId) {
// // //     setToast('يجب تسجيل الدخول أولاً');
// // //     setTimeout(() => setToast(null), 3000);
// // //     return;
// // //   }

// // //   if (!id) {
// // //     setToast('معرّف المستخدم غير موجود');
// // //     setTimeout(() => setToast(null), 3000);
// // //     return;
// // //   }

// // //   setRatingLoading(true);
// // //   try {
// // //     const res = await fetch(`https://bo-chat.space/rate`, {
// // //       method: "POST",
// // //       headers: {
// // //         "Content-Type": "application/json",
// // //         Authorization: `Bearer ${token}`,
// // //       },
// // //       body: JSON.stringify({
// // //         stars: stars,
// // //         comment: commentText || "",
// // //         rateduserid: id,
// // //         ratinguserid: myUserId, 
// // //       }),
// // //     });
// // //     const text = await res.text();
// // //     if (!res.ok) throw new Error(text || "فشل التقييم");
// // //     setToast(`✅ تم تقييم المستخدم بنجاح`);
// // //     setTimeout(() => setToast(null), 3000);
// // //     setCommentText('');
// // //     setStars(5);
// // //      fetchRatings();
// // //   } catch (err) {
// // //     console.error("RATE ERROR:", err);
// // //     setToast('❌ حدث خطأ أثناء التقييم');
// // //     setTimeout(() => setToast(null), 3000);
// // //   } finally {
// // //     setRatingLoading(false);
// // //   }
// // // };
// // // // /////////////////////////////
// // // useEffect(() => {
// // //    if (!data?.userpersonaldata?._id) return;

// // //   const fetchPostsCount = async () => {
// // //     try {
// // //       const token = localStorage.getItem("accessToken") || "";
// // //       const userId = data.userpersonaldata._id; 
// // //        const url = `https://bo-chat.space/myposts/${userId}?guestid=${userId}&page=1&limit=1000`;

// // //       const response = await fetch(url, {
// // //         headers: {
// // //           Authorization: `Bearer ${token}`,
// // //           'Content-Type': 'application/json',
// // //         },
// // //       });

// // //       if (!response.ok) throw new Error(`HTTP ${response.status}`);

// // //       const posts = await response.json();

// // //       if (Array.isArray(posts)) {
// // //          const count = posts.length;
// // //         if (count === 1000) {
// // //            setPostsCount(1000); 
// // //          } else {
// // //           setPostsCount(count);
// // //         }
// // //       } else {
// // //         console.warn("Unexpected response format", posts);
// // //         setPostsCount(0);
// // //       }
// // //     } catch (error) {
// // //       console.error("Error fetching posts count:", error);
// // //       setPostsCount(0);
// // //     }
// // //   };

// // //   fetchPostsCount();
// // // }, [data?.userpersonaldata?._id]); 
// // //   // 
// // //   const copyProfileLink = useCallback(async () => {
// // //     if (!id) {
// // //       setToast("معرّف المستخدم غير موجود.");
// // //       setTimeout(() => setToast(null), 1800);
// // //       return;
// // //     }
// // //     const origin = typeof window !== "undefined" && window.location?.origin ? window.location.origin : "https://localhost:3000";
// // //     const profileUrl = `${origin}/profile/${id}`;
// // //     try {
// // //       if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
// // //         await navigator.clipboard.writeText(profileUrl);
// // //       } else {
// // //         const ta = document.createElement("textarea");
// // //         ta.value = profileUrl;
// // //         ta.style.position = "fixed";
// // //         ta.style.left = "-9999px";
// // //         document.body.appendChild(ta);
// // //         ta.select();
// // //         document.execCommand("copy");
// // //         document.body.removeChild(ta);
// // //       }
// // //       setToast("تم نسخ الرابط إلى الحافظة");
// // //       setTimeout(() => setToast(null), 1800);
// // //     } catch (err) {
// // //       console.error("copy error", err);
// // //       setToast("فشل النسخ");
// // //       setTimeout(() => setToast(null), 1800);
// // //     }
// // //   }, [id]);

// // //    const getAccessToken = useCallback(() => {
// // //     return localStorage.getItem("accessToken") || process.env.NEXT_PUBLIC_ACTIVE_USERS_TOKEN || "";
// // //   }, []);

// // //    useEffect(() => {
// // //     if (!id) {
// // //       setError("معرّف الملف الشخصي مفقود من الـ URL.");
// // //       setLoading(false);
// // //       return;
// // //     }
// // //     const ac = new AbortController();
// // //     let mounted = true;

// // //     async function fetchUser() {
// // //       setLoading(true);
// // //       setError(null);
// // //       const token = getAccessToken();
// // //       if (!token) {
// // //         if (mounted) setError("لم يتم العثور على توكن الدخول. يرجى تسجيل الدخول مرة أخرى.");
// // //         setLoading(false);
// // //         return;
// // //       }
// // //       try {
// // //         const res = await fetch(`https://bo-chat.space/users/${id}`, {
// // //           headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
// // //           signal: ac.signal,
// // //         });
// // //         if (!res.ok) {
// // //           if (res.status === 401 || res.status === 403) {
// // //             throw new Error("جلسة غير صالحة. يرجى تسجيل الدخول مجدداً.");
// // //           }
// // //           throw new Error(`HTTP ${res.status}`);
// // //         }
// // //         const json = (await res.json()) as UserAPIResponse;
// // //         if (mounted) {
// // //           setData(json);
// // //           console.log("User data fetched:", json);
// // //         }
// // //       } catch (err: any) {
// // //         if (err?.name === "AbortError") return;
// // //         console.error("fetchUser error:", err);
// // //         if (mounted) setError(err.message || "حدث خطأ أثناء جلب بيانات المستخدم.");
// // //       } finally {
// // //         if (mounted) setLoading(false);
// // //       }
// // //     }

// // //     fetchUser();
// // //     return () => {
// // //       mounted = false;
// // //       ac.abort();
// // //     };
// // //   }, [id, getAccessToken]);

// // //    const fetchCurrentUserData = useCallback(async () => {
// // //     try {
// // //       const token = getAccessToken();
// // //       const userDataStr = localStorage.getItem("userData");
// // //       if (!userDataStr) return;
// // //       const parsed = JSON.parse(userDataStr);
// // //       const currentUserId = parsed._id;
// // //       if (!currentUserId) return;
// // //       const res = await fetch(`https://bo-chat.space/users/${currentUserId}`, {
// // //         headers: { Authorization: `Bearer ${token}` },
// // //       });
// // //       if (!res.ok) throw new Error("Failed to fetch current user data");
// // //       const data = await res.json();
// // //       setUserData(data);
// // //     } catch (err) {
// // //       console.error("FETCH CURRENT USER ERROR:", err);
// // //     }
// // //   }, [getAccessToken]);

// // //   useEffect(() => {
// // //     if (id) {
// // //       fetchCurrentUserData();
// // //     }
// // //   }, [id, fetchCurrentUserData]);

// // //   useEffect(() => {
// // //     function onKey(e: KeyboardEvent) {
// // //       if (e.key === "Escape") closeOverlay();
// // //     }
// // //     if (isOverlayOpen) window.addEventListener("keydown", onKey);
// // //     return () => window.removeEventListener("keydown", onKey);
// // //   }, [isOverlayOpen, closeOverlay]);


// // //    // أضف useCallback لجلب التقييمات
// // // const fetchRatings = useCallback(async () => {
// // //   if (!id) return;
// // //   const token = getAccessToken();
// // //   let guestId = "";
// // //   try {
// // //     const raw = localStorage.getItem("userData");
// // //     if (raw) {
// // //       const parsed = JSON.parse(raw);
// // //       guestId = parsed._id;
// // //     }
// // //   } catch (e) {}
// // //   if (!guestId || !token) {
// // //     setRatings([]);
// // //     return;
// // //   }
// // //   setRatingsLoading(true);
// // //    try {
// // //     const res = await fetch(`https://bo-chat.space/rate/${id}?guestid=${guestId}`, {
// // //       headers: { Authorization: `Bearer ${token}` },
// // //     });
// // //     if (!res.ok) throw new Error(`HTTP ${res.status}`);
// // //     const data = await res.json();
// // //     if (Array.isArray(data)) {
// // //       setRatings(data);
// // //     } else {
// // //       setRatings([]);
// // //     }
// // //   } catch (error) {
// // //     console.error("Error fetching ratings:", error);
// // //     setRatings([]);
// // //   } finally {
// // //     setRatingsLoading(false);
// // //   }
// // // }, [id, getAccessToken]);
// // // // useEffect لتشغيل الجلب عند فتح الـ overlay
// // // useEffect(() => {
// // //   if (isRateOverlayOpen) {
// // //     fetchRatings();
// // //   }
// // // }, [isRateOverlayOpen, fetchRatings]);
// // //    if (loading) {
// // //     return (
// // //       <div dir="rtl" className="min-h-screen flex items-center justify-center p-8">
// // //         <GlobalLoader />
// // //       </div>
// // //     );
// // //   }

// // //   if (error || !data || !data.userpersonaldata) {
// // //     return (
// // //       <div dir="rtl" className="min-h-screen flex items-center justify-center p-8">
// // //         <div className="text-center text-red-600">{error ?? "المستخدم غير موجود أو حدث خطأ."}</div>
// // //       </div>
// // //     );
// // //   }

// // //   const res = data;
// // //   const user: any = res.userpersonaldata;
// // //   const followers = Array.isArray(res.followers) ? res.followers : [];
// // //   const following = Array.isArray(res.following) ? res.following : [];

// // //   const followerIds: string[] = followers
// // //     .map((f: any) =>
// // //       typeof f === "string"
// // //         ? f
// // //         : f.followerid ?? f.followerId ?? f._id ?? (f.followerdata && f.followerdata._id) ?? ""
// // //     )
// // //     .filter(Boolean);

// // //   const avatar = user.img || "/imgs/default-avatar.png";
// // //    const followersCount = followers.length;
// // //   const followingCount = following.length;
// // //   const viewsCount = user.visit ?? 0;
// // //   const rateCount = user.rate ?? 0;
  
// // //   return (
// // //     <div className="min-h-screen bg-white text-gray-800" dir="rtl">
// // //       <div className="px-5 py-1">
// // //         <h1 className="text-xl font-semibold">{user.name}</h1>
// // //         {/* {user.private ? (
// // //           <p className="text-xs text-gray-500">درج خاص</p>
// // //         ) : res.posts?.length === 0 ? (
// // //           <p className="text-xs text-gray-500">لا يوجد فضفضات</p>
// // //         ) : (
// // //           <div className="text-xs text-gray-500">{postsCount} فضفضه</div>
// // //         )} */}

// // //        {/* 4. عرض العدد أو رسالة "لا يوجد" بناءً على state postsCount */}
// // //       {user.private ? (
// // //   <p className="text-xs text-gray-500">درج خاص</p>
// // // ) : postsCount === null ? (
// // //   <div className="text-xs text-gray-500 animate-pulse">جارى التحميل </div>
// // // ) : postsCount === 0 ? (
// // //   <p className="text-xs text-gray-500">لا يوجد فضفضات</p>
// // // ) : (
// // //   <div className="text-xs text-gray-500">
// // //     {postsCount === 1000 ? "1000+ فضفضة" : `${postsCount} فضفضة`}
// // //   </div>
// // // )}
// // //       </div>
// // //       <div className="min-h-screen overflow-hidden">
// // //         <div className="relative overflow-y-auto h-[calc(100vh-100px)] scrollbar-hidden">
// // //           {/* Banner */}
// // //           <div className="relative">
// // //             <div className="h-[167px] w-full" style={{ background: "linear-gradient(90deg,#fff0f0,#e65b5b 25%,#d23e3e 70%,#c62828)" }}>
// // //               <div className="flex px-4 w-full items-end h-full flex-row gap-3">
// // //                 <ClientVisibilityGate
// // //                   profileId={res.userpersonaldata._id}
// // //                   profilePrivate={res.userpersonaldata.private}
// // //                   fallback={
// // //                     <div>
// // //                       <div className="relative w-28 h-28 md:w-36 md:h-36 z-[99] transform translate-y-1/2">
// // //                         <div className="relative w-full h-full rounded-t-[60px] rounded-b-[45px] border-2 border-white overflow-hidden">
// // //                           <Image
// // //                             src={avatar}
// // //                             alt={user.name ?? "Avatar"}
// // //                             width={140}
// // //                             height={136}
// // //                             unoptimized
// // //                             className="object-cover w-full h-full"
// // //                           />
// // //                           <div className="absolute bottom-0 left-0 w-full h-[42%] backdrop-blur-md flex items-center justify-center text-white bg-gradient-to-b from-[#D72229]/15 to-[#F92428]/50 z-10">
// // //                             <p>درج خاص</p>
// // //                           </div>
// // //                          </div>
// // //                         {user.vip && (
// // //                           <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
// // //                             <img src="/icons/vip.svg" alt="VIP" className="w-6 h-6 md:w-8 md:h-8" />
// // //                           </div>
// // //                         )}
// // //                       </div>
// // //                     </div>
// // //                   }
// // //                 >
// // //                   <button
// // //                     aria-label="عرض الصورة"
// // //                     onClick={openOverlay}
// // //                     className="relative w-[136px] h-[136px] md:w-36 md:h-36 rounded-[60px] border-2 border-white overflow-hidden bg-gray-100 transform translate-y-1/2 focus:outline-none z-[99]"
// // //                   >
// // //                     <Image src={avatar} alt={user.name ?? "Avatar"} width={150} height={150} unoptimized className="object-cover cursor-pointer w-full h-full" />
// // //                   </button>
// // //                 </ClientVisibilityGate>

// // //                 <div className="mb-2">
// // //                 <h1 className="text-xl md:text-2xl font-semibold text-white leading-tight">
// // //                   {user.name}
// // //                 </h1>

// // //                 {user.username && (
// // //                   <p className="text-sm text-white/90 mt-[1px] leading-none">
// // //                     @{user.username}
// // //                   </p>
// // //                 )}
// // //               </div>
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* Main */}
// // //           <div className="relative">
// // //             <div className="md:px-5 py-3 border-b border-[#F6F6f6]">
// // //               <div className="flex flex-col gap-6">
// // //                 <div className="flex-1 text-right">
// // //                   <div className="mr-[150px] flex justify-between">
// // //                     {/* <p className="text-sm text-[#B6B7B7] max-w-[280px]">{user.about || "أنا هنا لأتواصل وأكتشف عوالم جديدة مع أشخاص يشبهونني"}</p> */}
// // //                    <p
// // //                   className="text-sm text-[#B6B7B7] max-w-[280px] h-[50px] cursor-pointer select-none"
// // //                   onClick={() => setAboutExpanded(!aboutExpanded)}
// // //                 >
// // //                   {(() => {
// // //                     const text = user.about || "أنا هنا لأتواصل وأكتشف عوالم جديدة مع أشخاص يشبهونني";
// // //                     const words = text.split(' ');
// // //                     if (words.length > 7) {
// // //                       return aboutExpanded ? text : words.slice(0, 7).join(' ') + '...';
// // //                     }
// // //                     return text;
// // //                   })()}
// // //                 </p>
// // //                     <div className="flex gap-1">
// // //                       {id ? <ActionAreaClient followingId={id} serverFollowerIds={followerIds} receiverId={user._id} username={user.name} /> : null}
// // //                     </div>
// // //                   </div>

// // //                   <div className="mt-7">
// // //                     <div onClick={() => setIsRateOverlayOpen(true)} className="cursor-pointer select-none">
// // //                       {rateCount === 0 ? (
// // //                         <p className="text-sm underline text-[#D72229]  text-[15px]">لم يحصل هذا الدرج علي اي تقييم</p>
// // //                       ) : (
// // //                         <div className="m-0 text-sm font-semibold underline text-[#D72229]">
// // //                           <span className="text-xs">حصل هذا الدرج علي</span> تقييم {Number(rateCount.toFixed(2))} نجوم
// // //                         </div>
// // //                       )}
// // //                     </div>

// // //                     <div className="flex gap-4 mt-1 text-[15px]">
// // //                       <div className="flex gap-1 items-center justify-center"><div className="text-sm text-[#B6B7B7]"> صاحبي هنا</div><div className="text-md font-semibold">{followersCount}</div></div>
// // //                       <div className="flex gap-1 items-center justify-center"><h3 className="text-sm font-semibold text-[#B6B7B7]">متابعين</h3><div className="text-md font-semibold">{followingCount}</div></div>
// // //                       <div className="flex gap-1 items-center justify-center"><div className="text-sm text-[#B6B7B7]">مشاهدة</div><div className="text-md font-semibold">{viewsCount}</div></div>
// // //                     </div>

// // //                     <ClientVisibilityGate profileId={res.userpersonaldata._id} profilePrivate={res.userpersonaldata.private}  >
// // //                       <FollowersMenu followers={res.followers ?? []} title="اطلع الان علي جميع المتابعين" limit={3} />
// // //                     </ClientVisibilityGate>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             </div>

// // //             <ClientVisibilityGate profileId={res.userpersonaldata._id} isPrivate={res.userpersonaldata.private} profilePrivate={res.userpersonaldata.private} fallback={<div className="flex items-center justify-center flex-col text-center pt-3"><h3 className="text-xl">درج خاص</h3><p className="text-[#B6B7B7] max-w-[350px]">مرحبا هذا الدرج خاص الآن فقط من اقبل متابعتهم يمكنهم رؤية فضفضاتي</p></div>}>
// // //               <PostsFeed />
// // //             </ClientVisibilityGate>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Overlay الصورة */}
// // //       {/* {isOverlayOpen && (
// // //         <div role="dialog" aria-modal="true" className="fixed w-full h-full inset-0 z-50 flex items-center justify-center z-[9999] p-4">
// // //           <div onClick={closeOverlay} className="absolute inset-0 bg-black/95" />
// // //           <div className="relative z-60 max-w-[720px] w-full max-h-[90vh] rounded-2xl">
// // //             <div className="w-full flex justify-center items-center p-6">
// // //               <Image src={avatar} alt={user.name ?? "Avatar"} width={600} height={600} unoptimized className="object-contain w-[500px] h-[500px] rounded-[170px]" />
// // //             </div>
// // //             <button onClick={copyProfileLink} className="w-[200px] text-center py-3 cursor-pointer bg-white absolute bottom-[-70px] left-1/2 transform -translate-x-1/2 rounded-[17px] shadow-sm text-sm hover:bg-gray-50" aria-label="نسخ رابط الملف الشخصي">
// // //               شير الدرج
// // //             </button>
// // //             <button onClick={closeOverlay} aria-label="إغلاق" className="px-3 py-3 cursor-pointer absolute top-[-30px] left-1/2 transform -translate-x-1/2 rounded-full shadow-sm bg-[#FFFFFF]/15">
// // //               <img src="/icons/close.svg" alt="close" />
// // //             </button>
// // //           </div>
// // //         </div>
// // //       )} */}
// // //       {/* Overlay الصورة */}
// // // {isOverlayOpen && (
// // //   <div role="dialog" aria-modal="true" className="fixed w-full h-full inset-0 z-50 flex items-center justify-center z-[9999] p-4">
// // //     <div onClick={closeOverlay} className="absolute inset-0 bg-black/95" />
// // //     <div className="relative z-60 max-w-[720px] w-full max-h-[90vh] rounded-2xl">
// // //       <div className="w-full flex justify-center items-center p-6">
// // //         <Image 
// // //           src={avatar} 
// // //           alt={user.name ?? "Avatar"} 
// // //           width={600} 
// // //           height={600} 
// // //           unoptimized 
// // //           className="object-contain w-[500px] h-[500px] rounded-[170px]" 
// // //         />
// // //       </div>
      
// // //       {/* ✅ ثلاث أزرار بالتصميم الجديد */}
// // //       <div className="flex items-center justify-center gap-4 absolute bottom-[-70px] left-1/2 transform -translate-x-1/2">
// // //         {/* الزر الثالث: إجراء آخر */}
// // //         <button 
// // //            onClick={handleOpenQR}   // ✅ تم إضافة الدالة         
// // //             className="w-[60px] h-[60px] rounded-full bg-[#000000BF] border-2 border-[#FFFFFF26] shadow-sm hover:bg-[#000000]/90 transition-all flex items-center justify-center cursor-pointer"
// // //           aria-label="إجراء"
// // //         >
// // //           <img 
// // //             src="/icons/Vector (21).svg" 
// // //             alt="إجراء" 
// // //             className="w-[21px] h-[22px]" 
// // //             style={{ filter: "brightness(0) invert(1)" }}
// // //           />
// // //         </button>

// // //           {/* الزر الثاني: إزالة (نمزيل) */}
// // //         <button 
// // //           // onClick={handleRemove} 
// // //           className="w-[60px] h-[60px] rounded-full bg-[#000000BF] border-2 border-[#FFFFFF26] shadow-sm hover:bg-[#000000]/90 transition-all flex items-center justify-center cursor-pointer"
// // //           aria-label="إزالة"
// // //         >
// // //           <img 
// // //             src="/icons/Group 9307.svg" 
// // //             alt="إزالة" 
// // //             className="w-[21px] h-[22px]" 
// // //             style={{ filter: "brightness(0) invert(1)" }}
// // //           />
// // //         </button>


// // //           {/* الزر الأول: شير (نسخ الرابط) */}
// // //         <button 
// // //           onClick={copyProfileLink} 
// // //           className="w-[60px] h-[60px] rounded-full bg-[#000000BF] border-2 border-[#FFFFFF26] shadow-sm hover:bg-[#000000]/90 transition-all flex items-center justify-center cursor-pointer"
// // //           aria-label="مشاركة"
// // //         >
// // //           <img 
// // //             src="/icons/Vector (20).svg" 
// // //             alt="شير" 
// // //             className="w-[21px] h-[22px]" 
// // //             style={{ filter: "brightness(0) invert(1)" }}
// // //           />
// // //         </button>
// // //       </div>

// // //       {/* زر الإغلاق */}
// // //       <button 
// // //         onClick={closeOverlay} 
// // //         aria-label="إغلاق" 
// // //         className="px-3 py-3 cursor-pointer absolute top-[-30px] left-1/2 transform -translate-x-1/2 rounded-full shadow-sm bg-[#FFFFFF]/15 hover:bg-[#FFFFFF]/30 transition"
// // //       >
// // //         <img src="/icons/close.svg" alt="close" />
// // //       </button>
// // //     </div>
// // //   </div>
// // // )}
// // // {/* ///////////////////////////////////////////  */}
// // // {showQROverlay && (
// // //   <div
// // //     className="fixed inset-0 bg-black flex items-center justify-center z-[99999]"
// // //     onClick={handleCloseQR}
// // //   >
// // //     <div className="relative flex flex-col items-center">
// // //       <div
     
// // //         className="relative flex flex-col items-center gap-2 py-6 px-5 rounded-[35px] shadow-2xl"
// // //         style={{
// // //           width: '411px',
// // //           height: '550px',
// // //           maxWidth: '95vw',
// // //           maxHeight: '90vh',
// // //           marginTop: '20px',
// // //           backgroundImage: "url('/imgs/Group 9318.svg')",
// // //           backgroundSize: 'cover',
// // //           backgroundPosition: 'center',
// // //           backgroundRepeat: 'no-repeat',
// // //         }}
// // //         dir="rtl"
// // //         onClick={(e) => e.stopPropagation()}
// // //       >
// // //         {/* زر الإغلاق */}
// // //         <button
// // //           onClick={handleCloseQR}
// // //           aria-label="إغلاق"
// // //           className="px-3 py-3 cursor-pointer absolute top-[-50px] left-1/2 transform -translate-x-1/2 rounded-full shadow-sm bg-[#FFFFFF]/15 hover:bg-[#FFFFFF]/30 transition z-50"
// // //         >
// // //           <img src="/icons/close.svg" alt="close" />
// // //         </button>

// // //         {/* الشعار */}
// // //         <Link href="/" className="flex justify-center">
// // //           <img
// // //             src="/logo-red.png"
// // //             alt="BO CHAT"
// // //             className="w-[40px] h-auto brightness-0 invert"
// // //           />
// // //         </Link>

// // //         {/* بطاقة QR - ثابتة الأبعاد */}
// // //         <div className="w-[209px] h-[250px] bg-white rounded-[18px] overflow-hidden shadow-lg flex-shrink-0">
// // //           {/* اسم المستخدم */}
// // //           <div
// // //             className="h-[41px] bg-[#FCE9E9] flex items-center justify-center gap-0 cursor-pointer hover:opacity-70 transition"
// // //             onClick={() => {
// // //               const username = user.username || user.name;
// // //               navigator.clipboard.writeText(username);
// // //               setToast(` تم نسخ    : ${username}`);
// // //               setTimeout(() => setToast(null), 2000);
// // //             }}
// // //           >
// // //             <span
// // //               className="text-[#D72229] font-bold text-[18px] leading-none"
// // //               style={{ fontFamily: "Inter" }}
// // //             >
// // //               {user.username || user.name}
// // //             </span>
// // //             <span
// // //               className="text-[#D72229] font-bold text-[18px] leading-none"
// // //               style={{ fontFamily: "Inter" }}
// // //             >
// // //               @
// // //             </span>
// // //           </div>

// // //           {/* QR Code - بدون margins، حجم مناسب لمنع القص */}
// // //           <div
// // //            ref={qrCardRef} 
// // //           className="w-[209px] h-[209px] bg-white rounded-b-[18px] flex items-center justify-center overflow-hidden flex-shrink-0">
// // //             {isClient && profileUrl && (
// // //               <StyledQRCode
// // //                 // value={profileUrl}
// // //                   ref={qrRef}
// // //                   // value={qrValue}
// // //                         value={profileUrl}
// // //                 size={205}
// // //                 image="/imgs/876771 copy 1.svg"
// // //                 imageSize={0.3}
// // //               />
// // //             )}
// // //           </div>
// // //         </div>

// // //         {/* النص الأول - تحت الصورة مباشرة */}
// // //         <p
// // //           className="text-center text-black text-[13px] font-medium mt-1"
// // //           style={{ fontFamily: "Cairo" }}
// // //         >
// // //           انسخ اسم المستخدم أو امسح الكود لتضيفني
// // //         </p>

// // //         {/* القسم السفلي - منزلاً للأسفل */}
// // //         <div className="text-white text-center flex flex-col items-center w-full mt-8">
// // //           <p
// // //             className="font-bold text-[20px] leading-[50px] w-[334px] h-[20px]"
// // //             style={{ fontFamily: "Cairo", color: "#FFFFFF" }}
// // //           >
// // //             انضم إلى في رحلي على بو شات
// // //           </p>
// // //           <p
// // //             className="text-[14px] leading-[20px] w-[210px] h-[20px] mt-[27px]"
// // //             style={{ fontFamily: "Cairo", color: "#FFFFFF" }}
// // //           >
// // //             ابحث عن بو شات في المتجر
// // //           </p>

// // //           <div className="flex gap-3 mt-[7px]">
// // //             <a
// // //               href="https://play.google.com/store/apps/details?id=com.pandaoracle.bochat&pcampaignid=web_share"
// // //               target="_blank"
// // //               rel="noopener noreferrer"
// // //               className="w-[90px] h-[30px] rounded-md overflow-hidden flex items-center justify-center"
// // //               style={{ backgroundColor: "#FFFFFF" }}
// // //             >
// // //               <img
// // //                 src="/imgs/google-play.svg"
// // //                 alt="Google Play"
// // //                 className="w-full h-full object-cover"
// // //               />
// // //             </a>
// // //             <a
// // //               href="https://apps.apple.com/us/app/bo-chat/id6749073096"
// // //               target="_blank"
// // //               rel="noopener noreferrer"
// // //               className="w-[90px] h-[30px] rounded-md overflow-hidden flex items-center justify-center"
// // //               style={{ backgroundColor: "#FFFFFF" }}
// // //             >
// // //               <img
// // //                 src="/imgs/apple.svg"
// // //                 alt="App Store"
// // //                 className="w-full h-full object-cover"
// // //               />
// // //             </a>
// // //           </div>
// // //         </div>

// // //         {/* الصورة السفلية */}
// // //         <img
// // //           src="/imgs/اكتب هنا ما تبحث عنه.svg"
// // //           alt="BO CHAT"
// // //           className="w-[200px] h-auto mt-2"
// // //         />
// // //       </div>

// // //       {/* ✅ الأزرار الثلاثة - خارج الـ div الرئيسي، أسفله */}
// // //       <div className="flex items-center justify-center gap-4 mt-4 z-50">
// // //         <button
// // //           onClick={handleCloseQR}
// // //           className="w-[60px] h-[60px] rounded-full bg-[#000000BF] border-2 border-[#FFFFFF26] shadow-sm hover:bg-[#000000]/90 transition-all flex items-center justify-center cursor-pointer"
// // //           aria-label="إغلاق الكيو آر"
// // //         >
// // //           <img
// // //             src="/icons/Vector (21).svg"
// // //             alt="QR"
// // //             className="w-[21px] h-[22px]"
// // //             style={{ filter: "brightness(0) invert(1)" }}
// // //           />
// // //         </button>

// // //         <button
// // //           // onClick={() => {
// // //           //   if (user._id) {
// // //           //     // handleBlock(user._id, user.name);
// // //           //     handleCloseQR();
// // //           //   }
// // //           // }}
// // //            onClick={downloadQRImage}
// // //           className="w-[60px] h-[60px] rounded-full bg-[#000000BF] border-2 border-[#FFFFFF26] shadow-sm hover:bg-[#000000]/90 transition-all flex items-center justify-center cursor-pointer"
// // //           aria-label="إزالة"
// // //         >
// // //           <img
// // //             src="/icons/Group 9307.svg"
// // //             alt="إزالة"
// // //             className="w-[21px] h-[22px]"
// // //             style={{ filter: "brightness(0) invert(1)" }}
// // //           />
// // //         </button>

// // //         <button
// // //           onClick={copyProfileLink}
// // //           className="w-[60px] h-[60px] rounded-full bg-[#000000BF] border-2 border-[#FFFFFF26] shadow-sm hover:bg-[#000000]/90 transition-all flex items-center justify-center cursor-pointer"
// // //           aria-label="مشاركة"
// // //         >
// // //           <img
// // //             src="/icons/Vector (20).svg"
// // //             alt="شير"
// // //             className="w-[21px] h-[22px]"
// // //             style={{ filter: "brightness(0) invert(1)" }}
// // //           />
// // //         </button>
// // //       </div>
// // //     </div>
// // //   </div>
// // // )}
// // // {/* ظظظظظظظظظظظ */}
// // //      {/* Overlay التقييم */}
// // //  {toast && (
// // //   <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[999999] w-auto max-w-[90%]">
// // //     <div className="bg-black text-white text-sm px-5 py-3 rounded-xl shadow-xl text-center">
// // //       {toast}
// // //     </div>
// // //   </div>
// // // )}
// // // {isRateOverlayOpen && (
// // //   <div role="dialog" aria-modal="true" className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
// // //     {/* الخلفية */}
// // //     <div onClick={() => setIsRateOverlayOpen(false)} className="absolute inset-0 bg-[#000]/10 backdrop-blur-[20px]" />

// // //     {/* الكارد */}
// // //     <div className="relative w-[690px] z-10 bg-gradient-to-l from-[#fff] to-[#8D8D8D] backdrop-blur-[20px] rounded-[25px] max-h-[90vh] flex flex-col">
      
// // //       {/* الرأس */}
// // //       <div className="bg-[#fff]/25 backdrop-blur-[20px] rounded-t-[25px] px-5 py-3 shrink-0">
// // //         <h3 className="text-[20px] font-semibold">التقييمات</h3>
// // //       </div>

// // //       {/* ✅ عرض قائمة التقييمات */}
// // //       {ratingsLoading ? (
// // //         <div className="h-[450px] flex items-center justify-center text-gray-500">
// // //           جاري تحميل التقييمات...
// // //         </div>
// // //       ) : ratings.length === 0 ? (
// // //         <div className="h-[450px] flex flex-col items-center justify-center px-5 text-center">
// // //           <img src="/icons/no-rate.svg" alt="no-rate" className="w-[65px] h-[65px] mb-3" />
// // //           <h4 className="text-[25px] font-semibold">مافيش تقييمات لسه</h4>
// // //           <p className="text-[16px]">ماحدش قيّم لسه خليك أنت أول واحد يكسر الصمت</p>
// // //         </div>
// // //       ) : (
// // //         <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 max-h-[400px]">
// // //           {ratings.map((rate) => (
// // //             <div 
// // //               key={rate._id} 
// // //               className="flex items-start gap-3 backdrop-blur-sm rounded-[25px] p-3 border-t border-x border-white/20 border-b-0"
// // //               style={{
// // //                 width: '663px',
// // //                 height: '139px',
// // //                 background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.2) 30%, rgba(102, 102, 102, 0) 100%)',
// // //                 opacity: 1,
// // //                 borderRadius: '25px',
// // //                 borderBottom: 'none',
// // //               }}
// // //             >
// // //               {/* ✅ الصورة - حجم 54x54 وزاوية 23px */}
// // //               <img 
// // //                 src={rate.userimg || "/imgs/user.png"} 
// // //                 className="w-[54px] h-[54px] rounded-[23px] object-cover shrink-0" 
// // //                 alt={rate.name} 
// // //                 style={{ borderRadius: '23px' }}
// // //               />
              
// // //               <div className="flex-1 min-w-0">
// // //                 {/* ✅ الصف العلوي: الاسم (يسار) + النجوم والنقاط (يمين) */}
// // //                 <div className="flex items-center justify-between flex-wrap gap-2">
// // //                   {/* ✅ الاسم فقط - أبيض, SemiBold, 15px */}
// // //                   <span 
// // //                     className="font-semibold text-[15px] leading-none"
// // //                     style={{ 
// // //                       color: '#FFFFFF',
// // //                       fontWeight: 600,
// // //                       fontSize: '15px',
// // //                       lineHeight: '100%',
// // //                     }}
// // //                   >
// // //                     {rate.name}
// // //                   </span>
                  
// // //                   {/* ✅ النجوم + أيقونة الخيارات */}
// // //                   <div className="flex items-center gap-1">
// // //                     {/* النجوم */}
// // //                     <div className="flex">
// // //                       {Array.from({ length: 5 }, (_, i) => (
// // //                         <span key={i} className="inline-block w-[25px] h-[25px]">
// // //                           {i < rate.stars ? (
// // //                             <img src="/imgs/Vector (9).svg" className="w-full h-full object-contain" alt="star-filled" />
// // //                           ) : (
// // //                             <img src="/imgs/Vector (11).svg" className="w-full h-full object-contain" alt="star-empty" />
// // //                           )}
// // //                         </span>
// // //                       ))}
// // //                     </div>

// // //                     {/* ✅ أيقونة الخيارات */}
// // //                     <div
// // //                       onClick={(e) => {
// // //                         e.stopPropagation();
// // //                         toggleMenu(rate._id, e);
// // //                       }}
// // //                       className="flex items-center justify-center cursor-pointer transition"
// // //                       style={{
// // //                         width: '48.93px',
// // //                         height: '34px',
// // //                         borderRadius: '15px',
// // //                         border: '1px solid #B4B4B9',
// // //                         background: '#B4B4B94D',
// // //                         opacity: 1,
// // //                       }}
// // //                     >
// // //                       <img
// // //                         src="/icons/options-white.svg"
// // //                         alt="options"
// // //                         style={{
// // //                           width: '4.16px',
// // //                           height: '16.5px',
// // //                           opacity: 1,
// // //                         }}
// // //                       />
// // //                     </div>
// // //                   </div>
// // //                 </div>

// // //                 {/* ✅ الصف الثاني: اسم المستخدم + التاريخ */}
// // //                 <div className="mt-1 flex items-center gap-2 flex-wrap">
// // //                   <span 
// // //                     className="text-[12px]"
// // //                     style={{ 
// // //                       color: '#000000',
// // //                       fontSize: '12px',
// // //                       lineHeight: '100%',
// // //                     }}
// // //                   >
// // //                     @{rate.username}
// // //                   </span>
                  
// // //                   <span 
// // //                     className="px-2 py-0.5 rounded text-[12px] font-semibold leading-none"
// // //                     style={{
// // //                       color: '#D72229',
// // //                       fontWeight: 600,
// // //                       fontSize: '12px',
// // //                       lineHeight: '100%',
// // //                       borderRadius: '4px',
// // //                     }}
// // //                   >
// // //                     {new Date(rate.createdAt).toLocaleDateString('ar-EG', {
// // //                       year: 'numeric',
// // //                       month: 'long',
// // //                       day: 'numeric',
// // //                     })}
// // //                   </span>
// // //                 </div>

// // //                 {/* ✅ التعليق */}
// // //                 <div className="mt-2">
// // //                   <p className="text-sm text-gray-700 break-words">
// // //                     {/* {rate.comment || '💬 لم يضف تعليقاً'} */}
// // //                     {rate.comment}
// // //                   </p>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       )}

// // //       {/* ✅ صندوق إضافة تقييم جديد */}
// // //       <div className="flex items-center gap-3 bg-[#fff]/50 backdrop-blur-xl px-5 h-[100px] rounded-b-[25px] shrink-0">
// // //         <div className="w-[42px] h-[42px] rounded-[25px] overflow-hidden shrink-0">
// // //           <img 
// // //             src={userData?.userpersonaldata?.img || "/imgs/user.png"} 
// // //             className="w-full h-full object-cover" 
// // //             alt="user" 
// // //           />
// // //         </div>
// // //         <div className="z-9 w-full flex rounded-[19px]" style={{ background: "#0000001A" }}>
// // //           <input 
// // //             placeholder="اكتب تقييمك هنا" 
// // //             className="flex-1 bg-transparent outline-none p-3" 
// // //           />
// // //           <button className="bg-white px-4 py-3 rounded-tl-[19px] rounded-b-[19px] text-[#D72229] font-semibold shrink-0 w-[135px] cursor-pointer">
// // //             تقييم
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </div>

// // //      {menuState.id && (
// // //       <div
// // //         className="fixed flex gap-2"
// // //         style={{
// // //           top: menuState.top,
// // //           left: menuState.left,
// // //           zIndex: 999999, 
// // //         }}
// // //         onClick={(e) => e.stopPropagation()}
// // //       >
      
        
// // //   <button
// // //   onClick={() => {
// // //     const userToBlock = ratings.find(r => r._id === menuState.id);

// // //     if (!userToBlock) {
// // //       setMenuState({ id: null, top: 0, left: 0 });
// // //       return;
// // //     }

// // //     handleBlock(userToBlock.ratinguserid, userToBlock.name);
// // //   }}
// // //   className="flex items-center justify-center transition hover:opacity-80 gap-2"
// // //   style={{
// // //     width: '110px',
// // //     height: '55px',
// // //     borderRadius: '18px',
// // //     background: '#D722294D',
// // //     backdropFilter: 'blur(5px)',
// // //     border: 'none',
// // //     opacity: 1,
// // //     cursor: 'pointer',
// // //   }}    
// // //       >
// // //   <div
// // //     style={{
// // //       width: '37.875px',
// // //       height: '37.875px',
// // //       opacity: 1,
// // //       background: '#FFFFFF',
// // //       display: 'flex',
// // //       alignItems: 'center',
// // //       justifyContent: 'center',
// // //       borderRadius: '50%',
// // //     }}
// // //   >
// // //     <img
// // //       src="/imgs/Frame.svg"
// // //       alt="flag"
// // //       style={{
// // //         width: '13.47px',
// // //         height: '13.47px',
// // //         opacity: 1,
// // //       }}
// // //     />
// // //   </div>
// // //           <span
// // //             style={{
// // //               color: '#FFFFFF',
// // //               fontWeight: 600,
// // //               fontSize: '15px',
// // //               lineHeight: '100%',
// // //               fontFamily: 'Cairo',
// // //             }}
// // //           >
// // //             حذف
// // //           </span>
// // //         </button>
        

// // //           {/* زر ابلاغ */}
// // //       <button
// // //  onClick={() => {
// // //     const userToReport = ratings.find(r => r._id === menuState.id);
// // //     if (userToReport) {
// // //       handleReportUser(userToReport.ratinguserid, userToReport.name);
// // //     } else {
// // //       setMenuState({ id: null, top: 0, left: 0 });
// // //     }
// // //   }}
// // //   className="flex items-center justify-center transition hover:opacity-80 gap-2" 
// // //   style={{
// // //     width: '110px',
// // //     height: '55px',
// // //     borderRadius: '18px',
// // //     background: '#D722294D',
// // //     backdropFilter: 'blur(5px)',
// // //     border: 'none',
// // //     opacity: 1,
// // //     cursor: 'pointer',
// // //   }}
// // // >
// // //   <div
// // //     style={{
// // //       width: '37.875px',
// // //       height: '37.875px',
// // //       opacity: 1,
// // //       background: '#FFFFFF',
// // //       display: 'flex',
// // //       alignItems: 'center',
// // //       justifyContent: 'center',
// // //       borderRadius: '50%',
// // //     }}
// // //   >
// // //     <img
// // //       src="/imgs/ic_flag_24px.svg"
// // //       alt="flag"
// // //       style={{
// // //         width: '13.47px',
// // //         height: '13.47px',
// // //         opacity: 1,
// // //       }}
// // //     />
// // //   </div>

// // //   <span
// // //     style={{
// // //       color: '#FFFFFF',
// // //       fontWeight: 600,
// // //       fontSize: '15px',
// // //       lineHeight: '100%',
// // //       fontFamily: 'Cairo',
// // //     }}
// // //   >
// // //     ابلاغ
// // //   </span>
// // // </button>

// // //       </div>
// // //     )}
// // //   </div>
// // // )}
 
// // //     </div>
// // //   );
// // //  }

// // // ظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظ

// // /* eslint-disable jsx-a11y/alt-text */
// // /* eslint-disable @next/next/no-img-element */
// // "use client";
// // import React, { useEffect, useState, useCallback ,useRef} from "react";

// // import Image from "next/image";
// // import { useParams } from "next/navigation";
// // import PostsFeed from "@/app/_components/PostsFeed";
// // import ActionAreaClient from "../_components/ActionAreaClient";
// // import FollowersMenu from "../_components/followersMenu";
// // import ClientVisibilityGate from "../_components/ProfileGateClient";
// // import { UserAPIResponse } from "@/types/types";
// // import GlobalLoader from "@/components/GlobalLoader";
// // import StyledQRCode from "@/app/_components/StyledQRCode";
// // import Link from "next/link";
// // import html2canvas from 'html2canvas';
// // import domtoimage from 'dom-to-image-more';


// // function safeCount<T>(val?: T[] | Record<string, unknown> | number | null) {
// //   if (val == null) return 0;
// //   if (typeof val === "number") return val;
// //   if (Array.isArray(val)) return val.length;
// //   if (typeof val === "object") return Object.keys(val).length;
// //   return 0;
// // }

// // export default function ProfilePageClient() {
// //   const params = useParams();
// //   const id = params && typeof params === "object" ? (params as any).id : undefined;
    
// // //Rating
// // const [stars, setStars] = useState<number>(5);
// // const [commentText, setCommentText] = useState<string>('');
// // const [ratingLoading, setRatingLoading] = useState<boolean>(false);

// // //
// // const [aboutExpanded, setAboutExpanded] = useState(false);
// //   const [data, setData] = useState<UserAPIResponse | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [isRateOverlayOpen, setIsRateOverlayOpen] = useState(false);
// //   const [userData, setUserData] = useState<any>(null);

// //   const [isOverlayOpen, setIsOverlayOpen] = useState(false);
// //   const [toast, setToast] = useState<string | null>(null);

// //   const closeOverlay = useCallback(() => setIsOverlayOpen(false), []);
// //   const openOverlay = useCallback(() => setIsOverlayOpen(true), []);
// // //  const [posts, setPosts] = useState<any[]>([]);
// //   // const profileUserId = params?.id as string | undefined;
// //   const [postsCount, setPostsCount] = useState<number | null>(null);

// //  const [ratings, setRatings] = useState<any[]>([]);
// // const [ratingsLoading, setRatingsLoading] = useState(false);

// // // ظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظ
// // // QR Overlay
// // const [showQROverlay, setShowQROverlay] = useState(false);
// // const [isClient, setIsClient] = useState(false);
// // const [profileUrl, setProfileUrl] = useState("");

// // // فتح وإغلاق QR
// // const handleOpenQR = () => setShowQROverlay(true);
// // const handleCloseQR = () => setShowQROverlay(false);
// // const qrCardRef = useRef<HTMLDivElement>(null);

// // // تعيين الرابط بعد التحميل (لتجنب Hydration mismatch)
 
// // // تعريف الدالة المساعدة (داخل المكون)
// // const preloadImages = () => {
// //   const images = qrCardRef.current?.querySelectorAll('img');
// //   if (!images) return Promise.resolve();
// //   return Promise.all(
// //     Array.from(images).map(
// //       (img) =>
// //         new Promise((resolve) => {
// //           if (img.complete) resolve();
// //           img.onload = resolve;
// //           img.onerror = resolve;
// //         })
// //     )
// //   );
// // };

// // // دالة التنزيل (مع await بالداخل)
// // const downloadQRImage = async () => {
// //   if (!qrCardRef.current) {
// //     setToast('⚠️ البطاقة غير جاهزة');
// //     setTimeout(() => setToast(null), 3000);
// //     return;
// //   }

// //   try {
// //     // ⏳ انتظر تحميل الصور
// //     await preloadImages();

// //     // 🖼️ التقط الصورة
// //     const dataUrl = await domtoimage.toPng(qrCardRef.current, {
// //       scale: 2,
// //       bgColor: '#ffffff',
// //       quality: 1,
// //       useCORS: true,
// //       cacheBust: true,
// //       filter: (node) => {
// //         return node && node.nodeType !== undefined;
// //       },
// //     });

// //     const link = document.createElement('a');
// //     link.download = `qr-${user.username || 'user'}.png`;
// //     link.href = dataUrl;
// //     document.body.appendChild(link);
// //     link.click();
// //     document.body.removeChild(link);

// //     setToast('✅ تم تنزيل البطاقة بنجاح');
// //     setTimeout(() => setToast(null), 2000);
// //     handleCloseQR();
// //   } catch (error: any) {
// //     console.error('❌ فشل التنزيل:', error);
// //     setToast(`❌ فشل التنزيل: ${error.message || 'خطأ غير معروف'}`);
// //     setTimeout(() => setToast(null), 4000);
// //   }
// // };
// // // useEffect(() => {
// // //   setIsClient(true);
// // //   if (typeof window !== "undefined") {
// // //     setProfileUrl(`${window.location.origin}/profile/${id}`);
// // //   }
// // // }, [id]);
 
// // useEffect(() => {
// //   setIsClient(true);
// //   if (typeof window !== "undefined") {
// //     const baseUrl = process.env.NEXT_PUBLIC_FRONT_URL || window.location.origin;
// //     const url = `${baseUrl}/profile/${id}`;
// //     console.log('🔗 QR Profile URL:', url); // ✅ أضف هذا السطر
// //     setProfileUrl(url);
// //   }
// // }, [id]);

// // // ظظظظظظظظظظظظظظظظظظظظظظظظظ
// // const [menuState, setMenuState] = useState<{
// //   id: string | null;
// //   top: number;
// //   left: number;
// // }>({
// //   id: null,
// //   top: 0,
// //   left: 0,
// // });
// // const [toastMessage, setToastMessage] = useState<string | null>(null);
// // const [toastType, setToastType] = useState<'success' | 'error'>('success');

// // const showToast = (message: string, type: 'success' | 'error' = 'success') => {
// //   setToastMessage(message);
// //   setToastType(type);
// //   setTimeout(() => setToastMessage(null), 3000);
// // };
// // const toggleMenu = (rateId: string, e: React.MouseEvent) => {
// //   const rect = e.currentTarget.getBoundingClientRect();
// //   console.log('🔔 toggleMenu called for', rateId, 'rect:', rect); 
// //   setMenuState({
// //     id: menuState.id === rateId ? null : rateId,
// //     top: rect.bottom + 10, 
// //     left: rect.left, 
// //   });
// // };
 
// // const handleBlock = async (userIdToBlock: string, userName: string) => {
// //   try {
// //     const token = getAccessToken();
// //     if (!token) {
// //       setToast('يجب تسجيل الدخول أولاً');
// //       setTimeout(() => setToast(null), 3000);
// //       return;
// //     }

// //     let myUserId = "";
// //     try {
// //       const raw = localStorage.getItem("userData");
// //       if (raw) {
// //         const parsed = JSON.parse(raw);
// //         myUserId = parsed._id;
// //       }
// //     } catch (e) {
// //       console.error("Error getting myUserId:", e);
// //     }

// //     if (!myUserId) {
// //       setToast('لم يتم العثور على معرف المستخدم');
// //       setTimeout(() => setToast(null), 3000);
// //       return;
// //     }

// //     const res = await fetch(`https://bo-chat.space/block${myUserId}`, {
// //       method: 'POST',
// //       headers: {
// //         'Authorization': `Bearer ${token}`,
// //         'Content-Type': 'application/json',
// //       },
// //       body: JSON.stringify({ blockedid: userIdToBlock }),
// //     });

// //     const responseText = await res.text();
 
// //     if (!res.ok) {
// //       throw new Error(responseText || `HTTP ${res.status}`);
// //     }

// //     setToast(`✅ تم حظر ${userName} بنجاح`);
// //     setTimeout(() => setToast(null), 3000);
// //     setMenuState({ id: null, top: 90, left: 0 });

// //   } catch (error) {
// //     console.error('Block error:', error);
// //     setToast('❌ حدث خطأ أثناء محاولة الحظر');
// //     setTimeout(() => setToast(null), 3000);
// //     setMenuState({ id: null, top: 0, left: 0 });
// //   }
// // };
// // //   handleReportUser
// // const handleReportUser = async (userIdToReport: string, userName: string) => {
// //   const token = getAccessToken();
// //   let myUserId = "";
// //   try {
// //     const raw = localStorage.getItem("userData");
// //     if (raw) {
// //       const parsed = JSON.parse(raw);
// //       myUserId = parsed._id;
// //     }
// //   } catch (e) {
// //     console.error("Error getting myUserId:", e);
// //   }

// //   if (!token || !myUserId) {
// //     setToast('يجب تسجيل الدخول أولاً');
// //     setTimeout(() => setToast(null), 3000);
// //     return;
// //   }

// //   try {
// //     const res = await fetch(`https://bo-chat.space/report${myUserId}`, {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //         Authorization: `Bearer ${token}`,
// //       },
// //       body: JSON.stringify({
// //         userid: userIdToReport, 
// //         email: "",
// //       }),
// //     });
// //     const text = await res.text();
// //     if (!res.ok) throw new Error(text || "فشل إرسال البلاغ");
// //     setToast(`✅ تم الإبلاغ عن ${userName} بنجاح`);
// //     setTimeout(() => setToast(null), 3000);
// //     setMenuState({ id: null, top: 0, left: 0 });
// //   } catch (err) {
// //     console.error("REPORT ERROR:", err);
// //     setToast('❌ حدث خطأ أثناء إرسال البلاغ');
// //     setTimeout(() => setToast(null), 3000);
// //     setMenuState({ id: null, top: 0, left: 0 });
// //   }
// // };

// // // دالة تقييم المستخدم
// // const handleRateUser = async () => {
// //   const token = getAccessToken();
// //   let myUserId = "";
// //   try {
// //     const raw = localStorage.getItem("userData");
// //     if (raw) {
// //       const parsed = JSON.parse(raw);
// //       myUserId = parsed._id;
// //     }
// //   } catch (e) {
// //     console.error("Error getting myUserId:", e);
// //   }

// //   if (!token || !myUserId) {
// //     setToast('يجب تسجيل الدخول أولاً');
// //     setTimeout(() => setToast(null), 3000);
// //     return;
// //   }

// //   if (!id) {
// //     setToast('معرّف المستخدم غير موجود');
// //     setTimeout(() => setToast(null), 3000);
// //     return;
// //   }

// //   setRatingLoading(true);
// //   try {
// //     const res = await fetch(`https://bo-chat.space/rate`, {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //         Authorization: `Bearer ${token}`,
// //       },
// //       body: JSON.stringify({
// //         stars: stars,
// //         comment: commentText || "",
// //         rateduserid: id,
// //         ratinguserid: myUserId, 
// //       }),
// //     });
// //     const text = await res.text();
// //     if (!res.ok) throw new Error(text || "فشل التقييم");
// //     setToast(`✅ تم تقييم المستخدم بنجاح`);
// //     setTimeout(() => setToast(null), 3000);
// //     setCommentText('');
// //     setStars(5);
// //      fetchRatings();
// //   } catch (err) {
// //     console.error("RATE ERROR:", err);
// //     setToast('❌ حدث خطأ أثناء التقييم');
// //     setTimeout(() => setToast(null), 3000);
// //   } finally {
// //     setRatingLoading(false);
// //   }
// // };
// // // /////////////////////////////
// // useEffect(() => {
// //    if (!data?.userpersonaldata?._id) return;

// //   const fetchPostsCount = async () => {
// //     try {
// //       const token = localStorage.getItem("accessToken") || "";
// //       const userId = data.userpersonaldata._id; 
// //        const url = `https://bo-chat.space/myposts/${userId}?guestid=${userId}&page=1&limit=1000`;

// //       const response = await fetch(url, {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //           'Content-Type': 'application/json',
// //         },
// //       });

// //       if (!response.ok) throw new Error(`HTTP ${response.status}`);

// //       const posts = await response.json();

// //       if (Array.isArray(posts)) {
// //          const count = posts.length;
// //         if (count === 1000) {
// //            setPostsCount(1000); 
// //          } else {
// //           setPostsCount(count);
// //         }
// //       } else {
// //         console.warn("Unexpected response format", posts);
// //         setPostsCount(0);
// //       }
// //     } catch (error) {
// //       console.error("Error fetching posts count:", error);
// //       setPostsCount(0);
// //     }
// //   };

// //   fetchPostsCount();
// // }, [data?.userpersonaldata?._id]); 
// //   // 
// //   const copyProfileLink = useCallback(async () => {
// //     if (!id) {
// //       setToast("معرّف المستخدم غير موجود.");
// //       setTimeout(() => setToast(null), 1800);
// //       return;
// //     }
// //     const origin = typeof window !== "undefined" && window.location?.origin ? window.location.origin : "https://localhost:3000";
// //     const profileUrl = `${origin}/profile/${id}`;
// //     try {
// //       if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
// //         await navigator.clipboard.writeText(profileUrl);
// //       } else {
// //         const ta = document.createElement("textarea");
// //         ta.value = profileUrl;
// //         ta.style.position = "fixed";
// //         ta.style.left = "-9999px";
// //         document.body.appendChild(ta);
// //         ta.select();
// //         document.execCommand("copy");
// //         document.body.removeChild(ta);
// //       }
// //       setToast("تم نسخ الرابط إلى الحافظة");
// //       setTimeout(() => setToast(null), 1800);
// //     } catch (err) {
// //       console.error("copy error", err);
// //       setToast("فشل النسخ");
// //       setTimeout(() => setToast(null), 1800);
// //     }
// //   }, [id]);

// //    const getAccessToken = useCallback(() => {
// //     return localStorage.getItem("accessToken") || process.env.NEXT_PUBLIC_ACTIVE_USERS_TOKEN || "";
// //   }, []);

// //    useEffect(() => {
// //     if (!id) {
// //       setError("معرّف الملف الشخصي مفقود من الـ URL.");
// //       setLoading(false);
// //       return;
// //     }
// //     const ac = new AbortController();
// //     let mounted = true;

// //     async function fetchUser() {
// //       setLoading(true);
// //       setError(null);
// //       const token = getAccessToken();
// //       if (!token) {
// //         if (mounted) setError("لم يتم العثور على توكن الدخول. يرجى تسجيل الدخول مرة أخرى.");
// //         setLoading(false);
// //         return;
// //       }
// //       try {
// //         const res = await fetch(`https://bo-chat.space/users/${id}`, {
// //           headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
// //           signal: ac.signal,
// //         });
// //         if (!res.ok) {
// //           if (res.status === 401 || res.status === 403) {
// //             throw new Error("جلسة غير صالحة. يرجى تسجيل الدخول مجدداً.");
// //           }
// //           throw new Error(`HTTP ${res.status}`);
// //         }
// //         const json = (await res.json()) as UserAPIResponse;
// //         if (mounted) {
// //           setData(json);
// //           console.log("User data fetched:", json);
// //         }
// //       } catch (err: any) {
// //         if (err?.name === "AbortError") return;
// //         console.error("fetchUser error:", err);
// //         if (mounted) setError(err.message || "حدث خطأ أثناء جلب بيانات المستخدم.");
// //       } finally {
// //         if (mounted) setLoading(false);
// //       }
// //     }

// //     fetchUser();
// //     return () => {
// //       mounted = false;
// //       ac.abort();
// //     };
// //   }, [id, getAccessToken]);

// //    const fetchCurrentUserData = useCallback(async () => {
// //     try {
// //       const token = getAccessToken();
// //       const userDataStr = localStorage.getItem("userData");
// //       if (!userDataStr) return;
// //       const parsed = JSON.parse(userDataStr);
// //       const currentUserId = parsed._id;
// //       if (!currentUserId) return;
// //       const res = await fetch(`https://bo-chat.space/users/${currentUserId}`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       if (!res.ok) throw new Error("Failed to fetch current user data");
// //       const data = await res.json();
// //       setUserData(data);
// //     } catch (err) {
// //       console.error("FETCH CURRENT USER ERROR:", err);
// //     }
// //   }, [getAccessToken]);

// //   useEffect(() => {
// //     if (id) {
// //       fetchCurrentUserData();
// //     }
// //   }, [id, fetchCurrentUserData]);

// //   useEffect(() => {
// //     function onKey(e: KeyboardEvent) {
// //       if (e.key === "Escape") closeOverlay();
// //     }
// //     if (isOverlayOpen) window.addEventListener("keydown", onKey);
// //     return () => window.removeEventListener("keydown", onKey);
// //   }, [isOverlayOpen, closeOverlay]);


// //    // أضف useCallback لجلب التقييمات
// // const fetchRatings = useCallback(async () => {
// //   if (!id) return;
// //   const token = getAccessToken();
// //   let guestId = "";
// //   try {
// //     const raw = localStorage.getItem("userData");
// //     if (raw) {
// //       const parsed = JSON.parse(raw);
// //       guestId = parsed._id;
// //     }
// //   } catch (e) {}
// //   if (!guestId || !token) {
// //     setRatings([]);
// //     return;
// //   }
// //   setRatingsLoading(true);
// //    try {
// //     const res = await fetch(`https://bo-chat.space/rate/${id}?guestid=${guestId}`, {
// //       headers: { Authorization: `Bearer ${token}` },
// //     });
// //     if (!res.ok) throw new Error(`HTTP ${res.status}`);
// //     const data = await res.json();
// //     if (Array.isArray(data)) {
// //       setRatings(data);
// //     } else {
// //       setRatings([]);
// //     }
// //   } catch (error) {
// //     console.error("Error fetching ratings:", error);
// //     setRatings([]);
// //   } finally {
// //     setRatingsLoading(false);
// //   }
// // }, [id, getAccessToken]);
// // // useEffect لتشغيل الجلب عند فتح الـ overlay
// // useEffect(() => {
// //   if (isRateOverlayOpen) {
// //     fetchRatings();
// //   }
// // }, [isRateOverlayOpen, fetchRatings]);
// //    if (loading) {
// //     return (
// //       <div dir="rtl" className="min-h-screen flex items-center justify-center p-8">
// //         <GlobalLoader />
// //       </div>
// //     );
// //   }

// //   if (error || !data || !data.userpersonaldata) {
// //     return (
// //       <div dir="rtl" className="min-h-screen flex items-center justify-center p-8">
// //         <div className="text-center text-red-600">{error ?? "المستخدم غير موجود أو حدث خطأ."}</div>
// //       </div>
// //     );
// //   }

// //   const res = data;
// //   const user: any = res.userpersonaldata;
// //   const followers = Array.isArray(res.followers) ? res.followers : [];
// //   const following = Array.isArray(res.following) ? res.following : [];

// //   const followerIds: string[] = followers
// //     .map((f: any) =>
// //       typeof f === "string"
// //         ? f
// //         : f.followerid ?? f.followerId ?? f._id ?? (f.followerdata && f.followerdata._id) ?? ""
// //     )
// //     .filter(Boolean);

// //   const avatar = user.img || "/imgs/default-avatar.png";
// //    const followersCount = followers.length;
// //   const followingCount = following.length;
// //   const viewsCount = user.visit ?? 0;
// //   const rateCount = user.rate ?? 0;
  
// //   return (
// //     <div className="min-h-screen bg-white text-gray-800" dir="rtl">
// //       <div className="px-5 py-1">
// //         <h1 className="text-xl font-semibold">{user.name}</h1>
// //         {/* {user.private ? (
// //           <p className="text-xs text-gray-500">درج خاص</p>
// //         ) : res.posts?.length === 0 ? (
// //           <p className="text-xs text-gray-500">لا يوجد فضفضات</p>
// //         ) : (
// //           <div className="text-xs text-gray-500">{postsCount} فضفضه</div>
// //         )} */}

// //        {/* 4. عرض العدد أو رسالة "لا يوجد" بناءً على state postsCount */}
// //       {user.private ? (
// //   <p className="text-xs text-gray-500">درج خاص</p>
// // ) : postsCount === null ? (
// //   <div className="text-xs text-gray-500 animate-pulse">جارى التحميل </div>
// // ) : postsCount === 0 ? (
// //   <p className="text-xs text-gray-500">لا يوجد فضفضات</p>
// // ) : (
// //   <div className="text-xs text-gray-500">
// //     {postsCount === 1000 ? "1000+ فضفضة" : `${postsCount} فضفضة`}
// //   </div>
// // )}
// //       </div>
// //       <div className="min-h-screen overflow-hidden">
// //         <div className="relative overflow-y-auto h-[calc(100vh-100px)] scrollbar-hidden">
// //           {/* Banner */}
// //           <div className="relative">
// //             <div className="h-[167px] w-full" style={{ background: "linear-gradient(90deg,#fff0f0,#e65b5b 25%,#d23e3e 70%,#c62828)" }}>
// //               <div className="flex px-4 w-full items-end h-full flex-row gap-3">
// //                 <ClientVisibilityGate
// //                   profileId={res.userpersonaldata._id}
// //                   profilePrivate={res.userpersonaldata.private}
// //                   fallback={
// //                     <div>
// //                       <div className="relative w-28 h-28 md:w-36 md:h-36 z-[99] transform translate-y-1/2">
// //                         <div className="relative w-full h-full rounded-t-[60px] rounded-b-[45px] border-2 border-white overflow-hidden">
// //                           <Image
// //                             src={avatar}
// //                             alt={user.name ?? "Avatar"}
// //                             width={140}
// //                             height={136}
// //                             unoptimized
// //                             className="object-cover w-full h-full"
// //                           />
// //                           <div className="absolute bottom-0 left-0 w-full h-[42%] backdrop-blur-md flex items-center justify-center text-white bg-gradient-to-b from-[#D72229]/15 to-[#F92428]/50 z-10">
// //                             <p>درج خاص</p>
// //                           </div>
// //                          </div>
// //                         {user.vip && (
// //                           <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
// //                             <img src="/icons/vip.svg" alt="VIP" className="w-6 h-6 md:w-8 md:h-8" />
// //                           </div>
// //                         )}
// //                       </div>
// //                     </div>
// //                   }
// //                 >
// //                   <button
// //                     aria-label="عرض الصورة"
// //                     onClick={openOverlay}
// //                     className="relative w-[136px] h-[136px] md:w-36 md:h-36 rounded-[60px] border-2 border-white overflow-hidden bg-gray-100 transform translate-y-1/2 focus:outline-none z-[99]"
// //                   >
// //                     <Image src={avatar} alt={user.name ?? "Avatar"} width={150} height={150} unoptimized className="object-cover cursor-pointer w-full h-full" />
// //                   </button>
// //                 </ClientVisibilityGate>

// //                 <div className="mb-2">
// //                 <h1 className="text-xl md:text-2xl font-semibold text-white leading-tight">
// //                   {user.name}
// //                 </h1>

// //                 {user.username && (
// //                   <p className="text-sm text-white/90 mt-[1px] leading-none">
// //                     @{user.username}
// //                   </p>
// //                 )}
// //               </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Main */}
// //           <div className="relative">
// //             <div className="md:px-5 py-3 border-b border-[#F6F6f6]">
// //               <div className="flex flex-col gap-6">
// //                 <div className="flex-1 text-right">
// //                   <div className="mr-[150px] flex justify-between">
// //                     {/* <p className="text-sm text-[#B6B7B7] max-w-[280px]">{user.about || "أنا هنا لأتواصل وأكتشف عوالم جديدة مع أشخاص يشبهونني"}</p> */}
// //                    <p
// //                   className="text-sm text-[#B6B7B7] max-w-[280px] h-[50px] cursor-pointer select-none"
// //                   onClick={() => setAboutExpanded(!aboutExpanded)}
// //                 >
// //                   {(() => {
// //                     const text = user.about || "أنا هنا لأتواصل وأكتشف عوالم جديدة مع أشخاص يشبهونني";
// //                     const words = text.split(' ');
// //                     if (words.length > 7) {
// //                       return aboutExpanded ? text : words.slice(0, 7).join(' ') + '...';
// //                     }
// //                     return text;
// //                   })()}
// //                 </p>
// //                     <div className="flex gap-1">
// //                       {id ? <ActionAreaClient followingId={id} serverFollowerIds={followerIds} receiverId={user._id} username={user.name} /> : null}
// //                     </div>
// //                   </div>

// //                   <div className="mt-7">
// //                     <div onClick={() => setIsRateOverlayOpen(true)} className="cursor-pointer select-none">
// //                       {rateCount === 0 ? (
// //                         <p className="text-sm underline text-[#D72229]  text-[15px]">لم يحصل هذا الدرج علي اي تقييم</p>
// //                       ) : (
// //                         <div className="m-0 text-sm font-semibold underline text-[#D72229]">
// //                           <span className="text-xs">حصل هذا الدرج علي</span> تقييم {Number(rateCount.toFixed(2))} نجوم
// //                         </div>
// //                       )}
// //                     </div>

// //                     <div className="flex gap-4 mt-1 text-[15px]">
// //                       <div className="flex gap-1 items-center justify-center"><div className="text-sm text-[#B6B7B7]"> صاحبي هنا</div><div className="text-md font-semibold">{followersCount}</div></div>
// //                       <div className="flex gap-1 items-center justify-center"><h3 className="text-sm font-semibold text-[#B6B7B7]">متابعين</h3><div className="text-md font-semibold">{followingCount}</div></div>
// //                       <div className="flex gap-1 items-center justify-center"><div className="text-sm text-[#B6B7B7]">مشاهدة</div><div className="text-md font-semibold">{viewsCount}</div></div>
// //                     </div>

// //                     <ClientVisibilityGate profileId={res.userpersonaldata._id} profilePrivate={res.userpersonaldata.private}  >
// //                       <FollowersMenu followers={res.followers ?? []} title="اطلع الان علي جميع المتابعين" limit={3} />
// //                     </ClientVisibilityGate>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             <ClientVisibilityGate profileId={res.userpersonaldata._id} isPrivate={res.userpersonaldata.private} profilePrivate={res.userpersonaldata.private} fallback={<div className="flex items-center justify-center flex-col text-center pt-3"><h3 className="text-xl">درج خاص</h3><p className="text-[#B6B7B7] max-w-[350px]">مرحبا هذا الدرج خاص الآن فقط من اقبل متابعتهم يمكنهم رؤية فضفضاتي</p></div>}>
// //               <PostsFeed />
// //             </ClientVisibilityGate>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Overlay الصورة */}
// //       {/* {isOverlayOpen && (
// //         <div role="dialog" aria-modal="true" className="fixed w-full h-full inset-0 z-50 flex items-center justify-center z-[9999] p-4">
// //           <div onClick={closeOverlay} className="absolute inset-0 bg-black/95" />
// //           <div className="relative z-60 max-w-[720px] w-full max-h-[90vh] rounded-2xl">
// //             <div className="w-full flex justify-center items-center p-6">
// //               <Image src={avatar} alt={user.name ?? "Avatar"} width={600} height={600} unoptimized className="object-contain w-[500px] h-[500px] rounded-[170px]" />
// //             </div>
// //             <button onClick={copyProfileLink} className="w-[200px] text-center py-3 cursor-pointer bg-white absolute bottom-[-70px] left-1/2 transform -translate-x-1/2 rounded-[17px] shadow-sm text-sm hover:bg-gray-50" aria-label="نسخ رابط الملف الشخصي">
// //               شير الدرج
// //             </button>
// //             <button onClick={closeOverlay} aria-label="إغلاق" className="px-3 py-3 cursor-pointer absolute top-[-30px] left-1/2 transform -translate-x-1/2 rounded-full shadow-sm bg-[#FFFFFF]/15">
// //               <img src="/icons/close.svg" alt="close" />
// //             </button>
// //           </div>
// //         </div>
// //       )} */}
// //       {/* Overlay الصورة */}
// // {isOverlayOpen && (
// //   <div role="dialog" aria-modal="true" className="fixed w-full h-full inset-0 z-50 flex items-center justify-center z-[9999] p-4">
// //     <div onClick={closeOverlay} className="absolute inset-0 bg-black/95" />
// //     <div className="relative z-60 max-w-[720px] w-full max-h-[90vh] rounded-2xl">
// //       <div className="w-full flex justify-center items-center p-6">
// //         <Image 
// //           src={avatar} 
// //           alt={user.name ?? "Avatar"} 
// //           width={600} 
// //           height={600} 
// //           unoptimized 
// //           className="object-contain w-[500px] h-[500px] rounded-[170px]" 
// //         />
// //       </div>
      
// //       {/* ✅ ثلاث أزرار بالتصميم الجديد */}
// //       <div className="flex items-center justify-center gap-4 absolute bottom-[-70px] left-1/2 transform -translate-x-1/2">
// //         {/* الزر الثالث: إجراء آخر */}
// //         <button 
// //            onClick={handleOpenQR}   // ✅ تم إضافة الدالة         
// //             className="w-[60px] h-[60px] rounded-full bg-[#000000BF] border-2 border-[#FFFFFF26] shadow-sm hover:bg-[#000000]/90 transition-all flex items-center justify-center cursor-pointer"
// //           aria-label="إجراء"
// //         >
// //           <img 
// //             src="/icons/Vector (21).svg" 
// //             alt="إجراء" 
// //             className="w-[21px] h-[22px]" 
// //             style={{ filter: "brightness(0) invert(1)" }}
// //           />
// //         </button>

// //           {/* الزر الثاني: إزالة (نمزيل) */}
// //         {/* <button 
// //           // onClick={handleRemove} 
// //           className="w-[60px] h-[60px] rounded-full bg-[#000000BF] border-2 border-[#FFFFFF26] shadow-sm hover:bg-[#000000]/90 transition-all flex items-center justify-center cursor-pointer"
// //           aria-label="إزالة"
// //         >
// //           <img 
// //             src="/icons/Group 9307.svg" 
// //             alt="إزالة" 
// //             className="w-[21px] h-[22px]" 
// //             style={{ filter: "brightness(0) invert(1)" }}
// //           />
// //         </button> */}

// // <button
// //   onClick={downloadQRImage}   // ✅ استدعاء الدالة الجديدة
// //   className="w-[60px] h-[60px] rounded-full bg-[#000000BF] border-2 border-[#FFFFFF26] shadow-sm hover:bg-[#000000]/90 transition-all flex items-center justify-center cursor-pointer"
// //   aria-label="تنزيل البطاقة"
// // >
// //   <img
// //     src="/icons/Group 9307.svg"
// //     alt="تنزيل"
// //     className="w-[21px] h-[22px]"
// //     style={{ filter: "brightness(0) invert(1)" }}
// //   />
// // </button>

// //           {/* الزر الأول: شير (نسخ الرابط) */}
// //         <button 
// //           onClick={copyProfileLink} 
// //           className="w-[60px] h-[60px] rounded-full bg-[#000000BF] border-2 border-[#FFFFFF26] shadow-sm hover:bg-[#000000]/90 transition-all flex items-center justify-center cursor-pointer"
// //           aria-label="مشاركة"
// //         >
// //           <img 
// //             src="/icons/Vector (20).svg" 
// //             alt="شير" 
// //             className="w-[21px] h-[22px]" 
// //             style={{ filter: "brightness(0) invert(1)" }}
// //           />
// //         </button>
// //       </div>

// //       {/* زر الإغلاق */}
// //       <button 
// //         onClick={closeOverlay} 
// //         aria-label="إغلاق" 
// //         className="px-3 py-3 cursor-pointer absolute top-[-30px] left-1/2 transform -translate-x-1/2 rounded-full shadow-sm bg-[#FFFFFF]/15 hover:bg-[#FFFFFF]/30 transition"
// //       >
// //         <img src="/icons/close.svg" alt="close" />
// //       </button>
// //     </div>
// //   </div>
// // )}
// // {/* ///////////////////////////////////////////  */}
// // {showQROverlay && (
// //   <div
// //     className="fixed inset-0 bg-black flex items-center justify-center z-[99999]"
// //     onClick={handleCloseQR}
// //   >
// //     <div className="relative flex flex-col items-center">
// //       <div
// //           ref={qrCardRef}
// //         className="relative flex flex-col items-center gap-2 py-6 px-5 rounded-[35px] shadow-2xl"
// //         style={{
// //           width: '411px',
// //           height: '550px',
// //           maxWidth: '95vw',
// //           maxHeight: '90vh',
// //           marginTop: '20px',
// //           backgroundImage: "url('/imgs/Group 9318.svg')",
// //           backgroundSize: 'cover',
// //           backgroundPosition: 'center',
// //           backgroundRepeat: 'no-repeat',
// //         }}
// //         dir="rtl"
// //         onClick={(e) => e.stopPropagation()}
// //       >
// //         {/* زر الإغلاق */}
// //         <button
// //           onClick={handleCloseQR}
// //           aria-label="إغلاق"
// //           className="px-3 py-3 cursor-pointer absolute top-[-50px] left-1/2 transform -translate-x-1/2 rounded-full shadow-sm bg-[#FFFFFF]/15 hover:bg-[#FFFFFF]/30 transition z-50"
// //         >
// //           <img src="/icons/close.svg" alt="close" />
// //         </button>

// //         {/* الشعار */}
// //         <Link href="/" className="flex justify-center">
// //           <img
// //             src="/logo-red.png"
// //             alt="BO CHAT"
// //             className="w-[40px] h-auto brightness-0 invert"
// //           />
// //         </Link>

// //         {/* بطاقة QR - ثابتة الأبعاد */}
// //         <div className="w-[209px] h-[250px] bg-white rounded-[18px] overflow-hidden shadow-lg flex-shrink-0">
// //           {/* اسم المستخدم */}
// //           <div
// //             className="h-[41px] bg-[#FCE9E9] flex items-center justify-center gap-0 cursor-pointer hover:opacity-70 transition"
// //             onClick={() => {
// //               const username = user.username || user.name;
// //               navigator.clipboard.writeText(username);
// //               setToast(` تم نسخ    : ${username}`);
// //               setTimeout(() => setToast(null), 2000);
// //             }}
// //           >
// //             <span
// //               className="text-[#D72229] font-bold text-[18px] leading-none"
// //               style={{ fontFamily: "Inter" }}
// //             >
// //               {user.username || user.name}
// //             </span>
// //             <span
// //               className="text-[#D72229] font-bold text-[18px] leading-none"
// //               style={{ fontFamily: "Inter" }}
// //             >
// //               @
// //             </span>
// //           </div>

// //           {/* QR Code - بدون margins، حجم مناسب لمنع القص */}
// //           <div 
// //               // ref={qrCardRef}
// //           className="w-[209px] h-[209px] bg-white rounded-b-[18px] flex items-center justify-center overflow-hidden flex-shrink-0">
// //             {isClient && profileUrl && (
// //               <StyledQRCode
// //                 value={profileUrl}
// //                 size={205}
// //                 image="/imgs/876771 copy 1.svg"
// //                 imageSize={0.3}
// //               />
// //             )}
// //           </div>
// //         </div>

// //         {/* النص الأول - تحت الصورة مباشرة */}
// //         <p
// //           className="text-center text-black text-[13px] font-medium mt-1"
// //           style={{ fontFamily: "Cairo" }}
// //         >
// //           انسخ اسم المستخدم أو امسح الكود لتضيفني
// //         </p>

// //         {/* القسم السفلي - منزلاً للأسفل */}
// //         <div className="text-white text-center flex flex-col items-center w-full mt-8">
// //           <p
// //             className="font-bold text-[20px] leading-[50px] w-[334px] h-[20px]"
// //             style={{ fontFamily: "Cairo", color: "#FFFFFF" }}
// //           >
// //             انضم إلى في رحلي على بو شات
// //           </p>
// //           <p
// //             className="text-[14px] leading-[20px] w-[210px] h-[20px] mt-[27px]"
// //             style={{ fontFamily: "Cairo", color: "#FFFFFF" }}
// //           >
// //             ابحث عن بو شات في المتجر
// //           </p>

// //           <div className="flex gap-3 mt-[7px]">
// //             <a
// //               href="https://play.google.com/store/apps/details?id=com.pandaoracle.bochat&pcampaignid=web_share"
// //               target="_blank"
// //               rel="noopener noreferrer"
// //               className="w-[90px] h-[30px] rounded-md overflow-hidden flex items-center justify-center"
// //               style={{ backgroundColor: "#FFFFFF" }}
// //             >
// //               <img
// //                 src="/imgs/google-play.svg"
// //                 alt="Google Play"
// //                 className="w-full h-full object-cover"
// //               />
// //             </a>
// //             <a
// //               href="https://apps.apple.com/us/app/bo-chat/id6749073096"
// //               target="_blank"
// //               rel="noopener noreferrer"
// //               className="w-[90px] h-[30px] rounded-md overflow-hidden flex items-center justify-center"
// //               style={{ backgroundColor: "#FFFFFF" }}
// //             >
// //               <img
// //                 src="/imgs/apple.svg"
// //                 alt="App Store"
// //                 className="w-full h-full object-cover"
// //               />
// //             </a>
// //           </div>
// //         </div>

// //         {/* الصورة السفلية */}
// //         <img
// //           src="/imgs/اكتب هنا ما تبحث عنه.svg"
// //           alt="BO CHAT"
// //           className="w-[200px] h-auto mt-2"
// //         />
// //       </div>

// //       {/* ✅ الأزرار الثلاثة - خارج الـ div الرئيسي، أسفله */}
// //       <div className="flex items-center justify-center gap-4 mt-4 z-50">
// //         <button
// //           onClick={handleCloseQR}
// //           className="w-[60px] h-[60px] rounded-full bg-[#000000BF] border-2 border-[#FFFFFF26] shadow-sm hover:bg-[#000000]/90 transition-all flex items-center justify-center cursor-pointer"
// //           aria-label="إغلاق الكيو آر"
// //         >
// //           <img
// //             src="/icons/Vector (21).svg"
// //             alt="QR"
// //             className="w-[21px] h-[22px]"
// //             style={{ filter: "brightness(0) invert(1)" }}
// //           />
// //         </button>
// // {/* 
// //         <button
// //           onClick={() => {
// //             if (user._id) {
// //               // handleBlock(user._id, user.name);
// //               handleCloseQR();
// //             }
// //           }}
// //           className="w-[60px] h-[60px] rounded-full bg-[#000000BF] border-2 border-[#FFFFFF26] shadow-sm hover:bg-[#000000]/90 transition-all flex items-center justify-center cursor-pointer"
// //           aria-label="إزالة"
// //         >
// //           <img
// //             src="/icons/Group 9307.svg"
// //             alt="إزالة"
// //             className="w-[21px] h-[22px]"
// //             style={{ filter: "brightness(0) invert(1)" }}
// //           />
// //         </button> */}

// // <button
// //   onClick={downloadQRImage}   // ✅ استدعاء الدالة الجديدة
// //   className="w-[60px] h-[60px] rounded-full bg-[#000000BF] border-2 border-[#FFFFFF26] shadow-sm hover:bg-[#000000]/90 transition-all flex items-center justify-center cursor-pointer"
// //   aria-label="تنزيل البطاقة"
// // >
// //   <img
// //     src="/icons/Group 9307.svg"
// //     alt="تنزيل"
// //     className="w-[21px] h-[22px]"
// //     style={{ filter: "brightness(0) invert(1)" }}
// //   />
// // </button>
// //         <button
// //           onClick={copyProfileLink}
// //           className="w-[60px] h-[60px] rounded-full bg-[#000000BF] border-2 border-[#FFFFFF26] shadow-sm hover:bg-[#000000]/90 transition-all flex items-center justify-center cursor-pointer"
// //           aria-label="مشاركة"
// //         >
// //           <img
// //             src="/icons/Vector (20).svg"
// //             alt="شير"
// //             className="w-[21px] h-[22px]"
// //             style={{ filter: "brightness(0) invert(1)" }}
// //           />
// //         </button>
// //       </div>
// //     </div>
// //   </div>
// // )}
// // {/* ظظظظظظظظظظظ */}
// //      {/* Overlay التقييم */}
// //  {toast && (
// //   <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[999999] w-auto max-w-[90%]">
// //     <div className="bg-black text-white text-sm px-5 py-3 rounded-xl shadow-xl text-center">
// //       {toast}
// //     </div>
// //   </div>
// // )}
// // {isRateOverlayOpen && (
// //   <div role="dialog" aria-modal="true" className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
// //     {/* الخلفية */}
// //     <div onClick={() => setIsRateOverlayOpen(false)} className="absolute inset-0 bg-[#000]/10 backdrop-blur-[20px]" />

// //     {/* الكارد */}
// //     <div className="relative w-[690px] z-10 bg-gradient-to-l from-[#fff] to-[#8D8D8D] backdrop-blur-[20px] rounded-[25px] max-h-[90vh] flex flex-col">
      
// //       {/* الرأس */}
// //       <div className="bg-[#fff]/25 backdrop-blur-[20px] rounded-t-[25px] px-5 py-3 shrink-0">
// //         <h3 className="text-[20px] font-semibold">التقييمات</h3>
// //       </div>

// //       {/* ✅ عرض قائمة التقييمات */}
// //       {ratingsLoading ? (
// //         <div className="h-[450px] flex items-center justify-center text-gray-500">
// //           جاري تحميل التقييمات...
// //         </div>
// //       ) : ratings.length === 0 ? (
// //         <div className="h-[450px] flex flex-col items-center justify-center px-5 text-center">
// //           <img src="/icons/no-rate.svg" alt="no-rate" className="w-[65px] h-[65px] mb-3" />
// //           <h4 className="text-[25px] font-semibold">مافيش تقييمات لسه</h4>
// //           <p className="text-[16px]">ماحدش قيّم لسه خليك أنت أول واحد يكسر الصمت</p>
// //         </div>
// //       ) : (
// //         <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 max-h-[400px]">
// //           {ratings.map((rate) => (
// //             <div 
// //               key={rate._id} 
// //               className="flex items-start gap-3 backdrop-blur-sm rounded-[25px] p-3 border-t border-x border-white/20 border-b-0"
// //               style={{
// //                 width: '663px',
// //                 height: '139px',
// //                 background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.2) 30%, rgba(102, 102, 102, 0) 100%)',
// //                 opacity: 1,
// //                 borderRadius: '25px',
// //                 borderBottom: 'none',
// //               }}
// //             >
// //               {/* ✅ الصورة - حجم 54x54 وزاوية 23px */}
// //               <img 
// //                 src={rate.userimg || "/imgs/user.png"} 
// //                 className="w-[54px] h-[54px] rounded-[23px] object-cover shrink-0" 
// //                 alt={rate.name} 
// //                 style={{ borderRadius: '23px' }}
// //               />
              
// //               <div className="flex-1 min-w-0">
// //                 {/* ✅ الصف العلوي: الاسم (يسار) + النجوم والنقاط (يمين) */}
// //                 <div className="flex items-center justify-between flex-wrap gap-2">
// //                   {/* ✅ الاسم فقط - أبيض, SemiBold, 15px */}
// //                   <span 
// //                     className="font-semibold text-[15px] leading-none"
// //                     style={{ 
// //                       color: '#FFFFFF',
// //                       fontWeight: 600,
// //                       fontSize: '15px',
// //                       lineHeight: '100%',
// //                     }}
// //                   >
// //                     {rate.name}
// //                   </span>
                  
// //                   {/* ✅ النجوم + أيقونة الخيارات */}
// //                   <div className="flex items-center gap-1">
// //                     {/* النجوم */}
// //                     <div className="flex">
// //                       {Array.from({ length: 5 }, (_, i) => (
// //                         <span key={i} className="inline-block w-[25px] h-[25px]">
// //                           {i < rate.stars ? (
// //                             <img src="/imgs/Vector (9).svg" className="w-full h-full object-contain" alt="star-filled" />
// //                           ) : (
// //                             <img src="/imgs/Vector (11).svg" className="w-full h-full object-contain" alt="star-empty" />
// //                           )}
// //                         </span>
// //                       ))}
// //                     </div>

// //                     {/* ✅ أيقونة الخيارات */}
// //                     <div
// //                       onClick={(e) => {
// //                         e.stopPropagation();
// //                         toggleMenu(rate._id, e);
// //                       }}
// //                       className="flex items-center justify-center cursor-pointer transition"
// //                       style={{
// //                         width: '48.93px',
// //                         height: '34px',
// //                         borderRadius: '15px',
// //                         border: '1px solid #B4B4B9',
// //                         background: '#B4B4B94D',
// //                         opacity: 1,
// //                       }}
// //                     >
// //                       <img
// //                         src="/icons/options-white.svg"
// //                         alt="options"
// //                         style={{
// //                           width: '4.16px',
// //                           height: '16.5px',
// //                           opacity: 1,
// //                         }}
// //                       />
// //                     </div>
// //                   </div>
// //                 </div>

// //                 {/* ✅ الصف الثاني: اسم المستخدم + التاريخ */}
// //                 <div className="mt-1 flex items-center gap-2 flex-wrap">
// //                   <span 
// //                     className="text-[12px]"
// //                     style={{ 
// //                       color: '#000000',
// //                       fontSize: '12px',
// //                       lineHeight: '100%',
// //                     }}
// //                   >
// //                     @{rate.username}
// //                   </span>
                  
// //                   <span 
// //                     className="px-2 py-0.5 rounded text-[12px] font-semibold leading-none"
// //                     style={{
// //                       color: '#D72229',
// //                       fontWeight: 600,
// //                       fontSize: '12px',
// //                       lineHeight: '100%',
// //                       borderRadius: '4px',
// //                     }}
// //                   >
// //                     {new Date(rate.createdAt).toLocaleDateString('ar-EG', {
// //                       year: 'numeric',
// //                       month: 'long',
// //                       day: 'numeric',
// //                     })}
// //                   </span>
// //                 </div>

// //                 {/* ✅ التعليق */}
// //                 <div className="mt-2">
// //                   <p className="text-sm text-gray-700 break-words">
// //                     {/* {rate.comment || '💬 لم يضف تعليقاً'} */}
// //                     {rate.comment}
// //                   </p>
// //                 </div>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       )}

// //       {/* ✅ صندوق إضافة تقييم جديد */}
// //       <div className="flex items-center gap-3 bg-[#fff]/50 backdrop-blur-xl px-5 h-[100px] rounded-b-[25px] shrink-0">
// //         <div className="w-[42px] h-[42px] rounded-[25px] overflow-hidden shrink-0">
// //           <img 
// //             src={userData?.userpersonaldata?.img || "/imgs/user.png"} 
// //             className="w-full h-full object-cover" 
// //             alt="user" 
// //           />
// //         </div>
// //         <div className="z-9 w-full flex rounded-[19px]" style={{ background: "#0000001A" }}>
// //           <input 
// //             placeholder="اكتب تقييمك هنا" 
// //             className="flex-1 bg-transparent outline-none p-3" 
// //           />
// //           <button className="bg-white px-4 py-3 rounded-tl-[19px] rounded-b-[19px] text-[#D72229] font-semibold shrink-0 w-[135px] cursor-pointer">
// //             تقييم
// //           </button>
// //         </div>
// //       </div>
// //     </div>

// //      {menuState.id && (
// //       <div
// //         className="fixed flex gap-2"
// //         style={{
// //           top: menuState.top,
// //           left: menuState.left,
// //           zIndex: 999999, 
// //         }}
// //         onClick={(e) => e.stopPropagation()}
// //       >
      
        
// //   <button
// //   onClick={() => {
// //     const userToBlock = ratings.find(r => r._id === menuState.id);

// //     if (!userToBlock) {
// //       setMenuState({ id: null, top: 0, left: 0 });
// //       return;
// //     }

// //     handleBlock(userToBlock.ratinguserid, userToBlock.name);
// //   }}
// //   className="flex items-center justify-center transition hover:opacity-80 gap-2"
// //   style={{
// //     width: '110px',
// //     height: '55px',
// //     borderRadius: '18px',
// //     background: '#D722294D',
// //     backdropFilter: 'blur(5px)',
// //     border: 'none',
// //     opacity: 1,
// //     cursor: 'pointer',
// //   }}    
// //       >
// //   <div
// //     style={{
// //       width: '37.875px',
// //       height: '37.875px',
// //       opacity: 1,
// //       background: '#FFFFFF',
// //       display: 'flex',
// //       alignItems: 'center',
// //       justifyContent: 'center',
// //       borderRadius: '50%',
// //     }}
// //   >
// //     <img
// //       src="/imgs/Frame.svg"
// //       alt="flag"
// //       style={{
// //         width: '13.47px',
// //         height: '13.47px',
// //         opacity: 1,
// //       }}
// //     />
// //   </div>
// //           <span
// //             style={{
// //               color: '#FFFFFF',
// //               fontWeight: 600,
// //               fontSize: '15px',
// //               lineHeight: '100%',
// //               fontFamily: 'Cairo',
// //             }}
// //           >
// //             حذف
// //           </span>
// //         </button>
        

// //           {/* زر ابلاغ */}
// //       <button
// //  onClick={() => {
// //     const userToReport = ratings.find(r => r._id === menuState.id);
// //     if (userToReport) {
// //       handleReportUser(userToReport.ratinguserid, userToReport.name);
// //     } else {
// //       setMenuState({ id: null, top: 0, left: 0 });
// //     }
// //   }}
// //   className="flex items-center justify-center transition hover:opacity-80 gap-2" 
// //   style={{
// //     width: '110px',
// //     height: '55px',
// //     borderRadius: '18px',
// //     background: '#D722294D',
// //     backdropFilter: 'blur(5px)',
// //     border: 'none',
// //     opacity: 1,
// //     cursor: 'pointer',
// //   }}
// // >
// //   <div
// //     style={{
// //       width: '37.875px',
// //       height: '37.875px',
// //       opacity: 1,
// //       background: '#FFFFFF',
// //       display: 'flex',
// //       alignItems: 'center',
// //       justifyContent: 'center',
// //       borderRadius: '50%',
// //     }}
// //   >
// //     <img
// //       src="/imgs/ic_flag_24px.svg"
// //       alt="flag"
// //       style={{
// //         width: '13.47px',
// //         height: '13.47px',
// //         opacity: 1,
// //       }}
// //     />
// //   </div>

// //   <span
// //     style={{
// //       color: '#FFFFFF',
// //       fontWeight: 600,
// //       fontSize: '15px',
// //       lineHeight: '100%',
// //       fontFamily: 'Cairo',
// //     }}
// //   >
// //     ابلاغ
// //   </span>
// // </button>

// //       </div>
// //     )}
// //   </div>
// // )}
 
// //     </div>
// //   );
// //  }




// /* eslint-disable jsx-a11y/alt-text */
// /* eslint-disable @next/next/no-img-element */
// "use client";
// import React, { useEffect, useState, useCallback, useRef } from "react";

// import Image from "next/image";
// import { useParams } from "next/navigation";
// import PostsFeed from "@/app/_components/PostsFeed";
// import ActionAreaClient from "../_components/ActionAreaClient";
// import FollowersMenu from "../_components/followersMenu";
// import ClientVisibilityGate from "../_components/ProfileGateClient";
// import { UserAPIResponse } from "@/types/types";
// import GlobalLoader from "@/components/GlobalLoader";
// import StyledQRCode from "@/app/_components/StyledQRCode";
// import Link from "next/link";
// import domtoimage from 'dom-to-image-more';

// function safeCount<T>(val?: T[] | Record<string, unknown> | number | null) {
//   if (val == null) return 0;
//   if (typeof val === "number") return val;
//   if (Array.isArray(val)) return val.length;
//   if (typeof val === "object") return Object.keys(val).length;
//   return 0;
// }

// export default function ProfilePageClient() {
//   const params = useParams();
//   const id = params && typeof params === "object" ? (params as any).id : undefined;
    
//   // Rating States
//   const [stars, setStars] = useState<number>(5);
//   const [commentText, setCommentText] = useState<string>('');
//   const [ratingLoading, setRatingLoading] = useState<boolean>(false);

//   // Profile States
//   const [aboutExpanded, setAboutExpanded] = useState(false);
//   const [data, setData] = useState<UserAPIResponse | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isRateOverlayOpen, setIsRateOverlayOpen] = useState(false);
//   const [userData, setUserData] = useState<any>(null);
//   const [isOverlayOpen, setIsOverlayOpen] = useState(false);
//   const [toast, setToast] = useState<string | null>(null);
//   const [postsCount, setPostsCount] = useState<number | null>(null);
//   const [ratings, setRatings] = useState<any[]>([]);
//   const [ratingsLoading, setRatingsLoading] = useState(false);

//   // QR Overlay States
//   const [showQROverlay, setShowQROverlay] = useState(false);
//   const [isClient, setIsClient] = useState(false);
//   const [profileUrl, setProfileUrl] = useState("");

//   const closeOverlay = useCallback(() => setIsOverlayOpen(false), []);
//   const openOverlay = useCallback(() => setIsOverlayOpen(true), []);

//   // فتح وإغلاق QR
//   const handleOpenQR = () => setShowQROverlay(true);
//   const handleCloseQR = () => setShowQROverlay(false);
//   const qrCardRef = useRef<HTMLDivElement>(null);

//   // دالة الانتظار المسبق للصور لضمان عدم ظهور مساحات فارغة
//   const preloadImages = () => {
//     const images = qrCardRef.current?.querySelectorAll('img');
//     if (!images) return Promise.resolve();
//     return Promise.all(
//       Array.from(images).map(
//         (img) =>
//           new Promise((resolve) => {
//             if (img.complete) resolve();
//             img.onload = resolve;
//             img.onerror = resolve;
//           })
//       )
//     );
//   };

//   // دالة تنزيل كارت الـ QR كاملاً كصورة
//   const downloadQRImage = async () => {
//     if (!qrCardRef.current) {
//       setToast('البطاقة غير جاهزة');
//       setTimeout(() => setToast(null), 3000);
//       return;
//     }

//     try {
//       setToast(' جاري إعداد البطاقة للتحميل...');
//       await preloadImages();

//       const dataUrl = await domtoimage.toPng(qrCardRef.current, {
//         scale: 2,                 
//         bgColor: '#ffffff',       
//         quality: 1,
//         useCORS: true,            
//         cacheBust: true,          
//         filter: (node) => {
//           return node && node.nodeType !== undefined;
//         },
//       });

//       const link = document.createElement('a');
//       link.download = `qr-${user?.username || 'user'}.png`;
//       link.href = dataUrl;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       setToast('تم تنزيل البطاقة بنجاح');
//       setTimeout(() => setToast(null), 2000);
//       handleCloseQR(); 
//     } catch (error: any) {
//       console.error('❌ فشل التنزيل:', error);
//       setToast(`❌ فشل التنزيل: ${error.message || 'خطأ غير معروف'}`);
//       setTimeout(() => setToast(null), 4000);
//     }
//   };
 
//   useEffect(() => {
//     setIsClient(true);
//     if (typeof window !== "undefined") {
//       const baseUrl = process.env.NEXT_PUBLIC_FRONT_URL || window.location.origin;
//       const url = `${baseUrl}/profile/${id}`;
//       console.log('🔗 QR Profile URL:', url);
//       setProfileUrl(url);
//     }
//   }, [id]);

//   // Menu & Block & Report logic
//   const [menuState, setMenuState] = useState<{
//     id: string | null;
//     top: number;
//     left: number;
//   }>({
//     id: null,
//     top: 0,
//     left: 0,
//   });
//   const [toastMessage, setToastMessage] = useState<string | null>(null);
//   const [toastType, setToastType] = useState<'success' | 'error'>('success');

//   const showToast = (message: string, type: 'success' | 'error' = 'success') => {
//     setToastMessage(message);
//     setToastType(type);
//     setTimeout(() => setToastMessage(null), 3000);
//   };

//   const toggleMenu = (rateId: string, e: React.MouseEvent) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     setMenuState({
//       id: menuState.id === rateId ? null : rateId,
//       top: rect.bottom + 10, 
//       left: rect.left, 
//     });
//   };
 
//   const handleBlock = async (userIdToBlock: string, userName: string) => {
//     try {
//       const token = getAccessToken();
//       if (!token) {
//         setToast('يجب تسجيل الدخول أولاً');
//         setTimeout(() => setToast(null), 3000);
//         return;
//       }

//       let myUserId = "";
//       try {
//         const raw = localStorage.getItem("userData");
//         if (raw) {
//           const parsed = JSON.parse(raw);
//           myUserId = parsed._id;
//         }
//       } catch (e) {
//         console.error("Error getting myUserId:", e);
//       }

//       if (!myUserId) {
//         setToast('لم يتم العثور على معرف المستخدم');
//         setTimeout(() => setToast(null), 3000);
//         return;
//       }

//       const res = await fetch(`https://bo-chat.space/block${myUserId}`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ blockedid: userIdToBlock }),
//       });

//       const responseText = await res.text();
//       if (!res.ok) throw new Error(responseText || `HTTP ${res.status}`);

//       setToast(`✅ تم حظر ${userName} بنجاح`);
//       setTimeout(() => setToast(null), 3000);
//       setMenuState({ id: null, top: 90, left: 0 });
//     } catch (error) {
//       console.error('Block error:', error);
//       setToast('❌ حدث خطأ أثناء محاولة الحظر');
//       setTimeout(() => setToast(null), 3000);
//       setMenuState({ id: null, top: 0, left: 0 });
//     }
//   };

//   const handleReportUser = async (userIdToReport: string, userName: string) => {
//     const token = getAccessToken();
//     let myUserId = "";
//     try {
//       const raw = localStorage.getItem("userData");
//       if (raw) {
//         const parsed = JSON.parse(raw);
//         myUserId = parsed._id;
//       }
//     } catch (e) {
//       console.error("Error getting myUserId:", e);
//     }

//     if (!token || !myUserId) {
//       setToast('يجب تسجيل الدخول أولاً');
//       setTimeout(() => setToast(null), 3000);
//       return;
//     }

//     try {
//       const res = await fetch(`https://bo-chat.space/report${myUserId}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           userid: userIdToReport, 
//           email: "",
//         }),
//       });
//       const text = await res.text();
//       if (!res.ok) throw new Error(text || "فشل إرسال البلاغ");
//       setToast(`✅ تم الإبلاغ عن ${userName} بنجاح`);
//       setTimeout(() => setToast(null), 3000);
//       setMenuState({ id: null, top: 0, left: 0 });
//     } catch (err) {
//       console.error("REPORT ERROR:", err);
//       setToast('❌ حدث خطأ أثناء إرسال البلاغ');
//       setTimeout(() => setToast(null), 3000);
//       setMenuState({ id: null, top: 0, left: 0 });
//     }
//   };

//   const handleRateUser = async () => {
//     const token = getAccessToken();
//     let myUserId = "";
//     try {
//       const raw = localStorage.getItem("userData");
//       if (raw) {
//         const parsed = JSON.parse(raw);
//         myUserId = parsed._id;
//       }
//     } catch (e) {
//       console.error("Error getting myUserId:", e);
//     }

//     if (!token || !myUserId) {
//       setToast('يجب تسجيل الدخول أولاً');
//       setTimeout(() => setToast(null), 3000);
//       return;
//     }

//     if (!id) {
//       setToast('معرّف المستخدم غير موجود');
//       setTimeout(() => setToast(null), 3000);
//       return;
//     }

//     setRatingLoading(true);
//     try {
//       const res = await fetch(`https://bo-chat.space/rate`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           stars: stars,
//           comment: commentText || "",
//           rateduserid: id,
//           ratinguserid: myUserId, 
//         }),
//       });
//       const text = await res.text();
//       if (!res.ok) throw new Error(text || "فشل التقييم");
//       setToast(`✅ تم تقييم المستخدم بنجاح`);
//       setTimeout(() => setToast(null), 3000);
//       setCommentText('');
//       setStars(5);
//       fetchRatings();
//     } catch (err) {
//       console.error("RATE ERROR:", err);
//       setToast('❌ حدث خطأ أثناء التقييم');
//       setTimeout(() => setToast(null), 3000);
//     } finally {
//       setRatingLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!data?.userpersonaldata?._id) return;

//     const fetchPostsCount = async () => {
//       try {
//         const token = localStorage.getItem("accessToken") || "";
//         const userId = data.userpersonaldata._id; 
//         const url = `https://bo-chat.space/myposts/${userId}?guestid=${userId}&page=1&limit=1000`;

//         const response = await fetch(url, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!response.ok) throw new Error(`HTTP ${response.status}`);
//         const posts = await response.json();

//         if (Array.isArray(posts)) {
//           const count = posts.length;
//           setPostsCount(count === 1000 ? 1000 : count);
//         } else {
//           setPostsCount(0);
//         }
//       } catch (error) {
//         console.error("Error fetching posts count:", error);
//         setPostsCount(0);
//       }
//     };

//     fetchPostsCount();
//   }, [data?.userpersonaldata?._id]); 

//   const copyProfileLink = useCallback(async () => {
//     if (!id) {
//       setToast("معرّف المستخدم غير موجود.");
//       setTimeout(() => setToast(null), 1800);
//       return;
//     }
//     const origin = typeof window !== "undefined" && window.location?.origin ? window.location.origin : "https://localhost:3000";
//     const profileUrl = `${origin}/profile/${id}`;
//     try {
//       if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
//         await navigator.clipboard.writeText(profileUrl);
//       } else {
//         const ta = document.createElement("textarea");
//         ta.value = profileUrl;
//         ta.style.position = "fixed";
//         ta.style.left = "-9999px";
//         document.body.appendChild(ta);
//         ta.select();
//         document.execCommand("copy");
//         document.body.removeChild(ta);
//       }
//       setToast("تم نسخ الرابط إلى الحافظة");
//       setTimeout(() => setToast(null), 1800);
//     } catch (err) {
//       console.error("copy error", err);
//       setToast("فشل النسخ");
//       setTimeout(() => setToast(null), 1800);
//     }
//   }, [id]);

//   const getAccessToken = useCallback(() => {
//     return localStorage.getItem("accessToken") || process.env.NEXT_PUBLIC_ACTIVE_USERS_TOKEN || "";
//   }, []);

//   useEffect(() => {
//     if (!id) {
//       setError("معرّف الملف الشخصي مفقود من الـ URL.");
//       setLoading(false);
//       return;
//     }
//     const ac = new AbortController();
//     let mounted = true;

//     async function fetchUser() {
//       setLoading(true);
//       setError(null);
//       const token = getAccessToken();
//       if (!token) {
//         if (mounted) setError("لم يتم العثور على توكن الدخول. يرجى تسجيل الدخول مرة أخرى.");
//         setLoading(false);
//         return;
//       }
//       try {
//         const res = await fetch(`https://bo-chat.space/users/${id}`, {
//           headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
//           signal: ac.signal,
//         });
//         if (!res.ok) {
//           if (res.status === 401 || res.status === 403) {
//             throw new Error("جلسة غير صالحة. يرجى تسجيل الدخول مجدداً.");
//           }
//           throw new Error(`HTTP ${res.status}`);
//         }
//         const json = (await res.json()) as UserAPIResponse;
//         if (mounted) {
//           setData(json);
//         }
//       } catch (err: any) {
//         if (err?.name === "AbortError") return;
//         console.error("fetchUser error:", err);
//         if (mounted) setError(err.message || "حدث خطأ أثناء جلب بيانات المستخدم.");
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     }

//     fetchUser();
//     return () => {
//       mounted = false;
//       ac.abort();
//     };
//   }, [id, getAccessToken]);

//   const fetchCurrentUserData = useCallback(async () => {
//     try {
//       const token = getAccessToken();
//       const userDataStr = localStorage.getItem("userData");
//       if (!userDataStr) return;
//       const parsed = JSON.parse(userDataStr);
//       const currentUserId = parsed._id;
//       if (!currentUserId) return;
//       const res = await fetch(`https://bo-chat.space/users/${currentUserId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Failed to fetch current user data");
//       const data = await res.json();
//       setUserData(data);
//     } catch (err) {
//       console.error("FETCH CURRENT USER ERROR:", err);
//     }
//   }, [getAccessToken]);

//   useEffect(() => {
//     if (id) {
//       fetchCurrentUserData();
//     }
//   }, [id, fetchCurrentUserData]);

//   useEffect(() => {
//     function onKey(e: KeyboardEvent) {
//       if (e.key === "Escape") closeOverlay();
//     }
//     if (isOverlayOpen) window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [isOverlayOpen, closeOverlay]);

//   const fetchRatings = useCallback(async () => {
//     if (!id) return;
//     const token = getAccessToken();
//     let guestId = "";
//     try {
//       const raw = localStorage.getItem("userData");
//       if (raw) {
//         const parsed = JSON.parse(raw);
//         guestId = parsed._id;
//       }
//     } catch (e) {}
//     if (!guestId || !token) {
//       setRatings([]);
//       return;
//     }
//     setRatingsLoading(true);
//     try {
//       const res = await fetch(`https://bo-chat.space/rate/${id}?guestid=${guestId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data = await res.json();
//       setRatings(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Error fetching ratings:", error);
//       setRatings([]);
//     } finally {
//       setRatingsLoading(false);
//     }
//   }, [id, getAccessToken]);

//   useEffect(() => {
//     if (isRateOverlayOpen) {
//       fetchRatings();
//     }
//   }, [isRateOverlayOpen, fetchRatings]);

//   if (loading) {
//     return (
//       <div dir="rtl" className="min-h-screen flex items-center justify-center p-8">
//         <GlobalLoader />
//       </div>
//     );
//   }

//   if (error || !data || !data.userpersonaldata) {
//     return (
//       <div dir="rtl" className="min-h-screen flex items-center justify-center p-8">
//         <div className="text-center text-red-600">{error ?? "المستخدم غير موجود أو حدث خطأ."}</div>
//       </div>
//     );
//   }

//   const res = data;
//   const user: any = res.userpersonaldata;
//   const followers = Array.isArray(res.followers) ? res.followers : [];
//   const following = Array.isArray(res.following) ? res.following : [];

//   const followerIds: string[] = followers
//     .map((f: any) =>
//       typeof f === "string"
//         ? f
//         : f.followerid ?? f.followerId ?? f._id ?? (f.followerdata && f.followerdata._id) ?? ""
//     )
//     .filter(Boolean);

//   const avatar = user.img || "/imgs/default-avatar.png";
//   const followersCount = followers.length;
//   const followingCount = following.length;
//   const viewsCount = user.visit ?? 0;
//   const rateCount = user.rate ?? 0;
  
//   return (
//     <div className="min-h-screen bg-white text-gray-800" dir="rtl">
//       {/* Toast Alert Feedback */}
//       {toast && (
//         <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-xl z-[999999] text-sm shadow-md">
//           {toast}
//         </div>
//       )}

//       <div className="px-5 py-1">
//         <h1 className="text-xl font-semibold">{user.name}</h1>
//         {user.private ? (
//           <p className="text-xs text-gray-500">درج خاص</p>
//         ) : postsCount === null ? (
//           <div className="text-xs text-gray-500 animate-pulse">جارى التحميل </div>
//         ) : postsCount === 0 ? (
//           <p className="text-xs text-gray-500">لا يوجد فضفضات</p>
//         ) : (
//           <div className="text-xs text-gray-500">
//             {postsCount === 1000 ? "1000+ فضفضة" : `${postsCount} فضفضة`}
//           </div>
//         )}
//       </div>

//       <div className="min-h-screen overflow-hidden">
//         <div className="relative overflow-y-auto h-[calc(100vh-100px)] scrollbar-hidden">
//           {/* Banner */}
//           <div className="relative">
//             <div className="h-[167px] w-full" style={{ background: "linear-gradient(90deg,#fff0f0,#e65b5b 25%,#d23e3e 70%,#c62828)" }}>
//               <div className="flex px-4 w-full items-end h-full flex-row gap-3">
//                 <ClientVisibilityGate
//                   profileId={res.userpersonaldata._id}
//                   profilePrivate={res.userpersonaldata.private}
//                   fallback={
//                     <div>
//                       <div className="relative w-28 h-28 md:w-36 md:h-36 z-[99] transform translate-y-1/2">
//                         <div className="relative w-full h-full rounded-t-[60px] rounded-b-[45px] border-2 border-white overflow-hidden">
//                           <Image
//                             src={avatar}
//                             alt={user.name ?? "Avatar"}
//                             width={140}
//                             height={136}
//                             unoptimized
//                             className="object-cover w-full h-full"
//                           />
//                           <div className="absolute bottom-0 left-0 w-full h-[42%] backdrop-blur-md flex items-center justify-center text-white bg-gradient-to-b from-[#D72229]/15 to-[#F92428]/50 z-10">
//                             <p>درج خاص</p>
//                           </div>
//                          </div>
//                         {user.vip && (
//                           <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
//                             <img src="/icons/vip.svg" alt="VIP" className="w-6 h-6 md:w-8 md:h-8" />
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   }
//                 >
//                   <button
//                     aria-label="عرض الصورة"
//                     onClick={openOverlay}
//                     className="relative w-[136px] h-[136px] md:w-36 md:h-36 rounded-[60px] border-2 border-white overflow-hidden bg-gray-100 transform translate-y-1/2 focus:outline-none z-[99]"
//                   >
//                     <Image src={avatar} alt={user.name ?? "Avatar"} width={150} height={150} unoptimized className="object-cover cursor-pointer w-full h-full" />
//                   </button>
//                 </ClientVisibilityGate>

//                 <div className="mb-2">
//                   <h1 className="text-xl md:text-2xl font-semibold text-white leading-tight">
//                     {user.name}
//                   </h1>
//                   {user.username && (
//                     <p className="text-sm text-white/90 mt-[1px] leading-none">
//                       @{user.username}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="relative">
//             <div className="md:px-5 py-3 border-b border-[#F6F6f6]">
//               <div className="flex flex-col gap-6">
//                 <div className="flex-1 text-right">
//                   <div className="mr-[150px] flex justify-between">
//                     <p
//                       className="text-sm text-[#B6B7B7] max-w-[280px] h-[50px] cursor-pointer select-none"
//                       onClick={() => setAboutExpanded(!aboutExpanded)}
//                     >
//                       {(() => {
//                         const text = user.about || "أنا هنا لأتواصل وأكتشف عوالم جديدة مع أشخاص يشبهونني";
//                         const words = text.split(' ');
//                         if (words.length > 7) {
//                           return aboutExpanded ? text : words.slice(0, 7).join(' ') + '...';
//                         }
//                         return text;
//                       })()}
//                     </p>
//                     <div className="flex gap-1">
//                       {id ? <ActionAreaClient followingId={id} serverFollowerIds={followerIds} receiverId={user._id} username={user.name} /> : null}
//                     </div>
//                   </div>

//                   <div className="mt-7">
//                     <div onClick={() => setIsRateOverlayOpen(true)} className="cursor-pointer select-none">
//                       {rateCount === 0 ? (
//                         <p className="text-sm underline text-[#D72229] text-[15px]">لم يحصل هذا الدرج علي اي تقييم</p>
//                       ) : (
//                         <div className="m-0 text-sm font-semibold underline text-[#D72229]">
//                           <span className="text-xs">حصل هذا الدرج علي</span> تقييم {Number(rateCount.toFixed(2))} نجوم
//                         </div>
//                       )}
//                     </div>

//                     <div className="flex gap-4 mt-1 text-[15px]">
//                       <div className="flex gap-1 items-center justify-center"><div className="text-sm text-[#B6B7B7]"> صاحبي هنا</div><div className="text-md font-semibold">{followersCount}</div></div>
//                       <div className="flex gap-1 items-center justify-center"><h3 className="text-sm font-semibold text-[#B6B7B7]">متابعين</h3><div className="text-md font-semibold">{followingCount}</div></div>
//                       <div className="flex gap-1 items-center justify-center"><div className="text-sm text-[#B6B7B7]">مشاهدة</div><div className="text-md font-semibold">{viewsCount}</div></div>
//                     </div>

//                     <ClientVisibilityGate profileId={res.userpersonaldata._id} profilePrivate={res.userpersonaldata.private}>
//                       <FollowersMenu followers={res.followers ?? []} title="اطلع الان علي جميع المتابعين" limit={3} />
//                     </ClientVisibilityGate>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <ClientVisibilityGate profileId={res.userpersonaldata._id} isPrivate={res.userpersonaldata.private} profilePrivate={res.userpersonaldata.private} fallback={<div className="flex items-center justify-center flex-col text-center pt-3"><h3 className="text-xl">درج خاص</h3><p className="text-[#B6B7B7] max-w-[350px]">مرحبا هذا الدرج خاص الآن فقط من اقبل متابعتهم يمكنهم رؤية فضفضاتي</p></div>}>
//               <PostsFeed />
//             </ClientVisibilityGate>
//           </div>
//         </div>
//       </div>

//       {/* Overlay الصورة وعناصر التحكم المعرض الأساسي */}
//     {/* Overlay الصورة وعناصر التحكم المعرض الأساسي */}
// {isOverlayOpen && !showQROverlay && (
//   <div role="dialog" aria-modal="true" className="fixed inset-0 w-screen h-screen z-[99999] flex items-center justify-center p-4">
//     {/* تم تعديل الخلفية لتكون سوداء تماماً bg-black بدون أي شفافية */}
//     <div onClick={closeOverlay} className="absolute inset-0 bg-black w-full h-full" />
    
//     <div className="relative z-[100000] max-w-[720px] w-full max-h-[90vh] rounded-2xl">
//       <div className="w-full flex justify-center items-center p-6">
//         <Image 
//           src={avatar} 
//           alt={user.name ?? "Avatar"} 
//           width={600} 
//           height={600} 
//           unoptimized 
//           className="object-contain w-[500px] h-[500px] rounded-[170px]" 
//         />
//       </div>
      
//       <div className="flex items-center justify-center gap-4 absolute bottom-[-70px] left-1/2 transform -translate-x-1/2">
//         {/* زر فتح الـ QR */}
//         <button 
//           onClick={handleOpenQR}         
//           className="w-[60px] h-[60px] rounded-full bg-[#000000BF] border-2 border-[#FFFFFF26] shadow-sm hover:bg-[#000000]/90 transition-all flex items-center justify-center cursor-pointer"
//           aria-label="إجراء الكود"
//         >
//           <img 
//             src="/icons/Vector (21).svg" 
//             alt="إجراء" 
//             className="w-[21px] h-[22px]" 
//             style={{ filter: "brightness(0) invert(1)" }}
//           />
//         </button>

//         {/* زر التنزيل */}
//         <button
//           onClick={downloadQRImage}
//           className="w-[60px] h-[60px] rounded-full bg-[#000000BF] border-2 border-[#FFFFFF26] shadow-sm hover:bg-[#000000]/90 transition-all flex items-center justify-center cursor-pointer"
//           aria-label="تنزيل البطاقة"
//         >
//           <img
//             src="/icons/Group 9307.svg"
//             alt="تنزيل"
//             className="w-[21px] h-[22px]"
//             style={{ filter: "brightness(0) invert(1)" }}
//           />
//         </button>

//         {/* زر نسخ الرابط */}
//         <button 
//           onClick={copyProfileLink} 
//           className="w-[60px] h-[60px] rounded-full bg-[#000000BF] border-2 border-[#FFFFFF26] shadow-sm hover:bg-[#000000]/90 transition-all flex items-center justify-center cursor-pointer"
//           aria-label="مشاركة"
//         >
//           <img 
//             src="/icons/Vector (20).svg" 
//             alt="شير" 
//             className="w-[21px] h-[22px]" 
//             style={{ filter: "brightness(0) invert(1)" }}
//           />
//         </button>
//       </div>

//       {/* زر إغلاق المعرض */}
//       <button 
//         onClick={closeOverlay} 
//         aria-label="إغلاق" 
//         className="px-3 py-3 cursor-pointer absolute top-[-30px] left-1/2 transform -translate-x-1/2 rounded-full shadow-sm bg-[#FFFFFF]/15 hover:bg-[#FFFFFF]/30 transition"
//       >
//         <img src="/icons/close.svg" alt="close" />
//       </button>
//     </div>
//   </div>
// )}
//       {/* نافذة الـ QR Overlay الكاملة القابلة للتنزيل مع الأزرار الثلاثة */}
//       {showQROverlay && (
//         <div
//           className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[99999] p-4"
//           onClick={handleCloseQR}
//         >
//           <div className="relative flex flex-col items-center gap-6" onClick={(e) => e.stopPropagation()}>
            
//             {/* بطاقة كرت الـ QR المخصصة للتصوير والتحميل */}
//             <div
//               ref={qrCardRef}
//               className="relative flex flex-col items-center gap-2 py-6 px-5 rounded-[35px] shadow-2xl flex-shrink-0"
//               style={{
//                 width: '411px',
//                 height: '550px',
//                 maxWidth: '95vw',
//                 maxHeight: '75vh',
//                 backgroundImage: "url('/imgs/Group 9318.svg')",
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center',
//                 backgroundRepeat: 'no-repeat',
//               }}
//               dir="rtl"
//             >
//               {/* زر إغلاق الـ QR من فوق الكارت */}
//               <button
//                 onClick={handleCloseQR}
//                 aria-label="إغلاق"
//                 className="px-3 py-3 cursor-pointer absolute top-[-55px] left-1/2 transform -translate-x-1/2 rounded-full shadow-sm bg-[#FFFFFF]/15 hover:bg-[#FFFFFF]/30 transition z-50"
//               >
//                 <img src="/icons/close.svg" alt="close" />
//               </button>

//               {/* الشعار */}
//               <Link href="/" className="flex justify-center">
//                 <img
//                   src="/logo-red.png"
//                   alt="BO CHAT"
//                   className="w-[40px] h-auto brightness-0 invert"
//                 />
//               </Link>

//               {/* بطاقة QR البيضاء الداخلية */}
//               <div className="w-[209px] h-[250px] bg-white rounded-[18px] overflow-hidden shadow-lg flex-shrink-0">
//                 {/* اسم المستخدم */}
//                 <div
//                   className="h-[41px] bg-[#FCE9E9] flex items-center justify-center gap-0 cursor-pointer hover:opacity-70 transition"
//                   onClick={() => {
//                     const username = user.username || user.name;
//                     navigator.clipboard.writeText(username);
//                     setToast(`تم نسخ الحساب: ${username}`);
//                     setTimeout(() => setToast(null), 2000);
//                   }}
//                 >
//                   <span
//                     className="text-[#D72229] font-bold text-[18px] leading-none"
//                     style={{ fontFamily: "Inter" }}
//                   >
//                     {user.username || user.name}
//                   </span>
//                   <span
//                     className="text-[#D72229] font-bold text-[18px] leading-none"
//                     style={{ fontFamily: "Inter" }}
//                   >
//                     @
//                   </span>
//                 </div>

//                 {/* كود الـ QR */}
//                 <div className="w-[209px] h-[209px] bg-white rounded-b-[18px] flex items-center justify-center overflow-hidden flex-shrink-0">
//                   {isClient && profileUrl && (
//                     <StyledQRCode
//                       value={profileUrl}
//                       size={205}
//                       image="/imgs/876771 copy 1.svg"
//                       imageSize={0.3}
//                     />
//                   )}
//                 </div>
//               </div>

//               {/* التوجيهات السفلية نصوص الديكور */}
//               <p
//                 className="text-center text-black text-[13px] font-medium mt-1"
//                 style={{ fontFamily: "Cairo" }}
//               >
//                 انسخ اسم المستخدم أو امسح الكود لتضيفني
//               </p>

//               <div className="text-white text-center flex flex-col items-center w-full mt-8">
//                 <p
//                   className="font-bold text-[20px] leading-[50px] w-[334px] h-[20px]"
//                   style={{ fontFamily: "Cairo", color: "#FFFFFF" }}
//                 >
//                   انضم إلي في رحلتي على بو شات
//                 </p>
//                 <p
//                   className="text-[14px] leading-[20px] w-[210px] h-[20px] mt-[27px]"
//                   style={{ fontFamily: "Cairo", color: "#FFFFFF" }}
//                 >
//                   تفقد الملف الشخصي الخاص بي الآن
//                 </p>
 
         
//               {/* أزرار تحميل التطبيق من المتاجر (Google Play & App Store) جنب بعض */}
//               <div className="flex items-center justify-center gap-4 w-full mt-6 px-4">
//                 <a
//                 href="https://play.google.com/store/apps/details?id=com.pandaoracle.bochat&pcampaignid=web_share"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="w-[120px] h-[40px] rounded-md overflow-hidden flex items-center justify-center shadow-md hover:opacity-90 transition active:scale-95"
//               >
//                 <img
//                   src="/imgs/google-play.svg"
//                   alt="Google Play"
//                   className="w-full h-full object-fill" 
//                 />
//               </a>

//                 {/* الزر الثاني: App Store */}
//                 <a
//                   href="https://apps.apple.com/us/app/bo-chat/id6749073096"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="w-[120px] h-[40px] rounded-md overflow-hidden flex items-center justify-center shadow-md hover:opacity-90 transition active:scale-95"
//                 >
//                   <img
//                     src="/imgs/apple.svg"
//                     alt="App Store"
//                   className="w-full h-full object-fill"
//                   />
//                 </a>
//               </div>

// {/* الشعار أسفل الزرين */}
//             <div className="mt-2 flex justify-center w-full">
//                     <img
//                       src="/imgs/اكتب هنا ما تبحث عنه.svg"
//                       alt="BO CHAT"
//                       className="w-[200px] h-auto"
//                     />
//             </div>
//               </div>
//             </div>

//             {/* الأزرار الثلاثة تم توطينها بالأسفل هنا لتظهر بوضوح تحت بطاقة الـ QR الكبيرة */}
//             <div className="flex items-center justify-center gap-4 w-full mt-2 z-[999999]">
//               {/* زر عرض الـ QR (معطل/نشط دلالياً لأنه مفتوح بالفعل) */}
//               <button 
//                 onClick={handleCloseQR}         
//                 className="w-[60px] h-[60px] rounded-full bg-[#D72229] border-2 border-[#FFFFFF26] shadow-lg flex items-center justify-center cursor-pointer transition-all scale-105"
//                 aria-label="إغلاق الكود"
//               >
//                 <img 
//                   src="/icons/Vector (21).svg" 
//                   alt="إجراء" 
//                   className="w-[21px] h-[22px]" 
//                   style={{ filter: "brightness(0) invert(1)" }}
//                 />
//               </button>

//               {/* زر التنزيل لبطاقة الـ QR كصورة */}
//               <button
//                 onClick={downloadQRImage}
//                 className="w-[60px] h-[60px] rounded-full bg-[#000000BF] border-2 border-[#FFFFFF26] shadow-lg hover:bg-[#000000]/90 transition-all flex items-center justify-center cursor-pointer"
//                 aria-label="تنزيل البطاقة"
//               >
//                 <img
//                   src="/icons/Group 9307.svg"
//                   alt="تنزيل"
//                   className="w-[21px] h-[22px]"
//                   style={{ filter: "brightness(0) invert(1)" }}
//                 />
//               </button>

//               {/* زر نسخ رابط الحساب الشخصي */}
//               <button 
//                 onClick={copyProfileLink} 
//                 className="w-[60px] h-[60px] rounded-full bg-[#000000BF] border-2 border-[#FFFFFF26] shadow-lg hover:bg-[#000000]/90 transition-all flex items-center justify-center cursor-pointer"
//                 aria-label="مشاركة"
//               >
//                 <img 
//                   src="/icons/Vector (20).svg" 
//                   alt="شير" 
//                   className="w-[21px] h-[22px]" 
//                   style={{ filter: "brightness(0) invert(1)" }}
//                 />
//               </button>
//             </div>

//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




// ظظظظظظظظظظظظظظظظظظظظظظظظظظ
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import PostsFeed from "@/app/_components/PostsFeed";
import ActionAreaClient from "../_components/ActionAreaClient";
import FollowersMenu from "../_components/followersMenu";
import ClientVisibilityGate from "../_components/ProfileGateClient";
import { UserAPIResponse } from "@/types/types";
import GlobalLoader from "@/components/GlobalLoader";
import StyledQRCode from "@/app/_components/StyledQRCode";
import Link from "next/link";
import domtoimage from "dom-to-image-more";
import { useTranslation } from "@/contexts/TranslationContext";

// ---------- Helper: TranslateText with cache + static fallback ----------
const translationCache = new Map<string, string>();

// يمكنك نقل هذا القاموس إلى ملف منفصل حسب الرغبة
const staticTranslations: Record<string, Record<string, string>> = {
  ar: {
    "درج خاص": "درج خاص",
    "جارى التحميل": "جارى التحميل",
    "لا يوجد فضفضات": "لا يوجد فضفضات",
    "فضفضة": "فضفضة",
    "عرض الصورة": "عرض الصورة",
    "إجراء الكود": "إجراء الكود",
    "تنزيل البطاقة": "تنزيل البطاقة",
    "مشاركة": "مشاركة",
    "إغلاق": "إغلاق",
    "إغلاق الكود": "إغلاق الكود",
    "صاحبي هنا": "صاحبي هنا",
    "متابعين": "متابعين",
    "مشاهدة": "مشاهدة",
    "اطلع الان علي جميع المتابعين": "اطلع الان علي جميع المتابعين",
    "نجوم": "نجوم",
    "حصل هذا الدرج علي": "حصل هذا الدرج علي",
    "لم يحصل هذا الدرج علي اي تقييم": "لم يحصل هذا الدرج علي اي تقييم",
    "المستخدم غير موجود أو حدث خطأ.": "المستخدم غير موجود أو حدث خطأ.",
    "أنا هنا لأتواصل وأكتشف عوالم جديدة مع أشخاص يشبهونني": "أنا هنا لأتواصل وأكتشف عوالم جديدة مع أشخاص يشبهونني",
    "مرحبا هذا الدرج خاص الآن فقط من اقبل متابعتهم يمكنهم رؤية فضفضاتي": "مرحبا هذا الدرج خاص الآن فقط من اقبل متابعتهم يمكنهم رؤية فضفضاتي",
    "انسخ اسم المستخدم أو امسح الكود لتضيفني": "انسخ اسم المستخدم أو امسح الكود لتضيفني",
    "انضم إلي في رحلتي على بو شات": "انضم إلي في رحلتي على بو شات",
    "تفقد الملف الشخصي الخاص بي الآن": "تفقد الملف الشخصي الخاص بي الآن",
  },
  en: {
    "درج خاص": "Private Box",
    "جارى التحميل": "Loading...",
    "لا يوجد فضفضات": "No posts",
    "فضفضة": "post",
    "عرض الصورة": "View image",
    "إجراء الكود": "QR Code",
    "تنزيل البطاقة": "Download card",
    "مشاركة": "Share",
    "إغلاق": "Close",
    "إغلاق الكود": "Close QR",
    "صاحبي هنا": "Friends here",
    "متابعين": "Following",
    "مشاهدة": "Views",
    "اطلع الان علي جميع المتابعين": "View all followers",
    "نجوم": "stars",
    "حصل هذا الدرج علي": "This box has",
    "لم يحصل هذا الدرج علي اي تقييم": "This box has no ratings yet",
    "المستخدم غير موجود أو حدث خطأ.": "User not found or an error occurred.",
    "أنا هنا لأتواصل وأكتشف عوالم جديدة مع أشخاص يشبهونني": "I'm here to connect and discover new worlds with people like me",
    "مرحبا هذا الدرج خاص الآن فقط من اقبل متابعتهم يمكنهم رؤية فضفضاتي": "Hello, this box is private now, only accepted followers can see my posts",
    "انسخ اسم المستخدم أو امسح الكود لتضيفني": "Copy username or scan QR to add me",
    "انضم إلي في رحلتي على بو شات": "Join me on Bo Chat",
    "تفقد الملف الشخصي الخاص بي الآن": "Check out my profile now",
  },
};

const TranslateText = ({ text }: { text: string }) => {
  const { translate, language } = useTranslation();
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    if (!text) {
      setTranslated("");
      return;
    }
    if (language === "ar") {
      setTranslated(text);
      return;
    }

    // البحث في الترجمة الثابتة
    const staticTranslation = staticTranslations[language]?.[text];
    if (staticTranslation) {
      setTranslated(staticTranslation);
      return;
    }

    // البحث في الكاش
    const cacheKey = `${text}-${language}`;
    if (translationCache.has(cacheKey)) {
      setTranslated(translationCache.get(cacheKey)!);
      return;
    }

    // طلب API
    translate(text)
      .then((result) => {
        translationCache.set(cacheKey, result);
        setTranslated(result);
      })
      .catch(() => setTranslated(text));
  }, [text, language, translate]);

  return <>{translated}</>;
};

// هوك للحصول على نص مترجم لـ aria-label
const useTranslatedLabel = (text: string) => {
  const { translate, language } = useTranslation();
  const [label, setLabel] = useState(text);

  useEffect(() => {
    if (language === "ar") {
      setLabel(text);
      return;
    }
    const staticTranslation = staticTranslations[language]?.[text];
    if (staticTranslation) {
      setLabel(staticTranslation);
      return;
    }
    translate(text).then(setLabel).catch(() => setLabel(text));
  }, [text, language, translate]);

  return label;
};

// ---------- Main Component ----------
export default function ProfilePageClient() {
  const params = useParams();
  const id = params && typeof params === "object" ? (params as any).id : undefined;

  const { language, translate } = useTranslation();
  const dir = language === "ar" ? "rtl" : "ltr";

  // Rating States
  const [stars, setStars] = useState<number>(5);
  const [commentText, setCommentText] = useState<string>("");
  const [ratingLoading, setRatingLoading] = useState<boolean>(false);

  // Profile States
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [data, setData] = useState<UserAPIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRateOverlayOpen, setIsRateOverlayOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [postsCount, setPostsCount] = useState<number | null>(null);
  const [ratings, setRatings] = useState<any[]>([]);
  const [ratingsLoading, setRatingsLoading] = useState(false);

  // QR Overlay States
  const [showQROverlay, setShowQROverlay] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");

  const closeOverlay = useCallback(() => setIsOverlayOpen(false), []);
  const openOverlay = useCallback(() => setIsOverlayOpen(true), []);

  const handleOpenQR = () => setShowQROverlay(true);
  const handleCloseQR = () => setShowQROverlay(false);
  const qrCardRef = useRef<HTMLDivElement>(null);

  // Preload images for QR download
  const preloadImages = () => {
    const images = qrCardRef.current?.querySelectorAll("img");
    if (!images) return Promise.resolve();
    return Promise.all(
      Array.from(images).map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) resolve();
            img.onload = resolve;
            img.onerror = resolve;
          })
      )
    );
  };

  // Download QR card as image
  const downloadQRImage = async () => {
    if (!qrCardRef.current) {
      setToast("البطاقة غير جاهزة");
      setTimeout(() => setToast(null), 3000);
      return;
    }

    try {
      setToast(" جاري إعداد البطاقة للتحميل...");
      await preloadImages();

      const dataUrl = await domtoimage.toPng(qrCardRef.current, {
        scale: 2,
        bgColor: "#ffffff",
        quality: 1,
        useCORS: true,
        cacheBust: true,
        filter: (node) => {
          return node && node.nodeType !== undefined;
        },
      });

      const link = document.createElement("a");
      link.download = `qr-${user?.username || "user"}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setToast("تم تنزيل البطاقة بنجاح");
      setTimeout(() => setToast(null), 2000);
      handleCloseQR();
    } catch (error: any) {
      console.error("❌ فشل التنزيل:", error);
      setToast(`❌ فشل التنزيل: ${error.message || "خطأ غير معروف"}`);
      setTimeout(() => setToast(null), 4000);
    }
  };

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const baseUrl = process.env.NEXT_PUBLIC_FRONT_URL || window.location.origin;
      const url = `${baseUrl}/profile/${id}`;
      setProfileUrl(url);
    }
  }, [id]);

  // Menu & Block & Report logic
  const [menuState, setMenuState] = useState<{
    id: string | null;
    top: number;
    left: number;
  }>({
    id: null,
    top: 0,
    left: 0,
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleMenu = (rateId: string, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuState({
      id: menuState.id === rateId ? null : rateId,
      top: rect.bottom + 10,
      left: rect.left,
    });
  };

  const handleBlock = async (userIdToBlock: string, userName: string) => {
    try {
      const token = getAccessToken();
      if (!token) {
        setToast("يجب تسجيل الدخول أولاً");
        setTimeout(() => setToast(null), 3000);
        return;
      }

      let myUserId = "";
      try {
        const raw = localStorage.getItem("userData");
        if (raw) {
          const parsed = JSON.parse(raw);
          myUserId = parsed._id;
        }
      } catch (e) {
        console.error("Error getting myUserId:", e);
      }

      if (!myUserId) {
        setToast("لم يتم العثور على معرف المستخدم");
        setTimeout(() => setToast(null), 3000);
        return;
      }

      const res = await fetch(`https://bo-chat.space/block${myUserId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blockedid: userIdToBlock }),
      });

      const responseText = await res.text();
      if (!res.ok) throw new Error(responseText || `HTTP ${res.status}`);

      setToast(`✅ تم حظر ${userName} بنجاح`);
      setTimeout(() => setToast(null), 3000);
      setMenuState({ id: null, top: 90, left: 0 });
    } catch (error) {
      console.error("Block error:", error);
      setToast("❌ حدث خطأ أثناء محاولة الحظر");
      setTimeout(() => setToast(null), 3000);
      setMenuState({ id: null, top: 0, left: 0 });
    }
  };

  const handleReportUser = async (userIdToReport: string, userName: string) => {
    const token = getAccessToken();
    let myUserId = "";
    try {
      const raw = localStorage.getItem("userData");
      if (raw) {
        const parsed = JSON.parse(raw);
        myUserId = parsed._id;
      }
    } catch (e) {
      console.error("Error getting myUserId:", e);
    }

    if (!token || !myUserId) {
      setToast("يجب تسجيل الدخول أولاً");
      setTimeout(() => setToast(null), 3000);
      return;
    }

    try {
      const res = await fetch(`https://bo-chat.space/report${myUserId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userid: userIdToReport,
          email: "",
        }),
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text || "فشل إرسال البلاغ");
      setToast(`✅ تم الإبلاغ عن ${userName} بنجاح`);
      setTimeout(() => setToast(null), 3000);
      setMenuState({ id: null, top: 0, left: 0 });
    } catch (err) {
      console.error("REPORT ERROR:", err);
      setToast("❌ حدث خطأ أثناء إرسال البلاغ");
      setTimeout(() => setToast(null), 3000);
      setMenuState({ id: null, top: 0, left: 0 });
    }
  };

  const handleRateUser = async () => {
    const token = getAccessToken();
    let myUserId = "";
    try {
      const raw = localStorage.getItem("userData");
      if (raw) {
        const parsed = JSON.parse(raw);
        myUserId = parsed._id;
      }
    } catch (e) {
      console.error("Error getting myUserId:", e);
    }

    if (!token || !myUserId) {
      setToast("يجب تسجيل الدخول أولاً");
      setTimeout(() => setToast(null), 3000);
      return;
    }

    if (!id) {
      setToast("معرّف المستخدم غير موجود");
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setRatingLoading(true);
    try {
      const res = await fetch(`https://bo-chat.space/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stars: stars,
          comment: commentText || "",
          rateduserid: id,
          ratinguserid: myUserId,
        }),
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text || "فشل التقييم");
      setToast(`✅ تم تقييم المستخدم بنجاح`);
      setTimeout(() => setToast(null), 3000);
      setCommentText("");
      setStars(5);
      fetchRatings();
    } catch (err) {
      console.error("RATE ERROR:", err);
      setToast("❌ حدث خطأ أثناء التقييم");
      setTimeout(() => setToast(null), 3000);
    } finally {
      setRatingLoading(false);
    }
  };

  useEffect(() => {
    if (!data?.userpersonaldata?._id) return;

    const fetchPostsCount = async () => {
      try {
        const token = localStorage.getItem("accessToken") || "";
        const userId = data.userpersonaldata._id;
        const url = `https://bo-chat.space/myposts/${userId}?guestid=${userId}&page=1&limit=1000`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const posts = await response.json();

        if (Array.isArray(posts)) {
          const count = posts.length;
          setPostsCount(count === 1000 ? 1000 : count);
        } else {
          setPostsCount(0);
        }
      } catch (error) {
        console.error("Error fetching posts count:", error);
        setPostsCount(0);
      }
    };

    fetchPostsCount();
  }, [data?.userpersonaldata?._id]);

  const copyProfileLink = useCallback(async () => {
    if (!id) {
      setToast("معرّف المستخدم غير موجود.");
      setTimeout(() => setToast(null), 1800);
      return;
    }
    const origin =
      typeof window !== "undefined" && window.location?.origin
        ? window.location.origin
        : "https://localhost:3000";
    const profileUrl = `${origin}/profile/${id}`;
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(profileUrl);
      } else {
        const ta = document.createElement("textarea");
        ta.value = profileUrl;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setToast("تم نسخ الرابط إلى الحافظة");
      setTimeout(() => setToast(null), 1800);
    } catch (err) {
      console.error("copy error", err);
      setToast("فشل النسخ");
      setTimeout(() => setToast(null), 1800);
    }
  }, [id]);

  const getAccessToken = useCallback(() => {
    return (
      localStorage.getItem("accessToken") ||
      process.env.NEXT_PUBLIC_ACTIVE_USERS_TOKEN ||
      ""
    );
  }, []);

  useEffect(() => {
    if (!id) {
      setError("معرّف الملف الشخصي مفقود من الـ URL.");
      setLoading(false);
      return;
    }
    const ac = new AbortController();
    let mounted = true;

    async function fetchUser() {
      setLoading(true);
      setError(null);
      const token = getAccessToken();
      if (!token) {
        if (mounted)
          setError("لم يتم العثور على توكن الدخول. يرجى تسجيل الدخول مرة أخرى.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`https://bo-chat.space/users/${id}`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          signal: ac.signal,
        });
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            throw new Error("جلسة غير صالحة. يرجى تسجيل الدخول مجدداً.");
          }
          throw new Error(`HTTP ${res.status}`);
        }
        const json = (await res.json()) as UserAPIResponse;
        if (mounted) {
          setData(json);
        }
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        console.error("fetchUser error:", err);
        if (mounted) setError(err.message || "حدث خطأ أثناء جلب بيانات المستخدم.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchUser();
    return () => {
      mounted = false;
      ac.abort();
    };
  }, [id, getAccessToken]);

  const fetchCurrentUserData = useCallback(async () => {
    try {
      const token = getAccessToken();
      const userDataStr = localStorage.getItem("userData");
      if (!userDataStr) return;
      const parsed = JSON.parse(userDataStr);
      const currentUserId = parsed._id;
      if (!currentUserId) return;
      const res = await fetch(`https://bo-chat.space/users/${currentUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch current user data");
      const data = await res.json();
      setUserData(data);
    } catch (err) {
      console.error("FETCH CURRENT USER ERROR:", err);
    }
  }, [getAccessToken]);

  useEffect(() => {
    if (id) {
      fetchCurrentUserData();
    }
  }, [id, fetchCurrentUserData]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeOverlay();
    }
    if (isOverlayOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOverlayOpen, closeOverlay]);

  const fetchRatings = useCallback(async () => {
    if (!id) return;
    const token = getAccessToken();
    let guestId = "";
    try {
      const raw = localStorage.getItem("userData");
      if (raw) {
        const parsed = JSON.parse(raw);
        guestId = parsed._id;
      }
    } catch (e) {}
    if (!guestId || !token) {
      setRatings([]);
      return;
    }
    setRatingsLoading(true);
    try {
      const res = await fetch(`https://bo-chat.space/rate/${id}?guestid=${guestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRatings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching ratings:", error);
      setRatings([]);
    } finally {
      setRatingsLoading(false);
    }
  }, [id, getAccessToken]);

  useEffect(() => {
    if (isRateOverlayOpen) {
      fetchRatings();
    }
  }, [isRateOverlayOpen, fetchRatings]);

  // ترجمة الـ aria-labels
  const showImageLabel = useTranslatedLabel("عرض الصورة");
  const qrCodeLabel = useTranslatedLabel("إجراء الكود");
  const downloadLabel = useTranslatedLabel("تنزيل البطاقة");
  const shareLabel = useTranslatedLabel("مشاركة");
  const closeLabel = useTranslatedLabel("إغلاق");
  const closeQRCodeLabel = useTranslatedLabel("إغلاق الكود");

  if (loading) {
    return (
      <div dir={dir} className="min-h-screen flex items-center justify-center p-8">
        <GlobalLoader />
      </div>
    );
  }

  if (error || !data || !data.userpersonaldata) {
    return (
      <div dir={dir} className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center text-red-600">
          {error ?? <TranslateText text="المستخدم غير موجود أو حدث خطأ." />}
        </div>
      </div>
    );
  }

  const res = data;
  const user: any = res.userpersonaldata;
  const followers = Array.isArray(res.followers) ? res.followers : [];
  const following = Array.isArray(res.following) ? res.following : [];

  const followerIds: string[] = followers
    .map((f: any) =>
      typeof f === "string"
        ? f
        : f.followerid ??
          f.followerId ??
          f._id ??
          (f.followerdata && f.followerdata._id) ??
          ""
    )
    .filter(Boolean);

  const avatar = user.img || "/imgs/default-avatar.png";
  const followersCount = followers.length;
  const followingCount = following.length;
  const viewsCount = user.visit ?? 0;
  const rateCount = user.rate ?? 0;

  return (
    <div className="min-h-screen bg-white text-gray-800" dir={dir}>
      {/* Toast Alert Feedback */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-xl z-[999999] text-sm shadow-md">
          {toast}
        </div>
      )}

      <div className="px-5 py-1">
        <h1 className="text-xl font-semibold">{user.name}</h1>
        {user.private ? (
          <p className="text-xs text-gray-500">
            <TranslateText text="درج خاص" />
          </p>
        ) : postsCount === null ? (
          <div className="text-xs text-gray-500 animate-pulse">
            <TranslateText text="جارى التحميل" />
          </div>
        ) : postsCount === 0 ? (
          <p className="text-xs text-gray-500">
            <TranslateText text="لا يوجد فضفضات" />
          </p>
        ) : (
          <div className="text-xs text-gray-500">
            {postsCount === 1000 ? (
              <TranslateText text="1000+ فضفضة" />
            ) : (
              <span>
                {postsCount} <TranslateText text="فضفضة" />
              </span>
            )}
          </div>
        )}
      </div>

      <div className="min-h-screen overflow-hidden">
        <div className="relative overflow-y-auto h-[calc(100vh-100px)] scrollbar-hidden">
          {/* Banner */}
          <div className="relative">
            <div
              className="h-[167px] w-full"
              style={{
                background:
                  "linear-gradient(90deg,#fff0f0,#e65b5b 25%,#d23e3e 70%,#c62828)",
              }}
            >
              <div className="flex px-4 w-full items-end h-full flex-row gap-3">
                <ClientVisibilityGate
                  profileId={res.userpersonaldata._id}
                  profilePrivate={res.userpersonaldata.private}
                  fallback={
                    <div>
                      <div className="relative w-28 h-28 md:w-36 md:h-36 z-[99] transform translate-y-1/2">
                        <div className="relative w-full h-full rounded-t-[60px] rounded-b-[45px] border-2 border-white overflow-hidden">
                          <Image
                            src={avatar}
                            alt={user.name ?? "Avatar"}
                            width={140}
                            height={136}
                            unoptimized
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute bottom-0 left-0 w-full h-[42%] backdrop-blur-md flex items-center justify-center text-white bg-gradient-to-b from-[#D72229]/15 to-[#F92428]/50 z-10">
                            <p>
                              <TranslateText text="درج خاص" />
                            </p>
                          </div>
                        </div>
                        {user.vip && (
                          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                            <img
                              src="/icons/vip.svg"
                              alt="VIP"
                              className="w-6 h-6 md:w-8 md:h-8"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  }
                >
                  <button
                    aria-label={showImageLabel}
                    onClick={openOverlay}
                    className="relative w-[136px] h-[136px] md:w-36 md:h-36 rounded-[60px] border-2 border-white overflow-hidden bg-gray-100 transform translate-y-1/2 focus:outline-none z-[99]"
                  >
                    <Image
                      src={avatar}
                      alt={user.name ?? "Avatar"}
                      width={150}
                      height={150}
                      unoptimized
                      className="object-cover cursor-pointer w-full h-full"
                    />
                  </button>
                </ClientVisibilityGate>

                <div className="mb-2">
                  <h1 className="text-xl md:text-2xl font-semibold text-white leading-tight">
                    {user.name}
                  </h1>
                  {user.username && (
                    <p className="text-sm text-white/90 mt-[1px] leading-none">
                      @{user.username}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="relative">
            <div className="md:px-5 py-3 border-b border-[#F6F6f6]">
              <div className="flex flex-col gap-6">
                <div className="flex-1 text-start">
                  <div className="ms-[150px] flex justify-between">
                    {/* <p
                      className="text-sm text-[#B6B7B7] max-w-[280px] cursor-pointer select-none line-clamp-2"
                      onClick={() => setAboutExpanded(!aboutExpanded)}
                    >
                      <TranslateText
                        text={
                          user.about ||
                          "أنا هنا لأتواصل وأكتشف عوالم جديدة مع أشخاص يشبهونني"
                        }
                      />
                    </p> */}
                     <p
                className={`text-sm text-[#B6B7B7] max-w-[280px] cursor-pointer select-none ${
                  !aboutExpanded ? 'line-clamp-2' : ''
                }`}
                onClick={() => setAboutExpanded(!aboutExpanded)}
              >
                <TranslateText
                  text={
                    user.about ||
                    "أنا هنا لأتواصل وأكتشف عوالم جديدة مع أشخاص يشبهونني"
                  }
                />
              </p>
                    <div className="flex gap-1">
                      {id ? (
                        <ActionAreaClient
                          followingId={id}
                          serverFollowerIds={followerIds}
                          receiverId={user._id}
                          username={user.name}
                        />
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-7">
                    <div
                      onClick={() => setIsRateOverlayOpen(true)}
                      className="cursor-pointer select-none"
                    >
                      {rateCount === 0 ? (
                        <p className="text-sm underline text-[#D72229] text-[15px]">
                          <TranslateText text="لم يحصل هذا الدرج علي اي تقييم" />
                        </p>
                      ) : (
                        <div className="m-0 text-sm font-semibold underline text-[#D72229]">
                          <span className="text-xs">
                            <TranslateText text="حصل هذا الدرج علي" />
                          </span>{" "}
                          {Number(rateCount.toFixed(2))}{" "}
                          <TranslateText text="نجوم" />
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4 mt-1 text-[15px]">
                      <div className="flex gap-1 items-center justify-center">
                        <div className="text-sm text-[#B6B7B7]">
                          <TranslateText text="صاحبي هنا" />
                        </div>
                        <div className="text-md font-semibold">
                          {followersCount}
                        </div>
                      </div>
                      <div className="flex gap-1 items-center justify-center">
                        <h3 className="text-sm font-semibold text-[#B6B7B7]">
                          <TranslateText text="متابعين" />
                        </h3>
                        <div className="text-md font-semibold">
                          {followingCount}
                        </div>
                      </div>
                      <div className="flex gap-1 items-center justify-center">
                        <div className="text-sm text-[#B6B7B7]">
                          <TranslateText text="مشاهدة" />
                        </div>
                        <div className="text-md font-semibold">{viewsCount}</div>
                      </div>
                    </div>

                    <ClientVisibilityGate
                      profileId={res.userpersonaldata._id}
                      profilePrivate={res.userpersonaldata.private}
                    >
                      <FollowersMenu
                        followers={res.followers ?? []}
                        title={<TranslateText text="اطلع الان علي جميع المتابعين" />}
                        limit={3}
                      />
                    </ClientVisibilityGate>
                  </div>
                </div>
              </div>
            </div>

            <ClientVisibilityGate
              profileId={res.userpersonaldata._id}
              isPrivate={res.userpersonaldata.private}
              profilePrivate={res.userpersonaldata.private}
              fallback={
                <div className="flex items-center justify-center flex-col text-center pt-3">
                  <h3 className="text-xl">
                    <TranslateText text="درج خاص" />
                  </h3>
                  <p className="text-[#B6B7B7] max-w-[350px]">
                    <TranslateText text="مرحبا هذا الدرج خاص الآن فقط من اقبل متابعتهم يمكنهم رؤية فضفضاتي" />
                  </p>
                </div>
              }
            >
              <PostsFeed />
            </ClientVisibilityGate>
          </div>
        </div>
      </div>

      {/* Image Overlay */}
      {isOverlayOpen && !showQROverlay && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 w-screen h-screen z-[99999] flex items-center justify-center p-4"
        >
          <div
            onClick={closeOverlay}
            className="absolute inset-0 bg-black w-full h-full"
          />
          <div className="relative z-[100000] max-w-[720px] w-full max-h-[90vh] rounded-2xl">
            <div className="w-full flex justify-center items-center p-6">
              <Image
                src={avatar}
                alt={user.name ?? "Avatar"}
                width={600}
                height={600}
                unoptimized
                className="object-contain w-[500px] h-[500px] rounded-[170px]"
              />
            </div>

            <div className="flex items-center justify-center gap-4 absolute bottom-[-70px] left-1/2 transform -translate-x-1/2">
              <button
                onClick={handleOpenQR}
                className="w-[60px] h-[60px] rounded-full bg-[#000000BF] border-2 border-[#FFFFFF26] shadow-sm hover:bg-[#000000]/90 transition-all flex items-center justify-center cursor-pointer"
                aria-label={qrCodeLabel}
              >
                <img
                  src="/icons/Vector (21).svg"
                  alt={qrCodeLabel}
                  className="w-[21px] h-[22px]"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </button>

              <button
                onClick={downloadQRImage}
                className="w-[60px] h-[60px] rounded-full bg-[#000000BF] border-2 border-[#FFFFFF26] shadow-sm hover:bg-[#000000]/90 transition-all flex items-center justify-center cursor-pointer"
                aria-label={downloadLabel}
              >
                <img
                  src="/icons/Group 9307.svg"
                  alt={downloadLabel}
                  className="w-[21px] h-[22px]"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </button>

              <button
                onClick={copyProfileLink}
                className="w-[60px] h-[60px] rounded-full bg-[#000000BF] border-2 border-[#FFFFFF26] shadow-sm hover:bg-[#000000]/90 transition-all flex items-center justify-center cursor-pointer"
                aria-label={shareLabel}
              >
                <img
                  src="/icons/Vector (20).svg"
                  alt={shareLabel}
                  className="w-[21px] h-[22px]"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </button>
            </div>

            <button
              onClick={closeOverlay}
              aria-label={closeLabel}
              className="px-3 py-3 cursor-pointer absolute top-[-30px] left-1/2 transform -translate-x-1/2 rounded-full shadow-sm bg-[#FFFFFF]/15 hover:bg-[#FFFFFF]/30 transition"
            >
              <img src="/icons/close.svg" alt={closeLabel} />
            </button>
          </div>
        </div>
      )}

      {/* QR Overlay */}
      {showQROverlay && (
        <div
          className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[99999] p-4"
          onClick={handleCloseQR}
        >
          <div
            className="relative flex flex-col items-center gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* QR Card */}
            <div
              ref={qrCardRef}
              className="relative flex flex-col items-center gap-2 py-6 px-5 rounded-[35px] shadow-2xl flex-shrink-0"
              style={{
                width: "411px",
                height: "550px",
                maxWidth: "95vw",
                maxHeight: "75vh",
                backgroundImage: "url('/imgs/Group 9318.svg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
              dir={dir}
            >
              <button
                onClick={handleCloseQR}
                aria-label={closeLabel}
                className="px-3 py-3 cursor-pointer absolute top-[-55px] left-1/2 transform -translate-x-1/2 rounded-full shadow-sm bg-[#FFFFFF]/15 hover:bg-[#FFFFFF]/30 transition z-50"
              >
                <img src="/icons/close.svg" alt={closeLabel} />
              </button>

              <Link href="/" className="flex justify-center">
                <img
                  src="/logo-red.png"
                  alt="BO CHAT"
                  className="w-[40px] h-auto brightness-0 invert"
                />
              </Link>

              <div className="w-[209px] h-[250px] bg-white rounded-[18px] overflow-hidden shadow-lg flex-shrink-0">
                <div
                  className="h-[41px] bg-[#FCE9E9] flex items-center justify-center gap-0 cursor-pointer hover:opacity-70 transition"
                  onClick={() => {
                    const username = user.username || user.name;
                    navigator.clipboard.writeText(username);
                    setToast(`تم نسخ الحساب: ${username}`);
                    setTimeout(() => setToast(null), 2000);
                  }}
                >
                  <span
                    className="text-[#D72229] font-bold text-[18px] leading-none"
                    style={{ fontFamily: "Inter" }}
                  >
                    {user.username || user.name}
                  </span>
                  <span
                    className="text-[#D72229] font-bold text-[18px] leading-none"
                    style={{ fontFamily: "Inter" }}
                  >
                    @
                  </span>
                </div>

                <div className="w-[209px] h-[209px] bg-white rounded-b-[18px] flex items-center justify-center overflow-hidden flex-shrink-0">
                  {isClient && profileUrl && (
                    <StyledQRCode
                      value={profileUrl}
                      size={205}
                      image="/imgs/876771 copy 1.svg"
                      imageSize={0.3}
                    />
                  )}
                </div>
              </div>

              <p
                className="text-center text-black text-[13px] font-medium mt-1"
                style={{ fontFamily: "Cairo" }}
              >
                <TranslateText text="انسخ اسم المستخدم أو امسح الكود لتضيفني" />
              </p>

              <div className="text-white text-center flex flex-col items-center w-full mt-8">
                <p
                  className="font-bold text-[20px] leading-[50px] w-[334px] h-[20px]"
                  style={{ fontFamily: "Cairo", color: "#FFFFFF" }}
                >
                  <TranslateText text="انضم إلي في رحلتي على بو شات" />
                </p>
                <p
                  className="text-[14px] leading-[20px] w-[210px] h-[20px] mt-[27px]"
                  style={{ fontFamily: "Cairo", color: "#FFFFFF" }}
                >
                  <TranslateText text="تفقد الملف الشخصي الخاص بي الآن" />
                </p>

                <div className="flex items-center justify-center gap-4 w-full mt-6 px-4">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.pandaoracle.bochat&pcampaignid=web_share"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[120px] h-[40px] rounded-md overflow-hidden flex items-center justify-center shadow-md hover:opacity-90 transition active:scale-95"
                  >
                    <img
                      src="/imgs/google-play.svg"
                      alt="Google Play"
                      className="w-full h-full object-fill"
                    />
                  </a>
                  <a
                    href="https://apps.apple.com/us/app/bo-chat/id6749073096"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[120px] h-[40px] rounded-md overflow-hidden flex items-center justify-center shadow-md hover:opacity-90 transition active:scale-95"
                  >
                    <img
                      src="/imgs/apple.svg"
                      alt="App Store"
                      className="w-full h-full object-fill"
                    />
                  </a>
                </div>

                <div className="mt-2 flex justify-center w-full">
                  <img
                    src="/imgs/اكتب هنا ما تبحث عنه.svg"
                    alt="BO CHAT"
                    className="w-[200px] h-auto"
                  />
                </div>
              </div>
            </div>

            {/* Bottom action buttons */}
            <div className="flex items-center justify-center gap-4 w-full mt-2 z-[999999]">
              <button
                onClick={handleCloseQR}
                className="w-[60px] h-[60px] rounded-full bg-[#D72229] border-2 border-[#FFFFFF26] shadow-lg flex items-center justify-center cursor-pointer transition-all scale-105"
                aria-label={closeQRCodeLabel}
              >
                <img
                  src="/icons/Vector (21).svg"
                  alt={closeQRCodeLabel}
                  className="w-[21px] h-[22px]"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </button>

              <button
                onClick={downloadQRImage}
                className="w-[60px] h-[60px] rounded-full bg-[#000000BF] border-2 border-[#FFFFFF26] shadow-lg hover:bg-[#000000]/90 transition-all flex items-center justify-center cursor-pointer"
                aria-label={downloadLabel}
              >
                <img
                  src="/icons/Group 9307.svg"
                  alt={downloadLabel}
                  className="w-[21px] h-[22px]"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </button>

              <button
                onClick={copyProfileLink}
                className="w-[60px] h-[60px] rounded-full bg-[#000000BF] border-2 border-[#FFFFFF26] shadow-lg hover:bg-[#000000]/90 transition-all flex items-center justify-center cursor-pointer"
                aria-label={shareLabel}
              >
                <img
                  src="/icons/Vector (20).svg"
                  alt={shareLabel}
                  className="w-[21px] h-[22px]"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}