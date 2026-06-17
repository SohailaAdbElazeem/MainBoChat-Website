/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/_components/FollowersMenu.tsx
"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type FollowerRaw = any;

type Props = {
  followers: FollowerRaw[]; // array from API (followers or following)
  title?: string; // العنوان الظاهر أعلى الصور
  limit?: number; // عدد الصور الظاهرين في السطر (باقي يعرض +n)
};

function extractFollowerInfo(item: FollowerRaw) {
  if (!item) return { id: "", name: "", username: "", img: "" };

  const id =
    (item.followerid as string) ??
    (item.followingid as string) ??
    (item._id as string) ??
    (item.followerdata && item.followerdata._id) ??
    (item.followingdata && item.followingdata._id) ??
    "";

  const data = item.followerdata ?? item.followingdata ?? item;

  const name = (data && (data.name ?? data.username ?? "")) || "";
  const username = (data && (data.username ?? "")) || "";
  const img = (data && (data.img ?? data.image ?? "")) || "";

  return { id, name, username, img };
}

export default function FollowersMenu({
  followers,
  title = "اطلع الان علي جميع المتابعين",
  limit = 3,
}: Props) {
  const router = useRouter();
  const list = Array.isArray(followers) ? followers : [];
  const mapped = list.map(extractFollowerInfo).filter((f) => f.id || f.name);
  const visible = mapped.slice(0, limit);
  const extraCount = Math.max(0, mapped.length - visible.length);

  // local file you uploaded (use this exact local path)
  const defaultAvatar = "/mnt/data/e972d4a5-ff22-42db-a41c-3d343dd6fb0f.png";

  const handleOpenProfile = (id: string) => {
    // navigate to the profile page client-side
    // adjust path if your profile route is different
    router.push(`/profile/${id}`);
  };

  return (
    <div className="flex items-center gap-1">
        <div className="flex items-center pl-4 mt-1">
{visible.map((f, idx) => (
  <button
    key={f.id || idx}
    onClick={() => f.id && handleOpenProfile(f.id)}
    title={f.name || f.username || "متابع"}
    className="relative w-[30px] h-[30px] rounded-[21px] border-[1px] border-white overflow-hidden cursor-pointer"
    style={{
      zIndex: idx,
      marginLeft: "-10px",
    }}
    aria-label={`فتح الملف الشخصي لـ ${f.name || f.username || "متابع"}`}
  >
    <Image
      src={f.img || defaultAvatar}
      alt={f.name || f.username || "Avatar"}
      width={30}
      height={30}
      className="object-cover w-full h-full"
      unoptimized
    />
  </button>
))}
           

            {/* {extraCount > 0 && (
            <div
                className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200 text-sm font-medium text-gray-700 border-2 border-white"
                style={{ marginRight: 2 }}
            >
                +{extraCount}
            </div>
            )} */}
        </div>
        <div className="text-right">
  <div className="text-[#D72229] underline text-[13px] leading-[165%] font-semibold font-cairo">
    {title}
  </div>
</div>
    </div>
  );
}

