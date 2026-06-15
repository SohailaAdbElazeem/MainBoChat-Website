// // /* eslint-disable react/jsx-key */
// // /* eslint-disable @next/next/no-img-element */
// // /* eslint-disable @typescript-eslint/no-explicit-any */
// // "use client";
// // import { useEffect, useState, useRef } from "react";

// // type Video = {
// //   _id: string;
// //   name: string;
// //   username: string;
// //   userimg: string;
// //   video: { video: string }[];
// //   likes: any[];
// //   views: number;
// //   createdAt: string;
// // };

// // type ReelsFeedProps = {
// //   currentUserId?: string;
// //   authToken?: string;
// // };

// // export default function ReelsFeed({ currentUserId = "", authToken = "" }: ReelsFeedProps) {
// //   const [videos, setVideos] = useState<Video[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [loadingMore, setLoadingMore] = useState(false);
// //   const [page, setPage] = useState(1);
// //   const [hasMore, setHasMore] = useState(true);
// //   const [activeIndex, setActiveIndex] = useState(0);
// //   const [showOverlay, setShowOverlay] = useState(false);
// //   const [playingIndex, setPlayingIndex] = useState<number | null>(null);
// //   const [isPlayingOverlay, setIsPlayingOverlay] = useState(false);
// //   const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
// //   const videoRef = useRef<HTMLVideoElement | null>(null);
// //   const containerRef = useRef<HTMLDivElement | null>(null);
// //   const [progress, setProgress] = useState(0);
// //   const [videoWidth, setVideoWidth] = useState<number | null>(null);

// //   const [showUnfollowModal, setShowUnfollowModal] = useState(false);
// //   const [unfollowTargetVideo, setUnfollowTargetVideo] = useState<Video | null>(null);
// //   const [isUnfollowing, setIsUnfollowing] = useState(false);

// //   const fetchVideos = async (pageToFetch = 1, limit = 10) => {
// //     if ((loading && pageToFetch !== 1) || loadingMore || !hasMore) return;
// //     if (pageToFetch === 1) setLoading(true);
// //     else setLoadingMore(true);

// //     try {
// //       const res = await fetch(
// //         `http://bo-chat.space/bestvideosTest/null?page=${pageToFetch}&limit=${limit}`
// //       );
// //       const data = await res.json();
// //       if (!Array.isArray(data) || data.length === 0) {
// //         setHasMore(false);
// //       } else {
// //         setVideos((prev) => (pageToFetch === 1 ? data : [...prev, ...data]));
// //         setPage(pageToFetch + 1);
// //       }
// //     } catch (err) {
// //       console.error("Error fetching videos:", err);
// //     } finally {
// //       if (pageToFetch === 1) setLoading(false);
// //       else setLoadingMore(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchVideos(1, 10);
// //   }, []);

// //   useEffect(() => {
// //     if (!hasMore) return;
// //     if (activeIndex >= videos.length - 1 && videos.length > 0) {
// //       fetchVideos(page, 10);
// //     }
// //   }, [activeIndex, videos.length, hasMore]);

// //   const handleScroll = (e: React.WheelEvent<HTMLDivElement>) => {
// //     if (e.deltaY > 0) handleNextVideo();
// //     else if (e.deltaY < 0) handlePrevVideo();
// //   };

// //   const stopAllVideos = () => {
// //     videoRefs.current.forEach((v) => {
// //       if (v) {
// //         v.pause();
// //         v.currentTime = 0;
// //       }
// //     });
// //   };

// //   const handleNextVideo = () => {
// //     stopAllVideos();
// //     setPlayingIndex(null);
// //     setActiveIndex((prev) => (prev < videos.length - 1 ? prev + 1 : prev));
// //   };

// //   const handlePrevVideo = () => {
// //     stopAllVideos();
// //     setPlayingIndex(null);
// //     setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
// //   };

// //   const handleOverlay = () => {
// //     setShowOverlay(true);
// //     setProgress(0);
// //     stopAllVideos();
// //     setIsPlayingOverlay(true);
// //     setTimeout(() => {
// //       if (videoRef.current) {
// //         const rect = videoRef.current.getBoundingClientRect();
// //         setVideoWidth(rect.width);
// //         videoRef.current.play().catch(() => {});
// //       }
// //     }, 300);
// //   };

// //   const handleCloseOverlay = () => {
// //     setShowOverlay(false);
// //     setIsPlayingOverlay(false);
// //     if (videoRef.current) videoRef.current.pause();
// //   };

// //   const handleTimeUpdate = () => {
// //     if (videoRef.current && videoRef.current.duration) {
// //       const progressValue =
// //         (videoRef.current.currentTime / videoRef.current.duration) * 100;
// //       setProgress(progressValue);
// //     }
// //   };

// //   const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
// //     if (!videoRef.current) return;
// //     const rect = e.currentTarget.getBoundingClientRect();
// //     const seekTime =
// //       ((e.clientX - rect.left) / rect.width) * videoRef.current.duration;
// //     videoRef.current.currentTime = seekTime;
// //   };

// //   const togglePlay = (index: number) => {
// //     const video = videoRefs.current[index];
// //     if (!video) return;

// //     if (playingIndex === index) {
// //       video.pause();
// //       setPlayingIndex(null);
// //     } else {
// //       stopAllVideos();
// //       video.play().catch(() => {});
// //       setPlayingIndex(index);
// //     }
// //   };

// //   const togglePlayOverlay = () => {
// //     if (!videoRef.current) return;
// //     if (isPlayingOverlay) {
// //       videoRef.current.pause();
// //       setIsPlayingOverlay(false);
// //     } else {
// //       videoRef.current.play().catch(() => {});
// //       setIsPlayingOverlay(true);
// //     }
// //   };

// //   const handleVideoProgress = () => {
// //     const video = videoRefs.current[activeIndex];
// //     if (!video || !video.duration) return;
// //     setProgress((video.currentTime / video.duration) * 100);
// //   };

// //   useEffect(() => {
// //     videoRefs.current = videoRefs.current.slice(0, videos.length);
// //   }, [videos.length]);

// //   const openUnfollowModal = (video: Video) => {
// //     setUnfollowTargetVideo(video);
// //     setShowUnfollowModal(true);
// //   };

// //   const closeUnfollowModal = () => {
// //     setShowUnfollowModal(false);
// //     setUnfollowTargetVideo(null);
// //   };

// //   const confirmUnfollow = async () => {
// //     if (!unfollowTargetVideo || isUnfollowing) return;
// //     if (!currentUserId) {
// //       console.error("currentUserId is missing");
// //       return;
// //     }

// //     const endpoints = ["https://bo-chat.space/follow", "http://bo-chat.space/follow"];
// //     const body = {
// //       followerid: currentUserId,
// //       followingid: unfollowTargetVideo._id,
// //     };

// //     setIsUnfollowing(true);

// //     for (const endpoint of endpoints) {
// //       try {
// //         const response = await fetch(endpoint, {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${authToken}`,
// //           },
// //           body: JSON.stringify(body),
// //         });
// //         if (response.ok) {
// //           console.log("Unfollow successful");
// //           closeUnfollowModal();
// //           break;
// //         } else {
// //           console.error(`Unfollow failed with status ${response.status}`);
// //         }
// //       } catch (err) {
// //         console.error(`Error with endpoint ${endpoint}:`, err);
// //       }
// //     }
// //     setIsUnfollowing(false);
// //   };

// //   return (
// //     <div
// //       className="relative h-[520px] max-w-full rounded-[20px] overflow-hidden bg-black mx-auto"
// //       onWheel={handleScroll}
// //     >
// //       {videos.map((video, index) => (
// //         <div
// //           key={video._id}
// //           className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
// //             index === activeIndex
// //               ? "translate-y-0"
// //               : index < activeIndex
// //               ? "-translate-y-full"
// //               : "translate-y-full"
// //           }`}
// //         >
// //           <video
// //             ref={(el) => (videoRefs.current[index] = el)}
// //             src={video.video[0]?.video}
// //             className="h-full w-full object-cover cursor-pointer"
// //             loop
// //             muted
// //             playsInline
// //             onTimeUpdate={index === activeIndex ? handleVideoProgress : undefined}
// //             controlsList="nodownload noremoteplayback"
// //             disablePictureInPicture
// //           />
// //           {index === activeIndex && (
// //             <div
// //               dir="ltr"
// //               className="absolute bottom-7 left-4 right-4 h-[4px] bg-white/20 rounded-full overflow-hidden"
// //             >
// //               <div
// //                 className="h-full bg-red-600 rounded-full transition-all"
// //                 style={{ width: `${progress}%` }}
// //               />
// //             </div>
// //           )}

// //           <div className="absolute top-5 right-4 backdrop-blur-md rounded-[17px] pl-2 flex items-center gap-3">
// //             <img
// //               src={video.userimg}
// //               alt={video.name}
// //               className="w-10 h-10 rounded-[17px] border border-white/30"
// //             />
// //             <div>
// //               <p className="text-white font-semibold">{video.name}</p>
// //               <p className="text-gray-300 text-sm">{video.username}</p>
// //             </div>
// //           </div>

// //           <div className="absolute bg-[#FFFFFF]/30 top-5 left-4 flex items-center px-3 py-2 backdrop-blur-md text-white gap-3 rounded-[17px]">
// //             <span className="text-sm">{video.views || 0}</span>
// //             <img src="/icons/eye.svg" className="rounded-17px" alt="" />
// //           </div>

// //           <div className="absolute right-4 top-1/2 transform-y -translate-y-1/2 flex flex-col items-center gap-1">
// //             <button
// //               onClick={handleOverlay}
// //               className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[40px] h-[40px] hover:bg-[#fff]/20 transition"
// //             >
// //               <img src="/icons/fullscreen.svg" alt="" />
// //             </button>

// //             <button
// //               onClick={() => openUnfollowModal(video)}
// //               className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[40px] h-[40px] hover:bg-[#fff]/20 transition"
// //             >
// //               <img src="/icons/options-white.svg" alt="options" />
// //             </button>

// //             <button
// //               onClick={() => togglePlay(index)}
// //               className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[40px] h-[40px] hover:bg-[#fff]/20 transition"
// //             >
// //               <img
// //                 src={playingIndex === index ? "/imgs/Group 9081.svg" : "/icons/play.svg"}
// //                 alt={playingIndex === index ? "Pause" : "Play"}
// //               />
// //             </button>

// //             <button
// //               onClick={handlePrevVideo}
// //               className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[40px] h-[40px] hover:bg-[#fff]/20 transition"
// //             >
// //               <img src="/icons/arrow-up.svg" alt="prev" />
// //             </button>
// //             <button
// //               onClick={handleNextVideo}
// //               className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[40px] h-[40px] hover:bg-[#fff]/20 transition"
// //             >
// //               <img src="/icons/arrow-down.svg" alt="next" />
// //             </button>

// //             <button className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[40px] h-[40px] hover:bg-[#fff]/20 transition">
// //               <img src="/icons/like-white.svg" alt="like" />
// //             </button>
// //             <button className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[40px] h-[40px] hover:bg-[#fff]/20 transition">
// //               <img src="/icons/comment-white.svg" alt="comment" />
// //             </button>
// //             <button className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[40px] h-[40px] hover:bg-[#fff]/20 transition">
// //               <img src="/icons/share-white.svg" alt="share" />
// //             </button>
// //           </div>
// //         </div>
// //       ))}

// //       {/* Fullscreen Overlay */}
// //       {showOverlay && (
// //         <div
// //           ref={containerRef}
// //           className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center"
// //         >
// //           <div className="relative">
// //             <video
// //               ref={videoRef}
// //               src={videos[activeIndex]?.video[0]?.video}
// //               className="max-h-[90vh] max-w-[90vw] rounded-[20px]"
// //               autoPlay
// //               playsInline
// //               onTimeUpdate={handleTimeUpdate}
// //               onPlay={() => setIsPlayingOverlay(true)}
// //               onPause={() => setIsPlayingOverlay(false)}
// //               controlsList="nodownload noremoteplayback"
// //               disablePictureInPicture
// //             />

// //             <div className="absolute top-5 right-4 flex items-center gap-3">
// //               <img
// //                 src={videos[activeIndex]?.userimg}
// //                 alt={videos[activeIndex]?.name}
// //                 className="w-10 h-10 rounded-[17px] border border-white/30"
// //               />
// //               <div>
// //                 <p className="text-white font-semibold">{videos[activeIndex]?.name}</p>
// //                 <p className="text-gray-300 text-sm">{videos[activeIndex]?.username}</p>
// //               </div>
// //             </div>

// //             <div className="absolute top-1/7 right-2 gap-2">
// //               {/* زر الخيارات مع onClick لفتح المودال */}
// //               <button
// //                 onClick={() => openUnfollowModal(videos[activeIndex])}
// //                 className="text-white rounded-full bg-[#000000]/15 mb-2 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition"
// //               >
// //                 <img src="/icons/options-white.svg" alt="" />
// //               </button>
// //               <button
// //                 onClick={togglePlayOverlay}
// //                 className="text-white rounded-full bg-[#000000]/15 mb-2 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition"
// //               >
// //                 <img
// //                   src={isPlayingOverlay ? "/imgs/Group 9081.svg" : "/icons/play.svg"}
// //                   alt={isPlayingOverlay ? "Pause" : "Play"}
// //                 />
// //               </button>
// //               <button className="text-white rounded-full bg-[#000000]/15 mb-2 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition">
// //                 <img src="/icons/like-white.svg" alt="" />
// //               </button>
// //               <button className="text-white rounded-full bg-[#000000]/15 mb-2 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition">
// //                 <img src="/icons/comment-white.svg" alt="" />
// //               </button>
// //               <button className="text-white rounded-full bg-[#000000]/15 mb-2 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition">
// //                 <img src="/icons/share-white.svg" alt="" />
// //               </button>
// //             </div>

// //             <div className="absolute bg-[#FFFFFF]/30 top-5 left-4 flex items-center px-3 py-2 backdrop-blur-md text-white gap-3 rounded-[17px]">
// //               <span className="text-sm">{videos[activeIndex]?.views || 0}</span>
// //               <img src="/icons/eye.svg" className="rounded-17px" alt="" />
// //             </div>
// //           </div>

// //           <h1 className="absolute top-15 right-8 text-white text-xl transition">الريلز</h1>
// //           <div className="absolute top-1/2 right-8">
// //             <button
// //               onClick={handleCloseOverlay}
// //               className="w-[45px] h-[45px] rounded-full bg-[#fff]/15 mb-3 backdrop-blur-md flex items-center justify-center cursor-pointer transition"
// //             >
// //               <img src="/icons/close.svg" alt="" />
// //             </button>
// //             <button
// //               onClick={handlePrevVideo}
// //               className="text-white rounded-full bg-[#fff]/15 mb-3 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition"
// //             >
// //               <img src="/icons/arrow-up.svg" alt="prev" />
// //             </button>
// //             <button
// //               onClick={handleNextVideo}
// //               className="text-white rounded-full bg-[#fff]/15 mb-3 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition"
// //             >
// //               <img src="/icons/arrow-down.svg" alt="next" />
// //             </button>
// //           </div>

// //           <div
// //             onClick={handleSeek}
// //             className="absolute bottom-[10vh] left-1/2 -translate-x-1/2 bg-gray-600 rounded-full cursor-pointer overflow-hidden"
// //             style={{
// //               width: videoWidth ? `${videoWidth - 30}px` : "calc(70% - 8px)",
// //               height: "6px",
// //               direction: "ltr",
// //             }}
// //           >
// //             <div
// //               className="h-full bg-red-600 rounded-full transition-all"
// //               style={{ width: `${progress}%` }}
// //             ></div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Unfollow Modal */}
// //    {/* Unfollow Modal */}
// // {showUnfollowModal && (
// //   <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
// //     <div
// //       className="w-[237px] h-[271px] rounded-[26px] flex flex-col items-center justify-between py-6"
// //       style={{
// //         background: "#00000080",
// //         backdropFilter: "blur(15px)",
// //       }}
// //     >
// //       <h2 className="text-[#F92429] font-semibold text-[18px] leading-[100%] text-center mt-4">
// //         إلغاء المتابعة؟
// //       </h2>
     
// //       <p className="text-white font-semibold text-[12px] leading-relaxed text-center w-[226px] mt-5">
// //   لن ترى تحديثات هذا المستخدم في صفحتك بعد الآن
// // </p>
// //       <button
// //         onClick={confirmUnfollow}
// //         disabled={isUnfollowing}
// //         className="w-[185px] h-[50px] rounded-[19px] border border-[#D72229] flex items-center justify-center bg-transparent mt-7"
// //       >
// //         <span className="text-[#D72229] font-semibold text-[17px] leading-[100%]">
// //           {isUnfollowing ? "جاري..." : "إلغاء المتابعة"}
// //         </span>
// //       </button>
// //       {/* الخط الفاصل */}
// //       <div className="w-[239px] h-[0px] border-t border-[#70707033] my-2" />
// //      <button
// //   onClick={closeUnfollowModal}
// //   className="w-[185px] h-[50px] rounded-[19px] border border-[#D72229] flex items-center justify-center bg-[#D72229]"
// // >
// //   <span className="text-white font-semibold text-[17px] leading-[100%]">
// //     إلغاء
// //   </span>
// // </button>
// //     </div>
// //   </div>
// // )}
// //     </div>
// //   );
// // }

// // Update
// "use client";
// import { useEffect, useState, useRef } from "react";

// type Video = {
//   _id: string;
//   name: string;
//   username: string;
//   userimg: string;
//   video: { video: string }[];
//   likes: any[];
//   views: number;
//   createdAt: string;
// };

// type ReelsFeedProps = {
//   currentUserId?: string;
// };

// export default function ReelsFeed({ currentUserId: propUserId = "" }: ReelsFeedProps) {
//   const [videos, setVideos] = useState<Video[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [showOverlay, setShowOverlay] = useState(false);
//   const [playingIndex, setPlayingIndex] = useState<number | null>(null);
//   const [isPlayingOverlay, setIsPlayingOverlay] = useState(false);
//   const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const [progress, setProgress] = useState(0);
//   const [videoWidth, setVideoWidth] = useState<number | null>(null);

//   const [showUnfollowModal, setShowUnfollowModal] = useState(false);
//   const [unfollowTargetVideo, setUnfollowTargetVideo] = useState<Video | null>(null);
//   const [isUnfollowing, setIsUnfollowing] = useState(false);

//   // جلب currentUserId من localStorage إذا لم يتم تمريره
//   const getCurrentUserId = () => {
//     if (propUserId) return propUserId;
//     try {
//       const userData = localStorage.getItem("userData");
//       if (userData) {
//         const parsed = JSON.parse(userData);
//         return parsed._id || "";
//       }
//     } catch (e) {
//       console.error("Error parsing userData", e);
//     }
//     return "";
//   };

//   const getAuthToken = () => {
//     if (typeof window !== "undefined") {
//       return localStorage.getItem("accessToken") || "";
//     }
//     return "";
//   };

//   const fetchVideos = async (pageToFetch = 1, limit = 10) => {
//     if ((loading && pageToFetch !== 1) || loadingMore || !hasMore) return;
//     if (pageToFetch === 1) setLoading(true);
//     else setLoadingMore(true);

//     try {
//       const res = await fetch(
//         `http://bo-chat.space/bestvideosTest/null?page=${pageToFetch}&limit=${limit}`
//       );
//       const data = await res.json();
//       if (!Array.isArray(data) || data.length === 0) {
//         setHasMore(false);
//       } else {
//         setVideos((prev) => (pageToFetch === 1 ? data : [...prev, ...data]));
//         setPage(pageToFetch + 1);
//       }
//     } catch (err) {
//       console.error("Error fetching videos:", err);
//     } finally {
//       if (pageToFetch === 1) setLoading(false);
//       else setLoadingMore(false);
//     }
//   };

//   useEffect(() => {
//     fetchVideos(1, 10);
//   }, []);

//   useEffect(() => {
//     if (!hasMore) return;
//     if (activeIndex >= videos.length - 1 && videos.length > 0) {
//       fetchVideos(page, 10);
//     }
//   }, [activeIndex, videos.length, hasMore]);

//   const handleScroll = (e: React.WheelEvent<HTMLDivElement>) => {
//     if (e.deltaY > 0) handleNextVideo();
//     else if (e.deltaY < 0) handlePrevVideo();
//   };

//   const stopAllVideos = () => {
//     videoRefs.current.forEach((v) => {
//       if (v) {
//         v.pause();
//         v.currentTime = 0;
//       }
//     });
//   };

//   const handleNextVideo = () => {
//     stopAllVideos();
//     setPlayingIndex(null);
//     setActiveIndex((prev) => (prev < videos.length - 1 ? prev + 1 : prev));
//   };

//   const handlePrevVideo = () => {
//     stopAllVideos();
//     setPlayingIndex(null);
//     setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
//   };

//   const handleOverlay = () => {
//     setShowOverlay(true);
//     setProgress(0);
//     stopAllVideos();
//     setIsPlayingOverlay(true);
//     setTimeout(() => {
//       if (videoRef.current) {
//         const rect = videoRef.current.getBoundingClientRect();
//         setVideoWidth(rect.width);
//         videoRef.current.play().catch(() => {});
//       }
//     }, 300);
//   };

//   const handleCloseOverlay = () => {
//     setShowOverlay(false);
//     setIsPlayingOverlay(false);
//     if (videoRef.current) videoRef.current.pause();
//   };

//   const handleTimeUpdate = () => {
//     if (videoRef.current && videoRef.current.duration) {
//       const progressValue =
//         (videoRef.current.currentTime / videoRef.current.duration) * 100;
//       setProgress(progressValue);
//     }
//   };

//   const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
//     if (!videoRef.current) return;
//     const rect = e.currentTarget.getBoundingClientRect();
//     const seekTime =
//       ((e.clientX - rect.left) / rect.width) * videoRef.current.duration;
//     videoRef.current.currentTime = seekTime;
//   };

//   const togglePlay = (index: number) => {
//     const video = videoRefs.current[index];
//     if (!video) return;

//     if (playingIndex === index) {
//       video.pause();
//       setPlayingIndex(null);
//     } else {
//       stopAllVideos();
//       video.play().catch(() => {});
//       setPlayingIndex(index);
//     }
//   };

//   const togglePlayOverlay = () => {
//     if (!videoRef.current) return;
//     if (isPlayingOverlay) {
//       videoRef.current.pause();
//       setIsPlayingOverlay(false);
//     } else {
//       videoRef.current.play().catch(() => {});
//       setIsPlayingOverlay(true);
//     }
//   };

//   const handleVideoProgress = () => {
//     const video = videoRefs.current[activeIndex];
//     if (!video || !video.duration) return;
//     setProgress((video.currentTime / video.duration) * 100);
//   };

//   useEffect(() => {
//     videoRefs.current = videoRefs.current.slice(0, videos.length);
//   }, [videos.length]);

//   const openUnfollowModal = (video: Video) => {
//     setUnfollowTargetVideo(video);
//     setShowUnfollowModal(true);
//   };

//   const closeUnfollowModal = () => {
//     setShowUnfollowModal(false);
//     setUnfollowTargetVideo(null);
//   };

//   const confirmUnfollow = async () => {
//     console.log("confirmUnfollow called");
//     if (!unfollowTargetVideo) {
//       console.error("No target video");
//       return;
//     }
//     if (isUnfollowing) {
//       console.log("Already unfollowing");
//       return;
//     }

//     const currentUserId = getCurrentUserId();
//     console.log("currentUserId:", currentUserId);
//     if (!currentUserId) {
//       console.error("currentUserId is missing");
//       alert("لا يمكن إلغاء المتابعة: لم يتم التعرف على المستخدم الحالي");
//       return;
//     }

//     const authToken = getAuthToken();
//     console.log("authToken exists?", !!authToken);
//     if (!authToken) {
//       console.error("No auth token found");
//       alert("لا يمكن إلغاء المتابعة: يرجى تسجيل الدخول مرة أخرى");
//       return;
//     }

//     const endpoint = "http://bo-chat.space/follow";
//     const body = {
//       followerid: currentUserId,
//       followingid: unfollowTargetVideo._id,
//     };
//     console.log("Sending request to:", endpoint);
//     console.log("Body:", body);

//     setIsUnfollowing(true);

//     try {
//       const response = await fetch(endpoint, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${authToken}`,
//         },
//         body: JSON.stringify(body),
//       });

//       console.log("Response status:", response.status);
//       let data;
//       try {
//         data = await response.json();
//         console.log("Response data:", data);
//       } catch (e) {
//         console.log("No JSON response");
//       }

//       if (response.ok) {
//         console.log("Unfollow successful");
//         alert("تم إلغاء المتابعة بنجاح");
//         closeUnfollowModal();
//         // يمكن إزالة الفيديو من القائمة
//         // setVideos(prev => prev.filter(v => v._id !== unfollowTargetVideo._id));
//       } else {
//         console.error(`Unfollow failed with status ${response.status}`);
//         alert(`فشل إلغاء المتابعة: ${response.status}`);
//       }
//     } catch (err) {
//       console.error("Error unfollowing:", err);
//       alert("حدث خطأ في الاتصال بالخادم");
//     } finally {
//       setIsUnfollowing(false);
//     }
//   };

//   return (
//     <div
//       className="relative h-[520px] max-w-full rounded-[20px] overflow-hidden bg-black mx-auto"
//       onWheel={handleScroll}
//     >
//       {videos.map((video, index) => (
//         <div
//           key={video._id}
//           className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
//             index === activeIndex
//               ? "translate-y-0"
//               : index < activeIndex
//               ? "-translate-y-full"
//               : "translate-y-full"
//           }`}
//         >
//           <video
//             ref={(el) => (videoRefs.current[index] = el)}
//             src={video.video[0]?.video}
//             className="h-full w-full object-cover cursor-pointer"
//             loop
//             muted
//             playsInline
//             onTimeUpdate={index === activeIndex ? handleVideoProgress : undefined}
//             controlsList="nodownload noremoteplayback"
//             disablePictureInPicture
//           />
//           {index === activeIndex && (
//             <div
//               dir="ltr"
//               className="absolute bottom-7 left-4 right-4 h-[4px] bg-white/20 rounded-full overflow-hidden"
//             >
//               <div
//                 className="h-full bg-red-600 rounded-full transition-all"
//                 style={{ width: `${progress}%` }}
//               />
//             </div>
//           )}

//           <div className="absolute top-5 right-4 backdrop-blur-md rounded-[17px] pl-2 flex items-center gap-3">
//             <img
//               src={video.userimg}
//               alt={video.name}
//               className="w-10 h-10 rounded-[17px] border border-white/30"
//             />
//             <div>
//               <p className="text-white font-semibold">{video.name}</p>
//               <p className="text-gray-300 text-sm">{video.username}</p>
//             </div>
//           </div>

//           <div className="absolute bg-[#FFFFFF]/30 top-5 left-4 flex items-center px-3 py-2 backdrop-blur-md text-white gap-3 rounded-[17px]">
//             <span className="text-sm">{video.views || 0}</span>
//             <img src="/icons/eye.svg" className="rounded-17px" alt="" />
//           </div>

//           <div className="absolute right-4 top-1/2 transform-y -translate-y-1/2 flex flex-col items-center gap-1">
//             <button
//               onClick={handleOverlay}
//               className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[40px] h-[40px] hover:bg-[#fff]/20 transition"
//             >
//               <img src="/icons/fullscreen.svg" alt="" />
//             </button>

//             <button
//               onClick={() => openUnfollowModal(video)}
//               className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[40px] h-[40px] hover:bg-[#fff]/20 transition"
//             >
//               <img src="/icons/options-white.svg" alt="options" />
//             </button>

//             <button
//               onClick={() => togglePlay(index)}
//               className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[40px] h-[40px] hover:bg-[#fff]/20 transition"
//             >
//               <img
//                 src={playingIndex === index ? "/imgs/Group 9081.svg" : "/icons/play.svg"}
//                 alt={playingIndex === index ? "Pause" : "Play"}
//               />
//             </button>

//             <button
//               onClick={handlePrevVideo}
//               className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[40px] h-[40px] hover:bg-[#fff]/20 transition"
//             >
//               <img src="/icons/arrow-up.svg" alt="prev" />
//             </button>
//             <button
//               onClick={handleNextVideo}
//               className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[40px] h-[40px] hover:bg-[#fff]/20 transition"
//             >
//               <img src="/icons/arrow-down.svg" alt="next" />
//             </button>

//             <button className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[40px] h-[40px] hover:bg-[#fff]/20 transition">
//               <img src="/icons/like-white.svg" alt="like" />
//             </button>
//             <button className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[40px] h-[40px] hover:bg-[#fff]/20 transition">
//               <img src="/icons/comment-white.svg" alt="comment" />
//             </button>
//             <button className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[40px] h-[40px] hover:bg-[#fff]/20 transition">
//               <img src="/icons/share-white.svg" alt="share" />
//             </button>
//           </div>
//         </div>
//       ))}

//       {/* Fullscreen Overlay */}
//       {showOverlay && (
//         <div
//           ref={containerRef}
//           className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center"
//         >
//           <div className="relative">
//             <video
//               ref={videoRef}
//               src={videos[activeIndex]?.video[0]?.video}
//               className="max-h-[90vh] max-w-[90vw] rounded-[20px]"
//               autoPlay
//               playsInline
//               onTimeUpdate={handleTimeUpdate}
//               onPlay={() => setIsPlayingOverlay(true)}
//               onPause={() => setIsPlayingOverlay(false)}
//               controlsList="nodownload noremoteplayback"
//               disablePictureInPicture
//             />

//             <div className="absolute top-5 right-4 flex items-center gap-3">
//               <img
//                 src={videos[activeIndex]?.userimg}
//                 alt={videos[activeIndex]?.name}
//                 className="w-10 h-10 rounded-[17px] border border-white/30"
//               />
//               <div>
//                 <p className="text-white font-semibold">{videos[activeIndex]?.name}</p>
//                 <p className="text-gray-300 text-sm">{videos[activeIndex]?.username}</p>
//               </div>
//             </div>

//             <div className="absolute top-1/7 right-2 gap-2">
//               <button
//                 onClick={() => openUnfollowModal(videos[activeIndex])}
//                 className="text-white rounded-full bg-[#000000]/15 mb-2 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition"
//               >
//                 <img src="/icons/options-white.svg" alt="" />
//               </button>
//               <button
//                 onClick={togglePlayOverlay}
//                 className="text-white rounded-full bg-[#000000]/15 mb-2 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition"
//               >
//                 <img
//                   src={isPlayingOverlay ? "/imgs/Group 9081.svg" : "/icons/play.svg"}
//                   alt={isPlayingOverlay ? "Pause" : "Play"}
//                 />
//               </button>
//               <button className="text-white rounded-full bg-[#000000]/15 mb-2 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition">
//                 <img src="/icons/like-white.svg" alt="" />
//               </button>
//               <button className="text-white rounded-full bg-[#000000]/15 mb-2 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition">
//                 <img src="/icons/comment-white.svg" alt="" />
//               </button>
//               <button className="text-white rounded-full bg-[#000000]/15 mb-2 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition">
//                 <img src="/icons/share-white.svg" alt="" />
//               </button>
//             </div>

//             <div className="absolute bg-[#FFFFFF]/30 top-5 left-4 flex items-center px-3 py-2 backdrop-blur-md text-white gap-3 rounded-[17px]">
//               <span className="text-sm">{videos[activeIndex]?.views || 0}</span>
//               <img src="/icons/eye.svg" className="rounded-17px" alt="" />
//             </div>
//           </div>

//           <h1 className="absolute top-15 right-8 text-white text-xl transition">الريلز</h1>
//           <div className="absolute top-1/2 right-8">
//             <button
//               onClick={handleCloseOverlay}
//               className="w-[45px] h-[45px] rounded-full bg-[#fff]/15 mb-3 backdrop-blur-md flex items-center justify-center cursor-pointer transition"
//             >
//               <img src="/icons/close.svg" alt="" />
//             </button>
//             <button
//               onClick={handlePrevVideo}
//               className="text-white rounded-full bg-[#fff]/15 mb-3 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition"
//             >
//               <img src="/icons/arrow-up.svg" alt="prev" />
//             </button>
//             <button
//               onClick={handleNextVideo}
//               className="text-white rounded-full bg-[#fff]/15 mb-3 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition"
//             >
//               <img src="/icons/arrow-down.svg" alt="next" />
//             </button>
//           </div>

//           <div
//             onClick={handleSeek}
//             className="absolute bottom-[10vh] left-1/2 -translate-x-1/2 bg-gray-600 rounded-full cursor-pointer overflow-hidden"
//             style={{
//               width: videoWidth ? `${videoWidth - 30}px` : "calc(70% - 8px)",
//               height: "6px",
//               direction: "ltr",
//             }}
//           >
//             <div
//               className="h-full bg-red-600 rounded-full transition-all"
//               style={{ width: `${progress}%` }}
//             ></div>
//           </div>
//         </div>
//       )}

//       {/* Unfollow Modal */}
//       {showUnfollowModal && (
//         <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
//           <div
//             className="w-[237px] h-[271px] rounded-[26px] flex flex-col items-center justify-between py-6"
//             style={{
//               background: "#00000080",
//               backdropFilter: "blur(15px)",
//             }}
//           >
//             <h2 className="text-[#F92429] font-semibold text-[18px] leading-[100%] text-center mt-4">
//               إلغاء المتابعة؟
//             </h2>
//             <p className="text-white font-semibold text-[12px] leading-relaxed text-center w-[226px] mt-5">
//               لن ترى تحديثات هذا المستخدم في صفحتك بعد الآن
//             </p>
//             <button
//               onClick={confirmUnfollow}
//               disabled={isUnfollowing}
//               className="w-[185px] h-[50px] rounded-[19px] border border-[#D72229] flex items-center justify-center bg-transparent mt-7"
//             >
//               <span className="text-[#D72229] font-semibold text-[17px] leading-[100%]">
//                 {isUnfollowing ? "جاري..." : "إلغاء المتابعة"}
//               </span>
//             </button>
//             <div className="w-[239px] h-[0px] border-t border-[#70707033] my-2" />
//             <button
//               onClick={closeUnfollowModal}
//               className="w-[185px] h-[50px] rounded-[19px] border border-[#D72229] flex items-center justify-center bg-[#D72229]"
//             >
//               <span className="text-white font-semibold text-[17px] leading-[100%]">
//                 إلغاء
//               </span>
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// "use client";
// import { useEffect, useState, useRef } from "react";

// type Video = {
//   _id: string;
//   name: string;
//   username: string;
//   userimg: string;
//   video: { video: string }[];
//   likes: any[];
//   views: number;
//   createdAt: string;
// };

// type ReelsFeedProps = {
//   currentUserId?: string;
// };

// export default function ReelsFeed({ currentUserId: propUserId = "" }: ReelsFeedProps) {
//   const [videos, setVideos] = useState<Video[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [showOverlay, setShowOverlay] = useState(false);
//   const [playingIndex, setPlayingIndex] = useState<number | null>(null);
//   const [isPlayingOverlay, setIsPlayingOverlay] = useState(false);
//   const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const [progress, setProgress] = useState(0);
//   const [videoWidth, setVideoWidth] = useState<number | null>(null);

//   const [showUnfollowModal, setShowUnfollowModal] = useState(false);
//   const [unfollowTargetVideo, setUnfollowTargetVideo] = useState<Video | null>(null);
//   const [isUnfollowing, setIsUnfollowing] = useState(false);

//   const getCurrentUserId = () => {
//     if (propUserId) return propUserId;
//     try {
//       const userData = localStorage.getItem("userData");
//       if (userData) {
//         const parsed = JSON.parse(userData);
//         return parsed._id || "";
//       }
//       const userId = localStorage.getItem("userid") || localStorage.getItem("followerId");
//       if (userId) return userId;
//     } catch {}
//     return "";
//   };

//   const getAuthToken = () => {
//     if (typeof window !== "undefined") {
//       return localStorage.getItem("accessToken") || localStorage.getItem("token") || "";
//     }
//     return "";
//   };

//   // جلب معرف المستخدم باستخدام username
//   const fetchUserIdByUsername = async (username: string): Promise<string | null> => {
//     // استخدم endpoint مناسب، قد يكون مختلفاً حسب API الخاص بك
//     const endpoints = [
//       `http://bo-chat.space/user/${username}`,
//       `http://bo-chat.space/users/username/${username}`,
//       `http://bo-chat.space/profile/${username}`,
//     ];
//     for (const url of endpoints) {
//       try {
//         const res = await fetch(url);
//         if (res.ok) {
//           const data = await res.json();
//           const userId = data._id || data.user?.id || data.id;
//           if (userId) return userId;
//         }
//       } catch (err) {
//         console.warn(`Failed to fetch user from ${url}`, err);
//       }
//     }
//     return null;
//   };

//   // Fetch videos (unchanged)
//   const fetchVideos = async (pageToFetch = 1, limit = 10) => {
//     if ((loading && pageToFetch !== 1) || loadingMore || !hasMore) return;
//     if (pageToFetch === 1) setLoading(true);
//     else setLoadingMore(true);

//     try {
//       const res = await fetch(
//         `http://bo-chat.space/bestvideosTest/null?page=${pageToFetch}&limit=${limit}`
//       );
//       const data = await res.json();
//       if (!Array.isArray(data) || data.length === 0) {
//         setHasMore(false);
//       } else {
//         setVideos((prev) => (pageToFetch === 1 ? data : [...prev, ...data]));
//         setPage(pageToFetch + 1);
//       }
//     } catch (err) {
//       console.error("Error fetching videos:", err);
//     } finally {
//       if (pageToFetch === 1) setLoading(false);
//       else setLoadingMore(false);
//     }
//   };

//   useEffect(() => {
//     fetchVideos(1, 10);
//   }, []);

//   useEffect(() => {
//     if (!hasMore) return;
//     if (activeIndex >= videos.length - 1 && videos.length > 0) {
//       fetchVideos(page, 10);
//     }
//   }, [activeIndex, videos.length, hasMore]);

//   // Video controls (unchanged)
//   const handleScroll = (e: React.WheelEvent<HTMLDivElement>) => {
//     if (e.deltaY > 0) handleNextVideo();
//     else if (e.deltaY < 0) handlePrevVideo();
//   };

//   const stopAllVideos = () => {
//     videoRefs.current.forEach((v) => {
//       if (v) {
//         v.pause();
//         v.currentTime = 0;
//       }
//     });
//   };

//   const handleNextVideo = () => {
//     stopAllVideos();
//     setPlayingIndex(null);
//     setActiveIndex((prev) => (prev < videos.length - 1 ? prev + 1 : prev));
//   };

//   const handlePrevVideo = () => {
//     stopAllVideos();
//     setPlayingIndex(null);
//     setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
//   };

//   const handleOverlay = () => {
//     setShowOverlay(true);
//     setProgress(0);
//     stopAllVideos();
//     setIsPlayingOverlay(true);
//     setTimeout(() => {
//       if (videoRef.current) {
//         const rect = videoRef.current.getBoundingClientRect();
//         setVideoWidth(rect.width);
//         videoRef.current.play().catch(() => {});
//       }
//     }, 300);
//   };

//   const handleCloseOverlay = () => {
//     setShowOverlay(false);
//     setIsPlayingOverlay(false);
//     if (videoRef.current) videoRef.current.pause();
//   };

//   const handleTimeUpdate = () => {
//     if (videoRef.current && videoRef.current.duration) {
//       const progressValue = (videoRef.current.currentTime / videoRef.current.duration) * 100;
//       setProgress(progressValue);
//     }
//   };

//   const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
//     if (!videoRef.current) return;
//     const rect = e.currentTarget.getBoundingClientRect();
//     const seekTime = ((e.clientX - rect.left) / rect.width) * videoRef.current.duration;
//     videoRef.current.currentTime = seekTime;
//   };

//   const togglePlay = (index: number) => {
//     const video = videoRefs.current[index];
//     if (!video) return;
//     if (playingIndex === index) {
//       video.pause();
//       setPlayingIndex(null);
//     } else {
//       stopAllVideos();
//       video.play().catch(() => {});
//       setPlayingIndex(index);
//     }
//   };

//   const togglePlayOverlay = () => {
//     if (!videoRef.current) return;
//     if (isPlayingOverlay) {
//       videoRef.current.pause();
//       setIsPlayingOverlay(false);
//     } else {
//       videoRef.current.play().catch(() => {});
//       setIsPlayingOverlay(true);
//     }
//   };

//   const handleVideoProgress = () => {
//     const video = videoRefs.current[activeIndex];
//     if (!video || !video.duration) return;
//     setProgress((video.currentTime / video.duration) * 100);
//   };

//   useEffect(() => {
//     videoRefs.current = videoRefs.current.slice(0, videos.length);
//   }, [videos.length]);

//   const openUnfollowModal = (video: Video) => {
//     setUnfollowTargetVideo(video);
//     setShowUnfollowModal(true);
//   };

//   const closeUnfollowModal = () => {
//     setShowUnfollowModal(false);
//     setUnfollowTargetVideo(null);
//   };

//   const confirmUnfollow = async () => {
//     if (!unfollowTargetVideo || isUnfollowing) return;

//     const currentUserId = getCurrentUserId();
//     if (!currentUserId) {
//       alert("لا يمكن إلغاء المتابعة: لم يتم التعرف على المستخدم الحالي");
//       return;
//     }

//     const authToken = getAuthToken();
//     if (!authToken) {
//       alert("لا يمكن إلغاء المتابعة: يرجى تسجيل الدخول مرة أخرى");
//       return;
//     }

//     // محاولة الحصول على targetUserId باستخدام username
//     let targetUserId = (unfollowTargetVideo as any).userId || (unfollowTargetVideo as any).authorId;
//     if (!targetUserId && unfollowTargetVideo.username) {
//       // عرض رسالة تحميل مؤقتة
//       setIsUnfollowing(true);
//       try {
//         targetUserId = await fetchUserIdByUsername(unfollowTargetVideo.username);
//       } catch (err) {
//         console.error("Error fetching user id", err);
//       }
//       if (!targetUserId) {
//         alert("لا يمكن العثور على معرف المستخدم. تأكد من أن المستخدم موجود.");
//         setIsUnfollowing(false);
//         return;
//       }
//     }

//     if (!targetUserId) {
//       alert("لا يمكن إلغاء المتابعة: لم يتم العثور على معرف المستخدم.");
//       return;
//     }

//     const endpoint = "http://bo-chat.space/follow";
//     const body = {
//       followerid: currentUserId,
//       followingid: targetUserId,
//     };

//     try {
//       const response = await fetch(endpoint, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${authToken}`,
//         },
//         body: JSON.stringify(body),
//       });

//       const text = await response.text();
//       let data;
//       try {
//         data = JSON.parse(text);
//       } catch {
//         data = { message: text };
//       }

//       if (response.ok) {
//         alert("تم إلغاء المتابعة بنجاح");
//         closeUnfollowModal();
//       } else {
//         alert(`فشل إلغاء المتابعة: ${data.error || data.message || response.status}`);
//       }
//     } catch (err) {
//       console.error("Unfollow error:", err);
//       alert("حدث خطأ في الاتصال بالخادم");
//     } finally {
//       setIsUnfollowing(false);
//     }
//   };

//   // Render (JSX unchanged)
//   return (
//     <div
//       className="relative h-[520px] max-w-full rounded-[20px] overflow-hidden bg-black mx-auto"
//       onWheel={handleScroll}
//     >
//       {videos.map((video, index) => (
//         <div
//           key={video._id}
//           className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
//             index === activeIndex
//               ? "translate-y-0"
//               : index < activeIndex
//               ? "-translate-y-full"
//               : "translate-y-full"
//           }`}
//         >
//           <video
//             ref={(el) => (videoRefs.current[index] = el)}
//             src={video.video[0]?.video}
//             className="h-full w-full object-cover cursor-pointer"
//             loop
//             muted
//             playsInline
//             onTimeUpdate={index === activeIndex ? handleVideoProgress : undefined}
//             controlsList="nodownload noremoteplayback"
//             disablePictureInPicture
//           />
//           {index === activeIndex && (
//             <div
//               dir="ltr"
//               className="absolute bottom-7 left-4 right-4 h-[4px] bg-white/20 rounded-full overflow-hidden"
//             >
//               <div
//                 className="h-full bg-red-600 rounded-full transition-all"
//                 style={{ width: `${progress}%` }}
//               />
//             </div>
//           )}

//           <div className="absolute top-5 right-4 backdrop-blur-md rounded-[17px] pl-2 flex items-center gap-3">
//             <img
//               src={video.userimg}
//               alt={video.name}
//               className="w-10 h-10 rounded-[17px] border border-white/30"
//             />
//             <div>
//               <p className="text-white font-semibold">{video.name}</p>
//               <p className="text-gray-300 text-sm">{video.username}</p>
//             </div>
//           </div>

//           <div className="absolute bg-[#FFFFFF]/30 top-5 left-4 flex items-center px-3 py-2 backdrop-blur-md text-white gap-3 rounded-[17px]">
//             <span className="text-sm">{video.views || 0}</span>
//             <img src="/icons/eye.svg" className="rounded-17px" alt="" />
//           </div>

//           <div className="absolute right-4 top-1/2 transform-y -translate-y-1/2 flex flex-col items-center gap-1">
//             <button
//               onClick={handleOverlay}
//               className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[40px] h-[40px] hover:bg-[#fff]/20 transition"
//             >
//               <img src="/icons/fullscreen.svg" alt="" />
//             </button>

//             <button
//               onClick={() => openUnfollowModal(video)}
//               className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[40px] h-[40px] hover:bg-[#fff]/20 transition"
//             >
//               <img src="/icons/options-white.svg" alt="options" />
//             </button>

//             <button
//               onClick={() => togglePlay(index)}
//               className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[40px] h-[40px] hover:bg-[#fff]/20 transition"
//             >
//               <img
//                 src={playingIndex === index ? "/imgs/Group 9081.svg" : "/icons/play.svg"}
//                 alt={playingIndex === index ? "Pause" : "Play"}
//               />
//             </button>

//             <button
//               onClick={handlePrevVideo}
//               className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[40px] h-[40px] hover:bg-[#fff]/20 transition"
//             >
//               <img src="/icons/arrow-up.svg" alt="prev" />
//             </button>
//             <button
//               onClick={handleNextVideo}
//               className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[40px] h-[40px] hover:bg-[#fff]/20 transition"
//             >
//               <img src="/icons/arrow-down.svg" alt="next" />
//             </button>

//             <button className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[40px] h-[40px] hover:bg-[#fff]/20 transition">
//               <img src="/icons/like-white.svg" alt="like" />
//             </button>
//             <button className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[40px] h-[40px] hover:bg-[#fff]/20 transition">
//               <img src="/icons/comment-white.svg" alt="comment" />
//             </button>
//             <button className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[40px] h-[40px] hover:bg-[#fff]/20 transition">
//               <img src="/icons/share-white.svg" alt="share" />
//             </button>
//           </div>
//         </div>
//       ))}

//       {/* Fullscreen Overlay */}
//       {showOverlay && (
//         <div
//           ref={containerRef}
//           className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center"
//         >
//           <div className="relative">
//             <video
//               ref={videoRef}
//               src={videos[activeIndex]?.video[0]?.video}
//                       className="rounded-[17px] object-cover"
//                style={{
//           width: "400px",
//           height: "650px",
//         }}
//               autoPlay
//               playsInline
//               onTimeUpdate={handleTimeUpdate}
//               onPlay={() => setIsPlayingOverlay(true)}
//               onPause={() => setIsPlayingOverlay(false)}
//               controlsList="nodownload noremoteplayback"
//               disablePictureInPicture
//             />

//             <div className="absolute top-5 right-4 flex items-center gap-3">
//               <img
//                 src={videos[activeIndex]?.userimg}
//                 alt={videos[activeIndex]?.name}
//                 className="w-10 h-10 rounded-[17px] border border-white/30"
//               />
//               <div>
//                 <p className="text-white font-semibold">{videos[activeIndex]?.name}</p>
//                 <p className="text-gray-300 text-sm">{videos[activeIndex]?.username}</p>
//               </div>
//             </div>

//             <div className="absolute top-1/7 right-2 gap-2">
//               <button
//                 onClick={() => openUnfollowModal(videos[activeIndex])}
//                 className="text-white rounded-full bg-[#000000]/15 mb-2 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition"
//               >
//                 <img src="/icons/options-white.svg" alt="" />
//               </button>
//               <button
//                 onClick={togglePlayOverlay}
//                 className="text-white rounded-full bg-[#000000]/15 mb-2 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition"
//               >
//                 <img
//                   src={isPlayingOverlay ? "/imgs/Group 9081.svg" : "/icons/play.svg"}
//                   alt={isPlayingOverlay ? "Pause" : "Play"}
//                 />
//               </button>
//               <button className="text-white rounded-full bg-[#000000]/15 mb-2 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition">
//                 <img src="/icons/like-white.svg" alt="" />
//               </button>
//               <button className="text-white rounded-full bg-[#000000]/15 mb-2 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition">
//                 <img src="/icons/comment-white.svg" alt="" />
//               </button>
//               <button className="text-white rounded-full bg-[#000000]/15 mb-2 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition">
//                 <img src="/icons/share-white.svg" alt="" />
//               </button>
//             </div>

//             <div className="absolute bg-[#FFFFFF]/30 top-5 left-4 flex items-center px-3 py-2 backdrop-blur-md text-white gap-3 rounded-[17px]">
//               <span className="text-sm">{videos[activeIndex]?.views || 0}</span>
//               <img src="/icons/eye.svg" className="rounded-17px" alt="" />
//             </div>
//           </div>

//           <h1 className="absolute top-15 right-8 text-white text-xl transition">الريلز</h1>
//           <div className="absolute top-1/2 right-8">
//             <button
//               onClick={handleCloseOverlay}
//               className="w-[45px] h-[45px] rounded-full bg-[#fff]/15 mb-3 backdrop-blur-md flex items-center justify-center cursor-pointer transition"
//             >
//               <img src="/icons/close.svg" alt="" />
//             </button>
//             <button
//               onClick={handlePrevVideo}
//               className="text-white rounded-full bg-[#fff]/15 mb-3 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition"
//             >
//               <img src="/icons/arrow-up.svg" alt="prev" />
//             </button>
//             <button
//               onClick={handleNextVideo}
//               className="text-white rounded-full bg-[#fff]/15 mb-3 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition"
//             >
//               <img src="/icons/arrow-down.svg" alt="next" />
//             </button>
//           </div>

//           <div
//             onClick={handleSeek}
//             className="absolute bottom-[10vh] left-1/2 -translate-x-1/2 bg-gray-600 rounded-full cursor-pointer overflow-hidden"
//             style={{
//               width: videoWidth ? `${videoWidth - 10}px` : "calc(70% - 8px)",
//               height: "6px",
//               direction: "ltr",
//             }}
//           >
//             <div
//               className="h-full bg-red-600 rounded-full transition-all"
//               style={{ width: `${progress}%` }}
//             ></div>
//           </div>
//         </div>
//       )}

//       {/* Unfollow Modal */}
//       {showUnfollowModal && (
//         <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
//           <div
//             className="w-[237px] h-[271px] rounded-[26px] flex flex-col items-center justify-between py-6"
//             style={{
//               background: "#00000080",
//               backdropFilter: "blur(15px)",
//             }}
//           >
//             <h2 className="text-[#F92429] font-semibold text-[18px] leading-[100%] text-center mt-4">
//               إلغاء المتابعة؟
//             </h2>
//             <p className="text-white font-semibold text-[12px] leading-relaxed text-center w-[226px] mt-5">
//               لن ترى تحديثات هذا المستخدم في صفحتك بعد الآن
//             </p>
//             <button
//               onClick={confirmUnfollow}
//               disabled={isUnfollowing}
//               className="w-[185px] h-[50px] rounded-[19px] border border-[#D72229] flex items-center justify-center bg-transparent mt-7"
//             >
//               <span className="text-[#D72229] font-semibold text-[17px] leading-[100%]">
//                 {isUnfollowing ? "جاري..." : "إلغاء المتابعة"}
//               </span>
//             </button>
//             <div className="w-[239px] h-[0px] border-t border-[#70707033] my-2" />
//             <button
//               onClick={closeUnfollowModal}
//               className="w-[185px] h-[50px] rounded-[19px] border border-[#D72229] flex items-center justify-center bg-[#D72229]"
//             >
//               <span className="text-white font-semibold text-[17px] leading-[100%]">
//                 إلغاء
//               </span>
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useEffect, useState, useRef } from "react";

type Video = {
  _id: string;
  name: string;
  username: string;
  userimg: string;
  video: { video: string }[];
  likes: any[];
  views: number;
  createdAt: string;
};

type ReelsFeedProps = {
  currentUserId?: string;
};

export default function ReelsFeed({ currentUserId: propUserId = "" }: ReelsFeedProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [isPlayingOverlay, setIsPlayingOverlay] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [videoWidth, setVideoWidth] = useState<number | null>(null);

  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const [unfollowTargetVideo, setUnfollowTargetVideo] = useState<Video | null>(null);
  const [isUnfollowing, setIsUnfollowing] = useState(false);

  // دوال مساعدة لتقديم/تأخير الفيديو في الـ overlay
  const seekForward = (seconds: number = 10) => {
    if (videoRef.current && videoRef.current.duration) {
      let newTime = videoRef.current.currentTime + seconds;
      if (newTime > videoRef.current.duration) newTime = videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      // سيتم تحديث شريط التقدم تلقائياً عبر حدث onTimeUpdate
    }
  };

  const seekBackward = (seconds: number = 10) => {
    if (videoRef.current) {
      let newTime = videoRef.current.currentTime - seconds;
      if (newTime < 0) newTime = 0;
      videoRef.current.currentTime = newTime;
    }
  };

  const getCurrentUserId = () => {
    if (propUserId) return propUserId;
    try {
      const userData = localStorage.getItem("userData");
      if (userData) {
        const parsed = JSON.parse(userData);
        return parsed._id || "";
      }
      const userId = localStorage.getItem("userid") || localStorage.getItem("followerId");
      if (userId) return userId;
    } catch {}
    return "";
  };

  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken") || localStorage.getItem("token") || "";
    }
    return "";
  };

  // جلب معرف المستخدم باستخدام username
  const fetchUserIdByUsername = async (username: string): Promise<string | null> => {
    const endpoints = [
      `http://bo-chat.space/user/${username}`,
      `http://bo-chat.space/users/username/${username}`,
      `http://bo-chat.space/profile/${username}`,
    ];
    for (const url of endpoints) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          const userId = data._id || data.user?.id || data.id;
          if (userId) return userId;
        }
      } catch (err) {
        console.warn(`Failed to fetch user from ${url}`, err);
      }
    }
    return null;
  };

  const fetchVideos = async (pageToFetch = 1, limit = 10) => {
    if ((loading && pageToFetch !== 1) || loadingMore || !hasMore) return;
    if (pageToFetch === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await fetch(
        `http://bo-chat.space/bestvideosTest/null?page=${pageToFetch}&limit=${limit}`
      );
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        setHasMore(false);
      } else {
        setVideos((prev) => (pageToFetch === 1 ? data : [...prev, ...data]));
        setPage(pageToFetch + 1);
      }
    } catch (err) {
      console.error("Error fetching videos:", err);
    } finally {
      if (pageToFetch === 1) setLoading(false);
      else setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchVideos(1, 10);
  }, []);

  useEffect(() => {
    if (!hasMore) return;
    if (activeIndex >= videos.length - 1 && videos.length > 0) {
      fetchVideos(page, 10);
    }
  }, [activeIndex, videos.length, hasMore]);

  const handleScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY > 0) handleNextVideo();
    else if (e.deltaY < 0) handlePrevVideo();
  };

  const stopAllVideos = () => {
    videoRefs.current.forEach((v) => {
      if (v) {
        v.pause();
        v.currentTime = 0;
      }
    });
  };

  const handleNextVideo = () => {
    stopAllVideos();
    setPlayingIndex(null);
    setActiveIndex((prev) => (prev < videos.length - 1 ? prev + 1 : prev));
  };

  const handlePrevVideo = () => {
    stopAllVideos();
    setPlayingIndex(null);
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleOverlay = () => {
    setShowOverlay(true);
    setProgress(0);
    stopAllVideos();
    setIsPlayingOverlay(true);
    setTimeout(() => {
      if (videoRef.current) {
        const rect = videoRef.current.getBoundingClientRect();
        setVideoWidth(rect.width);
        videoRef.current.play().catch(() => {});
      }
    }, 300);
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
    setIsPlayingOverlay(false);
    if (videoRef.current) videoRef.current.pause();
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const progressValue = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progressValue);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const seekTime = ((e.clientX - rect.left) / rect.width) * videoRef.current.duration;
    videoRef.current.currentTime = seekTime;
  };

  const togglePlay = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;
    if (playingIndex === index) {
      video.pause();
      setPlayingIndex(null);
    } else {
      stopAllVideos();
      video.play().catch(() => {});
      setPlayingIndex(index);
    }
  };

  const togglePlayOverlay = () => {
    if (!videoRef.current) return;
    if (isPlayingOverlay) {
      videoRef.current.pause();
      setIsPlayingOverlay(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlayingOverlay(true);
    }
  };

  const handleVideoProgress = () => {
    const video = videoRefs.current[activeIndex];
    if (!video || !video.duration) return;
    setProgress((video.currentTime / video.duration) * 100);
  };

  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, videos.length);
  }, [videos.length]);

  const openUnfollowModal = (video: Video) => {
    setUnfollowTargetVideo(video);
    setShowUnfollowModal(true);
  };

  const closeUnfollowModal = () => {
    setShowUnfollowModal(false);
    setUnfollowTargetVideo(null);
  };

  const confirmUnfollow = async () => {
    if (!unfollowTargetVideo || isUnfollowing) return;

    const currentUserId = getCurrentUserId();
    if (!currentUserId) {
      alert("لا يمكن إلغاء المتابعة: لم يتم التعرف على المستخدم الحالي");
      return;
    }

    const authToken = getAuthToken();
    if (!authToken) {
      alert("لا يمكن إلغاء المتابعة: يرجى تسجيل الدخول مرة أخرى");
      return;
    }

    let targetUserId = (unfollowTargetVideo as any).userId || (unfollowTargetVideo as any).authorId;
    if (!targetUserId && unfollowTargetVideo.username) {
      setIsUnfollowing(true);
      try {
        targetUserId = await fetchUserIdByUsername(unfollowTargetVideo.username);
      } catch (err) {
        console.error("Error fetching user id", err);
      }
      if (!targetUserId) {
        alert("لا يمكن العثور على معرف المستخدم. تأكد من أن المستخدم موجود.");
        setIsUnfollowing(false);
        return;
      }
    }

    if (!targetUserId) {
      alert("لا يمكن إلغاء المتابعة: لم يتم العثور على معرف المستخدم.");
      return;
    }

    const endpoint = "http://bo-chat.space/follow";
    const body = {
      followerid: currentUserId,
      followingid: targetUserId,
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(body),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }

      if (response.ok) {
        alert("تم إلغاء المتابعة بنجاح");
        closeUnfollowModal();
      } else {
        alert(`فشل إلغاء المتابعة: ${data.error || data.message || response.status}`);
      }
    } catch (err) {
      console.error("Unfollow error:", err);
      alert("حدث خطأ في الاتصال بالخادم");
    } finally {
      setIsUnfollowing(false);
    }
  };

  return (
    <div
      className="relative h-[520px] max-w-full rounded-[20px] overflow-hidden bg-black mx-auto"
      onWheel={handleScroll}
    >
      {videos.map((video, index) => (
        <div
          key={video._id}
          className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
            index === activeIndex
              ? "translate-y-0"
              : index < activeIndex
              ? "-translate-y-full"
              : "translate-y-full"
          }`}
        >
          <video
            ref={(el) => (videoRefs.current[index] = el)}
            src={video.video[0]?.video}
            className="h-full w-full object-cover cursor-pointer"
            loop
            muted
            playsInline
            onTimeUpdate={index === activeIndex ? handleVideoProgress : undefined}
            controlsList="nodownload noremoteplayback"
            disablePictureInPicture
          />
          {index === activeIndex && (
            <div
              dir="ltr"
              className="absolute bottom-7 left-4 right-4 h-[4px] bg-white/20 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-red-600 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <div className="absolute top-5 right-4 backdrop-blur-md rounded-[17px] pl-2 flex items-center gap-3">
            <img
              src={video.userimg}
              alt={video.name}
              className="w-10 h-10 rounded-[17px] border border-white/30"
            />
            <div>
              <p className="text-white font-semibold">{video.name}</p>
              <p className="text-gray-300 text-sm">{video.username}</p>
            </div>
          </div>

          <div className="absolute bg-[#FFFFFF]/30 top-5 left-4 flex items-center px-3 py-2 backdrop-blur-md text-white gap-3 rounded-[17px]">
            <span className="text-sm">{video.views || 0}</span>
            <img src="/icons/eye.svg" className="rounded-17px" alt="" />
          </div>

          <div className="absolute right-4 top-1/2 transform-y -translate-y-1/2 flex flex-col items-center gap-1">
            <button
              onClick={handleOverlay}
              className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[40px] h-[40px] hover:bg-[#fff]/20 transition"
            >
              <img src="/icons/fullscreen.svg" alt="" />
            </button>

            <button
              onClick={() => openUnfollowModal(video)}
              className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[40px] h-[40px] hover:bg-[#fff]/20 transition"
            >
              <img src="/icons/options-white.svg" alt="options" />
            </button>

            <button
              onClick={() => togglePlay(index)}
              className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[40px] h-[40px] hover:bg-[#fff]/20 transition"
            >
              <img
                src={playingIndex === index ? "/imgs/Group 9081.svg" : "/icons/play.svg"}
                alt={playingIndex === index ? "Pause" : "Play"}
              />
            </button>

            <button
              onClick={handlePrevVideo}
              className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[40px] h-[40px] hover:bg-[#fff]/20 transition"
            >
              <img src="/icons/arrow-up.svg" alt="prev" />
            </button>
            <button
              onClick={handleNextVideo}
              className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[40px] h-[40px] hover:bg-[#fff]/20 transition"
            >
              <img src="/icons/arrow-down.svg" alt="next" />
            </button>

            <button className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[40px] h-[40px] hover:bg-[#fff]/20 transition">
              <img src="/icons/like-white.svg" alt="like" />
            </button>
            <button className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[40px] h-[40px] hover:bg-[#fff]/20 transition">
              <img src="/icons/comment-white.svg" alt="comment" />
            </button>
            <button className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[40px] h-[40px] hover:bg-[#fff]/20 transition">
              <img src="/icons/share-white.svg" alt="share" />
            </button>
          </div>
        </div>
      ))}

      {/* Fullscreen Overlay */}
      {showOverlay && (
        <div
          ref={containerRef}
          className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center"
        >
          <div className="relative">
            <video
              ref={videoRef}
              src={videos[activeIndex]?.video[0]?.video}
              className="rounded-[17px] object-cover"
              style={{
                width: "400px",
                height: "650px",
              }}
              autoPlay
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setIsPlayingOverlay(true)}
              onPause={() => setIsPlayingOverlay(false)}
              controlsList="nodownload noremoteplayback"
              disablePictureInPicture
            />

            <div className="absolute top-5 right-4 flex items-center gap-3">
              <img
                src={videos[activeIndex]?.userimg}
                alt={videos[activeIndex]?.name}
                className="w-10 h-10 rounded-[17px] border border-white/30"
              />
              <div>
                <p className="text-white font-semibold">{videos[activeIndex]?.name}</p>
                <p className="text-gray-300 text-sm">{videos[activeIndex]?.username}</p>
              </div>
            </div>

            <div className="absolute top-1/7 right-2 gap-2">
              <button
                onClick={() => openUnfollowModal(videos[activeIndex])}
                className="text-white rounded-full bg-[#000000]/15 mb-2 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition"
              >
                <img src="/icons/options-white.svg" alt="" />
              </button>
              <button
                onClick={togglePlayOverlay}
                className="text-white rounded-full bg-[#000000]/15 mb-2 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition"
              >
                <img
                  src={isPlayingOverlay ? "/imgs/Group 9081.svg" : "/icons/play.svg"}
                  alt={isPlayingOverlay ? "Pause" : "Play"}
                />
              </button>
              <button className="text-white rounded-full bg-[#000000]/15 mb-2 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition">
                <img src="/icons/like-white.svg" alt="" />
              </button>
              <button className="text-white rounded-full bg-[#000000]/15 mb-2 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition">
                <img src="/icons/comment-white.svg" alt="" />
              </button>
              <button className="text-white rounded-full bg-[#000000]/15 mb-2 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition">
                <img src="/icons/share-white.svg" alt="share" />
              </button>
              {/* الأزرار الجديدة تحت زر المشاركة */}
                 <button
                onClick={() => seekForward(10)}
                className="mt-8 text-white rounded-full bg-[#000000]/15 mb-2 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition"
                title="تقديم 10 ثوانٍ"
              >
                <img src="/imgs/next.svg" alt="+10" />
              </button>

              <button
                onClick={() => seekBackward(10)}
                className="text-white rounded-full bg-[#000000]/15 mb-2 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition"
                title="تأخير 10 ثوانٍ"
              >
                <img src="/imgs/pre (1).svg" alt="-10" />
              </button>
              {/* <button
                onClick={() => seekForward(10)}
                className="text-white rounded-full bg-[#000000]/15 mb-2 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition"
                title="تقديم 10 ثوانٍ"
              >
                <img src="/imgs/nextSec.svg" alt="+10" />
              </button> */}
            </div>

            <div className="absolute bg-[#FFFFFF]/30 top-5 left-4 flex items-center px-3 py-2 backdrop-blur-md text-white gap-3 rounded-[17px]">
              <span className="text-sm">{videos[activeIndex]?.views || 0}</span>
              <img src="/icons/eye.svg" className="rounded-17px" alt="" />
            </div>
          </div>

          <h1 className="absolute top-15 right-8 text-white text-xl transition">الريلز</h1>
          <div className="absolute top-1/2 right-8">
            <button
              onClick={handleCloseOverlay}
              className="w-[45px] h-[45px] rounded-full bg-[#fff]/15 mb-3 backdrop-blur-md flex items-center justify-center cursor-pointer transition"
            >
              <img src="/icons/close.svg" alt="" />
            </button>
            <button
              onClick={handlePrevVideo}
              className="text-white rounded-full bg-[#fff]/15 mb-3 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition"
            >
              <img src="/icons/arrow-up.svg" alt="prev" />
            </button>
            <button
              onClick={handleNextVideo}
              className="text-white rounded-full bg-[#fff]/15 mb-3 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition"
            >
              <img src="/icons/arrow-down.svg" alt="next" />
            </button>
          </div>

          <div
            onClick={handleSeek}
            className="absolute bottom-[10vh] left-1/2 -translate-x-1/2 bg-gray-600 rounded-full cursor-pointer overflow-hidden"
            style={{
              width: videoWidth ? `${videoWidth - 10}px` : "calc(70% - 8px)",
              height: "6px",
              direction: "ltr",
            }}
          >
            <div
              className="h-full bg-red-600 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Unfollow Modal */}
      {showUnfollowModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
          <div
            className="w-[237px] h-[271px] rounded-[26px] flex flex-col items-center justify-between py-6"
            style={{
              background: "#00000080",
              backdropFilter: "blur(15px)",
            }}
          >
            <h2 className="text-[#F92429] font-semibold text-[18px] leading-[100%] text-center mt-4">
              إلغاء المتابعة؟
            </h2>
            <p className="text-white font-semibold text-[12px] leading-relaxed text-center w-[226px] mt-5">
              لن ترى تحديثات هذا المستخدم في صفحتك بعد الآن
            </p>
            <button
              onClick={confirmUnfollow}
              disabled={isUnfollowing}
              className="w-[185px] h-[50px] rounded-[19px] border border-[#D72229] flex items-center justify-center bg-transparent mt-7"
            >
              <span className="text-[#D72229] font-semibold text-[17px] leading-[100%]">
                {isUnfollowing ? "جاري..." : "إلغاء المتابعة"}
              </span>
            </button>
            <div className="w-[239px] h-[0px] border-t border-[#70707033] my-2" />
            <button
              onClick={closeUnfollowModal}
              className="w-[185px] h-[50px] rounded-[19px] border border-[#D72229] flex items-center justify-center bg-[#D72229]"
            >
              <span className="text-white font-semibold text-[17px] leading-[100%]">
                إلغاء
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}