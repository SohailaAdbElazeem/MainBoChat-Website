 /* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { useTranslation } from "@/contexts/TranslationContext";

type Props = {
  followingId: string;
  serverFollowerIds?: string[];
  requestedFollow?: boolean;
};

// قاموس الترجمة لحالات الزر
const translations = {
  ar: {
    following: "إلغاء",
    requested: "إلغاء الإرسال",
    follow: "متابعة",
    loading: "..."
  },
  en: {
    following: "Unfollow",
    requested: "Cancel Request",
    follow: "Follow",
    loading: "..."
  }
};

export default function FollowButton({
  followingId,
  serverFollowerIds = [],
  requestedFollow = false,
}: Props) {
  const { language } = useTranslation();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isRequested, setIsRequested] = useState<boolean>(Boolean(requestedFollow));
  const [loading, setLoading] = useState<boolean>(false);
  const [followerId, setFollowerId] = useState<string | null>(null);

  const AUTH_TOKEN = localStorage.getItem("accessToken") || localStorage.getItem("token") || "";

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const myId = localStorage.getItem("userid") || localStorage.getItem("followerId") || userData._id;
    setFollowerId(myId);

    const persistedFollowing = localStorage.getItem(`isFollowing_${followingId}`);
    const persistedRequested = localStorage.getItem(`isRequested_${followingId}`);

    const normalizedMyId = myId ? String(myId).trim() : null;
    const normalizedServerIds = (serverFollowerIds || []).map((s: any) => String(s).trim());

    if (normalizedMyId && normalizedServerIds.includes(normalizedMyId)) {
      setIsFollowing(true);
      setIsRequested(false);
      localStorage.setItem(`isFollowing_${followingId}`, "true");
      localStorage.removeItem(`isRequested_${followingId}`);
      return;
    }

    if (requestedFollow) {
      setIsFollowing(false);
      setIsRequested(true);
      localStorage.setItem(`isRequested_${followingId}`, "true");
      localStorage.setItem(`isFollowing_${followingId}`, "false");
      return;
    }

    setIsFollowing(persistedFollowing === "true");
    setIsRequested(persistedRequested === "true");
  }, [serverFollowerIds, requestedFollow, followingId]);

  async function toggleFollow() {
    if (!followerId) {
      alert(language === 'ar' ? "لم يتم العثور على معرف المستخدم." : "User ID not found.");
      return;
    }
    if (loading) return;

    setLoading(true);
    const prevFollowing = isFollowing;
    const prevRequested = isRequested;

    if (isFollowing) {
      setIsFollowing(false);
      setIsRequested(false);
    } else if (isRequested) {
      setIsRequested(false);
    } else {
      setIsRequested(true);
    }

    try {
      const body = { followerid: followerId, followingid: followingId };
      const endpoints = ["https://bo-chat.space/follow", "http://bo-chat.space/follow"];

      let finalRes: Response | null = null;
      for (const url of endpoints) {
        try {
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: "Bearer " + AUTH_TOKEN },
            body: JSON.stringify(body),
          });
          if (res) { finalRes = res; break; }
        } catch (e) {}
      }

      if (!finalRes) throw new Error("No response");
      // ... (باقي منطق معالجة الـ response كما هو في كودك الأصلي)
      
    } catch (err) {
      console.error(err);
      setIsFollowing(prevFollowing);
      setIsRequested(prevRequested);
      alert(language === 'ar' ? "حدث خطأ. حاول مرة أخرى." : "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // تحديد النص بناءً على اللغة والحالة
  const t = translations[language];
  const label = loading ? t.loading : isFollowing ? t.following : isRequested ? t.requested : t.follow;

  return (
    <button
      onClick={toggleFollow}
      disabled={loading}
      className={`block py-2 rounded-[17px] min-w-[120px] px-4 mt-4 transition-all duration-150 ${
        isFollowing || isRequested 
          ? "text-[#D72229] border border-[#D72229]" 
          : "bg-[#D72229] text-white"
      } ${loading ? "opacity-60 pointer-events-none" : "cursor-pointer"}`}
    >
      {label}
    </button>
  );
}