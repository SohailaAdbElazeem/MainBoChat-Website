'use client';
// import type { Metadata } from "next";
import "./globals.css";
import SidebarArabic from "./_components/SidebarArabic";
import Header from "@/components/GlobalSearch";
import LayoutRightSideClient from "@/components/LayoutConditionalClient";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import AuthGuard from "@/components/AuthGuard";

// export const metadata: Metadata = {
//   title: "Bo Chat",
//   description: "First Arabic Social Media Application",
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();
  const isLogin = pathname === "/login";
  return (
    <html lang="en">
      <body className="bg-white">
<AuthGuard/>
      {!isLogin ? <Header providers={[]} />: null}
        <div
          className="w-full flex overflow-hidden mx-auto"
          style={{
            height: !isLogin ? "calc(100vh - 83px)" : "100vh",
          }}           
          dir="rtl"
        >

          {/* ✔ Sidebar ثابت في كل الصفحات */}
          {
            !isLogin &&
                      <div
            className="
              hidden 
              md:block 
              min-w-[300px] 
              max-w-[330px]
              w-full
              pl-3
              z-[999]
            "
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
      </body>
    </html>
  );
}



 