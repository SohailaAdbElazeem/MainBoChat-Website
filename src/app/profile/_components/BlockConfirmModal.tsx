// "use client";
// import React from "react";

// type Props = {
//   open: boolean;
//   username?: string;
//   onCancel: () => void;
//   onConfirm: () => void;
//   loading?: boolean;
// };

// export default function BlockConfirmModal({
//   open,
//   username = "اسم المستخدم",
//   onCancel,
//   onConfirm,
//   loading,
// }: Props) {
//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-[1000] flex items-center justify-center">
//       <div className="absolute inset-0 bg-[#000]/10 backdrop-blur-md" />
//       <div className="relative z-10 bg-[linear-gradient(270deg,rgba(255,255,255,0.8)_0%,#8d8d8d94_80%)] backdrop-blur-lg w-[90%] max-w-md rounded-[24px] shadow-xl overflow-hidden">
//         <div className="bg-[#FFFFFF]/10 backdrop-blur-lg">
//           <h2 className="font-semibold text-[18px] p-2">حجب الدرج</h2>
//         </div>
//         <div className="p-6 text-center">
//           <p className="text-sm leading-relaxed">
//             <span className="font-semibold text-[18px]">هتعمل حظر لـ {username}</span>
//             <br />
//             بعد ما تحظر الدرج مش هيقدر يشوف درجك الخاص ولا تفضيلاتك
//             ولا يبعتلك رسائل ولو كان متابع هيشال من عندك تلقائي
//           </p>
//         </div>
//         <div className="flex items-center justify-center gap-3 p-4 border-t border-[#707070]">
//           <button
//             onClick={onConfirm}
//             disabled={loading}
//             className={`py-3 w-[150px] rounded-[23px] ${
//               loading ? "opacity-50 cursor-not-allowed" : "bg-black cursor-pointer"
//             } text-white`}
//           >
//             {loading ? "جاري الحجب..." : "حجب"}
//           </button>
//           <button
//             onClick={onCancel}
//             disabled={loading}
//             className="py-3 w-[150px] rounded-[23px] border border-black bg-gray-700 text-white cursor-pointer"
//           >
//             إلغاء
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import React from "react";
import { useTranslation } from "@/contexts/TranslationContext";

type Props = {
  open: boolean;
  username?: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

// قاموس الترجمة للمكون
const translations = {
  ar: {
    title: "حجب المستخدم",
    body: "بعد ما تحظر المستخدم مش هيقدر يشوف ملفك الخاص ولا تفضيلاتك ولا يبعتلك رسائل، ولو كان متابع هيتشال من عندك تلقائي.",
    confirm: "حجب",
    canceling: "جاري الحجب...",
    cancel: "إلغاء",
    blockPrefix: "هتعمل حظر لـ"
  },
  en: {
    title: "Block User",
    body: "After blocking, this user will no longer be able to see your profile or preferences, send you messages, and they will be automatically removed from your followers.",
    confirm: "Block",
    canceling: "Blocking...",
    cancel: "Cancel",
    blockPrefix: "You are blocking"
  }
};

export default function BlockConfirmModal({
  open,
  username = "User",
  onCancel,
  onConfirm,
  loading,
}: Props) {
  const { language } = useTranslation();
  const t = translations[language];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#000]/10 backdrop-blur-md" />
      <div className="relative z-10 bg-[linear-gradient(270deg,rgba(255,255,255,0.8)_0%,#8d8d8d94_80%)] backdrop-blur-lg w-full max-w-md rounded-[24px] shadow-xl overflow-hidden">
        
        <div className="bg-[#FFFFFF]/10 backdrop-blur-lg">
          <h2 className="font-semibold text-[18px] p-4">{t.title}</h2>
        </div>

        <div className="p-6 text-center">
          <p className="text-sm leading-relaxed">
            <span className="font-semibold text-[18px]">
              {t.blockPrefix} {username}
            </span>
            <br />
            <span className="mt-2 block">{t.body}</span>
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 p-4 border-t border-[#707070]">
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`py-3 w-[150px] rounded-[23px] transition-all ${
              loading ? "opacity-50 cursor-not-allowed" : "bg-black cursor-pointer"
            } text-white`}
          >
            {loading ? t.canceling : t.confirm}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="py-3 w-[150px] rounded-[23px] border border-black bg-gray-700 text-white cursor-pointer"
          >
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  );
}