// // import LoginBanner from "./_components/LoginBanner";
// // import PostsFeed from "./_components/PostsFeed";

// // export default function Home() {
// //   return (
// //     <div>
// //         <div className="min-w-[650px] max-w-full" >
          
// //           <h1 dir="rtl" className="mb-2 mr-2 text-2xl">الفضفضات</h1>
// //           <PostsFeed />
// //          </div>
// //       {/* <LoginBanner/> */}
// //     </div>
// //   );
// // }


// "use client";

// import { useState, useEffect } from "react";
// import PostsFeed from "./_components/PostsFeed";

// export default function Home() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const checkLogin = () => {
//       const userData = localStorage.getItem("userData");
//       const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
//       setIsLoggedIn(!!(userData && token));
//     };
//     checkLogin();
//     window.addEventListener("storage", checkLogin);
//     return () => window.removeEventListener("storage", checkLogin);
//   }, []);

//   return (
//     <div className="relative min-h-screen">
//       <div className="min-w-[650px] max-w-full">
//         <h1 dir="rtl" className="mb-2 mr-2 text-2xl">الفضفضات</h1>
//         <PostsFeed />
//       </div>

//       {!isLoggedIn && (
//         <div className="fixed bottom-0 left-0 right-0 w-full h-[80px] bg-[#D72229] flex items-center justify-center z-50 shadow-lg">
//           <div className="container mx-auto px-10 flex flex-row items-center justify-between gap-4 md:gap-6">
//             {/* النص - حسب التصميم المطلوب */}
//             <p
//               className="text-white text-[30px] font-semibold leading-none text-right"
//               style={{
//                 fontFamily: "Cairo, sans-serif",
//                 fontWeight: 600,
//                 fontSize: "25px",
//                 lineHeight: "100%",
//                 textAlign: "right",
//                 color: "#FFFFFF",
//               }}
//             >
//               كن أول من يعرف الجديد... مستخدمو بو شات يواكبون الأحداث لحظة بلحظة
//             </p>

//             <div className="flex items-center gap-3">
//               {/* زر "انشاء حساب" - حسب التصميم */}
//               <a
//                 href="/register"
//                 className="w-[194px] h-[45px] rounded-[17px] border border-white text-white text-[20px] font-normal leading-none text-center flex items-center justify-center hover:bg-white/10 transition-colors whitespace-nowrap"
//               >
//                 انشاء حساب
//               </a>
//               {/* زر "سجل الآن" - حسب التصميم */}
//               <a
//                 href="/login"
//                 className="w-[132px] h-[45px] rounded-[17px] bg-white text-[#D72229] text-[20px] font-normal leading-none text-center flex items-center justify-center hover:bg-gray-100 transition-colors whitespace-nowrap"
//               >
//                تسجيل
//               </a>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import PostsFeed from "./_components/PostsFeed";
import QRLoginModal from "./_components/QRLoginModal";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

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
    // تحديث حالة تسجيل الدخول
    checkLogin();
    // يمكن إغلاق المودال هنا ولكن onClose سيتم استدعاؤها من المودال نفسه بعد onLoginSuccess
  };

  return (
    <div className="relative min-h-screen">
      <div className="min-w-[650px] max-w-full">
        <h1 dir="rtl" className="mb-2 mr-2 text-2xl">الفضفضات</h1>
        <PostsFeed />
      </div>

      {!isLoggedIn && (
        <div className="fixed bottom-0 left-0 right-0 w-full h-[80px] bg-[#D72229] flex items-center justify-center z-50 shadow-lg">
          <div className="container mx-auto px-10 flex flex-row items-center justify-between gap-4 md:gap-6">
            {/* النص */}
            <p
              className="text-white text-[30px] font-semibold leading-none text-right"
              style={{
                fontFamily: "Cairo, sans-serif",
                fontWeight: 600,
                fontSize: "25px",
                lineHeight: "100%",
                textAlign: "right",
                color: "#FFFFFF",
              }}
            >
              كن أول من يعرف الجديد... مستخدمو بو شات يواكبون الأحداث لحظة بلحظة
            </p>

            <div className="flex items-center gap-3">
              {/* زر "انشاء حساب" */}
              {/* <a
                href="/register"
                className="w-[194px] h-[45px] rounded-[17px] border border-white text-white text-[20px] font-normal leading-none text-center flex items-center justify-center hover:bg-white/10 transition-colors whitespace-nowrap"
              >
                انشاء حساب
              </a> */}
              {/* زر "سجل الآن" - يفتح QR modal */}
              <button
                onClick={() => setShowQRModal(true)}
                className="w-[132px] h-[45px] rounded-[17px] bg-white text-[#D72229] text-[20px] font-normal leading-none text-center flex items-center justify-center hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                سجل الآن
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