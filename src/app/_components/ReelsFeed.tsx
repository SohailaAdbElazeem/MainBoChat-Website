/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
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

export default function ReelsFeed() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [videoWidth, setVideoWidth] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://bo-chat.space/bestvideos/686695914211804ef3875338")
      .then((res) => res.json())
      .then((data) => {
        setVideos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching videos:", err);
        setLoading(false);
      });
  }, []);

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
    if (videoRef.current) videoRef.current.pause();
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progressValue =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progressValue);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const seekTime =
      ((e.clientX - rect.left) / rect.width) * videoRef.current.duration;
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

  return (
    <div
      className="relative h-[82vh] rounded-[21px] overflow-hidden bg-black"
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
          />

          {/* User info */}
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

          {/* Views */}
          <div className="absolute bg-[#FFFFFF]/30 top-5 left-4 flex items-center px-3 py-2 backdrop-blur-md text-white gap-3 rounded-[17px]">
            <span className="text-sm">{video.views || 0}</span>
            <img src="/icons/eye.svg" className="rounded-17px" alt="" />
          </div>

          {/* Actions */}
          <div className="absolute right-4 bottom-20 flex flex-col items-center gap-3">
            {/* Fullscreen */}
            <button
              onClick={handleOverlay}
              className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition"
            >
              <img src="/icons/fullscreen.svg" alt="" />
            </button>

            {/* Options */}
            <button className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition">
              <img src="/icons/options-white.svg" alt="" />
            </button>

            {/* Play */}
            <button
              onClick={() => togglePlay(index)}
              className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition"
            >
              <img
                src={
                  playingIndex === index
                    ? "/icons/play.svg"
                    : "/icons/play.svg"
                }
                alt={playingIndex === index ? "Pause" : "Play"}
              />
            </button>

            {/* Navigation */}
            <button
              onClick={handlePrevVideo}
              className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition"
            >
              <img src="/icons/arrow-up.svg" alt="prev" />
            </button>
            <button
              onClick={handleNextVideo}
              className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition"
            >
              <img src="/icons/arrow-down.svg" alt="next" />
            </button>

            {/* Like / Comment / Share */}
            <button className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition">
              <img src="/icons/like-white.svg" alt="like" />
            </button>
            <button className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition">
              <img src="/icons/comment-white.svg" alt="comment" />
            </button>
            <button className="text-white rounded-full bg-[#000000]/15 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition">
              <img src="/icons/share-white.svg" alt="share" />
            </button>
          </div>
        </div>
      ))}

      {/* Fullscreen Overlay */}
      {showOverlay && (
        <div
          ref={containerRef}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
        >
          <div className="relative">
            <video
              ref={videoRef}
              src={videos[activeIndex].video[0]?.video}
              className="max-h-[90vh] max-w-[90vw] rounded-[20px]"
              autoPlay
              playsInline
              onTimeUpdate={handleTimeUpdate}
            />
            {/* User Info Overlay */}
            <div className="absolute top-5 right-4 flex items-center gap-3">
              <img
                src={videos[activeIndex].userimg}
                alt={videos[activeIndex].name}
                className="w-10 h-10 rounded-[17px] border border-white/30"
              />
              <div>
                <p className="text-white font-semibold">
                  {videos[activeIndex].name}
                </p>
                <p className="text-gray-300 text-sm">
                  {videos[activeIndex].username}
                </p>
              </div>
            </div>

            <div className="absolute top-1/7 right-2 gap-2">
              <button className="text-white rounded-full bg-[#000000]/15 mb-2 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition">
                <img src="/icons/options-white.svg" alt="" />
              </button>
              <button className="text-white rounded-full bg-[#000000]/15 mb-2 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition">
                <img src="/icons/play.svg" alt="" />
              </button>
              <button className="text-white rounded-full bg-[#000000]/15 mb-2 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition">
                <img src="/icons/like-white.svg" alt="" />
              </button>
              <button className="text-white rounded-full bg-[#000000]/15 mb-2 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition">
                <img src="/icons/comment-white.svg" alt="" />
              </button>
              <button className="text-white rounded-full bg-[#000000]/15 mb-2 flex items-center justify-center cursor-pointer backdrop-blur-md p-3 w-[45px] h-[45px] hover:bg-[#fff]/20 transition">
                <img src="/icons/share-white.svg" alt="" />
              </button>
            </div>

            <div className="absolute bg-[#FFFFFF]/30 top-5 left-4 flex items-center px-3 py-2 backdrop-blur-md text-white gap-3 rounded-[17px]">
              <span className="text-sm">{videos[activeIndex].views || 0}</span>
              <img src="/icons/eye.svg" className="rounded-17px" alt="" />
            </div>
          </div>

          {/* Close Button */}
          <h1 className="absolute top-15 right-8 text-white text-xl transition">
            الريلز
          </h1>
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

          {/* Custom progress bar */}
          <div
            onClick={handleSeek}
            className="absolute bottom-[4vh] left-1/2 -translate-x-1/2 bg-gray-600 rounded-full cursor-pointer overflow-hidden"
            style={{
              width: videoWidth ? `${videoWidth}px` : "70%",
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
    </div>
  );
}
