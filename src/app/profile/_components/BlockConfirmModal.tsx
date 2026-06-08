// "use client";
// import React from "react";

// type Props = {
//   open: boolean;
//   username?: string;
//   userId?: string;
//   blockedId?: string;
//   onCancel: () => void;
//   onConfirm: () => void;
//   loading?: boolean;
// };
// type ActionMenuProps = {
//   onMessage?: () => void;
//   onReport?: () => void;
//   onBlock?: () => void;
// };
// export default function BlockConfirmModal({
//   open,
//   username = "اسم المستخدم",
//   onCancel,
//   onConfirm,
//   blockedId = "456",
//   loading,
// }: Props) {
//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-[1000] flex items-center justify-center">
//       {/* overlay */}
//       <div className="absolute inset-0 bg-[#000]/10 backdrop-blur-md" />

//       {/* modal */}
//       <div className="relative z-10 bg-[linear-gradient(270deg,rgba(255,255,255,0.8)_0%,#8d8d8d94_80%)]
//             backdrop-blur-lg w-[90%] max-w-md rounded-[24px] shadow-xl overflow-hidden">
//         <div className="bg-[#FFFFFF]/10 backdrop-blur-lg">
//           <h2 className="font-semibold text-[18px] p-2">حجب الدرج</h2>
//         </div>
//         <div className="">
//             <div className="p-6">
//                 <div className=" text-center">
//             <p className="text-sm leading-relaxed ">
//                <span className="font-semibold text-[18px]"> هتعمل حظر لـ {username} </span>
//                 <br />
//                 بعد ما تحظر الدرج مش هيقدر يشوف درجك الخاص ولا تفضيلاتك
//                 ولا يبعتلك رسائل ولو كان متابع هيشال من عندك تلقائي
//             </p>
//                 </div>
//             </div>
//             <div className="flex items-center justify-center gap-3 p-4 border-t border-[#707070]">
//                 <button
//                     onClick={onConfirm}
//                     disabled={loading}
//                     className={`py-3 w-[150px] rounded-[23px] ${
//                       loading ? "opacity-50 cursor-not-allowed" : "bg-black cursor-pointer"
//                     } text-white`}
//                 >
//                     {loading ? "جاري الحجب..." : "حجب"}
//                 </button>
//                 <button
//                     onClick={onCancel}
//                     disabled={loading}
//                     className="py-3 w-[150px] rounded-[23px] border border-black text-white cursor-pointer "
//                 >
//                     إلغاء
//                 </button>
//             </div>
//         </div>

//       </div>
//     </div>
//   );
// }


"use client";
import React from "react";

type Props = {
  open: boolean;
  username?: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

export default function BlockConfirmModal({
  open,
  username = "اسم المستخدم",
  onCancel,
  onConfirm,
  loading,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-[#000]/10 backdrop-blur-md" />
      <div className="relative z-10 bg-[linear-gradient(270deg,rgba(255,255,255,0.8)_0%,#8d8d8d94_80%)] backdrop-blur-lg w-[90%] max-w-md rounded-[24px] shadow-xl overflow-hidden">
        <div className="bg-[#FFFFFF]/10 backdrop-blur-lg">
          <h2 className="font-semibold text-[18px] p-2">حجب الدرج</h2>
        </div>
        <div className="p-6 text-center">
          <p className="text-sm leading-relaxed">
            <span className="font-semibold text-[18px]">هتعمل حظر لـ {username}</span>
            <br />
            بعد ما تحظر الدرج مش هيقدر يشوف درجك الخاص ولا تفضيلاتك
            ولا يبعتلك رسائل ولو كان متابع هيشال من عندك تلقائي
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 p-4 border-t border-[#707070]">
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`py-3 w-[150px] rounded-[23px] ${
              loading ? "opacity-50 cursor-not-allowed" : "bg-black cursor-pointer"
            } text-white`}
          >
            {loading ? "جاري الحجب..." : "حجب"}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="py-3 w-[150px] rounded-[23px] border border-black bg-gray-700 text-white cursor-pointer"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}