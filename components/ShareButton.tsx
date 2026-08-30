"use client";

import { useState, useSyncExternalStore } from "react";

interface ShareButtonProps {
  url: string;
  title: string;
}

function subscribe() {
  return () => {};
}

function getNativeShareSnapshot() {
  return typeof navigator.share === "function";
}

function getNativeShareServerSnapshot() {
  return false;
}

export default function ShareButton({ url, title }: ShareButtonProps) {
  const canNativeShare = useSyncExternalStore(
    subscribe,
    getNativeShareSnapshot,
    getNativeShareServerSnapshot
  );
  const [copied, setCopied] = useState(false);

  async function handleNativeShare() {
    try {
      await navigator.share({ title, url });
    } catch {
      // user cancelled — no action needed
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — no action needed
    }
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  if (canNativeShare) {
    return (
      <button
        type="button"
        onClick={handleNativeShare}
        className="inline-flex items-center gap-2 rounded-md border border-ink/20 px-4 py-2 font-utility text-sm text-ink hover:bg-ink/5 transition-colors"
      >
        مشاركة
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 font-utility text-sm">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-md border border-ink/20 px-4 py-2 text-ink hover:bg-ink/5 transition-colors"
      >
        واتساب
      </a>
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-md border border-ink/20 px-4 py-2 text-ink hover:bg-ink/5 transition-colors"
      >
        فيسبوك
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="rounded-md border border-ink/20 px-4 py-2 text-ink hover:bg-ink/5 transition-colors"
      >
        {copied ? "تم النسخ" : "نسخ الرابط"}
      </button>
    </div>
  );
}
