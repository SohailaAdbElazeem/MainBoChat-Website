// // /** @type {import('next').NextConfig} */
// // const nextConfig = {
// //   reactStrictMode: false,

// //   typescript: {
// //     ignoreBuildErrors: true,
// //    },
// //    eslint: {
// //     ignoreDuringBuilds: true,
// //   },
// //   compiler: {
// //     removeConsole: false, // لو عايزة تشيلي console.logs في الـ production بعدين
// //   },
// //   images: {
// //     remotePatterns: [
// //       {
// //         protocol: "https",
// //         hostname: "bo-chat.space",
// //         pathname: "/media/**",
// //       },
// //       {
// //         protocol: "https",
// //         hostname: "bo-chat.space",
// //         pathname: "/men-jpg/**", 
// //       },
// //       {
// //         protocol: "https",
// //         hostname: "bo-chat.cfd",
// //         pathname: "/media/**",
// //       },
// //       {
// //         protocol: "https",
// //         hostname: "lh3.googleusercontent.com",
// //         pathname: "/**",
// //       },
// //     ],
// //   },

// //   async headers() {
// //     return [
// //       {
// //         source: "/login",
// //         headers: [
// //           {
// //             key: "Cross-Origin-Opener-Policy",
// //             value: "same-origin-allow-popups",
// //           },
// //         ],
// //       },
// //       {
// //         source: "/login/:path*",
// //         headers: [
// //           {
// //             key: "Cross-Origin-Opener-Policy",
// //             value: "same-origin-allow-popups",
// //           },
// //         ],
// //       },
// //     ];
// //   },

// //   async rewrites() {
// //     return [
// //       {
// //         source: "/viaGoogle",
// //         destination: "https://bo-chat.space/viaGoogle",
// //       },
// //     ];
// //   },
// // };

// // export default nextConfig;

 

// // next.config.ts
// import type { NextConfig } from 'next';
// import createNextIntlPlugin from 'next-intl/plugin';

// const withNextIntl = createNextIntlPlugin();

// const nextConfig: NextConfig = {
//   reactStrictMode: false,

//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   compiler: {
//     removeConsole: false,  
//   },   
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "bo-chat.space",
//         pathname: "/media/**",
//       },
//       {
//         protocol: "https",
//         hostname: "bo-chat.space",
//         pathname: "/men-jpg/**",
//       },
//       {
//         protocol: "https",
//         hostname: "bo-chat.cfd",
//         pathname: "/media/**",
//       },
//       {
//         protocol: "https",
//         hostname: "lh3.googleusercontent.com",
//         pathname: "/**",
//       },
//     ],
//   },

//   async headers() {
//     return [
//       {
//         source: "/login",
//         headers: [
//           {
//             key: "Cross-Origin-Opener-Policy",
//             value: "same-origin-allow-popups",
//           },
//         ],
//       },
//       {
//         source: "/login/:path*",
//         headers: [
//           {
//             key: "Cross-Origin-Opener-Policy",
//             value: "same-origin-allow-popups",
//           },
//         ],
//       },
//     ];
//   },

//   async rewrites() {
//     return [
//       {
//         source: "/viaGoogle",
//         destination: "https://bo-chat.space/viaGoogle",
//       },
//     ];
//   },
// };

// export default withNextIntl(nextConfig);


 // next.config.ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: false,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  compiler: { removeConsole: false },

  // ✅ الحل: استثناء mediasfu من التجميع على الخادم
  serverExternalPackages: ['mediasfu-reactjs'],

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
      };
    }
    return config;
  },

  experimental: {
    largePageDataBytes: 5 * 1024 * 1000,
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'bo-chat.space', pathname: '/media/**' },
      { protocol: 'https', hostname: 'bo-chat.space', pathname: '/men-jpg/**' },
      { protocol: 'https', hostname: 'bo-chat.cfd', pathname: '/media/**' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
    ],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Permissions-Policy', value: 'camera=*, microphone=*, display-capture=*' },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      { source: '/viaGoogle', destination: 'https://bo-chat.space/viaGoogle' },
    ];
  },
};

export default withNextIntl(nextConfig);