"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { SiteSettings } from "@/lib/types";
import MastheadNav from "./MastheadNav";

export default function StickyHeader({ settings }: { settings: SiteSettings }) {
  const [visible, setVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" />
      <div
        className={`fixed top-0 inset-x-0 z-50 bg-ink text-paper shadow-md transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto max-w-6xl px-4 py-2 flex items-center justify-between gap-4">
          <MastheadNav compact />
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="font-display text-lg leading-none">
              {settings.school_name}
            </span>
            {settings.logo_url ? (
              <Image
                src={settings.logo_url}
                alt=""
                width={36}
                height={36}
                className="rounded-full bg-paper object-cover w-9 h-9"
              />
            ) : null}
          </Link>
        </div>
      </div>
    </>
  );
}
