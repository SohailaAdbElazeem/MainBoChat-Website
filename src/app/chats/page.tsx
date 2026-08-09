 
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function ChatsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full pb-15">
      <img src="/icons/globe.svg" alt="" />
      <div className="mt-4 text-[35px]">ابدأ الدردشة الآن</div>
      <p className="text-[20px]">تواصل مع أصدقائك على بوشات</p>
    </div>
  );
}