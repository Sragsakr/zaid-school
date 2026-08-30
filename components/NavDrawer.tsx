"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORY_LIST } from "@/lib/categories";

const LINKS = [
  { href: "/", label: "الرئيسية" },
  ...CATEGORY_LIST.map((cat) => ({
    href: `/category/${cat.key}`,
    label: cat.label,
  })),
  { href: "/search", label: "بحث في الأخبار" },
];

export default function NavDrawer() {
  const pathname = usePathname();

  return <NavDrawerPanel key={pathname} />;
}

function NavDrawerPanel() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;

    closeRef.current?.focus();

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  return (
    <div className="sm:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="فتح القائمة"
        aria-expanded={open}
        aria-haspopup="dialog"
        className="flex flex-col justify-center items-center gap-1.5 w-11 h-11 rounded-md hover:bg-paper/10 transition-colors"
      >
        <span className="block w-5 h-0.5 bg-paper" />
        <span className="block w-5 h-0.5 bg-paper" />
        <span className="block w-5 h-0.5 bg-paper" />
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-label="إغلاق القائمة"
            onClick={close}
            className="fixed inset-0 z-40 bg-ink/60"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="القائمة الرئيسية"
            className="fixed inset-y-0 right-0 z-50 w-72 max-w-[80vw] bg-ink text-paper shadow-xl flex flex-col p-5 gap-1"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-display text-xl">القائمة</span>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="إغلاق القائمة"
                className="w-11 h-11 flex items-center justify-center rounded-md hover:bg-paper/10 transition-colors text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <nav className="flex flex-col gap-1 font-utility text-base">
              {LINKS.map((link) => {
                const isActive =
                  link.href === "/" ? pathname === "/" : pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`rounded-md px-3 min-h-11 flex items-center transition-colors ${
                      isActive
                        ? "bg-gold text-ink font-semibold"
                        : "hover:bg-paper/10"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      ) : null}
    </div>
  );
}
