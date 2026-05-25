"use client";

import { useEffect, useState } from "react";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. جلب التوكن (من أي مفتاح)
    let storedToken = localStorage.getItem("accessToken") || 
                      localStorage.getItem("boChatToken") || 
                      localStorage.getItem("token");
    if (storedToken) setToken(storedToken);

    // 2. جلب userId (من localStorage أولاً، ثم من التوكن إن أمكن)
    let extractedId = localStorage.getItem("userid") || localStorage.getItem("userId");
    
    if (!extractedId && storedToken) {
      try {
        const base64Url = storedToken.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(atob(base64));
        extractedId = payload.userid || payload.userId || payload.sub;
      } catch (e) {
        console.error("فشل فك التوكن", e);
      }
    }

    if (extractedId) {
      setUserId(extractedId);
      console.log("✅ userId المستخدم:", extractedId);
    } else {
      console.warn("⚠️ لا يوجد userId في localStorage ولا في التوكن");
    }

    setLoading(false);
  }, []);

  return { token, userId, loading };
}