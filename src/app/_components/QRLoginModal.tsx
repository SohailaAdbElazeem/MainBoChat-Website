// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import StyledQRCode from "./StyledQRCode";
// import wsService from "@/lib/websocketService";
// // 🌟 استيراد سياق الترجمة الخاص بالتطبيق
// import { useTranslation } from "@/contexts/TranslationContext";

// interface QRLoginModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onLoginSuccess: () => void;
// }

// // كائن النصوص المترجمة داخلياً
// const translations = {
//   ar: {
//     dir: "rtl" as const,
//     textAlign: "right" as const,
//     scanNow: "امسح الكود الآن",
//     welcome: "أهلاً بيك في بو شات Web",
//     subWelcome: "ادخل على حسابك بسهولة ومن غير ما تكتب كلمة سر",
//     stepsTitle: "علشان تسجّل دخولك من المتصفح، اتبع الخطوات دي:",
//     steps: [
//       "1. افتح تطبيق بو شات على موبايلك",
//       "2. روح لـ الإعدادات",
//       "3. اختار تسجيل الدخول من الويب / الأجهزة المتوصّلة",
//       "4. استخدم الكاميرا وامسح الكود اللي قدّامك",
//       "5. خلال ثواني… هتلاقي حسابك فتح هنا"
//     ],
//     error: "فشل في تحميل QR Code",
//     loading: "جاري التحميل..."
//   },
//   en: {
//     dir: "ltr" as const,
//     textAlign: "left" as const,
//     scanNow: "Scan Code Now",
//     welcome: "Welcome to Bo Chat Web",
//     subWelcome: "Access your account easily without typing a password",
//     stepsTitle: "To log in from your browser, follow these steps:",
//     steps: [
//       "1. Open Bo Chat app on your phone",
//       "2. Go to Settings",
//       "3. Select Web Login / Connected Devices",
//       "4. Use your camera to scan the code on the screen",
//       "5. In seconds... your account will be open here"
//     ],
//     error: "Failed to load QR Code",
//     loading: "Loading..."
//   }
// };

// const QRLoginModal: React.FC<QRLoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
//   const [sessionId, setSessionId] = useState<string>("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string>("");
//   const hasLoggedInRef = useRef(false);
//   const unsubscribeRef = useRef<(() => void) | undefined>();

//   // 🌟 استهلاك اللغة من السياق مباشرة لضمان المزامنة التامة
//   const { language } = useTranslation();
//   const currentLang = language || "ar";

//   // اختيار القاموس المناسب بناءً على قيمة اللغة الحالية من السياق
//   const t = translations[currentLang] || translations.ar;

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
//         setLoading(true);
//         setError("");
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

//           window.dispatchEvent(new Event("storage"));

//           wsService.disconnect();
//           if (unsubscribeRef.current) unsubscribeRef.current();

//           onLoginSuccess();
//           onClose();
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
//         if (isMounted) setError(err.message || t.error);
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
//   }, [isOpen, onLoginSuccess, onClose, t.error]);

//   if (!isOpen) return null;

//   return (
//     <div
//       className="fixed inset-0 bg-black/30 flex items-center justify-center z-[10000]"
//       onClick={onClose}
//     >
//       <div
//         className="px-8 w-[1006px] h-[503px] rounded-[35px] bg-[#FFFFFF4D] backdrop-blur-[50px] shadow-2xl relative flex items-center gap-10"
//         dir={t.dir} // ينقلب تلقائياً بناءً على حال السياق الحالي للموقع
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* قسم QR Code */}
//         <div className="flex flex-col items-center justify-center min-w-[320px]">
//           {loading && (
//             <div className="text-white font-semibold text-[20px]">{t.loading}</div>
//           )}
          
//           {error && (
//             <div className="text-red-200 font-semibold text-[18px] text-center">{error}</div>
//           )}

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
//                 className="text-[#D72229] font-bold text-[34px] leading-[45px] text-center w-full"
//                 style={{
//                   fontFamily: "Cairo, sans-serif",
//                   fontWeight: 700,
//                 }}
//               >
//                 {t.scanNow}
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

//         {/* قسم النصوص المستجيب للغة */}
//         <div className="flex flex-col justify-center gap-2 max-w-[569px] w-full">
//           <h1
//             className="text-white font-semibold"
//             style={{
//               fontFamily: "Cairo, sans-serif",
//               fontWeight: 600,
//               fontSize: "40px",
//               lineHeight: "60px",
//               textAlign: t.textAlign,
//             }}
//           >
//             {t.welcome}
//           </h1>

//           <p
//             className="text-black font-semibold"
//             style={{
//               fontFamily: "Cairo, sans-serif",
//               fontWeight: 600,
//               fontSize: "22px",
//               lineHeight: "40px",
//               textAlign: t.textAlign,
//             }}
//           >
//             {t.subWelcome}
//           </p>

//           <p
//             className="text-white font-semibold"
//             style={{
//               fontFamily: "Cairo, sans-serif",
//               fontWeight: 600,
//               fontSize: "18px",
//               lineHeight: "40px",
//               textAlign: t.textAlign,
//             }}
//           >
//             {t.stepsTitle}
//           </p>

//           <ul
//             className="text-black font-semibold list-none"
//             style={{
//               fontFamily: "Cairo, sans-serif",
//               fontWeight: 600,
//               fontSize: "15px",
//               lineHeight: "32px",
//               textAlign: t.textAlign,
//               paddingRight: t.dir === "rtl" ? "0px" : undefined,
//               paddingLeft: t.dir === "ltr" ? "0px" : undefined,
//             }}
//           >
//             {t.steps.map((step, index) => (
//               <li key={index}>{step}</li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QRLoginModal;




// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import StyledQRCode from "./StyledQRCode";
// import wsService from "@/lib/websocketService";
// // 🌟 استيراد سياق الترجمة الخاص بالتطبيق
// import { useTranslation } from "@/contexts/TranslationContext";

// interface QRLoginModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onLoginSuccess: () => void;
// }

// // كائن النصوص المترجمة داخلياً
// const translations = {
//   ar: {
//     dir: "rtl" as const,
//     textAlign: "right" as const,
//     scanNow: "امسح الكود الآن",
//     welcome: "أهلاً بيك في بو شات Web",
//     subWelcome: "ادخل على حسابك بسهولة ومن غير ما تكتب كلمة سر",
//     stepsTitle: "علشان تسجّل دخولك من المتصفح، اتبع الخطوات دي:",
//     steps: [
//       "1. افتح تطبيق بو شات على موبايلك",
//       "2. روح لـ الإعدادات",
//       "3. اختار تسجيل الدخول من الويب / الأجهزة المتوصّلة",
//       "4. استخدم الكاميرا وامسح الكود اللي قدّامك",
//       "5. خلال ثواني… هتلاقي حسابك فتح هنا"
//     ],
//     error: "فشل في تحميل QR Code",
//     loading: "جاري التحميل..."
//   },
//   en: {
//     dir: "ltr" as const,
//     textAlign: "left" as const,
//     scanNow: "Scan Code Now",
//     welcome: "Welcome to Bo Chat Web",
//     subWelcome: "Access your account easily without typing a password",
//     stepsTitle: "To log in from your browser, follow these steps:",
//     steps: [
//       "1. Open Bo Chat app on your phone",
//       "2. Go to Settings",
//       "3. Select Web Login / Connected Devices",
//       "4. Use your camera to scan the code on the screen",
//       "5. In seconds... your account will be open here"
//     ],
//     error: "Failed to load QR Code",
//     loading: "Loading..."
//   }
// };

// const QRLoginModal: React.FC<QRLoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
//   const [sessionId, setSessionId] = useState<string>("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string>("");
//   const hasLoggedInRef = useRef(false);
//   const unsubscribeRef = useRef<(() => void) | undefined>();

//   // 🌟 استهلاك اللغة من السياق مباشرة لضمان المزامنة التامة
//   const { language } = useTranslation();
//   const currentLang = language || "ar";

//   // اختيار القاموس المناسب بناءً على قيمة اللغة الحالية من السياق
//   const t = translations[currentLang] || translations.ar;

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
//         setLoading(true);
//         setError("");
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

//           window.dispatchEvent(new Event("storage"));

//           wsService.disconnect();
//           if (unsubscribeRef.current) unsubscribeRef.current();

//           onLoginSuccess();
//           onClose();
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
//         if (isMounted) setError(err.message || t.error);
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
//   }, [isOpen, onLoginSuccess, onClose, t.error]);

//   if (!isOpen) return null;

//   return (
//     <div
//       className="fixed inset-0 bg-black/30 flex items-center justify-center z-[10000] p-4 sm:p-6 overflow-y-auto"
//       onClick={onClose}
//     >
//       <div
//         className="w-full max-w-5xl min-h-[auto] lg:h-[503px] rounded-[35px] bg-[#FFFFFF4D] backdrop-blur-[50px] shadow-2xl relative flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 p-6 sm:p-8 my-auto"
//         dir={t.dir} // ينقلب تلقائياً بناءً على حال السياق الحالي للموقع
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* قسم QR Code */}
//         <div className="flex flex-col items-center justify-center w-full lg:w-auto shrink-0">
//           {loading && (
//             <div className="text-white font-semibold text-[20px]">{t.loading}</div>
//           )}
          
//           {error && (
//             <div className="text-red-200 font-semibold text-[18px] text-center">{error}</div>
//           )}

//           {!loading && !error && sessionId && (
//             <div
//               className="flex flex-col items-center justify-center rounded-[26px] w-full max-w-[280px] sm:max-w-[320px] h-auto py-5 px-3 sm:px-4"
//               style={{
//                 background: "#FFFFFFCC",
//                 backdropFilter: "blur(4px)",
//               }}
//             >
//               <p
//                 className="text-[#D72229] font-bold text-2xl sm:text-[34px] leading-snug sm:leading-[45px] text-center w-full"
//                 style={{
//                   fontFamily: "Cairo, sans-serif",
//                   fontWeight: 700,
//                 }}
//               >
//                 {t.scanNow}
//               </p>
//               <div className="mt-4 flex items-center justify-center w-full overflow-hidden">
//                 <div className="w-[220px] sm:w-[260px] h-[220px] sm:h-[260px] flex items-center justify-center">
//                   <StyledQRCode
//                     value={JSON.stringify({ event: "LOGIN", sessionId })}
//                     size={240}
//                     image="/imgs/876771 copy 1.svg"
//                     imageSize={0.3}
//                   />
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* قسم النصوص المستجيب للغة */}
//         <div className="flex flex-col justify-center gap-2 max-w-full lg:max-w-[569px] w-full text-center lg:text-start">
//           <h1
//             className="text-white font-semibold"
//             style={{
//               fontFamily: "Cairo, sans-serif",
//               fontWeight: 600,
//               fontSize: "clamp(24px, 4vw, 40px)",
//               lineHeight: "clamp(35px, 5vw, 60px)",
//               textAlign: t.textAlign,
//             }}
//           >
//             {t.welcome}
//           </h1>

//           <p
//             className="text-black font-semibold"
//             style={{
//               fontFamily: "Cairo, sans-serif",
//               fontWeight: 600,
//               fontSize: "clamp(16px, 2vw, 22px)",
//               lineHeight: "clamp(26px, 3.5vw, 40px)",
//               textAlign: t.textAlign,
//             }}
//           >
//             {t.subWelcome}
//           </p>

//           <p
//             className="text-white font-semibold mt-2"
//             style={{
//               fontFamily: "Cairo, sans-serif",
//               fontWeight: 600,
//               fontSize: "clamp(15px, 1.8vw, 18px)",
//               lineHeight: "clamp(24px, 3vw, 40px)",
//               textAlign: t.textAlign,
//             }}
//           >
//             {t.stepsTitle}
//           </p>

//           <ul
//             className="text-black font-semibold list-none space-y-1"
//             style={{
//               fontFamily: "Cairo, sans-serif",
//               fontWeight: 600,
//               fontSize: "clamp(13px, 1.5vw, 15px)",
//               lineHeight: "clamp(22px, 2.5vw, 32px)",
//               textAlign: t.textAlign,
//               paddingRight: t.dir === "rtl" ? "0px" : undefined,
//               paddingLeft: t.dir === "ltr" ? "0px" : undefined,
//             }}
//           >
//             {t.steps.map((step, index) => (
//               <li key={index}>{step}</li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QRLoginModal;



// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import StyledQRCode from "./StyledQRCode";
// import wsService from "@/lib/websocketService";
// // 🌟 استيراد سياق الترجمة الخاص بالتطبيق
// import { useTranslation } from "@/contexts/TranslationContext";

// interface QRLoginModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onLoginSuccess: () => void;
// }

// // كائن النصوص المترجمة داخلياً
// const translations = {
//   ar: {
//     dir: "rtl" as const,
//     textAlign: "right" as const,
//     scanNow: "امسح الكود الآن",
//     welcome: "أهلاً بيك في بو شات Web",
//     subWelcome: "ادخل على حسابك بسهولة ومن غير ما تكتب كلمة سر",
//     stepsTitle: "علشان تسجّل دخولك من المتصفح، اتبع الخطوات دي:",
//     steps: [
//       "1. افتح تطبيق بو شات على موبايلك",
//       "2. روح لـ الإعدادات",
//       "3. اختار تسجيل الدخول من الويب / الأجهزة المتوصّلة",
//       "4. استخدم الكاميرا وامسح الكود اللي قدّامك",
//       "5. خلال ثواني… هتلاقي حسابك فتح هنا"
//     ],
//     error: "فشل في تحميل QR Code",
//     loading: "جاري التحميل..."
//   },
//   en: {
//     dir: "ltr" as const,
//     textAlign: "left" as const,
//     scanNow: "Scan Code Now",
//     welcome: "Welcome to Bo Chat Web",
//     subWelcome: "Access your account easily without typing a password",
//     stepsTitle: "To log in from your browser, follow these steps:",
//     steps: [
//       "1. Open Bo Chat app on your phone",
//       "2. Go to Settings",
//       "3. Select Web Login / Connected Devices",
//       "4. Use your camera to scan the code on the screen",
//       "5. In seconds... your account will be open here"
//     ],
//     error: "Failed to load QR Code",
//     loading: "Loading..."
//   }
// };

// const QRLoginModal: React.FC<QRLoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
//   const [sessionId, setSessionId] = useState<string>("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string>("");
//   const hasLoggedInRef = useRef(false);
//   const unsubscribeRef = useRef<(() => void) | undefined>();

//   // 🌟 استهلاك اللغة من السياق مباشرة لضمان المزامنة التامة
//   const { language } = useTranslation();
//   const currentLang = language || "ar";

//   // اختيار القاموس المناسب بناءً على قيمة اللغة الحالية من السياق
//   const t = translations[currentLang] || translations.ar;

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
//         setLoading(true);
//         setError("");
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

//           window.dispatchEvent(new Event("storage"));

//           wsService.disconnect();
//           if (unsubscribeRef.current) unsubscribeRef.current();

//           onLoginSuccess();
//           onClose();
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
//         if (isMounted) setError(err.message || t.error);
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
//   }, [isOpen, onLoginSuccess, onClose, t.error]);

//   if (!isOpen) return null;

//   return (
//     <div
//       className="fixed inset-0 bg-black/30 flex items-center justify-center z-[10000] p-4 sm:p-6 overflow-y-auto"
//       onClick={onClose}
//     >
//       <div
//         className="w-full max-w-5xl min-h-[auto] xl:h-[503px] rounded-[35px] bg-[#FFFFFF4D] backdrop-blur-[50px] shadow-2xl relative flex flex-col xl:flex-row items-center justify-center gap-6 xl:gap-10 p-6 sm:p-8 my-auto"
//         dir={t.dir} // ينقلب تلقائياً بناءً على حال السياق الحالي للموقع
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* قسم QR Code */}
//         <div className="flex flex-col items-center justify-center w-full xl:w-auto shrink-0">
//           {loading && (
//             <div className="text-white font-semibold text-[20px]">{t.loading}</div>
//           )}
          
//           {error && (
//             <div className="text-red-200 font-semibold text-[18px] text-center">{error}</div>
//           )}

//           {!loading && !error && sessionId && (
//             <div
//               className="flex flex-col items-center justify-center rounded-[26px] w-full max-w-[280px] sm:max-w-[320px] h-auto py-5 px-3 sm:px-4"
//               style={{
//                 background: "#FFFFFFCC",
//                 backdropFilter: "blur(4px)",
//               }}
//             >
//               <p
//                 className="text-[#D72229] font-bold text-2xl sm:text-[34px] leading-snug sm:leading-[45px] text-center w-full"
//                 style={{
//                   fontFamily: "Cairo, sans-serif",
//                   fontWeight: 700,
//                 }}
//               >
//                 {t.scanNow}
//               </p>
//               <div className="mt-4 flex items-center justify-center w-full overflow-hidden">
//                 <div className="w-[220px] sm:w-[260px] h-[220px] sm:h-[260px] flex items-center justify-center">
//                   <StyledQRCode
//                     value={JSON.stringify({ event: "LOGIN", sessionId })}
//                     size={240}
//                     image="/imgs/876771 copy 1.svg"
//                     imageSize={0.3}
//                   />
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* قسم النصوص المستجيب للغة */}
//         <div className="flex flex-col justify-center gap-2 max-w-full xl:max-w-[569px] w-full text-center xl:text-start">
//           <h1
//             className="text-white font-semibold"
//             style={{
//               fontFamily: "Cairo, sans-serif",
//               fontWeight: 600,
//               fontSize: "clamp(24px, 3.5vw, 40px)",
//               lineHeight: "clamp(32px, 4.5vw, 60px)",
//               textAlign: t.textAlign,
//             }}
//           >
//             {t.welcome}
//           </h1>

//           <p
//             className="text-black font-semibold"
//             style={{
//               fontFamily: "Cairo, sans-serif",
//               fontWeight: 600,
//               fontSize: "clamp(15px, 1.8vw, 22px)",
//               lineHeight: "clamp(24px, 3vw, 40px)",
//               textAlign: t.textAlign,
//             }}
//           >
//             {t.subWelcome}
//           </p>

//           <p
//             className="text-white font-semibold mt-1"
//             style={{
//               fontFamily: "Cairo, sans-serif",
//               fontWeight: 600,
//               fontSize: "clamp(14px, 1.5vw, 18px)",
//               lineHeight: "clamp(22px, 2.5vw, 40px)",
//               textAlign: t.textAlign,
//             }}
//           >
//             {t.stepsTitle}
//           </p>

//           <ul
//             className="text-black font-semibold list-none space-y-1"
//             style={{
//               fontFamily: "Cairo, sans-serif",
//               fontWeight: 600,
//               fontSize: "clamp(13px, 1.3vw, 15px)",
//               lineHeight: "clamp(20px, 2.2vw, 32px)",
//               textAlign: t.textAlign,
//               paddingRight: t.dir === "rtl" ? "0px" : undefined,
//               paddingLeft: t.dir === "ltr" ? "0px" : undefined,
//             }}
//           >
//             {t.steps.map((step, index) => (
//               <li key={index}>{step}</li>
//             ))}
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

  const { language } = useTranslation();
  const currentLang = language || "ar";
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

  const isRtl = t.dir === "rtl";

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-[10000] p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl min-h-[auto] xl:h-[503px] rounded-[35px] bg-[#FFFFFF4D] backdrop-blur-[50px] shadow-2xl relative flex flex-col xl:flex-row items-center justify-center xl:justify-between gap-6 xl:gap-10 p-6 sm:p-8 my-auto"
        dir={t.dir}
        onClick={(e) => e.stopPropagation()}
      >
        {/* قسم QR Code */}
        <div className="flex flex-col items-center justify-center w-full xl:w-auto shrink-0">
          {loading && (
            <div className="text-white font-semibold text-[20px] text-center">{t.loading}</div>
          )}
          
          {error && (
            <div className="text-red-200 font-semibold text-[18px] text-center">{error}</div>
          )}

          {!loading && !error && sessionId && (
            <div
              className="flex flex-col items-center justify-center rounded-[26px] w-full max-w-[280px] sm:max-w-[320px] h-auto py-5 px-3 sm:px-4"
              style={{
                background: "#FFFFFFCC",
                backdropFilter: "blur(4px)",
              }}
            >
              <p
                className="text-[#D72229] font-bold text-2xl sm:text-[34px] leading-snug sm:leading-[45px] text-center w-full"
                style={{
                  fontFamily: "Cairo, sans-serif",
                  fontWeight: 700,
                }}
              >
                {t.scanNow}
              </p>
              <div className="mt-4 flex items-center justify-center w-full overflow-hidden">
                <div className="w-[220px] sm:w-[260px] h-[220px] sm:h-[260px] flex items-center justify-center">
                  <StyledQRCode
                    value={JSON.stringify({ event: "LOGIN", sessionId })}
                    size={240}
                    image="/imgs/876771 copy 1.svg"
                    imageSize={0.3}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* قسم النصوص */}
        <div 
          className={`
            flex flex-col justify-center gap-2 max-w-full xl:max-w-[569px] w-full
            // في الشاشات الكبيرة (xl): النصوص تكون محاذية لليسار أو اليمين
            // في الشاشات الصغيرة: النصوص تكون في المنتصف
            ${isRtl 
              ? 'xl:items-end xl:text-right' 
              : 'xl:items-start xl:text-left'
            }
            items-center text-center
          `}
        >
          <h1
            className="text-white font-semibold w-full"
            style={{
              fontFamily: "Cairo, sans-serif",
              fontWeight: 600,
              fontSize: "clamp(24px, 3.5vw, 40px)",
              lineHeight: "clamp(32px, 4.5vw, 60px)",
            }}
          >
            {t.welcome}
          </h1>

          <p
            className="text-black font-semibold w-full"
            style={{
              fontFamily: "Cairo, sans-serif",
              fontWeight: 600,
              fontSize: "clamp(15px, 1.8vw, 22px)",
              lineHeight: "clamp(24px, 3vw, 40px)",
            }}
          >
            {t.subWelcome}
          </p>

          <p
            className="text-white font-semibold mt-1 w-full"
            style={{
              fontFamily: "Cairo, sans-serif",
              fontWeight: 600,
              fontSize: "clamp(14px, 1.5vw, 18px)",
              lineHeight: "clamp(22px, 2.5vw, 40px)",
            }}
          >
            {t.stepsTitle}
          </p>

          <ul
            className={`
              text-black font-semibold list-none space-y-1 w-full
              // في الشاشات الكبيرة: القائمة محاذية لليسار أو اليمين
              // في الشاشات الصغيرة: القائمة في المنتصف
              ${isRtl 
                ? 'xl:items-end' 
                : 'xl:items-start'
              }
              items-center
              flex flex-col
            `}
            style={{
              fontFamily: "Cairo, sans-serif",
              fontWeight: 600,
              fontSize: "clamp(13px, 1.3vw, 15px)",
              lineHeight: "clamp(20px, 2.2vw, 32px)",
              padding: 0,
            }}
          >
            {t.steps.map((step, index) => (
              <li 
                key={index} 
                className={`
                  w-full
                  ${isRtl 
                    ? 'xl:text-right' 
                    : 'xl:text-left'
                  }
                  text-center
                `}
              >
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QRLoginModal;