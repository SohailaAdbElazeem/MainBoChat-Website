"use client";
import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

export default function VoiceWaveform({
  url,
  mine,
  onReady,
}: {
  url: string;
  mine: boolean;
  onReady?: (ws: WaveSurfer) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: mine ? "#fecaca" : "#dc2626",
      progressColor: mine ? "#ffffff" : "#dc2626",
      cursorColor: "transparent",
      barWidth: 3,
      barRadius: 3,
      height: 32,
      normalize: true,
    });

    waveRef.current = ws;
    ws.load(url);
    onReady?.(ws);

    return () => {
      // ✅ guard
      if (waveRef.current) {
        waveRef.current.destroy();
        waveRef.current = null;
      }
    };
  }, [url, mine]);

  return <div ref={containerRef} className="w-40" />;
}
