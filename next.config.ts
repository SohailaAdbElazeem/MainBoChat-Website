import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // السماح بجلب الصور من الدومينات اللي في البوستات
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bo-chat.space",
      },
      {
        protocol: "https",
        hostname: "bo-chat.cfd",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },

  async headers() {
    return [
      {
        // لو صفحة اللوجين موجودة
        source: "/login",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
      {
        source: "/login/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      // نخلي أي طلب محلي لـ /viaGoogle يروح لـ السيرفر الخارجي
      {
        source: "/viaGoogle",
        destination: "https://bo-chat.space/viaGoogle",
      },
      // لو عايز مستقبلاً تعمل Proxy داخلي للبوستات بدل ما تضرب مباشرة على bo-chat
      // ممكن تسيب السطر ده احتياطي
      // { source: "/homeposts/null", destination: "http://bo-chat.space/homeposts/null" },
    ];
  },
};

export default nextConfig;
