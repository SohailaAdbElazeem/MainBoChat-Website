/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";

type Props = {
  followingId: string; // id of the profile we're viewing (the target)
  serverFollowerIds?: string[]; // mapped follower ids from server
  requestedFollow?: boolean; // whether we already requested follow (from server response)
};

export default function FollowButton({
  followingId,
  serverFollowerIds = [],
  requestedFollow = false,
}: Props) {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isRequested, setIsRequested] = useState<boolean>(Boolean(requestedFollow));
  const [loading, setLoading] = useState<boolean>(false);
  const [followerId, setFollowerId] = useState<string | null>(null);

  // لو عندك توكن فعلي استخدمه هنا (أو استخدم auth flow حق المشروع)
  const AUTH_TOKEN =  localStorage.getItem("accessToken") || localStorage.getItem("token") || "";

  // Sync initial state from props / localStorage / server list
  useEffect(() => {
    const userData = JSON.parse(
  localStorage.getItem("userData") || "{}"
);

const myId =
  localStorage.getItem("userid") ||
  localStorage.getItem("followerId") ||
  userData._id;
    // const myId =
    //   typeof window !== "undefined"
    //     ? localStorage.getItem("userid") || localStorage.getItem("followerId")
    //     : null;

    setFollowerId(myId);

    // persisted fallback
    const persistedFollowing = localStorage.getItem(`isFollowing_${followingId}`);
    const persistedRequested = localStorage.getItem(`isRequested_${followingId}`);

    // normalize ids for comparison
    const normalizedMyId = myId ? String(myId).trim() : null;
    const normalizedServerIds = (serverFollowerIds || []).map((s: any) =>
      String(s).trim()
    );

    // If server indicates we're a follower -> following (highest priority)
    if (normalizedMyId && normalizedServerIds.includes(normalizedMyId)) {
      setIsFollowing(true);
      setIsRequested(false);
      localStorage.setItem(`isFollowing_${followingId}`, "true");
      localStorage.removeItem(`isRequested_${followingId}`);
      return;
    }

    // If server says there's a pending request -> requested (2nd priority)
    if (requestedFollow) {
      setIsFollowing(false);
      setIsRequested(true);
      localStorage.setItem(`isRequested_${followingId}`, "true");
      localStorage.setItem(`isFollowing_${followingId}`, "false");
      return;
    }

    // Otherwise fall back to persisted values (if any)
    setIsFollowing(persistedFollowing === "true");
    setIsRequested(persistedRequested === "true");
  }, [serverFollowerIds, requestedFollow, followingId]);

  async function toggleFollow() {
    if (!followerId) {
      alert("لم يتم العثور على معرف المستخدم في التخزين المحلي. تأكد من تسجيل الدخول.");
      return;
    }
    if (loading) return;

    setLoading(true);

    // احتفظ بالحالة الحالية للـ rollback في حال فشل الطلب
    const prevFollowing = isFollowing;
    const prevRequested = isRequested;

    // Apply optimistic change:
    // priority: following > requested > none
    if (isFollowing) {
      // currently following -> optimistic: will be unfollowed
      setIsFollowing(false);
      setIsRequested(false);
    } else if (isRequested) {
      // currently requested -> optimistic: cancel request
      setIsRequested(false);
    } else {
      // currently none -> optimistic: request follow (for private) / maybe follow (for public)
      setIsRequested(true);
    }

    try {
      const body = {
        followerid: followerId,
        followingid: followingId,
      };

      const endpoints = ["https://bo-chat.space/follow", "http://bo-chat.space/follow"];

      let finalRes: Response | null = null;
      for (const url of endpoints) {
        try {
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + AUTH_TOKEN,
            },
            body: JSON.stringify(body),
          });
          if (res) {
            finalRes = res;
            break;
          }
        } catch (e) {
          // try next endpoint
        }
      }

      if (!finalRes) throw new Error("No response from follow endpoint");

      // read response (json or text)
      let data: any;
      try {
        data = await finalRes.json();
      } catch {
        data = await finalRes.text();
      }

      console.log("FOLLOW RESPONSE:", finalRes.status, data);

      // Interpret server response into final flags
      let finalIsFollowing: boolean | null = null;
      let finalIsRequested: boolean | null = null;

      if (typeof data === "object" && data !== null) {
        if (typeof data.case === "string") {
          if (data.case === "follow") {
            finalIsFollowing = true;
            finalIsRequested = false;
          }

          if (data.case === "unfollow") {
            finalIsFollowing = false;
            finalIsRequested = false;
          }

          if (data.case === "request") {
            finalIsFollowing = false;
            finalIsRequested = true;
          }

          if (data.case === "cancel") {
            finalIsFollowing = false;
            finalIsRequested = false;
          }
        }


        if (typeof data.requestedFollow === "boolean") {
          finalIsRequested = data.requestedFollow;
          if (data.requestedFollow) finalIsFollowing = false;
        }
        if (typeof data.following === "boolean") finalIsFollowing = data.following;
        if (typeof data.isFollowing === "boolean") finalIsFollowing = data.isFollowing;

        if (typeof data.action === "string") {
          const a = data.action.toLowerCase();
          if (a.includes("follow")) finalIsFollowing = true;
          if (a.includes("unfollow")) finalIsFollowing = false;
          if (a.includes("request")) finalIsRequested = true;
          if (a.includes("cancel")) finalIsRequested = false;
        }

        if (typeof data.result === "string") {
          const r = data.result.toLowerCase();
          if (r.includes("follow")) finalIsFollowing = true;
          if (r.includes("unfollow")) finalIsFollowing = false;
          if (r.includes("requested")) finalIsRequested = true;
        }
      } else if (typeof data === "string") {
        const txt = data.toLowerCase();
        if (txt.includes("follow")) finalIsFollowing = true;
        if (txt.includes("unfollow")) finalIsFollowing = false;
        if (txt.includes("request")) finalIsRequested = true;
        if (txt.includes("cancel")) finalIsRequested = false;
      }

      if (finalIsFollowing !== null) {
        setIsFollowing(finalIsFollowing);
        localStorage.setItem(`isFollowing_${followingId}`, String(finalIsFollowing));
        if (finalIsFollowing) {
          setIsRequested(false);
          localStorage.removeItem(`isRequested_${followingId}`);
        }
      }

      if (finalIsRequested !== null) {
        setIsRequested(finalIsRequested);
        localStorage.setItem(`isRequested_${followingId}`, String(finalIsRequested));
        if (finalIsRequested) {
          setIsFollowing(false);
          localStorage.setItem(`isFollowing_${followingId}`, "false");
        }
      }

      // If server didn't return explicit info, keep optimistic state but persist it reliably
      if (finalIsFollowing === null && finalIsRequested === null) {
        localStorage.setItem(`isFollowing_${followingId}`, String(isFollowing));
        localStorage.setItem(`isRequested_${followingId}`, String(isRequested));
      }
    } catch (err) {
      console.error("Follow toggle error:", err);
      // rollback optimistic changes
      setIsFollowing(prevFollowing);
      setIsRequested(prevRequested);
      alert("حدث خطأ أثناء معالجة الطلب. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  // button label priority: loading > following > requested > follow
  const label = loading ? "..." : isFollowing ? "إلغاء" : isRequested ? "إلغاء الارسال" : "متابعة";

  return (
    <button
      onClick={toggleFollow}
      disabled={loading}
      className={`block py-2 rounded-[17px] min-w-[120px] px-4 mt-4 transition-all duration-150 ${
        isFollowing || isRequested ? " text-[#D72229] border border-[#D72229]" : "bg-[#D72229] text-white"
      } ${loading ? "opacity-60 pointer-events-none" : "cursor-pointer"}`}
    >
      {label}
    </button>
  );
}
