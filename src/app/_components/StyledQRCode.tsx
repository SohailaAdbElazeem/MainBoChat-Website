"use client";

import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

type Props = {
  value: string;
};

export default function StyledQRCode({ value }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling({
        type: "canvas",

        width: 240,
        height: 240,
        data: value,

        qrOptions: {
          errorCorrectionLevel: "Q",
          dotScale: 1.4, // 🔥 تخانة الخطوط
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
      });

      ref.current.innerHTML = "";
      qrRef.current.append(ref.current);
    } else {
      qrRef.current.update({
        data: value,
      });
    }
  }, [value]);

  return <div ref={ref} />;
}
