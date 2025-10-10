import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // عدّل المسار لو صفحة اللوجن مختلفة
        source: "/login",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
        ],
      },
      {
        source: "/login/:path*",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      // نخلي أي طلب محلي لـ /viaGoogle يروح لـ https://bo-chat.space/viaGoogle
      { source: "/viaGoogle", destination: "https://bo-chat.space/viaGoogle" },
    ];
  },
};

export default nextConfig;
