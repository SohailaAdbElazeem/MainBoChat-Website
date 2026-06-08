 "use client";
import React, { useEffect, useState } from "react";
import ActionMenu from "./ActionMenu";
import FollowButton from "./FollowButton";
import BlockConfirmModal from "./BlockConfirmModal";
import { useRouter } from "next/navigation";

export default function ActionAreaClient({
  followingId,
  receiverId,
  username,
  serverFollowerIds = [],
}: {
  username: string;
  followingId: string;
  receiverId: string;
  serverFollowerIds?: string[];
}) {
  const [myId, setMyId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showBlock, setShowBlock] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // قراءة التوكن من localStorage
    const accessToken = localStorage.getItem("accessToken");
    // قراءة userData وتحليلها للحصول على _id
    const userDataStr = localStorage.getItem("userData");
    let userId = null;
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        userId = userData._id || null;
      } catch (e) {
        console.error("Failed to parse userData", e);
      }
    }
    setToken(accessToken);
    setMyId(userId);
    setMounted(true);
  }, []);

  if (!mounted) return null;
  // منع عرض الأزرار إذا كان المستخدم يشاهد صفحته الخاصة
  if (myId && followingId === myId) return null;

  const handleBlock = async () => {
    if (!token || !myId) {
      console.error("Missing token or user id");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        `https://bo-chat.space/block${myId}`, // تأكد من صحة الـ endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            blockedid: receiverId,
          }),
        }
      );

      if (!res.ok) {
        console.error("Failed to block user", await res.text());
        return;
      }
      console.log("User blocked successfully", await res.json());
      setShowBlock(false);
      router.refresh();
    } catch (err) {
      console.error("BLOCK ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex gap-1 items-center">
        <ActionMenu onBlock={() => setShowBlock(true)} />

        <button
          onClick={() => router.push(`/chats/${receiverId}`)}
          className="block py-2 rounded-[17px] min-w-[100px] px-5 bg-[#EBEBEB] cursor-pointer text-[#D72229] mt-4"
        >
          ارسال رسالة
        </button>

        <FollowButton
          followingId={followingId}
          serverFollowerIds={serverFollowerIds}
        />
      </div>

      <BlockConfirmModal
        open={showBlock}
        username={username}
        loading={loading}
        onCancel={() => setShowBlock(false)}
        onConfirm={handleBlock}
      />
    </>
  );
}