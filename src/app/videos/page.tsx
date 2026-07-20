// // app/videos/page.tsx
// "use client";

// import { useState, useRef, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Loader from "@/components/Loader";
// import { VideoPlayer } from "@/components/video/VideoPlayer";
// import { SideButtons } from "@/components/video/SideButtons";
// import { CommentOverlay } from "@/components/video/CommentOverlay";
// import { ShareOverlay } from "@/components/video/ShareOverlay";
// import { FullscreenOverlay } from "@/components/video/FullscreenOverlay";
// import { useVideos } from "@/hooks/useVideos";
// import { useVideoActions } from "@/hooks/useVideoActions";
// import { useLoginModal } from "@/contexts/LoginModalContext";
// import { useVideoStore } from "@/store/videoStore";

// export default function VideosPage() {
//   const router = useRouter();
//   const { selectedVideo, setSelectedVideo } = useVideoStore((state) => state);

//   const { videos, loading, currentIndex, currentVideo, goToPrev, goToNext, refresh } = useVideos();
//   const { openLoginModal } = useLoginModal();
//   const actions = useVideoActions(videos, openLoginModal);

//   const displayVideo = selectedVideo || currentVideo;

//   const [isPlaying, setIsPlaying] = useState(true);
//   const [progress, setProgress] = useState(0);
//   const [showCommentOverlay, setShowCommentOverlay] = useState(false);
//   const [showFullscreen, setShowFullscreen] = useState(false);
//   const videoRef = useRef<HTMLVideoElement>(null);
  
//   // Video Functions
//   const handleTimeUpdate = () => {
//     if (videoRef.current) {
//       const { currentTime, duration } = videoRef.current;
//       setProgress((currentTime / duration) * 100);
//     }
//   };
//   const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (videoRef.current) {
//       const rect = e.currentTarget.getBoundingClientRect();
//       const newTime = ((e.clientX - rect.left) / rect.width) * videoRef.current.duration;
//       videoRef.current.currentTime = newTime;
//     }
//   };
//   const togglePlay = () => {
//     if (videoRef.current) {
//       if (isPlaying) videoRef.current.pause();
//       else videoRef.current.play();
//       setIsPlaying(!isPlaying);
//     }
//   };

//   // Navigation
//   const handleNext = () => {
//     if (selectedVideo) {
//       setSelectedVideo(null);
//     }
//     goToNext();
//   };

//   const handlePrev = () => {
//     if (selectedVideo) {
//       setSelectedVideo(null);
//     }
//     goToPrev();
//   };

//   // Block & Report
//   const handleBlock = async () => {
//     if (!displayVideo?.userid) return;
//     await actions.handleBlockUser(displayVideo.userid, displayVideo._id, () => {
//       refresh();
//       if (selectedVideo) {
//         setSelectedVideo(null);
//         router.push("/videos");
//       }
//     });
//   };

//   const handleReport = async () => {
//     if (displayVideo) {
//       await actions.handleReportVideo(displayVideo._id);
//     }
//   };

//   // Refresh on login
//   useEffect(() => {
//     const handleUpdate = () => refresh();
//     window.addEventListener("userDataUpdated", handleUpdate);
//     return () => window.removeEventListener("userDataUpdated", handleUpdate);
//   }, [refresh]);

//   if (loading) return <div className="flex justify-center items-center h-screen"><Loader /></div>;

//   if (!displayVideo) {
//     return (
//       <div className="text-center mt-20 text-gray-500 dark:text-gray-400">
//         لا توجد فيديوهات
//       </div>
//     );
//   }

//   const video = displayVideo;

//   return (
//     <div className="min-h-screen pt-1 flex justify-center">
//       <div className="w-fit">
//         <h2 className="mb-4 text-xl font-bold ml-2">الريلز</h2>
//         <div className="flex items-start gap-4">
//           <VideoPlayer
//             ref={videoRef}
//             src={video.video?.[0]?.video || ""}
//             username={video.username || "username"}
//             description={video.description || "لا يوجد وصف"}
//             progress={progress}
//             onTimeUpdate={handleTimeUpdate}
//             onSeek={handleSeek}
//           />
//           <div className="relative">
//             <SideButtons
//               userImg={video.userimg || ""}
//               isLiked={actions.likedStatus[video._id] || false}
//               likeCount={actions.likesCount[video._id] || 0}
//               onLike={() => actions.handleLike(video)}
//               isPlaying={isPlaying}
//               onTogglePlay={togglePlay}
//               onPrev={handlePrev}
//               onNext={handleNext}
//               isFirst={currentIndex === 0 && !selectedVideo}
//               isLast={currentIndex === videos.length - 1 && !selectedVideo}
//               onComment={() => {
//                 setShowCommentOverlay(true);
//                 actions.fetchComments(video._id);
//                }}
//               onShare={() => actions.setShowShareOverlay(true)}
//               onFullscreen={() => setShowFullscreen(true)}
//               isShared={actions.userSharedStatus[video._id] || false}
//                onBlock={handleBlock}
//               onReport={handleReport}
//               isBlocking={actions.isBlocking}
//                commentsCount={actions.commentCounts[video._id] ?? 0}
//              isCommented={actions.userCommentedStatus[video._id] || false} 
//              shareCount={actions.shareCounts[video._id] ?? 0}  

//             />
//             {/*  */}
//           </div>
//         </div>
//       </div>

//       <CommentOverlay
//         videoId={video._id}
//         isOpen={showCommentOverlay}
//         onClose={() => setShowCommentOverlay(false)}
//         openLoginModal={openLoginModal}
//         comments={actions.comments}
//         loadingComments={actions.loadingComments}
//         commentText={actions.commentText}
//         setCommentText={actions.setCommentText}
//         showCommentMenu={actions.showCommentMenu}
//         setShowCommentMenu={actions.setShowCommentMenu}
//         submitComment={actions.submitComment}
//         handleCommentLike={actions.handleCommentLike}
//         handleReportComment={actions.handleReportComment}
//       />

//       <ShareOverlay
//         isOpen={actions.showShareOverlay}
//         onClose={() => actions.setShowShareOverlay(false)}
//         shareText={actions.shareText}
//         setShareText={actions.setShareText}
//         onShare={() => actions.handleShare(video._id)}
//         isSharing={actions.sharing}
//       />

//       <FullscreenOverlay
//         video={video}
//         isOpen={showFullscreen}
//         onClose={() => setShowFullscreen(false)}
//         onPrev={handlePrev}
//         onNext={handleNext}
//         isLiked={actions.likedStatus[video._id] || false}
//         likeCount={actions.likesCount[video._id] || 0}
//         onLike={() => actions.handleLike(video)}
//         onComment={() => {
//           setShowCommentOverlay(true);
//           actions.fetchComments(video._id);
//         }}
//         onShare={() => actions.setShowShareOverlay(true)}
//         onBlock={handleBlock}
//         onReport={handleReport}
//       />
//     </div>
//   );
// }


// app/videos/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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

  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showCommentOverlay, setShowCommentOverlay] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // ✅ حالة المتابعة
  const [followingStatus, setFollowingStatus] = useState<Record<string, boolean>>({});
  const [followingList, setFollowingList] = useState<string[]>([]);

  // ✅ جلب قائمة المتابعين
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

  // ✅ جلب المتابعين عند التحميل
  useEffect(() => {
    fetchFollowingList();
  }, []);

  // ✅ تحديث حالة المتابعة عند تغير الفيديوهات
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

  // ✅ دالة الانتقال إلى البروفايل
  const handleProfileClick = (userId: string) => {
    if (userId) {
      router.push(`/profile/${userId}`);
    }
  };

  // Video Functions
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

  // Navigation
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

  // Block & Report
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

  // Refresh on login
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
              // ✅ تمرير حالة المتابعة لإظهار علامة الصح
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
              onFullscreen={() => setShowFullscreen(true)}
              isShared={actions.userSharedStatus[video._id] || false}
              onBlock={handleBlock}
              onReport={handleReport}
              isBlocking={actions.isBlocking}
              commentsCount={actions.commentCounts[video._id] ?? 0}
              isCommented={actions.userCommentedStatus[video._id] || false}
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
        onClose={() => setShowFullscreen(false)}
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
      />
    </div>
  );
}