 "use client";

import Loader from "@/components/Loader";

interface CommentOverlayProps {
  videoId: string;
  isOpen: boolean;
  onClose: () => void;
  openLoginModal: () => void;
  comments: any[];
  loadingComments: boolean;
  commentText: string;
  setCommentText: (text: string) => void;
  showCommentMenu: string | null;
  setShowCommentMenu: (id: string | null) => void;
  submitComment: (postId: string) => Promise<void>;
  handleCommentLike: (commentId: string, postId: string) => Promise<void>;
  handleReportComment: (commentId: string) => Promise<void>;
 
  myUserImg?: string;
  myUserId?: string;
}

export function CommentOverlay({
  videoId,
  isOpen,
  onClose,
  openLoginModal,
  comments,
  loadingComments,
  commentText,
  setCommentText,
  showCommentMenu,
  setShowCommentMenu,
  submitComment,
  handleCommentLike,
  handleReportComment,
  myUserImg = "/imgs/user.png",
  myUserId = "",
}: CommentOverlayProps) {
  // وقت النشر
  function timeAgo(dateStr?: string) {
    if (!dateStr) return "الآن";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "الآن";
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diffSec < 60) return "الآن";
    const mins = Math.floor(diffSec / 60);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);

    if (mins < 60) {
      return `${mins} ${mins === 1 ? "دقيقة" : "دقائق"} مضت`;
    }
    if (hours < 24) {
      return `${hours} ${hours === 1 ? "ساعة" : "ساعات"} مضت`;
    }
    if (days < 30) {
      return `${days} ${days === 1 ? "يوم" : "أيام"} مضت`;
    }
    return `${months} ${months === 1 ? "شهر" : "شهور"} مضت`;
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100000] bg-[#0000001A] backdrop-blur-[20px] flex items-center justify-center">
      <div className="relative w-[90%] max-w-[600px] rounded-[25px] max-h-[80vh] bg-gradient-to-l from-[#fff] to-[#8D8D8D] flex flex-col z-[99999]">
        {/* زر الإغلاق */}
        <div
          onClick={onClose}
          className="absolute -top-16 left-1/2 w-[50px] h-[50px] bg-[#000]/15 flex items-center justify-center rounded-full hover:bg-[#fff]/10 transform -translate-x-1/2 cursor-pointer z-9999 transition"
        >
          <img src="/icons/close.svg" alt="close" />
        </div>

        <h3 className="text-lg font-semibold text-right p-3 bg-[#fff]/25 backdrop-blur-xl rounded-t-[25px]">
          التعليقات
        </h3>

        {/* قائمة التعليقات */}
        <div className="overflow-y-auto space-y-2 scrollbar-hidden">
          {loadingComments && <Loader />}
          {!loadingComments && comments.length === 0 && (
            <div className="flex items-center justify-center w-full h-[400px] flex-col gap-4">
              <img src="/icons/nocomments.svg" className="w-[65px]" alt="لا توجد تعليقات" />
              <p className="text-2xl">لا توجد تعليقات</p>
              <p className="text-md">كن أول من يعلق!</p>
            </div>
          )}
          {!loadingComments &&
            comments.map((comment, idx) => {
              const isCommentLikedByMe =
                myUserId &&
                Array.isArray(comment.reacts) &&
                comment.reacts.includes(myUserId);
              const commentReactsCount = comment.reacts?.length || 0;
              return (
                <div
                  key={comment._id || idx}
                  className="flex relative items-start justify-between p-3 gap-2 bg-[#000]/10 h-auto"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-[54px] h-[54px] shrink-0 rounded-[23px] overflow-hidden">
                      <img
                        src={comment.userimg || "/imgs/user.png"}
                        className="w-full h-full object-cover"
                        alt="user"
                      />
                    </div>
                    <div className="flex-1 text-right">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[15px] text-white">
                          {comment.name || comment.username || "مستخدم"}
                        </span>
                        <div className="flex gap-2">
                          <span className="text-[12px] text-black/50">
                            @{(comment.username || "").replaceAll(" ", "")}
                          </span>
                          <span className="text-[12px] text-[#D72229]">
                            {timeAgo(comment.createdAt)}
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-black/80 whitespace-pre-wrap leading-6">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div
                      onClick={() => handleCommentLike(comment._id, videoId)}
                      className={`w-[60px] h-[34px] rounded-[15px] ${
                        isCommentLikedByMe ? "bg-[#D72229]" : "bg-[#B4B4B9]"
                      } flex items-center justify-center gap-2 cursor-pointer`}
                    >
                      {commentReactsCount > 0 && (
                        <p className="text-white text-sm">{commentReactsCount}</p>
                      )}
                      <img
                        src="/icons/like.svg"
                        className="w-4 h-4 filter brightness-0 invert"
                        alt="like"
                      />
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCommentMenu(
                          showCommentMenu === comment._id ? null : comment._id
                        );
                      }}
                      className="w-[50px] h-[34px] rounded-[15px] flex bg-[#B4B4B9]/30 border border-[#fff]/40 items-center justify-center gap-2 cursor-pointer"
                    >
                      <img src="/imgs/dots.svg" className="filter invert" alt="menu" />
                    </div>
                    {showCommentMenu === comment._id && (
                      <div
                        className="absolute bottom-1 left-0 z-[9999] flex gap-2 ml-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button className="w-[100px] flex items-center gap-1.5 rounded-[18px] px-2 py-2 text-sm bg-[#000]/30 text-white">
                          <div className="w-[38px] h-[38px] bg-white rounded-full flex items-center justify-center">
                            <img src="/icons/reply.svg" alt="reply" />
                          </div>
                          <span>رد</span>
                        </button>
                        <button className="w-[100px] flex items-center gap-1.5 rounded-[18px] px-3 py-2 text-sm bg-[#D72229]/30 text-white">
                          <div className="w-[38px] h-[38px] bg-white rounded-full flex items-center justify-center">
                            <img src="/icons/ban.svg" alt="block" />
                          </div>
                          <span>حجب</span>
                        </button>
                        <button
                          onClick={() => handleReportComment(comment._id)}
                          className="w-[100px] flex items-center gap-1.5 rounded-[18px] px-3 py-2 text-sm bg-[#D72229]/30 text-white"
                        >
                          <div className="w-[38px] h-[38px] bg-white rounded-full flex items-center justify-center">
                            <img
                              src="/icons/flag.svg"
                              style={{
                                filter: "invert(27%) sepia(88%) saturate(2997%) hue-rotate(342deg) brightness(91%) contrast(96%)",
                              }}
                              alt="report"
                            />
                          </div>
                          <span>إبلاغ</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

          {/* حقل إدخال التعليق */}
          <div className="flex items-center gap-3 bg-[#fff]/50 backdrop-blur-xl p-3 rounded-b-[25px]">
            <div className="w-[42px] h-[42px] rounded-[21px] overflow-hidden shrink-0">
              <img
                src={myUserImg}
                className="w-full h-full object-cover"
                alt="user"
              />
            </div>
            <div className="bg-[#000]/10 backdrop-blur-xl w-full flex rounded-[19px]">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="اكتب تعليقك..."
                className="flex-1 bg-transparent outline-none p-3"
              />
              <button
                onClick={() => submitComment(videoId)}
                className="bg-white px-4 py-3 rounded-tl-[19px] rounded-b-[19px] text-[#D72229] font-semibold shrink-0 cursor-pointer"
              >
                نشر
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}