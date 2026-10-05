// // src/app/layout.tsx
// import { getMessages } from 'next-intl/server';
// import { cookies } from 'next/headers';
// import LayoutContent from './LayoutContent';
// import Providers from './providers';  
// import "./globals.css";

// const RTL_LOCALES = ['ar'];

// async function getLocale(): Promise<string> {
//   const cookieStore = await cookies();
//   const locale = cookieStore.get('NEXT_LOCALE')?.value || 'ar';
//   return locale;
// }

// export default async function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const locale = await getLocale();
//   const isRTL = RTL_LOCALES.includes(locale);
//   const messages = await getMessages();

//   return (
//     <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} suppressHydrationWarning>
//       <body className="bg-white select-none" suppressHydrationWarning>
//          <Providers messages={messages} locale={locale}>
//           <LayoutContent isRTL={isRTL} locale={locale}>
//             {children}
//           </LayoutContent>
//         </Providers>
//       </body>
//     </html>
//   );
// }


// ////Update Now 
// // // src/app/layout.tsx
// // import { getMessages } from 'next-intl/server';
// // import { cookies } from 'next/headers';
// // import LayoutContent from './LayoutContent';
// // import Providers from './providers';  
// // import "./globals.css";

// // const RTL_LOCALES = ['ar'];

// // async function getLocale(): Promise<string> {
// //   const cookieStore = await cookies();
// //   const locale = cookieStore.get('NEXT_LOCALE')?.value || 'ar';
// //   return locale;
// // }

// // export default async function RootLayout({
// //   children,
// // }: Readonly<{
// //   children: React.ReactNode;
// // }>) {
// //   const locale = await getLocale();
// //   const isRTL = RTL_LOCALES.includes(locale);
// //   const messages = await getMessages();

// //   return (
// //     <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} suppressHydrationWarning>
// //       <body className="bg-white select-none" suppressHydrationWarning>
// //          <Providers messages={messages} locale={locale}>
// //           <LayoutContent isRTL={isRTL} locale={locale}>
// //             {children}
// //           </LayoutContent>
// //         </Providers>
// //       </body>
// //     </html>
// //   );
// // }


// // 
// // src/app/layout.tsx
// import { getMessages } from 'next-intl/server';
// import { cookies } from 'next/headers';
// import Script from 'next/script';
// import LayoutContent from './LayoutContent';
// import Providers from './providers';
// import "./globals.css";

// const RTL_LOCALES = ['ar'];

// async function getLocale(): Promise<string> {
//   const cookieStore = await cookies();
//   const locale = cookieStore.get('NEXT_LOCALE')?.value || 'ar';
//   return locale;
// }

// export default async function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const locale = await getLocale();
//   const isRTL = RTL_LOCALES.includes(locale);
//   const messages = await getMessages();

//   return (
//     <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} suppressHydrationWarning>
//       <head>
//         {/*
//           ⚠️ ZIM SDK — لازم يتحمّل الأول
//           قبل ZegoUIKitPrebuilt
//         */}
//         <Script
//           src="https://unpkg.com/zego-zim-web@2.16.0/index.js"
//           strategy="beforeInteractive"
//         />
//         {/* ZegoUIKitPrebuilt SDK */}
//         <Script
//           src="https://unpkg.com/@zegocloud/zego-uikit-prebuilt/zego-uikit-prebuilt.js"
//           strategy="beforeInteractive"
//         />
//       </head>
//       <body className="bg-white select-none" suppressHydrationWarning>
//         <Providers messages={messages} locale={locale}>
//           <LayoutContent isRTL={isRTL} locale={locale}>
//             {children}
//           </LayoutContent>
//         </Providers>
//       </body>
//     </html>
//   );
// }


// // ////////////////
// // src/app/layout.tsx
// import { getMessages } from 'next-intl/server';
// import { cookies } from 'next/headers';
// import LayoutContent from './LayoutContent';
// import Providers from './providers';
// import "./globals.css";

// const RTL_LOCALES = ['ar'];

// async function getLocale(): Promise<string> {
//   const cookieStore = await cookies();
//   const locale = cookieStore.get('NEXT_LOCALE')?.value || 'ar';
//   return locale;
// }

// export default async function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const locale = await getLocale();
//   const isRTL = RTL_LOCALES.includes(locale);
//   const messages = await getMessages();

//   return (
//     <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} suppressHydrationWarning>
//       <body className="bg-white select-none" suppressHydrationWarning>
//         <Providers messages={messages} locale={locale}>
//           <LayoutContent isRTL={isRTL} locale={locale}>
//             {children}
//           </LayoutContent>
//         </Providers>
//       </body>
//     </html>
//   );
// }


import { getMessages } from 'next-intl/server';
import { cookies } from 'next/headers';
import LayoutContent from './LayoutContent';
import Providers from './providers';
import ZegoCallProviderWrapper from '@/components/ZegoCallProviderWrapper';
import "./globals.css";

const RTL_LOCALES = ['ar'];

async function getLocale(): Promise<string> {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'ar';
  return locale;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const isRTL = RTL_LOCALES.includes(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body className="bg-white select-none" suppressHydrationWarning>
        <Providers messages={messages} locale={locale}>
          <ZegoCallProviderWrapper>
            <LayoutContent isRTL={isRTL} locale={locale}>
              {children}
            </LayoutContent>
          </ZegoCallProviderWrapper>
        </Providers>
      </body>
    </html>
  );
}