// "use client";
// import React, { useEffect, useState } from "react";

// type Props = {
//   profileId: string; // res.userpersonaldata._id
//   profilePrivate?: boolean | string | number | null | undefined; // res.userpersonaldata.private (any shape)
//   children: React.ReactNode;
//   fallback?: React.ReactNode; // ما سيعرض لو تم إخفاء children (مثلاً overlay أو رسالة)
// };

// /**
//  * ClientVisibilityGate
//  * - يقرأ userid من localStorage
//  * - لو البروفايل private AND profileId !== myId => يرجع fallback (أو null)
//  * - خلاف ذلك يعرض children
//  *
//  * يمنع flicker عن طريق انتظار mounted before render.
//  */
// export default function ClientVisibilityGate({
//   profileId,
//   profilePrivate,
//   children,
//   fallback = null,
// }: Props) {
//   const [myId, setMyId] = useState<string | null>(null);
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     const id = localStorage.getItem("userid") || localStorage.getItem("followerId");
//     setMyId(id);
//     setMounted(true);
//   }, []);

//   // منع الفلاش أثناء الـ hydration
//   if (!mounted) return null;

//   // Normalize private value (covers true/"true"/1/"1"/"yes")
//   const isPrivate =
//     profilePrivate === true ||
//     profilePrivate === "true" ||
//     profilePrivate === 1 ||
//     profilePrivate === "1" ||
//     profilePrivate === "yes" ||
//     profilePrivate === "Y";

//   const isOwner = Boolean(myId && profileId && String(myId) === String(profileId));

//   // لو البروفايل خاص وانا مش المالك -> عرض fallback (قد يكون null)
//   if (isPrivate && !isOwner) {
//     return <>{fallback}</>;
//   }

//   // خلاف ذلك اعرض المحتوى
//   return <>{children}</>;
// }


"use client";
import React, { useEffect, useState } from "react";

type Props = {
  profileId: string; // res.userpersonaldata._id
  profilePrivate?: boolean | string | number | null | undefined; // res.userpersonaldata.private (any shape)
  children: React.ReactNode;
  fallback?: React.ReactNode; // ما سيعرض لو تم إخفاء children (مثلاً overlay أو رسالة)
};

/**
 * ClientVisibilityGate
 * - يقرأ userid من localStorage (من userData أو المفاتيح القديمة)
 * - لو البروفايل private AND profileId !== myId => يرجع fallback (أو null)
 * - خلاف ذلك يعرض children
 *
 * يمنع flicker عن طريق انتظار mounted before render.
 */
export default function ClientVisibilityGate({
  profileId,
  profilePrivate,
  children,
  fallback = null,
}: Props) {
  const [myId, setMyId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let id: string | null = null;

    // أولاً: محاولة قراءة userData الكامل واستخراج _id
    const userDataStr = localStorage.getItem("userData");
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        if (userData._id) id = userData._id;
      } catch (e) {
        console.error("Error parsing userData:", e);
      }
    }

    // ثانياً: fallback على المفاتيح القديمة (userid أو followerId)
    if (!id) {
      id = localStorage.getItem("userid") || localStorage.getItem("followerId");
    }

    setMyId(id);
    setMounted(true);
  }, []);

  // منع الفلاش أثناء الـ hydration
  if (!mounted) return null;

  // Normalize private value (covers true/"true"/1/"1"/"yes")
  const isPrivate =
    profilePrivate === true ||
    profilePrivate === "true" ||
    profilePrivate === 1 ||
    profilePrivate === "1" ||
    profilePrivate === "yes" ||
    profilePrivate === "Y";

  const isOwner = Boolean(myId && profileId && String(myId) === String(profileId));

  // لو البروفايل خاص وانا مش المالك -> عرض fallback (قد يكون null)
  if (isPrivate && !isOwner) {
    return <>{fallback}</>;
  }

  // خلاف ذلك اعرض المحتوى
  return <>{children}</>;
}