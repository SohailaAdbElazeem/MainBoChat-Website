// // 'use client';
// // // import type { Metadata } from "next";
// // import "./globals.css";
// // import SidebarArabic from "./_components/SidebarArabic";
// // import Header from "@/components/GlobalSearch";
// // import LayoutRightSideClient from "@/components/LayoutConditionalClient";
// // import { usePathname } from "next/navigation";
// // import { Toaster } from "react-hot-toast";
 
// // import NetworkMonitor from '@/components/NetworkMonitor';
// // // export const metadata: Metadata = {
// // //   title: "Bo Chat",
// // //   description: "First Arabic Social Media Application",
// // // };
// // import { useEffect } from "react";

// // // استيراد المزودات
// // // import { userSearchProvider } from '@/providers/userSearchProvider';
// // // import { generalPostsProvider } from '@/providers/generalPostsProvider';

// // export default function RootLayout({ children }: { children: React.ReactNode }) {

// //     // const searchProviders = [userSearchProvider, generalPostsProvider];
// //   const pathname = usePathname();
// //   const isLogin = pathname === "/login";
// //   useEffect(() => {
// //   console.log('🔴 RootLayout mounted');
// //   const handler = () => console.log('📍 pagehide event');
// //   window.addEventListener('pagehide', handler);
// //   return () => window.removeEventListener('pagehide', handler);
// // }, []);
// //   return (
// //     <html lang="en">
// //       <body className="bg-white select-none">
// // {/* <AuthGuard/> */}
// //         <NetworkMonitor />

// //       {/* {!isLogin ?  <Header providers={searchProviders} /> : null} */}
// //       {!isLogin ?  <Header providers={[]} /> : null}
// //         <div
// //           className="w-full flex overflow-hidden mx-auto"
// //           style={{
// //             height: !isLogin ? "calc(100vh - 83px)" : "100vh",
// //           }}           
// //           dir="rtl"
// //         >

// //           {/* ✔ Sidebar ثابت في كل الصفحات */}
// //           {
// //             !isLogin &&
// //                       <div
// //             className="
// //               hidden 
// //               md:block 
// //               min-w-[300px] 
// //               max-w-[330px]
// //               w-full
// //               pl-3
// //               z-[999]
// //             "
// //             style={{ boxShadow: "rgb(0 0 0 / 9%) -2px 1px 10px 0px" }}
// //           >
// //             <SidebarArabic />
// //           </div>
// //           }


// //           <main className="flex-1 w-full">
// //             {children}
// //           </main>
// //           {
// //             !isLogin &&
// //             <LayoutRightSideClient />

// //           }
// //           <Toaster
// //             position="top-center"
// //             toastOptions={{
// //               duration: 3000,
// //               style: {
// //                 borderRadius: "12px",
// //                 background: "#111",
// //                 color: "#fff",
// //               },
// //             }}
// //           />
// //         </div>
// //       </body>
// //     </html>
// //   );
// // }



 

// // Upate Code 
// 'use client';
//  import { LoginModalProvider } from "@/contexts/LoginModalContext";
// import { TranslationProvider } from "@/contexts/TranslationContext";

// import "./globals.css";
// import SidebarArabic from "./_components/SidebarArabic";
// import Header from "@/components/GlobalSearch";
// import LayoutRightSideClient from "@/components/LayoutConditionalClient";
// import { usePathname } from "next/navigation";
// import { Toaster } from "react-hot-toast";
// import NetworkMonitor from '@/components/NetworkMonitor';
// import { useEffect } from "react";

//  import { userSearchProvider } from '@/providers/userSearchProvider';
// import { generalPostsProvider } from '@/providers/generalPostsProvider';

// export default function RootLayout({ children }: { children: React.ReactNode }) {

//     //  const searchProviders = [userSearchProvider, generalPostsProvider];
//      const searchProviders = [userSearchProvider];
    
//     const pathname = usePathname();
//     const isLogin = pathname === "/login";
    
//     useEffect(() => {
//         console.log('🔴 RootLayout mounted');
//         const handler = () => console.log('📍 pagehide event');
//         window.addEventListener('pagehide', handler);
//         return () => window.removeEventListener('pagehide', handler);
//     }, []);
    
//     return (
//         <html lang="en" suppressHydrationWarning>
         
      
//             <body className="bg-white select-none">
//                   <LoginModalProvider>
//                 <NetworkMonitor />

//                  {!isLogin ? <Header providers={searchProviders} /> : null}
                
//                 <div
//                     className="w-full flex overflow-hidden mx-auto"
//                     style={{
//                         height: !isLogin ? "calc(100vh - 83px)" : "100vh",
//                     }}           
//                     dir="rtl"
//                 >
//                     {
//                         !isLogin &&
//                         <div
//                             className="hidden md:block min-w-[300px] max-w-[330px] w-full pl-3 z-[999]"
//                             style={{ boxShadow: "rgb(0 0 0 / 9%) -2px 1px 10px 0px" }}
//                         >
 
//                            <SidebarArabic />
//                         </div>
//                     }

//                     <main className="flex-1 w-full">
//                         {children}
//                     </main>
                    
//                     {
//                         !isLogin &&
//                         <LayoutRightSideClient />
//                     }
                    
//                     <Toaster
//                         position="top-center"
//                         toastOptions={{
//                             duration: 3000,
//                             style: {
//                                 borderRadius: "12px",
//                                 background: "#111",
//                                 color: "#fff",
//                             },
//                         }}
//                     />
//                 </div>
//                           {/* {children} */}
// {/*  */}
//                         </LoginModalProvider>

//             </body>
//         </html>
//     );
// }


// ظظظظظظظظظظظظظظظظظظظظ

'use client';

import { LoginModalProvider } from "@/contexts/LoginModalContext";
// 1. استيراد الـ Provider والـ Hook الخاص بالترجمة
import { TranslationProvider, useTranslation } from "@/contexts/TranslationContext";

import "./globals.css";
import SidebarArabic from "./_components/SidebarArabic";
import Header from "@/components/GlobalSearch";
import LayoutRightSideClient from "@/components/LayoutConditionalClient";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import NetworkMonitor from '@/components/NetworkMonitor';
import { useEffect } from "react";

import { userSearchProvider } from '@/providers/userSearchProvider';
import { generalPostsProvider } from '@/providers/generalPostsProvider';

// مكون فرعي داخلي للتحكم بالـ Layout بناءً على لغة الـ Context الديناميكية
function LayoutContent({ children, isLogin, searchProviders }: { children: React.ReactNode, isLogin: boolean, searchProviders: any[] }) {
    // جلب اللغة الحالية من الـ Context لتغيير اتجاه الصفحة بالكامل تلقائياً
    const { language } = useTranslation();

    return (
        <div
            className="w-full flex overflow-hidden mx-auto"
            style={{
                height: !isLogin ? "calc(100vh - 83px)" : "100vh",
            }}           
            // يتغير الاتجاه تلقائياً بناءً على لغة الموقع الحالية
            dir={language === "ar" ? "rtl" : "ltr"}
        >
            {
                !isLogin &&
                <div
                    className="hidden md:block min-w-[300px] max-w-[330px] w-full pl-3 z-[999]"
                    style={{ boxShadow: "rgb(0 0 0 / 9%) -2px 1px 10px 0px" }}
                >
                    <SidebarArabic />
                </div>
            }

            <main className="flex-1 w-full">
                {children}
            </main>
            
            {
                !isLogin &&
                <LayoutRightSideClient />
            }
            
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
    );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const searchProviders = [userSearchProvider];
    const pathname = usePathname();
    const isLogin = pathname === "/login";
    
    useEffect(() => {
        console.log('🔴 RootLayout mounted');
        const handler = () => console.log('📍 pagehide event');
        window.addEventListener('pagehide', handler);
        return () => window.removeEventListener('pagehide', handler);
    }, []);
    
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="bg-white select-none">
                {/* 2. تغليف التطبيق بالكامل بـ TranslationProvider لتصل الكهرباء لكل الصفحات */}
                <TranslationProvider>
                    <LoginModalProvider>
                        <NetworkMonitor />

                        {!isLogin ? <Header providers={searchProviders} /> : null}
                        
                        {/* استدعاء المكون الداخلي الذي يتعامل مع لغة الـ Context */}
                        <LayoutContent isLogin={isLogin} searchProviders={searchProviders}>
                            {children}
                        </LayoutContent>

                    </LoginModalProvider>
                </TranslationProvider>
            </body>
        </html>
    );
}