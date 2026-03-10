/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/profile/[id]/page.tsx
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import PostsFeed from "@/app/_components/PostsFeed";
import ActionAreaClient from "../_components/ActionAreaClient";
import FollowersMenu from "../_components/followersMenu";
import ClientVisibilityGate from "../_components/ProfileGateClient";
import { UserAPIResponse } from "@/types/types";
import GlobalLoader from "@/components/GlobalLoader";

// const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2ODc3ZDU0OTdiMDRhM2M4Mzc1OWYxMjIiLCJyb2xlIjpbImRlbGV0ZSIsInJlcG9ydCIsInB1Ymxpc2giLCJhZGQiLCJibG9ja2VkQ29udGVudCIsImJsb2NrIiwidmVyaWZ5IiwiYWNjZXB0Iiwid2F0Y2giXSwiaWF0IjoxNzY3NzI1Njg2LCJleHAiOjE3NjgzMzA0ODZ9.7_vbY4ifpv13s2aj2Du3za-YonHDg9k_DreaQesqVJs";

function safeCount<T>(val?: T[] | Record<string, unknown> | number | null) {
  if (val == null) return 0;
  if (typeof val === "number") return val;
  if (Array.isArray(val)) return val.length;
  if (typeof val === "object") return Object.keys(val).length;
  return 0;
}

export default function ProfilePageClient() {
  const params = useParams();
  const id = params && typeof params === "object" ? (params as any).id : undefined;

  const [data, setData] = useState<UserAPIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRateOverlayOpen, setIsRateOverlayOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // ---------- حالات للـ overlay ونسخ الرابط ----------
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const closeOverlay = useCallback(() => setIsOverlayOpen(false), []);
  const openOverlay = useCallback(() => setIsOverlayOpen(true), []);

  const copyProfileLink = useCallback(async () => {
    if (!id) {
      setToast("معرّف المستخدم غير موجود.");
      setTimeout(() => setToast(null), 1800);
      return;
    }
    // لو في متصفح خالص استخدم origin الحالي وإلا استخدم localhost
    const origin = typeof window !== "undefined" && window.location?.origin ? window.location.origin : "http://localhost:3000";
    const profileUrl = `${origin}/profile/${id}`;

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(profileUrl);
      } else {
        // fallback بسيط
        const ta = document.createElement("textarea");
        ta.value = profileUrl;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setToast("تم نسخ الرابط إلى الحافظة");
      setTimeout(() => setToast(null), 1800);
    } catch (err) {
      console.error("copy error", err);
      setToast("فشل النسخ");
      setTimeout(() => setToast(null), 1800);
    }
  }, [id]);

  useEffect(() => {
    const TOKEN = localStorage.getItem("boChatToken") || "";
    if (!id) {
      setError("معرّف الملف الشخصي مفقود من الـ URL.");
      setLoading(false);
      return;
    }
    const ac = new AbortController();
    let mounted = true;
    
    async function fetchUser() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://bo-chat.space/users/${id}`, {
          headers: { Authorization: `Bearer ${TOKEN}`, Accept: "application/json" },
          cache: "no-store",
          signal: ac.signal,
        });
        if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
        const json = (await res.json()) as UserAPIResponse;
        if (mounted) {
          setData(json)
          console.log(json);
        };
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        console.error("fetchUser error:", err);
        if (mounted) setError("حدث خطأ أثناء جلب بيانات المستخدم.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchUser();
    return () => {
      mounted = false;
      ac.abort();
    };
  }, [id]);
    const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("boChatToken");
      const userid = localStorage.getItem("userid");
      const res = await fetch(`https://bo-chat.space/users/${userid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();

        setUserData(data);
      return;
    } catch (err) {
      console.error("FETCH USER DATA ERROR:", err);
      return null;
    }
  };
  // اغلاق الاوفلاي عند الضغط على Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeOverlay();
    }
    if (isOverlayOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOverlayOpen, closeOverlay]);
  useEffect(() => {
    if (id) {
      fetchUserData();
    }
  }, [id]);
  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center p-8">
        <GlobalLoader />
      </div>
    );
  }

  if (error || !data || !data.userpersonaldata) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center text-red-600">{error ?? "المستخدم غير موجود أو حدث خطأ."}</div>
      </div>
    );
  }

  const res = data;
  const user: any = res.userpersonaldata;
  const followers = Array.isArray(res.followers) ? res.followers : [];
  const following = Array.isArray(res.following) ? res.following : [];

  const followerIds: string[] = followers
    .map((f: any) =>
      typeof f === "string"
        ? f
        : f.followerid ?? f.followerId ?? f._id ?? (f.followerdata && f.followerdata._id) ?? ""
    )
    .filter(Boolean);

  const avatar = user.img || "/imgs/default-avatar.png";
  const postsCount = safeCount(res.posts);
  // console.log("postsCount", res);
  const followersCount = followers.length;
  const followingCount = following.length;
  const viewsCount = user.visit ?? 0;
  const rateCount = user.rate ?? 0;
    console.log("user rate", user.rate);

  return (
    <div className="min-h-screen bg-white text-gray-800" dir="rtl">
      <div className="px-5 py-1">
        <h1 className="text-xl font-semibold">{user.name}</h1>
        {user.private ? (
          <p className="text-xs text-gray-500">درج خاص</p>
        ) : res.posts?.length === 0 ? (
          <p className="text-xs text-gray-500">لا يوجد فضفضات</p>
        ) : (
          <div className="text-xs text-gray-500">{postsCount} فضفضه</div>
        )}
      </div>
      <div className="min-h-screen overflow-hidden">
        <div
          className="
            relative
            overflow-y-auto
            h-[calc(100vh-100px)]
            scrollbar-hidden
          "
        >
          {/* Banner */}
          <div className="relative">
            <div className="h-[167px] w-full" style={{ background: "linear-gradient(90deg,#fff0f0,#e65b5b 25%,#d23e3e 70%,#c62828)" }}>
              <div className="flex px-4 w-full items-end h-full flex-row gap-3">
                <ClientVisibilityGate
                  profileId={res.userpersonaldata._id}
                  profilePrivate={res.userpersonaldata.private}
                  fallback={
                    <div>
                      {/* OUTER WRAPPER */}
                      <div className="relative w-28 h-28 md:w-36 md:h-36 z-[99] transform translate-y-1/2">

                        {/* CARD (overflow-hidden هنا فقط) */}
                        <div className="relative w-full h-full rounded-t-[60px] rounded-b-[45px] border-2 border-white overflow-hidden">
                          <Image
                            src={avatar}
                            alt={user.name ?? "Avatar"}
                            width={140}
                            height={136}
                            unoptimized
                            className="object-cover w-full h-full"
                          />

                          {/* PRIVATE LAYER (مقصوصة) */}
                          <div
                            className="absolute bottom-0 left-0 w-full h-[42%]
                            backdrop-blur-md flex items-center justify-center text-white
                            bg-gradient-to-b from-[#D72229]/15 to-[#F92428]/75 z-10"
                          >
                            <p>درج خاص</p>
                          </div>
                        </div>

                        {user.vip && (
                          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                            <img
                              src="/icons/vip.svg"
                              alt="VIP"
                              className="w-6 h-6 md:w-8 md:h-8"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  }
                >
                  <button
                    aria-label="عرض الصورة"
                    onClick={openOverlay}
                    className="relative w-[136px] h-[136px] md:w-36 md:h-36
                    rounded-[60px] border-2 border-white overflow-hidden
                    bg-gray-100 transform translate-y-1/2 focus:outline-none z-[99]"
                  >
                    <Image
                      src={avatar}
                      alt={user.name ?? "Avatar"}
                      width={150}
                      height={150}
                      unoptimized
                      className="object-cover cursor-pointer w-full h-full"
                    />
                  </button>
                </ClientVisibilityGate>

                <div className="mb-2">
                  <h1 className="text-xl md:text-2xl font-semibold text-white">
                    {user.name}
                  </h1>
                  {user.username && (
                    <p className="text-sm text-white/90 mt-1">
                      @{user.username}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Main */}
          <div className="relative ">
            <div className="md:px-5 py-3 border-b border-[#F6F6f6]">
              <div className="flex flex-col gap-6">
                <div className="flex-1 text-right">
                  <div className="mr-[150px] flex justify-between">
                    <p className="text-sm text-[#B6B7B7] max-w-[280px]">{user.about || "أنا هنا لأتواصل وأكتشف عوالم جديدة مع أشخاص يشبهونني"}</p>
                    <div className="flex gap-1">{id ? <ActionAreaClient followingId={id} serverFollowerIds={followerIds} receiverId={user._id} username={user.name} /> : null}</div>
                  </div>

                  <div className="mt-7 ">
                    <div
                      onClick={setIsRateOverlayOpen.bind(null, true)}
                      className="cursor-pointer select-none"
                    >
                      {rateCount === 0 ? (
                        <p className="text-sm underline text-[#D72229]">
                          لم يحصل هذا الدرج علي اي تقييم
                        </p>
                      ) : (
                        <div className="m-0 text-sm font-semibold underline text-[#D72229]">
                          <span className="text-xs">حصل هذا الدرج علي</span> تقييم {rateCount} نجوم
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4 mt-1" >
                      <div className="flex gap-1 items-center justify-center"><div className="text-sm text-[#B6B7B7]">صحابي هنا</div><div className="text-md font-semmibold">{followersCount}</div></div>
                      <div className="flex gap-1 items-center justify-center"><h3 className="text-sm font-semibold text-[#B6B7B7]">متابعين</h3><div className="text-md font-semmibold">{followingCount}</div></div>
                      <div className="flex gap-1 items-center justify-center"><div className="text-sm text-[#B6B7B7]">مشاهدة</div><div className="text-md font-semmibold">{viewsCount}</div></div>
                    </div>

                    <ClientVisibilityGate profileId={res.userpersonaldata._id} profilePrivate={res.userpersonaldata.private}>
                      <FollowersMenu followers={res.followers ?? []} title="اطلع الان علي جميع المتابعين" limit={3} />
                    </ClientVisibilityGate>
                  </div>
                </div>
              </div>
            </div>

            <ClientVisibilityGate profileId={res.userpersonaldata._id} isPrivate={res.userpersonaldata.private} profilePrivate={res.userpersonaldata.private} fallback={<div className="flex items-center justiy-center flex-col text-center pt-3"><h3 className="text-xl">درج خاص</h3><p className="text-[#B6B7B7] max-w-[350px]">مرحبا هذا الدرج خاص الآن فقط من اقبل متابعتهم يمكنهم رؤية فضفضاتي</p></div>}>
              <PostsFeed />
            </ClientVisibilityGate>
          </div>
        </div>
      </div>

      {isOverlayOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed w-full h-full  inset-0 z-50 flex items-center justify-center  z-[9999] p-4"
        >
          <div onClick={closeOverlay} className="absolute inset-0 bg-black/95 " />
        
          <div className="relative z-60 max-w-[720px] w-full max-h-[90vh] rounded-2xl">
            {/* صورة كبيرة */}
            <div className="w-full flex justify-center items-center p-6">
              <Image src={avatar} alt={user.name ?? "Avatar"} width={600} height={600} unoptimized className="object-contain w-[500px] h-[500px]  rounded-[170px]" />
            </div>

            {/* <div className="absolute top-4 right-4 flex gap-2"> */}
              <button
                onClick={copyProfileLink}
                className="w-[200px] text-center py-3 cursor-pointer bg-white absolute bottom-[-70px] left-1/2 transform -translate-x-1/2  rounded-[17px] shadow-sm text-sm hover:bg-gray-50"
                aria-label="نسخ رابط الملف الشخصي"
              >
                شير الدرج
              </button>
              <button
                onClick={closeOverlay}
                aria-label="إغلاق"
                className="px-3 py-3 cursor-pointer absolute top-[-30px] left-1/2 transform -translate-x-1/2 rounded-full shadow-sm bg-[#FFFFFF]/15"
              >
                <img src="/icons/close.svg" alt="close" />
              </button>
            {/* </div> */}
          </div>
        </div>
      )}

      {/* Toast بسيط */}
      {toast && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-0 z-60 z-[999999]">
          <div className="bg-[#D72229] text-white text-sm px-4 py-2 rounded-lg shadow-md">
            {toast}
          </div>
        </div>
      )}

      {isRateOverlayOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        >
          {/* الخلفية */}
          <div
            onClick={setIsRateOverlayOpen.bind(null, false)}
            className="absolute inset-0 bg-[#000]/10 backdrop-blur-[20px] "
          />

          {/* الكارد */}
          <div className="relative w-[690px] z-10 bg-gradient-to-l from-[#fff] to-[#8D8D8D] backdrop-blur-[20px]  rounded-[25px] ">
            <div className="bg-[#fff]/25 backdrop-blur-[20px] rounded-t-[25px] px-5 py-3">
              <h3 className="text-[20px] font-semibold ">
                النجوم
              </h3>
            </div>

            {rateCount === 0 ? (
              <div className="h-[450px] flex flex-col items-center justify-center px-5 text-center">
                <img src="/icons/no-rate.svg" alt="no-rate" className="w-[65px] h-[65px] mb-3" />
                <h4 className="text-[25px] font-semibold">مافيش تقييمات لسه</h4>
                <p className="text-[16px]">
                 ماحدش قيّم لسه خليك أنت أول واحد يكسر الصمت
                </p>
              </div>
            ) : (
              <p className="text-md">
                هذا الدرج حاصل على  
                <span className="mx-1 font-semibold text-[#D72229]">
                  {rateCount}
                </span>
                نجوم ⭐
              </p>
            )}
            
              {
                <div className="
                  flex items-center gap-3
                  bg-[#fff]/50 backdrop-blur-xl
                  px-5
                  h-[100px]
                  rounded-b-[25px]
                ">
                  {/* Avatar */}
                  <div className="w-[42px] h-[42px] rounded-[25px] overflow-hidden shrink-0">
                    <img
                      src={userData?.userpersonaldata.img || "/imgs/user.png"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Input */}

                  <div className=" z-9 w-full flex rounded-[19px]" style={{background:"#0000001A"}}>
                    <input
                      placeholder="اكتب تقييمك هنا"
                      className="
                        flex-1
                        bg-transparent
                        outline-none
                        p-3
                      "
                    />
                    {/* Submit */}
                    <button
                      className="
                        bg-white
                        px-4
                        py-3
                        rounded-tl-[19px]
                        rounded-b-[19px]
                        text-[#D72229]
                        font-semibold
                        shrink-0
                        w-[135px]
                        cursor-pointer
                      "
                    >
                     تقييم  
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
      )}

    </div>
  );
}
