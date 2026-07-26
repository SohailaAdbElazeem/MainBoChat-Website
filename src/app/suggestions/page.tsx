// src/app/suggestions/page.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SuggestionsFeed } from "@/components/suggestions/SuggestionsFeed";
import { Video } from "@/types/video";

export default function SuggestionsPage() {
  const t = useTranslations('SuggestionsPage');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  return (
    <div className="min-h-screen pt-4 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        {selectedVideo ? (
          <div className="w-full mb-10">
            <SuggestionsFeed onVideoSelect={setSelectedVideo} />
            <div className="w-full flex justify-center">
            </div>
          </div>
        ) : (
          <SuggestionsFeed onVideoSelect={setSelectedVideo} />
        )}
      </div>
    </div>
  );
}