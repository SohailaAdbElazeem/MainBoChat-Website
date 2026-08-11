// src/components/LayoutRightSideClient.tsx
"use client";

import ActiveUsersCarousel from "@/app/_components/ActiveUsers";
import ReelsFeed from "@/app/_components/ReelsFeed";
import SuggestionsPage from "@/app/suggestions/page"; 
import { usePathname } from "next/navigation";
import AllUsersGrid from "./AllUsersGrid";
import ChatListFromApi from "../app/chats/_components/ChatList";
// import ChatList from "../app/chats/_components/ChatList";  

import { useEffect, useState } from "react";
import { useTranslation } from "@/contexts/TranslationContext";
import { useTranslations } from "next-intl";  
import { useLocale } from "next-intl";     

export default function LayoutRightSideClient() {
   const t = useTranslations('LayoutRightSide');
  
   const locale = useLocale();
  
   const { language } = useTranslation();

  const pathname = usePathname();
  const isHome = pathname === "/";
  const isProfile = pathname.startsWith("/profile");
  const isVideos = pathname.startsWith("/videos"); 
  const [userId, setUserId] = useState<string | null>(null);

  const activeChatId = pathname.startsWith("/chats/")
    ? pathname.split("/chats/")[1]
    : null;

  useEffect(() => {
    const id = localStorage.getItem("userid");
    setUserId(id);
  }, []);

   const dir = locale === 'ar' ? 'rtl' : 'ltr';

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
            <h1 dir={dir} className="mb-2 text-2xl">
              {t('reels')}
            </h1>
            <ReelsFeed />
          </div>
        </>
      )}
      
      {isVideos && (
        <div className="px-2">
          <h1 dir={dir} className="mb-2 text-2xl">
            {t('suggestions')}
          </h1>
          <SuggestionsPage />
        </div>
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

      {/* {pathname.startsWith("/chats") && (
  <div className="">
    <ChatList
      userId={userId}
      apiBase="https://bo-chat.space"
      activeChatId={activeChatId}
    />
  </div>
)} */}
    </aside>
  );
}