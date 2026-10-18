"use client";

import { useState } from "react";
import { Music } from "lucide-react";

const FALLBACK_CONCERT_IMAGE =
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80";

interface EventBannerImageProps {
  src: string | null;
  alt: string;
  className: string;
  fallbackClassName: string;
  iconSize?: number;
}

export function EventBannerImage({
  src,
  alt,
  className,
  fallbackClassName,
  iconSize = 48,
}: EventBannerImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const activeSrc =
    failedSrc === FALLBACK_CONCERT_IMAGE
      ? null
      : failedSrc === src
        ? FALLBACK_CONCERT_IMAGE
        : src ?? FALLBACK_CONCERT_IMAGE;
  const isOriginalImage = activeSrc === src && src !== null;

  if (!activeSrc) {
    return (
      <div
        role="img"
        aria-label={`${alt}, gambar tidak tersedia`}
        className={fallbackClassName}
      >
        <Music size={iconSize} aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <img
        src={activeSrc}
        alt={isOriginalImage ? alt : `Ilustrasi konser untuk ${alt}`}
        className={className}
        onError={() => setFailedSrc(activeSrc)}
      />
      {!isOriginalImage && (
        <span className="absolute bottom-3 left-3 rounded bg-black/60 px-2 py-1 text-xs text-white">
          Gambar ilustrasi
        </span>
      )}
    </div>
  );
}
