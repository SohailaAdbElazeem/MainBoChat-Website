/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import FollowButton from "../profile/_components/FollowButton";
import Loader from "@/components/Loader";

type Video = {
  _id: string;
  name: string;
  username: string;
  userimg: string;
  video: { video: string }[];
  likes: any[];
  views: number;
  createdAt: string;
  userid?: string;
  comments?: any[];
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

  // Unfollow/Follow modal state
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const [unfollowTargetVideo, setUnfollowTargetVideo] = useState<Video | null>(null);
  const [isUnfollowing, setIsUnfollowing] = useState(false);
  const [modalType, setModalType] = useState<"unfollow" | "follow">("unfollow");
  const [followingStatus, setFollowingStatus] = useState<Record<string, boolean>>({});

  // LIKE state
  const [likedStatus, setLikedStatus] = useState<Record<string, boolean>>({});
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});

  // USER INTERACTION states (for comment and share)
  const [userCommentedStatus, setUserCommentedStatus] = useState<Record<string, boolean>>({});
  const [userSharedStatus, setUserSharedStatus] = useState<Record<string, boolean>>({});

  // ========== COMMENT state ==========
  const [showCommentOverlay, setShowCommentOverlay] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showCommentMenu, setShowCommentMenu] = useState<string | null>(null);

  // SHARE state
  const [showShareOverlay, setShowShareOverlay] = useState(false);
  const [shareText, setShareText] = useState("");
  const [sharing, setSharing] = useState(false);

  // ========== OPTIONS MENU state ==========
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  // مرجع للعنصر الذي يحتوي على زر الخيارات والقائمة (لإغلاق القائمة عند النقر خارجها)
  const optionsWrapperRef = useRef<HTMLDivElement | null>(null);

  // Helper functions
  const seekForward = (seconds: number = 10) => {
    if (videoRef.current && videoRef.current.duration) {
      let newTime = videoRef.current.currentTime + seconds;
      if (newTime > videoRef.current.duration) newTime = videoRef.current.duration;
      videoRef.current.currentTime = newTime;
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

  const myUserId = getCurrentUserId();
  const token = getAuthToken();

  const fetchVideos = async (pageToFetch = 1, limit = 10) => {
    if ((loading && pageToFetch !== 1) || loadingMore || !hasMore) return;
    if (pageToFetch === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await fetch(`http://bo-chat.space/bestvideosTest/null?page=${pageToFetch}&limit=${limit}`);
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        setHasMore(false);
      } else {
        setVideos((prev) => (pageToFetch === 1 ? data : [...prev, ...data]));
        setPage(pageToFetch + 1);

        // Initialize following status for new videos
        setFollowingStatus((prev) => {
          const newStatus = { ...prev };
          data.forEach((video: Video) => {
            if (newStatus[video._id] === undefined) newStatus[video._id] = false;
          });
          return newStatus;
        });

        // Initialize likes
        setLikesCount((prev) => {
          const newCounts = { ...prev };
          data.forEach((video: Video) => {
            newCounts[video._id] = video.likes?.length || 0;
          });
          return newCounts;
        });
        setLikedStatus((prev) => {
          const newStatus = { ...prev };
          data.forEach((video: Video) => {
            const likedByMe = video.likes?.some((like: any) => like.userid === myUserId) || false;
            newStatus[video._id] = likedByMe;
          });
          return newStatus;
        });

        // Initialize user interaction states for comment and share
        setUserCommentedStatus((prev) => {
          const newStatus = { ...prev };
          data.forEach((video: Video) => {
            if (newStatus[video._id] === undefined) newStatus[video._id] = false;
          });
          return newStatus;
        });
        setUserSharedStatus((prev) => {
          const newStatus = { ...prev };
          data.forEach((video: Video) => {
            if (newStatus[video._id] === undefined) newStatus[video._id] = false;
          });
          return newStatus;
        });
      }
    } catch (err) {
      console.error("Error fetching videos:", err);
    } finally {
      if (pageToFetch === 1) setLoading(false);
      else setLoadingMore(false);
    }
  };

  useEffect(() => { fetchVideos(1, 10); }, []);
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
    setActiveIndex((prev) => (prev < videos.length - 1 ? prev + 1 : prev));
  };

  const handlePrevVideo = () => {
    stopAllVideos();
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleOverlay = () => {
    setShowOverlay(true);
    setProgress(0);
    stopAllVideos();
    setIsPlayingOverlay(true);
    setTimeout(() => {
      if (videoRef.current) {
        setVideoWidth(videoRef.current.getBoundingClientRect().width);
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
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const seekTime = ((e.clientX - rect.left) / rect.width) * videoRef.current.duration;
    videoRef.current.currentTime = seekTime;
  };

  const handleSeekSmall = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRefs.current[activeIndex];
    if (!video) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const seekTime = ((e.clientX - rect.left) / rect.width) * video.duration;
    video.currentTime = seekTime;
  };

  const togglePlay = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (playingIndex === index) {
      video.pause();
    } else {
      if (playingIndex !== null) {
        const prevVideo = videoRefs.current[playingIndex];
        if (prevVideo) prevVideo.pause();
      }
      video.play().catch(() => {});
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

  // تشغيل الفيديو تلقائياً عند تغيير activeIndex
  useEffect(() => {
    const currentVideo = videoRefs.current[activeIndex];
    if (currentVideo) {
      currentVideo.play().catch(() => {});
    }
  }, [activeIndex]);

  // ---------------------- FOLLOW / UNFOLLOW ----------------------
  const openActionModal = (video: Video, type: "unfollow" | "follow") => {
    setUnfollowTargetVideo(video);
    setModalType(type);
    setShowUnfollowModal(true);
  };

  const closeUnfollowModal = () => {
    setShowUnfollowModal(false);
    setUnfollowTargetVideo(null);
  };

  const confirmAction = async () => {
    if (!unfollowTargetVideo || isUnfollowing) return;
    const currentUserId = getCurrentUserId();
    const authToken = getAuthToken();
    if (!currentUserId || !authToken) return;
    const targetUserId = unfollowTargetVideo.userid;
    if (!targetUserId) return;

    try {
      const res = await fetch("http://bo-chat.space/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ followerid: currentUserId, followingid: targetUserId }),
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { message: text }; }
      if (res.ok) {
        const newStatus = modalType === "follow";
        setFollowingStatus(prev => ({ ...prev, [unfollowTargetVideo._id]: newStatus }));
        closeUnfollowModal();
      } else {
      }
    } catch (err) {
    } finally {
      setIsUnfollowing(false);
    }
  };

  // ---------------------- LIKE ----------------------
  const handleLike = async (video: Video) => {
    if (!token || !myUserId) return;
    const wasLiked = likedStatus[video._id] || false;
    setLikedStatus(prev => ({ ...prev, [video._id]: !wasLiked }));
    setLikesCount(prev => ({ ...prev, [video._id]: (prev[video._id] || 0) + (wasLiked ? -1 : 1) }));

    try {
      const res = await fetch(`http://bo-chat.space/posts/${video._id}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userid: myUserId }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setLikedStatus(prev => ({ ...prev, [video._id]: wasLiked }));
      setLikesCount(prev => ({ ...prev, [video._id]: (prev[video._id] || 0) + (wasLiked ? 1 : -1) }));
      toast.error("حدث خطأ");
    }
  };

  // ---------------------- COMMENTS ----------------------
  const fetchComments = async (postId: string) => {
    if (!myUserId || !token) {
      window.location.href = "/login";
      return;
    }
    try {
      setLoadingComments(true);
      const res = await fetch(`https://bo-chat.space/getcomments/${myUserId}?postid=${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load comments");
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const submitComment = async (postId: string) => {
    if (!myUserId || !token) {
      window.location.href = "/login";
      return;
    }
    if (!commentText.trim()) return;
    try {
      const res = await fetch(`https://bo-chat.space/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userid: myUserId, comment: commentText.trim() }),
      });
      if (!res.ok) throw new Error("Failed to send comment");
      setCommentText("");
      setUserCommentedStatus(prev => ({ ...prev, [postId]: true }));
      fetchComments(postId);
      toast.success("تم إضافة التعليق");
    } catch (err) {
      toast.error("خطأ في الإرسال");
    }
  };

  const handleReportComment = async (commentId: string) => {
    if (!token || !myUserId) return;
    try {
      const res = await fetch(`http://bo-chat.space/report/comment/${commentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userid: myUserId, reporttype: "comment", reportdescription: "محتوى غير لائق" }),
      });
      if (!res.ok) throw new Error();
      toast.success("تم الإبلاغ");
      setShowCommentMenu(null);
    } catch {
      toast.error("فشل الإبلاغ");
    }
  };

  const handleCommentLike = async (commentId: string) => {
    if (!token || !myUserId) return;
    setComments(prev =>
      prev.map(comment => {
        if (comment._id !== commentId) return comment;
        const alreadyLiked = Array.isArray(comment.reacts) && comment.reacts.includes(myUserId);
        return {
          ...comment,
          reacts: alreadyLiked
            ? comment.reacts.filter((id: string) => id !== myUserId)
            : [...(comment.reacts || []), myUserId],
        };
      })
    );
    try {
      const res = await fetch("https://bo-chat.space/comment/react", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userid: myUserId, commentid: commentId }),
      });
      if (!res.ok) throw new Error();
    } catch {
      fetchComments(videos[activeIndex]?._id);
    }
  };

  // ---------------------- SHARE ----------------------
  const handleShare = async (postId: string) => {
    if (!token || !myUserId) return;
    try {
      setSharing(true);
      const payload = { userid: myUserId, content: shareText.trim() };
      const res = await fetch(`http://bo-chat.space/posts/${postId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      let data;
      try { data = await res.json(); } catch { data = await res.text(); }
      if (!res.ok) throw new Error();
      toast.success("تمت المشاركة");
      setUserSharedStatus(prev => ({ ...prev, [postId]: true }));
      setShareText("");
      setShowShareOverlay(false);
    } catch {
      toast.error("فشل المشاركة");
    } finally {
      setSharing(false);
    }
  };

  // ===================== OPTIONS MENU FUNCTIONS =====================
  // const handleBlockVideo = () => {
  //   toast.error("الميزة قيد التطوير");
  //   setShowOptionsMenu(false);
  // };
 
const handleBlockVideo = async () => {
  if (!token || !myUserId) {
    window.location.href = "/login";
    return;
  }
  const video = videos[activeIndex];
  if (!video || !video.userid) {
    toast.error("لا يمكن حظر هذا المستخدم");
    return;
  }
  if (video.userid === myUserId) {
    toast.error("لا يمكنك حظر نفسك");
    return;
  }
  setIsBlocking(true);
  try {
    const res = await fetch(`https://bo-chat.space/block${myUserId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ blockedid: video.userid }),
    });
    const text = await res.text();
    if (!res.ok) throw new Error(text || "فشل الحظر");
    toast.success("تم حظر المستخدم بنجاح ");

    // إزالة فيديوهات هذا المستخدم من القائمة
    setVideos((prev) => prev.filter((v) => v.userid !== video.userid));
    // تعديل المؤشر النشط
    setActiveIndex((prev) => {
      if (prev >= videos.length - 1) return Math.max(0, prev - 1);
      return prev;
    });
    setShowOptionsMenu(false);
  } catch (err) {
    console.error("BLOCK ERROR:", err);
    toast.error("حدث خطأ أثناء الحظر");
  } finally {
    setIsBlocking(false);
  }
};

  const handleReportVideo = async () => {
    if (!token || !myUserId) {
      window.location.href = "/login";
      return;
    }
    try {
      const res = await fetch(`http://bo-chat.space/report${myUserId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          postid: videos[activeIndex]?._id,
          email: "",
        }),
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text || "فشل إرسال البلاغ");
      toast.success("تم إرسال البلاغ بنجاح");
      setShowOptionsMenu(false);
    } catch (err) {
      console.error("REPORT ERROR:", err);
      toast.error("حصل خطأ أثناء إرسال البلاغ");
    }
  };

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (optionsWrapperRef.current && !optionsWrapperRef.current.contains(e.target as Node)) {
        setShowOptionsMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---------------------- TIME AGO ----------------------
  function timeAgoAr(dateStr?: string) {
    if (!dateStr) return "منذ لحظات";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "منذ لحظات";
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diffSec < 60) return "منذ لحظات";
    const mins = Math.floor(diffSec / 60);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (mins < 60) return `منذ ${mins} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days < 30) return `منذ ${days} يوم`;
    return `منذ ${Math.floor(days / 30)} شهر`;
  }

  const myUserImg = typeof window !== "undefined" ? localStorage.getItem("userimg") : "/imgs/user.png";
  const currentVideo = videos[activeIndex];

  return (
    <div
      className="relative h-[595px] max-w-full rounded-[20px] overflow-hidden bg-black mx-auto"
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
            onPlay={() => {
              if (index === activeIndex) {
                setPlayingIndex(index);
              }
            }}
            onPause={() => {
              if (index === activeIndex) {
                setPlayingIndex(null);
              }
            }}
            controlsList="nodownload noremoteplayback"
            disablePictureInPicture
          />

          {index === activeIndex && (
            <>
              <div
                className="absolute bottom-0 left-0 right-0 pointer-events-none"
                style={{
                  width: '100%',
                  height: '140px',
                  background: "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%)",
                  borderBottomRightRadius: '20px',
                  borderBottomLeftRadius: '20px',
                  opacity: 1,
                }}
              />
              <div
                dir="ltr"
                className="absolute bottom-5 left-4 right-4 h-[4px] bg-white/20 rounded-full overflow-hidden z-10 cursor-pointer"
                onClick={handleSeekSmall}
              >
                <div
                  className="h-full bg-red-600 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          )}

          {/* User info + action icon */}
          <div className="absolute top-5 right-4 rounded-[19px] flex items-center gap-3 bg-black/30">
            <img
              src={video.userimg}
              alt={video.name}
              className="w-10 h-10 rounded-[19px] border border-white/30"
            />
            <div>
              <p className="text-white font-semibold">{video.name}</p>
              <p className="text-gray-300 text-sm">{timeAgoAr(video.createdAt)}</p>
            </div>
            <div
              onClick={() => openActionModal(video, followingStatus[video._id] ? "unfollow" : "follow")}
              className="ml-auto w-[50px] h-[45px] rounded-[19px] bg-white flex items-center justify-center cursor-pointer hover:opacity-80 transition"
            >
              <img
                src={followingStatus[video._id] ? "/imgs/Vector (7).svg" : "/imgs/Vector (7).svg"}
                alt="action"
                className="w-[19px] h-[19px]"
              />
            </div>
          </div>

          <div className="absolute bg-[#FFFFFF]/30 top-5 left-4 flex items-center px-3 py-2 backdrop-blur-md text-white gap-3 rounded-[17px]">
            <span className="text-sm">{video.views || 0}</span>
            <img src="/icons/eye.svg" className="rounded-17px" alt="" />
          </div>

          {/* العمود الأيمن للأزرار (بما فيها زر الخيارات) */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center gap-1">
            <button onClick={handleOverlay} className="text-white rounded-full bg-[#000000]/15 backdrop-blur-md w-[40px] h-[40px] flex items-center justify-center hover:bg-[#fff]/20 transition">
              <img src="/icons/fullscreen.svg" alt="" className="w-5 h-5" />
            </button>

            {/* زر الخيارات مع القائمة المعلقة */}
            <div ref={optionsWrapperRef} className="relative">
              <div
                onClick={() => setShowOptionsMenu((prev) => !prev)}
                className="text-white rounded-full bg-[#000000]/15 backdrop-blur-md w-[40px] h-[40px] flex items-center justify-center cursor-pointer hover:bg-[#fff]/20 transition"
              >
                <img src="/icons/options-white.svg" alt="options" className="w-5 h-5" />
              </div>
              {/* القائمة تظهر فوق الزر (bottom-full) ومحاذاة لليمين */}
              {showOptionsMenu && index === activeIndex && (
                <div className="absolute bottom-full right-0 mb-2 z-[9999]">
                  <div className="bg-[#000000]/15 rounded-[30px] shadow-xl backdrop-blur-xl p-4 w-[260px] flex flex-col gap-4">

                   
          <button
            type="button"
            onMouseDown={(e) => {
              e.stopPropagation(); 
              handleBlockVideo();
            }}
            disabled={isBlocking}
            className="w-full bg-white rounded-[20px] py-3 px-4 text-right flex items-center gap-2 cursor-pointer hover:bg-[#F2F2F2] disabled:opacity-50"
          >
            <div className="h-8 w-8 bg-[#D8D8D8] flex items-center justify-center rounded-full">
              <img
                src="/icons/eye.svg"
                className="w-5 h-5 invert-0 transform"
                style={{ filter: "brightness(0) saturate(100%)" }}
              />
            </div>
            <span className="text-black">
              {isBlocking ? "جاري الحظر..." : "لا اريد مشاهدة هذا"}
            </span>
          </button>
                    <button
                        onClick={handleReportVideo}
                        className="w-full bg-white rounded-[20px] py-3 px-4 text-right flex items-center gap-2 cursor-pointer hover:bg-[#F2F2F2]"
                      >
                        <div className="h-8 w-8 bg-[#D8D8D8] flex items-center justify-center rounded-full">
                          <img src="/icons/flag.svg" className="w-4 h-4" />
                        </div>
                        <span className="text-black">إبلاغ عن المنشور</span>
                      </button>
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => togglePlay(index)} className="text-white rounded-full bg-[#000000]/15 backdrop-blur-md w-[40px] h-[40px] flex items-center justify-center">
              <img src={playingIndex === index ? "/imgs/Group 9081.svg" : "/icons/play.svg"} className="w-5 h-5" />
            </button>
            <button onClick={handlePrevVideo} className="text-white rounded-full bg-[#000000]/15 backdrop-blur-md w-[40px] h-[40px] flex items-center justify-center">
              <img src="/icons/arrow-up.svg" alt="prev" className="w-5 h-5" />
            </button>
            <button onClick={handleNextVideo} className="text-white rounded-full bg-[#000000]/15 backdrop-blur-md w-[40px] h-[40px] flex items-center justify-center">
              <img src="/icons/arrow-down.svg" alt="next" className="w-5 h-5" />
            </button>

            {/* Like Button */}
            <button
              onClick={() => handleLike(video)}
              className={`text-white rounded-full backdrop-blur-md w-[40px] h-[40px] relative flex items-center justify-center transition-all ${
                likedStatus[video._id] ? "bg-[#D722294D]" : "bg-[#000000]/15"
              } active:bg-[#D722294D] active:backdrop-blur-[20px]`}
            >
              <img
                src={likedStatus[video._id] ? "/icons/like-white.svg" : "/icons/like-white.svg"}
                alt="like"
                className="w-5 h-5"
              />
            </button>

            {/* Comment Button */}
            <button
              onClick={() => {
                setShowCommentOverlay(true);
                fetchComments(video._id);
              }}
              className={`text-white rounded-full backdrop-blur-md w-[40px] h-[40px] relative flex items-center justify-center transition-all ${
                userCommentedStatus[video._id] ? "bg-[#D722294D]" : "bg-[#000000]/15"
              }`}
            >
              <img src="/icons/comment-white.svg" alt="comment" className="w-5 h-5" />
            </button>

            {/* Share Button */}
            <button
              onClick={() => setShowShareOverlay(true)}
              className={`text-white rounded-full backdrop-blur-md w-[40px] h-[40px] flex items-center justify-center transition-all ${
                userSharedStatus[video._id] ? "bg-[#D722294D]" : "bg-[#000000]/15"
              }`}
            >
              <img src="/icons/share-white.svg" alt="share" className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}

      {/* Fullscreen Overlay */}
      {showOverlay && (
        <div ref={containerRef} className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center">
          <div className="relative">
            <video
              ref={videoRef}
              src={videos[activeIndex]?.video[0]?.video}
              className="rounded-[17px] object-cover"
              style={{ width: "400px", height: "650px", borderBottomRightRadius: "21px", borderBottomLeftRadius: "22px" }}
              autoPlay
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setIsPlayingOverlay(true)}
              onPause={() => setIsPlayingOverlay(false)}
              controlsList="nodownload noremoteplayback"
              disablePictureInPicture
            />
            <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ width: "100%", height: "231px", background: "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%)", borderBottomRightRadius: "21px", borderBottomLeftRadius: "22px", opacity: 1 }} />
            <div className="absolute rounded-[19px] top-5 right-4 flex items-center gap-3 bg-black/30">
              <img src={videos[activeIndex]?.userimg} alt={videos[activeIndex]?.name} className="w-10 h-10 rounded-[17px] border border-white/30" />
              <div>
                <p className="text-white font-semibold">{videos[activeIndex]?.name}</p>
                <p className="text-gray-300 text-sm">{timeAgoAr(videos[activeIndex]?.createdAt)}</p>
              </div>
              <div
                onClick={() => {
                  const vid = videos[activeIndex];
                  if (vid) openActionModal(vid, followingStatus[vid._id] ? "unfollow" : "follow");
                }}
                className={`w-[50px] h-[45px] rounded-[19px] flex items-center justify-center cursor-pointer ${
                  followingStatus[videos[activeIndex]?._id] ? "bg-transparent" : "bg-white"
                }`}
              >
                <img
                  src={
                    followingStatus[videos[activeIndex]?._id]
                      ? "/imgs/unFollow.svg"
                      : "/imgs/Follow.svg"
                  }
                  className="w-[19px] h-[19px]"
                />
              </div>
            </div>

            <div className="absolute top-20 right-2 flex flex-col items-center gap-2">
              {/* زر الخيارات في الوضع المكبر */}
              <div ref={optionsWrapperRef} className="relative">
                <div
                  onClick={() => setShowOptionsMenu((prev) => !prev)}
                  className="text-white rounded-full bg-[#000000]/15 backdrop-blur-md p-3 w-[45px] h-[45px] flex items-center justify-center cursor-pointer hover:bg-[#fff]/20 transition"
                >
                  <img src="/icons/options-white.svg" className="w-5 h-5" />
                </div>
                {showOptionsMenu && (
  <div className="absolute top-full right-9 mt-[-7] z-[9999]">
    <div className="bg-[#000000]/15 rounded-[30px] shadow-xl backdrop-blur-xl p-4 w-[260px] flex flex-col gap-4">
      <button
        onClick={handleBlockVideo}
        className="w-full bg-white rounded-[20px] py-3 px-4 text-right flex items-center gap-2 cursor-pointer hover:bg-[#F2F2F2]"
      >
        <div className="h-8 w-8 bg-[#D8D8D8] flex items-center justify-center rounded-full">
          <img
            src="/icons/eye.svg"
            className="w-5 h-5 invert-0 transform"
            style={{ filter: "brightness(0) saturate(100%)" }}
          />
        </div>
        <span className="text-black">لا اريد مشاهدة هذا</span>
      </button>
      <button
        onClick={handleReportVideo}
        className="w-full bg-white rounded-[20px] py-3 px-4 text-right flex items-center gap-2 cursor-pointer hover:bg-[#F2F2F2]"
      >
        <div className="h-8 w-8 bg-[#D8D8D8] flex items-center justify-center rounded-full">
          <img src="/icons/flag.svg" className="w-4 h-4" />
        </div>
        <span className="text-black">إبلاغ عن المنشور</span>
      </button>
    </div>
  </div>
)}
              </div>

              <button onClick={togglePlayOverlay} className="text-white rounded-full bg-[#000000]/15 backdrop-blur-md p-3 w-[45px] h-[45px] flex items-center justify-center">
                <img src={isPlayingOverlay ? "/imgs/Group 9081.svg" : "/icons/play.svg"} className="w-5 h-5" />
              </button>

              {/* Like Button (Overlay) */}
              <button
                onClick={() => handleLike(videos[activeIndex])}
                className={`text-white rounded-full backdrop-blur-md p-3 w-[45px] h-[45px] flex flex-col items-center justify-center transition-all ${
                  likedStatus[videos[activeIndex]?._id] ? "bg-[#D722294D]" : "bg-[#000000]/15"
                } active:bg-[#D722294D] active:backdrop-blur-[20px]`}
              >
                <img
                  src={likedStatus[videos[activeIndex]?._id] ? "/icons/like-white.svg" : "/icons/like-white.svg"}
                  className="w-5 h-5"
                />
              </button>

              {/* Comment Button (Overlay) */}
              <button
                onClick={() => { setShowCommentOverlay(true); fetchComments(videos[activeIndex]?._id); }}
                className={`text-white rounded-full backdrop-blur-md p-3 w-[45px] h-[45px] flex items-center justify-center transition-all ${
                  userCommentedStatus[videos[activeIndex]?._id] ? "bg-[#D722294D]" : "bg-[#000000]/15"
                }`}
              >
                <img src="/icons/comment-white.svg" className="w-5 h-5" />
              </button>

              {/* Share Button (Overlay) */}
              <button
                onClick={() => setShowShareOverlay(true)}
                className={`text-white rounded-full backdrop-blur-md p-3 w-[45px] h-[45px] flex items-center justify-center transition-all ${
                  userSharedStatus[videos[activeIndex]?._id] ? "bg-[#D722294D]" : "bg-[#000000]/15"
                }`}
              >
                <img src="/icons/share-white.svg" className="w-5 h-5" />
              </button>

              <button onClick={() => seekForward(10)} className="text-white rounded-full bg-[#000000]/15 backdrop-blur-md p-3 w-[45px] h-[45px] flex items-center justify-center mt-5">
                <img src="/imgs/next.svg" className="w-5 h-5" />
              </button>
              <button onClick={() => seekBackward(10)} className="text-white rounded-full bg-[#000000]/15 backdrop-blur-md p-3 w-[45px] h-[45px] flex items-center justify-center">
                <img src="/imgs/pre (1).svg" className="w-5 h-5" />
              </button>
            </div>

            <div className="absolute bg-[#FFFFFF]/30 top-5 left-4 flex items-center px-3 py-2 backdrop-blur-md text-white gap-3 rounded-[17px]">
              <span className="text-sm">{videos[activeIndex]?.views || 0}</span>
              <img src="/icons/eye.svg" alt="" />
            </div>
          </div>

          <h1 className="absolute top-15 right-8 text-white text-xl">الريلز</h1>
          <div className="absolute top-1/2 right-8 transform -translate-y-1/2 flex flex-col items-center gap-3">
            <button onClick={handleCloseOverlay} className="w-[45px] h-[45px] rounded-full bg-[#fff]/15 backdrop-blur-md flex items-center justify-center">
              <img src="/icons/close.svg" alt="" />
            </button>
            <button onClick={handlePrevVideo} className="text-white rounded-full bg-[#fff]/15 backdrop-blur-md p-3 w-[45px] h-[45px] flex items-center justify-center">
              <img src="/icons/arrow-up.svg" alt="" />
            </button>
            <button onClick={handleNextVideo} className="text-white rounded-full bg-[#fff]/15 backdrop-blur-md p-3 w-[45px] h-[45px] flex items-center justify-center">
              <img src="/icons/arrow-down.svg" alt="" />
            </button>
          </div>
          <div onClick={handleSeek} dir="ltr" className="absolute bottom-[9vh] left-1/2 -translate-x-1/2 bg-gray-600 rounded-full cursor-pointer overflow-hidden" style={{ width: videoWidth ? `${videoWidth - 30}px` : "calc(70% - 8px)", height: "6px" }}>
            <div className="h-full bg-red-600 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      {/* ========== COMMENT OVERLAY ========== */}
      {showCommentOverlay && currentVideo && (
        <div className="fixed inset-0 z-[9999] bg-[#0000001A] backdrop-blur-[20px] flex items-center justify-center">
          <div className="relative w-[90%] max-w-[600px] rounded-[25px] max-h-[80vh] bg-gradient-to-l from-[#fff] to-[#8D8D8D] flex flex-col z-[99999]">
            <div
              onClick={() => setShowCommentOverlay(false)}
              className="absolute -top-16 left-1/2 w-[50px] h-[50px] bg-[#000]/15 flex items-center justify-center rounded-full hover:bg-[#fff]/10 transform -translate-x-1/2 cursor-pointer z-9999 transition"
            >
              <img src="/icons/close.svg" alt="close" />
            </div>
            <h3 className="text-lg font-semibold text-right p-3 bg-[#fff]/25 backdrop-blur-xl rounded-t-[25px]">التعليقات</h3>
            <div className="overflow-y-auto space-y-2 scrollbar-hidden">
              {loadingComments && <Loader />}
              {!loadingComments && comments.length === 0 && (
                <div className="flex items-center justify-center w-full h-[400px] flex-col gap-4">
                  <img src="/icons/nocomments.svg" className="w-[65px]" alt="" />
                  <p className="text-2xl">مافيش ردود لسه</p>
                  <p className="text-md">كن أول من يعلق</p>
                </div>
              )}
              {!loadingComments &&
                comments.map((comment, idx) => {
                  const isCommentLikedByMe = myUserId && Array.isArray(comment.reacts) && comment.reacts.includes(myUserId);
                  const commentReactsCount = comment.reacts?.length || 0;
                  return (
                    <div key={comment._id || idx} className="flex relative items-start justify-between p-3 gap-2 bg-[#000]/10 h-auto">
                      <div className="flex items-start gap-3">
                        <div className="w-[54px] h-[54px] shrink-0 rounded-[23px] overflow-hidden">
                          <img src={comment.userimg || "/imgs/user.png"} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 text-right">
                          <div className="flex flex-col">
                            <span className="font-semibold text-[15px] text-white">
                              {comment.name || comment.username || "مستخدم"}
                            </span>
                            <div className="flex gap-2">
                              <span className="text-[12px] text-black/50">@{ (comment.username || "").replaceAll(" ", "") }</span>
                              <span className="text-[12px] text-[#D72229]">{timeAgoAr(comment.createdAt)}</span>
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-black/80 whitespace-pre-wrap leading-6">{comment.content}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div
                          onClick={() => handleCommentLike(comment._id)}
                          className={`w-[60px] h-[34px] rounded-[15px] ${isCommentLikedByMe ? "bg-[#D72229]" : "bg-[#B4B4B9]"} flex items-center justify-center gap-2 cursor-pointer`}
                        >
                          {commentReactsCount > 0 && <p className="text-white text-sm">{commentReactsCount}</p>}
                          <img src="/icons/like.svg" className="w-4 h-4 filter brightness-0 invert" alt="like" />
                        </div>
                        <div
                          onClick={(e) => { e.stopPropagation(); setShowCommentMenu(showCommentMenu === comment._id ? null : comment._id); }}
                          className="w-[50px] h-[34px] rounded-[15px] flex bg-[#B4B4B9]/30 border border-[#fff]/40 items-center justify-center gap-2 cursor-pointer"
                        >
                          <img src="/imgs/dots.svg" className="filter invert" alt="" />
                        </div>
                        {showCommentMenu === comment._id && (
                          <div className="absolute bottom-1 left-0 z-[9999] flex gap-2 ml-3" onClick={(e) => e.stopPropagation()}>
                            <button className="w-[100px] flex items-center gap-1.5 rounded-[18px] px-2 py-2 text-sm bg-[#000]/30 text-white">
                              <div className="w-[38px] h-[38px] bg-white rounded-full flex items-center justify-center"><img src="/icons/reply.svg" alt="" /></div>
                              <span>رد</span>
                            </button>
                            <button className="w-[100px] flex items-center gap-1.5 rounded-[18px] px-3 py-2 text-sm bg-[#D72229]/30 text-white">
                              <div className="w-[38px] h-[38px] bg-white rounded-full flex items-center justify-center"><img src="/icons/ban.svg" alt="" /></div>
                              <span>حجب</span>
                            </button>
                            <button onClick={() => handleReportComment(comment._id)} className="w-[100px] flex items-center gap-1.5 rounded-[18px] px-3 py-2 text-sm bg-[#D72229]/30 text-white">
                              <div className="w-[38px] h-[38px] bg-white rounded-full flex items-center justify-center"><img src="/icons/flag.svg" style={{ filter: "invert(27%) sepia(88%) saturate(2997%) hue-rotate(342deg) brightness(91%) contrast(96%)" }} alt="" /></div>
                              <span>بلاغ</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              <div className="flex items-center gap-3 bg-[#fff]/50 backdrop-blur-xl p-3 rounded-b-[25px]">
                <div className="w-[42px] h-[42px] rounded-[21px] overflow-hidden shrink-0">
                  <img src={myUserImg || "/imgs/user.png"} className="w-full h-full object-cover" />
                </div>
                <div className="bg-[#000]/10 backdrop-blur-xl w-full flex rounded-[19px]">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="اكتب تعليقك هنا"
                    className="flex-1 bg-transparent outline-none p-3"
                  />
                  <button
                    onClick={() => submitComment(currentVideo._id)}
                    className="bg-white px-4 py-3 rounded-tl-[19px] rounded-b-[19px] text-[#D72229] font-semibold shrink-0 cursor-pointer"
                  >
                    نشر
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SHARE OVERLAY */}
      {showShareOverlay && currentVideo && (
        <div className="fixed inset-0 z-[100000] bg-[#000]/10 backdrop-blur-[10px] flex items-center justify-center">
          <div className="w-[90%] max-w-[690px] rounded-[25px] backdrop-blur-xl relative bg-gradient-to-l from-[#fff] to-[#8D8D8D]">
            <div onClick={() => setShowShareOverlay(false)} className="absolute -top-16 left-1/2 w-[50px] h-[50px] bg-[#000]/15 flex items-center justify-center rounded-full hover:bg-[#fff]/10 transform -translate-x-1/2 cursor-pointer transition"><img src="/icons/close.svg" alt="close" /></div>
            <h3 className="text-right text-lg font-semibold bg-[#fff]/25 backdrop-blur-md p-3 rounded-t-[25px]">شارك الفيديو</h3>
            <div className="p-5">
              <textarea placeholder="اكتب نصاً مشاركاً (اختياري)" value={shareText} onChange={(e) => setShareText(e.target.value)} className="w-full h-[247px] p-4 rounded-[20px] bg-transparent resize-none outline-none border border-black/10" />
            </div>
            <div className="px-5 pb-5">
              <div className="flex items-center justify-center">
                <button onClick={() => handleShare(currentVideo._id)} className={`w-[300px] mx-auto py-4 rounded-[23px] mt-4 text-white transition cursor-pointer ${sharing || !shareText.trim() ? "bg-black/40" : "bg-[#D72229] hover:bg-[#b91c22]"}`}>{sharing ? "جاري الشير..." : "شارك"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unfollow Modal */}
      {showUnfollowModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
          <div className="w-[237px] h-[271px] rounded-[26px] flex flex-col items-center justify-between py-6" style={{ background: "#00000080", backdropFilter: "blur(15px)" }}>
            <h2 className={`${modalType === "unfollow" ? "text-[#F92429]" : "text-white"} font-semibold text-[18px] text-center mt-4`}>{modalType === "unfollow" ? "إلغاء المتابعة؟" : "متابعة؟"}</h2>
            <p className="text-white font-semibold text-[12px] text-center w-[226px] mt-5">{modalType === "unfollow" ? "لن ترى تحديثات هذا المستخدم في صفحتك بعد الآن" : "ستظهر تحديثات هذا المستخدم في صفحتك"}</p>
            <button onClick={confirmAction} disabled={isUnfollowing} className="w-[185px] h-[50px] rounded-[19px] border border-[#D72229] flex items-center justify-center bg-transparent mt-7"><span className="text-[#D72229] font-semibold">{isUnfollowing ? "جاري..." : (modalType === "unfollow" ? "إلغاء المتابعة" : "متابعة")}</span></button>
            <div className="w-[239px] h-[0px] border-t border-[#70707033] my-2" />
            <button onClick={closeUnfollowModal} className="w-[185px] h-[50px] rounded-[19px] border border-[#D72229] flex items-center justify-center bg-[#D72229]"><span className="text-white font-semibold">إلغاء</span></button>
          </div>
        </div>
      )}
    </div>
  );
}