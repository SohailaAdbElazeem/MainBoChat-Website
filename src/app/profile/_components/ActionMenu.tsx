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
"use client";
import React, { useEffect, useRef, useState } from "react";

type ActionMenuProps = {
  onMessage?: () => void;
  onReport?: (reason?: string) => void;
  onBlock?: () => void;
  avatarUrl?: string;
};

export default function ActionMenu({ onMessage, onReport, onBlock }: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const [showReportReasons, setShowReportReasons] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const menuRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

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

  const handleReasonSelect = (reasonLabel: string) => {
    setSelectedReason(reasonLabel);
    onReport?.(reasonLabel);
    setShowReportReasons(false);
    setShowSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setSelectedReason("");
  };

  // Predefined reasons
  const reportReasons = [
    { id: "inappropriate", label: "محتوى غير لائق" },
    { id: "misleading", label: "معلومات مضللة" },
    { id: "spam", label: "رسائل مزعجة أو إعلان" },
    { id: "harmful", label: "خطاب كراهية أو تمييز" },
    { id: "personal_info", label: "نشر معلومات شخصية" },
    
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
                className="flex items-center gap-3 px-3 py-3 rounded-[20px] border border-[#D8D8D8] cursor-pointer bg-[#000]/40 hover:backdrop-blur-sm"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600">
                  <img src="/icons/flag.svg" className="invert brightness-0" alt="" />
                </div>
                <div className="text-right">
                  <div className="text-white/90 font-semibold">ابلاغ</div>
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
            <div className="mt-6 w-full px-8 space-y-4 flex-1" 
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
                  onClick={() => handleReasonSelect(reason.label)}
                  className="flex items-center gap-3 cursor-pointer group transition-all hover:bg-white/20 rounded-[19px]"
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
                        alt="report icon"
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