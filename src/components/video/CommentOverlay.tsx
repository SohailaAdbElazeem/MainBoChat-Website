// src/components/video/CommentOverlay.tsx
"use client";

import Loader from "@/components/Loader";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useTranslation } from '@/contexts/TranslationContext';
import { useState, useEffect, useMemo } from "react";

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
   const t = useTranslations('CommentOverlay');
  
   const locale = useLocale();
  const isRTL = locale === 'ar';
  const direction = isRTL ? 'rtl' : 'ltr';
  
   const { language, translate, isTranslating } = useTranslation();
  
   const [translatedComments, setTranslatedComments] = useState<Record<string, string>>({});
  const [isTranslatingComments, setIsTranslatingComments] = useState(false);

   useEffect(() => {
    const translateAllComments = async () => {
      if (!comments.length) return;
      
      setIsTranslatingComments(true);
      const translations: Record<string, string> = {};
      
      try {
        // ترجمة كل تعليق
        for (const comment of comments) {
          if (comment.content && comment.content.trim()) {
            try {
              const translated = await translate(comment.content);
              translations[comment._id] = translated;
            } catch (error) {
              console.error(`Error translating comment ${comment._id}:`, error);
              translations[comment._id] = comment.content;
            }
          }
        }
        setTranslatedComments(translations);
      } catch (error) {
        console.error("Error translating comments:", error);
      } finally {
        setIsTranslatingComments(false);
      }
    };

    // تأخير الترجمة لتجنب الطلبات المتكررة
    const timeoutId = setTimeout(() => {
      translateAllComments();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [language, comments]);

  // وقت النشر
  function timeAgo(dateStr?: string) {
    if (!dateStr) return t('now');
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return t('now');
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diffSec < 60) return t('now');
    const mins = Math.floor(diffSec / 60);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);

    if (mins < 60) {
      return t('minutes_ago', { count: mins });
    }
    if (hours < 24) {
      return t('hours_ago', { count: hours });
    }
    if (days < 30) {
      return t('days_ago', { count: days });
    }
    return t('months_ago', { count: months });
  }

  // الحصول على النص المترجم للتعليق
  const getTranslatedContent = (comment: any) => {
    if (language === 'ar') {
       return comment.content;
    }
     return translatedComments[comment._id] || comment.content;
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100000] bg-[#0000001A] backdrop-blur-[20px] flex items-center justify-center"
      dir={direction}
    >
      <div className="relative w-[90%] max-w-[600px] rounded-[25px] max-h-[80vh] bg-gradient-to-l from-[#fff] to-[#8D8D8D] flex flex-col z-[99999]">
        {/* زر الإغلاق */}
        <div
          onClick={onClose}
          className="absolute -top-16 left-1/2 w-[50px] h-[50px] bg-[#000]/15 flex items-center justify-center rounded-full hover:bg-[#fff]/10 transform -translate-x-1/2 cursor-pointer z-9999 transition"
        >
          <img src="/icons/close.svg" alt={t('close')} />
        </div>

        <h3 className={`text-lg font-semibold p-3 bg-[#fff]/25 backdrop-blur-xl rounded-t-[25px] ${
          isRTL ? 'text-right' : 'text-left'
        }`}>
          {t('title')}
          {isTranslatingComments && (
            <span className="text-sm text-gray-500 mr-2">
              ⏳ {t('translating')}
            </span>
          )}
        </h3>

        {/* قائمة التعليقات */}
        <div className="overflow-y-auto space-y-2 scrollbar-hidden">
          {loadingComments && <Loader />}
          {!loadingComments && comments.length === 0 && (
            <div className="flex items-center justify-center w-full h-[400px] flex-col gap-4">
              <img src="/icons/nocomments.svg" className="w-[65px]" alt={t('no_comments')} />
              <p className="text-2xl">{t('no_comments')}</p>
              <p className="text-md">{t('be_first')}</p>
            </div>
          )}
          {!loadingComments &&
            comments.map((comment, idx) => {
              const isCommentLikedByMe =
                myUserId &&
                Array.isArray(comment.reacts) &&
                comment.reacts.includes(myUserId);
              const commentReactsCount = comment.reacts?.length || 0;
              
              // الحصول على النص المترجم
              const displayContent = getTranslatedContent(comment);
              const isTranslated = language !== 'ar' && translatedComments[comment._id];
              
              return (
                <div
                  key={comment._id || idx}
                  className="flex relative items-start justify-between p-3 gap-2 bg-[#000]/10 h-auto"
                  dir={direction}
                >
                  <div className={`flex items-start gap-3 ${isRTL ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className="w-[54px] h-[54px] shrink-0 rounded-[23px] overflow-hidden">
                      <img
                        src={comment.userimg || "/imgs/user.png"}
                        className="w-full h-full object-cover"
                        alt={t('user_avatar')}
                      />
                    </div>
                    <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <div className="flex flex-col">
                        <span className={`font-semibold text-[15px] text-white ${isRTL ? 'text-right' : 'text-left'}`}>
                          {comment.name || comment.username || t('user')}
                        </span>
                        <div className={`flex gap-2 ${isRTL ? 'flex-row' : 'flex-row-reverse'}`}>
                          <span className="text-[12px] text-black/50">
                            @{(comment.username || "").replaceAll(" ", "")}
                          </span>
                          <span className="text-[12px] text-[#D72229]">
                            {timeAgo(comment.createdAt)}
                          </span>
                          {isTranslated && (
                            <span className="text-[10px] text-blue-500">
                              🌐 {t('translated')}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className={`mt-2 text-sm text-black/80 whitespace-pre-wrap leading-6 ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}>
                        {displayContent}
                      </p>
                    </div>
                  </div>
                  <div className={`flex gap-2 ${isRTL ? 'flex-row' : 'flex-row-reverse'}`}>
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
                        alt={t('like')}
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
                      <img src="/imgs/dots.svg" className="filter invert" alt={t('menu')} />
                    </div>
                    {showCommentMenu === comment._id && (
                      <div
                        className={`absolute bottom-1 ${isRTL ? 'right-0' : 'left-0'} z-[9999] flex gap-2 ${isRTL ? 'mr-3' : 'ml-3'}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button className={`w-[100px] flex items-center gap-1.5 rounded-[18px] px-2 py-2 text-sm bg-[#000]/30 text-white ${
                          isRTL ? 'flex-row' : 'flex-row-reverse'
                        }`}>
                          <div className="w-[38px] h-[38px] bg-white rounded-full flex items-center justify-center">
                            <img src="/icons/reply.svg" alt={t('reply')} />
                          </div>
                          <span>{t('reply')}</span>
                        </button>
                        <button className={`w-[100px] flex items-center gap-1.5 rounded-[18px] px-3 py-2 text-sm bg-[#D72229]/30 text-white ${
                          isRTL ? 'flex-row' : 'flex-row-reverse'
                        }`}>
                          <div className="w-[38px] h-[38px] bg-white rounded-full flex items-center justify-center">
                            <img src="/icons/ban.svg" alt={t('block')} />
                          </div>
                          <span>{t('block')}</span>
                        </button>
                        <button
                          onClick={() => handleReportComment(comment._id)}
                          className={`w-[100px] flex items-center gap-1.5 rounded-[18px] px-3 py-2 text-sm bg-[#D72229]/30 text-white ${
                            isRTL ? 'flex-row' : 'flex-row-reverse'
                          }`}
                        >
                          <div className="w-[38px] h-[38px] bg-white rounded-full flex items-center justify-center">
                            <img
                              src="/icons/flag.svg"
                              style={{
                                filter: "invert(27%) sepia(88%) saturate(2997%) hue-rotate(342deg) brightness(91%) contrast(96%)",
                              }}
                              alt={t('report')}
                            />
                          </div>
                          <span>{t('report')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

          {/* حقل إدخال التعليق */}
          <div className={`flex items-center gap-3 bg-[#fff]/50 backdrop-blur-xl p-3 rounded-b-[25px] ${
            isRTL ? 'flex-row' : 'flex-row-reverse'
          }`}>
            <div className="w-[42px] h-[42px] rounded-[21px] overflow-hidden shrink-0">
              <img
                src={myUserImg}
                className="w-full h-full object-cover"
                alt={t('user_avatar')}
              />
            </div>
            <div className="bg-[#000]/10 backdrop-blur-xl w-full flex rounded-[19px]">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={t('write_comment')}
                className={`flex-1 bg-transparent outline-none p-3 ${
                  isRTL ? 'text-right' : 'text-left'
                }`}
                dir={direction}
              />
              <button
                onClick={() => submitComment(videoId)}
                className={`bg-white px-4 py-3 text-[#D72229] font-semibold shrink-0 cursor-pointer ${
                  isRTL 
                    ? 'rounded-tr-[19px] rounded-br-[19px] rounded-tl-none rounded-bl-none'
                    : 'rounded-tl-[19px] rounded-bl-[19px] rounded-tr-none rounded-br-none'
                }`}
              >
                {t('post')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}