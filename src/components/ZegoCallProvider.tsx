// // // // // // // // // // src/components/ZegoCallProvider.tsx
// // // // // // // // // "use client";

// // // // // // // // // import { useEffect, useRef } from "react";

// // // // // // // // // // ⚠️ مهم جداً: المكتبتين دول لازم يكونوا موجودين
// // // // // // // // // // npm i @zegocloud/zego-uikit-prebuilt zego-zim-web@2.16.0

// // // // // // // // // declare global {
// // // // // // // // //   interface Window {
// // // // // // // // //     ZIM?: any;
// // // // // // // // //     ZegoUIKitPrebuilt?: any;
// // // // // // // // //   }
// // // // // // // // // }

// // // // // // // // // export default function ZegoCallProvider({
// // // // // // // // //   children,
// // // // // // // // //   userID,
// // // // // // // // //   userName,
// // // // // // // // // }: {
// // // // // // // // //   children: React.ReactNode;
// // // // // // // // //   userID: string;
// // // // // // // // //   userName: string;
// // // // // // // // // }) {
// // // // // // // // //   const zpRef = useRef<any>(null);
// // // // // // // // //   const zimRef = useRef<any>(null);

// // // // // // // // //   useEffect(() => {
// // // // // // // // //     if (!userID || !userName) return;
// // // // // // // // //     if (zimRef.current) return; // متكررش التهيئة

// // // // // // // // //     const init = async () => {
// // // // // // // // //       try {
// // // // // // // // //         const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
// // // // // // // // //         if (!appID) {
// // // // // // // // //           console.error("❌ NEXT_PUBLIC_ZEGO_APP_ID مش موجود في .env.local");
// // // // // // // // //           return;
// // // // // // // // //         }

// // // // // // // // //         // 1. نجيب التوكن من الـ API الداخلي بتاعنا
// // // // // // // // //         const res = await fetch("/api/zego/token", {
// // // // // // // // //           method: "POST",
// // // // // // // // //           headers: { "Content-Type": "application/json" },
// // // // // // // // //           body: JSON.stringify({ userId: userID, userID, userName }),
// // // // // // // // //         });
// // // // // // // // //         const data = await res.json();
// // // // // // // // //         if (!data?.success || !data?.token) {
// // // // // // // // //           console.error("❌ فشل جلب التوكن:", data);
// // // // // // // // //           return;
// // // // // // // // //         }

// // // // // // // // //         // 2. نتحقق إن الـ SDK اتحمّل
// // // // // // // // //         if (!window.ZegoUIKitPrebuilt || !window.ZIM) {
// // // // // // // // //           console.error("❌ Zego SDK مش محمّل — تأكدي من إضافة الـ script tags في layout.tsx");
// // // // // // // // //           return;
// // // // // // // // //         }

// // // // // // // // //         const { ZegoUIKitPrebuilt, ZIM } = window;

// // // // // // // // //         // 3. نعمل login على ZIM (عشان نستقبل/نبعت دعوات)
// // // // // // // // //         const zim = ZIM.getInstance();
// // // // // // // // //         await zim.login({
// // // // // // // // //           userID,
// // // // // // // // //           userName,
// // // // // // // // //           token: data.token,
// // // // // // // // //         });
// // // // // // // // //         zimRef.current = zim;
// // // // // // // // //         console.log("✅ ZIM login ناجح — جاهزين للمكالمات");

// // // // // // // // //         // 4. ننشئ ZegoUIKitPrebuilt
// // // // // // // // //         const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
// // // // // // // // //           appID,
// // // // // // // // //           data.token,
// // // // // // // // //           null, // roomID مش محتاجينها هنا
// // // // // // // // //           userID,
// // // // // // // // //           userName
// // // // // // // // //         );

// // // // // // // // //         const zp = ZegoUIKitPrebuilt.create(kitToken);
// // // // // // // // //         zpRef.current = zp;

// // // // // // // // //         // 5. نضيف إضافة ZIM (عشان الدعوات تشتغل)
// // // // // // // // //         zp.addPlugins({ ZIM });
// // // // // // // // //         console.log("✅ Zego Call Kit جاهز");
// // // // // // // // //       } catch (err) {
// // // // // // // // //         console.error("❌ فشل تهيئة Zego:", err);
// // // // // // // // //       }
// // // // // // // // //     };

// // // // // // // // //     init();

// // // // // // // // //     return () => {
// // // // // // // // //       try {
// // // // // // // // //         zimRef.current?.logout?.();
// // // // // // // // //       } catch (e) {
// // // // // // // // //         console.error(e);
// // // // // // // // //       }
// // // // // // // // //       zimRef.current = null;
// // // // // // // // //     };
// // // // // // // // //   }, [userID, userName]);

// // // // // // // // //   return <>{children}</>;
// // // // // // // // // }


// // // // // // // // // src/components/ZegoCallProvider.tsx
// // // // // // // // "use client";

// // // // // // // // import { useEffect, useRef } from "react";

// // // // // // // // declare global {
// // // // // // // //   interface Window {
// // // // // // // //     ZIM?: any;
// // // // // // // //     ZegoUIKitPrebuilt?: any;
// // // // // // // //     __zego_zim?: any;
// // // // // // // //     __zego_zp?: any;
// // // // // // // //   }
// // // // // // // // }

// // // // // // // // interface ZegoCallProviderProps {
// // // // // // // //   children: React.ReactNode;
// // // // // // // //   userID: string;
// // // // // // // //   userName: string;
// // // // // // // // }

// // // // // // // // export default function ZegoCallProvider({
// // // // // // // //   children,
// // // // // // // //   userID,
// // // // // // // //   userName,
// // // // // // // // }: ZegoCallProviderProps) {
// // // // // // // //   const zimRef = useRef<any>(null);
// // // // // // // //   const zpRef = useRef<any>(null);
// // // // // // // //   const initedRef = useRef(false);

// // // // // // // //   useEffect(() => {
// // // // // // // //     if (!userID || !userName) return;
// // // // // // // //     if (initedRef.current) return;

// // // // // // // //     let cancelled = false;

// // // // // // // //     const init = async () => {
// // // // // // // //       try {
// // // // // // // //         const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
// // // // // // // //         if (!appID) {
// // // // // // // //           console.error("❌ NEXT_PUBLIC_ZEGO_APP_ID مش موجود");
// // // // // // // //           return;
// // // // // // // //         }

// // // // // // // //         // ⚠️ نستنى الـ SDK يتحمّل لو لسه
// // // // // // // //         let waited = 0;
// // // // // // // //         while (
// // // // // // // //           (!window.ZIM || !window.ZegoUIKitPrebuilt) &&
// // // // // // // //           waited < 10000
// // // // // // // //         ) {
// // // // // // // //           await new Promise((r) => setTimeout(r, 100));
// // // // // // // //           waited += 100;
// // // // // // // //         }

// // // // // // // //         if (!window.ZIM || !window.ZegoUIKitPrebuilt) {
// // // // // // // //           console.error(
// // // // // // // //             "❌ Zego SDK مش محمّل — تأكدي من Script tags في layout.tsx"
// // // // // // // //           );
// // // // // // // //           return;
// // // // // // // //         }

// // // // // // // //         const { ZIM, ZegoUIKitPrebuilt } = window;

// // // // // // // //         // ⭐ نتأكد إن ZIM.create موجودة
// // // // // // // //         console.log("ZIM keys:", Object.keys(ZIM));
// // // // // // // //         console.log(
// // // // // // // //           "ZIM.getInstance type:",
// // // // // // // //           typeof ZIM.getInstance,
// // // // // // // //           "ZIM.create type:",
// // // // // // // //           typeof ZIM.create
// // // // // // // //         );

// // // // // // // //         // 1. نجيب التوكن
// // // // // // // //         const res = await fetch("/api/zego/token", {
// // // // // // // //           method: "POST",
// // // // // // // //           headers: { "Content-Type": "application/json" },
// // // // // // // //           body: JSON.stringify({ userId: userID, userID, userName }),
// // // // // // // //         });
// // // // // // // //         const data = await res.json();

// // // // // // // //         if (!data?.success || !data?.token) {
// // // // // // // //           console.error("❌ فشل جلب التوكن:", data);
// // // // // // // //           return;
// // // // // // // //         }

// // // // // // // //         if (cancelled) return;

// // // // // // // //         // 2. نحاول نعمل login
// // // // // // // //         // ⭐ ZIM.getInstance() ترجّع instance موجود، لكن لو مش موجودة بنستخدم create
// // // // // // // //         let zim: any = null;

// // // // // // // //         if (typeof ZIM.getInstance === "function") {
// // // // // // // //           zim = ZIM.getInstance();
// // // // // // // //         }

// // // // // // // //         // لو getInstance رجّعت null، نجرب create
// // // // // // // //         if (!zim && typeof ZIM.create === "function") {
// // // // // // // //           console.log("⚠️ getInstance رجّعت null — بنجرب ZIM.create");
// // // // // // // //           zim = ZIM.create(appID);
// // // // // // // //         }

// // // // // // // //         if (!zim) {
// // // // // // // //           console.error("❌ فشل إنشاء ZIM instance");
// // // // // // // //           return;
// // // // // // // //         }

// // // // // // // //         await zim.login({
// // // // // // // //           userID,
// // // // // // // //           userName,
// // // // // // // //           token: data.token,
// // // // // // // //         });

// // // // // // // //         zimRef.current = zim;
// // // // // // // //         window.__zego_zim = zim;
// // // // // // // //         console.log("✅ ZIM login ناجح");

// // // // // // // //         // 3. ZegoUIKitPrebuilt
// // // // // // // //         const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
// // // // // // // //           appID,
// // // // // // // //           data.token,
// // // // // // // //           null,
// // // // // // // //           userID,
// // // // // // // //           userName
// // // // // // // //         );

// // // // // // // //         const zp = ZegoUIKitPrebuilt.create(kitToken);
// // // // // // // //         zpRef.current = zp;
// // // // // // // //         window.__zego_zp = zp;

// // // // // // // //         zp.addPlugins({ ZIM });
// // // // // // // //         console.log("✅ Zego Call Kit جاهز");

// // // // // // // //         initedRef.current = true;
// // // // // // // //       } catch (err) {
// // // // // // // //         console.error("❌ Zego init error:", err);
// // // // // // // //       }
// // // // // // // //     };

// // // // // // // //     init();

// // // // // // // //     return () => {
// // // // // // // //       cancelled = true;
// // // // // // // //       try {
// // // // // // // //         zimRef.current?.logout?.();
// // // // // // // //       } catch (e) {
// // // // // // // //         console.error("cleanup error:", e);
// // // // // // // //       }
// // // // // // // //       zimRef.current = null;
// // // // // // // //       zpRef.current = null;
// // // // // // // //       initedRef.current = false;
// // // // // // // //       if (typeof window !== "undefined") {
// // // // // // // //         window.__zego_zim = null;
// // // // // // // //         window.__zego_zp = null;
// // // // // // // //       }
// // // // // // // //     };
// // // // // // // //   }, [userID, userName]);

// // // // // // // //   return <>{children}</>;
// // // // // // // // }

// // // // // // // // src/components/ZegoCallProvider.tsx
// // // // // // // "use client";

// // // // // // // import { useEffect, useRef } from "react";

// // // // // // // declare global {
// // // // // // //   interface Window {
// // // // // // //     ZIM?: any;
// // // // // // //     ZegoUIKitPrebuilt?: any;
// // // // // // //     __zego_zim?: any;
// // // // // // //     __zego_zp?: any;
// // // // // // //   }
// // // // // // // }

// // // // // // // interface ZegoCallProviderProps {
// // // // // // //   children: React.ReactNode;
// // // // // // //   userID: string;
// // // // // // //   userName: string;
// // // // // // // }

// // // // // // // export default function ZegoCallProvider({
// // // // // // //   children,
// // // // // // //   userID,
// // // // // // //   userName,
// // // // // // // }: ZegoCallProviderProps) {
// // // // // // //   const zimRef = useRef<any>(null);
// // // // // // //   const zpRef = useRef<any>(null);
// // // // // // //   const initedRef = useRef(false);

// // // // // // //   useEffect(() => {
// // // // // // //     if (!userID || !userName) return;
// // // // // // //     if (initedRef.current) return;

// // // // // // //     let cancelled = false;

// // // // // // //     const init = async () => {
// // // // // // //       try {
// // // // // // //         const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
// // // // // // //         if (!appID) {
// // // // // // //           console.error("❌ NEXT_PUBLIC_ZEGO_APP_ID مش موجود");
// // // // // // //           return;
// // // // // // //         }

// // // // // // //         // نستنى الـ SDK يتحمّل
// // // // // // //         let waited = 0;
// // // // // // //         while (
// // // // // // //           (!window.ZIM || !window.ZegoUIKitPrebuilt) &&
// // // // // // //           waited < 10000
// // // // // // //         ) {
// // // // // // //           await new Promise((r) => setTimeout(r, 100));
// // // // // // //           waited += 100;
// // // // // // //         }

// // // // // // //         if (!window.ZIM || !window.ZegoUIKitPrebuilt) {
// // // // // // //           console.error("❌ Zego SDK مش محمّل");
// // // // // // //           return;
// // // // // // //         }

// // // // // // //         const { ZIM, ZegoUIKitPrebuilt } = window;

// // // // // // //         // 1. نجيب التوكن من الـ API
// // // // // // //         const res = await fetch("/api/zego/token", {
// // // // // // //           method: "POST",
// // // // // // //           headers: { "Content-Type": "application/json" },
// // // // // // //           body: JSON.stringify({ userId: userID, userID, userName }),
// // // // // // //         });
// // // // // // //         const data = await res.json();

// // // // // // //         if (!data?.success || !data?.token) {
// // // // // // //           console.error("❌ فشل جلب التوكن:", data);
// // // // // // //           return;
// // // // // // //         }

// // // // // // //         if (cancelled) return;

// // // // // // //         // 2. نعمل ZIM instance
// // // // // // //         let zim: any = null;
// // // // // // //         if (typeof ZIM.create === "function") {
// // // // // // //           zim = ZIM.create(appID);
// // // // // // //         } else if (typeof ZIM.getInstance === "function") {
// // // // // // //           zim = ZIM.getInstance();
// // // // // // //         }

// // // // // // //         if (!zim) {
// // // // // // //           console.error("❌ فشل إنشاء ZIM instance");
// // // // // // //           return;
// // // // // // //         }

// // // // // // //         // 3. ZIM login
// // // // // // //         await zim.login({
// // // // // // //           userID,
// // // // // // //           userName,
// // // // // // //           token: data.token,
// // // // // // //         });

// // // // // // //         zimRef.current = zim;
// // // // // // //         window.__zego_zim = zim;
// // // // // // //         console.log("✅ ZIM login ناجح");

// // // // // // //         // 4. ZegoUIKitPrebuilt
// // // // // // //         const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
// // // // // // //           appID,
// // // // // // //           data.token,
// // // // // // //           null,
// // // // // // //           userID,
// // // // // // //           userName
// // // // // // //         );

// // // // // // //         const zp = ZegoUIKitPrebuilt.create(kitToken);
// // // // // // //         zpRef.current = zp;
// // // // // // //         window.__zego_zp = zp;

// // // // // // //         zp.addPlugins({ ZIM });
// // // // // // //         console.log("✅ Zego Call Kit جاهز");

// // // // // // //         initedRef.current = true;
// // // // // // //       } catch (err: any) {
// // // // // // //         console.error("❌ Zego init error:", err);
// // // // // // //       }
// // // // // // //     };

// // // // // // //     init();

// // // // // // //     return () => {
// // // // // // //       cancelled = true;
// // // // // // //       try {
// // // // // // //         zimRef.current?.logout?.();
// // // // // // //       } catch (e) {
// // // // // // //         console.error("cleanup error:", e);
// // // // // // //       }
// // // // // // //       zimRef.current = null;
// // // // // // //       zpRef.current = null;
// // // // // // //       initedRef.current = false;
// // // // // // //       if (typeof window !== "undefined") {
// // // // // // //         window.__zego_zim = null;
// // // // // // //         window.__zego_zp = null;
// // // // // // //       }
// // // // // // //     };
// // // // // // //   }, [userID, userName]);

// // // // // // //   return <>{children}</>;
// // // // // // // }


// // // // // // // src/components/ZegoCallProvider.tsx
// // // // // // "use client";

// // // // // // import { useEffect, useRef } from "react";

// // // // // // declare global {
// // // // // //   interface Window {
// // // // // //     ZIM?: any;
// // // // // //     ZegoUIKitPrebuilt?: any;
// // // // // //     __zego_zim?: any;
// // // // // //     __zego_zp?: any;
// // // // // //   }
// // // // // // }

// // // // // // interface ZegoCallProviderProps {
// // // // // //   children: React.ReactNode;
// // // // // //   userID: string;
// // // // // //   userName: string;
// // // // // // }

// // // // // // export default function ZegoCallProvider({
// // // // // //   children,
// // // // // //   userID,
// // // // // //   userName,
// // // // // // }: ZegoCallProviderProps) {
// // // // // //   const zimRef = useRef<any>(null);
// // // // // //   const zpRef = useRef<any>(null);
// // // // // //   const initedRef = useRef(false);

// // // // // //   useEffect(() => {
// // // // // //     if (!userID || !userName) return;
// // // // // //     if (initedRef.current) return;

// // // // // //     let cancelled = false;

// // // // // //     const init = async () => {
// // // // // //       try {
// // // // // //         const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
// // // // // //         if (!appID) {
// // // // // //           console.error("❌ NEXT_PUBLIC_ZEGO_APP_ID مش موجود");
// // // // // //           return;
// // // // // //         }

// // // // // //         console.log("🔑 AppID:", appID);

// // // // // //         // نستنى الـ SDK يتحمّل
// // // // // //         let waited = 0;
// // // // // //         while (
// // // // // //           (!window.ZIM || !window.ZegoUIKitPrebuilt) &&
// // // // // //           waited < 10000
// // // // // //         ) {
// // // // // //           await new Promise((r) => setTimeout(r, 100));
// // // // // //           waited += 100;
// // // // // //         }

// // // // // //         if (!window.ZIM || !window.ZegoUIKitPrebuilt) {
// // // // // //           console.error("❌ Zego SDK مش محمّل");
// // // // // //           return;
// // // // // //         }

// // // // // //         const { ZIM, ZegoUIKitPrebuilt } = window;

// // // // // //         // ⭐ نستخدم fetch من السيرفر
// // // // // //         const res = await fetch("/api/zego/token", {
// // // // // //           method: "POST",
// // // // // //           headers: { "Content-Type": "application/json" },
// // // // // //           body: JSON.stringify({ userId: userID, userID, userName }),
// // // // // //         });
// // // // // //         const data = await res.json();

// // // // // //         if (!data?.success || !data?.token) {
// // // // // //           console.error("❌ فشل جلب التوكن:", data);
// // // // // //           return;
// // // // // //         }

// // // // // //         console.log("🔑 Token prefix:", data.token.slice(0, 15));
// // // // // //         console.log("🔑 userID:", userID);

// // // // // //         if (cancelled) return;

// // // // // //         // ⭐⭐⭐ الحل: نستخدم getInstance بدل create
// // // // // //         let zim: any = null;
// // // // // //         try {
// // // // // //           zim = ZIM.getInstance();
// // // // // //         } catch (e) {
// // // // // //           console.log("getInstance فشلت، بنجرب create");
// // // // // //         }

// // // // // //         // لو مفيش instance موجود، ننشئ واحد جديد
// // // // // //         if (!zim) {
// // // // // //           try {
// // // // // //             zim = ZIM.create(appID);
// // // // // //           } catch (e: any) {
// // // // // //             console.error("ZIM.create فشلت:", e);
// // // // // //             // ممكن يكون instance موجود بالفعل — نجرب getInstance تاني
// // // // // //             try {
// // // // // //               zim = ZIM.getInstance();
// // // // // //             } catch {}
// // // // // //           }
// // // // // //         }

// // // // // //         if (!zim) {
// // // // // //           console.error("❌ فشل إنشاء ZIM instance");
// // // // // //           return;
// // // // // //         }

// // // // // //         // 2. ZIM login
// // // // // //         await zim.login({
// // // // // //           userID,
// // // // // //           userName,
// // // // // //           token: data.token,
// // // // // //         });

// // // // // //         zimRef.current = zim;
// // // // // //         window.__zego_zim = zim;
// // // // // //         console.log("✅ ZIM login ناجح");

// // // // // //         // 3. ZegoUIKitPrebuilt
// // // // // //         const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
// // // // // //           appID,
// // // // // //           data.token,
// // // // // //           null,
// // // // // //           userID,
// // // // // //           userName
// // // // // //         );

// // // // // //         const zp = ZegoUIKitPrebuilt.create(kitToken);
// // // // // //         zpRef.current = zp;
// // // // // //         window.__zego_zp = zp;

// // // // // //         zp.addPlugins({ ZIM });
// // // // // //         console.log("✅ Zego Call Kit جاهز");

// // // // // //         initedRef.current = true;
// // // // // //       } catch (err: any) {
// // // // // //         console.error("❌ Zego init error:", err);
// // // // // //       }
// // // // // //     };

// // // // // //     init();

// // // // // //     return () => {
// // // // // //       cancelled = true;
// // // // // //       // ⚠️ مش بنعمل logout هنا — عشان لو الصفحة اتعملت refresh، الـ instance يفضل موجود
// // // // // //       zimRef.current = null;
// // // // // //       zpRef.current = null;
// // // // // //       initedRef.current = false;
// // // // // //       if (typeof window !== "undefined") {
// // // // // //         window.__zego_zim = null;
// // // // // //         window.__zego_zp = null;
// // // // // //       }
// // // // // //     };
// // // // // //   }, [userID, userName]);

// // // // // //   return <>{children}</>;
// // // // // // }


// // // // // // ////////////////
// // // // // "use client";

// // // // // import React, { useEffect, useRef } from "react";

// // // // // interface ZegoCallProviderProps {
// // // // //   children: React.ReactNode;
// // // // //   userID?: string;
// // // // //   userName?: string;
// // // // // }

// // // // // export default function ZegoCallProvider({ children, userID, userName }: ZegoCallProviderProps) {
// // // // //   const isInitialized = useRef(false);

// // // // //   useEffect(() => {
// // // // //     // التأكد من وجود البيانات وعدم التهيئة المسبقة
// // // // //     if (typeof window === "undefined" || !userID || isInitialized.current) return;

// // // // //     const initZego = async () => {
// // // // //       try {
// // // // //         // dynamic import لتفادي أخطاء SSR
// // // // //         const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");
// // // // //         const { ZIM } = await import("zego-zim-web");

// // // // //         // طلب التوكن من الـ API
// // // // //         const res = await fetch("/api/zego/token", {
// // // // //           method: "POST",
// // // // //           headers: { "Content-Type": "application/json" },
// // // // //           body: JSON.stringify({ userId: userID }),
// // // // //         });

// // // // //         const data = await res.json();
// // // // //         if (!data.success || !data.token) {
// // // // //           console.error("❌ فشل الحصول على Zego Token:", data.error);
// // // // //           return;
// // // // //         }

// // // // //         // إنشاء Kit Token مع تفعيل Call Invitations (roomID = null)
// // // // //         const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
// // // // //           data.appId,
// // // // //           data.token,
// // // // //           null,
// // // // //           userID,
// // // // //           userName || `User_${userID}`
// // // // //         );

// // // // //         const zp = ZegoUIKitPrebuilt.create(kitToken);
// // // // //         zp.addPlugins({ ZIM });

// // // // //         zp.setCallInvitationConfig({
// // // // //           enableNotifyWhenAppRunningInBackgroundOrQuit: true,
// // // // //         });

// // // // //         isInitialized.current = true;
// // // // //         console.log("✅ تم تشغيل نظام مكالمات Zego بنجاح للمستخدم:", userID);
// // // // //       } catch (err) {
// // // // //         console.error("❌ خطأ أثناء تهيئة Zego SDK:", err);
// // // // //       }
// // // // //     };

// // // // //     initZego();
// // // // //   }, [userID, userName]);

// // // // //   return <>{children}</>;
// // // // // }


// // // // // ظظظظظظظظظظظظظظظظظ
// // // // "use client";

// // // // import React, { createContext, useContext, useEffect, useRef, useState } from "react";

// // // // interface ZegoContextType {
// // // //   startCall: (targetUserId: string, targetUserName: string, isVideo: boolean) => void;
// // // //   isReady: boolean;
// // // // }

// // // // const ZegoContext = createContext<ZegoContextType>({
// // // //   startCall: () => {},
// // // //   isReady: false,
// // // // });

// // // // export const useZegoCall = () => useContext(ZegoContext);

// // // // interface ZegoCallProviderProps {
// // // //   children: React.ReactNode;
// // // //   userID?: string;
// // // //   userName?: string;
// // // // }

// // // // export default function ZegoCallProvider({ children, userID, userName }: ZegoCallProviderProps) {
// // // //   const zpRef = useRef<any>(null);
// // // //   const [isReady, setIsReady] = useState(false);

// // // //   useEffect(() => {
// // // //     if (typeof window === "undefined" || !userID || zpRef.current) return;

// // // //     const initZego = async () => {
// // // //       try {
// // // //         const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");
// // // //         const { ZIM } = await import("zego-zim-web");

// // // //         const res = await fetch("/api/zego/token", {
// // // //           method: "POST",
// // // //           headers: { "Content-Type": "application/json" },
// // // //           body: JSON.stringify({ userId: userID }),
// // // //         });

// // // //         const data = await res.json();
// // // //         if (!data.success || !data.token) {
// // // //           console.error("❌ فشل الحصول على Zego Token:", data.error);
// // // //           return;
// // // //         }

// // // //         const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
// // // //           data.appId,
// // // //           data.token,
// // // //           null,
// // // //           userID,
// // // //           userName || `User_${userID}`
// // // //         );

// // // //         const zp = ZegoUIKitPrebuilt.create(kitToken);
// // // //         zp.addPlugins({ ZIM });

// // // //         zp.setCallInvitationConfig({
// // // //           enableNotifyWhenAppRunningInBackgroundOrQuit: true,
// // // //         });

// // // //         zpRef.current = zp;
// // // //         setIsReady(true);
// // // //         console.log("✅ تم تشغيل نظام مكالمات Zego بنجاح للمستخدم:", userID);
// // // //       } catch (err) {
// // // //         console.error("❌ خطأ أثناء تهيئة Zego SDK:", err);
// // // //       }
// // // //     };

// // // //     initZego();
// // // //   }, [userID, userName]);

// // // //   // دالة إجراء المكالمة التي سيتم استدعاؤها من أي زر في الواجهة
// // // //   const startCall = async (targetUserId: string, targetUserName: string, isVideo: boolean) => {
// // // //     if (!zpRef.current) {
// // // //       console.error("❌ Zego لم يتم تهيئته بعد!");
// // // //       return;
// // // //     }

// // // //     try {
// // // //       const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");
      
// // // //       console.log(`📞 جاري الاتصال بالمستخدم: ${targetUserId} (${targetUserName})`);

// // // //       zpRef.current.sendCallInvitation({
// // // //         callees: [{ userID: targetUserId, userName: targetUserName || `User_${targetUserId}` }],
// // // //         callType: isVideo 
// // // //           ? ZegoUIKitPrebuilt.InvitationTypeVideoCall 
// // // //           : ZegoUIKitPrebuilt.InvitationTypeVoiceCall,
// // // //         timeout: 60,
// // // //       });
// // // //     } catch (error) {
// // // //       console.error("❌ خطأ أثناء إرسال دعوة المكالمة:", error);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <ZegoContext.Provider value={{ startCall, isReady }}>
// // // //       {children}
// // // //     </ZegoContext.Provider>
// // // //   );
// // // // }


// // // // //Groups
// // // // "use client";

// // // // import React, { createContext, useContext, useEffect, useRef, useState } from "react";

// // // // interface ZegoContextType {
// // // //   startCall: (targetUserId: string, targetUserName: string, isVideo: boolean) => void;
// // // //   startGroupCall: (roomId: string, groupName: string, isVideo: boolean) => void; // 👈 جديد
// // // //   isReady: boolean;
// // // // }

// // // // const ZegoContext = createContext<ZegoContextType>({
// // // //   startCall: () => {},
// // // //   startGroupCall: () => {},   // 👈 جديد
// // // //   isReady: false,
// // // // });

// // // // export const useZegoCall = () => useContext(ZegoContext);

// // // // interface ZegoCallProviderProps {
// // // //   children: React.ReactNode;
// // // //   userID?: string;
// // // //   userName?: string;
// // // // }

// // // // export default function ZegoCallProvider({ children, userID, userName }: ZegoCallProviderProps) {
// // // //   const zpRef = useRef<any>(null);
// // // //   const [isReady, setIsReady] = useState(false);

// // // //   useEffect(() => {
// // // //     if (typeof window === "undefined" || !userID || zpRef.current) return;

// // // //     const initZego = async () => {
// // // //       try {
// // // //         const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");
// // // //         const { ZIM } = await import("zego-zim-web");

// // // //         const res = await fetch("/api/zego/token", {
// // // //           method: "POST",
// // // //           headers: { "Content-Type": "application/json" },
// // // //           body: JSON.stringify({ userId: userID }),
// // // //         });

// // // //         const data = await res.json();
// // // //         if (!data.success || !data.token) {
// // // //           console.error("❌ فشل الحصول على Zego Token:", data.error);
// // // //           return;
// // // //         }

// // // //         const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
// // // //           data.appId,
// // // //           data.token,
// // // //           null,
// // // //           userID,
// // // //           userName || `User_${userID}`
// // // //         );

// // // //         const zp = ZegoUIKitPrebuilt.create(kitToken);
// // // //         zp.addPlugins({ ZIM });

// // // //         zp.setCallInvitationConfig({
// // // //           enableNotifyWhenAppRunningInBackgroundOrQuit: true,
// // // //         });

// // // //         zpRef.current = zp;
// // // //         setIsReady(true);
// // // //         console.log("✅ تم تشغيل نظام مكالمات Zego بنجاح للمستخدم:", userID);
// // // //       } catch (err) {
// // // //         console.error("❌ خطأ أثناء تهيئة Zego SDK:", err);
// // // //       }
// // // //     };

// // // //     initZego();
// // // //   }, [userID, userName]);

// // // //   // ===== 1-to-1 Call =====
// // // //   const startCall = async (targetUserId: string, targetUserName: string, isVideo: boolean) => {
// // // //     if (!zpRef.current) {
// // // //       console.error("❌ Zego لم يتم تهيئته بعد!");
// // // //       return;
// // // //     }

// // // //     try {
// // // //       const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");

// // // //       console.log(`📞 جاري الاتصال بالمستخدم: ${targetUserId} (${targetUserName})`);

// // // //       zpRef.current.sendCallInvitation({
// // // //         callees: [{ userID: targetUserId, userName: targetUserName || `User_${targetUserId}` }],
// // // //         callType: isVideo
// // // //           ? ZegoUIKitPrebuilt.InvitationTypeVideoCall
// // // //           : ZegoUIKitPrebuilt.InvitationTypeVoiceCall,
// // // //         timeout: 60,
// // // //       });
// // // //     } catch (error) {
// // // //       console.error("❌ خطأ أثناء إرسال دعوة المكالمة:", error);
// // // //     }
// // // //   };

// // // //   // ===== Group Call =====
// // // //   const startGroupCall = async (roomId: string, groupName: string, isVideo: boolean) => {
// // // //     if (!zpRef.current) {
// // // //       console.error("❌ Zego لم يتم تهيئته بعد!");
// // // //       return;
// // // //     }

// // // //     try {
// // // //       const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");

// // // //       console.log(`📞 بدء مكالمة جماعية في الغرفة: ${roomId}`);

// // // //       zpRef.current.joinRoom({
// // // //         roomID: roomId,
// // // //         container: document.body,
// // // //         scenario: {
// // // //           mode: ZegoUIKitPrebuilt.GroupCall,
// // // //         },
// // // //         turnOnCameraWhenJoining: isVideo,
// // // //         turnOnMicrophoneWhenJoining: true,
// // // //         showMyCameraToggleButton: true,
// // // //         showMyMicrophoneToggleButton: true,
// // // //         showAudioVideoSettingsButton: true,
// // // //         showScreenSharingButton: true,
// // // //         showTextChat: true,
// // // //         showUserList: true,
// // // //         maxUsers: 50,
// // // //         layout: "Auto",
// // // //         showLayoutButton: true,
// // // //       });
// // // //     } catch (error) {
// // // //       console.error("❌ خطأ أثناء بدء المكالمة الجماعية:", error);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <ZegoContext.Provider value={{ startCall, startGroupCall, isReady }}>
// // // //       {children}
// // // //     </ZegoContext.Provider>
// // // //   );
// // // // } 




// // // "use client";

// // // import React, { createContext, useContext, useEffect, useRef, useState } from "react";

// // // interface ZegoContextType {
// // //   startCall: (targetUserId: string, targetUserName: string, isVideo: boolean) => void;
// // //   startGroupCall: (roomId: string, groupName: string, isVideo: boolean) => void;
// // //   isReady: boolean;
// // // }

// // // const ZegoContext = createContext<ZegoContextType>({
// // //   startCall: () => {},
// // //   startGroupCall: () => {},
// // //   isReady: false,
// // // });

// // // export const useZegoCall = () => useContext(ZegoContext);

// // // interface ZegoCallProviderProps {
// // //   children: React.ReactNode;
// // //   userID?: string;
// // //   userName?: string;
// // // }

// // // export default function ZegoCallProvider({ children, userID, userName }: ZegoCallProviderProps) {
// // //   const zpRef = useRef<any>(null);
// // //   const containerRef = useRef<HTMLDivElement | null>(null);
// // //   const [isReady, setIsReady] = useState(false);
// // //   const [isInCall, setIsInCall] = useState(false);

// // //   useEffect(() => {
// // //     if (typeof window === "undefined" || !userID || zpRef.current) return;

// // //     const initZego = async () => {
// // //       try {
// // //         const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");
// // //         const { ZIM } = await import("zego-zim-web");

// // //         const res = await fetch("/api/zego/token", {
// // //           method: "POST",
// // //           headers: { "Content-Type": "application/json" },
// // //           body: JSON.stringify({ userId: userID }),
// // //         });

// // //         const data = await res.json();
// // //         if (!data.success || !data.token) {
// // //           console.error("❌ فشل الحصول على Zego Token:", data.error);
// // //           return;
// // //         }

// // //         const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
// // //           data.appId,
// // //           data.token,
// // //           null,
// // //           userID,
// // //           userName || `User_${userID}`
// // //         );

// // //         const zp = ZegoUIKitPrebuilt.create(kitToken);
// // //         zp.addPlugins({ ZIM });

// // //         zp.setCallInvitationConfig({
// // //           enableNotifyWhenAppRunningInBackgroundOrQuit: true,
// // //         });

// // //         zpRef.current = zp;
// // //         setIsReady(true);
// // //         console.log("✅ تم تشغيل نظام مكالمات Zego بنجاح للمستخدم:", userID);
// // //       } catch (err) {
// // //         console.error("❌ خطأ أثناء تهيئة Zego SDK:", err);
// // //       }
// // //     };

// // //     initZego();
// // //   }, [userID, userName]);

// // //   // ===== 1-to-1 Call =====
// // //   const startCall = async (targetUserId: string, targetUserName: string, isVideo: boolean) => {
// // //     if (!zpRef.current) {
// // //       console.error("❌ Zego لم يتم تهيئته بعد!");
// // //       return;
// // //     }

// // //     try {
// // //       const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");

// // //       console.log(`📞 جاري الاتصال بالمستخدم: ${targetUserId} (${targetUserName})`);

// // //       zpRef.current.sendCallInvitation({
// // //         callees: [{ userID: targetUserId, userName: targetUserName || `User_${targetUserId}` }],
// // //         callType: isVideo
// // //           ? ZegoUIKitPrebuilt.InvitationTypeVideoCall
// // //           : ZegoUIKitPrebuilt.InvitationTypeVoiceCall,
// // //         timeout: 60,
// // //       });
// // //     } catch (error) {
// // //       console.error("❌ خطأ أثناء إرسال دعوة المكالمة:", error);
// // //     }
// // //   };

// // //   // ===== Group Call =====
// // //   const startGroupCall = async (roomId: string, groupName: string, isVideo: boolean) => {
// // //     if (!zpRef.current || !containerRef.current) {
// // //       console.error("❌ Zego أو حاوية العرض غير جاهزة!");
// // //       return;
// // //     }

// // //     try {
// // //       const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");

// // //       console.log(`📞 بدء مكالمة جماعية في الغرفة: ${roomId}`);
// // //       setIsInCall(true);

// // //       zpRef.current.joinRoom({
// // //         roomID: roomId,
// // //         container: containerRef.current,
// // //         scenario: {
// // //           mode: ZegoUIKitPrebuilt.GroupCall,
// // //         },
// // //         turnOnCameraWhenJoining: isVideo,
// // //         turnOnMicrophoneWhenJoining: true,
// // //         showMyCameraToggleButton: true,
// // //         showMyMicrophoneToggleButton: true,
// // //         showAudioVideoSettingsButton: true,
// // //         showScreenSharingButton: true,
// // //         showTextChat: true,
// // //         showUserList: true,
// // //         maxUsers: 50,
// // //         layout: "Auto",
// // //         showLayoutButton: true,
// // //         onLeaveRoom: () => {
// // //           setIsInCall(false);
// // //         },
// // //       });
// // //     } catch (error) {
// // //       console.error("❌ خطأ أثناء بدء المكالمة الجماعية:", error);
// // //       setIsInCall(false);
// // //     }
// // //   };

// // //   return (
// // //     <ZegoContext.Provider value={{ startCall, startGroupCall, isReady }}>
// // //       {children}

// // //       {/* حاوية كامل الشاشة مع z-index مرتفع جداً لعرض المكالمات فوق كافة عناصر الصفحة */}
// // //       <div
// // //         ref={containerRef}
// // //         style={{
// // //           position: "fixed",
// // //           top: 0,
// // //           left: 0,
// // //           width: "100vw",
// // //           height: "100vh",
// // //           zIndex: 2147483647,
// // //           display: isInCall ? "block" : "none",
// // //           backgroundColor: "#000",
// // //         }}
// // //       />
// // //     </ZegoContext.Provider>
// // //   );
// // // }



// // "use client";

// // import React, { createContext, useContext, useEffect, useRef, useState } from "react";
// // import { createPortal } from "react-dom";

// // interface ZegoContextType {
// //   startCall: (targetUserId: string, targetUserName: string, isVideo: boolean) => void;
// //   startGroupCall: (roomId: string, groupName: string, isVideo: boolean) => void;
// //   isReady: boolean;
// // }

// // const ZegoContext = createContext<ZegoContextType>({
// //   startCall: () => {},
// //   startGroupCall: () => {},
// //   isReady: false,
// // });

// // export const useZegoCall = () => useContext(ZegoContext);

// // interface ZegoCallProviderProps {
// //   children: React.ReactNode;
// //   userID?: string;
// //   userName?: string;
// // }

// // export default function ZegoCallProvider({ children, userID, userName }: ZegoCallProviderProps) {
// //   const zpRef = useRef<any>(null);
// //   const containerRef = useRef<HTMLDivElement | null>(null);
// //   const [isReady, setIsReady] = useState(false);
// //   const [isInCall, setIsInCall] = useState(false);
// //   const [mounted, setMounted] = useState(false);

// //   useEffect(() => {
// //     setMounted(true);
// //   }, []);

// //   // ===== تهيئة Zego =====
// //   useEffect(() => {
// //     if (typeof window === "undefined" || !userID || zpRef.current) return;

// //     const initZego = async () => {
// //       try {
// //         const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");
// //         const { ZIM } = await import("zego-zim-web");

// //         const res = await fetch("/api/zego/token", {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({ userId: userID }),
// //         });

// //         const data = await res.json();
// //         if (!data.success || !data.token) {
// //           console.error("❌ فشل الحصول على Zego Token:", data.error);
// //           return;
// //         }

// //         const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
// //           data.appId,
// //           data.token,
// //           null,
// //           userID,
// //           userName || `User_${userID}`
// //         );

// //         const zp = ZegoUIKitPrebuilt.create(kitToken);
// //         zp.addPlugins({ ZIM });

// //         zp.setCallInvitationConfig({
// //           enableNotifyWhenAppRunningInBackgroundOrQuit: true,
// //         });

// //         zpRef.current = zp;
// //         setIsReady(true);
// //         console.log("✅ تم تشغيل نظام مكالمات Zego بنجاح للمستخدم:", userID);
// //       } catch (err) {
// //         console.error("❌ خطأ أثناء تهيئة Zego SDK:", err);
// //       }
// //     };

// //     initZego();
// //   }, [userID, userName]);

// //   // ===== مراقبة عناصر Zego ورفع z-index =====
// //   useEffect(() => {
// //     if (!isInCall || typeof window === "undefined") return;

// //     const raiseZegoZIndex = () => {
// //       const selectors = [
// //         '[class*="zego"]',
// //         '[id*="zego"]',
// //         '[class*="Zego"]',
// //         ".zego-ui-kit-prebuilt",
// //         ".zego-portal",
// //       ];

// //       selectors.forEach((sel) => {
// //         document.querySelectorAll(sel).forEach((el) => {
// //           const htmlEl = el as HTMLElement;
// //           htmlEl.style.zIndex = "2147483647";
// //           htmlEl.style.isolation = "isolate";
// //         });
// //       });
// //     };

// //     raiseZegoZIndex();

// //     const observer = new MutationObserver(raiseZegoZIndex);
// //     observer.observe(document.body, {
// //       childList: true,
// //       subtree: true,
// //       attributes: true,
// //       attributeFilter: ["class", "style"],
// //     });

// //     const interval = setInterval(raiseZegoZIndex, 1000);

// //     return () => {
// //       observer.disconnect();
// //       clearInterval(interval);
// //     };
// //   }, [isInCall]);

// //   // ===== 1-to-1 Call =====
// //   const startCall = async (targetUserId: string, targetUserName: string, isVideo: boolean) => {
// //     if (!zpRef.current) {
// //       console.error("❌ Zego لم يتم تهيئته بعد!");
// //       return;
// //     }

// //     try {
// //       const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");

// //       console.log(`📞 جاري الاتصال بالمستخدم: ${targetUserId} (${targetUserName})`);

// //       zpRef.current.sendCallInvitation({
// //         callees: [{ userID: targetUserId, userName: targetUserName || `User_${targetUserId}` }],
// //         callType: isVideo
// //           ? ZegoUIKitPrebuilt.InvitationTypeVideoCall
// //           : ZegoUIKitPrebuilt.InvitationTypeVoiceCall,
// //         timeout: 60,
// //       });
// //     } catch (error) {
// //       console.error("❌ خطأ أثناء إرسال دعوة المكالمة:", error);
// //     }
// //   };

// //   // ===== Group Call =====
// //   const startGroupCall = async (roomId: string, groupName: string, isVideo: boolean) => {
// //     if (!zpRef.current || !containerRef.current) {
// //       console.error("❌ Zego أو حاوية العرض غير جاهزة!");
// //       return;
// //     }

// //     try {
// //       const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");

// //       console.log(`📞 بدء مكالمة جماعية في الغرفة: ${roomId}`);
// //       setIsInCall(true);
// //         document.body.classList.add('zego-active');  // 👈 ضيفي ده

// //       zpRef.current.joinRoom({
// //         roomID: roomId,
// //         container: containerRef.current,
// //         scenario: {
// //           mode: ZegoUIKitPrebuilt.GroupCall,
// //         },
// //         turnOnCameraWhenJoining: isVideo,
// //         turnOnMicrophoneWhenJoining: true,
// //         showMyCameraToggleButton: true,
// //         showMyMicrophoneToggleButton: true,
// //         showAudioVideoSettingsButton: true,
// //         showScreenSharingButton: true,
// //         showTextChat: true,
// //         showUserList: true,
// //         maxUsers: 50,
// //         layout: "Auto",
// //         showLayoutButton: true,
// //         onLeaveRoom: () => {
// //           setIsInCall(false);
// //         },
// //       });
// //     } catch (error) {
// //       console.error("❌ خطأ أثناء بدء المكالمة الجماعية:", error);
// //       setIsInCall(false);
// //     }
// //   };

// //   return (
// //     <ZegoContext.Provider value={{ startCall, startGroupCall, isReady }}>
// //       {children}

// //       {/* Portal حقيقي في document.body */}
// //       {mounted &&
// //         createPortal(
// //           <div
// //             ref={containerRef}
// //             style={{
// //               position: "fixed",
// //               top: 0,
// //               left: 0,
// //               width: "100vw",
// //               height: "100vh",
// //               zIndex: 2147483647,
// //               display: isInCall ? "block" : "none",
// //               backgroundColor: "#000",
// //               isolation: "isolate",
// //             }}
// //           />,
// //           document.body
// //         )}
// //     </ZegoContext.Provider>
// //   );
// // }




// "use client";

// import React, { createContext, useContext, useEffect, useRef, useState } from "react";
// import { createPortal } from "react-dom";

// interface ZegoContextType {
//   startCall: (targetUserId: string, targetUserName: string, isVideo: boolean) => void;
//   startGroupCall: (roomId: string, groupName: string, isVideo: boolean) => void;
//   isReady: boolean;
// }

// const ZegoContext = createContext<ZegoContextType>({
//   startCall: () => {},
//   startGroupCall: () => {},
//   isReady: false,
// });

// export const useZegoCall = () => useContext(ZegoContext);

// interface ZegoCallProviderProps {
//   children: React.ReactNode;
//   userID?: string;
//   userName?: string;
// }

// export default function ZegoCallProvider({ children, userID, userName }: ZegoCallProviderProps) {
//   const zpRef = useRef<any>(null);
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const [isReady, setIsReady] = useState(false);
//   const [isInCall, setIsInCall] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   const markCallActive = () => {
//     console.log("📞 markCallActive called");
//     setIsInCall(true);
//     if (typeof document !== "undefined") {
//       document.body.classList.add("zego-active");
//     }
//   };

//   const markCallEnded = () => {
//     console.log("📞 markCallEnded called");
//     setIsInCall(false);
//     if (typeof document !== "undefined") {
//       document.body.classList.remove("zego-active");
//     }
//   };

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     if (typeof window === "undefined" || !userID || zpRef.current) return;

//     const initZego = async () => {
//       try {
//         const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");
//         const { ZIM } = await import("zego-zim-web");

//         const res = await fetch("/api/zego/token", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ userId: userID }),
//         });

//         const data = await res.json();
//         if (!data.success || !data.token) {
//           console.error("❌ فشل الحصول على Zego Token:", data.error);
//           return;
//         }

//         const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
//           data.appId,
//           data.token,
//           null,
//           userID,
//           userName || `User_${userID}`
//         );

//         const zp = ZegoUIKitPrebuilt.create(kitToken);
//         zp.addPlugins({ ZIM });

//         zp.setCallInvitationConfig({
//           enableNotifyWhenAppRunningInBackgroundOrQuit: true,
//         });

//         // 👇 نراقب الأحداث
//         try {
//           if (typeof zp.on === "function") {
//             zp.on("callInvitationAccepted", () => {
//               console.log("📞 callInvitationAccepted");
//               markCallActive();
//             });

//             zp.on("callInvitationRejected", () => {
//               console.log("📞 callInvitationRejected");
//               markCallEnded();
//             });

//             zp.on("callInvitationCancelled", () => {
//               console.log("📞 callInvitationCancelled");
//               markCallEnded();
//             });

//             zp.on("callInvitationTimeout", () => {
//               console.log("📞 callInvitationTimeout");
//               markCallEnded();
//             });
//           }
//         } catch (e) {
//           console.warn("⚠️ Could not add event listeners:", e);
//         }

//         zpRef.current = zp;
//         setIsReady(true);
//         console.log("✅ تم تشغيل نظام مكالمات Zego بنجاح للمستخدم:", userID);
//       } catch (err) {
//         console.error("❌ خطأ أثناء تهيئة Zego SDK:", err);
//       }
//     };

//     initZego();
//   }, [userID, userName]);

//   // ===== 1-to-1 Call =====
//   const startCall = async (targetUserId: string, targetUserName: string, isVideo: boolean) => {
//     if (!zpRef.current) {
//       console.error("❌ Zego لم يتم تهيئته بعد!");
//       return;
//     }

//     try {
//       const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");

//       console.log(`📞 جاري الاتصال بالمستخدم: ${targetUserId} (${targetUserName})`);

//       // ❌ مفيش markCallActive هنا — عشان ما تظهرش شاشة سودا
//       // الـ markCallActive هتتنادى بس لما الطرف التاني يقبل

//       zpRef.current.sendCallInvitation({
//         callees: [{ userID: targetUserId, userName: targetUserName || `User_${targetUserId}` }],
//         callType: isVideo
//           ? ZegoUIKitPrebuilt.InvitationTypeVideoCall
//           : ZegoUIKitPrebuilt.InvitationTypeVoiceCall,
//         timeout: 60,
//       });
//     } catch (error) {
//       console.error("❌ خطأ أثناء إرسال دعوة المكالمة:", error);
//     }
//   };

//   // ===== Group Call =====
//   const startGroupCall = async (roomId: string, groupName: string, isVideo: boolean) => {
//     if (!zpRef.current || !containerRef.current) {
//       console.error("❌ Zego أو حاوية العرض غير جاهزة!");
//       return;
//     }

//     try {
//       const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");

//       console.log(`📞 بدء مكالمة جماعية في الغرفة: ${roomId}`);
//       markCallActive();

//       zpRef.current.joinRoom({
//         roomID: roomId,
//         container: containerRef.current,
//         scenario: {
//           mode: ZegoUIKitPrebuilt.GroupCall,
//         },
//         turnOnCameraWhenJoining: isVideo,
//         turnOnMicrophoneWhenJoining: true,
//         showMyCameraToggleButton: true,
//         showMyMicrophoneToggleButton: true,
//         showAudioVideoSettingsButton: true,
//         showScreenSharingButton: true,
//         showTextChat: true,
//         showUserList: true,
//         maxUsers: 50,
//         layout: "Auto",
//         showLayoutButton: true,
//         onLeaveRoom: () => {
//           markCallEnded();
//         },
//       });
//     } catch (error) {
//       console.error("❌ خطأ أثناء بدء المكالمة الجماعية:", error);
//       markCallEnded();
//     }
//   };

//   return (
//     <ZegoContext.Provider value={{ startCall, startGroupCall, isReady }}>
//       {children}

//       {/* 👇 الـ container يظهر بس لما تكون فيه مكالمة فعلية (مش لما تبعت دعوة) */}
//       {mounted &&
//         isInCall &&
//         createPortal(
//           <div
//             ref={containerRef}
//             style={{
//               position: "fixed",
//               top: 0,
//               left: 0,
//               width: "100vw",
//               height: "100vh",
//               zIndex: 2147483647,
//               backgroundColor: "#000",
//               isolation: "isolate",
//             }}
//           />,
//           document.body
//         )}
//     </ZegoContext.Provider>
//   );
// }


// 
// "use client";

// import React, { createContext, useContext, useEffect, useRef, useState } from "react";
// import { createPortal } from "react-dom";

// interface ZegoContextType {
//   startCall: (targetUserId: string, targetUserName: string, isVideo: boolean) => void;
//   startGroupCall: (roomId: string, groupName: string, isVideo: boolean) => void;
//   isReady: boolean;
//   isInCall: boolean;   // 👈 ضيفي ده
// }

// const ZegoContext = createContext<ZegoContextType>({
//   startCall: () => {},
//   startGroupCall: () => {},
//   isReady: false,
//   isInCall: false,   // 👈 ضيفي ده
// });

// export const useZegoCall = () => useContext(ZegoContext);

// interface ZegoCallProviderProps {
//   children: React.ReactNode;
//   userID?: string;
//   userName?: string;
// }

// export default function ZegoCallProvider({ children, userID, userName }: ZegoCallProviderProps) {
//   const zpRef = useRef<any>(null);
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const [isReady, setIsReady] = useState(false);
//   const [isInCall, setIsInCall] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   const markCallActive = () => {
//     console.log("📞 markCallActive called - المكالمة بدأت");
//     setIsInCall(true);
//     if (typeof document !== "undefined") {
//       document.body.classList.add("zego-active");
//     }
//   };

//   const markCallEnded = () => {
//     console.log("📞 markCallEnded called - المكالمة خلصت");
//     setIsInCall(false);
//     if (typeof document !== "undefined") {
//       document.body.classList.remove("zego-active");
//     }
//   };

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   // ===== تهيئة Zego =====
//   useEffect(() => {
//     if (typeof window === "undefined" || !userID || zpRef.current) return;

//     const initZego = async () => {
//       try {
//         const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");
//         const { ZIM } = await import("zego-zim-web");

//         const res = await fetch("/api/zego/token", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ userId: userID }),
//         });

//         const data = await res.json();
//         if (!data.success || !data.token) {
//           console.error("❌ فشل الحصول على Zego Token:", data.error);
//           return;
//         }

//         const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
//           data.appId,
//           data.token,
//           null,
//           userID,
//           userName || `User_${userID}`
//         );

//         const zp = ZegoUIKitPrebuilt.create(kitToken);
//         zp.addPlugins({ ZIM });

//         zp.setCallInvitationConfig({
//           enableNotifyWhenAppRunningInBackgroundOrQuit: true,
//         });

//         // ===== نراقب أحداث المكالمة =====
//         try {
//           if (typeof zp.on === "function") {
//             // لما الطرف التاني يقبل → المكالمة تبدأ
//             zp.on("callInvitationAccepted", () => {
//               console.log("📞 callInvitationAccepted");
//               markCallActive();
//             });

//             // لما الطرف التاني يرفض → نرجع
//             zp.on("callInvitationRejected", () => {
//               console.log("📞 callInvitationRejected");
//               markCallEnded();
//             });

//             // لما الدعوة تتلغي → نرجع
//             zp.on("callInvitationCancelled", () => {
//               console.log("📞 callInvitationCancelled");
//               markCallEnded();
//             });

//             // لما الدعوة تعمل timeout → نرجع
//             zp.on("callInvitationTimeout", () => {
//               console.log("📞 callInvitationTimeout");
//               markCallEnded();
//             });

//             // لما المكالمة تبدأ فعلاً (أي نوع)
//             zp.on("roomStateChanged", (state: any) => {
//               console.log("📞 roomStateChanged:", state);
//               if (state?.roomID) {
//                 markCallActive();
//               } else {
//                 markCallEnded();
//               }
//             });
//           }
//         } catch (e) {
//           console.warn("⚠️ Could not add event listeners:", e);
//         }

//         zpRef.current = zp;
//         setIsReady(true);
//         console.log("✅ تم تشغيل نظام مكالمات Zego بنجاح للمستخدم:", userID);
//       } catch (err) {
//         console.error("❌ خطأ أثناء تهيئة Zego SDK:", err);
//       }
//     };

//     initZego();
//   }, [userID, userName]);

//   // ===== 1-to-1 Call =====
//   const startCall = async (targetUserId: string, targetUserName: string, isVideo: boolean) => {
//     if (!zpRef.current) {
//       console.error("❌ Zego لم يتم تهيئته بعد!");
//       return;
//     }

//     try {
//       const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");

//       console.log(`📞 جاري الاتصال بالمستخدم: ${targetUserId} (${targetUserName})`);

//       // ❌ مفيش markCallActive هنا — عشان ما تظهرش شاشة سودا
//       // ✅ markCallActive هتتنادى لما الطرف التاني يقبل

//       zpRef.current.sendCallInvitation({
//         callees: [{ userID: targetUserId, userName: targetUserName || `User_${targetUserId}` }],
//         callType: isVideo
//           ? ZegoUIKitPrebuilt.InvitationTypeVideoCall
//           : ZegoUIKitPrebuilt.InvitationTypeVoiceCall,
//         timeout: 60,
//       });
//     } catch (error) {
//       console.error("❌ خطأ أثناء إرسال دعوة المكالمة:", error);
//     }
//   };

//   // ===== Group Call =====
//   const startGroupCall = async (roomId: string, groupName: string, isVideo: boolean) => {
//     if (!zpRef.current || !containerRef.current) {
//       console.error("❌ Zego أو حاوية العرض غير جاهزة!");
//       return;
//     }

//     try {
//       const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");

//       console.log(`📞 بدء مكالمة جماعية في الغرفة: ${roomId}`);
//       markCallActive();

//       zpRef.current.joinRoom({
//         roomID: roomId,
//         container: containerRef.current,
//         scenario: {
//           mode: ZegoUIKitPrebuilt.GroupCall,
//         },
//         turnOnCameraWhenJoining: isVideo,
//         turnOnMicrophoneWhenJoining: true,
//         showMyCameraToggleButton: true,
//         showMyMicrophoneToggleButton: true,
//         showAudioVideoSettingsButton: true,
//         showScreenSharingButton: true,
//         showTextChat: true,
//         showUserList: true,
//         maxUsers: 50,
//         layout: "Auto",
//         showLayoutButton: true,
//         onLeaveRoom: () => {
//           markCallEnded();
//         },
//       });
//     } catch (error) {
//       console.error("❌ خطأ أثناء بدء المكالمة الجماعية:", error);
//       markCallEnded();
//     }
//   };

//   return (
//     <ZegoContext.Provider value={{ startCall, startGroupCall, isReady, isInCall }}>
//       {children}

//       {/* 👇 الـ container يظهر بس لما isInCall = true */}
//       {mounted &&
//         isInCall &&
//         createPortal(
//           <div
//             ref={containerRef}
//             style={{
//               position: "fixed",
//               top: 0,
//               left: 0,
//               width: "100vw",
//               height: "100vh",
//               zIndex: 2147483647,
//               backgroundColor: "#000",
//               isolation: "isolate",
//             }}
//           />,
//           document.body
//         )}
//     </ZegoContext.Provider>
//   );
// }



"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ZegoContextType {
  startCall: (targetUserId: string, targetUserName: string, isVideo: boolean) => void;
  startGroupCall: (roomId: string, groupName: string, isVideo: boolean) => void;
  isReady: boolean;
  isInCall: boolean;
}

const ZegoContext = createContext<ZegoContextType>({
  startCall: () => {},
  startGroupCall: () => {},
  isReady: false,
  isInCall: false,
});

export const useZegoCall = () => useContext(ZegoContext);

interface ZegoCallProviderProps {
  children: React.ReactNode;
  userID?: string;
  userName?: string;
}

export default function ZegoCallProvider({ children, userID, userName }: ZegoCallProviderProps) {
  const zpRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [isGroupCallActive, setIsGroupCallActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  const markCallActive = () => {
    console.log("📞 markCallActive called - المكالمة بدأت");
    setIsInCall(true);
    if (typeof document !== "undefined") {
      document.body.classList.add("zego-active");
    }
  };

  const markCallEnded = () => {
    console.log("📞 markCallEnded called - المكالمة انتهت");
    setIsInCall(false);
    setIsGroupCallActive(false);
    if (typeof document !== "undefined") {
      document.body.classList.remove("zego-active");
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // ===== تهيئة Zego =====
  useEffect(() => {
    if (typeof window === "undefined" || !userID || zpRef.current) return;

    const initZego = async () => {
      try {
        const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");
        const { ZIM } = await import("zego-zim-web");

        const res = await fetch("/api/zego/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userID }),
        });

        const data = await res.json();
        if (!data.success || !data.token) {
          console.error("❌ فشل الحصول على Zego Token:", data.error);
          return;
        }

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
          data.appId,
          data.token,
          null,
          userID,
          userName || `User_${userID}`
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zp.addPlugins({ ZIM });

        zp.setCallInvitationConfig({
          enableNotifyWhenAppRunningInBackgroundOrQuit: true,
        });

        // ===== مراقبة أحداث المكالمات =====
        try {
          if (typeof zp.on === "function") {
            zp.on("callInvitationAccepted", () => {
              console.log("📞 callInvitationAccepted");
              markCallActive();
            });

            zp.on("callInvitationRejected", () => {
              console.log("📞 callInvitationRejected");
              markCallEnded();
            });

            zp.on("callInvitationCancelled", () => {
              console.log("📞 callInvitationCancelled");
              markCallEnded();
            });

            zp.on("callInvitationTimeout", () => {
              console.log("📞 callInvitationTimeout");
              markCallEnded();
            });

            zp.on("roomStateChanged", (state: any) => {
              console.log("📞 roomStateChanged:", state);
              if (state?.state === "CONNECTED" || state?.roomID) {
                markCallActive();
              } else if (state?.state === "DISCONNECTED") {
                markCallEnded();
              }
            });
          }
        } catch (e) {
          console.warn("⚠️ Could not add event listeners:", e);
        }

        zpRef.current = zp;
        setIsReady(true);
        console.log("✅ تم تشغيل نظام مكالمات Zego بنجاح للمستخدم:", userID);
      } catch (err) {
        console.error("❌ خطأ أثناء تهيئة Zego SDK:", err);
      }
    };

    initZego();
  }, [userID, userName]);

  // ===== مراقبة طبقات Zego لرفع الـ z-index تلقائياً =====
  useEffect(() => {
    if (typeof window === "undefined") return;

    const raiseZegoZIndex = () => {
      const selectors = [
        '[class*="zego"]',
        '[id*="zego"]',
        '[class*="Zego"]',
        ".zego-ui-kit-prebuilt",
        ".zego-portal",
      ];

      selectors.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => {
          const htmlEl = el as HTMLElement;
          htmlEl.style.zIndex = "2147483647";
        });
      });
    };

    raiseZegoZIndex();

    const observer = new MutationObserver(raiseZegoZIndex);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // ===== 1-to-1 Call =====
  const startCall = async (targetUserId: string, targetUserName: string, isVideo: boolean) => {
    if (!zpRef.current) {
      console.error("❌ Zego لم يتم تهيئته بعد!");
      return;
    }

    try {
      const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");

      console.log(`📞 جاري الاتصال بالمستخدم: ${targetUserId} (${targetUserName})`);

      zpRef.current.sendCallInvitation({
        callees: [{ userID: targetUserId, userName: targetUserName || `User_${targetUserId}` }],
        callType: isVideo
          ? ZegoUIKitPrebuilt.InvitationTypeVideoCall
          : ZegoUIKitPrebuilt.InvitationTypeVoiceCall,
        timeout: 60,
      });
    } catch (error) {
      console.error("❌ خطأ أثناء إرسال دعوة المكالمة:", error);
    }
  };

  // ===== Group Call =====
  const startGroupCall = async (roomId: string, groupName: string, isVideo: boolean) => {
    if (!zpRef.current) {
      console.error("❌ Zego غير جاهز!");
      return;
    }

    try {
      const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");

      console.log(`📞 بدء مكالمة جماعية في الغرفة: ${roomId}`);
      setIsGroupCallActive(true);
      markCallActive();

      // ننتظر الرندر للـ DOM element المخصص للمكالمات الجماعية
      setTimeout(() => {
        if (!containerRef.current) return;
        zpRef.current.joinRoom({
          roomID: roomId,
          container: containerRef.current,
          scenario: {
            mode: ZegoUIKitPrebuilt.GroupCall,
          },
          turnOnCameraWhenJoining: isVideo,
          turnOnMicrophoneWhenJoining: true,
          showMyCameraToggleButton: true,
          showMyMicrophoneToggleButton: true,
          showAudioVideoSettingsButton: true,
          showScreenSharingButton: true,
          showTextChat: true,
          showUserList: true,
          maxUsers: 50,
          layout: "Auto",
          showLayoutButton: true,
          onLeaveRoom: () => {
            markCallEnded();
          },
        });
      }, 50);
    } catch (error) {
      console.error("❌ خطأ أثناء بدء المكالمة الجماعية:", error);
      markCallEnded();
    }
  };

  return (
    <ZegoContext.Provider value={{ startCall, startGroupCall, isReady, isInCall }}>
      {children}

      {/* إنشاء الحاوية السوداء فقط عند وجود مكالمة جماعية فعالة لحجب المكونات الخلفية */}
      {mounted &&
        isGroupCallActive &&
        createPortal(
          <div
            ref={containerRef}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 2147483647,
              backgroundColor: "#000",
              isolation: "isolate",
            }}
          />,
          document.body
        )}
    </ZegoContext.Provider>
  );
}