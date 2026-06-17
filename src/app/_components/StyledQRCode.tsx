// // "use client";

// // import { useEffect, useRef } from "react";
// // import QRCodeStyling from "qr-code-styling";

// // type Props = {
// //   value: string;
// // };

// // export default function StyledQRCode({ value }: Props) {
// //   const ref = useRef<HTMLDivElement>(null);
// //   const qrRef = useRef<QRCodeStyling | null>(null);

// //   useEffect(() => {
// //     if (!ref.current) return;

// //     if (!qrRef.current) {
// //       qrRef.current = new QRCodeStyling({
// //         type: "canvas",

// //         width: 240,
// //         height: 240,
// //         data: value,

// //         qrOptions: {
// //           errorCorrectionLevel: "Q",
// //           dotScale: 1.4, // 🔥 تخانة الخطوط
// //         },

// //         dotsOptions: {
// //           type: "rounded",
// //           color: "#D72229",
// //         },

// //         cornersSquareOptions: {
// //           type: "extra-rounded",
// //           color: "#D72229",
// //         },

// //         cornersDotOptions: {
// //           type: "dot",
// //           color: "#D72229",
// //         },

// //         backgroundOptions: {
// //           color: "#ffffff",
// //         },
// //       });

// //       ref.current.innerHTML = "";
// //       qrRef.current.append(ref.current);
// //     } else {
// //       qrRef.current.update({
// //         data: value,
// //       });
// //     }
// //   }, [value]);

// //   return <div ref={ref} />;
// // }


// "use client";

// import { useEffect, useRef } from "react";
// import QRCodeStyling from "qr-code-styling";

// type Props = {
//   value: string;
//   size?: number; // نمرر الحجم حسب الرغبة
// };

// export default function StyledQRCode({ value, size = 240 }: Props) {
//   const ref = useRef<HTMLDivElement>(null);
//   const qrRef = useRef<QRCodeStyling | null>(null);

//   useEffect(() => {
//     if (!ref.current) return;

//     if (!qrRef.current) {
//       qrRef.current = new QRCodeStyling({
//         type: "canvas",
//         width: size,
//         height: size,
//         data: value,
//         qrOptions: {
//           errorCorrectionLevel: "Q",
//           dotScale: 1.4,
//         },
//         dotsOptions: {
//           type: "rounded",
//           color: "#D72229",
//         },
//         cornersSquareOptions: {
//           type: "extra-rounded",
//           color: "#D72229",
//         },
//         cornersDotOptions: {
//           type: "dot",
//           color: "#D72229",
//         },
//         backgroundOptions: {
//           color: "#ffffff",
//         },
//       });

//       ref.current.innerHTML = "";
//       qrRef.current.append(ref.current);
//     } else {
//       qrRef.current.update({
//         data: value,
//         width: size,
//         height: size,
//       });
//     }
//   }, [value, size]);

//   return <div ref={ref} />;
// }

"use client";

import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

type Props = {
  value: string;
  size?: number;
  image?: string; // مسار الصورة (اختياري)
  imageSize?: number; // حجم الصورة بالنسبة للـ QR (0-1)
};

export default function StyledQRCode({ 
  value, 
  size = 240, 
  image, 
  imageSize = 0.3 
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const config: any = {
      type: "canvas",
      width: size,
      height: size,
      data: value,
      qrOptions: {
        errorCorrectionLevel: "Q",
        dotScale: 1.4,
      },
      dotsOptions: {
        type: "rounded",
        color: "#D72229",
      },
      cornersSquareOptions: {
        type: "extra-rounded",
        color: "#D72229",
      },
      cornersDotOptions: {
        type: "dot",
        color: "#D72229",
      },
      backgroundOptions: {
        color: "#ffffff",
      },
    };

    // إذا تم تمرير صورة، نضيفها إلى الإعدادات
    if (image) {
      config.image = image;
      config.imageOptions = {
        hideBackgroundDots: true, // إخفاء النقاط خلف الصورة
        imageSize: imageSize,
        margin: 5,
      };
    }

    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling(config);
      ref.current.innerHTML = "";
      qrRef.current.append(ref.current);
    } else {
      qrRef.current.update({
        data: value,
        width: size,
        height: size,
        ...(image && {
          image: image,
          imageOptions: {
            hideBackgroundDots: true,
            imageSize: imageSize,
            margin: 5,
          },
        }),
      });
    }
  }, [value, size, image, imageSize]);

  return <div ref={ref} />;
}