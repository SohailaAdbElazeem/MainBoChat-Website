/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export type Post = {
  _id: string;
  username: string;
  name: string;
  userimg: string;
  userid: string;
  type: "image" | "text" | "video" | "question";
  content: string;
  image: { image: string; width?: string; height?: string }[] | null;
  video: any;
  createdAt: string;
  likes: any[];
  comments: any[];
  liked?: number;
  commented?: number;
  vip?: boolean;
  shares?: any[];
  shareCount?: number;
};

function parseDateFlexible(dateStr?: string | null): Date | null {
  if (!dateStr) return null;
  const s = String(dateStr).trim();
  if (!s || s.toLowerCase().includes("invalid")) return null;
  if (/^\d+$/.test(s)) {
    const d = new Date(Number(s));
    if (!isNaN(d.getTime())) return d;
  }
  const d = new Date(s.replace(" ", "T"));
  if (!isNaN(d.getTime())) return d;
  return null;
}

export function timeAgoAr(dateStr?: string) {
  const d = parseDateFlexible(dateStr);
  if (!d) return "منذ لحظات";
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diffSec < 60) return "منذ لحظات";
  const mins = Math.floor(diffSec / 60);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 60) return `منذ ${mins} دقيقة`;
  if (hours < 24) return `منذ ${hours} ساعة`;
  if (days < 30) return `منذ ${days} يوم`;
  return `منذ ${Math.floor(days / 30)} شهر`;
}

export default function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(
    Array.isArray(post.likes) ? post.likes.length : 0
  );
   

  const [expanded, setExpanded] = useState(false);
  const [isLongText, setIsLongText] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  const commentCount = Array.isArray(post.comments) ? post.comments.length : 0;
  const sharesCount =
    (Array.isArray(post.shares) && post.shares.length) ||
    (typeof post.shareCount === "number" && post.shareCount) ||
    0;

  const userName = post?.name || "مستخدم";
  const userHandle = (post?.username || "").toString().replaceAll(" ", "");

  const firstImage =
    Array.isArray(post.image) && post.image.length > 0 ? post.image[0] : null;

  const imgW = firstImage?.width ? Number(firstImage.width) : 1080;
  const imgH = firstImage?.height ? Number(firstImage.height) : 1350;
  const isQuestion = post.type === "question";

  const shouldShowImage = !!firstImage?.image;

  const validImage =
    firstImage?.image &&
    (firstImage.image.startsWith("http") || firstImage.image.startsWith("/"));

  const likerAvatars: string[] = Array.isArray(post.likes)
    ? Array.from(
        new Set(
          post.likes
            .map((l: any) => (typeof l?.userimg === "string" ? l.userimg : ""))
            .filter(Boolean)
        )
      ).slice(0, 5)
    : [];

  const cardClass = isQuestion
  ? "rounded-[26px] max-w-[400px] bg-gradient-to-b from-[#EAE8E8] to-[#fff] border border-[#D72229] bg-white"
  : "rounded-[26px] max-w-[400px] text-right bg-gradient-to-b from-[#EAE8E8] to-[#fff]";

  const textInnerBorder =
    post.type === "question"
      ? " shadow-[inset_0_0_0_1px_#D72229]"
      : "";

  const handleLike = async () => {
    try {
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (err) {
      setLiked((prev) => !prev);
    }
  };

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      const computed = window.getComputedStyle(el);
      const lineHeight = parseFloat(computed.lineHeight);
      const height = el.scrollHeight;
      const visibleHeight = lineHeight * 3;
      setIsLongText(height > visibleHeight + 2);
    }
  }, [post.content]);

  return (
    <article dir="rtl" className={cardClass + textInnerBorder}>
      <header className="p-4 flex items-start gap-3">
        <div className="relative h-[50px] w-[50px] shrink-0 overflow-hidden rounded-[21px]">
          <Image
            src={post.userimg || "/imgs/user.png"}
            alt={userName}
            fill
            sizes="50px"
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{userName}</span>
            <span className="text-sm text-black/50">@{userHandle}</span>
            {post.vip && (
              <span className="ml-1 inline-block rounded-full border border-yellow-500 px-2 text-[10px] text-yellow-600">
                VIP
              </span>
            )}
          </div>
          <div className="text-xs text-black/50">
            {timeAgoAr(post.createdAt || new Date().toISOString())}
          </div>
        </div>
      </header>

      {post.content ? (
        <div className="px-4">
          <p
            ref={textRef}
            className={`leading-7 text-black/90 whitespace-pre-wrap break-words transition-all duration-300 ${
              expanded ? "" : "line-clamp-3 overflow-hidden"
            }`}
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: expanded ? "unset" : "3",
            }}
          >
            {post.content}
          </p>

          {isLongText && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[#D72229] text-sm mt-1 mb-2"
            >
              {expanded ? "إخفاء" : "المزيد"}
            </button>
          )}
        </div>
      ) : null}


      {shouldShowImage && validImage ? (
        <div className="max-h-[350px] flex items-center justify-center overflow-hidden bg-black/5">
          <img
            src={firstImage!.image}
            alt="post image"
            width={imgW}
            height={imgH}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        ""
      )}
      {isQuestion && (
        <>
          <div className="flex items-center px-5 gap-4">
            <p className="text-[#B4B4B9]">{commentCount} اجابه</p>
            <p className="text-[#B4B4B9]">{likeCount} اعجاب</p>
          </div>
          <div className="w-full border-t-2 border-[#D72229] mt-3"></div>
        </>
      )}
      <footer className="flex items-center justify-between p-2">
          {isQuestion? (
            <div className="flex justify-center items-center w-full gap-3">
              <button
                disabled
                className="flex items-center px-[45px] text-center gap-2 bg-[#F2F2F2] text-[#B5B5B5]  py-2 rounded-xl cursor-default select-none"
                >
                أضف إجابة
              </button>
              <div className="bg-[#F2F2F2] p-2 rounded-[12px] flex items-center justify-center">
                <img src="/icons/like.svg" className="opacity-50" />
              </div>
            </div>

          )
        :
        <><div className="flex items-center">

            {likerAvatars.length > 0 ? (
              <div className="flex items-center">
                {likerAvatars.map((src, idx) => (
                  <div
                    key={src + idx}
                    className="relative h-7 w-7 rounded-[12px] ring-2 ring-white overflow-hidden"
                    style={{ marginInlineStart: idx === 0 ? 0 : -8 }}
                  >
                    <img
                      src={src}
                      alt="user like"
                      className="h-full w-full object-cover"
                      loading="lazy" />
                  </div>
                ))}
                {likeCount > likerAvatars.length && (
                  <span className="me-3 text-xs text-black/60">
                    +{likeCount - likerAvatars.length}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs text-black/50">لا إعجابات بعد</span>
            )}
          </div>
          <div className="flex items-center justify-center gap-4 text-sm text-black/70" dir="ltr">
              <button
                onClick={handleLike}
                className="inline-flex items-center gap-1 cursor-pointer transition"
                style={{
                  color: liked ? "#D72229" : "inherit",
                }}
              >
                <LikeIcon active={liked} />
              </button>

              <span className="inline-flex items-center gap-1">
                <ReplyIcon />
                {commentCount}
              </span>

              <span className="inline-flex items-center gap-1">
                <ShareIcon />
                {sharesCount}
              </span>
            </div></>
        }

      </footer>
    </article>
  );
}

function LikeIcon({ active = false }: { active?: boolean }) {
  return (
    <img
      src="/icons/like.svg"
      alt=""
      style={{
        filter: active
          ? "invert(27%) sepia(88%) saturate(2997%) hue-rotate(342deg) brightness(91%) contrast(96%)"
          : "none",
      }}
    />
  );
}
function ReplyIcon() {
  return <img src="/icons/comment.svg" alt="" />;
}
function ShareIcon() {
  return <img src="/icons/share.svg" alt="" />;
}
