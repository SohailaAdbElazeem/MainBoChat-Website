"use client";
import { useRef, useState } from "react";
import VoiceWaveform from "./VoiceWaveform";
import WaveSurfer from "wavesurfer.js";

export default function VoiceNotePlayer({
  mediaUrl,
  mine = true,
}: {
  mediaUrl: string;
  mine?: boolean;
}) {
  const waveRef = useRef<WaveSurfer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (!waveRef.current) return;
    waveRef.current.playPause();
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-full max-w-[320px]
      ${mine ? "bg-[#D72229] text-white message-mine" : "bg-[#F3F5FF] text-[#D72229] message-other"}`}
    >
      {/* Play / Pause */}
      <button
        onClick={togglePlay}
        className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
      >
        {playing ? "❚❚" : "▶"}
      </button>

      {/* Waveform */}
      <VoiceWaveform
        url={`/api/media?url=${encodeURIComponent(mediaUrl)}`}
        mine={mine}
        onReady={(ws) => {
          waveRef.current = ws;

          ws.on("play", () => setPlaying(true));
          ws.on("pause", () => setPlaying(false));
          ws.on("finish", () => setPlaying(false));

          ws.on("ready", () => {
            setDuration(ws.getDuration());
          });

          ws.on("audioprocess", () => {
            setCurrent(ws.getCurrentTime());
          });
        }}
      />

      {/* Time */}
      <span className="text-sm font-medium min-w-[45px]">
        {formatTime(current || duration)}
      </span>
    </div>
  );
}

function formatTime(s: number) {
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const sec = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${sec}`;
}
