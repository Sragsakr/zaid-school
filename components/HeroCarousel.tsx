"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { NewsItem } from "@/lib/types";
import { formatRelativeArabic } from "@/lib/format-date";
import CategoryTag from "./CategoryTag";

const AUTOPLAY_MS = 6000;

export default function HeroCarousel({ items }: { items: NewsItem[] }) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (i: number) => {
      setIndex((i + items.length) % items.length);
    },
    [items.length]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (items.length <= 1) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, AUTOPLAY_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [items.length]);

  if (items.length === 0) return null;

  function pause() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label="أحدث الأخبار"
      className="relative w-full overflow-hidden rounded-lg bg-ink"
      onMouseEnter={pause}
    >
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9]">
        {items.map((item, i) => (
          <Link
            key={item.id}
            href={`/news/${item.slug}`}
            aria-hidden={i !== index}
            tabIndex={i === index ? 0 : -1}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            {item.image_url ? (
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                sizes="100vw"
                className="object-cover"
                priority={i === 0}
              />
            ) : (
              <div className="absolute inset-0 bg-ink" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 flex flex-col gap-2">
              <CategoryTag category={item.category} />
              <h2 className="font-display text-2xl sm:text-4xl leading-tight text-paper max-w-3xl">
                {item.title}
              </h2>
              <time
                dateTime={item.created_at}
                className="font-utility text-xs text-paper/70"
              >
                {formatRelativeArabic(item.created_at)}
              </time>
            </div>
          </Link>
        ))}
      </div>

      {items.length > 1 ? (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="الخبر السابق"
            className="absolute top-1/2 -translate-y-1/2 right-3 bg-ink/50 hover:bg-ink/70 text-paper rounded-full w-9 h-9 flex items-center justify-center transition-colors"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="الخبر التالي"
            className="absolute top-1/2 -translate-y-1/2 left-3 bg-ink/50 hover:bg-ink/70 text-paper rounded-full w-9 h-9 flex items-center justify-center transition-colors"
          >
            ›
          </button>

          <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2">
            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`الانتقال إلى الخبر ${i + 1}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-gold" : "w-2 bg-paper/50"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
