// /* eslint-disable @next/next/no-img-element */
// "use client";
// import React, { useEffect, useRef, useState } from "react";

// type ActionMenuProps = {
//   onMessage?: () => void;
//   onReport?: () => void;
//   onBlock?: () => void;
//   avatarUrl?: string; // optional: to show in header if you want
// };

// export default function ActionMenu({ onMessage, onReport, onBlock }: ActionMenuProps) {
  
//   const [open, setOpen] = useState(false);
//   const [showReportReasons, setShowReportReasons] = useState(false);
//   const ref = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     function handle(e: MouseEvent) {
//       if (ref.current && !ref.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     }
//     document.addEventListener("click", handle);
//     return () => document.removeEventListener("click", handle);
//   }, []);


//   return (
//     <div className="relative z-[999]" ref={ref}>
//       {/* trigger */}
//       <button
//         onClick={() => setOpen((s) => !s)}
//         aria-haspopup="true"
//         aria-expanded={open}
//         className="block p-3 rounded-[17px] cursor-pointer mt-4 w-[40px] h-[40px] flex items-center justify-center border border-[#EBEBEB] bg-white"
//       >
//         <img src="/imgs/dots.svg" alt="menu" className={`w-4 h-4 focus:transform  focus:rotate-90 ${open ? "rotate-90 transition-all" : "rotate-0 transition-all"}`}  />
//       </button>

//       {/* dropdown */}
//       <div
//         className={`absolute top-20 left-0 transform origin-top-right transition-all duration-150 ${
//           open ? "scale-100 opacity-100 pointer-events-auto" : "scale-95 opacity-0 pointer-events-none"
//         }`}
//       >
//         <div
//           className="w-64 rounded-[30px] p-3 shadow-2xl bg-black/10 backdrop-blur-md border border-white/30"
//           style={{ minWidth: 240 }}
//         >


//           {/* items */}
//           <div className="flex flex-col gap-3 mt-1">
//             <button
//               onClick={() => {
//                 setOpen(false);
//                 onMessage?.();
//               }}
//               className="flex items-center gap-3 px-3 py-3 rounded-[20px] border border-[#D8D8D8] cursor-pointer bg-white/40 hover:backdrop-blur-sm"
//             >
//               <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600">
//                 <img src="/icons/rate.svg" alt="rate" />
//               </div>
//               <div className="text-right">
//                 <div className="text-[#D72229] font-semibold">تقييم</div>
//               </div>
//             </button>

//             <button
//               onClick={() => {
//                 setOpen(false);
//                 onReport?.();
//               }}
//               className="flex items-center  gap-3 px-3 py-3 rounded-[20px] border border-[#D8D8D8] cursor-pointer bg-[#000]/40 hover:backdrop-blur-sm"
//             >
//               <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600">
//                 <img src="/icons/flag.svg" className="invert brightness-0" alt="" />
//               </div>
//               <div className="text-right">
//                 <div className="text-white/90 font-semibold ">ابلاغ</div>
//               </div>
//             </button>

//             <button
//               onClick={() => {
//                 setOpen(false);
//                 onBlock?.();
//               }}
//               className="flex items-center gap-3 px-3 py-3 rounded-[20px] border border-[#D8D8D8] cursor-pointer bg-[#000]/40 hover:backdrop-blur-sm"
//             >
//               <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600">
//                 <img src="/icons/block.svg" alt="" />
//               </div>
//                <div className="text-right">
//                 <div className="text-white/90 font-semibold">حجب</div>
//               </div>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

/* eslint-disable @next/next/no-img-element */
// "use client";
// import React, { useEffect, useRef, useState } from "react";

// type ActionMenuProps = {
//   onMessage?: () => void;
//   onReport?: (reason?: string) => void;
//   onBlock?: () => void;
//   avatarUrl?: string;
// };

// export default function ActionMenu({ onMessage, onReport, onBlock }: ActionMenuProps) {
//   const [open, setOpen] = useState(false);
//   const [showReportReasons, setShowReportReasons] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [selectedReason, setSelectedReason] = useState<string>("");
//   const menuRef = useRef<HTMLDivElement | null>(null);
//   const modalRef = useRef<HTMLDivElement | null>(null);

//   // Close menu when clicking outside
//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     }
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   // Close modals on ESC key
//   useEffect(() => {
//     function handleEscape(e: KeyboardEvent) {
//       if (e.key === "Escape") {
//         if (showSuccessModal) {
//           setShowSuccessModal(false);
//         } else if (showReportReasons) {
//           setShowReportReasons(false);
//           setSelectedReason("");
//         }
//       }
//     }
//     document.addEventListener("keydown", handleEscape);
//     return () => document.removeEventListener("keydown", handleEscape);
//   }, [showReportReasons, showSuccessModal]);

//   // Prevent body scroll when any modal is open
//   useEffect(() => {
//     if (showReportReasons || showSuccessModal) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [showReportReasons, showSuccessModal]);

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

//   const handleReasonSelect = (reasonLabel: string) => {
//     setSelectedReason(reasonLabel);
//     onReport?.(reasonLabel);
//     setShowReportReasons(false);
//     setShowSuccessModal(true);
//   };

//   const handleCloseSuccessModal = () => {
//     setShowSuccessModal(false);
//     setSelectedReason("");
//   };

//   // Predefined reasons
//   const reportReasons = [
//     { id: "inappropriate", label: "محتوى غير لائق" },
//     { id: "misleading", label: "معلومات مضللة" },
//     { id: "spam", label: "رسائل مزعجة أو إعلان" },
//     { id: "harmful", label: "خطاب كراهية أو تمييز" },
//     { id: "personal_info", label: "نشر معلومات شخصية" },
    
// { id: "inappropriate", label: "محتوى غير لائق" },
//     { id: "misleading", label: "معلومات مضللة" },
//     { id: "spam", label: "رسائل مزعجة أو إعلان" },
//     { id: "harmful", label: "خطاب كراهية أو تمييز" },
//     { id: "personal_info", label: "نشر معلومات شخصية" },
//   ];

//   return (
//     <>
//       {/* Main Action Menu */}
//       <div className="relative z-[999]" ref={menuRef}>
//         {/* trigger button */}
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

//         {/* dropdown menu */}
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
//               <button
//                 onClick={() => {
//                   setOpen(false);
//                   onMessage?.();
//                 }}
//                 className="flex items-center gap-3 px-3 py-3 rounded-[20px] border border-[#D8D8D8] cursor-pointer bg-white/40 hover:backdrop-blur-sm"
//               >
//                 <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600">
//                   <img src="/icons/rate.svg" alt="rate" />
//                 </div>
//                 <div className="text-right">
//                   <div className="text-[#D72229] font-semibold">تقييم</div>
//                 </div>
//               </button>

//               <button
//                 onClick={handleReportClick}
//                 className="flex items-center gap-3 px-3 py-3 rounded-[20px] border border-[#D8D8D8] cursor-pointer bg-[#000]/40 hover:backdrop-blur-sm"
//               >
//                 <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600">
//                   <img src="/icons/flag.svg" className="invert brightness-0" alt="" />
//                 </div>
//                 <div className="text-right">
//                   <div className="text-white/90 font-semibold">ابلاغ</div>
//                 </div>
//               </button>

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
//                   <div className="text-white/90 font-semibold">حجب</div>
//                 </div>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Report Reasons Modal - height auto, scrollable if needed */}
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
//             {/* Close button (X) */}
//             <button
//               onClick={handleCloseReasonsModal}
//               className="absolute left-4 top-4 text-gray-500 hover:text-gray-800 transition-colors z-10"
//               aria-label="إغلاق"
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

//             {/* Header: "ابلاغ عن الدرج" with blur background */}
//             <div
//               className="w-full h-[55px] flex items-center px-6 text-black font-semibold flex-shrink-0"
//               style={{
//                 fontSize: "20px",
//                 lineHeight: "100%",
//                 background: "#FFFFFF40",
//                  backdropFilter: "blur(10px)",
//                 borderTopLeftRadius: "25px",
//                 borderTopRightRadius: "25px",
//                 textAlign: "right",
//               }}
//             >
//               ابلاغ عن الدرج
//             </div>

//              <div
//               className="w-full flex items-center justify-center flex-shrink-0"
//               style={{
//                 minHeight: "47px",
//                }}
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
//                 ليه بتبلغ عن الدرج ده؟
//               </p>
//             </div>

//             {/* List of reasons */}
//             <div className="mt-6 w-full px-8 space-y-4 flex-1" 
//              style={{
//     overflowY: "scroll",
//     scrollbarWidth: "none",      
//     msOverflowStyle: "none",    
//     maxHeight: "calc(90vh - 200px)",
//   }}
//             >
//               {reportReasons.map((reason) => (
//                 <div
//                   key={reason.id}
//                   onClick={() => handleReasonSelect(reason.label)}
//                   className="flex items-center gap-3 cursor-pointer group transition-all hover:bg-white/20 rounded-[19px]"
//                   style={{
//                     width: "100%",
//                     height: "66px",
//                     borderRadius: "19px",
//                     border: "1px solid #A1A1A1",
//                     padding: "0 16px",
//                   }}
//                 >
              
//                    <div
//                     className="flex items-center justify-center flex-shrink-0"
//                     style={{
//                         width: "45px",
//                         height: "45px",
//                         backgroundColor: "#A1A1A1",
//                         borderRadius: "50%", 
//                     }}
//                     >
//                     <img
//                         src="/imgs/Vector (6).svg"
//                         alt="report icon"
//                         style={{
//                         width: "18px",
//                         height: "20px",
//                         objectFit: "contain",
//                         }}
//                     />
//                     </div>
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
//                     <img
//                         src="/imgs/Group 6836.svg"
//                         alt="report icon"
//                         style={{
//                         width: "6.5px",
//                         height: "13px",
//                         objectFit: "contain",
//                         }}
//                     />
//                 </div>
//               ))}
//             </div>

//             {/* Small bottom spacing */}
//             <div className="h-4 flex-shrink-0"></div>
//           </div>
//         </div>
//       )}

//       {/* Success Modal */}
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
//             {/* Header attached to top */}
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
//               ابلاغ عن الدرج
//             </h2>

//             <div className="text-right w-full flex-1 flex flex-col justify-center items-center">
//               <div className="text-center">
//                 <p
//                   className="text-black mb-3 mt-4"
//                   style={{ fontSize: "25px", fontWeight: 400, lineHeight: "1.4" }}
//                 >
//                   تم استلام بلاغك
//                 </p>
//                 <p
//                   className="text-black"
//                   style={{ fontSize: "25px", fontWeight: 400, lineHeight: "1.4" }}
//                 >
//                   هيساعدنا بلاغك في مراجعة المحتوى والتأكد إن كل حاجة ماشية بشكل آمن وصحيح
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
//               اغلاق
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }


// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import toast from "react-hot-toast";

// type ActionMenuProps = {
//   onMessage?: () => void;
//   onReport?: (reason?: string) => void; // Keep for external use, but we'll also handle API internally
//   onBlock?: () => void;
//   reporterId?: string; // optional, will use localStorage if not provided
//   reporterEmail?: string; // optional, will use localStorage if not provided
//   reportedUserId?: string; // the user being reported (required for report API)
//   reportedPostId?: string; // if reporting a post, we can include it
// };

// export default function ActionMenu({
//   onMessage,
//   onReport,
//   onBlock,
//   reporterId: propReporterId,
//   reporterEmail: propReporterEmail,
//   reportedUserId,
//   reportedPostId,
// }: ActionMenuProps) {
//   const [open, setOpen] = useState(false);
//   const [showReportReasons, setShowReportReasons] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [selectedReason, setSelectedReason] = useState<string>("");
//   const [isReporting, setIsReporting] = useState(false);
//   const menuRef = useRef<HTMLDivElement | null>(null);
//   const modalRef = useRef<HTMLDivElement | null>(null);

//   // Get reporter data from localStorage if not provided
//   const getReporterId = (): string => {
//     if (propReporterId) return propReporterId;
//     if (typeof window !== "undefined") {
//       try {
//         const userData = localStorage.getItem("userData");
//         if (userData) {
//           const parsed = JSON.parse(userData);
//           return parsed._id || "";
//         }
//         const userId = localStorage.getItem("userid") || localStorage.getItem("followerId");
//         if (userId) return userId;
//       } catch {}
//     }
//     return "";
//   };

//   const getReporterEmail = (): string => {
//     if (propReporterEmail) return propReporterEmail;
//     if (typeof window !== "undefined") {
//       try {
//         const userData = localStorage.getItem("userData");
//         if (userData) {
//           const parsed = JSON.parse(userData);
//           return parsed.email || "";
//         }
//         const email = localStorage.getItem("userEmail") || "";
//         if (email) return email;
//       } catch {}
//     }
//     return "";
//   };

//   const reporterId = getReporterId();
//   const reporterEmail = getReporterEmail();

//   // Close menu when clicking outside
//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     }
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   // Close modals on ESC key
//   useEffect(() => {
//     function handleEscape(e: KeyboardEvent) {
//       if (e.key === "Escape") {
//         if (showSuccessModal) {
//           setShowSuccessModal(false);
//         } else if (showReportReasons) {
//           setShowReportReasons(false);
//           setSelectedReason("");
//         }
//       }
//     }
//     document.addEventListener("keydown", handleEscape);
//     return () => document.removeEventListener("keydown", handleEscape);
//   }, [showReportReasons, showSuccessModal]);

//   // Prevent body scroll when any modal is open
//   useEffect(() => {
//     if (showReportReasons || showSuccessModal) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [showReportReasons, showSuccessModal]);

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
//     // If reporterId or email missing, show error
//     if (!reporterId || !reporterEmail) {
//       toast.error("يرجى تسجيل الدخول أولاً");
//       return;
//     }

//     // If we need reportedUserId but it's missing, we can still proceed?
//     // The API might require it, but the given example doesn't have it.
//     // We'll send what we have.
//     setSelectedReason(reasonLabel);
//     setIsReporting(true);

//     try {
//       const body: any = {
//         reporter: reporterId,
//         report: reasonLabel,
//         email: reporterEmail,
//       };
      
//       // Optionally include reportedUserId if available
//       if (reportedUserId) {
//         body.reportedUserId = reportedUserId;
//       }
//       if (reportedPostId) {
//         body.postId = reportedPostId;
//       }

//       const response = await fetch("https://bo-chat.space/user/report", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           // Optionally include Authorization token if needed
//           Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
//         },
//         body: JSON.stringify(body),
//       });

//       const data = await response.text();
//       console.log("data")
//       if (!response.ok) {
//         throw new Error(data || "فشل إرسال البلاغ");
//       }

//       // Call external onReport if provided
//       onReport?.(reasonLabel);

//       // Show success modal
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

//   // Predefined reasons (unique)
//   const reportReasons = [
//     { id: "inappropriate", label: "محتوى غير لائق" },
//     { id: "misleading", label: "معلومات مضللة" },
//     { id: "spam", label: "رسائل مزعجة أو إعلان" },
//     { id: "harmful", label: "خطاب كراهية أو تمييز" },
//     { id: "personal_info", label: "نشر معلومات شخصية" },
//   ];

//   return (
//     <>
//       {/* Main Action Menu */}
//       <div className="relative z-[999]" ref={menuRef}>
//         {/* trigger button */}
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

//         {/* dropdown menu */}
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
//               <button
//                 onClick={() => {
//                   setOpen(false);
//                   onMessage?.();
//                 }}
//                 className="flex items-center gap-3 px-3 py-3 rounded-[20px] border border-[#D8D8D8] cursor-pointer bg-white/40 hover:backdrop-blur-sm"
//               >
//                 <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600">
//                   <img src="/icons/rate.svg" alt="rate" />
//                 </div>
//                 <div className="text-right">
//                   <div className="text-[#D72229] font-semibold">تقييم</div>
//                 </div>
//               </button>

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
//                     {isReporting ? "جاري الإرسال..." : "ابلاغ"}
//                   </div>
//                 </div>
//               </button>

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
//                   <div className="text-white/90 font-semibold">حجب</div>
//                 </div>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Report Reasons Modal - height auto, scrollable if needed */}
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
//             {/* Close button (X) */}
//             <button
//               onClick={handleCloseReasonsModal}
//               className="absolute left-4 top-4 text-gray-500 hover:text-gray-800 transition-colors z-10"
//               aria-label="إغلاق"
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

//             {/* Header: "ابلاغ عن الدرج" with blur background */}
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
//               ابلاغ عن الدرج
//             </div>

//             <div
//               className="w-full flex items-center justify-center flex-shrink-0"
//               style={{
//                 minHeight: "47px",
//               }}
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
//                 ليه بتبلغ عن الدرج ده؟
//               </p>
//             </div>

//             {/* List of reasons */}
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

//             {/* Small bottom spacing */}
//             <div className="h-4 flex-shrink-0"></div>
//           </div>
//         </div>
//       )}

//       {/* Success Modal */}
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
//             {/* Header attached to top */}
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
//               ابلاغ عن الدرج
//             </h2>

//             <div className="text-right w-full flex-1 flex flex-col justify-center items-center">
//               <div className="text-center">
//                 <p
//                   className="text-black mb-3 mt-4"
//                   style={{ fontSize: "25px", fontWeight: 400, lineHeight: "1.4" }}
//                 >
//                   تم استلام بلاغك
//                 </p>
//                 <p
//                   className="text-black"
//                   style={{ fontSize: "25px", fontWeight: 400, lineHeight: "1.4" }}
//                 >
//                   هيساعدنا بلاغك في مراجعة المحتوى والتأكد إن كل حاجة ماشية بشكل آمن وصحيح
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
//               اغلاق
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
// ///////////////////////////////////////////////////////////////



// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import toast from "react-hot-toast";

// type ActionMenuProps = {
//   onMessage?: () => void;
//   onReport?: (reason?: string) => void; // Keep for external use, but we'll also handle API internally
//   onBlock?: () => void;
//   reporterId?: string; // optional, will use localStorage if not provided
//   reporterEmail?: string; // optional, will use localStorage if not provided
//   reportedUserId?: string; // the user being reported (required for report API)
//   reportedPostId?: string; // if reporting a post, we can include it
// };

// export default function ActionMenu({
//   onMessage,
//   onReport,
//   onBlock,
//   reporterId: propReporterId,
//   reporterEmail: propReporterEmail,
//   reportedUserId,
//   reportedPostId,
// }: ActionMenuProps) {
//   const [open, setOpen] = useState(false);
//   const [showReportReasons, setShowReportReasons] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [selectedReason, setSelectedReason] = useState<string>("");
//   const [isReporting, setIsReporting] = useState(false);
//   const menuRef = useRef<HTMLDivElement | null>(null);
//   const modalRef = useRef<HTMLDivElement | null>(null);

//   // Get reporter data from localStorage if not provided
//   const getReporterId = (): string => {
//     if (propReporterId) return propReporterId;
//     if (typeof window !== "undefined") {
//       try {
//         const userData = localStorage.getItem("userData");
//         if (userData) {
//           const parsed = JSON.parse(userData);
//           return parsed._id || "";
//         }
//         const userId = localStorage.getItem("userid") || localStorage.getItem("followerId");
//         if (userId) return userId;
//       } catch {}
//     }
//     return "";
//   };

//   const getReporterEmail = (): string => {
//     if (propReporterEmail) return propReporterEmail;
//     if (typeof window !== "undefined") {
//       try {
//         const userData = localStorage.getItem("userData");
//         if (userData) {
//           const parsed = JSON.parse(userData);
//           return parsed.email || "";
//         }
//         const email = localStorage.getItem("userEmail") || "";
//         if (email) return email;
//       } catch {}
//     }
//     return "";
//   };

//   const reporterId = getReporterId();
//   const reporterEmail = getReporterEmail();

//   // Close menu when clicking outside
//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     }
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   // Close modals on ESC key
//   useEffect(() => {
//     function handleEscape(e: KeyboardEvent) {
//       if (e.key === "Escape") {
//         if (showSuccessModal) {
//           setShowSuccessModal(false);
//         } else if (showReportReasons) {
//           setShowReportReasons(false);
//           setSelectedReason("");
//         }
//       }
//     }
//     document.addEventListener("keydown", handleEscape);
//     return () => document.removeEventListener("keydown", handleEscape);
//   }, [showReportReasons, showSuccessModal]);

//   // Prevent body scroll when any modal is open
//   useEffect(() => {
//     if (showReportReasons || showSuccessModal) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [showReportReasons, showSuccessModal]);

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
//     // If reporterId or email missing, show error
//     if (!reporterId || !reporterEmail) {
//       toast.error("يرجى تسجيل الدخول أولاً");
//       return;
//     }

//     // If we need reportedUserId but it's missing, we can still proceed?
//     // The API might require it, but the given example doesn't have it.
//     // We'll send what we have.
//     setSelectedReason(reasonLabel);
//     setIsReporting(true);

//     try {
//       const body: any = {
//         reporter: reporterId,
//         report: reasonLabel,
//         email: reporterEmail,
//       };
//       // Optionally include reportedUserId if available
//       if (reportedUserId) {
//         body.reportedUserId = reportedUserId;
//       }
//       if (reportedPostId) {
//         body.postId = reportedPostId;
//       }

//       const response = await fetch("https://bo-chat.space/user/report", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           // Optionally include Authorization token if needed
//           // Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
//         },
//         body: JSON.stringify(body),
//       });

//       const data = await response.text();
//       if (!response.ok) {
//         throw new Error(data || "فشل إرسال البلاغ");
//       }

//       // Call external onReport if provided
//       onReport?.(reasonLabel);

//       // Show success modal
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

//   // Predefined reasons (unique)
//   const reportReasons = [
//     { id: "inappropriate", label: "محتوى غير لائق" },
//     { id: "misleading", label: "معلومات مضللة" },
//     { id: "spam", label: "رسائل مزعجة أو إعلان" },
//     { id: "harmful", label: "خطاب كراهية أو تمييز" },
//     { id: "personal_info", label: "نشر معلومات شخصية" },
//   ];

//   return (
//     <>
//       {/* Main Action Menu */}
//       <div className="relative z-[999]" ref={menuRef}>
//         {/* trigger button */}
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

//         {/* dropdown menu */}
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
//               <button
//                 onClick={() => {
//                   setOpen(false);
//                   onMessage?.();
//                 }}
//                 className="flex items-center gap-3 px-3 py-3 rounded-[20px] border border-[#D8D8D8] cursor-pointer bg-white/40 hover:backdrop-blur-sm"
//               >
//                 <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600">
//                   <img src="/icons/rate.svg" alt="rate" />
//                 </div>
//                 <div className="text-right">
//                   <div className="text-[#D72229] font-semibold">تقييم</div>
//                 </div>
//               </button>

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
//                     {isReporting ? "جاري الإرسال..." : "ابلاغ"}
//                   </div>
//                 </div>
//               </button>

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
//                   <div className="text-white/90 font-semibold">حجب</div>
//                 </div>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Report Reasons Modal - height auto, scrollable if needed */}
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
//             {/* Close button (X) */}
//             <button
//               onClick={handleCloseReasonsModal}
//               className="absolute left-4 top-4 text-gray-500 hover:text-gray-800 transition-colors z-10"
//               aria-label="إغلاق"
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

//             {/* Header: "ابلاغ عن الدرج" with blur background */}
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
//               ابلاغ عن الدرج
//             </div>

//             <div
//               className="w-full flex items-center justify-center flex-shrink-0"
//               style={{
//                 minHeight: "47px",
//               }}
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
//                 ليه بتبلغ عن الدرج ده؟
//               </p>
//             </div>

//             {/* List of reasons */}
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

//             {/* Small bottom spacing */}
//             <div className="h-4 flex-shrink-0"></div>
//           </div>
//         </div>
//       )}

//       {/* Success Modal */}
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
//             {/* Header attached to top */}
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
//               ابلاغ عن الدرج
//             </h2>

//             <div className="text-right w-full flex-1 flex flex-col justify-center items-center">
//               <div className="text-center">
//                 <p
//                   className="text-black mb-3 mt-4"
//                   style={{ fontSize: "25px", fontWeight: 400, lineHeight: "1.4" }}
//                 >
//                   تم استلام بلاغك
//                 </p>
//                 <p
//                   className="text-black"
//                   style={{ fontSize: "25px", fontWeight: 400, lineHeight: "1.4" }}
//                 >
//                   هيساعدنا بلاغك في مراجعة المحتوى والتأكد إن كل حاجة ماشية بشكل آمن وصحيح
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
//               اغلاق
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }










// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import toast from "react-hot-toast";

// type ActionMenuProps = {
//   onMessage?: () => void;
//   onReport?: (reason?: string) => void;
//   onBlock?: () => void;
//   // المعرف الأساسي للمنشور – يجب تمريره على الأقل واحد من الثلاثة:
//   postId?: string;              // المعرف الرئيسي (مفضل)
//   reportedPostId?: string;      // بديل (للتوافق)
//   reportedUserId?: string;      // اختياري
//   reporterId?: string;          // اختياري، يُقرأ من localStorage
//   reporterEmail?: string;       // اختياري، يُقرأ من localStorage
// };

// export default function ActionMenu({
//   onMessage,
//   onReport,
//   onBlock,
//   postId: propPostId,
//   reportedPostId: propReportedPostId,
//   reportedUserId,
//   reporterId: propReporterId,
//   reporterEmail: propReporterEmail,
 
// }: ActionMenuProps) {
 
//   const [open, setOpen] = useState(false);
//   const [showReportReasons, setShowReportReasons] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [selectedReason, setSelectedReason] = useState<string>("");
//   const [isReporting, setIsReporting] = useState(false);
//   const menuRef = useRef<HTMLDivElement | null>(null);
//   const modalRef = useRef<HTMLDivElement | null>(null);

//   // --- Helper functions to read from localStorage on demand ---
//   const getReporterId = (): string => {
//     if (propReporterId) return propReporterId;
//     if (typeof window === "undefined") return "";
//     try {
//       const userData = localStorage.getItem("userData");
//       if (userData) {
//         const parsed = JSON.parse(userData);
//         return parsed._id || "";
//       }
//       return localStorage.getItem("userid") || localStorage.getItem("followerId") || "";
//     } catch {
//       return "";
//     }
//   };

//   const getReporterEmail = (): string => {
//     if (propReporterEmail) return propReporterEmail;
//     if (typeof window === "undefined") return "";
//     try {
//       const userData = localStorage.getItem("userData");
//       if (userData) {
//         const parsed = JSON.parse(userData);
//         return parsed.useremail || parsed.email || parsed.useremail2 || "";
//       }
//       return localStorage.getItem("userEmail") || "";
//     } catch {
//       return "";
//     }
//   };

//   const getAccessToken = (): string => {
//     if (typeof window === "undefined") return "";
//     return localStorage.getItem("accessToken") || localStorage.getItem("token") || "";
//   };

//   // Close menu when clicking outside
//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     }
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   // Close modals on ESC key
//   useEffect(() => {
//     function handleEscape(e: KeyboardEvent) {
//       if (e.key === "Escape") {
//         if (showSuccessModal) {
//           setShowSuccessModal(false);
//         } else if (showReportReasons) {
//           setShowReportReasons(false);
//           setSelectedReason("");
//         }
//       }
//     }
//     document.addEventListener("keydown", handleEscape);
//     return () => document.removeEventListener("keydown", handleEscape);
//   }, [showReportReasons, showSuccessModal]);

//   // Prevent body scroll when modals are open
//   useEffect(() => {
//     if (showReportReasons || showSuccessModal) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [showReportReasons, showSuccessModal]);

//   // --- Click Handlers ---
//   const handleReportClick = () => {
//     setOpen(false);
//     const reporterId = getReporterId();
//     const reporterEmail = getReporterEmail();

//     if (!reporterId || !reporterEmail) {
//       toast.error("يرجى تسجيل الدخول أولاً");
//       return;
//     }

//     // تحديد معرف المنشور من أي من المصادر المتاحة
//     const postIdToUse = propPostId || propReportedPostId;
//     if (!postIdToUse && !reportedUserId) {
//       toast.error("لا يوجد عنصر للإبلاغ عنه");
//       return;
//     }

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
//     const accessToken = getAccessToken();

//     if (!reporterId || !reporterEmail) {
//       toast.error("يرجى تسجيل الدخول أولاً");
//       return;
//     }

//     setSelectedReason(reasonLabel);
//     setIsReporting(true);

//     try {
//       // استخدام الـ API الثانية: /user/report
//       const url = "https://bo-chat.space/user/report";

//       const body: any = {
//         reporter: reporterId,
//         report: reasonLabel,
//         email: reporterEmail,
//       };

//       // إضافة حقول اختيارية
//       const postIdToUse = propPostId || propReportedPostId;
//       if (postIdToUse) {
//         body.postId = postIdToUse;
//       }
//       if (reportedUserId) {
//         body.reportedUserId = reportedUserId;
//       }

//       const headers: HeadersInit = {
//         "Content-Type": "application/json",
//       };
//       if (accessToken) {
//         headers.Authorization = `Bearer ${accessToken}`;
//       }

//       const response = await fetch(url, {
//         method: "POST",
//         headers,
//         body: JSON.stringify(body),
//       });

//       // محاولة تحليل الـ JSON، أو القراءة كنص
//       let data;
//       const contentType = response.headers.get("content-type");
//       if (contentType && contentType.includes("application/json")) {
//         data = await response.json();
//       } else {
//         data = await response.text();
//       }

//       if (!response.ok) {
//         const errorMessage = typeof data === "object" ? data?.message : data;
//         throw new Error(errorMessage || "فشل إرسال البلاغ");
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
// useEffect(() => {
//   console.log("postId:", propPostId);
//   console.log("reportedPostId:", propReportedPostId);
//   console.log("reportedUserId:", reportedUserId);
// }, []);
//   // قائمة أسباب التبليغ
//   const reportReasons = [
//     { id: "inappropriate", label: "محتوى غير لائق" },
//     { id: "misleading", label: "معلومات مضللة" },
//     { id: "spam", label: "رسائل مزعجة أو إعلان" },
//     { id: "harmful", label: "خطاب كراهية أو تمييز" },
//     { id: "personal_info", label: "نشر معلومات شخصية" },
//   ];

//   return (
//     <>
//       {/* القائمة الرئيسية */}
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
//               <button
//                 onClick={() => {
//                   setOpen(false);
//                   onMessage?.();
//                 }}
//                 className="flex items-center gap-3 px-3 py-3 rounded-[20px] border border-[#D8D8D8] cursor-pointer bg-white/40 hover:backdrop-blur-sm"
//               >
//                 <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600">
//                   <img src="/icons/rate.svg" alt="rate" />
//                 </div>
//                 <div className="text-right">
//                   <div className="text-[#D72229] font-semibold">تقييم</div>
//                 </div>
//               </button>

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
//                     {isReporting ? "جاري الإرسال..." : "ابلاغ"}
//                   </div>
//                 </div>
//               </button>

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
//                   <div className="text-white/90 font-semibold">حجب</div>
//                 </div>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* نافذة أسباب التبليغ */}
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
//               aria-label="إغلاق"
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
//               ابلاغ عن الدرج
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
//                 ليه بتبلغ عن الدرج ده؟
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

//       {/* نافذة النجاح */}
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
//               ابلاغ عن الدرج
//             </h2>

//             <div className="text-right w-full flex-1 flex flex-col justify-center items-center">
//               <div className="text-center">
//                 <p
//                   className="text-black mb-3 mt-4"
//                   style={{ fontSize: "25px", fontWeight: 400, lineHeight: "1.4" }}
//                 >
//                   تم استلام بلاغك
//                 </p>
//                 <p
//                   className="text-black"
//                   style={{ fontSize: "25px", fontWeight: 400, lineHeight: "1.4" }}
//                 >
//                   هيساعدنا بلاغك في مراجعة المحتوى والتأكد إن كل حاجة ماشية بشكل آمن وصحيح
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
//               اغلاق
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }


"use client";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

type ActionMenuProps = {
  onMessage?: () => void;
  onReport?: (reason?: string) => void; // Keep for external use, but we'll also handle API internally
  onBlock?: () => void;
  reporterId?: string; // optional, will use localStorage if not provided
  reporterEmail?: string; // optional, will use localStorage if not provided
  reportedUserId?: string; // the user being reported (required for report API)
  reportedPostId?: string; // if reporting a post, we can include it
};

export default function ActionMenu({
  onMessage,
  onReport,
  onBlock,
  reporterId: propReporterId,
  reporterEmail: propReporterEmail,
  reportedUserId,
  reportedPostId,
}: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const [showReportReasons, setShowReportReasons] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [isReporting, setIsReporting] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Get reporter data from localStorage if not provided
const getReporterId = (): string => {
  try {
    const userData = localStorage.getItem("userData");
    if (!userData) return "";

    const parsed = JSON.parse(userData);
    return parsed._id || "";
  } catch {
    return "";
  }
};

const getReporterEmail = (): string => {
  try {
    const userData = localStorage.getItem("userData");
    if (!userData) return "";

    const parsed = JSON.parse(userData);

    // عندك email الحقيقي هنا غالبًا في useremail أو useremail2
    return parsed.useremail || parsed.useremail2 || parsed.email || "";
  } catch {
    return "";
  }
};



  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Close modals on ESC key
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (showSuccessModal) {
          setShowSuccessModal(false);
        } else if (showReportReasons) {
          setShowReportReasons(false);
          setSelectedReason("");
        }
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showReportReasons, showSuccessModal]);

  // Prevent body scroll when any modal is open
  useEffect(() => {
    if (showReportReasons || showSuccessModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showReportReasons, showSuccessModal]);

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
    // If reporterId or email missing, show error
      const reporterId = getReporterId();
     const reporterEmail = getReporterEmail();
    if (!reporterId || !reporterEmail) {
      toast.error("يرجى تسجيل الدخول أولاً");
      return;
    }

    // If we need reportedUserId but it's missing, we can still proceed?
    // The API might require it, but the given example doesn't have it.
    // We'll send what we have.
    setSelectedReason(reasonLabel);
    setIsReporting(true);

    try {
      const body: any = {
        reporter: reporterId,
        report: reasonLabel,
        email: reporterEmail,
      };
      // Optionally include reportedUserId if available
      if (reportedUserId) {
        body.reportedUserId = reportedUserId;
      }
      if (reportedPostId) {
        body.postId = reportedPostId;
      }

      const response = await fetch("https://bo-chat.space/user/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Optionally include Authorization token if needed
          Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.text();
      if (!response.ok) {
        throw new Error(data || "فشل إرسال البلاغ");
      }

      // Call external onReport if provided
      onReport?.(reasonLabel);

      // Show success modal
      setShowReportReasons(false);
      setShowSuccessModal(true);
      toast.success("تم إرسال البلاغ بنجاح");
    } catch (error: any) {
      console.error("Report error:", error);
      toast.error(error.message || "حدث خطأ أثناء إرسال البلاغ");
    } finally {
      setIsReporting(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setSelectedReason("");
  };

  // Predefined reasons (unique)
  const reportReasons = [
    { id: "inappropriate", label: "محتوى غير لائق" },
    { id: "misleading", label: "معلومات مضللة" },
    { id: "spam", label: "رسائل مزعجة أو إعلان" },
    { id: "harmful", label: "خطاب كراهية أو تمييز" },
    { id: "personal_info", label: "نشر معلومات شخصية" },
  ];

  return (
    <>
      {/* Main Action Menu */}
      <div className="relative z-[999]" ref={menuRef}>
        {/* trigger button */}
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

        {/* dropdown menu */}
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
              <button
                onClick={() => {
                  setOpen(false);
                  onMessage?.();
                }}
                className="flex items-center gap-3 px-3 py-3 rounded-[20px] border border-[#D8D8D8] cursor-pointer bg-white/40 hover:backdrop-blur-sm"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600">
                  <img src="/icons/rate.svg" alt="rate" />
                </div>
                <div className="text-right">
                  <div className="text-[#D72229] font-semibold">تقييم</div>
                </div>
              </button>

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
                    {isReporting ? "جاري الإرسال..." : "ابلاغ"}
                  </div>
                </div>
              </button>

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
                  <div className="text-white/90 font-semibold">حجب</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Reasons Modal - height auto, scrollable if needed */}
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
            {/* Close button (X) */}
            <button
              onClick={handleCloseReasonsModal}
              className="absolute left-4 top-4 text-gray-500 hover:text-gray-800 transition-colors z-10"
              aria-label="إغلاق"
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

            {/* Header: "ابلاغ عن الدرج" with blur background */}
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
              ابلاغ عن الدرج
            </div>

            <div
              className="w-full flex items-center justify-center flex-shrink-0"
              style={{
                minHeight: "47px",
              }}
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
                ليه بتبلغ عن الدرج ده؟
              </p>
            </div>

            {/* List of reasons */}
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

            {/* Small bottom spacing */}
            <div className="h-4 flex-shrink-0"></div>
          </div>
        </div>
      )}

      {/* Success Modal */}
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
            {/* Header attached to top */}
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
              ابلاغ عن الدرج
            </h2>

            <div className="text-right w-full flex-1 flex flex-col justify-center items-center">
              <div className="text-center">
                <p
                  className="text-black mb-3 mt-4"
                  style={{ fontSize: "25px", fontWeight: 400, lineHeight: "1.4" }}
                >
                  تم استلام بلاغك
                </p>
                <p
                  className="text-black"
                  style={{ fontSize: "25px", fontWeight: 400, lineHeight: "1.4" }}
                >
                  هيساعدنا بلاغك في مراجعة المحتوى والتأكد إن كل حاجة ماشية بشكل آمن وصحيح
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
              اغلاق
            </button>
          </div>
        </div>
      )}
    </>
  );
}