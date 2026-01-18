"use client";
import React, { useEffect, useState } from "react";
import ActionMenu from "./ActionMenu";
import FollowButton from "./FollowButton";
import BlockConfirmModal from "./BlockConfirmModal";
import { useRouter } from "next/navigation";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2ODc3ZDU0OTdiMDRhM2M4Mzc1OWYxMjIiLCJyb2xlIjpbImRlbGV0ZSIsInJlcG9ydCIsInB1Ymxpc2giLCJhZGQiLCJibG9ja2VkQ29udGVudCIsImJsb2NrIiwidmVyaWZ5IiwiYWNjZXB0Iiwid2F0Y2giXSwiaWF0IjoxNzY2MTg2MjE4LCJleHAiOjE3NjY3OTEwMTh9.WZvvYjlN9BlQvqtmlkdDTgjj7JCXuLXDpeplPtvD0Oo"

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
  const [mounted, setMounted] = useState(false);
  const [showBlock, setShowBlock] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const id =
      localStorage.getItem("userid") ||
      localStorage.getItem("followerId");
    setMyId(id);
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (myId && followingId === myId) return null;

const handleBlock = async () => {
  try {
    setLoading(true);

    const res = await fetch("/api/block", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        blockedid: receiverId,
      }),
    });

    if (!res.ok) {
      throw new Error("Block failed");
    }

    setShowBlock(false);
  } catch (e) {
    console.error(e);
  } finally {
    setLoading(false);
  }
};



  return (
    <>
      <div className="flex gap-1 items-center">
        <ActionMenu
          onBlock={() => setShowBlock(true)}
        />

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
