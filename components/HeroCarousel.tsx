"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { NewsItem } from "@/lib/types";
import { formatRelativeArabic } from "@/lib/format-date";
import CategoryTag from "./CategoryTag";
import SafeImage from "./SafeImage";

const AUTOPLAY_MS = 7000;

export default function HeroCarousel({ items }: { items: NewsItem[] }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const goTo = useCallback((nextIndex: number) => setIndex((nextIndex + items.length) % items.length), [items.length]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (items.length <= 1 || !playing || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timerRef.current = setInterval(() => setIndex((current) => (current + 1) % items.length), AUTOPLAY_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [items.length, playing]);

  if (items.length === 0) return null;

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowRight") { event.preventDefault(); prev(); }
    if (event.key === "ArrowLeft") { event.preventDefault(); next(); }
  }

  return (
    <section aria-roledescription="carousel" aria-label="أبرز أخبار المدرسة" className="relative overflow-hidden rounded-2xl bg-ink shadow-xl" onMouseEnter={() => setPlaying(false)} onMouseLeave={() => setPlaying(false)} onFocus={() => setPlaying(false)} onKeyDown={handleKeyDown}>
      <div className="relative aspect-[4/3] w-full sm:aspect-[21/9]">
        {items.map((item, itemIndex) => (
          <Link key={item.id} href={`/news/${item.slug}`} aria-hidden={itemIndex !== index} tabIndex={itemIndex === index ? 0 : -1} className={`absolute inset-0 transition-opacity duration-500 ${itemIndex === index ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}>
            {item.image_url ? <SafeImage src={item.image_url} alt={item.title} fill sizes="(min-width: 1152px) 1152px, calc(100vw - 2rem)" className="object-cover" priority={itemIndex === 0} /> : <div className="absolute inset-0 bg-ink" />}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex max-w-3xl flex-col gap-3 p-5 sm:p-9">
              <CategoryTag category={item.category} />
              <h2 className="font-display text-2xl leading-tight text-paper sm:text-4xl">{item.title}</h2>
              <p className="line-clamp-2 max-w-2xl font-body text-sm leading-7 text-paper/80 sm:text-base">{item.excerpt}</p>
              <div className="flex flex-wrap items-center gap-4 font-utility text-xs text-paper/70">
                <time dateTime={item.created_at}>{formatRelativeArabic(item.created_at)}</time>
                <span className="font-semibold text-gold">اقرأ التفاصيل ←</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {items.length > 1 ? (
        <>
          <button type="button" onClick={prev} aria-label="الخبر السابق" className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 text-xl text-paper transition-colors hover:bg-ink">‹</button>
          <button type="button" onClick={next} aria-label="الخبر التالي" className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 text-xl text-paper transition-colors hover:bg-ink">›</button>
          <button type="button" onClick={() => setPlaying((current) => !current)} aria-label={playing ? "إيقاف التشغيل التلقائي" : "تشغيل التشغيل التلقائي"} aria-pressed={playing} className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-ink/60 text-sm text-paper transition-colors hover:bg-ink">{playing ? "⏸" : "▶"}</button>
          <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1" role="tablist" aria-label="اختيار الخبر">
            {items.map((item, itemIndex) => <button key={item.id} type="button" role="tab" onClick={() => goTo(itemIndex)} aria-label={`الانتقال إلى الخبر ${itemIndex + 1} من ${items.length}`} aria-selected={itemIndex === index} className="flex h-11 w-11 items-center justify-center"><span aria-hidden="true" className={`block h-2 rounded-full transition-all ${itemIndex === index ? "w-6 bg-gold" : "w-2 bg-paper/50"}`} /></button>)}
          </div>
        </>
      ) : null}
    </section>
  );
}
