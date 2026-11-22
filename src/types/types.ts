// // types/types.ts
// /* eslint-disable @typescript-eslint/no-explicit-any */

// export type UserPersonalData = {
//   _id: string;
//   name?: string;
//   username?: string;
//   img?: string;
//   about?: string;
//   visit?: number;
//   vip?: boolean;
//   rate?: number;
//   private: boolean;
// };

// export type FollowEntry = {
//   _id: string;
//   followerid?: string;
//   followerdata?: {
//     _id: string;
//     name?: string;
//     username?: string;
//     img?: string;
//     private?: boolean;
//   };
//   followingid?: string;
//   followingdata?: {
//     _id: string;
//     name?: string;
//     username?: string;
//     img?: string;
//     private?: boolean;
//   };
//   vip?: boolean;
// };

// export type UserAPIResponse = {
//   userpersonaldata?: UserPersonalData;
//   followers?: FollowEntry[];
//   following?: FollowEntry[];
//   posts?: any[];
//   rates?: any[];
//   blocks?: string[];
//   requestedFollow?: boolean;
// };

// export type ChatItem = {
//   chatId: string;
//   userinfo: any;
//   lastMessage: Message;
//   unreadCount: number;
//   typing: boolean;
// };

// // ================= Message Type with Reply Support =================
// export interface Message {
//   _id: string;
//   message?: string;
//   sender: string;
//   receiver: string;
//   timestamp: string;
//   type: string;
//   media?: any;
//   fileData?: any;
//   likes?: string[];
//   _sendFailed?: boolean;
//   uploadProgress?: number;
//   _optimistic?: boolean;
//   fileName?: string;
//   fileSize?: number;
//   fileType?: string;
//   fileExtension?: string;
//   // ========== Reply Support ==========
//   replyTo?: {
//     _id: string;
//     message?: string;
//     sender: string;
//     senderName?: string;
//     type: string;
//     fileName?: string;
//   };
// }

// export type Post = {
//   _id: string;
//   username: string;
//   name: string;
//   userimg: string;
//   userid: string;
//   type: "image" | "text" | "video" | "question";
//   content: string;
//   image: { image: string; width?: string; height?: string }[] | null;
//   video: any;
//   createdAt: string;
//   likes: any[];
//   comments: any[];
//   liked?: number;
//   commented?: number;
//   vip?: boolean;
//   shares?: any[];
//   shareCount?: number;
// };


// types/types.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

export type UserPersonalData = {
  _id: string;
  name?: string;
  username?: string;
  img?: string;
  about?: string;
  visit?: number;
  vip?: boolean;
  rate?: number;
  private: boolean;
};

export type FollowEntry = {
  _id: string;
  followerid?: string;
  followerdata?: {
    _id: string;
    name?: string;
    username?: string;
    img?: string;
    private?: boolean;
  };
  followingid?: string;
  followingdata?: {
    _id: string;
    name?: string;
    username?: string;
    img?: string;
    private?: boolean;
  };
  vip?: boolean;
};

export type UserAPIResponse = {
  userpersonaldata?: UserPersonalData;
  followers?: FollowEntry[];
  following?: FollowEntry[];
  posts?: any[];
  rates?: any[];
  blocks?: string[];
  requestedFollow?: boolean;
};

export type ChatItem = {
  chatId: string;
  userinfo: any;
  lastMessage: Message;
  unreadCount: number;
  typing: boolean;
};

// ================= Message Type with Reply Support =================
export interface Message {
  _id: string;
  message?: string;
  sender: string;
  receiver: string;
  timestamp: string;
  type: string;
  media?: any;
  fileData?: any;
  likes?: string[];
  _sendFailed?: boolean;
  uploadProgress?: number;
  _optimistic?: boolean;

  // ================= Edit & Delete flags =================
  edited?: boolean;          // ✅ جديد — لعرض "(تم التعديل)"
  _deleted?: boolean;        // ✅ جديد — للرسائل المحذوفة (placeholder)

  fileName?: string;
  fileSize?: number;
  fileType?: string;
  fileExtension?: string;

  // ✅ موجودة في الكود لكن مش في الـ type
  waveData?: number[];       // للرسائل الصوتية

  // ========== Reply Support ==========
  replyTo?: {
    _id: string;
    message?: string;
    sender: string;
    senderName?: string;
    type: string;
    fileName?: string;
  };
}

export type Post = {
  _id: string;
  username: string;
  name: string;
  userimg: string;
  userid: string;
  type: "image" | "text" | "video" | "question";
  content: string;
  image: { image: string; width?: string; height?: string }[] | null;
  video: any;
  createdAt: string;
  likes: any[];
  comments: any[];
  liked?: number;
  commented?: number;
  vip?: boolean;
  shares?: any[];
  shareCount?: number;
};