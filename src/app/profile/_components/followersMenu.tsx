/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/contexts/TranslationContext";

type FollowerRaw = any;
type Props = {
  followers: FollowerRaw[];
  title?: string;
  limit?: number;
};

// قاموس الترجمة
const translations = {
  ar: {
    title: "اطلع الآن على جميع المتابعين",
    allFollowers: "جميع المتابعين",
    noFollowers: "لا يوجد متابعون",
    user: "مستخدم",
    close: "إغلاق"
  },
  en: {
    title: "View all followers",
    allFollowers: "All Followers",
    noFollowers: "No followers yet",
    user: "User",
    close: "Close"
  }
};

function extractFollowerInfo(item: FollowerRaw) {
  if (!item) return { id: "", name: "", username: "", img: "" };
  const id = (item.followerid ?? item.followingid ?? item._id ?? (item.followerdata?._id) ?? (item.followingdata?._id) ?? "");
  const data = item.followerdata ?? item.followingdata ?? item;
  return {
    id,
    name: data?.name ?? data?.username ?? "",
    username: data?.username ?? "",
    img: data?.img ?? data?.image ?? ""
  };
}

export default function FollowersMenu({
  followers,
  title: propTitle, // نستخدم القيمة القادمة من الـ props إذا وجدت
  limit = 3,
}: Props) {
  const router = useRouter();
  const { language } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const t = translations[language];
  const title = propTitle || t.title;

  const list = Array.isArray(followers) ? followers : [];
  const mapped = list.map(extractFollowerInfo).filter((f) => f.id || f.name);
  const visible = mapped.slice(0, limit);

  const defaultAvatar = "/mnt/data/e972d4a5-ff22-42db-a41c-3d343dd6fb0f.png";

  return (
    <>
       <div className={`flex items-center gap-1 ${language === 'en' ? 'flex-row justify-start' : 'flex-row justify-start'}`}>
        <div className={`flex items-center mt-1 ${language === 'en' ? 'pr-4' : 'pl-4'}`}>
          {visible.map((f, idx) => (
            <button
              key={f.id || idx}
              onClick={() => f.id && router.push(`/profile/${f.id}`)}
              className="relative w-[30px] h-[30px] rounded-[21px] border-[1px] border-white overflow-hidden cursor-pointer"
              style={{ zIndex: idx, marginLeft: language === 'ar' ? "-10px" : "0", marginRight: language === 'en' ? "-10px" : "0" }}
            >
              <Image src={f.img || defaultAvatar} alt="Avatar" width={30} height={30} className="object-cover w-full h-full" unoptimized />
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="text-[#D72229] underline text-[13px] leading-[165%] font-semibold cursor-pointer hover:opacity-80 transition"
        >
          {title}
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="bg-gradient-to-l from-[#fff] to-[#f0f0f0] p-4 flex justify-between items-center">
              <h3 className="text-lg font-bold">{t.allFollowers}</h3>
              {/* <button onClick={() => setIsModalOpen(false)}>{t.close}</button> */}
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {mapped.length === 0 ? (
                <p className="text-center text-gray-500 py-8">{t.noFollowers}</p>
              ) : (
                mapped.map((f) => (
                  <div key={f.id || Math.random()} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition cursor-pointer" onClick={() => router.push(`/profile/${f.id}`)}>
                    <img className="w-12 h-12 rounded-full object-cover" src={f.img || defaultAvatar} alt="Avatar" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{f.name || t.user}</p>
                      {f.username && <p className="text-sm text-gray-500 truncate">@{f.username}</p>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
