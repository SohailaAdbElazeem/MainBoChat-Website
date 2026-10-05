"use client";

import { useEffect, useState } from "react";
import ZegoCallProvider from "./ZegoCallProvider";

export default function ZegoCallProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [zegoUser, setZegoUser] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("userData");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      const id = parsed._id || parsed.id || "";
      const name =
        parsed.name ||
        parsed.username ||
        `${parsed.firstName || ""} ${parsed.lastName || ""}`.trim() ||
        `User_${id}`;
      if (id) setZegoUser({ id, name });
    } catch (e) {
      console.error("فشل قراءة userData:", e);
    }
  }, []);

  if (!zegoUser) return <>{children}</>;

  return (
    <ZegoCallProvider userID={zegoUser.id} userName={zegoUser.name}>
      {children}
    </ZegoCallProvider>
  );
}