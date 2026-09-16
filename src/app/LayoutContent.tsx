// // src/app/LayoutContent.tsx
// "use client";

// import { usePathname } from "next/navigation";
// import { useLocale } from 'next-intl';
// import { useEffect, useMemo } from 'react';
// import SidebarArabic from "./_components/SidebarArabic";
// import Header from "@/components/GlobalSearch";
// import LayoutRightSideClient from "@/components/LayoutConditionalClient";
// import { Toaster } from "react-hot-toast";
// import NetworkMonitor from '@/components/NetworkMonitor';
// import { userSearchProvider } from '@/providers/userSearchProvider';
// import { generalPostsProvider } from '@/providers/generalPostsProvider';

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

//   const searchProviders = useMemo(() => {
//     return [userSearchProvider, generalPostsProvider];
//   }, []);

//   useEffect(() => {
//     document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
//     document.documentElement.lang = currentLocale;
//   }, [currentLocale, isRTL]);

//   return (
//     <>
//       <NetworkMonitor />
      
//       {/* ✅ Header (الذي يحتوي على GlobalSearch) داخل TranslationProvider */}
//       {!isLogin ? <Header providers={searchProviders} /> : null}
      
//       <div
//         className="w-full flex overflow-hidden mx-auto"
//         style={{
//           height: !isLogin ? "calc(100vh - 83px)" : "100vh",
//         }}
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

//         <main className="flex-1 w-full">
//           {children}
//         </main>

//         {!isLogin && <LayoutRightSideClient />}

//         <Toaster
//           position="top-center"
//           toastOptions={{
//             duration: 3000,
//             style: {
//               borderRadius: "12px",
//               background: "#111",
//               color: "#fff",
//             },
//           }}
//         />
//       </div>
//     </>
//   );
// }


// src/app/LayoutContent.tsx
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
import { CallProvider } from '@/contexts/CallContext';   // ✅ جديد

type LayoutContentProps = {
  children: React.ReactNode;
  isRTL: boolean;
  locale: string;
};

export default function LayoutContent({ 
  children, 
  isRTL,
  locale: initialLocale
}: LayoutContentProps) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";
  const currentLocale = useLocale();

  const searchProviders = useMemo(() => {
    return [userSearchProvider, generalPostsProvider];
  }, []);

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLocale;
  }, [currentLocale, isRTL]);

  return (
    <CallProvider>                              {/* ✅ لفّي الكل */}
      <NetworkMonitor />
      
      {!isLogin ? <Header providers={searchProviders} /> : null}
      
      <div
        className="w-full flex overflow-hidden mx-auto"
        style={{
          height: !isLogin ? "calc(100vh - 83px)" : "100vh",
        }}
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

        <main className="flex-1 w-full">
          {children}
        </main>

        {!isLogin && <LayoutRightSideClient />}

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "12px",
              background: "#111",
              color: "#fff",
            },
          }}
        />
      </div>
    </CallProvider>                             
  );
}