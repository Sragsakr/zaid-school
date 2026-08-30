"use client";

import { useEffect, useRef, useState } from "react";
import type { NewsImage } from "@/lib/types";
import SafeImage from "./SafeImage";

export default function ArticleGallery({ images }: { images: NewsImage[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedImage, setSelectedImage] = useState<NewsImage | null>(null);

  useEffect(() => {
    if (!selectedImage) return;
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = originalOverflow; };
  }, [selectedImage]);

  if (images.length === 0) return null;

  function closeDialog() {
    dialogRef.current?.close();
  }

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
      <dialog ref={dialogRef} onClose={() => setSelectedImage(null)} aria-label="عرض الصورة" onClick={(event) => { if (event.target === event.currentTarget) closeDialog(); }} className="fixed inset-0 m-auto h-full max-h-none w-full max-w-none bg-ink/95 p-4 backdrop:bg-ink/90">
        <button type="button" aria-label="إغلاق الصورة" onClick={closeDialog} className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-paper text-2xl text-ink">×</button>
        {selectedImage ? <div className="relative mx-auto h-full w-full max-w-5xl"><SafeImage src={selectedImage.image_url} alt="صورة مكبرة من الخبر" fill sizes="90vw" className="object-contain" /></div> : null}
      </dialog>
    </section>
  );
}
