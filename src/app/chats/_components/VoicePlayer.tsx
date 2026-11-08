'use client';
import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://bo-chat.space";

// بيحوّل أي شكل للـ media (Blob / string / object) للينك صالح للتشغيل
function useAudioSrc(media: any) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    if (!media) return setSrc(null);
    if (media instanceof Blob) {
      const url = URL.createObjectURL(media);
      setSrc(url);
      return () => URL.revokeObjectURL(url);
    }
    const raw: string | undefined =
      typeof media === "string" ? media : media.url || media.fileContent;
    if (!raw) return setSrc(null);
    setSrc(/^(https?:|data:|blob:)/.test(raw) ? raw : `${API_BASE}${raw}`);
  }, [media]);
  return src;
}

const fmt = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export default function VoicePlayer({
  media,
  isMe,
  peaks,
}: {
  media: any;
  isMe: boolean;
  peaks?: number[]; // قيم من 0 لـ 1
}) {
  const src = useAudioSrc(media);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);

  const bars = useMemo(() => {
    if (peaks?.length) return peaks.map((p) => Math.max(4, Math.round(p * 26)));
    return Array.from({ length: 40 }).map((_, i) => {
      const v = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
      return Math.round(v * 20 + 6);
    });
  }, [peaks]);

  // مشكلة معروفة: تسجيلات MediaRecorder بترجّع duration = Infinity
  const onLoadedMetadata = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.duration === Infinity || isNaN(a.duration)) {
      a.currentTime = 1e101;
      const fix = () => {
        a.removeEventListener("timeupdate", fix);
        a.currentTime = 0;
        setTotal(a.duration);
      };
      a.addEventListener("timeupdate", fix);
    } else {
      setTotal(a.duration);
    }
  };

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    a.paused ? a.play().catch(() => {}) : a.pause();
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    if (!a || !total) return;
    const r = e.currentTarget.getBoundingClientRect();
    a.currentTime = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1) * total;
  };

  const playedBars = total ? Math.floor((current / total) * bars.length) : 0;

  return (
    <div dir="ltr" className="flex items-center gap-2 w-[240px]">
      <audio
        ref={audioRef}
        src={src ?? undefined}
        preload="metadata"
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={() => setCurrent(audioRef.current?.currentTime ?? 0)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setCurrent(0); }}
      />

      <button
        onClick={toggle}
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0
          ${isMe ? "bg-white text-[#D72229]" : "bg-[#D72229] text-white"}`}
      >
        {playing ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
      </button>

      <div onClick={seek} className="flex items-center gap-[2px] flex-1 h-8 cursor-pointer">
        {bars.map((h, i) => (
          <div
            key={i}
            className={`w-[2px] shrink-0 rounded-full ${isMe ? "bg-white" : "bg-[#D72229]"}`}
            style={{ height: h, opacity: i < playedBars ? 1 : 0.4 }}
          />
        ))}
      </div>

      <span className={`text-[11px] tabular-nums ${isMe ? "text-white/80" : "text-gray-500"}`}>
        {fmt(playing || current ? current : total)}
      </span>
    </div>
  );
}