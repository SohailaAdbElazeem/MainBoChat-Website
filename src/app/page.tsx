// // src/app/page.txs
// "use client";

// import { useState, useEffect } from "react";
// import PostsFeed from "./_components/PostsFeed";
// import QRLoginModal from "./_components/QRLoginModal";
// // 🌟 استيراد سياق الترجمة
// import { useTranslation } from "@/contexts/TranslationContext";

// export default function Home() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [showQRModal, setShowQRModal] = useState(false);

//   // 🌟 استخراج اللغة الحالية من سياق الترجمة
//   const { language } = useTranslation();
//   const currentLang = language || 'ar';
//   const isAr = currentLang === 'ar';

//   const checkLogin = () => {
//     const userData = localStorage.getItem("userData");
//     const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
//     setIsLoggedIn(!!(userData && token));
//   };

//   useEffect(() => {
//     checkLogin();
//     window.addEventListener("storage", checkLogin);
//     return () => window.removeEventListener("storage", checkLogin);
//   }, []);

//   const handleLoginSuccess = () => {
//     checkLogin();
//     // إرسال حدث مخصص لتحديث الهيدر فوراً بعد نجاح تسجيل الدخول
//     window.dispatchEvent(new Event('userDataUpdated'));
//   };

//   return (
//     // 🌟 ضبط الاتجاه العام للصفحة بناءً على اللغة المحددة
//     <div className="relative min-h-screen" dir={isAr ? "rtl" : "ltr"}>
//       <div className="min-w-[650px] max-w-full">
//         {/* 🌟 ترجمة العنوان وضبط محاذاته */}
//         <h1 className={`mb-2 text-2xl ${isAr ? 'mr-2 text-right' : 'ml-2 text-left'}`}>
//           {isAr ? "الفضفضات" : "Confessions "}
//         </h1>
//         <PostsFeed />
//       </div>

//       {!isLoggedIn && (
//         <div 
//           className="fixed bottom-0 left-0 right-0 w-full h-[75px] flex items-center justify-center z-50 shadow-lg"
//           style={{
//             background: "rgba(215, 34, 41, 0.70)",
//             backdropFilter: "blur(20px)",
//             WebkitBackdropFilter: "blur(20px)",
//             borderTop: "1px solid rgba(255,255,255,0.2)",
//           }}
//         >
//           <div className="container mx-auto px-10 flex flex-row items-center justify-around gap-4 md:gap-6">
            
//             {/* 🌟 النصوص المترجمة مع الحفاظ على التنسيقات والأحجام السابقة */}
//             <p
//               className="text-white flex-1 min-w-0"
//               style={{
//                 fontFamily: "Cairo, sans-serif",
//                 lineHeight: "100%",
//                 color: "#FFFFFF",
//                 textAlign: isAr ? "right" : "left",
//               }}
//             >
//               <span style={{ fontSize: "30px", fontWeight: 600 }}>
//                 {isAr ? "كن أول من يعرف الجديد... " : "Be the first to know... "}
//               </span>
//               <span style={{ fontSize: "20px", fontWeight: 600 }}>
//                 {isAr 
//                   ? "مستخدمو بو شات يواكبون الأحداث لحظة بلحظة" 
//                   : "Po Chat users stay updated moment by moment"}
//               </span>
//             </p>

//             <div className="flex items-center gap-3">
//               {/* 🌟 ترجمة زر "سجل الآن" */}
//               <button
//                 onClick={() => setShowQRModal(true)}
//                 className="w-[132px] h-[45px] rounded-[17px] bg-white text-[#D72229] text-[20px] font-normal leading-none text-center flex items-center justify-center hover:bg-gray-100 transition-colors whitespace-nowrap"
//               >
//                 {isAr ? "سجل الآن" : "Register Now"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* QR Login Modal */}
//       <QRLoginModal
//         isOpen={showQRModal}
//         onClose={() => setShowQRModal(false)}
//         onLoginSuccess={handleLoginSuccess}
//       />
//     </div>
//   );
// }



// src/app/page.txs
"use client";

import { useState, useEffect } from "react";
import PostsFeed from "./_components/PostsFeed";
import QRLoginModal from "./_components/QRLoginModal";
// 🌟 استيراد سياق الترجمة
import { useTranslation } from "@/contexts/TranslationContext";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  // 🌟 استخراج اللغة الحالية من سياق الترجمة
  const { language } = useTranslation();
  const currentLang = language || 'ar';
  const isAr = currentLang === 'ar';

  const checkLogin = () => {
    const userData = localStorage.getItem("userData");
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    setIsLoggedIn(!!(userData && token));
  };

  useEffect(() => {
    checkLogin();
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  const handleLoginSuccess = () => {
    checkLogin();
    // إرسال حدث مخصص لتحديث الهيدر فوراً بعد نجاح تسجيل الدخول
    window.dispatchEvent(new Event('userDataUpdated'));
  };

  return (
    // 🌟 ضبط الاتجاه العام للصفحة بناءً على اللغة المحددة
    <div className="relative min-h-screen" dir={isAr ? "rtl" : "ltr"}>
      <div className="min-w-[650px] max-w-full">
        {/* 🌟 ترجمة العنوان وضبط محاذاته */}
        <h1 className={`mb-2 text-2xl ${isAr ? 'mr-2 text-right' : 'ml-2 text-left'}`}>
          {isAr ? "الفضفضات" : "Confessions "}
        </h1>
        <PostsFeed />
      </div>

 {!isLoggedIn && (
  <div 
    className="fixed bottom-0 left-0 right-0 w-full min-h-[75px] py-3 sm:py-0 flex items-center justify-center z-50 shadow-lg"
    style={{
      background: "rgba(215, 34, 41, 0.70)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderTop: "1px solid rgba(255,255,255,0.2)",
    }}
  >
    <div className="container mx-auto px-4 sm:px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
      
      {/* النصوص المترجمة المتجاوبة */}
      <p
        className="text-white w-full sm:flex-1 min-w-0"
        style={{
          fontFamily: "Cairo, sans-serif",
          lineHeight: "1.4",
          color: "#FFFFFF",
          textAlign: isAr ? "right" : "left",
        }}
      >
        <span className="block sm:inline text-lg sm:text-xl lg:text-[30px] font-semibold">
          {isAr ? "كن أول من يعرف الجديد... " : "Be the first to know... "}
        </span>
        <span className="block sm:inline text-sm sm:text-base lg:text-[20px] font-semibold opacity-90">
          {isAr 
            ? "مستخدمو بو شات يواكبون الأحداث لحظة بلحظة" 
            : "Po Chat users stay updated moment by moment"}
        </span>
      </p>

      <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
        {/* ترجمة زر "سجل الآن" */}
        <button
          onClick={() => setShowQRModal(true)}
          className="w-full sm:w-[132px] h-[40px] sm:h-[45px] rounded-[17px] bg-white text-[#D72229] text-base sm:text-[20px] font-normal leading-none text-center flex items-center justify-center hover:bg-gray-100 transition-colors whitespace-nowrap shadow-sm"
        >
          {isAr ? "سجل الآن" : "Register Now"}
        </button>
      </div>

    </div>
  </div>
)}

      {/* QR Login Modal */}
      <QRLoginModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}