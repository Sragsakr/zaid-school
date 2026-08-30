"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

type SafeImageProps = Omit<ImageProps, "onError">;

export default function SafeImage({ alt, className, ...props }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt || "تعذر تحميل الصورة"}
        className={`flex items-center justify-center bg-ink/10 text-ink/30 ${className ?? ""}`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-10 h-10"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25v13.5A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18.75V5.25Z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="m3 16 4.5-4.5a1.5 1.5 0 0 1 2.12 0L15 16m-2-2 1.88-1.88a1.5 1.5 0 0 1 2.12 0L21 15.5" />
          <circle cx="8.25" cy="8.25" r="1.25" />
        </svg>
      </div>
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
