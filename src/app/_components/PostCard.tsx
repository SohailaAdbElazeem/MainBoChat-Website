/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";

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

// ✅ دالة آمنة لتحليل التاريخ
function parseDateFlexible(dateStr?: string | null): Date | null {
  if (!dateStr) return null;
  const s = String(dateStr).trim();
  if (!s || s.toLowerCase().includes("invalid")) return null;

  // timestamp رقمي
  if (/^\d+$/.test(s)) {
    const d = new Date(Number(s));
    if (!isNaN(d.getTime())) return d;
  }

  // فورمات: YYYY-MM-DD HH:mm(:ss)?
  const m = s.match(
    /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/
  );
  if (m) {
    const [, Y, M, D, h, i, sec] = m;
    const iso = `${Y}-${M}-${D}T${h}:${i}:${sec ?? "00"}`;
    const d = new Date(iso);
    if (!isNaN(d.getTime())) return d;
  }

  // fallback: صيغة ISO أو أي حاجة المتصفح يفهمها
  const d = new Date(s.replace(" ", "T"));
  if (!isNaN(d.getTime())) return d;

  return null;
}

// ✅ دالة عرض الوقت بالعربية
export function timeAgoAr(dateStr?: string) {
  const d = parseDateFlexible(dateStr);
  if (!d) return "منذ لحظات";

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return "منذ لحظات";

  const mins = Math.floor(diffSec / 60);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (mins < 60) {
    if (mins === 1) return "منذ دقيقة";
    if (mins === 2) return "منذ دقيقتين";
    if (mins < 11) return `منذ ${mins} دقائق`;
    return `منذ ${mins} دقيقة`;
  }

  if (hours < 24) {
    if (hours === 1) return "منذ ساعة";
    if (hours === 2) return "منذ ساعتين";
    if (hours < 11) return `منذ ${hours} ساعات`;
    return `منذ ${hours} ساعة`;
  }

  if (days < 30) {
    if (days === 1) return "منذ يوم";
    if (days === 2) return "منذ يومين";
    if (days < 11) return `منذ ${days} أيام`;
    return `منذ ${days} يوم`;
  }

  if (months < 12) {
    if (months === 1) return "منذ شهر";
    if (months === 2) return "منذ شهرين";
    if (months < 11) return `منذ ${months} أشهر`;
    return `منذ ${months} شهر`;
  }

  if (years === 1) return "منذ سنة";
  if (years === 2) return "منذ سنتين";
  if (years < 11) return `منذ ${years} سنوات`;
  return `منذ ${years} سنة`;
}

// 🔎 استخراج لينك الفيديو
function extractVideoUrl(video: any): string | null {
  if (!video) return null;
  if (typeof video === "string") return video.trim() || null;
  if (Array.isArray(video)) {
    for (const v of video) {
      const u = extractVideoUrl(v);
      if (u) return u;
    }
    return null;
  }
  if (typeof video === "object") {
    const keys = ["video", "url", "src", "link", "file"];
    for (const k of keys) {
      const val = video?.[k];
      if (typeof val === "string" && val.trim()) return val.trim();
    }
  }
  return null;
}

export default function PostCard({ post }: { post: Post }) {
  const likeCount = Array.isArray(post.likes) ? post.likes.length : 0;
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

  const videoUrl = extractVideoUrl(post.video);
  const isMedia = post.type === "image" || post.type === "video" || Boolean(videoUrl);
  const shouldShowVideo = Boolean(videoUrl);
  const shouldShowImage = !shouldShowVideo && !!firstImage?.image;

  const likerAvatars: string[] = Array.isArray(post.likes)
    ? Array.from(
        new Set(
          post.likes
            .map((l: any) => (typeof l?.userimg === "string" ? l.userimg : ""))
            .filter(Boolean)
        )
      ).slice(0, 5)
    : [];

  const cardClass =
    "rounded-[26px] max-w-[400px] text-right bg-gradient-to-b from-[#EAE8E8] to-[#fff]";
  const textInnerBorder =
    post.type === "text" || post.type === "question"
      ? " shadow-[inset_0_0_0_1px_#D72229]"
      : "";

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
        <p className="min-h-[50px] px-4 leading-7 text-black/90 whitespace-pre-wrap break-words">
          {post.content}
        </p>
      ) : null}

      {shouldShowVideo ? (
        <div className=" flex items-center justify-center overflow-hidden bg-black/5">
          <video
            src={videoUrl!}
            controls
            muted
            playsInline
            preload="metadata"
            poster={firstImage?.image || undefined}
            className="w-full h-auto"
          />
        </div>
      ) : shouldShowImage ? (
        <div className="max-h-[350px] flex items-center justify-center overflow-hidden bg-black/5">
          <Image
            src={firstImage!.image}
            alt="post image"
            width={imgW}
            height={imgH}
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}

      {isMedia ? (
        <footer className="flex items-center justify-between p-2">
          <div className="flex items-center">
            {likerAvatars.length > 0 ? (
              <div className="flex items-center">
                {likerAvatars.map((src, idx) => (
                  <div
                    key={src + idx}
                    className="relative h-7 w-7 rounded-[12px] ring-2 ring-white overflow-hidden"
                    style={{ marginInlineStart: idx === 0 ? 0 : -8 }}
                    title="أعجب بهذا المنشور"
                    dir="ltr"
                  >
                    <img
                      src={src}
                      alt="user like"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
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

          <div className="flex items-center gap-4 text-sm text-black/70">
            <span className="inline-flex items-center gap-1">
              <LikeIcon />
              {likeCount}
            </span>
            <span className="inline-flex items-center gap-1">
              <ReplyIcon />
              {commentCount}
            </span>
            <span className="inline-flex items-center gap-1">
              <ShareIcon />
              {sharesCount}
            </span>
          </div>
        </footer>
      ) : (
        <>
          <div className="text-xs text-black/50 m-3">
            {commentCount} إجابة &nbsp;|&nbsp; {likeCount} إعجاب
          </div>
          <footer className="flex items-center justify-center p-4 border-t border-[#D72229] mt-3">
            <div className="flex items-center gap-1.5">
              <Action icon={<LikeIcon />} label="" />
              <div className="flex h-[38px] items-center justify-center rounded-[10px] w-[100px] px-3 py-1.5 text-sm text-[#B4B4B9] bg-[#EFEFEF]">
                <p>أضف إجابة</p>
              </div>
            </div>
          </footer>
        </>
      )}
    </article>
  );
}

function Action({ icon, label }: { icon: JSX.Element; label: string }) {
  return (
    <button className="inline-flex items-center rounded-[10px] h-[38px] px-3 py-1.5 text-sm text-black/70 bg-[#EFEFEF]" type="button">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full">
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}

function LikeIcon() {
  return <img src="/icons/like.svg" alt="" />;
}
function ReplyIcon() {
  return <img src="/icons/comment.svg" alt="" />;
}
function ShareIcon() {
  return <img src="/icons/share.svg" alt="" />;
}
