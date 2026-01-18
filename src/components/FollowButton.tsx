"use client";
import { useState } from "react";

const TOKEN = "eyJhbGci..."; // ← من الأفضل تمريره كـ prop أو من context/secure store بدلاً من هاردكود

type Props = {
  followerid: string;   // المستخدم الحالي اللي بيعمل متابعة
  followingid: string;  // المستخدم اللي هتتباعه
  // اختياري: لو عندك حالة مبدئية (مثلاً جيبتها من السيرفر عند SSR) مررها هنا لتجنب فلاش UI
  initialStatus?: "idle" | "requested" | "followed";
};

export default function FollowButton({ followerid, followingid, initialStatus = "idle" }: Props) {
  const [loading, setLoading] = useState(false);
  // status: idle = لا حاجة، requested = طلب متابعة مُرسل ولم تُوافق بعد، followed = فعلاً متابع
  const [status, setStatus] = useState<"idle" | "requested" | "followed">(initialStatus);
  const [error, setError] = useState<string | null>(null);

  // مساعدة: قراءة الـ response JSON بأمان
  async function readJsonSafe(res: Response) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }

  const handleFollow = async () => {
    if (loading || status === "followed" || status === "requested") return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("https://bo-chat.space/follow", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ followerid, followingid }),
      });

      const json = await readJsonSafe(res);
      if (!res.ok) {
        console.error("follow failed:", res.status, json);
        const msg = (json && (json.message || json.error)) || `Server returned ${res.status}`;
        throw new Error(msg);
      }

      // نتوقع من السيرفر إرجاع حالة مثل { status: "requested" } أو { status: "followed" }
      const serverStatus = json?.status || null;

      if (serverStatus === "followed" || serverStatus === "accepted" || serverStatus === "ok") {
        setStatus("followed");
      } else if (serverStatus === "requested" || serverStatus === "pending") {
        setStatus("requested");
      } else {
        // إذا السيرفر رجع משהו غير متوقع، نستخدم الافتراضي: نجعلها requested لتسمح بالإلغاء
        setStatus("requested");
        console.warn("Unexpected follow response body:", json);
      }
    } catch (err: any) {
      setError("حدث خطأ أثناء المتابعة");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    if (loading || status !== "requested") return;
    setLoading(true);
    setError(null);

    try {
      // هنا استخدمت DELETE على نفس المسار، لكن عدّل حسب API (مثلاً POST /follow/cancel أو DELETE /follow/:id)
      const res = await fetch("https://bo-chat.space/follow", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ followerid, followingid }),
      });

      const json = await readJsonSafe(res);
      if (!res.ok) {
        console.error("cancel follow failed:", res.status, json);
        const msg = (json && (json.message || json.error)) || `Server returned ${res.status}`;
        throw new Error(msg);
      }

      // نتوقع نجاح الحذف — نرجع للحالة الأولية
      setStatus("idle");
    } catch (err: any) {
      setError("تعذّر إلغاء الطلب. حاول مرة أخرى.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async () => {
    if (loading || status !== "followed") return;
    setLoading(true);
    setError(null);

    try {
      // مثال: إلغاء المتابعة (unfollow) — قد يحتاج endpoint مختلف
      const res = await fetch("https://bo-chat.space/unfollow", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ followerid, followingid }),
      });

      const json = await readJsonSafe(res);
      if (!res.ok) {
        console.error("unfollow failed:", res.status, json);
        const msg = (json && (json.message || json.error)) || `Server returned ${res.status}`;
        throw new Error(msg);
      }

      setStatus("idle");
    } catch (err: any) {
      setError("تعذّر إلغاء المتابعة. حاول مرة أخرى.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // عرض الزر بحسب الحالة
  return (
    <div className="flex flex-col items-center">
      {status === "idle" && (
        <button
          onClick={handleFollow}
          disabled={loading}
          className={`px-3 py-2 flex items-center gap-3 rounded-full border cursor-pointer text-sm border-[#D72229] text-[#D72229] bg-white ${loading ? "opacity-60 pointer-events-none" : ""}`}
        >
          <img src="/icons/follow.svg" className="w-4 h-4" alt="follow icon" />
          {loading ? "جاري..." : "متابعة"}
        </button>
      )}

      {status === "requested" && (
        <button
          onClick={handleCancelRequest}
          disabled={loading}
          className={`px-3 py-2 flex items-center gap-3 rounded-full border cursor-pointer text-sm border-yellow-500 text-yellow-700 bg-yellow-50 ${loading ? "opacity-60 pointer-events-none" : ""}`}
        >
          <img src="/icons/hourglass.svg" className="w-4 h-4" alt="pending" />
          {loading ? "جاري..." : "طلب متابعة — إلغاء الطلب"}
        </button>
      )}

      {status === "followed" && (
        <button
          onClick={handleUnfollow}
          disabled={loading}
          className={`px-3 py-2 flex items-center gap-3 rounded-full border cursor-pointer text-sm border-green-600 text-green-600 bg-green-50 ${loading ? "opacity-60 pointer-events-none" : ""}`}
        >
          <img src="/icons/check.svg" className="w-4 h-4" alt="done" />
          {loading ? "جاري..." : "متابع — إلغاء المتابعة"}
        </button>
      )}

      {error && (
        <p className="text-red-600 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}
