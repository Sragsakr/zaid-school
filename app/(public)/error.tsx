"use client";

import { useEffect } from "react";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg px-4 py-20 flex flex-col items-center gap-4 text-center">
      <h1 className="font-display text-2xl sm:text-3xl text-ink">
        تعذّر تحميل الصفحة
      </h1>
      <p className="font-body text-ink/70">
        حدث خطأ غير متوقع أثناء تحميل هذه الصفحة. يرجى المحاولة مرة أخرى.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-2 flex items-center min-h-11 rounded-md bg-ink text-paper font-utility text-sm px-6 hover:bg-ink/90 transition-colors"
      >
        إعادة المحاولة
      </button>
    </div>
  );
}
