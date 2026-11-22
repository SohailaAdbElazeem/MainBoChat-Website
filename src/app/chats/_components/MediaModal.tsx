// app/chats/_components/MediaModal.tsx
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface MediaModalProps {
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

export default function MediaModal({
  isOpen,
  onClose,
  files,
  onAddFiles,
  onRemoveFile,
  caption,
  setCaption,
  onSend,
  isSending = false,
}: MediaModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // روابط المعاينة
  const previews = useMemo(
    () =>
      files.map((f) => ({
        url: URL.createObjectURL(f),
        isVideo: f.type.startsWith("video/"),
      })),
    [files]
  );

  useEffect(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p.url));
  }, [previews]);

  // تثبيت الـ index لو الملفات اتغيّرت
  useEffect(() => {
    if (files.length === 0) setCurrentIndex(0);
    else if (currentIndex > files.length - 1) setCurrentIndex(files.length - 1);
  }, [files.length, currentIndex]);

  // لما يتفتح المودال من جديد يرجع للأول
  useEffect(() => {
    if (isOpen) setCurrentIndex(0);
  }, [isOpen]);

  if (!isOpen) return null;

  const total = files.length;
  const prevIndex = total > 1 ? (currentIndex - 1 + total) % total : null;
  const nextIndex = total > 1 ? (currentIndex + 1) % total : null;

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
      // نروح لأول ملف جديد اتضاف
      setCurrentIndex(files.length);
    }
    e.target.value = "";
  };

  const renderThumb = (idx: number) =>
    previews[idx]?.isVideo ? (
      <video
        src={previews[idx].url}
        className="w-full h-full object-cover"
        muted
        playsInline
      />
    ) : (
      <img
        src={previews[idx]?.url}
        alt=""
        className="w-full h-full object-cover"
      />
    );

  return (
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
        accept="image/*,video/*"
        multiple
        className="hidden"
      />

      <div
        className="relative bg-white flex flex-col justify-between overflow-hidden shadow-2xl"
        style={{ width: 572, height: 569, borderRadius: 35 }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* الهيدر */}
        <div dir="rtl" className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="flex items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95"
              style={{ width: 36, height: 36, background: "#0000001A" }}
            >
              <img src="/imgs/close.svg" alt="X" style={{ width: 15 }} />
            </button>
            <span
              style={{
                fontFamily: "Cairo, sans-serif",
                fontWeight: 500,
                fontSize: 25,
                lineHeight: 1,
                color: "#000",
              }}
            >
              إرسال صورة
            </span>
          </div>

          <button
            type="button"
            onClick={openPicker}
            className="flex items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95"
            style={{ width: 36, height: 36, background: "#F3F5FF" }}
          >
            <img
              src="/imgs/Add.svg"
              alt="+"
              style={{ width: 17, height: 17, transform: "rotate(-90deg)" }}
            />
          </button>
        </div>

        {/* منطقة المعاينة */}
        <div className="relative flex-1 flex items-center justify-center px-4 overflow-hidden my-auto">
          {total === 0 ? (
            <div
              onClick={openPicker}
              className="flex flex-col items-center justify-center text-gray-400 gap-3 cursor-pointer"
              style={{
                width: 291,
                height: 358,
                borderRadius: 40,
                background: "#F3F5FF",
              }}
            >
              <img
                src="/imgs/gellery.svg"
                alt="empty"
                className="w-12 h-12 opacity-50"
              />
              <p className="text-sm font-semibold">
                اضغط لاختيار صور أو فيديوهات
              </p>
            </div>
          ) : (
            <>
              {/* السابقة */}
              {prevIndex !== null && (
                <div
                  onClick={() => setCurrentIndex(prevIndex)}
                  className="absolute left-6 cursor-pointer opacity-70 hover:opacity-100 transition-all -translate-y-1/2 top-1/2"
                  style={{
                    width: 125,
                    height: 255,
                    borderRadius: 20,
                    overflow: "hidden",
                    background:
                      "linear-gradient(270deg, rgba(255,255,255,0) 14.83%, #FFFFFF 79.89%)",
                  }}
                >
                  {renderThumb(prevIndex)}
                </div>
              )}

              {/* الحالية */}
              <div
                className="relative flex items-center justify-center z-10"
                style={{
                  width: 291,
                  height: 358,
                  borderRadius: 40,
                  border: "3px solid #B4B4B9",
                  background: "#000",
                }}
              >
                {previews[currentIndex]?.isVideo ? (
                  <video
                    key={previews[currentIndex].url}
                    src={previews[currentIndex].url}
                    className="w-full h-full object-cover"
                    style={{ borderRadius: 37 }}
                    controls
                    playsInline
                  />
                ) : (
                  <img
                    src={previews[currentIndex]?.url}
                    alt={files[currentIndex]?.name}
                    className="w-full h-full object-cover"
                    style={{ borderRadius: 37 }}
                  />
                )}

                {/* أزرار فوق الصورة */}
                <div className="absolute top-3 inset-x-0 flex items-center justify-center gap-[5px] z-20 px-3 pointer-events-none">
                  <button
                    type="button"
                    onClick={() => onRemoveFile(currentIndex)}
                    className="pointer-events-auto flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md"
                    style={{
                      width: 61,
                      height: 60,
                      background: "#F3F5FF80",
                      backdropFilter: "blur(4px)",
                      border: "2px solid #F3F5FF40",
                      borderRadius: "50%",
                    }}
                    title="حذف"
                  >
                    <img
                      src="/imgs/deleteImg.svg"
                      alt="حذف"
                      style={{ width: 20, height: 21 }}
                    />
                  </button>

                  <div
                    className="pointer-events-auto flex items-center justify-center shadow-md"
                    style={{
                      width: 60,
                      height: 61,
                      background: "#F3F5FF80",
                      border: "2px solid #F3F5FF40",
                      borderRadius: "50%",
                    }}
                  >
                    <img
                      src="/imgs/onlyOne.svg"
                      alt="onlyOne"
                      style={{ width: 20, height: 20 }}
                    />
                  </div>
                </div>
              </div>

              {/* التالية */}
              {nextIndex !== null && (
                <div
                  onClick={() => setCurrentIndex(nextIndex)}
                  className="absolute right-6 cursor-pointer opacity-70 hover:opacity-100 transition-all -translate-y-1/2 top-1/2"
                  style={{
                    width: 125,
                    height: 255,
                    borderRadius: 20,
                    overflow: "hidden",
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0) 14.83%, #FFFFFF 79.89%)",
                  }}
                >
                  {renderThumb(nextIndex)}
                </div>
              )}
            </>
          )}
        </div>

        {/* النقط */}
        <div className="flex justify-center items-center gap-2 py-1 min-h-[16px]">
          {files.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                i === currentIndex ? "bg-black w-6" : "bg-gray-300 w-2"
              }`}
            />
          ))}
        </div>

        {/* الفوتر */}
        <div className="px-6 pb-5 pt-2 flex justify-center">
          <div
            className="flex items-center justify-between relative overflow-hidden"
            style={{
              width: 528,
              height: 50,
              borderRadius: 20,
              background: "#F3F5FF",
            }}
          >
            <button
              type="button"
              onClick={onSend}
              disabled={total === 0 || isSending}
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
                  style={{ width: 17.24, height: 20.43, objectFit: "contain" }}
                />
              )}
            </button>

            <div className="flex items-center flex-1 px-4 gap-2">
              <input
                type="text"
                placeholder="اضف وصف..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-right"
                style={{
                  fontFamily: "Cairo, sans-serif",
                  fontWeight: 600,
                  fontSize: 15,
                }}
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
    </div>
  );
}