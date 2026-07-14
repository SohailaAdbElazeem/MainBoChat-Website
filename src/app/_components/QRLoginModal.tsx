// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import StyledQRCode from "./StyledQRCode";
// import wsService from "@/lib/websocketService";

// interface QRLoginModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onLoginSuccess: () => void;
// }

// const QRLoginModal: React.FC<QRLoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
//   const [sessionId, setSessionId] = useState<string>("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string>("");
//   const hasLoggedInRef = useRef(false);
//   const unsubscribeRef = useRef<(() => void) | undefined>();

//   useEffect(() => {
//     if (!isOpen) {
//       wsService.disconnect();
//       if (unsubscribeRef.current) unsubscribeRef.current();
//       return;
//     }

//     let isMounted = true;
//     let intervalId: NodeJS.Timeout | null = null;

//     const init = async () => {
//       try {
//         const res = await fetch("https://bo-chat.space/qrCode");
//         if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
//         const data = await res.json();
//         if (!isMounted) return;
//         if (!data?.sessionId) throw new Error("No sessionId from server");

//         setSessionId(data.sessionId);
//         localStorage.setItem("SessionId", data.sessionId);


//         const unsubscribe = wsService.addHandler((message: any) => {
//   if (message.event !== "qrApproved") return;
//   if (hasLoggedInRef.current) return;
//   hasLoggedInRef.current = true;

//   const payload = message.data || {};
//   const accessToken = payload.accessToken;
//   const refreshToken = payload.refreshToken;
//   const userData = payload.data;

//   if (!accessToken) {
//     console.error("❌ No accessToken in qrApproved message");
//     return;
//   }

//   // ✅ حفظ البيانات
//   localStorage.setItem("accessToken", accessToken);
//   if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
//   if (userData) localStorage.setItem("userData", JSON.stringify(userData));
//   localStorage.setItem("isLoggedIn", "true");

//   // 🚀 الحل السحري: إطلاق الحدث يدوياً لإعلام الصفحة الحالية
//   window.dispatchEvent(new Event("storage"));

//   wsService.disconnect();
//   if (unsubscribeRef.current) unsubscribeRef.current();

//   onLoginSuccess();
//   onClose();
// });

//         unsubscribeRef.current = unsubscribe;
//         wsService.connect(`qr-${data.sessionId}`);

//         intervalId = setInterval(() => {
//           if (wsService.socket?.readyState === WebSocket.OPEN) {
//             wsService.send({ event: "registerSession", sessionId: data.sessionId });
//             if (intervalId) clearInterval(intervalId);
//           }
//         }, 150);
//       } catch (err: any) {
//         console.error("Init error:", err);
//         if (isMounted) setError(err.message || "فشل في تحميل QR Code");
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     init();

//     return () => {
//       isMounted = false;
//       if (intervalId) clearInterval(intervalId);
//       wsService.disconnect();
//       if (unsubscribeRef.current) unsubscribeRef.current();
//     };
//   }, [isOpen, onLoginSuccess, onClose]);

//   if (!isOpen) return null;

//   return (
//     // الخلفية - النقر عليها يغلق المودال
//     <div
//       className="fixed inset-0 bg-black/30 flex items-center justify-center z-[10000]"
//       onClick={onClose}
//     >
//       {/* البوكس الكبير - منع انتشار حدث النقر إلى الخلفية */}
//       <div
//         className="px-8 w-[1006px] h-[503px] rounded-[35px] bg-[#FFFFFF4D] backdrop-blur-[50px] shadow-2xl relative flex items-center gap-10"
//         dir="rtl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* قسم QR Code */}
//         <div className="flex flex-col items-center">
//           {!loading && !error && sessionId && (
//             <div
//               className="flex flex-col items-center justify-center rounded-[26px]"
//               style={{
//                 width: "320px",
//                 height: "416px",
//                 background: "#FFFFFFCC",
//                 backdropFilter: "blur(4px)",
//                 padding: "16px 12px",
//               }}
//             >
//               <p
//                 className="text-[#D72229] font-bold text-[38px] leading-[50px] text-center w-full"
//                 style={{
//                   fontFamily: "Cairo, sans-serif",
//                   fontWeight: 700,
//                   fontSize: "38px",
//                   lineHeight: "50px",
//                   color: "#D72229",
//                 }}
//               >
//                 امسح الكود الآن
//               </p>
//               <div className="mt-2 flex items-center justify-center">
//                 <StyledQRCode
//                   value={JSON.stringify({ event: "LOGIN", sessionId })}
//                   size={280}
//                   image="/imgs/876771 copy 1.svg"
//                   imageSize={0.3}
//                 />
//               </div>
//             </div>
//           )}
//         </div>

//         {/* قسم النصوص */}
//         <div className="flex flex-col justify-center gap-2 max-w-[569px]">
//           <h1
//             className="text-white font-semibold text-[55px] leading-[75px] text-right"
//             style={{
//               fontFamily: "Cairo, sans-serif",
//               fontWeight: 600,
//               fontSize: "40px",
//               lineHeight: "75px",
//               textAlign: "right",
//               color: "#FFFFFF",
//             }}
//           >
//             أهلاً بيك في بو شات Web
//           </h1>

//           <p
//             className="text-black font-semibold text-[30px] leading-[50px] text-right"
//             style={{
//               fontFamily: "Cairo, sans-serif",
//               fontWeight: 600,
//               fontSize: "25px",
//               lineHeight: "50px",
//               textAlign: "right",
//               color: "#000000",
//             }}
//           >
//             ادخل على حسابك بسهولة ومن غير ما تكتب
//             <br />
//             كلمة سر
//           </p>

     
//          <p
//             className="text-white font-semibold text-[25px] leading-[50px] text-right"
//             style={{
//               fontFamily: "Cairo, sans-serif",
//               fontWeight: 600,
//               fontSize: "20px",
//               lineHeight: "50px",
//               textAlign: "right",
//               color: "#FFFFFF",
//             }}
//           >
//             علشان تسجّل دخولك من المتصفح، اتبع الخطوات دي
//           </p>

//           <ul
//             className="text-black font-semibold text-[20px] leading-[35px] text-right list-none pr-0"
//             style={{
//               fontFamily: "Cairo, sans-serif",
//               fontWeight: 600,
//               fontSize: "16px",
//               lineHeight: "35px",
//               textAlign: "right",
//               color: "#000000",
//             }}
//           >
//             <li>1 افتح تطبيق بو شات على موبايلك</li>
//             <li>2 روح لـ الإعدادات</li>
//             <li>3 اختار تسجيل الدخول من الويب / الأجهزة المتوصّلة</li>
//             <li>4 استخدم الكاميرا وامسح الكود اللي قدّامك</li>
//             <li>5 خلال ثواني… هتلاقي حسابك فتح هنا</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QRLoginModal;


"use client";

import React, { useEffect, useState, useRef } from "react";
import StyledQRCode from "./StyledQRCode";
import wsService from "@/lib/websocketService";
// 🌟 استيراد سياق الترجمة الخاص بالتطبيق
import { useTranslation } from "@/contexts/TranslationContext";

interface QRLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

// كائن النصوص المترجمة داخلياً
const translations = {
  ar: {
    dir: "rtl" as const,
    textAlign: "right" as const,
    scanNow: "امسح الكود الآن",
    welcome: "أهلاً بيك في بو شات Web",
    subWelcome: "ادخل على حسابك بسهولة ومن غير ما تكتب كلمة سر",
    stepsTitle: "علشان تسجّل دخولك من المتصفح، اتبع الخطوات دي:",
    steps: [
      "1. افتح تطبيق بو شات على موبايلك",
      "2. روح لـ الإعدادات",
      "3. اختار تسجيل الدخول من الويب / الأجهزة المتوصّلة",
      "4. استخدم الكاميرا وامسح الكود اللي قدّامك",
      "5. خلال ثواني… هتلاقي حسابك فتح هنا"
    ],
    error: "فشل في تحميل QR Code",
    loading: "جاري التحميل..."
  },
  en: {
    dir: "ltr" as const,
    textAlign: "left" as const,
    scanNow: "Scan Code Now",
    welcome: "Welcome to Bo Chat Web",
    subWelcome: "Access your account easily without typing a password",
    stepsTitle: "To log in from your browser, follow these steps:",
    steps: [
      "1. Open Bo Chat app on your phone",
      "2. Go to Settings",
      "3. Select Web Login / Connected Devices",
      "4. Use your camera to scan the code on the screen",
      "5. In seconds... your account will be open here"
    ],
    error: "Failed to load QR Code",
    loading: "Loading..."
  }
};

const QRLoginModal: React.FC<QRLoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [sessionId, setSessionId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const hasLoggedInRef = useRef(false);
  const unsubscribeRef = useRef<(() => void) | undefined>();

  // 🌟 استهلاك اللغة من السياق مباشرة لضمان المزامنة التامة
  const { language } = useTranslation();
  const currentLang = language || "ar";

  // اختيار القاموس المناسب بناءً على قيمة اللغة الحالية من السياق
  const t = translations[currentLang] || translations.ar;

  useEffect(() => {
    if (!isOpen) {
      wsService.disconnect();
      if (unsubscribeRef.current) unsubscribeRef.current();
      return;
    }

    let isMounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    const init = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("https://bo-chat.space/qrCode");
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data = await res.json();
        if (!isMounted) return;
        if (!data?.sessionId) throw new Error("No sessionId from server");

        setSessionId(data.sessionId);
        localStorage.setItem("SessionId", data.sessionId);

        const unsubscribe = wsService.addHandler((message: any) => {
          if (message.event !== "qrApproved") return;
          if (hasLoggedInRef.current) return;
          hasLoggedInRef.current = true;

          const payload = message.data || {};
          const accessToken = payload.accessToken;
          const refreshToken = payload.refreshToken;
          const userData = payload.data;

          if (!accessToken) {
            console.error("❌ No accessToken in qrApproved message");
            return;
          }

          localStorage.setItem("accessToken", accessToken);
          if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
          if (userData) localStorage.setItem("userData", JSON.stringify(userData));
          localStorage.setItem("isLoggedIn", "true");

          window.dispatchEvent(new Event("storage"));

          wsService.disconnect();
          if (unsubscribeRef.current) unsubscribeRef.current();

          onLoginSuccess();
          onClose();
        });

        unsubscribeRef.current = unsubscribe;
        wsService.connect(`qr-${data.sessionId}`);

        intervalId = setInterval(() => {
          if (wsService.socket?.readyState === WebSocket.OPEN) {
            wsService.send({ event: "registerSession", sessionId: data.sessionId });
            if (intervalId) clearInterval(intervalId);
          }
        }, 150);
      } catch (err: any) {
        console.error("Init error:", err);
        if (isMounted) setError(err.message || t.error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    init();

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
      wsService.disconnect();
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, [isOpen, onLoginSuccess, onClose, t.error]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-[10000]"
      onClick={onClose}
    >
      <div
        className="px-8 w-[1006px] h-[503px] rounded-[35px] bg-[#FFFFFF4D] backdrop-blur-[50px] shadow-2xl relative flex items-center gap-10"
        dir={t.dir} // ينقلب تلقائياً بناءً على حال السياق الحالي للموقع
        onClick={(e) => e.stopPropagation()}
      >
        {/* قسم QR Code */}
        <div className="flex flex-col items-center justify-center min-w-[320px]">
          {loading && (
            <div className="text-white font-semibold text-[20px]">{t.loading}</div>
          )}
          
          {error && (
            <div className="text-red-200 font-semibold text-[18px] text-center">{error}</div>
          )}

          {!loading && !error && sessionId && (
            <div
              className="flex flex-col items-center justify-center rounded-[26px]"
              style={{
                width: "320px",
                height: "416px",
                background: "#FFFFFFCC",
                backdropFilter: "blur(4px)",
                padding: "16px 12px",
              }}
            >
              <p
                className="text-[#D72229] font-bold text-[34px] leading-[45px] text-center w-full"
                style={{
                  fontFamily: "Cairo, sans-serif",
                  fontWeight: 700,
                }}
              >
                {t.scanNow}
              </p>
              <div className="mt-2 flex items-center justify-center">
                <StyledQRCode
                  value={JSON.stringify({ event: "LOGIN", sessionId })}
                  size={280}
                  image="/imgs/876771 copy 1.svg"
                  imageSize={0.3}
                />
              </div>
            </div>
          )}
        </div>

        {/* قسم النصوص المستجيب للغة */}
        <div className="flex flex-col justify-center gap-2 max-w-[569px] w-full">
          <h1
            className="text-white font-semibold"
            style={{
              fontFamily: "Cairo, sans-serif",
              fontWeight: 600,
              fontSize: "40px",
              lineHeight: "60px",
              textAlign: t.textAlign,
            }}
          >
            {t.welcome}
          </h1>

          <p
            className="text-black font-semibold"
            style={{
              fontFamily: "Cairo, sans-serif",
              fontWeight: 600,
              fontSize: "22px",
              lineHeight: "40px",
              textAlign: t.textAlign,
            }}
          >
            {t.subWelcome}
          </p>

          <p
            className="text-white font-semibold"
            style={{
              fontFamily: "Cairo, sans-serif",
              fontWeight: 600,
              fontSize: "18px",
              lineHeight: "40px",
              textAlign: t.textAlign,
            }}
          >
            {t.stepsTitle}
          </p>

          <ul
            className="text-black font-semibold list-none"
            style={{
              fontFamily: "Cairo, sans-serif",
              fontWeight: 600,
              fontSize: "15px",
              lineHeight: "32px",
              textAlign: t.textAlign,
              paddingRight: t.dir === "rtl" ? "0px" : undefined,
              paddingLeft: t.dir === "ltr" ? "0px" : undefined,
            }}
          >
            {t.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QRLoginModal;