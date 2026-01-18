/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/alt-text */
'use client';
import {  useMemo } from "react";
import { Message } from "@/types/types";
import VoiceNotePlayer from "./VoiceNotePlayer";
import "../css/custom.css";

/**
 * Convert media to playable URL
 */
const useMediaUrl = (media: any) => {
  return useMemo(() => {
    if (!media) return null;

    // Array
    if (Array.isArray(media)) {
      const item = media[0];
      if (!item) return null;

      if (typeof item === "string") return item;
      if (item instanceof File || item instanceof Blob) {
        return URL.createObjectURL(item);
      }
    }

    // URL
    if (typeof media === "string") return media;

    // File / Blob (⭐ هنا الحل)
    if (media instanceof File || media instanceof Blob) {
      return URL.createObjectURL(media);
    }

    return null;
  }, [media]);
};


export const MessageItem = ({
  m,
  myId,
  // onRetry,
  index,
  recieverImg,
  prevMessage, // 👈
}: {
  m: Message;
  myId: string | null;
  onRetry: (m: Message) => void;
  index: number;
  recieverImg: string
  prevMessage?: Message;

}) => {
  const mine = m.sender === myId;
  // const isTemp = m._id?.toString().startsWith("tmp-");
  const isThird = (index + 1) % 2 === 0;
  const mediaUrl = useMediaUrl(m.media);
  const ProgressCircle = ({ value }: { value: number }) => {
    const radius = 18;
    const stroke = 3;
    const normalized = radius - stroke * 2;
    const circumference = normalized * 2 * Math.PI;
    const offset =
      circumference - (value / 100) * circumference;

    return (
      <svg width={40} height={40}>
        <circle
          stroke="#fee2e2"
          fill="transparent"
          strokeWidth={stroke}
          r={normalized}
          cx={20}
          cy={20}
        />
        <circle
          stroke="#dc2626"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset: offset, transition: "0.2s" }}
          r={normalized}
          cx={20}
          cy={20}
        />
        {/* <text
          x="50%"
          y="55%"
          textAnchor="middle"
          fontSize="10"
          fill="#dc2626"
        >
          {value}%
        </text> */}
      </svg>
    );
  };

  // // cleanup blob URLs
  // useEffect(() => {
  //   return () => {
  //     if (mediaUrl?.startsWith("blob:")) {
  //       URL.revokeObjectURL(mediaUrl);
  //     }
  //   };
  // }, [mediaUrl]);

const isSameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const getDateLabel = (date: Date) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) return "اليوم";
  if (isSameDay(date, yesterday)) return "أمس";

  return date.toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const messageDate = new Date(m.timestamp);

const showDateHeader =
  !prevMessage ||
  !isSameDay(
    new Date(prevMessage.timestamp),
    messageDate
  );

const dateLabel = getDateLabel(messageDate);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }} className="relative" >
        {showDateHeader && (
          <div className="flex justify-center my-3 w-[100%] position-relative date-label">
            <span className="px-4 py-1 text-sm  text-[#B4B4B9]  bg-[#fff] z-[99] text-center">
              {dateLabel}
            </span>
          </div>
        )}
      <div
        className="flex-row flex"
        style={{
          alignSelf: mine ? "flex-start" : "flex-end ",
          maxWidth: "70%",
          // background: mine ? "#D72229" : "#F3F5FF",
          // borderRadius: 25,
          // opacity: m._sendFailed ? 0.6 : 1,
          // border: m._sendFailed ? "1px dashed #c33" : undefined,
        }}
      >

        {/* TEXT */}
          {(!m.type || m.type === "text") && (
            <div
              className={`
                ${mine ? "text-white bg-[#D72229]" : "text-[#D72229] bg-[#F3F5FF]"}
                ${isThird ? (mine ? "message-mine" : "message-other") : ""}
                flex items-center justify-center px-5 py-2.5
                text-[18px] !rounded-[25px]
              `}
            >
              {m.message}
            </div>
          )}


        {/* AUDIO */}
        {m.type === "audio" && (
          <>
            {mediaUrl ? (
              <VoiceNotePlayer
                mediaUrl={mediaUrl}
                mine={mine}
              />
            ) : (
              <span style={{ fontSize: 12, color: "#999" }}>
                جاري تجهيز الصوت...
              </span>
            )}
          </>
        )}
        {/* sticker */}
        {
          m.type === "sticker" && (
            <div style={{ position: "relative", display: "inline-block" }}>
              <img
                src={mediaUrl}
                style={{
                  maxWidth: "100%",
                  opacity: typeof m.uploadProgress === "number" ? 0.6 : 1,
                }}                className="rounded-[18px] object-cover"
                alt="image"
                loading="lazy"
                referrerPolicy="no-referrer"
                width={180}
                height={230}
                />
            </div>
          ) 
        }
        {/* IMAGE */}
        {m.type === "image" && mediaUrl && (
          <div style={{ position: "relative", display: "inline-block" }}>
            <div className={`flex items-center  overflow-hidden w-[200px] max-h-[250px] p-4  rounded-[18px] ${mine ? "bg-[#D72229]" : "bg-[#F3F5FF]"} ${isThird ? (mine ? "message-mine" : "message-other") : ""} `}>
              <img
                src={mediaUrl}
                style={{
                  maxWidth: "100%",
                  opacity: typeof m.uploadProgress === "number" ? 0.6 : 1,
                }}
                className="rounded-[18px] object-cover"
                alt="image"
                loading="lazy"
                referrerPolicy="no-referrer"
                width={180}
                height={230}
                />
            </div>

            {typeof m.uploadProgress === "number" && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <ProgressCircle value={m.uploadProgress} />
              </div>
            )}
          </div>
        )}



        {/* VIDEO */}
        {m.type === "video" && mediaUrl && (
          <video
            src={mediaUrl}
            controls
            style={{ maxWidth: "100%", borderRadius: 8 }}
            controlsList="nodownload noremoteplayback"
            disablePictureInPicture
          />
        )}
        {!mine && isThird ? (
          <img
            src={recieverImg}
            className="w-[40px] h-[40px] rounded-full mr-2"
          />
        ): <div className="w-[40px] h-[40px] rounded-full mr-2">

        </div>
        }
        {/* META */}
        <div
          style={{
            fontSize: 12,
            color: "#666",
            marginTop: 6,
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          {/* <span>
            {mine ? "أنت" : m.sender} •{" "}
            {new Date(m.timestamp).toLocaleString()}
          </span> */}

          {/* {isTemp && !m._sendFailed && (
            <span style={{ color: "#b35" }}>جاري الإرسال…</span>
          )} */}

          {/* {m._sendFailed && (
            <button
              onClick={() => onRetry(m)}
              style={{
                padding: "2px 8px",
                borderRadius: 6,
                border: "1px solid #c33",
                background: "#fff",
                color: "#c33",
                cursor: "pointer",
              }}
            >
              إعادة إرسال
            </button>
          )} */}
        </div>
      </div>
    </div>
  );
};
