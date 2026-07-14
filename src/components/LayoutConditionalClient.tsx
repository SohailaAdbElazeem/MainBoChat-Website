// "use client";
// import ActiveUsersCarousel from "@/app/_components/ActiveUsers";
// import ReelsFeed from "@/app/_components/ReelsFeed";
// import { usePathname } from "next/navigation";
// import AllUsersGrid from "./AllUsersGrid";
// import ChatListFromApi from "../app/chats/_components/ChatList";
// import { useEffect, useState } from "react";
// export default function LayoutRightSideClient() {
//   const pathname = usePathname();
//   // الشروط
//   const isHome = pathname === "/";
//   const isProfile = pathname.startsWith("/profile");
//   const [userId, setUserId] = useState<string | null>(null);

  
//   const activeChatId = pathname.startsWith("/chats/")
//   ? pathname.split("/chats/")[1]
//   : null;


//     useEffect(() => {
//     const id = localStorage.getItem("userid");
//     setUserId(id);
//   }, []);
//   return (
//     <aside
//       className="
//         hidden 
//         xl:block 
//         min-w-[380px] 
//         max-w-[450px]
//         overflow-y-auto
//       "
//       style={{ boxShadow: "rgb(0 0 0 / 9%) 2px -1px 10px 0px" }}
//     >

//       {/* 🏠 محتوى الهوم */}
//       {isHome && (
//         <>
//           {/* <div className="mb-2 pr-2">
//             <ActiveUsersCarousel />
//           </div> */}

//           <div className="px-2">
//             <h1 dir="rtl" className="mb-2 text-2xl">الريلز</h1>
//             <ReelsFeed />
//           </div>
//         </>
//       )}

//       {/* 👤 صفحة بروفايل */}
//       {isProfile && (
//         <div className="">
//           <div>
//             <AllUsersGrid/>
//           </div>
//         </div>
//       )}
//       {/* ➕ تقدر تضيف شروط تانية هنا */}
//       {pathname.startsWith("/chats") && (
//         <div className="">
//              <ChatListFromApi
//                 userId={userId}
//                 apiBase="https://bo-chat.space"
//                 activeChatId={activeChatId}
//               />
//         </div>
//       )}
//     </aside>
//   );
// }

"use client";
import ActiveUsersCarousel from "@/app/_components/ActiveUsers";
import ReelsFeed from "@/app/_components/ReelsFeed";
import { usePathname } from "next/navigation";
import AllUsersGrid from "./AllUsersGrid";
import ChatListFromApi from "../app/chats/_components/ChatList";
import { useEffect, useState } from "react";
import { useTranslation } from "@/contexts/TranslationContext";

// تعريف الترجمات مع خاصية الاتجاه
const translations = {
  ar: {
    reels: "الريلز",
    dir: "rtl",
  },
  en: {
    reels: "Reels",
    dir: "ltr",
  },
};

export default function LayoutRightSideClient() {
  const { language } = useTranslation();
  const t = translations[language];

  const pathname = usePathname();
  const isHome = pathname === "/";
  const isProfile = pathname.startsWith("/profile");
  const [userId, setUserId] = useState<string | null>(null);

  const activeChatId = pathname.startsWith("/chats/")
    ? pathname.split("/chats/")[1]
    : null;

  useEffect(() => {
    const id = localStorage.getItem("userid");
    setUserId(id);
  }, []);

  return (
    <aside
      className="
        hidden 
        xl:block 
        min-w-[380px] 
        max-w-[450px]
        overflow-y-auto
      "
      style={{ boxShadow: "rgb(0 0 0 / 9%) 2px -1px 10px 0px" }}
    >
      {isHome && (
        <>
          <div className="px-2">
            {/* تغيير الاتجاه حسب اللغة */}
            <h1 dir={t.dir} className="mb-2 text-2xl">
              {t.reels}
            </h1>
            <ReelsFeed />
          </div>
        </>
      )}

      {isProfile && (
        <div className="">
          <div>
            <AllUsersGrid />
          </div>
        </div>
      )}

      {pathname.startsWith("/chats") && (
        <div className="">
          <ChatListFromApi
            userId={userId}
            apiBase="https://bo-chat.space"
            activeChatId={activeChatId}
          />
        </div>
      )}
    </aside>
  );
}