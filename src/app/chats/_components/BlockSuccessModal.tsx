// src/app/chats/_components/BlockSuccessModal.tsx

"use client";

import React from "react";

type Props = {
  open: boolean;
  action?: "block" | "unblock";
  onClose: () => void;
};

export default function BlockSuccessModal({
  open,
  action = "block",
  onClose,
}: Props) {
  if (!open) return null;

  const isUnblock = action === "unblock";

  return (
    <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#000]/10 backdrop-blur-md"
        onClick={onClose}
      />

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
            <span className="font-semibold text-[20px]">
              {isUnblock
                ? "تم رفع الحظر عن المستخدم بنجاح"
                : "تم حظر المستخدم بنجاح"}
            </span>
            
            <span className="mt-0 block">
              {isUnblock
                ? "بعد رفع الحظر، سيتمكن هذا المستخدم من التواصل معك مرة أخرى."
                : "مش هيقدر يشوفك ولا يتواصل معاك ولا يتفاعل مع أي حاجة ليك"}
            </span>
            <span className="block">
              على بو شات
            </span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 p-4 border-t border-[#707070]">
          <button
            onClick={onClose}
            className="py-3 w-[200px] rounded-[23px] transition-all bg-black cursor-pointer hover:bg-gray-800 text-white font-semibold"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}