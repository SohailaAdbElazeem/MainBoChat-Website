// // src>app>profile>_compoents>ActionMenu.tsx
// "use client";

// import React, { useEffect, useRef, useState, useCallback } from "react";
// import toast from "react-hot-toast";
// import { useTranslation } from "@/contexts/TranslationContext";

// type Rating = {
//   _id: string;
//   name: string;
//   username: string;
//   userimg: string;
//   stars: number;
//   comment: string;
//   createdAt: string;
//   ratinguserid: string;
// };

// type ActionMenuProps = {
//   onMessage?: () => void;
//   onReport?: (reason?: string) => void;
//   onBlock?: () => void;
//   propReporterId?: string;
//   propReporterEmail?: string;
//   reportedUserId?: string;
//   reportedPostId?: string;
//   ratingApiBase?: string;
// };

// export default function ActionMenu({
//   onMessage,
//   onReport,
//   onBlock,
//   propReporterId,
//   propReporterEmail,
//   reportedUserId,
//   reportedPostId,
//   ratingApiBase = "https://bo-chat.space",
// }: ActionMenuProps) {
//   const { language, translate } = useTranslation();
//   const [translations, setTranslations] = useState<Record<string, any>>({});

//   // تحميل الترجمات
//   useEffect(() => {
//     const loadTranslations = async () => {
//       const keys = {
//         rate: "تقييم",
//         report: "ابلاغ",
//         block: "حجب",
//         reportTitle: "ابلاغ عن الدرج",
//         reportQuestion: "ليه بتبلغ عن الدرج ده؟",
//         close: "اغلاق",
//         noRatings: "مافيش تقييمات لسه",
//         noRatingsSub: "ماحدش قيّم لسه خليك أنت أول واحد يكسر الصمت",
//         loadingRatings: "جاري تحميل التقييمات...",
//         writeComment: "اكتب تقييمك هنا",
//         submitRating: "تقييم",
//         submitting: "جاري...",
//         delete: "حذف",
//         reportUser: "ابلاغ",
//         successTitle: "ابلاغ عن الدرج",
//         successMessage:
//           "تم استلام بلاغك\nهيساعدنا بلاغك في مراجعة المحتوى والتأكد إن كل حاجة ماشية بشكل آمن وصحيح",
//         reportReasons: [
//           "محتوى غير لائق",
//           "معلومات مضللة",
//           "رسائل مزعجة أو إعلان",
//           "خطاب كراهية أو تمييز",
//           "نشر معلومات شخصية",
//         ],
//       };

//       const translatedReasons = await Promise.all(
//         keys.reportReasons.map((r) => translate(r))
//       );

//       const [
//         rate,
//         report,
//         block,
//         reportTitle,
//         reportQuestion,
//         close,
//         noRatings,
//         noRatingsSub,
//         loadingRatings,
//         writeComment,
//         submitRating,
//         submitting,
//         deleteText,
//         reportUserText,
//         successTitleText,
//         successMessageText,
//       ] = await Promise.all([
//         translate(keys.rate),
//         translate(keys.report),
//         translate(keys.block),
//         translate(keys.reportTitle),
//         translate(keys.reportQuestion),
//         translate(keys.close),
//         translate(keys.noRatings),
//         translate(keys.noRatingsSub),
//         translate(keys.loadingRatings),
//         translate(keys.writeComment),
//         translate(keys.submitRating),
//         translate(keys.submitting),
//         translate(keys.delete),
//         translate(keys.reportUser),
//         translate(keys.successTitle),
//         translate(keys.successMessage),
//       ]);

//       setTranslations({
//         rate,
//         report,
//         block,
//         reportTitle,
//         reportQuestion,
//         close,
//         noRatings,
//         noRatingsSub,
//         loadingRatings,
//         writeComment,
//         submitRating,
//         submitting,
//         delete: deleteText,
//         reportUser: reportUserText,
//         successTitle: successTitleText,
//         successMessage: successMessageText,
//         reportReasons: translatedReasons,
//       });
//     };

//     loadTranslations();
//   }, [language, translate]);

//   // ─── باقي الكود (نفس الكود الأصلي مع استبدال النصوص) ──────────────

//   const [open, setOpen] = useState(false);
//   const [showReportReasons, setShowReportReasons] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [selectedReason, setSelectedReason] = useState<string>("");
//   const [isReporting, setIsReporting] = useState(false);
//   const menuRef = useRef<HTMLDivElement | null>(null);
//   const modalRef = useRef<HTMLDivElement | null>(null);

//   const [isRateOverlayOpen, setIsRateOverlayOpen] = useState(false);
//   const [ratings, setRatings] = useState<Rating[]>([]);
//   const [ratingsLoading, setRatingsLoading] = useState(false);
//   const [newRatingText, setNewRatingText] = useState("");
//   const [newRatingStars, setNewRatingStars] = useState(5);
//   const [hoverRating, setHoverRating] = useState<number | null>(null);
//   const [isSubmittingRating, setIsSubmittingRating] = useState(false);

//   const [menuState, setMenuState] = useState<{
//     id: string | null;
//     top: number;
//     left: number;
//   }>({ id: null, top: 0, left: 0 });

//   const getUserData = () => {
//     try {
//       const raw = localStorage.getItem("userData");
//       if (!raw) return null;
//       return JSON.parse(raw);
//     } catch {
//       return null;
//     }
//   };

//   const getAccessToken = (): string => {
//     return localStorage.getItem("accessToken") || "";
//   };

//   const getReporterId = (): string => {
//     const data = getUserData();
//     return data?._id || "";
//   };

//   const getReporterEmail = (): string => {
//     const data = getUserData();
//     return data?.useremail || data?.useremail2 || data?.email || "";
//   };

//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     }
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     function handleEscape(e: KeyboardEvent) {
//       if (e.key === "Escape") {
//         if (showSuccessModal) {
//           setShowSuccessModal(false);
//         } else if (showReportReasons) {
//           setShowReportReasons(false);
//           setSelectedReason("");
//         } else if (isRateOverlayOpen) {
//           setIsRateOverlayOpen(false);
//         }
//       }
//     }
//     document.addEventListener("keydown", handleEscape);
//     return () => document.removeEventListener("keydown", handleEscape);
//   }, [showReportReasons, showSuccessModal, isRateOverlayOpen]);

//   useEffect(() => {
//     if (showReportReasons || showSuccessModal || isRateOverlayOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [showReportReasons, showSuccessModal, isRateOverlayOpen]);

//   useEffect(() => {
//     if (isRateOverlayOpen && reportedUserId) {
//       fetchRatings();
//     }
//   }, [isRateOverlayOpen, reportedUserId]);

//   const fetchRatings = useCallback(async () => {
//     if (!reportedUserId) {
//       console.warn("⚠️ reportedUserId مفقود");
//       setRatings([]);
//       return;
//     }

//     const token = getAccessToken();
//     let guestId = "";
//     try {
//       const raw = localStorage.getItem("userData");
//       if (raw) {
//         const parsed = JSON.parse(raw);
//         guestId = parsed._id;
//       }
//     } catch (e) {
//       console.error("خطأ في قراءة userData", e);
//     }

//     if (!guestId || !token) {
//       console.warn("⚠️ guestId أو التوكن مفقود");
//       setRatings([]);
//       return;
//     }

//     setRatingsLoading(true);
//     try {
//       const url = `${ratingApiBase}/rate/${reportedUserId}?guestid=${guestId}`;
//       console.log("🔍 جلب التقييمات من:", url);
//       const res = await fetch(url, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) {
//         throw new Error(`HTTP ${res.status} - ${res.statusText}`);
//       }
//       const data = await res.json();
//       console.log("📦 استجابة التقييمات:", data);
//       if (Array.isArray(data)) {
//         setRatings(data);
//       } else {
//         setRatings([]);
//       }
//     } catch (error) {
//       console.error("❌ خطأ في جلب التقييمات:", error);
//       toast.error("حدث خطأ أثناء تحميل التقييمات");
//       setRatings([]);
//     } finally {
//       setRatingsLoading(false);
//     }
//   }, [reportedUserId, ratingApiBase]);

//   useEffect(() => {
//     console.log("overlay:", isRateOverlayOpen, "user:", reportedUserId);
//     if (isRateOverlayOpen && reportedUserId) {
//       fetchRatings();
//     }
//   }, [isRateOverlayOpen, reportedUserId]);

//   const handleSubmitRating = async () => {
//     const userData = getUserData();
//     if (!userData?._id) {
//       toast.error("يرجى تسجيل الدخول أولاً");
//       return;
//     }
//     if (!reportedUserId) {
//       toast.error("لا يوجد مستخدم مستهدف للتقييم");
//       return;
//     }

//     setIsSubmittingRating(true);
//     try {
//       const res = await fetch(`${ratingApiBase}/rate`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${getAccessToken()}`,
//         },
//         body: JSON.stringify({
//           stars: newRatingStars,
//           comment: newRatingText.trim(),
//           rateduserid: reportedUserId,
//           ratinguserid: userData._id,
//         }),
//       });
//       if (!res.ok) {
//         const text = await res.text();
//         throw new Error(text || "فشل إرسال التقييم");
//       }
//       toast.success("تم إرسال تقييمك بنجاح");
//       setNewRatingText("");
//       setNewRatingStars(5);
//       await fetchRatings();
//     } catch (err: any) {
//       console.error("Submit rating error:", err);
//       toast.error(err.message || "حدث خطأ أثناء إرسال التقييم");
//     } finally {
//       setIsSubmittingRating(false);
//     }
//   };

//   const handleDeleteRating = async (ratingId: string) => {
//     if (!ratingId) return;
//     try {
//       const res = await fetch(`${ratingApiBase}/rate/${ratingId}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${getAccessToken()}`,
//         },
//       });
//       if (!res.ok) {
//         const text = await res.text();
//         throw new Error(text || "فشل حذف التقييم");
//       }
//       toast.success("تم حذف التقييم");
//       setMenuState({ id: null, top: 0, left: 0 });
//       await fetchRatings();
//     } catch (err: any) {
//       console.error("Delete rating error:", err);
//       toast.error(err.message || "حدث خطأ أثناء حذف التقييم");
//     }
//   };

//   const handleReportUserFromRating = async (userId: string, userName: string) => {
//     if (!userId) {
//       toast.error("بيانات المستخدم غير مكتملة");
//       return;
//     }
//     const reporterId = getReporterId();
//     const reporterEmail = getReporterEmail();
//     if (!reporterId || !reporterEmail) {
//       toast.error("يرجى تسجيل الدخول أولاً");
//       return;
//     }

//     try {
//       const res = await fetch(`${ratingApiBase}/report/${reporterId}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${getAccessToken()}`,
//         },
//         body: JSON.stringify({
//           userid: userId,
//           email: reporterEmail,
//         }),
//       });
//       if (!res.ok) {
//         const text = await res.text();
//         throw new Error(text || "فشل إرسال البلاغ");
//       }
//       toast.success(`تم الإبلاغ عن ${userName}`);
//       setMenuState({ id: null, top: 0, left: 0 });
//     } catch (err: any) {
//       console.error("Report user error:", err);
//       toast.error(err.message || "حدث خطأ أثناء الإبلاغ");
//     }
//   };

//   const handleBlockUserFromRating = async (userId: string, userName: string) => {
//     if (!userId) {
//       toast.error("بيانات المستخدم غير مكتملة");
//       return;
//     }
//     const reporterId = getReporterId();
//     if (!reporterId) {
//       toast.error("يرجى تسجيل الدخول أولاً");
//       return;
//     }
//     try {
//       const res = await fetch(`${ratingApiBase}/block/${reporterId}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${getAccessToken()}`,
//         },
//         body: JSON.stringify({
//           blockedid: userId,
//         }),
//       });
//       if (!res.ok) {
//         const text = await res.text();
//         throw new Error(text || "فشل حجب المستخدم");
//       }
//       toast.success(`تم حجب ${userName}`);
//       setMenuState({ id: null, top: 0, left: 0 });
//     } catch (err: any) {
//       console.error("Block user error:", err);
//       toast.error(err.message || "حدث خطأ أثناء الحجب");
//     }
//   };

//   const toggleRatingMenu = (ratingId: string, e: React.MouseEvent) => {
//     e.stopPropagation();
//     const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
//     if (menuState.id === ratingId) {
//       setMenuState({ id: null, top: 0, left: 0 });
//       return;
//     }
//     setMenuState({
//       id: ratingId,
//       top: rect.bottom + 8,
//       left: rect.left - 80,
//     });
//   };

//   useEffect(() => {
//     function handleOutside(e: MouseEvent) {
//       if (menuState.id) {
//         const target = e.target as HTMLElement;
//         if (!target.closest("[data-rating-menu]")) {
//           setMenuState({ id: null, top: 0, left: 0 });
//         }
//       }
//     }
//     document.addEventListener("click", handleOutside);
//     return () => document.removeEventListener("click", handleOutside);
//   }, [menuState.id]);

//   const handleOpenRatingOverlay = () => {
//     setOpen(false);
//     if (!reportedUserId) {
//       toast.error("لا يمكن تحميل التقييمات: معرّف المستخدم غير متوفر");
//       return;
//     }
//     setIsRateOverlayOpen(true);
//   };

//   const handleCloseRatingOverlay = () => {
//     setIsRateOverlayOpen(false);
//     setMenuState({ id: null, top: 0, left: 0 });
//   };

//   const handleReportClick = () => {
//     setOpen(false);
//     setShowReportReasons(true);
//     setSelectedReason("");
//     setShowSuccessModal(false);
//   };

//   const handleCloseReasonsModal = () => {
//     setShowReportReasons(false);
//     setSelectedReason("");
//   };

//   const handleReasonSelect = async (reasonLabel: string) => {
//     const reporterId = getReporterId();
//     const reporterEmail = getReporterEmail();
//     if (!reporterId || !reporterEmail) {
//       toast.error("يرجى تسجيل الدخول أولاً");
//       return;
//     }

//     setSelectedReason(reasonLabel);
//     setIsReporting(true);

//     try {
//       const body: any = {
//         reporter: reporterId,
//         report: reasonLabel,
//         email: reporterEmail,
//       };
//       if (reportedUserId) body.reportedUserId = reportedUserId;
//       if (reportedPostId) body.postId = reportedPostId;

//       const res = await fetch(`${ratingApiBase}/user/report`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${getAccessToken()}`,
//         },
//         body: JSON.stringify(body),
//       });

//       if (!res.ok) {
//         const text = await res.text();
//         throw new Error(text || "فشل إرسال البلاغ");
//       }

//       onReport?.(reasonLabel);
//       setShowReportReasons(false);
//       setShowSuccessModal(true);
//       toast.success("تم إرسال البلاغ بنجاح");
//     } catch (error: any) {
//       console.error("Report error:", error);
//       toast.error(error.message || "حدث خطأ أثناء إرسال البلاغ");
//     } finally {
//       setIsReporting(false);
//     }
//   };

//   const handleCloseSuccessModal = () => {
//     setShowSuccessModal(false);
//     setSelectedReason("");
//   };

//   // أسباب البلاغ من الترجمة
//   const reportReasons = translations.reportReasons?.length
//     ? translations.reportReasons.map((label: string, index: number) => ({
//         id: ["inappropriate", "misleading", "spam", "harmful", "personal_info"][index],
//         label,
//       }))
//     : [
//         { id: "inappropriate", label: "محتوى غير لائق" },
//         { id: "misleading", label: "معلومات مضللة" },
//         { id: "spam", label: "رسائل مزعجة أو إعلان" },
//         { id: "harmful", label: "خطاب كراهية أو تمييز" },
//         { id: "personal_info", label: "نشر معلومات شخصية" },
//       ];

//   const currentUser = getUserData();

//   // ─── Render ────────────────────────────────────────────────────────
//   return (
//     <>
//       {/* ─── Main Action Menu ────────────────────────────────────────── */}
//       <div className="relative z-[999]" ref={menuRef}>
//         <button
//           onClick={() => setOpen((s) => !s)}
//           aria-haspopup="true"
//           aria-expanded={open}
//           className="block p-3 rounded-[17px] cursor-pointer mt-4 w-[40px] h-[40px] flex items-center justify-center border border-[#EBEBEB] bg-white"
//         >
//           <img
//             src="/imgs/dots.svg"
//             alt="menu"
//             className={`w-4 h-4 focus:transform focus:rotate-90 ${
//               open ? "rotate-90 transition-all" : "rotate-0 transition-all"
//             }`}
//           />
//         </button>

//         <div
//           className={`absolute top-20 left-0 transform origin-top-right transition-all duration-150 ${
//             open
//               ? "scale-100 opacity-100 pointer-events-auto"
//               : "scale-95 opacity-0 pointer-events-none"
//           }`}
//         >
//           <div
//             className="w-64 rounded-[30px] p-3 shadow-2xl bg-black/10 backdrop-blur-md border border-white/30"
//             style={{ minWidth: 240 }}
//           >
//             <div className="flex flex-col gap-3 mt-1">
//               {/* ── تقييم ── */}
//               <button
//                 onClick={handleOpenRatingOverlay}
//                 className="flex items-center gap-3 px-3 py-3 rounded-[20px] border border-[#D8D8D8] cursor-pointer bg-white/40 hover:backdrop-blur-sm"
//               >
//                 <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600">
//                   <img src="/icons/rate.svg" alt="rate" />
//                 </div>
//                 <div className="text-right">
//                   <div className="text-[#D72229] font-semibold">{translations.rate || "تقييم"}</div>
//                 </div>
//               </button>

//               {/* ── ابلاغ ── */}
//               <button
//                 onClick={handleReportClick}
//                 disabled={isReporting}
//                 className="flex items-center gap-3 px-3 py-3 rounded-[20px] border border-[#D8D8D8] cursor-pointer bg-[#000]/40 hover:backdrop-blur-sm disabled:opacity-50"
//               >
//                 <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600">
//                   <img src="/icons/flag.svg" className="invert brightness-0" alt="" />
//                 </div>
//                 <div className="text-right">
//                   <div className="text-white/90 font-semibold">
//                     {isReporting ? translations.submitting || "جاري..." : translations.report || "ابلاغ"}
//                   </div>
//                 </div>
//               </button>

//               {/* ── حجب ── */}
//               <button
//                 onClick={() => {
//                   setOpen(false);
//                   onBlock?.();
//                 }}
//                 className="flex items-center gap-3 px-3 py-3 rounded-[20px] border border-[#D8D8D8] cursor-pointer bg-[#000]/40 hover:backdrop-blur-sm"
//               >
//                 <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600">
//                   <img src="/icons/block.svg" alt="" />
//                 </div>
//                 <div className="text-right">
//                   <div className="text-white/90 font-semibold">{translations.block || "حجب"}</div>
//                 </div>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ─── Report Reasons Modal ───────────────────────────────────── */}
//       {showReportReasons && (
//         <div
//           className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/50 transition-all duration-200"
//           onClick={handleCloseReasonsModal}
//         >
//           <div
//             ref={modalRef}
//             className="relative flex flex-col text-right"
//             style={{
//               width: "690px",
//               maxHeight: "90vh",
//               height: "auto",
//               borderRadius: "25px",
//               background: "linear-gradient(270deg, #FFFFFF 0%, #8D8D8D 79.81%)",
//               backdropFilter: "blur(30px)",
//               boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)",
//             }}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={handleCloseReasonsModal}
//               className="absolute left-4 top-4 text-gray-500 hover:text-gray-800 transition-colors z-10"
//               aria-label={translations.close || "إغلاق"}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>

//             <div
//               className="w-full h-[55px] flex items-center px-6 text-black font-semibold flex-shrink-0"
//               style={{
//                 fontSize: "20px",
//                 lineHeight: "100%",
//                 background: "#FFFFFF40",
//                 backdropFilter: "blur(10px)",
//                 borderTopLeftRadius: "25px",
//                 borderTopRightRadius: "25px",
//                 textAlign: "right",
//               }}
//             >
//               {translations.reportTitle || "ابلاغ عن الدرج"}
//             </div>

//             <div
//               className="w-full flex items-center justify-center flex-shrink-0"
//               style={{ minHeight: "47px" }}
//             >
//               <p
//                 className="text-black text-center"
//                 style={{
//                   fontSize: "25px",
//                   fontWeight: 500,
//                   lineHeight: "100%",
//                   padding: "30px 0 12px",
//                 }}
//               >
//                 {translations.reportQuestion || "ليه بتبلغ عن الدرج ده؟"}
//               </p>
//             </div>

//             <div
//               className="mt-6 w-full px-8 space-y-4 flex-1"
//               style={{
//                 overflowY: "scroll",
//                 scrollbarWidth: "none",
//                 msOverflowStyle: "none",
//                 maxHeight: "calc(90vh - 200px)",
//               }}
//             >
//               {reportReasons.map((reason) => (
//                 <div
//                   key={reason.id}
//                   onClick={() => !isReporting && handleReasonSelect(reason.label)}
//                   className={`flex items-center gap-3 cursor-pointer group transition-all hover:bg-white/20 rounded-[19px] ${
//                     isReporting ? "opacity-50 pointer-events-none" : ""
//                   }`}
//                   style={{
//                     width: "100%",
//                     height: "66px",
//                     borderRadius: "19px",
//                     border: "1px solid #A1A1A1",
//                     padding: "0 16px",
//                   }}
//                 >
//                   <div
//                     className="flex items-center justify-center flex-shrink-0"
//                     style={{
//                       width: "45px",
//                       height: "45px",
//                       backgroundColor: "#A1A1A1",
//                       borderRadius: "50%",
//                     }}
//                   >
//                     <img
//                       src="/imgs/Vector (6).svg"
//                       alt="report icon"
//                       style={{
//                         width: "18px",
//                         height: "20px",
//                         objectFit: "contain",
//                       }}
//                     />
//                   </div>
//                   <span
//                     className="text-black flex-1"
//                     style={{
//                       fontSize: "18px",
//                       fontWeight: 400,
//                       lineHeight: "100%",
//                       textAlign: "right",
//                     }}
//                   >
//                     {reason.label}
//                   </span>
//                   <img
//                     src="/imgs/Group 6836.svg"
//                     alt="arrow"
//                     style={{
//                       width: "6.5px",
//                       height: "13px",
//                       objectFit: "contain",
//                     }}
//                   />
//                 </div>
//               ))}
//             </div>
//             <div className="h-4 flex-shrink-0"></div>
//           </div>
//         </div>
//       )}

//       {/* ─── Success Modal ───────────────────────────────────────────── */}
//       {showSuccessModal && (
//         <div
//           className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-200"
//           onClick={handleCloseSuccessModal}
//         >
//           <div
//             className="relative flex flex-col items-center text-center"
//             style={{
//               width: "690px",
//               height: "341px",
//               borderRadius: "25px",
//               background: "linear-gradient(270deg, #FFFFFF 0%, #8D8D8D 79.81%)",
//               backdropFilter: "blur(30px)",
//               boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
//             }}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h2
//               className="w-full h-[55px] flex items-center px-6 text-black font-semibold flex-shrink-0"
//               style={{
//                 fontSize: "20px",
//                 lineHeight: "100%",
//                 background: "#FFFFFF40",
//                 backdropFilter: "blur(10px)",
//                 borderTopLeftRadius: "25px",
//                 borderTopRightRadius: "25px",
//               }}
//             >
//               {translations.successTitle || "ابلاغ عن الدرج"}
//             </h2>

//             <div className="text-right w-full flex-1 flex flex-col justify-center items-center">
//               <div className="text-center">
//                 <p
//                   className="text-black mb-3 mt-4"
//                   style={{ fontSize: "25px", fontWeight: 400, lineHeight: "1.4" }}
//                 >
//                   {translations.successMessage?.split("\n")[0] || "تم استلام بلاغك"}
//                 </p>
//                 <p
//                   className="text-black"
//                   style={{ fontSize: "25px", fontWeight: 400, lineHeight: "1.4" }}
//                 >
//                   {translations.successMessage?.split("\n")[1] ||
//                     "هيساعدنا بلاغك في مراجعة المحتوى والتأكد إن كل حاجة ماشية بشكل آمن وصحيح"}
//                 </p>
//               </div>
//               <hr
//                 style={{
//                   width: "100%",
//                   border: "1px solid #70707080",
//                   marginTop: "20px",
//                 }}
//               />
//             </div>

//             <button
//               onClick={handleCloseSuccessModal}
//               className="mt-6 mb-6 bg-black text-white font-semibold rounded-[23px] hover:bg-gray-800 transition-colors flex-shrink-0"
//               style={{
//                 width: "300px",
//                 height: "60px",
//                 fontSize: "20px",
//                 fontWeight: 600,
//                 lineHeight: "100%",
//                 borderRadius: "23px",
//               }}
//             >
//               {translations.close || "اغلاق"}
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ─── Rating Overlay ──────────────────────────────────────────── */}
//       {isRateOverlayOpen && (
//         <div
//           role="dialog"
//           aria-modal="true"
//           className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
//         >
//           <div
//             onClick={handleCloseRatingOverlay}
//             className="absolute inset-0 bg-[#000]/10 backdrop-blur-[20px]"
//           />

//           <div
//             className="relative w-[690px] z-10 bg-gradient-to-l from-[#fff] to-[#8D8D8D] backdrop-blur-[20px] rounded-[25px] max-h-[90vh] flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="bg-[#fff]/25 backdrop-blur-[20px] rounded-t-[25px] px-5 py-3 shrink-0 flex items-center justify-between">
//               <h3 className="text-[20px] font-semibold">{translations.rate || "التقييمات"}</h3>
//               <button
//                 onClick={handleCloseRatingOverlay}
//                 className="text-gray-600 hover:text-gray-900 transition-colors"
//                 aria-label={translations.close || "إغلاق"}
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-6 w-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   strokeWidth={2}
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             {ratingsLoading ? (
//               <div className="h-[450px] flex items-center justify-center text-gray-500">
//                 {translations.loadingRatings || "جاري تحميل التقييمات..."}
//               </div>
//             ) : ratings.length === 0 ? (
//               <div className="h-[450px] flex flex-col items-center justify-center px-5 text-center">
//                 <img src="/icons/no-rate.svg" alt="no-rate" className="w-[65px] h-[65px] mb-3" />
//                 <h4 className="text-[25px] font-semibold">{translations.noRatings || "مافيش تقييمات لسه"}</h4>
//                 <p className="text-[16px]">{translations.noRatingsSub || "ماحدش قيّم لسه خليك أنت أول واحد يكسر الصمت"}</p>
//               </div>
//             ) : (
//               <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 max-h-[400px]">
//                 {ratings.map((rate) => {
//                   const isOwnRating = currentUser?._id === rate.ratinguserid;
//                   return (
//                     <div
//                       key={rate._id}
//                       className="flex items-start gap-3 backdrop-blur-sm rounded-[25px] p-3 border-t border-x border-white/20 border-b-0"
//                       style={{
//                         width: "100%",
//                         minHeight: "139px",
//                         background:
//                           "linear-gradient(180deg, rgba(0, 0, 0, 0.2) 30%, rgba(102, 102, 102, 0) 100%)",
//                         borderRadius: "25px",
//                         borderBottom: "none",
//                       }}
//                     >
//                       <img
//                         src={rate.userimg || "/imgs/user.png"}
//                         className="w-[54px] h-[54px] rounded-[23px] object-cover shrink-0"
//                         alt={rate.name}
//                       />

//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center justify-between flex-wrap gap-2">
//                           <span
//                             className="font-semibold text-[15px] leading-none"
//                             style={{ color: "#FFFFFF", fontWeight: 600, fontSize: "15px" }}
//                           >
//                             {rate.name}
//                           </span>

//                           <div className="flex items-center gap-1">
//                             <div className="flex gap-0.5">
//                               {Array.from({ length: 5 }, (_, i) => {
//                                 const starIndex = i + 1;
//                                 let type: 'full' | 'half' | 'empty';
//                                 if (starIndex <= rate.stars) type = 'full';
//                                 else if (starIndex - 0.5 <= rate.stars) type = 'half';
//                                 else type = 'empty';

//                                 return (
//                                   <span key={i} className="inline-block w-[28px] h-[28px] relative">
//                                     <img
//                                       src="/imgs/Vector (11).svg"
//                                       className="w-full h-full object-contain absolute inset-0"
//                                       alt="empty"
//                                     />
//                                     {type !== 'empty' && (
//                                       <div
//                                         className="absolute inset-0"
//                                         style={{
//                                           clipPath: type === 'half' ? 'inset(0 50% 0 0)' : 'inset(0)',
//                                         }}
//                                       >
//                                         <img
//                                           src="/imgs/Vector (9).svg"
//                                           className="w-full h-full object-contain"
//                                           alt="filled"
//                                         />
//                                       </div>
//                                     )}
//                                   </span>
//                                 );
//                               })}
//                             </div>

//                             <div
//                               onClick={(e) => toggleRatingMenu(rate._id, e)}
//                               className="flex items-center justify-center cursor-pointer transition"
//                               style={{
//                                 width: "48.93px",
//                                 height: "34px",
//                                 borderRadius: "15px",
//                                 border: "1px solid #B4B4B9",
//                                 background: "#B4B4B94D",
//                               }}
//                             >
//                               <img
//                                 src="/icons/options-white.svg"
//                                 alt="options"
//                                 style={{ width: "4.16px", height: "16.5px" }}
//                               />
//                             </div>
//                           </div>
//                         </div>

//                         <div className="mt-1 flex items-center gap-2 flex-wrap">
//                           <span
//                             className="text-[12px]"
//                             style={{ color: "#000000", fontSize: "12px", lineHeight: "100%" }}
//                           >
//                             @{rate.username}
//                           </span>
//                           <span
//                             className="px-2 py-0.5 rounded text-[12px] font-semibold leading-none"
//                             style={{
//                               color: "#D72229",
//                               fontWeight: 600,
//                               fontSize: "12px",
//                               lineHeight: "100%",
//                               borderRadius: "4px",
//                             }}
//                           >
//                             {new Date(rate.createdAt).toLocaleDateString("ar-EG", {
//                               year: "numeric",
//                               month: "long",
//                               day: "numeric",
//                             })}
//                           </span>
//                         </div>

//                         <div className="mt-2">
//                           <p className="text-sm text-gray-700 break-words">{rate.comment}</p>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}

//             <div className="flex items-center gap-3 bg-[#fff]/50 backdrop-blur-xl px-5 h-[100px] rounded-b-[25px] shrink-0">
//               <div className="w-[42px] h-[42px] rounded-[25px] overflow-hidden shrink-0">
//                 <img
//                   src={currentUser?.userpersonaldata?.img || "/imgs/user.png"}
//                   className="w-full h-full object-cover"
//                   alt="user"
//                 />
//               </div>

//               <div
//                 className="flex gap-0.5"
//                 onMouseLeave={() => setHoverRating(null)}
//               >
//                 {[1, 2, 3, 4, 5].map((star) => {
//                   const rating = hoverRating !== null ? hoverRating : newRatingStars;
//                   let type: 'full' | 'half' | 'empty';
//                   if (star <= rating) type = 'full';
//                   else if (star - 0.5 <= rating) type = 'half';
//                   else type = 'empty';

//                   return (
//                     <div
//                       key={star}
//                       className="relative w-7 h-7 cursor-pointer"
//                       onClick={(e) => {
//                         const rect = e.currentTarget.getBoundingClientRect();
//                         const x = e.clientX - rect.left;
//                         const half = x < rect.width / 2;
//                         const value = half ? star - 0.5 : star;
//                         setNewRatingStars(Math.max(0.5, Math.min(5, value)));
//                         setHoverRating(null);
//                       }}
//                       onMouseMove={(e) => {
//                         const rect = e.currentTarget.getBoundingClientRect();
//                         const x = e.clientX - rect.left;
//                         const half = x < rect.width / 2;
//                         const value = half ? star - 0.5 : star;
//                         setHoverRating(Math.max(0.5, Math.min(5, value)));
//                       }}
//                     >
//                       <img
//                         src="/imgs/Vector (11).svg"
//                         className="w-full h-full object-contain absolute inset-0"
//                         alt="empty"
//                       />
//                       {type !== 'empty' && (
//                         <div
//                           className="absolute inset-0"
//                           style={{
//                             clipPath: type === 'half' ? 'inset(0 0 0 50%)' : 'inset(0)',
//                           }}
//                         >
//                           <img
//                             src="/imgs/Vector (9).svg"
//                             className="w-full h-full object-contain"
//                             alt="filled"
//                           />
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>

//               <div
//                 className="z-9 w-full flex rounded-[19px]"
//                 style={{ background: "#0000001A" }}
//               >
//                 <input
//                   placeholder={translations.writeComment || "اكتب تقييمك هنا"}
//                   className="flex-1 bg-transparent outline-none p-3"
//                   value={newRatingText}
//                   onChange={(e) => setNewRatingText(e.target.value)}
//                   disabled={isSubmittingRating}
//                 />
//                 <button
//                   onClick={handleSubmitRating}
//                   disabled={isSubmittingRating}
//                   className="bg-white px-4 py-3 rounded-tl-[19px] rounded-b-[19px] text-[#D72229] font-semibold shrink-0 w-[135px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isSubmittingRating ? translations.submitting || "جاري..." : translations.submitRating || "تقييم"}
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* ── Rating options menu ── */}
//           {menuState.id && (
//             <div
//               data-rating-menu
//               className="fixed flex gap-2 z-[99999]"
//               style={{
//                 top: menuState.top,
//                 left: menuState.left,
//               }}
//               onClick={(e) => e.stopPropagation()}
//             >
//               {(() => {
//                 const targetRating = ratings.find((r) => r._id === menuState.id);
//                 if (!targetRating) return null;
//                 const isOwn = currentUser?._id === targetRating.ratinguserid;

//                 return (
//                   <>
//                     {isOwn && (
//                       <button
//                         onClick={() => handleDeleteRating(targetRating._id)}
//                         className="flex items-center justify-center transition hover:opacity-80 gap-2"
//                         style={{
//                           width: "110px",
//                           height: "55px",
//                           borderRadius: "18px",
//                           background: "#D722294D",
//                           backdropFilter: "blur(5px)",
//                           border: "none",
//                           cursor: "pointer",
//                         }}
//                       >
//                         <div
//                           style={{
//                             width: "37.875px",
//                             height: "37.875px",
//                             background: "#FFFFFF",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             borderRadius: "50%",
//                           }}
//                         >
//                           <img
//                             src="/imgs/Frame.svg"
//                             alt="delete"
//                             style={{ width: "13.47px", height: "13.47px" }}
//                           />
//                         </div>
//                         <span
//                           style={{
//                             color: "#FFFFFF",
//                             fontWeight: 600,
//                             fontSize: "15px",
//                             lineHeight: "100%",
//                             fontFamily: "Cairo",
//                           }}
//                         >
//                           {translations.delete || "حذف"}
//                         </span>
//                       </button>
//                     )}

//                     <button
//                       onClick={() =>
//                         handleReportUserFromRating(
//                           targetRating.ratinguserid,
//                           targetRating.name
//                         )
//                       }
//                       className="flex items-center justify-center transition hover:opacity-80 gap-2"
//                       style={{
//                         width: "110px",
//                         height: "55px",
//                         borderRadius: "18px",
//                         background: "#D722294D",
//                         backdropFilter: "blur(5px)",
//                         border: "none",
//                         cursor: "pointer",
//                       }}
//                     >
//                       <div
//                         style={{
//                           width: "37.875px",
//                           height: "37.875px",
//                           background: "#FFFFFF",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           borderRadius: "50%",
//                         }}
//                       >
//                         <img
//                           src="/imgs/ic_flag_24px.svg"
//                           alt="flag"
//                           style={{ width: "13.47px", height: "13.47px" }}
//                         />
//                       </div>
//                       <span
//                         style={{
//                           color: "#FFFFFF",
//                           fontWeight: 600,
//                           fontSize: "15px",
//                           lineHeight: "100%",
//                           fontFamily: "Cairo",
//                         }}
//                       >
//                         {translations.reportUser || "ابلاغ"}
//                       </span>
//                     </button>
//                   </>
//                 );
//               })()}
//             </div>
//           )}
//         </div>
//       )}
//     </>
//   );
// }


// src/app/profile/_components/ActionMenu.tsx
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useTranslations } from 'next-intl';

type Rating = {
  _id: string;
  name: string;
  username: string;
  userimg: string;
  stars: number;
  comment: string;
  createdAt: string;
  ratinguserid: string;
};

type ActionMenuProps = {
  onMessage?: () => void;
  onReport?: (reason?: string) => void;
  onBlock?: () => void;
  propReporterId?: string;
  propReporterEmail?: string;
  reportedUserId?: string;
  reportedPostId?: string;
  ratingApiBase?: string;
};

export default function ActionMenu({
  onMessage,
  onReport,
  onBlock,
  propReporterId,
  propReporterEmail,
  reportedUserId,
  reportedPostId,
  ratingApiBase = "https://bo-chat.space",
}: ActionMenuProps) {
  const t = useTranslations('ActionMenu');
  const commonT = useTranslations('Common');

  // أسباب البلاغ من الترجمة
  const reportReasons = [
    { id: "inappropriate", label: t('reportReasons.inappropriate') },
    { id: "misleading", label: t('reportReasons.misleading') },
    { id: "spam", label: t('reportReasons.spam') },
    { id: "harmful", label: t('reportReasons.harmful') },
    { id: "personal_info", label: t('reportReasons.personal_info') },
  ];

  // ─── باقي الكود ──────────────

  const [open, setOpen] = useState(false);
  const [showReportReasons, setShowReportReasons] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [isReporting, setIsReporting] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const [isRateOverlayOpen, setIsRateOverlayOpen] = useState(false);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [ratingsLoading, setRatingsLoading] = useState(false);
  const [newRatingText, setNewRatingText] = useState("");
  const [newRatingStars, setNewRatingStars] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const [menuState, setMenuState] = useState<{
    id: string | null;
    top: number;
    left: number;
  }>({ id: null, top: 0, left: 0 });

  const getUserData = () => {
    try {
      const raw = localStorage.getItem("userData");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const getAccessToken = (): string => {
    return localStorage.getItem("accessToken") || "";
  };

  const getReporterId = (): string => {
    const data = getUserData();
    return data?._id || "";
  };

  const getReporterEmail = (): string => {
    const data = getUserData();
    return data?.useremail || data?.useremail2 || data?.email || "";
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (showSuccessModal) {
          setShowSuccessModal(false);
        } else if (showReportReasons) {
          setShowReportReasons(false);
          setSelectedReason("");
        } else if (isRateOverlayOpen) {
          setIsRateOverlayOpen(false);
        }
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showReportReasons, showSuccessModal, isRateOverlayOpen]);

  useEffect(() => {
    if (showReportReasons || showSuccessModal || isRateOverlayOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showReportReasons, showSuccessModal, isRateOverlayOpen]);

  useEffect(() => {
    if (isRateOverlayOpen && reportedUserId) {
      fetchRatings();
    }
  }, [isRateOverlayOpen, reportedUserId]);

  const fetchRatings = useCallback(async () => {
    if (!reportedUserId) {
      console.warn("⚠️ reportedUserId مفقود");
      setRatings([]);
      return;
    }

    const token = getAccessToken();
    let guestId = "";
    try {
      const raw = localStorage.getItem("userData");
      if (raw) {
        const parsed = JSON.parse(raw);
        guestId = parsed._id;
      }
    } catch (e) {
      console.error("خطأ في قراءة userData", e);
    }

    if (!guestId || !token) {
      console.warn("⚠️ guestId أو التوكن مفقود");
      setRatings([]);
      return;
    }

    setRatingsLoading(true);
    try {
      const url = `${ratingApiBase}/rate/${reportedUserId}?guestid=${guestId}`;
      console.log("🔍 جلب التقييمات من:", url);
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} - ${res.statusText}`);
      }
      const data = await res.json();
      console.log("📦 استجابة التقييمات:", data);
      if (Array.isArray(data)) {
        setRatings(data);
      } else {
        setRatings([]);
      }
    } catch (error) {
      console.error("❌ خطأ في جلب التقييمات:", error);
      toast.error(t('error'));
      setRatings([]);
    } finally {
      setRatingsLoading(false);
    }
  }, [reportedUserId, ratingApiBase, t]);

  useEffect(() => {
    console.log("overlay:", isRateOverlayOpen, "user:", reportedUserId);
    if (isRateOverlayOpen && reportedUserId) {
      fetchRatings();
    }
  }, [isRateOverlayOpen, reportedUserId]);

  const handleSubmitRating = async () => {
    const userData = getUserData();
    if (!userData?._id) {
      toast.error(t('mustLogin'));
      return;
    }
    if (!reportedUserId) {
      toast.error(t('noUserTarget'));
      return;
    }

    setIsSubmittingRating(true);
    try {
      const res = await fetch(`${ratingApiBase}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify({
          stars: newRatingStars,
          comment: newRatingText.trim(),
          rateduserid: reportedUserId,
          ratinguserid: userData._id,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "فشل إرسال التقييم");
      }
      toast.success(t('rateSuccess'));
      setNewRatingText("");
      setNewRatingStars(5);
      await fetchRatings();
    } catch (err: any) {
      console.error("Submit rating error:", err);
      toast.error(err.message || t('rateError'));
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handleDeleteRating = async (ratingId: string) => {
    if (!ratingId) return;
    try {
      const res = await fetch(`${ratingApiBase}/rate/${ratingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "فشل حذف التقييم");
      }
      toast.success(t('deleteSuccess'));
      setMenuState({ id: null, top: 0, left: 0 });
      await fetchRatings();
    } catch (err: any) {
      console.error("Delete rating error:", err);
      toast.error(err.message || t('deleteError'));
    }
  };

  const handleReportUserFromRating = async (userId: string, userName: string) => {
    if (!userId) {
      toast.error(t('userDataIncomplete'));
      return;
    }
    const reporterId = getReporterId();
    const reporterEmail = getReporterEmail();
    if (!reporterId || !reporterEmail) {
      toast.error(t('mustLogin'));
      return;
    }

    try {
      const res = await fetch(`${ratingApiBase}/report/${reporterId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify({
          userid: userId,
          email: reporterEmail,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "فشل إرسال البلاغ");
      }
      toast.success(t('reportSuccess', { userName }));
      setMenuState({ id: null, top: 0, left: 0 });
    } catch (err: any) {
      console.error("Report user error:", err);
      toast.error(err.message || t('reportError'));
    }
  };

  const handleBlockUserFromRating = async (userId: string, userName: string) => {
    if (!userId) {
      toast.error(t('userDataIncomplete'));
      return;
    }
    const reporterId = getReporterId();
    if (!reporterId) {
      toast.error(t('mustLogin'));
      return;
    }
    try {
      const res = await fetch(`${ratingApiBase}/block/${reporterId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify({
          blockedid: userId,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "فشل حجب المستخدم");
      }
      toast.success(t('blockSuccess', { userName }));
      setMenuState({ id: null, top: 0, left: 0 });
    } catch (err: any) {
      console.error("Block user error:", err);
      toast.error(err.message || t('blockError'));
    }
  };

  const toggleRatingMenu = (ratingId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    if (menuState.id === ratingId) {
      setMenuState({ id: null, top: 0, left: 0 });
      return;
    }
    setMenuState({
      id: ratingId,
      top: rect.bottom + 8,
      left: rect.left - 80,
    });
  };

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (menuState.id) {
        const target = e.target as HTMLElement;
        if (!target.closest("[data-rating-menu]")) {
          setMenuState({ id: null, top: 0, left: 0 });
        }
      }
    }
    document.addEventListener("click", handleOutside);
    return () => document.removeEventListener("click", handleOutside);
  }, [menuState.id]);

  const handleOpenRatingOverlay = () => {
    setOpen(false);
    if (!reportedUserId) {
      toast.error(t('cannotLoadRatings'));
      return;
    }
    setIsRateOverlayOpen(true);
  };

  const handleCloseRatingOverlay = () => {
    setIsRateOverlayOpen(false);
    setMenuState({ id: null, top: 0, left: 0 });
  };

  const handleReportClick = () => {
    setOpen(false);
    setShowReportReasons(true);
    setSelectedReason("");
    setShowSuccessModal(false);
  };

  const handleCloseReasonsModal = () => {
    setShowReportReasons(false);
    setSelectedReason("");
  };

  const handleReasonSelect = async (reasonLabel: string) => {
    const reporterId = getReporterId();
    const reporterEmail = getReporterEmail();
    if (!reporterId || !reporterEmail) {
      toast.error(t('mustLogin'));
      return;
    }

    setSelectedReason(reasonLabel);
    setIsReporting(true);

    try {
      const body: any = {
        reporter: reporterId,
        report: reasonLabel,
        email: reporterEmail,
      };
      if (reportedUserId) body.reportedUserId = reportedUserId;
      if (reportedPostId) body.postId = reportedPostId;

      const res = await fetch(`${ratingApiBase}/user/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "فشل إرسال البلاغ");
      }

      onReport?.(reasonLabel);
      setShowReportReasons(false);
      setShowSuccessModal(true);
      toast.success(t('reportSent'));
    } catch (error: any) {
      console.error("Report error:", error);
      toast.error(error.message || t('reportFailed'));
    } finally {
      setIsReporting(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setSelectedReason("");
  };

  const currentUser = getUserData();

  // ─── Render ────────────────────────────────────────────────────────
  return (
    <>
      {/* ─── Main Action Menu ────────────────────────────────────────── */}
      <div className="relative z-[999]" ref={menuRef}>
        <button
          onClick={() => setOpen((s) => !s)}
          aria-haspopup="true"
          aria-expanded={open}
          className="block p-3 rounded-[17px] cursor-pointer mt-4 w-[40px] h-[40px] flex items-center justify-center border border-[#EBEBEB] bg-white"
        >
          <img
            src="/imgs/dots.svg"
            alt="menu"
            className={`w-4 h-4 focus:transform focus:rotate-90 ${
              open ? "rotate-90 transition-all" : "rotate-0 transition-all"
            }`}
          />
        </button>

        <div
          className={`absolute top-20 left-0 transform origin-top-right transition-all duration-150 ${
            open
              ? "scale-100 opacity-100 pointer-events-auto"
              : "scale-95 opacity-0 pointer-events-none"
          }`}
        >
          <div
            className="w-64 rounded-[30px] p-3 shadow-2xl bg-black/10 backdrop-blur-md border border-white/30"
            style={{ minWidth: 240 }}
          >
            <div className="flex flex-col gap-3 mt-1">
              {/* ── تقييم ── */}
              <button
                onClick={handleOpenRatingOverlay}
                className="flex items-center gap-3 px-3 py-3 rounded-[20px] border border-[#D8D8D8] cursor-pointer bg-white/40 hover:backdrop-blur-sm"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600">
                  <img src="/icons/rate.svg" alt="rate" />
                </div>
                <div className="text-right">
                  <div className="text-[#D72229] font-semibold">{t('rate')}</div>
                </div>
              </button>

              {/* ── ابلاغ ── */}
              <button
                onClick={handleReportClick}
                disabled={isReporting}
                className="flex items-center gap-3 px-3 py-3 rounded-[20px] border border-[#D8D8D8] cursor-pointer bg-[#000]/40 hover:backdrop-blur-sm disabled:opacity-50"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600">
                  <img src="/icons/flag.svg" className="invert brightness-0" alt="" />
                </div>
                <div className="text-right">
                  <div className="text-white/90 font-semibold">
                    {isReporting ? t('submitting') : t('report')}
                  </div>
                </div>
              </button>

              {/* ── حجب ── */}
              <button
                onClick={() => {
                  setOpen(false);
                  onBlock?.();
                }}
                className="flex items-center gap-3 px-3 py-3 rounded-[20px] border border-[#D8D8D8] cursor-pointer bg-[#000]/40 hover:backdrop-blur-sm"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600">
                  <img src="/icons/block.svg" alt="" />
                </div>
                <div className="text-right">
                  <div className="text-white/90 font-semibold">{t('block')}</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Report Reasons Modal ───────────────────────────────────── */}
      {showReportReasons && (
        <div
          className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/50 transition-all duration-200"
          onClick={handleCloseReasonsModal}
        >
          <div
            ref={modalRef}
            className="relative flex flex-col text-right"
            style={{
              width: "690px",
              maxHeight: "90vh",
              height: "auto",
              borderRadius: "25px",
              background: "linear-gradient(270deg, #FFFFFF 0%, #8D8D8D 79.81%)",
              backdropFilter: "blur(30px)",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseReasonsModal}
              className="absolute left-4 top-4 text-gray-500 hover:text-gray-800 transition-colors z-10"
              aria-label={t('close')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div
              className="w-full h-[55px] flex items-center px-6 text-black font-semibold flex-shrink-0"
              style={{
                fontSize: "20px",
                lineHeight: "100%",
                background: "#FFFFFF40",
                backdropFilter: "blur(10px)",
                borderTopLeftRadius: "25px",
                borderTopRightRadius: "25px",
                textAlign: "right",
              }}
            >
              {t('reportTitle')}
            </div>

            <div
              className="w-full flex items-center justify-center flex-shrink-0"
              style={{ minHeight: "47px" }}
            >
              <p
                className="text-black text-center"
                style={{
                  fontSize: "25px",
                  fontWeight: 500,
                  lineHeight: "100%",
                  padding: "30px 0 12px",
                }}
              >
                {t('reportQuestion')}
              </p>
            </div>

            <div
              className="mt-6 w-full px-8 space-y-4 flex-1"
              style={{
                overflowY: "scroll",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                maxHeight: "calc(90vh - 200px)",
              }}
            >
              {reportReasons.map((reason) => (
                <div
                  key={reason.id}
                  onClick={() => !isReporting && handleReasonSelect(reason.label)}
                  className={`flex items-center gap-3 cursor-pointer group transition-all hover:bg-white/20 rounded-[19px] ${
                    isReporting ? "opacity-50 pointer-events-none" : ""
                  }`}
                  style={{
                    width: "100%",
                    height: "66px",
                    borderRadius: "19px",
                    border: "1px solid #A1A1A1",
                    padding: "0 16px",
                  }}
                >
                  <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                      width: "45px",
                      height: "45px",
                      backgroundColor: "#A1A1A1",
                      borderRadius: "50%",
                    }}
                  >
                    <img
                      src="/imgs/Vector (6).svg"
                      alt="report icon"
                      style={{
                        width: "18px",
                        height: "20px",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <span
                    className="text-black flex-1"
                    style={{
                      fontSize: "18px",
                      fontWeight: 400,
                      lineHeight: "100%",
                      textAlign: "right",
                    }}
                  >
                    {reason.label}
                  </span>
                  <img
                    src="/imgs/Group 6836.svg"
                    alt="arrow"
                    style={{
                      width: "6.5px",
                      height: "13px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="h-4 flex-shrink-0"></div>
          </div>
        </div>
      )}

      {/* ─── Success Modal ───────────────────────────────────────────── */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-200"
          onClick={handleCloseSuccessModal}
        >
          <div
            className="relative flex flex-col items-center text-center"
            style={{
              width: "690px",
              height: "341px",
              borderRadius: "25px",
              background: "linear-gradient(270deg, #FFFFFF 0%, #8D8D8D 79.81%)",
              backdropFilter: "blur(30px)",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className="w-full h-[55px] flex items-center px-6 text-black font-semibold flex-shrink-0"
              style={{
                fontSize: "20px",
                lineHeight: "100%",
                background: "#FFFFFF40",
                backdropFilter: "blur(10px)",
                borderTopLeftRadius: "25px",
                borderTopRightRadius: "25px",
              }}
            >
              {t('successTitle')}
            </h2>

            <div className="text-right w-full flex-1 flex flex-col justify-center items-center">
              <div className="text-center">
                <p
                  className="text-black mb-3 mt-4"
                  style={{ fontSize: "25px", fontWeight: 400, lineHeight: "1.4" }}
                >
                  {t('successMessage').split("\n")[0]}
                </p>
                <p
                  className="text-black"
                  style={{ fontSize: "25px", fontWeight: 400, lineHeight: "1.4" }}
                >
                  {t('successMessage').split("\n")[1]}
                </p>
              </div>
              <hr
                style={{
                  width: "100%",
                  border: "1px solid #70707080",
                  marginTop: "20px",
                }}
              />
            </div>

            <button
              onClick={handleCloseSuccessModal}
              className="mt-6 mb-6 bg-black text-white font-semibold rounded-[23px] hover:bg-gray-800 transition-colors flex-shrink-0"
              style={{
                width: "300px",
                height: "60px",
                fontSize: "20px",
                fontWeight: 600,
                lineHeight: "100%",
                borderRadius: "23px",
              }}
            >
              {commonT('close')}
            </button>
          </div>
        </div>
      )}

      {/* ─── Rating Overlay ──────────────────────────────────────────── */}
      {isRateOverlayOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        >
          <div
            onClick={handleCloseRatingOverlay}
            className="absolute inset-0 bg-[#000]/10 backdrop-blur-[20px]"
          />

          <div
            className="relative w-[690px] z-10 bg-gradient-to-l from-[#fff] to-[#8D8D8D] backdrop-blur-[20px] rounded-[25px] max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#fff]/25 backdrop-blur-[20px] rounded-t-[25px] px-5 py-3 shrink-0 flex items-center justify-between">
              <h3 className="text-[20px] font-semibold">{t('rate')}</h3>
              <button
                onClick={handleCloseRatingOverlay}
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label={commonT('close')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {ratingsLoading ? (
              <div className="h-[450px] flex items-center justify-center text-gray-500">
                {t('loadingRatings')}
              </div>
            ) : ratings.length === 0 ? (
              <div className="h-[450px] flex flex-col items-center justify-center px-5 text-center">
                <img src="/icons/no-rate.svg" alt="no-rate" className="w-[65px] h-[65px] mb-3" />
                <h4 className="text-[25px] font-semibold">{t('noRatings')}</h4>
                <p className="text-[16px]">{t('noRatingsSub')}</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 max-h-[400px]">
                {ratings.map((rate) => {
                  const isOwnRating = currentUser?._id === rate.ratinguserid;
                  return (
                    <div
                      key={rate._id}
                      className="flex items-start gap-3 backdrop-blur-sm rounded-[25px] p-3 border-t border-x border-white/20 border-b-0"
                      style={{
                        width: "100%",
                        minHeight: "139px",
                        background:
                          "linear-gradient(180deg, rgba(0, 0, 0, 0.2) 30%, rgba(102, 102, 102, 0) 100%)",
                        borderRadius: "25px",
                        borderBottom: "none",
                      }}
                    >
                      <img
                        src={rate.userimg || "/imgs/user.png"}
                        className="w-[54px] h-[54px] rounded-[23px] object-cover shrink-0"
                        alt={rate.name}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span
                            className="font-semibold text-[15px] leading-none"
                            style={{ color: "#FFFFFF", fontWeight: 600, fontSize: "15px" }}
                          >
                            {rate.name}
                          </span>

                          <div className="flex items-center gap-1">
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }, (_, i) => {
                                const starIndex = i + 1;
                                let type: 'full' | 'half' | 'empty';
                                if (starIndex <= rate.stars) type = 'full';
                                else if (starIndex - 0.5 <= rate.stars) type = 'half';
                                else type = 'empty';

                                return (
                                  <span key={i} className="inline-block w-[28px] h-[28px] relative">
                                    <img
                                      src="/imgs/Vector (11).svg"
                                      className="w-full h-full object-contain absolute inset-0"
                                      alt="empty"
                                    />
                                    {type !== 'empty' && (
                                      <div
                                        className="absolute inset-0"
                                        style={{
                                          clipPath: type === 'half' ? 'inset(0 50% 0 0)' : 'inset(0)',
                                        }}
                                      >
                                        <img
                                          src="/imgs/Vector (9).svg"
                                          className="w-full h-full object-contain"
                                          alt="filled"
                                        />
                                      </div>
                                    )}
                                  </span>
                                );
                              })}
                            </div>

                            <div
                              onClick={(e) => toggleRatingMenu(rate._id, e)}
                              className="flex items-center justify-center cursor-pointer transition"
                              style={{
                                width: "48.93px",
                                height: "34px",
                                borderRadius: "15px",
                                border: "1px solid #B4B4B9",
                                background: "#B4B4B94D",
                              }}
                            >
                              <img
                                src="/icons/options-white.svg"
                                alt="options"
                                style={{ width: "4.16px", height: "16.5px" }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-1 flex items-center gap-2 flex-wrap">
                          <span
                            className="text-[12px]"
                            style={{ color: "#000000", fontSize: "12px", lineHeight: "100%" }}
                          >
                            @{rate.username}
                          </span>
                          <span
                            className="px-2 py-0.5 rounded text-[12px] font-semibold leading-none"
                            style={{
                              color: "#D72229",
                              fontWeight: 600,
                              fontSize: "12px",
                              lineHeight: "100%",
                              borderRadius: "4px",
                            }}
                          >
                            {new Date(rate.createdAt).toLocaleDateString("ar-EG", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>

                        <div className="mt-2">
                          <p className="text-sm text-gray-700 break-words">{rate.comment}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex items-center gap-3 bg-[#fff]/50 backdrop-blur-xl px-5 h-[100px] rounded-b-[25px] shrink-0">
              <div className="w-[42px] h-[42px] rounded-[25px] overflow-hidden shrink-0">
                <img
                  src={currentUser?.userpersonaldata?.img || "/imgs/user.png"}
                  className="w-full h-full object-cover"
                  alt="user"
                />
              </div>

              <div
                className="flex gap-0.5"
                onMouseLeave={() => setHoverRating(null)}
              >
                {[1, 2, 3, 4, 5].map((star) => {
                  const rating = hoverRating !== null ? hoverRating : newRatingStars;
                  let type: 'full' | 'half' | 'empty';
                  if (star <= rating) type = 'full';
                  else if (star - 0.5 <= rating) type = 'half';
                  else type = 'empty';

                  return (
                    <div
                      key={star}
                      className="relative w-7 h-7 cursor-pointer"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const half = x < rect.width / 2;
                        const value = half ? star - 0.5 : star;
                        setNewRatingStars(Math.max(0.5, Math.min(5, value)));
                        setHoverRating(null);
                      }}
                      onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const half = x < rect.width / 2;
                        const value = half ? star - 0.5 : star;
                        setHoverRating(Math.max(0.5, Math.min(5, value)));
                      }}
                    >
                      <img
                        src="/imgs/Vector (11).svg"
                        className="w-full h-full object-contain absolute inset-0"
                        alt="empty"
                      />
                      {type !== 'empty' && (
                        <div
                          className="absolute inset-0"
                          style={{
                            clipPath: type === 'half' ? 'inset(0 0 0 50%)' : 'inset(0)',
                          }}
                        >
                          <img
                            src="/imgs/Vector (9).svg"
                            className="w-full h-full object-contain"
                            alt="filled"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div
                className="z-9 w-full flex rounded-[19px]"
                style={{ background: "#0000001A" }}
              >
                <input
                  placeholder={t('writeComment')}
                  className="flex-1 bg-transparent outline-none p-3"
                  value={newRatingText}
                  onChange={(e) => setNewRatingText(e.target.value)}
                  disabled={isSubmittingRating}
                />
                <button
                  onClick={handleSubmitRating}
                  disabled={isSubmittingRating}
                  className="bg-white px-4 py-3 rounded-tl-[19px] rounded-b-[19px] text-[#D72229] font-semibold shrink-0 w-[135px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingRating ? t('submitting') : t('submitRating')}
                </button>
              </div>
            </div>
          </div>

          {/* ── Rating options menu ── */}
          {menuState.id && (
            <div
              data-rating-menu
              className="fixed flex gap-2 z-[99999]"
              style={{
                top: menuState.top,
                left: menuState.left,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const targetRating = ratings.find((r) => r._id === menuState.id);
                if (!targetRating) return null;
                const isOwn = currentUser?._id === targetRating.ratinguserid;

                return (
                  <>
                    {isOwn && (
                      <button
                        onClick={() => handleDeleteRating(targetRating._id)}
                        className="flex items-center justify-center transition hover:opacity-80 gap-2"
                        style={{
                          width: "110px",
                          height: "55px",
                          borderRadius: "18px",
                          background: "#D722294D",
                          backdropFilter: "blur(5px)",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            width: "37.875px",
                            height: "37.875px",
                            background: "#FFFFFF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "50%",
                          }}
                        >
                          <img
                            src="/imgs/Frame.svg"
                            alt="delete"
                            style={{ width: "13.47px", height: "13.47px" }}
                          />
                        </div>
                        <span
                          style={{
                            color: "#FFFFFF",
                            fontWeight: 600,
                            fontSize: "15px",
                            lineHeight: "100%",
                            fontFamily: "Cairo",
                          }}
                        >
                          {t('delete')}
                        </span>
                      </button>
                    )}

                    <button
                      onClick={() =>
                        handleReportUserFromRating(
                          targetRating.ratinguserid,
                          targetRating.name
                        )
                      }
                      className="flex items-center justify-center transition hover:opacity-80 gap-2"
                      style={{
                        width: "110px",
                        height: "55px",
                        borderRadius: "18px",
                        background: "#D722294D",
                        backdropFilter: "blur(5px)",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          width: "37.875px",
                          height: "37.875px",
                          background: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                        }}
                      >
                        <img
                          src="/imgs/ic_flag_24px.svg"
                          alt="flag"
                          style={{ width: "13.47px", height: "13.47px" }}
                        />
                      </div>
                      <span
                        style={{
                          color: "#FFFFFF",
                          fontWeight: 600,
                          fontSize: "15px",
                          lineHeight: "100%",
                          fontFamily: "Cairo",
                        }}
                      >
                        {t('reportUser')}
                      </span>
                    </button>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </>
  );
}