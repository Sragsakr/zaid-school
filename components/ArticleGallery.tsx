import Image from "next/image";
import type { NewsImage } from "@/lib/types";

export default function ArticleGallery({ images }: { images: NewsImage[] }) {
  if (images.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="font-display text-2xl text-ink mb-4">معرض الصور</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative aspect-square rounded-md overflow-hidden bg-ink/5 border border-ink/10"
          >
            <Image
              src={image.image_url}
              alt=""
              fill
              sizes="(min-width: 640px) 33vw, 50vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
