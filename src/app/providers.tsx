//  src/app/providers.tsx
"use client";

import { useEffect, useState, ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { LoginModalProvider } from "@/contexts/LoginModalContext";
import ZegoCallProvider from "@/components/ZegoCallProvider";
import { useAuth } from "@/hooks/useAuth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://bo-chat.space";

export default function Providers({
  children,
  messages,
  locale,
}: {
  children: ReactNode;
  messages: any;
  locale: string;
}) {
  const { token: authToken, userId, loading: authLoading } = useAuth();

  const [zego, setZego] = useState<{
    appId: number;
    zimToken: string;
    expressToken: string;
    userName: string;
  } | null>(null);

  useEffect(() => {
    if (!userId || !authToken) return;

    (async () => {
      try {
        const userRes = await fetch(`${API_BASE}/users/${userId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const userData = await userRes.json();
        const name =
          userData?.userpersonaldata?.name ||
          userData?.userpersonaldata?.username ||
          "User";

        const tokenRes = await fetch("/api/zego/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, userName: name }),
        });
        const tokenData = await tokenRes.json();

        if (tokenData.token && tokenData.appId) {
          setZego({
            appId: tokenData.appId,
            zimToken: tokenData.token,
            expressToken: tokenData.token,
            userName: name,
          });
        }
      } catch (err) {
        console.error("❌ Zego setup failed:", err);
      }
    })();
  }, [userId, authToken]);

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <TranslationProvider>
        <LoginModalProvider>
          {/* ⭐ ZegoCallProvider دايماً موجود عشان useZegoCall تشتغل في أي مكان */}
          <ZegoCallProvider
            userID={userId || ""}
            userName={zego?.userName || ""}
            appId={zego?.appId || 0}
            zimToken={zego?.zimToken || ""}
            expressToken={zego?.expressToken || ""}
          >
            {children}
          </ZegoCallProvider>
        </LoginModalProvider>
      </TranslationProvider>
    </NextIntlClientProvider>
  );
}