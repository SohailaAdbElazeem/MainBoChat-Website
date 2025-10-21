/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
// import { Play, Heart, MessageCircle, Share2, Eye } from "lucide-react";

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
    if (e.deltaY > 0 && activeIndex < videos.length - 1) {
      setActiveIndex((prev) => prev + 1);
    } else if (e.deltaY < 0 && activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
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
            index === activeIndex ? "translate-y-0" : index < activeIndex ? "-translate-y-full" : "translate-y-full"
          }`}
        >
          <video
            src={video.video[0]?.video}
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* User info */}
          <div className="absolute top-5 right-4 flex items-center gap-3">
            <img
              src={video.userimg}
              alt={video.name}
              className="w-10 h-10 rounded-full border border-white/30"
            />
            <div>
              <p className="text-white font-semibold">{video.name}</p>
              <p className="text-gray-300 text-sm">@{video.username}</p>
            </div>
          </div>

          {/* Views */}
          <div className="absolute top-5 left-4 flex items-center text-white gap-1">
            {/* <Eye className="w-5 h-5" /> */}
            <span className="text-sm">{video.views || 0}</span>
          </div>

          {/* Actions */}
          <div className="absolute right-4 bottom-20 flex flex-col items-center gap-5">
            <button className="text-white hover:text-red-500 transition">
              {/* <Heart className="w-7 h-7" /> */}
              <span className="text-sm">{video.likes.length}</span>
            </button>
            <button className="text-white hover:text-blue-400 transition">
              {/* <MessageCircle className="w-7 h-7" /> */}
            </button>
            <button className="text-white hover:text-green-400 transition">
              {/* <Share2 className="w-7 h-7" /> */}
            </button>
            <button className="text-white opacity-70">
              {/* <Play className="w-7 h-7" /> */}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
