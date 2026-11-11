// // src>app>chats>_components>BlockConfirmModal.tsx
// "use client";

// import React from "react";

// type Props = {
//   open: boolean;
//   username?: string;
//   action?: "block" | "unblock";
//   onCancel: () => void;
//   onConfirm: () => void;
//   loading?: boolean;
// };

// export default function BlockConfirmModal({
//   open,
//   username = "المستخدم",
//   action = "block",
//   onCancel,
//   onConfirm,
//   loading = false,
// }: Props) {
//   if (!open) return null;

//   const isUnblock = action === "unblock";

//   return (
//     <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-black/20 backdrop-blur-sm"
//         onClick={loading ? undefined : onCancel}
//       />

//       {/* Modal */}
//       <div className="relative z-10 bg-white w-full max-w-[400px] rounded-[28px] shadow-xl overflow-hidden">
//         {/* Header */}
//         <div className="px-6 pt-6 pb-2 text-center">
//           <h2 className="font-semibold text-[20px] text-[#D72229]">
//             {isUnblock ? "رفع الحظر" : "حظر"} لـ "{username}"؟
//           </h2>
//         </div>

//         {/* Body */}
//         <div className="px-6 pb-6 text-center">
//           <p className="text-sm leading-relaxed text-gray-700">
//             {isUnblock
//               ? "بعد رفع الحظر، سيتمكن هذا المستخدم من التواصل معك مرة أخرى."
//               : "بعد الحظر، لن يتمكن هذا المستخدم من التواصل معك أو رؤية نشاطك."}
//           </p>
//         </div>

//         {/* Actions */}
//         <div className="flex items-center justify-center gap-3 px-6 pb-6">
//           <button
//             onClick={onConfirm}
//             disabled={loading}
//             className={`flex-1 py-3 rounded-[19px] transition-all text-white font-semibold ${
//               loading
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-[#D72229] hover:bg-[#b81e24] cursor-pointer"
//             }`}
//           >
//             {loading
//               ? "جاري التنفيذ..."
//               : isUnblock
//               ? "نعم، أرفع الحظر"
//               : "نعم، أحظر"}
//           </button>
//           <button
//             onClick={onCancel}
//             disabled={loading}
//             className="flex-1 py-3 rounded-[19px] border border-[#D72229] text-[#D72229] font-semibold bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
//           >
//             إلغاء
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


// src/app/chats/_components/BlockConfirmModal.tsx

"use client";

import React from "react";

type Props = {
  open: boolean;
  username?: string;
  action?: "block" | "unblock";
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

export default function BlockConfirmModal({
  open,
  username = "المستخدم",
  action = "block",
  onCancel,
  onConfirm,
  loading = false,
}: Props) {
  if (!open) return null;

  const isUnblock = action === "unblock";

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#000]/10 backdrop-blur-md" />

      {/* Modal */}
      <div className="relative z-10 bg-[linear-gradient(270deg,rgba(255,255,255,0.8)_0%,#8d8d8d94_80%)] backdrop-blur-lg w-full max-w-md rounded-[24px] shadow-xl overflow-hidden">

        {/* Header */}
        <div className="bg-[#FFFFFF]/10 backdrop-blur-lg">
          <h2 className="font-semibold text-[18px] p-4">
            {isUnblock ? "رفع الحظر" : "حظر"}
          </h2>
        </div>

        {/* Body */}
        <div className="p-6 text-center">
          <p className="text-sm leading-relaxed">
            <span className="font-semibold text-[18px]">
              {isUnblock ? "رفع الحظر عن" : "حظر"} &quot;{username}&quot;؟
            </span>
            <br />
            <span className="mt-2 block">
              {isUnblock
                ? "بعد رفع الحظر، سيتمكن هذا المستخدم من التواصل معك مرة أخرى."
                : "بعد الحظر، لن يتمكن هذا المستخدم من التواصل معك أو رؤية نشاطك."}
            </span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 p-4 border-t border-[#707070]">
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`py-3 w-[200px] rounded-[23px] transition-all ${
              loading
                ? "cursor-not-allowed"
                : "bg-black cursor-pointer"
            } text-white`}
          >
            {loading
              ? "جاري التنفيذ..."
              : isUnblock
              ? " أرفع الحظر"
              : " أحظر"}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="py-3 w-[150px] rounded-[23px] border border-black bg-[#8D8D8D] text-white cursor-pointer "
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}