// src/app/_components/CurrentUserId.tsx
"use client";
import React, { useEffect, useState } from "react";

export default function CurrentUserId({ children }: { children: (id: string | null) => React.ReactNode }) {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("userid") ?? localStorage.getItem("userId") ?? localStorage.getItem("followerId");
      setId(stored);
    } catch (err) {
      console.error("CurrentUserId: could not read localStorage", err);
      setId(null);
    }
  }, []);

  return <>{children(id)}</>;
}
