// // "use client";

// // import React, { useEffect, useState, useRef } from "react";
// // import { useRouter } from "next/navigation";
// // import StyledQRCode from "../_components/StyledQRCode";
// // import wsService from "@/lib/websocketService";
// // import Loader from "@/components/Loader";

// // const LoginPage = () => {
// //   const [sessionId, setSessionId] = useState<string>("");
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string>("");

// //   const hasLoggedInRef = useRef(false);
// //   const unsubscribeRef = useRef<(() => void) | undefined>();
// //   const router = useRouter();

// //   useEffect(() => {
// //     // 1. إذا كان المستخدم مسجلاً دخوله بالفعل، اذهب مباشرة إلى الرئيسية
// //     const token = localStorage.getItem("accessToken");
// //     if (token && localStorage.getItem("isLoggedIn") === "true") {
// //       router.replace("/");
// //       return;
// //     }

// //     let isMounted = true;
// //     let intervalId: NodeJS.Timeout | null = null;

// //     const init = async () => {
// //       try {
// //         const res = await fetch("https://bo-chat.space/qrCode");
// //         if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

// //         const data = await res.json();
// //         if (!isMounted) return;
// //         if (!data?.sessionId) throw new Error("No sessionId from server");

// //         setSessionId(data.sessionId);
// //         localStorage.setItem("SessionId", data.sessionId);

// //         const unsubscribe = wsService.addHandler((message: any) => {
// //           console.log("📩 WS Message received:", message);

// //           //   qrApproved هو حدث النجاح
// //           if (message.event !== "qrApproved") return;
// //           if (hasLoggedInRef.current) return;

// //           hasLoggedInRef.current = true;

// //           const payload = message.data || {};
// //           const accessToken = payload.accessToken;
// //           const refreshToken = payload.refreshToken;
// //           const userData = payload.data;

// //           if (!accessToken) {
// //             console.error("❌ No accessToken in qrApproved message");
// //             return;
// //           }

// //           console.log("✅ QR Login Approved! Saving tokens...");

// //           // حفظ البيانات
// //           localStorage.setItem("accessToken", accessToken);
// //           if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
// //           if (userData) localStorage.setItem("userData", JSON.stringify(userData));
// //           localStorage.setItem("isLoggedIn", "true");

// //           // تنظيف WebSocket
// //           wsService.disconnect();
// //           if (unsubscribeRef.current) unsubscribeRef.current();

// //           // تأخير بسيط لضمان اكتمال الحفظ ثم التوجيه
// //           setTimeout(() => {
// //             // استخدام replace مع force
// //             router.replace("/");
// //             // احتياطي: في حال فشل Next.js router، نستخدم window.location
// //             setTimeout(() => {
// //               if (window.location.pathname !== "/") {
// //                 window.location.href = "/";
// //               }
// //             }, 100);
// //           }, 100);
// //         });

// //         unsubscribeRef.current = unsubscribe;
// //         wsService.connect(`qr-${data.sessionId}`);

// //         intervalId = setInterval(() => {
// //           if (wsService.socket?.readyState === WebSocket.OPEN) {
// //             wsService.send({
// //               event: "registerSession",
// //               sessionId: data.sessionId,
// //             });
// //             if (intervalId) clearInterval(intervalId);
// //           }
// //         }, 150);
// //       } catch (err: any) {
// //         console.error("Init error:", err);
// //         if (isMounted) setError(err.message || "فشل في تحميل QR Code");
// //       } finally {
// //         if (isMounted) setLoading(false);
// //       }
// //     };

// //     init();

// //     return () => {
// //       isMounted = false;
// //       if (intervalId) clearInterval(intervalId);
// //       wsService.disconnect();
// //       if (unsubscribeRef.current) unsubscribeRef.current();
// //     };
// //   }, [router]);

// //   // إضافة تأثير إضافي للتحقق بعد التحميل إذا وجد توكن
// //   useEffect(() => {
// //     if (!loading) {
// //       const token = localStorage.getItem("accessToken");
// //       if (token && localStorage.getItem("isLoggedIn") === "true") {
// //         router.replace("/");
// //       }
// //     }
// //   }, [loading, router]);

// //   if (loading) {
// //     return <div className="min-h-screen bg-[#D72229] flex items-center justify-center text-white text-xl">جاري تحميل الكود...</div>;
// //   }

// //   if (error) {
// //     return <div className="min-h-screen bg-[#D72229] flex items-center justify-center text-white">{error}</div>;
// //   }

// //   return (
// //     <div className="min-h-screen bg-[#D72229] flex flex-col items-center justify-center relative text-white main-layer">
// //       <a href="/">
// //         <img src="/logo.png" className="absolute top-5 left-1/2 -translate-x-1/2 w-[47px]" alt="شعار بو شات" />
// //       </a>

// //       <img src="/logo.png" className="layer-1" alt="شعار بو شات" />
// //       <img src="/logo.png" className="layer-2" alt="شعار بو شات" />

// //       <div className="flex items-start gap-5 z-10">
// //         <div className="shadow-xl rounded-[28px] max-w-[280px] overflow-hidden">
// //           <p className="text-center text-[#D72229] mt-3 font-semibold text-[28px] p-4 bg-white/90 rounded-t-[28px]">
// //             امسح الكود الآن
// //           </p>
// //           {sessionId && (
// //             <div className="bg-white p-6 flex items-center justify-center rounded-b-[28px]">
// //               <StyledQRCode
// //                 value={JSON.stringify({ event: "LOGIN", sessionId })}
// //               />
// //             </div>
// //           )}
// //         </div>

// //         <div className="max-w-xl">
// //           <h1 className="text-[45px] mb-1">أهلاً بيك في بو شات Web</h1>
// //           <p className="text-black mb-5 text-[20px]">
// //             ادخل على حسابك بسهولة ومن غير ما تكتب كلمة سر
// //           </p>
// //           <p className="mb-3 font-semibold text-[18px]">علشان تسجّل دخولك:</p>
// //           <ol className="space-y-2 text-black text-[15px]">
// //             <li>1. افتح تطبيق بو شات على موبايلك</li>
// //             <li>2. روح للإعدادات</li>
// //             <li>3. اختار تسجيل الدخول من الويب</li>
// //             <li>4. امسح الكود بالكاميرا</li>
// //             <li>5. هتلاقي حسابك فتح تلقائي</li>
// //           </ol>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default LoginPage;

// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import { useRouter } from "next/navigation";
// import StyledQRCode from "../_components/StyledQRCode";
// import wsService from "@/lib/websocketService";

// // Loading Screen Component
// const LoadingScreen = () => {
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setProgress((prev) => (prev >= 99 ? 99 : prev + 1));
//     }, 30);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="min-h-screen bg-[#D72229] flex flex-col items-center justify-center relative">
//       {/* <a href="/">
//         <img
//           src="/logo.png"
//           className="absolute top-5 left-1/2 -translate-x-1/2 w-[47px] z-10"
//           alt="شعار بو شات"
//         />
//       </a> */}
//       <img src="/logo.png" className="layer-1" alt="" />
//       <img src="/logo.png" className="layer-2" alt="" />

//       <div className="flex flex-col items-center z-10">
//           <a href="/">
//     <img
//       src="/logo.png"
//       className="w-[47px] mb-6"
//       alt="شعار بو شات"
//     />
//   </a>
//         <div
//           className="text-white font-semibold text-right leading-[50px]"
//           style={{
//             // width: "281px",
//             height: "50px",
//             fontFamily: "Cairo, sans-serif",
//             fontWeight: 600,
//             fontSize: "20px",
//             lineHeight: "50px",
//             textAlign: "right",
//           }}
//         >
//           استني شوية... جاري تحميل البيانات
//         </div>
// <div className="w-[320px] mt-4" dir="ltr">
//   <div
//     className={`w-full rounded-full h-2 overflow-hidden ${
//       progress === 100 ? "bg-white" : "bg-white/30"
//     }`}
//   >
//     <div
//       className="bg-white h-full rounded-full transition-all duration-75 ease-linear"
//       style={{ width: `${progress}%` }}
//     />
//   </div>
// </div>
//         <div
//           className="text-right leading-[50px] text-white"
//           style={{
//             // width: "204px",
//             // height: "50px",
//             fontFamily: "Cairo, sans-serif",
//             fontWeight: 400,
//             fontSize: "15px",
//             lineHeight: "50px",
//             textAlign: "right",
//             // color: "#000",
//             paddingRight: "12px",
//           }}
//         >
//           الشات بتاعك مشفر من الأول للآخر
//         </div>
//       </div>
//     </div>
//    );
// };

// // Main Login Page
// const LoginPage = () => {
//   const [sessionId, setSessionId] = useState<string>("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string>("");

//   const hasLoggedInRef = useRef(false);
//   const unsubscribeRef = useRef<(() => void) | undefined>();
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     if (token && localStorage.getItem("isLoggedIn") === "true") {
//       router.replace("/");
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
//           if (message.event !== "qrApproved") return;
//           if (hasLoggedInRef.current) return;
//           hasLoggedInRef.current = true;

//           const payload = message.data || {};
//           const accessToken = payload.accessToken;
//           const refreshToken = payload.refreshToken;
//           const userData = payload.data;

//           if (!accessToken) {
//             console.error("❌ No accessToken in qrApproved message");
//             return;
//           }

//           localStorage.setItem("accessToken", accessToken);
//           if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
//           if (userData) localStorage.setItem("userData", JSON.stringify(userData));
//           localStorage.setItem("isLoggedIn", "true");

//           wsService.disconnect();
//           if (unsubscribeRef.current) unsubscribeRef.current();

//           setTimeout(() => {
//             router.replace("/");
//             setTimeout(() => {
//               if (window.location.pathname !== "/") window.location.href = "/";
//             }, 100);
//           }, 100);
//         });

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
//   }, [router]);

//   useEffect(() => {
//     if (!loading) {
//       const token = localStorage.getItem("accessToken");
//       if (token && localStorage.getItem("isLoggedIn") === "true") {
//         router.replace("/");
//       }
//     }
//   }, [loading, router]);

//   if (loading) return <LoadingScreen />;
//   if (error) return <div className="min-h-screen bg-[#D72229] flex items-center justify-center text-white">{error}</div>;

//   return (
//     <div className="min-h-screen bg-[#D72229] flex flex-col items-center justify-center relative text-white main-layer">
//       <a href="/">
//         <img src="/logo.png" className="absolute top-5 left-1/2 -translate-x-1/2 w-[47px]" alt="شعار بو شات" />
//       </a>
//       <img src="/logo.png" className="layer-1" alt="" />
//       <img src="/logo.png" className="layer-2" alt="" />

//       <div className="flex items-start gap-5 z-10">
//         <div className="shadow-xl rounded-[28px] max-w-[280px] overflow-hidden">
//           <p className="text-center text-[#D72229] mt-3 font-semibold text-[28px] p-4 bg-white/90 rounded-t-[28px]">
//             امسح الكود الآن
//           </p>
//           {sessionId && (
//             <div className="bg-white p-6 flex items-center justify-center rounded-b-[28px]">
//               <StyledQRCode value={JSON.stringify({ event: "LOGIN", sessionId })} />
//             </div>
//           )}
//         </div>

//         <div className="max-w-xl">
//           <h1 className="text-[45px] mb-1">أهلاً بيك في بو شات Web</h1>
//           <p className="text-black mb-5 text-[20px]">ادخل على حسابك بسهولة ومن غير ما تكتب كلمة سر</p>
//           <p className="mb-3 font-semibold text-[18px]">علشان تسجّل دخولك:</p>
//           <ol className="space-y-2 text-black text-[15px]">
//             <li>1. افتح تطبيق بو شات على موبايلك</li>
//             <li>2. روح للإعدادات</li>
//             <li>3. اختار تسجيل الدخول من الويب</li>
//             <li>4. امسح الكود بالكاميرا</li>
//             <li>5. هتلاقي حسابك فتح تلقائي</li>
//           </ol>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;


"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import StyledQRCode from "../_components/StyledQRCode";
import wsService from "@/lib/websocketService";

// 1. قاموس الترجمة (Translations Dictionary)
const translations = {
  ar: {
    loading: "استني شوية... جاري تحميل البيانات",
    encrypted: "الشات بتاعك مشفر من الأول للآخر",
    qrError: "فشل في تحميل QR Code",
    scanNow: "امسح الكود الآن",
    welcome: "أهلاً بيك في بو شات Web",
    subWelcome: "ادخل على حسابك بسهولة ومن غير ما تكتب كلمة سر",
    stepsTitle: "علشان تسجّل دخولك:",
    step1: "1. افتح تطبيق بو شات على موبايلك",
    step2: "2. روح للإعدادات",
    step3: "3. اختار تسجيل الدخول من الويب",
    step4: "4. امسح الكود بالكاميرا",
    step5: "5. هتلاقي حسابك فتح تلقائي",
    changeLang: "English",
    dir: "rtl"
  },
  en: {
    loading: "Wait a moment... Loading data",
    encrypted: "Your chats are end-to-end encrypted",
    qrError: "Failed to load QR Code",
    scanNow: "Scan the code now",
    welcome: "Welcome to Bo Chat Web",
    subWelcome: "Log in to your account easily without a password",
    stepsTitle: "To log in:",
    step1: "1. Open Bo Chat app on your phone",
    step2: "2. Go to Settings",
    step3: "3. Choose 'Web Login'",
    step4: "4. Scan the QR code with your camera",
    step5: "5. Your account will open automatically",
    changeLang: "العربية",
    dir: "ltr"
  }
};

// Loading Screen Component
const LoadingScreen = ({ lang }: { lang: "ar" | "en" }) => {
  const [progress, setProgress] = useState(0);
  const t = translations[lang];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 99 ? 99 : prev + 1));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#D72229] flex flex-col items-center justify-center relative" dir={t.dir}>
      <img src="/logo.png" className="layer-1" alt="" />
      <img src="/logo.png" className="layer-2" alt="" />

      <div className="flex flex-col items-center z-10">
        <a href="/">
          <img src="/logo.png" className="w-[47px] mb-6" alt="Logo" />
        </a>
        <div
          className="text-white font-semibold"
          style={{
            height: "50px",
            fontFamily: "Cairo, sans-serif",
            fontWeight: 600,
            fontSize: "20px",
            lineHeight: "50px",
          }}
        >
          {t.loading}
        </div>
        <div className="w-[320px] mt-4" dir="ltr">
          <div className={`w-full rounded-full h-2 overflow-hidden ${progress === 100 ? "bg-white" : "bg-white/30"}`}>
            <div
              className="bg-white h-full rounded-full transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div
          className="text-white"
          style={{
            fontFamily: "Cairo, sans-serif",
            fontWeight: 400,
            fontSize: "15px",
            lineHeight: "50px",
            paddingRight: "12px",
          }}
        >
          {t.encrypted}
        </div>
      </div>
    </div>
  );
};

// Main Login Page
const LoginPage = () => {
  // 2. حالة اللغة الحالية (يمكنك جعلها تقرأ من localStorage لاحقاً لتذكر خيار المستخدم)
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const t = translations[lang];

  const [sessionId, setSessionId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const hasLoggedInRef = useRef(false);
  const unsubscribeRef = useRef<(() => void) | undefined>();
  const router = useRouter();

  // تغيير اللغة
  const toggleLanguage = () => {
    setLang((prev) => (prev === "ar" ? "en" : "ar"));
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && localStorage.getItem("isLoggedIn") === "true") {
      router.replace("/");
      return;
    }

    let isMounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    const init = async () => {
      try {
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

          wsService.disconnect();
          if (unsubscribeRef.current) unsubscribeRef.current();

          setTimeout(() => {
            router.replace("/");
            setTimeout(() => {
              if (window.location.pathname !== "/") window.location.href = "/";
            }, 100);
          }, 100);
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
        if (isMounted) setError(t.qrError); // استخدام النص المترجم للخطأ
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
  }, [router, t.qrError]);

  useEffect(() => {
    if (!loading) {
      const token = localStorage.getItem("accessToken");
      if (token && localStorage.getItem("isLoggedIn") === "true") {
        router.replace("/");
      }
    }
  }, [loading, router]);

  if (loading) return <LoadingScreen lang={lang} />;
  if (error) return <div className="min-h-screen bg-[#D72229] flex items-center justify-center text-white">{error}</div>;

  return (
    <div className="min-h-screen bg-[#D72229] flex flex-col items-center justify-center relative text-white main-layer" dir={t.dir}>
      
      {/* زر تغيير اللغة في أعلى اليمين/اليسار حسب الاتجاه */}
      <button 
        onClick={toggleLanguage} 
        className="absolute top-5 right-5 bg-white text-[#D72229] px-4 py-1.5 rounded-full font-semibold text-sm shadow-md hover:bg-opacity-90 transition-all z-20"
      >
        {t.changeLang}
      </button>

      <a href="/">
        <img src="/logo.png" className="absolute top-5 left-1/2 -translate-x-1/2 w-[47px]" alt="Logo" />
      </a>
      <img src="/logo.png" className="layer-1" alt="" />
      <img src="/logo.png" className="layer-2" alt="" />

      {/* تم تغيير gap و الاستايل ليدعم قلب العناصر مرناً حسب اللغة */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-10 z-10 p-4">
        <div className="shadow-xl rounded-[28px] max-w-[280px] overflow-hidden">
          <p className="text-center text-[#D72229] mt-3 font-semibold text-[24px] p-4 bg-white/90 rounded-t-[28px]">
            {t.scanNow}
          </p>
          {sessionId && (
            <div className="bg-white p-6 flex items-center justify-center rounded-b-[28px]">
              <StyledQRCode value={JSON.stringify({ event: "LOGIN", sessionId })} />
            </div>
          )}
        </div>

        <div className="max-w-xl text-center md:text-start">
          <h1 className="text-[36px] md:text-[45px] mb-1">{t.welcome}</h1>
          <p className="text-black mb-5 text-[18px] md:text-[20px]">{t.subWelcome}</p>
          <p className="mb-3 font-semibold text-[18px]">{t.stepsTitle}</p>
          <ol className="space-y-2 text-black text-[15px] list-none p-0">
            <li>{t.step1}</li>
            <li>{t.step2}</li>
            <li>{t.step3}</li>
            <li>{t.step4}</li>
            <li>{t.step5}</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;