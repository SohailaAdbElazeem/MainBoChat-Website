// app/videos/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { SideButtons } from "@/components/video/SideButtons";
import { CommentOverlay } from "@/components/video/CommentOverlay";
import { ShareOverlay } from "@/components/video/ShareOverlay";
import { FullscreenOverlay } from "@/components/video/FullscreenOverlay";
import { useVideos } from "@/hooks/useVideos";
import { useVideoActions } from "@/hooks/useVideoActions";
import { useLoginModal } from "@/contexts/LoginModalContext";
import { useVideoStore } from "@/store/videoStore";
import { getToken, getUserId } from "@/lib/auth-client";

export default function VideosPage() {
  const router = useRouter();
  const { selectedVideo, setSelectedVideo } = useVideoStore((state) => state);

  const { videos, loading, currentIndex, currentVideo, goToPrev, goToNext, refresh } = useVideos();
  const { openLoginModal } = useLoginModal();
  const actions = useVideoActions(videos, openLoginModal);

  const displayVideo = selectedVideo || currentVideo;

  // ===== حالة الفيديو =====
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showCommentOverlay, setShowCommentOverlay] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [wasPlaying, setWasPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // ===== حالة المتابعة =====
  const [followingStatus, setFollowingStatus] = useState<Record<string, boolean>>({});
  const [followingList, setFollowingList] = useState<string[]>([]);

  // ===== حالة نافذة المتابعة/إلغاء المتابعة =====
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const [unfollowTargetVideo, setUnfollowTargetVideo] = useState<any>(null);
  const [modalType, setModalType] = useState<"unfollow" | "follow">("unfollow");
  const [isUnfollowing, setIsUnfollowing] = useState(false);

  // ===== جلب قائمة المتابعين =====
  const fetchFollowingList = async () => {
    const token = getToken();
    const userId = getUserId();
    if (!userId || !token) return;
    try {
      const res = await fetch(`https://bo-chat.space/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch user data");
      const data = await res.json();
      const following = Array.isArray(data.following)
        ? data.following.map((item: any) => item.followingid)
        : [];
      setFollowingList(following);
      setFollowingStatus((prev) => {
        const newStatus = { ...prev };
        videos.forEach((video) => {
          newStatus[video._id] = following.includes(video.userid || '');
        });
        return newStatus;
      });
    } catch (err) {
      console.error("Error fetching following list:", err);
    }
  };

  useEffect(() => {
    fetchFollowingList();
  }, []);

  useEffect(() => {
    setFollowingStatus((prev) => {
      const newStatus = { ...prev };
      videos.forEach((video) => {
        if (!(video._id in newStatus)) {
          newStatus[video._id] = followingList.includes(video.userid || '');
        }
      });
      return newStatus;
    });
  }, [videos, followingList]);

  // ===== دوال المتابعة/إلغاء المتابعة =====
  const openActionModal = (video: any, type: "unfollow" | "follow") => {
    const token = getToken();
    const userId = getUserId();
    if (!userId || !token) {
      openLoginModal();
      return;
    }
    setUnfollowTargetVideo(video);
    setModalType(type);
    setShowUnfollowModal(true);
  };

  const closeUnfollowModal = () => {
    setShowUnfollowModal(false);
    setUnfollowTargetVideo(null);
    setIsUnfollowing(false);
  };

  const confirmAction = async () => {
    if (!unfollowTargetVideo || isUnfollowing) return;
    const currentUserId = getUserId();
    const authToken = getToken();
    if (!currentUserId || !authToken) return;
    const targetUserId = unfollowTargetVideo.userid;
    if (!targetUserId) return;

    setIsUnfollowing(true);
    try {
      const res = await fetch("https://bo-chat.space/follow", {
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
        setFollowingList(prev => {
          if (newStatus) {
            if (!prev.includes(targetUserId)) {
              return [...prev, targetUserId];
            }
            return prev;
          } else {
            return prev.filter(id => id !== targetUserId);
          }
        });
        closeUnfollowModal();
        toast.success(modalType === "follow" ? "تم المتابعة" : "تم إلغاء المتابعة");
      } else {
        toast.error(data.message || "حدث خطأ");
      }
    } catch (err) {
      console.error("Follow error:", err);
      toast.error("خطأ في الاتصال");
    } finally {
      setIsUnfollowing(false);
    }
  };

  // ===== دوال التحكم بالفيديو =====
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const { currentTime, duration } = videoRef.current;
      setProgress((currentTime / duration) * 100);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const newTime = ((e.clientX - rect.left) / rect.width) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  // ===== دوال الشاشة الكاملة =====
  const handleFullscreenOpen = () => {
    setWasPlaying(isPlaying);
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    setShowFullscreen(true);
  };

  const handleFullscreenClose = () => {
    setShowFullscreen(false);
    if (wasPlaying && videoRef.current) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // ===== التنقل بين الفيديوهات =====
  const handleNext = () => {
    if (selectedVideo) {
      setSelectedVideo(null);
    }
    goToNext();
  };

  const handlePrev = () => {
    if (selectedVideo) {
      setSelectedVideo(null);
    }
    goToPrev();
  };

  // ===== الحظر والإبلاغ =====
  const handleBlock = async () => {
    if (!displayVideo?.userid) return;
    await actions.handleBlockUser(displayVideo.userid, displayVideo._id, () => {
      refresh();
      if (selectedVideo) {
        setSelectedVideo(null);
        router.push("/videos");
      }
    });
  };

  const handleReport = async () => {
    if (displayVideo) {
      await actions.handleReportVideo(displayVideo._id);
    }
  };

  // ===== دالة الانتقال إلى البروفايل =====
  const handleProfileClick = (userId: string) => {
    if (userId) {
      router.push(`/profile/${userId}`);
    }
  };

  // ===== تحديث الفيديوهات عند تسجيل الدخول/الخروج =====
  useEffect(() => {
    const handleUpdate = () => refresh();
    window.addEventListener("userDataUpdated", handleUpdate);
    return () => window.removeEventListener("userDataUpdated", handleUpdate);
  }, [refresh]);

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader /></div>;

  if (!displayVideo) {
    return (
      <div className="text-center mt-20 text-gray-500 dark:text-gray-400">
        لا توجد فيديوهات
      </div>
    );
  }

  const video = displayVideo;

  return (
    <div className="min-h-screen pt-1 flex justify-center">
      <div className="w-fit">
        <h2 className="mb-4 text-xl font-bold ml-2">الريلز</h2>
        <div className="flex items-start gap-4">
          <VideoPlayer
            ref={videoRef}
            src={video.video?.[0]?.video || ""}
            username={video.username || "username"}
            description={video.description || "لا يوجد وصف"}
            progress={progress}
            onTimeUpdate={handleTimeUpdate}
            onSeek={handleSeek}
          />
          <div className="relative">
            <SideButtons
              userImg={video.userimg || ""}
              userId={video.userid}
              onProfileClick={handleProfileClick}
              isFollowing={followingStatus[video._id] || false}
              isLiked={actions.likedStatus[video._id] || false}
              likeCount={actions.likesCount[video._id] || 0}
              onLike={() => actions.handleLike(video)}
              isPlaying={isPlaying}
              onTogglePlay={togglePlay}
              onPrev={handlePrev}
              onNext={handleNext}
              isFirst={currentIndex === 0 && !selectedVideo}
              isLast={currentIndex === videos.length - 1 && !selectedVideo}
              onComment={() => {
                setShowCommentOverlay(true);
                actions.fetchComments(video._id);
              }}
              onShare={() => actions.setShowShareOverlay(true)}
              onFullscreen={handleFullscreenOpen}
              isShared={actions.userSharedStatus[video._id] || false}
              onBlock={handleBlock}
              onReport={handleReport}
              isBlocking={actions.isBlocking}
              commentsCount={actions.commentCounts[video._id] ?? 0}
              isCommented={actions.userCommentedStatus[video._id] || false}
              shareCount={actions.shareCounts[video._id] ?? 0}
            />
          </div>
        </div>
      </div>

      <CommentOverlay
        videoId={video._id}
        isOpen={showCommentOverlay}
        onClose={() => setShowCommentOverlay(false)}
        openLoginModal={openLoginModal}
        comments={actions.comments}
        loadingComments={actions.loadingComments}
        commentText={actions.commentText}
        setCommentText={actions.setCommentText}
        showCommentMenu={actions.showCommentMenu}
        setShowCommentMenu={actions.setShowCommentMenu}
        submitComment={actions.submitComment}
        handleCommentLike={actions.handleCommentLike}
        handleReportComment={actions.handleReportComment}
      />

      <ShareOverlay
        isOpen={actions.showShareOverlay}
        onClose={() => actions.setShowShareOverlay(false)}
        shareText={actions.shareText}
        setShareText={actions.setShareText}
        onShare={() => actions.handleShare(video._id)}
        isSharing={actions.sharing}
      />

      <FullscreenOverlay
        video={video}
        isOpen={showFullscreen}
        onClose={handleFullscreenClose}
        onPrev={handlePrev}
        onNext={handleNext}
        isLiked={actions.likedStatus[video._id] || false}
        likeCount={actions.likesCount[video._id] || 0}
        onLike={() => actions.handleLike(video)}
        onComment={() => {
          setShowCommentOverlay(true);
          actions.fetchComments(video._id);
        }}
        onShare={() => actions.setShowShareOverlay(true)}
        onBlock={handleBlock}
        onReport={handleReport}
        isFollowing={followingStatus[video._id] || false}
        onFollowToggle={() => {
          const vid = video;
          if (vid) {
            openActionModal(vid, followingStatus[vid._id] ? "unfollow" : "follow");
          }
        }}
      />

      {/* نافذة تأكيد المتابعة/إلغاء المتابعة */}
      {showUnfollowModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50">
          <div className="w-[237px] h-[271px] rounded-[26px] flex flex-col items-center justify-between py-6" style={{ background: "#00000080", backdropFilter: "blur(15px)" }}>
            <h2 className={`${modalType === "unfollow" ? "text-[#F92429]" : "text-white"} font-semibold text-[18px] text-center mt-4`}>
              {modalType === "unfollow" ? "إلغاء المتابعة" : "متابعة"}
            </h2>
            <p className="text-white font-semibold text-[12px] text-center w-[226px] mt-5">
              {modalType === "unfollow" 
                ? "لن ترى تحديثات هذا المستخدم في صفحتك بعد الآن" 
                : "ستظهر تحديثات هذا المستخدم في صفحتك"}
            </p>
            <button 
              onClick={confirmAction} 
              disabled={isUnfollowing} 
              className="w-[185px] h-[50px] rounded-[19px] border border-[#D72229] flex items-center justify-center bg-transparent mt-7"
            >
              <span className="text-[#D72229] font-semibold">
                {isUnfollowing ? "جاري..." : (modalType === "unfollow" ? "إلغاء المتابعة" : "متابعة")}
              </span>
            </button>
            <div className="w-[239px] h-[0px] border-t border-[#70707033] my-2" />
            <button onClick={closeUnfollowModal} className="w-[185px] h-[50px] rounded-[19px] border border-[#D72229] flex items-center justify-center bg-[#D72229]">
              <span className="text-white font-semibold">إلغاء</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}