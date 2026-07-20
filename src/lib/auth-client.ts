// // src/lib/auth-client.ts
// "use client";

// export const getToken = () => {
//   if (typeof window === "undefined") return null;
//   return localStorage.getItem("accessToken");
// };

// export const getUserId = (): string | null => {
//   if (typeof window === "undefined") return null;
//   const userData = localStorage.getItem("userData");
//   if (!userData) return null;
//   try {
//     const parsed = JSON.parse(userData);
//     return parsed._id || null;
//   } catch {
//     return null;
//   }
// };

// // إضافة دالة `getCurrentUserId` (نفس getUserId)
// export const getCurrentUserId = getUserId;

// // إضافة دالة `getAuthToken` (نفس getToken)
// export const getAuthToken = getToken;

// // إضافة دالة `getMyUserImg` للحصول على صورة المستخدم
// export const getMyUserImg = () => {
//   if (typeof window === "undefined") return "/imgs/user.png";
//   return localStorage.getItem("userimg") || "/imgs/user.png";
// };

// src/lib/auth-client.ts
"use client";

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken") || localStorage.getItem("token");
};

export const getUserId = () => {
  if (typeof window === "undefined") return null;
  const userData = localStorage.getItem("userData");
  if (!userData) return null;
  try {
    const parsed = JSON.parse(userData);
    return parsed._id || null;
  } catch {
    return null;
  }
};

export const getMyUserImg = () => {
  if (typeof window === "undefined") return "/imgs/user.png";
  return localStorage.getItem("userimg") || "/imgs/user.png";
};