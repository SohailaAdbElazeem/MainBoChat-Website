"use client";
import { useEffect, useState } from "react";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    let storedToken = localStorage.getItem("accessToken") || localStorage.getItem("token");
    if (storedToken) setToken(storedToken);

    let extractedId = localStorage.getItem("userid") || localStorage.getItem("userId");
    if (!extractedId && storedToken) {
      try {
        const base64Url = storedToken.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(atob(base64));
        extractedId = payload.userid || payload.userId || payload.sub;
      } catch (e) { console.error(e); }
    }
    if (extractedId) setUserId(extractedId);
    setLoading(false);
  }, []);

  return { token, userId, loading };
}