// store/videoStore.ts
import { create } from 'zustand';
import { Video } from '@/types/video';

interface VideoStore {
  selectedVideo: Video | null;
  setSelectedVideo: (video: Video | null) => void;
}

export const useVideoStore = create<VideoStore>((set) => ({
  selectedVideo: null,
  setSelectedVideo: (video) => set({ selectedVideo: video }),
}));