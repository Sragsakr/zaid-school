"use client";

import Image from "next/image";
import type { NewsImage } from "@/lib/types";

interface PendingImage {
  key: string;
  file: File;
  previewUrl: string;
}

interface GalleryFieldProps {
  existingImages: NewsImage[];
  pendingImages: PendingImage[];
  onAddFiles: (files: File[]) => void;
  onRemoveExisting: (id: string) => void;
  onRemovePending: (key: string) => void;
  deletingId: string | null;
}

export default function GalleryField({
  existingImages,
  pendingImages,
  onAddFiles,
  onRemoveExisting,
  onRemovePending,
  deletingId,
}: GalleryFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-utility text-sm text-ink/70">
        معرض الصور الإضافي
      </span>

      {existingImages.length > 0 || pendingImages.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {existingImages.map((img) => (
            <div key={img.id} className="relative group">
              <div className="relative aspect-square rounded-md overflow-hidden border border-ink/10">
                <Image
                  src={img.image_url}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => onRemoveExisting(img.id)}
                disabled={deletingId === img.id}
                className="absolute top-1 left-1 bg-maroon text-paper text-xs rounded-full w-6 h-6 flex items-center justify-center disabled:opacity-60"
                aria-label="حذف الصورة"
              >
                ×
              </button>
            </div>
          ))}
          {pendingImages.map((img) => (
            <div key={img.key} className="relative group">
              <div className="relative aspect-square rounded-md overflow-hidden border border-gold">
                <Image
                  src={img.previewUrl}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => onRemovePending(img.key)}
                className="absolute top-1 left-1 bg-maroon text-paper text-xs rounded-full w-6 h-6 flex items-center justify-center"
                aria-label="إزالة الصورة"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length > 0) onAddFiles(files);
          e.target.value = "";
        }}
        className="font-utility text-sm"
      />
      <p className="font-utility text-xs text-ink/50">
        يمكن اختيار عدة صور مرة واحدة.
      </p>
    </div>
  );
}
