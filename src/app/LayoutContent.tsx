// // // // src/app/LayoutContent.tsx
// // // "use client";

// // // import { usePathname } from "next/navigation";
// // // import { useLocale } from 'next-intl';
// // // import { useEffect, useMemo } from 'react';
// // // import SidebarArabic from "./_components/SidebarArabic";
// // // import Header from "@/components/GlobalSearch";
// // // import LayoutRightSideClient from "@/components/LayoutConditionalClient";
// // // import { Toaster } from "react-hot-toast";
// // // import NetworkMonitor from '@/components/NetworkMonitor';
// // // import { userSearchProvider } from '@/providers/userSearchProvider';
// // // import { generalPostsProvider } from '@/providers/generalPostsProvider';

// // // type LayoutContentProps = {
// // //   children: React.ReactNode;
// // //   isRTL: boolean;
// // //   locale: string;
// // // };

// // // export default function LayoutContent({ 
// // //   children, 
// // //   isRTL,
// // //   locale: initialLocale
// // // }: LayoutContentProps) {
// // //   const pathname = usePathname();
// // //   const isLogin = pathname === "/login";
// // //   const currentLocale = useLocale();

// // //   const searchProviders = useMemo(() => {
// // //     return [userSearchProvider, generalPostsProvider];
// // //   }, []);

// // //   useEffect(() => {
// // //     document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
// // //     document.documentElement.lang = currentLocale;
// // //   }, [currentLocale, isRTL]);

// // //   return (
// // //     <>
// // //       <NetworkMonitor />
      
// // //       {/* ✅ Header (الذي يحتوي على GlobalSearch) داخل TranslationProvider */}
// // //       {!isLogin ? <Header providers={searchProviders} /> : null}
      
// // //       <div
// // //         className="w-full flex overflow-hidden mx-auto"
// // //         style={{
// // //           height: !isLogin ? "calc(100vh - 83px)" : "100vh",
// // //         }}
// // //         dir={isRTL ? "rtl" : "ltr"}
// // //       >
// // //         {!isLogin && (
// // //           <div
// // //             className="hidden md:block min-w-[300px] max-w-[330px] w-full pl-3 z-[999]"
// // //             style={{ boxShadow: "rgb(0 0 0 / 9%) -2px 1px 10px 0px" }}
// // //           >
// // //             <SidebarArabic />
// // //           </div>
// // //         )}

// // //         <main className="flex-1 w-full">
// // //           {children}
// // //         </main>

// // //         {!isLogin && <LayoutRightSideClient />}

// // //         <Toaster
// // //           position="top-center"
// // //           toastOptions={{
// // //             duration: 3000,
// // //             style: {
// // //               borderRadius: "12px",
// // //               background: "#111",
// // //               color: "#fff",
// // //             },
// // //           }}
// // //         />
// // //       </div>
// // //     </>
// // //   );
// // // }


// // // src/app/LayoutContent.tsx
// // "use client";

// // import { usePathname } from "next/navigation";
// // import { useLocale } from 'next-intl';
// // import { useEffect, useMemo } from 'react';
// // import SidebarArabic from "./_components/SidebarArabic";
// // import Header from "@/components/GlobalSearch";
// // import LayoutRightSideClient from "@/components/LayoutConditionalClient";
// // import { Toaster } from "react-hot-toast";
// // import NetworkMonitor from '@/components/NetworkMonitor';
// // import { userSearchProvider } from '@/providers/userSearchProvider';
// // import { generalPostsProvider } from '@/providers/generalPostsProvider';
// // import { CallProvider } from '@/contexts/CallContext';   // ✅ جديد

// // type LayoutContentProps = {
// //   children: React.ReactNode;
// //   isRTL: boolean;
// //   locale: string;
// // };

// // export default function LayoutContent({ 
// //   children, 
// //   isRTL,
// //   locale: initialLocale
// // }: LayoutContentProps) {
// //   const pathname = usePathname();
// //   const isLogin = pathname === "/login";
// //   const currentLocale = useLocale();

// //   const searchProviders = useMemo(() => {
// //     return [userSearchProvider, generalPostsProvider];
// //   }, []);

// //   useEffect(() => {
// //     document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
// //     document.documentElement.lang = currentLocale;
// //   }, [currentLocale, isRTL]);

// //   return (
// //     <CallProvider>                              {/* ✅ لفّي الكل */}
// //       <NetworkMonitor />
      
// //       {!isLogin ? <Header providers={searchProviders} /> : null}
      
// //       <div
// //         className="w-full flex overflow-hidden mx-auto"
// //         style={{
// //           height: !isLogin ? "calc(100vh - 83px)" : "100vh",
// //         }}
// //         dir={isRTL ? "rtl" : "ltr"}
// //       >
// //         {!isLogin && (
// //           <div
// //             className="hidden md:block min-w-[300px] max-w-[330px] w-full pl-3 z-[999]"
// //             style={{ boxShadow: "rgb(0 0 0 / 9%) -2px 1px 10px 0px" }}
// //           >
// //             <SidebarArabic />
// //           </div>
// //         )}

// //         <main className="flex-1 w-full">
// //           {children}
// //         </main>

// //         {!isLogin && <LayoutRightSideClient />}

// //         <Toaster
// //           position="top-center"
// //           toastOptions={{
// //             duration: 3000,
// //             style: {
// //               borderRadius: "12px",
// //               background: "#111",
// //               color: "#fff",
// //             },
// //           }}
// //         />
// //       </div>
// //     </CallProvider>                             
// //   );
// // }


// // ////////////UpdateNow
// // // // src/app/LayoutContent.tsx
// // // "use client";

// // // import { usePathname } from "next/navigation";
// // // import { useLocale } from 'next-intl';
// // // import { useEffect, useMemo } from 'react';
// // // import SidebarArabic from "./_components/SidebarArabic";
// // // import Header from "@/components/GlobalSearch";
// // // import LayoutRightSideClient from "@/components/LayoutConditionalClient";
// // // import { Toaster } from "react-hot-toast";
// // // import NetworkMonitor from '@/components/NetworkMonitor';
// // // import { userSearchProvider } from '@/providers/userSearchProvider';
// // // import { generalPostsProvider } from '@/providers/generalPostsProvider';

// // // type LayoutContentProps = {
// // //   children: React.ReactNode;
// // //   isRTL: boolean;
// // //   locale: string;
// // // };

// // // export default function LayoutContent({ 
// // //   children, 
// // //   isRTL,
// // //   locale: initialLocale
// // // }: LayoutContentProps) {
// // //   const pathname = usePathname();
// // //   const isLogin = pathname === "/login";
// // //   const currentLocale = useLocale();

// // //   const searchProviders = useMemo(() => {
// // //     return [userSearchProvider, generalPostsProvider];
// // //   }, []);

// // //   useEffect(() => {
// // //     document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
// // //     document.documentElement.lang = currentLocale;
// // //   }, [currentLocale, isRTL]);

// // //   return (
// // //     <>
// // //       <NetworkMonitor />
      
// // //       {/* ✅ Header (الذي يحتوي على GlobalSearch) داخل TranslationProvider */}
// // //       {!isLogin ? <Header providers={searchProviders} /> : null}
      
// // //       <div
// // //         className="w-full flex overflow-hidden mx-auto"
// // //         style={{
// // //           height: !isLogin ? "calc(100vh - 83px)" : "100vh",
// // //         }}
// // //         dir={isRTL ? "rtl" : "ltr"}
// // //       >
// // //         {!isLogin && (
// // //           <div
// // //             className="hidden md:block min-w-[300px] max-w-[330px] w-full pl-3 z-[999]"
// // //             style={{ boxShadow: "rgb(0 0 0 / 9%) -2px 1px 10px 0px" }}
// // //           >
// // //             <SidebarArabic />
// // //           </div>
// // //         )}

// // //         <main className="flex-1 w-full">
// // //           {children}
// // //         </main>

// // //         {!isLogin && <LayoutRightSideClient />}

// // //         <Toaster
// // //           position="top-center"
// // //           toastOptions={{
// // //             duration: 3000,
// // //             style: {
// // //               borderRadius: "12px",
// // //               background: "#111",
// // //               color: "#fff",
// // //             },
// // //           }}
// // //         />
// // //       </div>
// // //     </>
// // //   );
// // // }


// // // src/app/LayoutContent.tsx
// // "use client";

// // import { usePathname } from "next/navigation";
// // import { useLocale } from 'next-intl';
// // import { useEffect, useMemo } from 'react';
// // import SidebarArabic from "./_components/SidebarArabic";
// // import Header from "@/components/GlobalSearch";
// // import LayoutRightSideClient from "@/components/LayoutConditionalClient";
// // import { Toaster } from "react-hot-toast";
// // import NetworkMonitor from '@/components/NetworkMonitor';
// // import { userSearchProvider } from '@/providers/userSearchProvider';
// // import { generalPostsProvider } from '@/providers/generalPostsProvider';
// // import { CallProvider } from '@/contexts/CallContext';   // ✅ جديد

// // type LayoutContentProps = {
// //   children: React.ReactNode;
// //   isRTL: boolean;
// //   locale: string;
// // };

// // export default function LayoutContent({ 
// //   children, 
// //   isRTL,
// //   locale: initialLocale
// // }: LayoutContentProps) {
// //   const pathname = usePathname();
// //   const isLogin = pathname === "/login";
// //   const currentLocale = useLocale();

// //   const searchProviders = useMemo(() => {
// //     return [userSearchProvider, generalPostsProvider];
// //   }, []);

// //   useEffect(() => {
// //     document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
// //     document.documentElement.lang = currentLocale;
// //   }, [currentLocale, isRTL]);

// //   return (
// //     <CallProvider>                              {/* ✅ لفّي الكل */}
// //       <NetworkMonitor />
      
// //       {!isLogin ? <Header providers={searchProviders} /> : null}
      
// //       <div
// //         className="w-full flex overflow-hidden mx-auto"
// //         style={{
// //           height: !isLogin ? "calc(100vh - 83px)" : "100vh",
// //         }}
// //         dir={isRTL ? "rtl" : "ltr"}
// //       >
// //         {!isLogin && (
// //           <div
// //             className="hidden md:block min-w-[300px] max-w-[330px] w-full pl-3 z-[999]"
// //             style={{ boxShadow: "rgb(0 0 0 / 9%) -2px 1px 10px 0px" }}
// //           >
// //             <SidebarArabic />
// //           </div>
// //         )}

// //         <main className="flex-1 w-full">
// //           {children}
// //         </main>

// //         {!isLogin && <LayoutRightSideClient />}

// //         <Toaster
// //           position="top-center"
// //           toastOptions={{
// //             duration: 3000,
// //             style: {
// //               borderRadius: "12px",
// //               background: "#111",
// //               color: "#fff",
// //             },
// //           }}
// //         />
// //       </div>
// //     </CallProvider>                             
// //   );
// // }


// // // src/app/LayoutContent.tsx
// // "use client";

// // import { usePathname } from "next/navigation";
// // import { useLocale } from 'next-intl';
// // import { useEffect, useMemo } from 'react';
// // import SidebarArabic from "./_components/SidebarArabic";
// // import Header from "@/components/GlobalSearch";
// // import LayoutRightSideClient from "@/components/LayoutConditionalClient";
// // import { Toaster } from "react-hot-toast";
// // import NetworkMonitor from '@/components/NetworkMonitor';
// // import { userSearchProvider } from '@/providers/userSearchProvider';
// // import { generalPostsProvider } from '@/providers/generalPostsProvider';

// // type LayoutContentProps = {
// //   children: React.ReactNode;
// //   isRTL: boolean;
// //   locale: string;
// // };

// // export default function LayoutContent({ 
// //   children, 
// //   isRTL,
// //   locale: initialLocale
// // }: LayoutContentProps) {
// //   const pathname = usePathname();
// //   const isLogin = pathname === "/login";
// //   const currentLocale = useLocale();

// //   const searchProviders = useMemo(() => {
// //     return [userSearchProvider, generalPostsProvider];
// //   }, []);

// //   useEffect(() => {
// //     document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
// //     document.documentElement.lang = currentLocale;
// //   }, [currentLocale, isRTL]);

// //   return (
// //     <>
// //       <NetworkMonitor />
      
// //       {!isLogin ? <Header providers={searchProviders} /> : null}
      
// //       <div
// //         className="w-full flex overflow-hidden mx-auto"
// //         style={{
// //           height: !isLogin ? "calc(100vh - 83px)" : "100vh",
// //         }}
// //         dir={isRTL ? "rtl" : "ltr"}
// //       >
// //         {!isLogin && (
// //           <div
// //             className="hidden md:block min-w-[300px] max-w-[330px] w-full pl-3 z-[999]"
// //             style={{ boxShadow: "rgb(0 0 0 / 9%) -2px 1px 10px 0px" }}
// //           >
// //             <SidebarArabic />
// //           </div>
// //         )}

// //         <main className="flex-1 w-full">
// //           {children}
// //         </main>

// //         {!isLogin && <LayoutRightSideClient />}

// //         <Toaster
// //           position="top-center"
// //           toastOptions={{
// //             duration: 3000,
// //             style: {
// //               borderRadius: "12px",
// //               background: "#111",
// //               color: "#fff",
// //             },
// //           }}
// //         />
// //       </div>
// //     </>
// //   );
// // }


// // Update Now
// // src/app/LayoutContent.tsx
// "use client";

// import { usePathname } from "next/navigation";
// import { useLocale } from 'next-intl';
// import { useEffect, useMemo, useState } from 'react';
// import SidebarArabic from "./_components/SidebarArabic";
// import Header from "@/components/GlobalSearch";
// import LayoutRightSideClient from "@/components/LayoutConditionalClient";
// import { Toaster } from "react-hot-toast";
// import NetworkMonitor from '@/components/NetworkMonitor';
// import { userSearchProvider } from '@/providers/userSearchProvider';
// import { generalPostsProvider } from '@/providers/generalPostsProvider';
// import ZegoCallProvider from '@/components/ZegoCallProvider'; // 👈 عدّل المسار

// type LayoutContentProps = {
//   children: React.ReactNode;
//   isRTL: boolean;
//   locale: string;
// };

// export default function LayoutContent({ 
//   children, 
//   isRTL,
//   locale: initialLocale
// }: LayoutContentProps) {
//   const pathname = usePathname();
//   const isLogin = pathname === "/login";
//   const currentLocale = useLocale();

//   // 👇 اقرأ بيانات المستخدم
//   const [zegoUser, setZegoUser] = useState<{ id: string; name: string } | null>(null);

//   useEffect(() => {
//     const raw = localStorage.getItem('userData');
//     if (!raw) return;
//     try {
//       const parsed = JSON.parse(raw);
//       const id = parsed._id || parsed.id || '';
//       const name =
//         parsed.name ||
//         parsed.username ||
//         `${parsed.firstName || ''} ${parsed.lastName || ''}`.trim() ||
//         `User_${id}`;
//       if (id) setZegoUser({ id, name });
//     } catch (e) {
//       console.error('فشل قراءة userData:', e);
//     }
//   }, []);

//   const searchProviders = useMemo(() => {
//     return [userSearchProvider, generalPostsProvider];
//   }, []);

//   useEffect(() => {
//     document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
//     document.documentElement.lang = currentLocale;
//   }, [currentLocale, isRTL]);

//   // 👇 المحتوى الأساسي
//   const content = (
//     <>
//       <NetworkMonitor />
//       {!isLogin ? <Header providers={searchProviders} /> : null}
//       <div
//         className="w-full flex overflow-hidden mx-auto"
//         style={{ height: !isLogin ? "calc(100vh - 83px)" : "100vh" }}
//         dir={isRTL ? "rtl" : "ltr"}
//       >
//         {!isLogin && (
//           <div
//             className="hidden md:block min-w-[300px] max-w-[330px] w-full pl-3 z-[999]"
//             style={{ boxShadow: "rgb(0 0 0 / 9%) -2px 1px 10px 0px" }}
//           >
//             <SidebarArabic />
//           </div>
//         )}
//         <main className="flex-1 w-full">{children}</main>
//         {!isLogin && <LayoutRightSideClient />}
//         <Toaster
//           position="top-center"
//           toastOptions={{
//             duration: 3000,
//             style: { borderRadius: "12px", background: "#111", color: "#fff" },
//           }}
//         />
//       </div>
//     </>
//   );

//   // 👇 غلّف بـ ZegoCallProvider لو المستخدم جاهز
//   if (isLogin || !zegoUser) {
//     return content;
//   }

//   return (
//     <ZegoCallProvider userID={zegoUser.id} userName={zegoUser.name}>
//       {content}
//     </ZegoCallProvider>
//   );
// }

// "use client";

// import { usePathname } from "next/navigation";
// import { useLocale } from 'next-intl';
// import { useEffect, useMemo, useState } from 'react';
// import SidebarArabic from "./_components/SidebarArabic";
// import Header from "@/components/GlobalSearch";
// import LayoutRightSideClient from "@/components/LayoutConditionalClient";
// import { Toaster } from "react-hot-toast";
// import NetworkMonitor from '@/components/NetworkMonitor';
// import { userSearchProvider } from '@/providers/userSearchProvider';
// import { generalPostsProvider } from '@/providers/generalPostsProvider';
// import ZegoCallProvider, { useZegoCall } from '@/components/ZegoCallProvider';

// type LayoutContentProps = {
//   children: React.ReactNode;
//   isRTL: boolean;
//   locale: string;
// };

// // 👇 component داخلي عشان يقدر يستخدم useZegoCall جوه الـ Provider
// function LayoutInner({ children, isRTL }: { children: React.ReactNode; isRTL: boolean }) {
//   const pathname = usePathname();
//   const isLogin = pathname === "/login";
//   const currentLocale = useLocale();

//   const searchProviders = useMemo(() => {
//     return [userSearchProvider, generalPostsProvider];
//   }, []);

//   // 👇 نقرأ حالة المكالمة من الـ Context
//   const { isReady } = useZegoCall();
//   const [isInCall, setIsInCall] = useState(false);

//   // 👇 نراقب الـ body class اللي بيتضاف من ZegoCallProvider
//   useEffect(() => {
//     const check = () => {
//       setIsInCall(document.body.classList.contains('zego-active'));
//     };
//     check();
//     const observer = new MutationObserver(check);
//     observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
//     return () => observer.disconnect();
//   }, []);

//   useEffect(() => {
//     document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
//     document.documentElement.lang = currentLocale;
//   }, [currentLocale, isRTL]);

//   // 👇 لو في مكالمة، نخفي الـ Header والـ Sidebar
//   if (isInCall) {
//     return (
//       <>
//         <NetworkMonitor />
//         <main className="w-full h-screen">{children}</main>
//       </>
//     );
//   }

//   return (
//     <>
//       <NetworkMonitor />
//       {!isLogin ? <Header providers={searchProviders} /> : null}
//       <div
//         className="w-full flex overflow-hidden mx-auto"
//         style={{ height: !isLogin ? "calc(100vh - 83px)" : "100vh" }}
//         dir={isRTL ? "rtl" : "ltr"}
//       >
//         {!isLogin && (
//           <div
//             className="hidden md:block min-w-[300px] max-w-[330px] w-full pl-3 z-[999]"
//             style={{ boxShadow: "rgb(0 0 0 / 9%) -2px 1px 10px 0px" }}
//           >
//             <SidebarArabic />
//           </div>
//         )}
//         <main className="flex-1 w-full">{children}</main>
//         {!isLogin && <LayoutRightSideClient />}
//         <Toaster
//           position="top-center"
//           toastOptions={{
//             duration: 3000,
//             style: { borderRadius: "12px", background: "#111", color: "#fff" },
//           }}
//         />
//       </div>
//     </>
//   );
// }

// export default function LayoutContent({ children, isRTL, locale }: LayoutContentProps) {
//   const pathname = usePathname();
//   const isLogin = pathname === "/login";

//   const [zegoUser, setZegoUser] = useState<{ id: string; name: string } | null>(null);

//   useEffect(() => {
//     const raw = localStorage.getItem('userData');
//     if (!raw) return;
//     try {
//       const parsed = JSON.parse(raw);
//       const id = parsed._id || parsed.id || '';
//       const name =
//         parsed.name ||
//         parsed.username ||
//         `${parsed.firstName || ''} ${parsed.lastName || ''}`.trim() ||
//         `User_${id}`;
//       if (id) setZegoUser({ id, name });
//     } catch (e) {
//       console.error('فشل قراءة userData:', e);
//     }
//   }, []);

//   if (isLogin || !zegoUser) {
//     return (
//       <LayoutInner isRTL={isRTL}>
//         {children}
//       </LayoutInner>
//     );
//   }

//   return (
//     <ZegoCallProvider userID={zegoUser.id} userName={zegoUser.name}>
//       <LayoutInner isRTL={isRTL}>
//         {children}
//       </LayoutInner>
//     </ZegoCallProvider>
//   );
// }



// "use client";

// import { usePathname } from "next/navigation";
// import { useLocale } from 'next-intl';
// import { useEffect, useMemo, useState } from 'react';
// import SidebarArabic from "./_components/SidebarArabic";
// import Header from "@/components/GlobalSearch";
// import LayoutRightSideClient from "@/components/LayoutConditionalClient";
// import { Toaster } from "react-hot-toast";
// import NetworkMonitor from '@/components/NetworkMonitor';
// import { userSearchProvider } from '@/providers/userSearchProvider';
// import { generalPostsProvider } from '@/providers/generalPostsProvider';
// import ZegoCallProvider, { useZegoCall } from '@/components/ZegoCallProvider';

// type LayoutContentProps = {
//   children: React.ReactNode;
//   isRTL: boolean;
//   locale: string;
// };

// function LayoutInner({ children, isRTL }: { children: React.ReactNode; isRTL: boolean }) {
//   const pathname = usePathname();
//   const isLogin = pathname === "/login";
//   const currentLocale = useLocale();

//   const searchProviders = useMemo(() => {
//     return [userSearchProvider, generalPostsProvider];
//   }, []);

//   // 👇 نقرأ حالة المكالمة مباشرة من الـ Context
//   const { isInCall } = useZegoCall();

//   useEffect(() => {
//     document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
//     document.documentElement.lang = currentLocale;
//   }, [currentLocale, isRTL]);

//   // 👇 لو في مكالمة، نخفي الـ Header والـ Sidebar
//   if (isInCall) {
//     return (
//       <>
//         <NetworkMonitor />
//         <main className="w-full h-screen">{children}</main>
//       </>
//     );
//   }

//   return (
//     <>
//       <NetworkMonitor />
//       {!isLogin ? <Header providers={searchProviders} /> : null}
//       <div
//         className="w-full flex overflow-hidden mx-auto"
//         style={{ height: !isLogin ? "calc(100vh - 83px)" : "100vh" }}
//         dir={isRTL ? "rtl" : "ltr"}
//       >
//         {!isLogin && (
//           <div
//             className="hidden md:block min-w-[300px] max-w-[330px] w-full pl-3 z-[999]"
//             style={{ boxShadow: "rgb(0 0 0 / 9%) -2px 1px 10px 0px" }}
//           >
//             <SidebarArabic />
//           </div>
//         )}
//         <main className="flex-1 w-full">{children}</main>
//         {!isLogin && <LayoutRightSideClient />}
//         <Toaster
//           position="top-center"
//           toastOptions={{
//             duration: 3000,
//             style: { borderRadius: "12px", background: "#111", color: "#fff" },
//           }}
//         />
//       </div>
//     </>
//   );
// }

// export default function LayoutContent({ children, isRTL, locale }: LayoutContentProps) {
//   const pathname = usePathname();
//   const isLogin = pathname === "/login";

//   const [zegoUser, setZegoUser] = useState<{ id: string; name: string } | null>(null);

//   useEffect(() => {
//     const raw = localStorage.getItem('userData');
//     if (!raw) return;
//     try {
//       const parsed = JSON.parse(raw);
//       const id = parsed._id || parsed.id || '';
//       const name =
//         parsed.name ||
//         parsed.username ||
//         `${parsed.firstName || ''} ${parsed.lastName || ''}`.trim() ||
//         `User_${id}`;
//       if (id) setZegoUser({ id, name });
//     } catch (e) {
//       console.error('فشل قراءة userData:', e);
//     }
//   }, []);

//   if (isLogin || !zegoUser) {
//     return (
//       <LayoutInner isRTL={isRTL}>
//         {children}
//       </LayoutInner>
//     );
//   }

//   return (
//     <ZegoCallProvider userID={zegoUser.id} userName={zegoUser.name}>
//       <LayoutInner isRTL={isRTL}>
//         {children}
//       </LayoutInner>
//     </ZegoCallProvider>
//   );
// }


"use client";

import { usePathname } from "next/navigation";
import { useLocale } from 'next-intl';
import { useEffect, useMemo } from 'react';
import SidebarArabic from "./_components/SidebarArabic";
import Header from "@/components/GlobalSearch";
import LayoutRightSideClient from "@/components/LayoutConditionalClient";
import { Toaster } from "react-hot-toast";
import NetworkMonitor from '@/components/NetworkMonitor';
import { userSearchProvider } from '@/providers/userSearchProvider';
import { generalPostsProvider } from '@/providers/generalPostsProvider';
import { useZegoCall } from '@/components/ZegoCallProvider';

type LayoutContentProps = {
  children: React.ReactNode;
  isRTL: boolean;
  locale: string;
};

export default function LayoutContent({ children, isRTL }: LayoutContentProps) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";
  const currentLocale = useLocale();

  const searchProviders = useMemo(() => {
    return [userSearchProvider, generalPostsProvider];
  }, []);

  // 👇 نقرأ حالة المكالمة من الـ Context
  const { isInCall } = useZegoCall();

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLocale;
  }, [currentLocale, isRTL]);

  // 👇 لو في مكالمة، نخفي الـ Header والـ Sidebar
  if (isInCall) {
    return (
      <>
        <NetworkMonitor />
        <main className="w-full h-screen">{children}</main>
      </>
    );
  }

  return (
    <>
      <NetworkMonitor />
      {!isLogin ? <Header providers={searchProviders} /> : null}
      <div
        className="w-full flex overflow-hidden mx-auto"
        style={{ height: !isLogin ? "calc(100vh - 83px)" : "100vh" }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {!isLogin && (
          <div
            className="hidden md:block min-w-[300px] max-w-[330px] w-full pl-3 z-[999]"
            style={{ boxShadow: "rgb(0 0 0 / 9%) -2px 1px 10px 0px" }}
          >
            <SidebarArabic />
          </div>
        )}
        <main className="flex-1 w-full">{children}</main>
        {!isLogin && <LayoutRightSideClient />}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: { borderRadius: "12px", background: "#111", color: "#fff" },
          }}
        />
      </div>
    </>
  );
}