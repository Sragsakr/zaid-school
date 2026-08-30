"use client";

import { useEffect, useState } from "react";
import type { NewsImage } from "@/lib/types";
import SafeImage from "./SafeImage";

export default function ArticleGallery({ images }: { images: NewsImage[] }) {
  const [selectedImage, setSelectedImage] = useState<NewsImage | null>(null);

  useEffect(() => {
    if (!selectedImage) return;
    function closeOnEscape(event: KeyboardEvent) { if (event.key === "Escape") setSelectedImage(null); }
    document.addEventListener("keydown", closeOnEscape);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", closeOnEscape); document.body.style.overflow = originalOverflow; };
  }, [selectedImage]);

  if (images.length === 0) return null;

  return (
    <section aria-labelledby="gallery-heading" className="mt-12">
      <h2 id="gallery-heading" className="font-display text-2xl text-ink">صور من الخبر</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((image, index) => (
          <button key={image.id} type="button" onClick={() => setSelectedImage(image)} aria-label={`تكبير الصورة ${index + 1}`} className="group relative aspect-square overflow-hidden rounded-xl border border-ink/10 bg-ink/5 focus-visible:outline-offset-4">
            <SafeImage src={image.image_url} alt={`صورة ${index + 1} من الخبر`} fill sizes="(min-width: 640px) 33vw, 50vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
          </button>
        ))}
      </div>
      {selectedImage ? (
        <div role="dialog" aria-modal="true" aria-label="عرض الصورة" className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/90 p-4" onClick={() => setSelectedImage(null)}>
          <button type="button" aria-label="إغلاق الصورة" onClick={() => setSelectedImage(null)} className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-paper text-2xl text-ink">×</button>
          <div className="relative h-[80vh] w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <SafeImage src={selectedImage.image_url} alt="صورة مكبرة من الخبر" fill sizes="90vw" className="object-contain" />
          </div>
        </div>
      ) : null}
    </section>
  );
}
