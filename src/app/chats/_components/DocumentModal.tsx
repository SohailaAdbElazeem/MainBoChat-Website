// app/chats/_components/DocumentModal.tsx
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useRef } from "react";
import {
  FileText,
  FileSpreadsheet,
  FileArchive,
  File,
  FileType,
  Presentation,
} from "lucide-react";

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: File[];
  onAddFiles: (newFiles: File[]) => void;
  onRemoveFile: (index: number) => void;
  caption: string;
  setCaption: (val: string) => void;
  onSend: () => void;
  isSending?: boolean;
}

const getFileIcon = (file: File) => {
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const type = file.type.toLowerCase();

  if (ext === "pdf" || type === "application/pdf") {
    return { Icon: FileType, color: "#E53935" };
  }

  if (
    ["doc", "docx"].includes(ext) ||
    type.includes("word")
  ) {
    return { Icon: FileText, color: "#2872C8" };
  }

  if (
    ["xls", "xlsx", "csv"].includes(ext) ||
    type.includes("spreadsheet") ||
    type.includes("excel")
  ) {
    return { Icon: FileSpreadsheet, color: "#16834A" };
  }

  if (
    ["ppt", "pptx"].includes(ext) ||
    type.includes("presentation") ||
    type.includes("powerpoint")
  ) {
    return { Icon: Presentation, color: "#E87535" };
  }

  if (["zip", "rar", "7z"].includes(ext)) {
    return { Icon: FileArchive, color: "#E5A000" };
  }

  if (ext === "txt" || type === "text/plain") {
    return { Icon: FileText, color: "#64748B" };
  }

  return { Icon: File, color: "#64748B" };
};

export default function DocumentModal({
  isOpen,
  onClose,
  files,
  onAddFiles,
  onRemoveFile,
  caption,
  setCaption,
  onSend,
  isSending = false,
}: DocumentModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const openPicker = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const selected = e.target.files ? Array.from(e.target.files) : [];
    if (selected.length > 0) {
      onAddFiles(selected);
    }
    e.target.value = "";
  };

  return (
    // الخلفية بضباب
    <div
     className="absolute inset-0 z-[999999] bg-black/30 backdrop-blur-md flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        onClick={(e) => e.stopPropagation()}
        multiple
        className="hidden"
      />

      {/* الدايف الكبير: 390 × 550 */}
      <div
        className="relative bg-white flex flex-col items-center shadow-2xl overflow-hidden"
        style={{
          width: 390,
          height: 550,
          borderRadius: 35,
          opacity: 1,
          padding: "18px 25px 20px",
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* الهيدر: X + العنوان ... وفي النهاية + */}
        <div
          dir="rtl"
          className="flex items-center justify-between w-full flex-shrink-0"
          style={{ marginBottom: 20 }}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="flex items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95 bg-[#0000001A]"
              style={{ width: 36, height: 36 }}
            >
              <img src="/imgs/close.svg" alt="X" style={{ width: 15 }} />
            </button>

            <span
              style={{
                fontFamily: "Cairo, sans-serif",
                fontWeight: 500,
                fontSize: 25,
                lineHeight: "100%",
                color: "#000000",
              }}
            >
              إرسال مستند
            </span>
          </div>

          <button
            type="button"
            onClick={openPicker}
            className="flex items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95"
            style={{
              width: 36,
              height: 36,
              background: "#F3F5FF",
              opacity: 1,
            }}
          >
            <img
              src="/imgs/Add.svg"
              alt="+"
              style={{
                width: 17,
                height: 17,
                transform: "rotate(-90deg)",
                opacity: 1,
              }}
            />
          </button>
        </div>

        {/* منطقة الملفات: 339 × 387 */}
        <div
          dir="rtl"
          className="flex flex-col flex-shrink-0 overflow-y-auto scrollbar-hidden"
          style={{
            width: 339,
            height: 387,
            borderRadius: 40,
            background: "#F3F5FF",
            opacity: 1,
            padding: files.length === 0 ? 0 : 12,
          }}
        >
          {files.length === 0 ? (
            <div
              onClick={openPicker}
              className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0">
                <File size={24} color="#64748B" strokeWidth={1.8} />
              </div>
              <p className="text-sm font-semibold">
                اضغط لاختيار ملفات من جهازك
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {files.map((file, idx) => {
                const { Icon, color } = getFileIcon(file);

                return (
                  <div
                    key={`${file.name}-${file.size}-${file.lastModified}-${idx}`}
                    className="group flex items-center justify-between p-3 rounded-[25px] transition-colors duration-200 hover:bg-[#FFFFFF80]"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0">
                        <Icon size={24} color={color} strokeWidth={1.8} />
                      </div>
                      <div className="flex flex-col min-w-0 text-right">
                        <span
                          className="text-sm font-semibold text-gray-800 truncate"
                          dir="ltr"
                        >
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </div>

                    {/* القمامة: تظهر عند الـ hover فقط */}
                    <button
                      type="button"
                      onClick={() => onRemoveFile(idx)}
                      className="p-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      title="حذف"
                    >
                      <img
                        src="/imgs/deleteImg.svg"
                        alt="delete"
                        className="w-4 h-4"
                        style={{
                          filter:
                            "invert(100%)  hue-rotate(345deg)",
                        }}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* الفوتر: إضافة وصف + الإرسال في النهاية */}
        <div
          className="flex items-center justify-between relative overflow-hidden mt-auto flex-shrink-0"
          style={{
            width: 339,
            height: 50,
            borderRadius: 20,
            background: "#F3F5FF",
          }}
        >
          <button
            type="button"
            onClick={onSend}
            disabled={files.length === 0 || isSending}
            className="flex items-center justify-center shrink-0 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            style={{
              width: 64,
              height: 50,
              borderRadius: 20,
              border: "2px solid #F3F5FF",
              background: "#FDFDFF",
            }}
          >
            {isSending ? (
              <div className="w-5 h-5 border-2 border-[#D72229] border-t-transparent rounded-full animate-spin" />
            ) : (
              <img
                src="/imgs/send.svg"
                alt="إرسال"
                style={{
                  width: 17.24,
                  height: 20.43,
                  objectFit: "contain",
                }}
              />
            )}
          </button>

          <div className="flex items-center flex-1 px-4 gap-2">
            <input
              type="text"
              placeholder="اضف وصف..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-right text-sm"
              style={{ fontFamily: "Cairo, sans-serif", fontWeight: 600 }}
            />
            <img
              src="/imgs/animation-icon.svg"
              alt="إيموجي"
              className="shrink-0"
              style={{ width: 18, height: 18 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}