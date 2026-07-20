 
// src/types/video.ts
export interface Video {
  _id: string;
  name?: string;
  username?: string;
  userimg?: string;
  video?: { video: string }[];
  likes?: string[];  
  shares?: string[];  
  views?: number;
  createdAt?: string;
  userid?: string;
  comments?: any[];
  description?: string;
}