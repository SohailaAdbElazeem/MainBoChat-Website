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
        <div 
      className="fixed bottom-0 left-0 right-0 w-full h-[80px] flex items-center justify-center z-50 shadow-lg"
  style={{
    background: "rgba(215, 34, 41, 0.70)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderTop: "1px solid rgba(255,255,255,0.2)",
  }}
        >
          <div 
          className="container mx-auto px-10 flex flex-row items-center justify-around  gap-4 md:gap-6">
            {/* النص */}

            
            <p
              className="text-white text-[25px] md:text-[30px] font-semibold leading-none text-right flex-1 min-w-0"
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