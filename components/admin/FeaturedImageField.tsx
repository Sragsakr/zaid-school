"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface FeaturedImageFieldProps {
  imageUrl: string;
  onFileSelected: (file: File) => void;
  onRemove: () => void;
}

export default function FeaturedImageField({
  imageUrl,
  onFileSelected,
  onRemove,
}: FeaturedImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file && file.type.startsWith("image/")) {
      onFileSelected(file);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="font-utility text-sm text-ink/70">الصورة الرئيسية</span>

      {imageUrl ? (
        <div className="relative w-full max-w-sm aspect-video rounded-md overflow-hidden border border-ink/10 group">
          <Image src={imageUrl} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-md bg-paper text-ink text-xs font-utility px-3 py-1.5 hover:bg-gold transition-colors"
            >
              استبدال
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="rounded-md bg-maroon text-paper text-xs font-utility px-3 py-1.5 hover:bg-maroon/90 transition-colors"
            >
              حذف
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`w-full max-w-sm aspect-video rounded-md border-2 border-dashed flex flex-col items-center justify-center gap-1 font-utility text-sm transition-colors ${
            isDragging
              ? "border-gold bg-gold/10 text-ink"
              : "border-ink/20 text-ink/50 hover:border-ink/40 hover:text-ink/70"
          }`}
        >
          <span>اسحب صورة هنا أو اضغط للاختيار</span>
          <span className="text-xs text-ink/40">PNG, JPG</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
        className="hidden"
      />

      <p className="font-utility text-xs text-ink/50">
        هذه الصورة تظهر في بطاقة الخبر والصفحة الرئيسية ومعاينات المشاركة.
      </p>
    </div>
  );
}
