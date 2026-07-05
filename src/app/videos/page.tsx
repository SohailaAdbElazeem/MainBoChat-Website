// // app/videos/page.tsx
// import ReelsFeed from "@/app/_components/ReelsFeed";

// export default function VideosPage() {
//   return (
//     <div className="p-4">
//       <ReelsFeed />
//     </div>
//   );
// }

// app/videos/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function VideosPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] px-4 text-center">
      {/* الأيقونة التوضيحية (يمكنك استخدام SVG أو صورة) */}
      <div className="mb-6">
        <svg
          width="120"
          height="120"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#D72229]"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* العنوان الرئيسي */}
      <h1
        className="text-3xl font-bold mb-3"
        style={{
          fontFamily: "Cairo, sans-serif",
          fontWeight: 700,
          color: "#1A1A1A",
        }}
      >
        🚧 الصفحة قيد التطوير
      </h1>

      {/* النص التوضيحي */}
      <p
        className="text-lg mb-8 max-w-md"
        style={{
          fontFamily: "Cairo, sans-serif",
          fontWeight: 400,
          color: "#6B6B6B",
        }}
      >
        نحن نعمل على إضافة محتوى مميز لك. تابعنا قريباً لتشاهد أحدث الفيديوهات!
      </p>

      {/* أزرار التحكم */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => router.back()}
          className="px-8 py-3 bg-[#D72229] text-white rounded-full hover:bg-red-700 transition font-semibold"
          style={{
            fontFamily: "Cairo, sans-serif",
            fontWeight: 600,
          }}
        >
          العودة للخلف
        </button>

        <Link
          href="/"
          className="px-8 py-3 bg-gray-200 text-[#1A1A1A] rounded-full hover:bg-gray-300 transition font-semibold"
          style={{
            fontFamily: "Cairo, sans-serif",
            fontWeight: 600,
          }}
        >
          الذهاب للرئيسية
        </Link>
      </div>

      {/* شريط تقدم وهمي لإضافة لمسة جمالية */}
      <div className="mt-10 w-full max-w-xs bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-[#D72229] h-2.5 rounded-full animate-pulse"
          style={{ width: "60%" }}
        ></div>
      </div>
      <p
        className="mt-2 text-sm"
        style={{
          fontFamily: "Cairo, sans-serif",
          color: "#9CA3AF",
        }}
      >
        جاري التجهيز ... يرجى الانتظار
      </p>
    </div>
  );
}