 
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function ChatsPage() {
    // console.log("🚀 صفحة /chats تم تحميلها");
  // const router = useRouter();
  // const { userId, token, loading } = useAuth();

  // useEffect(() => {
  //   if (loading) return;
  //   if (!userId || !token) {
  //      window.location.href="/login";
  //     return;
  //   }
  //   const lastId = localStorage.getItem("lastChatId");
  //   if (lastId) {
  //     console.log("Redirecting to last chat:", lastId);
  //      window.location.href=`/chats/${lastId}`;
  //     console.log("✅ صفحة /chats تم تحميلها");

  //   }
  // }, [loading, userId, token, router]);

  // if (loading) return <div className="p-4">جاري التحميل...</div>;

  return (
    <div className="flex flex-col items-center justify-center h-full pb-15">
      <img src="/icons/globe.svg" alt="" />
      <div className="mt-4 text-[35px]">ابدأ الدردشة الآن</div>
      <p className="text-[20px]">تواصل مع أصدقائك على بوشات</p>
    </div>
  );
}