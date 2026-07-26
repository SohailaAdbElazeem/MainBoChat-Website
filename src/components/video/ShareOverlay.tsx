// src/components/video/ShareOverlay.tsx
"use client";

import { useShare } from "@/hooks/useShare";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

interface ShareOverlayProps {
  videoId: string;
  isOpen: boolean;
  onClose: () => void;
  onShare: (postId: string) => Promise<void>;
  shareText: string;
  setShareText: (text: string) => void;
  sharing: boolean;
}

export function ShareOverlay({
  videoId,
  isOpen,
  onClose,
  onShare,
  shareText,
  setShareText,
  sharing,
}: ShareOverlayProps) {
  const t = useTranslations('ShareOverlay');
  const locale = useLocale();
  
   const isRTL = locale === 'ar';
  const direction = isRTL ? 'rtl' : 'ltr';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100000] bg-[#000]/10 backdrop-blur-[10px] flex items-center justify-center">
      <div 
        className="w-[90%] max-w-[690px] rounded-[25px] backdrop-blur-xl relative bg-gradient-to-l from-[#fff] to-[#8D8D8D]"
        dir={direction}
      >
        <div
          onClick={onClose}
          className="absolute -top-16 left-1/2 w-[50px] h-[50px] bg-[#000]/15 flex items-center justify-center rounded-full hover:bg-[#fff]/10 transform -translate-x-1/2 cursor-pointer transition"
        >
          <img src="/icons/close.svg" alt={t('close')} />
        </div>
        
        <h3 className={`text-lg font-semibold bg-[#fff]/25 backdrop-blur-md p-3 rounded-t-[25px] ${
          isRTL ? 'text-right' : 'text-left'
        }`}>
          {t('title')}
        </h3>
        
        <div className="p-5">
          <textarea
            placeholder={t('placeholder')}
            value={shareText}
            onChange={(e) => setShareText(e.target.value)}
            className={`w-full h-[247px] p-4 rounded-[20px] bg-transparent resize-none outline-none border border-black/10 ${
              isRTL ? 'text-right' : 'text-left'
            }`}
            dir={direction}
          />
        </div>
        
        <div className="px-5 pb-5">
          <div className="flex items-center justify-center">
            <button
              onClick={() => onShare(videoId)}
              disabled={sharing || !shareText.trim()}
              className={`w-[300px] mx-auto py-4 rounded-[23px] mt-4 text-white transition cursor-pointer ${
                sharing || !shareText.trim()
                  ? "bg-black/40"
                  : "bg-[#D72229] hover:bg-[#b91c22]"
              }`}
            >
              {sharing ? t('sharing') : t('share_button')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}