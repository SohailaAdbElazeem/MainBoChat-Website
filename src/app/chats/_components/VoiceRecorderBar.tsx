// // // app/chats/_components/VoiceRecorderBar.tsx
// // /* eslint-disable @next/next/no-img-element */
// // 'use client';
// // import { useEffect, useRef, useState } from "react";

// // const RED = "#D72229";
// // const FADE_MASK =
// //   "linear-gradient(to right, transparent 0%, black 14%, black 84%, transparent 100%)";

// // export default function VoiceRecorderBar({
// //   isRecording,
// //   analyserRef,
// //   duration,
// //   previewBlob,
// //   onDelete,
// //   onStop,
// //   onSend,
// // }: {
// //   isRecording: boolean;
// //   analyserRef?: React.RefObject<AnalyserNode | null>;
// //   canvasRef?: React.RefObject<HTMLCanvasElement | null>;
// //   duration: string;
// //   previewBlob?: Blob | null;
// //   onDelete: () => void;
// //   onStop: () => void;
// //   onSend: () => void;
// // }) {
// //   const canvasEl = useRef<HTMLCanvasElement | null>(null);
// //   const audioEl = useRef<HTMLAudioElement | null>(null);
// //   const [isPlaying, setIsPlaying] = useState(false);
// //   const [previewUrl, setPreviewUrl] = useState<string | null>(null);

// //   // ============ رابط الصوت للمعاينة ============
// //   useEffect(() => {
// //     if (!previewBlob) {
// //       setPreviewUrl(null);
// //       setIsPlaying(false);
// //       return;
// //     }
// //     const url = URL.createObjectURL(previewBlob);
// //     setPreviewUrl(url);
// //     return () => {
// //       URL.revokeObjectURL(url);
// //       setIsPlaying(false);
// //     };
// //   }, [previewBlob]);

// //   // ============ الموجة الحية أثناء التسجيل ============
// //   useEffect(() => {
// //     if (!isRecording) return;
// //     const canvas = canvasEl.current;
// //     if (!canvas) return;
// //     const ctx = canvas.getContext("2d");
// //     if (!ctx) return;

// //     const dpr = window.devicePixelRatio || 1;
// //     const W = canvas.clientWidth;
// //     const H = canvas.clientHeight;
// //     canvas.width = W * dpr;
// //     canvas.height = H * dpr;
// //     ctx.scale(dpr, dpr);

// //     const BAR = 2;
// //     const GAP = 2;
// //     const STEP = BAR + GAP;
// //     const count = Math.ceil(W / STEP) + 1;
// //     const levels: number[] = new Array(count).fill(0);
// //     let buf: Uint8Array | null = null;
// //     let last = 0;
// //     let raf = 0;

// //     const tick = (t: number) => {
// //       if (t - last > 50) {
// //         last = t;
// //         let level = 0;
// //         const analyser = analyserRef?.current;
// //         if (analyser) {
// //           if (!buf || buf.length !== analyser.fftSize) buf = new Uint8Array(analyser.fftSize);
// //           analyser.getByteTimeDomainData(buf as any);
// //           let sum = 0;
// //           for (let i = 0; i < buf.length; i++) {
// //             const v = (buf[i] - 128) / 128;
// //             sum += v * v;
// //           }
// //           level = Math.min(1, Math.sqrt(sum / buf.length) * 5);
// //         }
// //         levels.push(level);
// //         levels.shift();
// //       }

// //       ctx.clearRect(0, 0, W, H);
// //       ctx.fillStyle = RED;
// //       for (let i = 0; i < levels.length; i++) {
// //         const h = Math.max(3, levels[i] * H);
// //         const x = i * STEP;
// //         const y = (H - h) / 2;
// //         ctx.beginPath();
// //         if ((ctx as any).roundRect) (ctx as any).roundRect(x, y, BAR, h, 1);
// //         else ctx.rect(x, y, BAR, h);
// //         ctx.fill();
// //       }
// //       raf = requestAnimationFrame(tick);
// //     };
// //     raf = requestAnimationFrame(tick);
// //     return () => cancelAnimationFrame(raf);
// //   }, [isRecording, analyserRef]);

// //   // ============ تشغيل / إيقاف المعاينة ============
// //   const togglePlay = () => {
// //     if (!audioEl.current) return;
// //     if (isPlaying) {
// //       audioEl.current.pause();
// //       setIsPlaying(false);
// //     } else {
// //       audioEl.current.play();
// //       setIsPlaying(true);
// //     }
// //   };

// //   return (
// //     <div
// //       dir="ltr"
// //       className="w-full rounded-t-[20px] px-4 pt-4 pb-3  bg-[linear-gradient(180deg,#F3F5FF_0%,#FAFBFF_100%)]"
// //     >
// //       {/* ============ الصف الأول: نقطة التسجيل + الموجة + المدة ============ */}
// //       <div className="flex items-center gap-3 h-10">
// //         <span
// //           className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
// //           style={{ border: `1.5px solid ${RED}` }}
// //         >
// //           <span
// //             className={`w-[6px] h-[6px] rounded-full ${isRecording ? "animate-pulse" : ""}`}
// //             style={{ background: RED }}
// //           />
// //         </span>

// //         <div
// //           className="flex-1 h-8 flex items-center"
// //           style={{ WebkitMaskImage: FADE_MASK, maskImage: FADE_MASK }}
// //         >
// //           {isRecording ? (
// //             <canvas ref={canvasEl} className="block w-full h-8" />
// //           ) : (
// //             <AudioPreviewBars blob={previewBlob} />
// //           )}
// //         </div>

// //         {(isRecording || previewBlob) && (
// //           <span className="text-[12px] font-bold text-[#3C3C43] tabular-nums min-w-[34px] text-right">
// //             {duration}
// //           </span>
// //         )}
// //       </div>

// //       {/* ============ الصف التاني: الأزرار ============ */}
// //       <div className="flex items-center justify-between mt-3 pb-5">
// //         {isRecording ? (
// //           // ====== وضع التسجيل: حذف / إيقاف / إرسال (معطّل) ======
// //           <>
// //             <IconBtn onClick={onDelete} label="حذف">
// //               <TrashSvg color={RED} />
// //             </IconBtn>
 
// // <button
// //   type="button"
// //   onClick={onStop}
// //   className="flex items-center justify-center transition hover:opacity-90"
// //   style={{
// //     width: 50,
// //     height: 50,
// //     borderRadius: 25,
// //     backgroundColor: '#D72229',
// //     border: 'none',
// //     cursor: 'pointer',
// //     flexShrink: 0,
// //   }}
// //   aria-label="إيقاف التسجيل"
// //   title="إيقاف"
// // >
// //   <img
// //     src="/imgs/PlaySvg.svg"
// //     alt="إيقاف التسجيل"
// //     style={{ width: 22, height: 22, filter: 'brightness(0) invert(1)' }}
// //   />
// // </button>

// //             <button
// //               type="button"
// //               disabled
// //               className="w-9 h-9 flex items-center justify-center opacity-50 cursor-not-allowed"
// //               aria-label="إرسال"
// //               title="إرسال"
// //             >
// //               <img src="/imgs/sendBtn.svg" alt="send" className="w-[20px] h-[20px]" />
// //             </button>
// //           </>
// //         ) : (
// //           // ====== وضع المعاينة: حذف / تشغيل-إيقاف / إرسال ======
// //           <>
// //             <IconBtn onClick={onDelete} label="حذف">
// //               <TrashSvg color={RED} />
// //             </IconBtn>

 
// //  <button
// //   type="button"
// //   onClick={togglePlay}
// //   disabled={!previewBlob}
// //   className="flex items-center justify-center transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
// //   style={{
// //     width: 50,
// //     height: 50,
// //     borderRadius: 25,
// //     backgroundColor: '#FFFFFF',
// //     border: '1px solid #D72229',
// //     cursor: previewBlob ? 'pointer' : 'not-allowed',
// //     flexShrink: 0,
// //     padding: 0,
// //   }}
// //   aria-label={isPlaying ? "إيقاف التشغيل" : "تشغيل"}
// //   title={isPlaying ? "إيقاف" : "تشغيل"}
// // >
// //   <img
// //     src={isPlaying ? "/imgs/PlaySvg.svg" : "/imgs/PauseSvg.svg"}
// //     alt={isPlaying ? "إيقاف" : "تشغيل"}
// //     style={{ width: 16, height: 22 }}
// //   />
// // </button>     
// //             <button
// //               type="button"
// //               onClick={onSend}
// //               className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#FFF5F5] transition"
// //               aria-label="إرسال"
// //               title="إرسال"
// //             >
// //               <img src="/imgs/sendBtn.svg" alt="send" className="w-[20px] h-[20px]" />
// //             </button>
// //           </>
// //         )}
// //       </div>

// //       {/* audio element مخفي للتحكم في التشغيل */}
// //       {previewUrl && (
// //         <audio
// //           ref={audioEl}
// //           src={previewUrl}
// //           onEnded={() => setIsPlaying(false)}
// //           onPause={() => setIsPlaying(false)}
// //           onPlay={() => setIsPlaying(true)}
// //           className="hidden"
// //         />
// //       )}
// //     </div>
// //   );
// // }

// // // ============ زر أيقونة موحّد ============
// // function IconBtn({
// //   onClick,
// //   label,
// //   children,
// // }: {
// //   onClick: () => void;
// //   label: string;
// //   children: React.ReactNode;
// // }) {
// //   return (
// //     <button
// //       type="button"
// //       onClick={onClick}
// //       className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#FFF5F5] transition"
// //       aria-label={label}
// //       title={label}
// //     >
// //       {children}
// //     </button>
// //   );
// // }

// // // ============ أيقونات SVG مضمّنة (بدون مكتبات) ============
// // function TrashSvg({ color }: { color: string }) {
// //   return (
// //     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
// //       <path d="M3 6h18" />
// //       <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
// //       <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
// //       <line x1="10" y1="11" x2="10" y2="17" />
// //       <line x1="14" y1="11" x2="14" y2="17" />
// //     </svg>
// //   );
// // }

// // function MicSvg({ color }: { color: string }) {
// //   return (
// //     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
// //       <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
// //       <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
// //       <line x1="12" y1="19" x2="12" y2="23" />
// //       <line x1="8" y1="23" x2="16" y2="23" />
// //     </svg>
// //   );
// // }

// // function PlaySvg({ color }: { color: string }) {
// //   return (
// //     <svg width="20" height="20" viewBox="0 0 24 24" fill={color}>
// //       <path d="M6 4l14 8-14 8V4z" />
// //     </svg>
// //   );
// // }

// // function PauseSvg({ color }: { color: string }) {
// //   return (
// //     <svg width="20" height="20" viewBox="0 0 24 24" fill={color}>
// //       <rect x="6" y="4" width="4" height="16" rx="1" />
// //       <rect x="14" y="4" width="4" height="16" rx="1" />
// //     </svg>
// //   );
// // }

// // // ============ أعمدة موجة ثابتة للمعاينة ============
// // function AudioPreviewBars({ blob }: { blob?: Blob | null }) {
// //   const [peaks, setPeaks] = useState<number[]>([]);

// //   useEffect(() => {
// //     let canceled = false;
// //     if (!blob) { setPeaks([]); return; }
// //     (async () => {
// //       try {
// //         const ctx = new AudioContext();
// //         const buf = await ctx.decodeAudioData(await blob.arrayBuffer());
// //         ctx.close();
// //         const data = buf.getChannelData(0);
// //         const count = 50;
// //         const step = Math.floor(data.length / count) || 1;
// //         const p = Array.from({ length: count }, (_, i) => {
// //           let max = 0;
// //           for (let j = i * step; j < (i + 1) * step && j < data.length; j++)
// //             max = Math.max(max, Math.abs(data[j]));
// //           return max;
// //         });
// //         const top = Math.max(...p) || 1;
// //         if (!canceled) setPeaks(p.map((v) => v / top));
// //       } catch {
// //         if (!canceled) setPeaks(Array.from({ length: 50 }, () => 0.3));
// //       }
// //     })();
// //     return () => { canceled = true; };
// //   }, [blob]);

// //   return (
// //     <div className="flex items-center justify-center gap-[2px] w-full h-8">
// //       {(peaks.length ? peaks : Array.from({ length: 50 }, () => 0.3)).map((v, i) => (
// //         <div
// //           key={i}
// //           className="rounded-full"
// //           style={{
// //             width: 2,
// //             height: Math.max(3, v * 28),
// //             background: RED,
// //             opacity: 0.8,
// //           }}
// //         />
// //       ))}
// //     </div>
// //   );
// // }

// // app/chats/_components/VoiceRecorderBar.tsx
// /* eslint-disable @next/next/no-img-element */
// 'use client';
// import { useEffect, useRef, useState } from "react";

// const RED = "#D72229";
// const FADE_MASK =
//   "linear-gradient(to right, transparent 0%, black 14%, black 84%, transparent 100%)";

// export default function VoiceRecorderBar({
//   isRecording,
//   analyserRef,
//   duration,
//   previewBlob,
//   onDelete,
//   onStop,
//   onSend,
// }: {
//   isRecording: boolean;
//   analyserRef?: React.RefObject<AnalyserNode | null>;
//   canvasRef?: React.RefObject<HTMLCanvasElement | null>;
//   duration: string;
//   previewBlob?: Blob | null;
//   onDelete: () => void;
//   onStop: () => void;
//   onSend: () => void;
// }) {
//   const canvasEl = useRef<HTMLCanvasElement | null>(null);
//   const audioEl = useRef<HTMLAudioElement | null>(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);

//   // ============ رابط الصوت للمعاينة ============
//   useEffect(() => {
//     if (!previewBlob) {
//       setPreviewUrl(null);
//       setIsPlaying(false);
//       return;
//     }
//     const url = URL.createObjectURL(previewBlob);
//     setPreviewUrl(url);
//     return () => {
//       URL.revokeObjectURL(url);
//       setIsPlaying(false);
//     };
//   }, [previewBlob]);

//   // ============ الموجة الحية أثناء التسجيل ============
//   useEffect(() => {
//     if (!isRecording) return;
//     const canvas = canvasEl.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     const dpr = window.devicePixelRatio || 1;
//     const W = canvas.clientWidth;
//     const H = canvas.clientHeight;
//     canvas.width = W * dpr;
//     canvas.height = H * dpr;
//     ctx.scale(dpr, dpr);

//     const BAR = 2;
//     const GAP = 2;
//     const STEP = BAR + GAP;
//     const count = Math.ceil(W / STEP) + 1;
//     const levels: number[] = new Array(count).fill(0);
//     let buf: Uint8Array | null = null;
//     let last = 0;
//     let raf = 0;

//     const tick = (t: number) => {
//       if (t - last > 50) {
//         last = t;
//         let level = 0;
//         const analyser = analyserRef?.current;
//         if (analyser) {
//           if (!buf || buf.length !== analyser.fftSize) buf = new Uint8Array(analyser.fftSize);
//           analyser.getByteTimeDomainData(buf as any);
//           let sum = 0;
//           for (let i = 0; i < buf.length; i++) {
//             const v = (buf[i] - 128) / 128;
//             sum += v * v;
//           }
//           level = Math.min(1, Math.sqrt(sum / buf.length) * 5);
//         }
//         levels.push(level);
//         levels.shift();
//       }

//       ctx.clearRect(0, 0, W, H);
//       ctx.fillStyle = RED;
//       for (let i = 0; i < levels.length; i++) {
//         const h = Math.max(3, levels[i] * H);
//         const x = i * STEP;
//         const y = (H - h) / 2;
//         ctx.beginPath();
//         if ((ctx as any).roundRect) (ctx as any).roundRect(x, y, BAR, h, 1);
//         else ctx.rect(x, y, BAR, h);
//         ctx.fill();
//       }
//       raf = requestAnimationFrame(tick);
//     };
//     raf = requestAnimationFrame(tick);
//     return () => cancelAnimationFrame(raf);
//   }, [isRecording, analyserRef]);

//   // ============ تشغيل / إيقاف المعاينة ============
//   const togglePlay = () => {
//     if (!audioEl.current) return;
//     if (isPlaying) {
//       audioEl.current.pause();
//       setIsPlaying(false);
//     } else {
//       audioEl.current.play();
//       setIsPlaying(true);
//     }
//   };

//   return (
//     <div
//       dir="ltr"
//       className="w-full rounded-t-[20px] px-4 pt-4 pb-3 bg-[linear-gradient(180deg,#F3F5FF_0%,#FAFBFF_100%)]"
//     >
//       {/* ============ الصف الأول: نقطة التسجيل + الموجة + المدة ============ */}
//       <div className="flex items-center gap-3 h-10">
//         <span
//           className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
//           style={{ border: `1.5px solid ${RED}` }}
//         >
//           <span
//             className={`w-[6px] h-[6px] rounded-full ${isRecording ? "animate-pulse" : ""}`}
//             style={{ background: RED }}
//           />
//         </span>

//         <div
//           className="flex-1 h-8 flex items-center"
//           style={{ WebkitMaskImage: FADE_MASK, maskImage: FADE_MASK }}
//         >
//           {isRecording ? (
//             <canvas ref={canvasEl} className="block w-full h-8" />
//           ) : (
//             <AudioPreviewBars blob={previewBlob} />
//           )}
//         </div>

//         {(isRecording || previewBlob) && (
//           <span className="text-[12px] font-bold text-[#3C3C43] tabular-nums min-w-[34px] text-right">
//             {duration}
//           </span>
//         )}
//       </div>

//       {/* ============ الصف التاني: الأزرار ============ */}
//       <div className="flex items-center justify-between mt-3 pb-5">
//         {isRecording ? (
//           // ====== وضع التسجيل: حذف / إيقاف / إرسال (معطّل) ======
//           <>
//             <IconBtn onClick={onDelete} label="حذف">
//               <TrashSvg color={RED} />
//             </IconBtn>

//             <button
//               type="button"
//               onClick={onStop}
//               className="flex items-center justify-center transition hover:opacity-90"
//               style={{
//                 width: 50,
//                 height: 50,
//                 borderRadius: 25,
//                 backgroundColor: '#D72229',
//                 border: 'none',
//                 cursor: 'pointer',
//                 flexShrink: 0,
//               }}
//               aria-label="إيقاف التسجيل"
//               title="إيقاف"
//             >
//               <img
//                 src="/imgs/PlaySvg.svg"
//                 alt="إيقاف التسجيل"
//                 style={{ width: 22, height: 22, filter: 'brightness(0) invert(1)' }}
//               />
//             </button>

//             <button
//               type="button"
//               disabled
//               className="w-9 h-9 flex items-center justify-center opacity-50 cursor-not-allowed"
//               aria-label="إرسال"
//               title="إرسال"
//             >
//               <img src="/imgs/sendBtn.svg" alt="send" className="w-[20px] h-[20px]" />
//             </button>
//           </>
//         ) : (
//           // ====== وضع المعاينة: حذف / تشغيل-إيقاف / إرسال ======
//           <>
//             <IconBtn onClick={onDelete} label="حذف">
//               <TrashSvg color={RED} />
//             </IconBtn>

//             <button
//               type="button"
//               onClick={togglePlay}
//               disabled={!previewBlob}
//               className="flex items-center justify-center transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
//               style={{
//                 width: 50,
//                 height: 50,
//                 borderRadius: 25,
//                 backgroundColor: '#FFFFFF',
//                 border: '1px solid #D72229',
//                 cursor: previewBlob ? 'pointer' : 'not-allowed',
//                 flexShrink: 0,
//                 padding: 0,
//               }}
//               aria-label={isPlaying ? "إيقاف التشغيل" : "تشغيل"}
//               title={isPlaying ? "إيقاف" : "تشغيل"}
//             >
//               <img
//                 src={isPlaying ? "/imgs/PlaySvg.svg" : "/imgs/PauseSvg.svg"}
//                 alt={isPlaying ? "إيقاف" : "تشغيل"}
//                 style={{ width: 16, height: 22 }}
//               />
//             </button>

//             <button
//               type="button"
//               onClick={onSend}
//               className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#FFF5F5] transition"
//               aria-label="إرسال"
//               title="إرسال"
//             >
//               <img src="/imgs/sendBtn.svg" alt="send" className="w-[20px] h-[20px]" />
//             </button>
//           </>
//         )}
//       </div>

//       {/* audio element مخفي للتحكم في التشغيل */}
//       {previewUrl && (
//         <audio
//           ref={audioEl}
//           src={previewUrl}
//           onEnded={() => setIsPlaying(false)}
//           onPause={() => setIsPlaying(false)}
//           onPlay={() => setIsPlaying(true)}
//           className="hidden"
//         />
//       )}
//     </div>
//   );
// }

// // ============ زر أيقونة موحّد ============
// function IconBtn({
//   onClick,
//   label,
//   children,
// }: {
//   onClick: () => void;
//   label: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#FFF5F5] transition"
//       aria-label={label}
//       title={label}
//     >
//       {children}
//     </button>
//   );
// }

// // ============ أيقونات SVG مضمّنة (بدون مكتبات) ============
// function TrashSvg({ color }: { color: string }) {
//   return (
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M3 6h18" />
//       <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
//       <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
//       <line x1="10" y1="11" x2="10" y2="17" />
//       <line x1="14" y1="11" x2="14" y2="17" />
//     </svg>
//   );
// }

// // ============ أعمدة موجة المعاينة المطابقة للشكل الحي ============
// function AudioPreviewBars({ blob }: { blob?: Blob | null }) {
//   const [peaks, setPeaks] = useState<number[]>([]);

//   useEffect(() => {
//     let canceled = false;
//     if (!blob) { setPeaks([]); return; }
//     (async () => {
//       try {
//         const ctx = new AudioContext();
//         const buf = await ctx.decodeAudioData(await blob.arrayBuffer());
//         ctx.close();
//         const data = buf.getChannelData(0);
//         const count = 170; 
//         const step = Math.floor(data.length / count) || 1;
//         const p = Array.from({ length: count }, (_, i) => {
//           let max = 0;
//           for (let j = i * step; j < (i + 1) * step && j < data.length; j++)
//             max = Math.max(max, Math.abs(data[j]));
//           return max;
//         });
//         const top = Math.max(...p) || 1;
//         if (!canceled) setPeaks(p.map((v) => v / top));
//       } catch {
//         if (!canceled) setPeaks(Array.from({ length: 70 }, () => 0.3));
//       }
//     })();
//     return () => { canceled = true; };
//   }, [blob]);

//   const defaultPeaks = Array.from({ length: 70 }, () => 0.3);
//   const displayPeaks = peaks.length ? peaks : defaultPeaks;

//   return (
//     <div className="flex items-center justify-center gap-[2px] w-full h-8">
//       {displayPeaks.map((v, i) => (
//         <div
//           key={i}
//           className="rounded-full"
//           style={{
//             width: 2,
//             height: Math.max(3, v * 28),
//             background: RED,
//             opacity: 0.85,
//           }}
//         />
//       ))}
//     </div>
//   );
// }


// app/chats/_components/VoiceRecorderBar.tsx
/* eslint-disable @next/next/no-img-element */
'use client';
import { useEffect, useRef, useState } from "react";

const RED = "#D72229";
const FADE_MASK =
  "linear-gradient(to right, transparent 0%, black 14%, black 84%, transparent 100%)";

export default function VoiceRecorderBar({
  isRecording,
  analyserRef,
  duration,
  previewBlob,
  onDelete,
  onStop,
  onSend,
}: {
  isRecording: boolean;
  analyserRef?: React.RefObject<AnalyserNode | null>;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
  duration: string;
  previewBlob?: Blob | null;
  onDelete: () => void;
  onStop: () => void;
  onSend: () => void;
}) {
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const audioEl = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // ============ رابط الصوت للمعاينة ============
  useEffect(() => {
    if (!previewBlob) {
      setPreviewUrl(null);
      setIsPlaying(false);
      return;
    }
    const url = URL.createObjectURL(previewBlob);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
      setIsPlaying(false);
    };
  }, [previewBlob]);

  // ============ الموجة الحية أثناء التسجيل ============
  useEffect(() => {
    if (!isRecording) return;
    const canvas = canvasEl.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const BAR = 2;
    const GAP = 2;
    const STEP = BAR + GAP;
    const count = Math.ceil(W / STEP) + 1;
    const levels: number[] = new Array(count).fill(0);
    let buf: Uint8Array | null = null;
    let last = 0;
    let raf = 0;

    const tick = (t: number) => {
      if (t - last > 50) {
        last = t;
        let level = 0;
        const analyser = analyserRef?.current;
        if (analyser) {
          if (!buf || buf.length !== analyser.fftSize) buf = new Uint8Array(analyser.fftSize);
          analyser.getByteTimeDomainData(buf as any);
          let sum = 0;
          for (let i = 0; i < buf.length; i++) {
            const v = (buf[i] - 128) / 128;
            sum += v * v;
          }
          level = Math.min(1, Math.sqrt(sum / buf.length) * 5);
        }
        levels.push(level);
        levels.shift();
      }

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = RED;
      for (let i = 0; i < levels.length; i++) {
        const h = Math.max(3, levels[i] * H);
        const x = i * STEP;
        const y = (H - h) / 2;
        ctx.beginPath();
        if ((ctx as any).roundRect) (ctx as any).roundRect(x, y, BAR, h, 1);
        else ctx.rect(x, y, BAR, h);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isRecording, analyserRef]);

  // ============ تشغيل / إيقاف المعاينة ============
  const togglePlay = () => {
    if (!audioEl.current) return;
    if (isPlaying) {
      audioEl.current.pause();
      setIsPlaying(false);
    } else {
      audioEl.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div
      dir="ltr"
      className="w-full rounded-t-[20px] px-4 pt-4 pb-3 bg-[linear-gradient(180deg,#F3F5FF_0%,#FAFBFF_100%)]"
    >
      {/* ============ الصف الأول: نقطة التسجيل + الموجة + المدة ============ */}
      <div className="flex items-center gap-3 h-10">
        <span
          className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
          style={{ border: `1.5px solid ${RED}` }}
        >
          <span
            className={`w-[6px] h-[6px] rounded-full ${isRecording ? "animate-pulse" : ""}`}
            style={{ background: RED }}
          />
        </span>

        <div
          className="flex-1 h-8 flex items-center"
          style={{ WebkitMaskImage: FADE_MASK, maskImage: FADE_MASK }}
        >
          {isRecording ? (
            <canvas ref={canvasEl} className="block w-full h-8" />
          ) : (
            <AudioPreviewBars blob={previewBlob} />
          )}
        </div>

        {(isRecording || previewBlob) && (
          <span className="text-[12px] font-bold text-[#3C3C43] tabular-nums min-w-[34px] text-right">
            {duration}
          </span>
        )}
      </div>

      {/* ============ الصف التاني: الأزرار ============ */}
      <div className="flex items-center justify-between mt-3 pb-5">
        {isRecording ? (
          // ====== وضع التسجيل: حذف / إيقاف / إرسال (معطّل) ======
          <>
            <IconBtn onClick={onDelete} label="حذف">
              <TrashSvg color={RED} />
            </IconBtn>

            <button
              type="button"
              onClick={onStop}
              className="flex items-center justify-center transition hover:opacity-90"
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: '#D72229',
                border: 'none',
                cursor: 'pointer',
                flexShrink: 0,
              }}
              aria-label="إيقاف التسجيل"
              title="إيقاف"
            >
              <img
                src="/imgs/PlaySvg.svg"
                alt="إيقاف التسجيل"
                style={{ width: 22, height: 22, filter: 'brightness(0) invert(1)' }}
              />
            </button>

            <button
              type="button"
              disabled
              className="w-9 h-9 flex items-center justify-center opacity-50 cursor-not-allowed"
              aria-label="إرسال"
              title="إرسال"
            >
              <img src="/imgs/sendBtn.svg" alt="send" className="w-[20px] h-[20px]" />
            </button>
          </>
        ) : (
          // ====== وضع المعاينة: حذف / تشغيل-إيقاف / إرسال ======
          <>
            <IconBtn onClick={onDelete} label="حذف">
              <TrashSvg color={RED} />
            </IconBtn>

            <button
              type="button"
              onClick={togglePlay}
              disabled={!previewBlob}
              className="flex items-center justify-center transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: '#FFFFFF',
                border: '1px solid #D72229',
                cursor: previewBlob ? 'pointer' : 'not-allowed',
                flexShrink: 0,
                padding: 0,
              }}
              aria-label={isPlaying ? "إيقاف التشغيل" : "تشغيل"}
              title={isPlaying ? "إيقاف" : "تشغيل"}
            >
              <img
                src={isPlaying ? "/imgs/PlaySvg.svg" : "/imgs/PauseSvg.svg"}
                alt={isPlaying ? "إيقاف" : "تشغيل"}
                style={{ width: 16, height: 22 }}
              />
            </button>

            <button
              type="button"
              onClick={onSend}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#FFF5F5] transition"
              aria-label="إرسال"
              title="إرسال"
            >
              <img src="/imgs/sendBtn.svg" alt="send" className="w-[20px] h-[20px]" />
            </button>
          </>
        )}
      </div>

      {/* audio element مخفي للتحكم في التشغيل */}
      {previewUrl && (
        <audio
          ref={audioEl}
          src={previewUrl}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          className="hidden"
        />
      )}
    </div>
  );
}

// ============ زر أيقونة موحّد ============
function IconBtn({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#FFF5F5] transition"
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}

// ============ أيقونات SVG مضمّنة (بدون مكتبات) ============
function TrashSvg({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

// ============ أعمدة موجة المعاينة المطابقة للشكل الحي ============
function AudioPreviewBars({ blob }: { blob?: Blob | null }) {
  const [peaks, setPeaks] = useState<number[]>([]);

  useEffect(() => {
    let canceled = false;
    if (!blob) { setPeaks([]); return; }
    (async () => {
      try {
        const ctx = new AudioContext();
        const buf = await ctx.decodeAudioData(await blob.arrayBuffer());
        ctx.close();
        const data = buf.getChannelData(0);
        const count = 170; 
        const step = Math.floor(data.length / count) || 1;
        const p = Array.from({ length: count }, (_, i) => {
          let max = 0;
          for (let j = i * step; j < (i + 1) * step && j < data.length; j++)
            max = Math.max(max, Math.abs(data[j]));
          return max;
        });
        const top = Math.max(...p) || 1;
        if (!canceled) setPeaks(p.map((v) => v / top));
      } catch {
        if (!canceled) setPeaks(Array.from({ length: 170 }, () => 0.3));
      }
    })();
    return () => { canceled = true; };
  }, [blob]);

  const defaultPeaks = Array.from({ length: 170 }, () => 0.3);
  const displayPeaks = peaks.length ? peaks : defaultPeaks;

  return (
    <div className="flex items-center justify-center gap-[2px] w-full h-8">
      {displayPeaks.map((v, i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            width: 2,
            height: Math.max(3, v * 28),
            background: RED,
            opacity: 0.85,
          }}
        />
      ))}
    </div>
  );
}