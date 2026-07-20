 "use client";

import { useState } from "react";
import { SuggestionsFeed } from "@/components/suggestions/SuggestionsFeed";
import { Video } from "@/types/video";
import VideosPage from "@/app/videos/page";    

export default function SuggestionsPage() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  return (
    <div className="min-h-screen pt-4 flex flex-col items-center">
      <div className="w-full max-w-6xl">
         {selectedVideo ? (
           <div className="w-full mb-10">
              <button 
                onClick={() => setSelectedVideo(null)}
                className="mb-4 px-4 py-2 bg-gray-200 rounded-lg dark:bg-gray-800"
              >
                إغلاق وعرض الكل
              </button>
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