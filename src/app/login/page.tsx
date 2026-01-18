/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StyledQRCode from "../_components/StyledQRCode";
import wsService from "@/lib/websocketService";

export default function LoginPage() {
  const [sessionId, setSessionId] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      // 1️⃣ هات sessionId
      const res = await fetch("https://bo-chat.space/qrCode");
      const data = await res.json();

      setSessionId(data.sessionId);

      // 2️⃣ افتح WS (بدون userId لأن ده QR flow)
      wsService.connect(`qr-${data.sessionId}`);

      // 3️⃣ register session
      wsService.send({
        event: "registerSession",
        metadata: {},
        sessionId: data.sessionId,
      });

      // 4️⃣ اسمع approval
      const unsubscribe = wsService.addHandler((message) => {
        if (message.event === "qrApproved") {
          document.cookie = `boChatToken=${message.accessToken}; path=/; max-age=2592000`;

          wsService.disconnect();
          unsubscribe();

          router.push("/dashboard");
        }
      });
    };

    init();

    return () => {
      wsService.disconnect();
    };
  }, [router]);


  return (
    <div className="min-h-screen bg-[#D72229] flex flex-col items-center justify-center relative text-white main-layer">
      <a href="/">
        <img
          src="/logo.png"
          className="absolute top-5 left-1/2 -translate-x-1/2 w-[47px]"
          alt="logo"
        />
      </a>

      <img src="/logo.png" className="layer-1" alt="logo" />
      <img src="/logo.png" className="layer-2" alt="logo" />

      <div className="flex items-top gap-5 z-10">
        {/* QR Container */}
        <div className="shadow-xl rounded-[28px]  max-w-[280px] overflow-hidden">
          <p className="text-center text-[#D72229] mt-3 font-semibold text-lg p-4 rounded-t-[28px] text-[28px] bg-[#FFFFFF]/80 backdrop-blur-sm">
            امسح الكود الآن
          </p>

          {sessionId && (
            <div className="bg-white rounded-b-[28px] p-1 flex items-center justify-center">
              <StyledQRCode
                value={JSON.stringify({
                  event: "LOGIN",
                  sessionId,
                })}
              />
            </div>
          )}
        </div>

        {/* Text */}
        <div className="max-w-xl">
          <h1 className="text-[45px] mb-1">أهلاً بيك في بو شات Web</h1>

          <p className="text-black mb-5 text-[20px]">
            ادخل على حسابك بسهولة ومن غير ما تكتب
            <br />
            كلمة سر
          </p>

          <p className="mb-3 font-semibold text-[18px]">
            علشان تسجّل دخولك من المتصفح:
          </p>

          <ol className="space-y-2 text-black text-[15px]">
            <li>1 افتح تطبيق بو شات على موبايلك</li>
            <li>2 روح لـ الإعدادات</li>
            <li>3 اختار تسجيل الدخول من الويب / الأجهزة المتوصّلة</li>
            <li>4 استخدم الكاميرا وامسح الكود اللي قدّامك</li>
            <li>5 خلال ثواني… هتلاقي حسابك فتح هنا</li>
          </ol>
        </div>
      </div>

      <p className="absolute bottom-4 text-[16px] text-white/90">
        مسح بسيط للـ QR من موبايلك وهتلاقي كل حاجة هنا قدامك
      </p>
    </div>
  );
}
