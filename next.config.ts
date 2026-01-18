/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
    ignoreTypeErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bo-chat.space",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "bo-chat.space",
        pathname: "/men-jpg/**", 
      },
      {
        protocol: "https",
        hostname: "bo-chat.cfd",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },

  async headers() {
    return [
      {
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
      {
        source: "/viaGoogle",
        destination: "https://bo-chat.space/viaGoogle",
      },
    ];
  },
};

export default nextConfig;
