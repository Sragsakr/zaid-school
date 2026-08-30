"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORY_LIST } from "@/lib/categories";

const LINKS = [
  { href: "/", label: "الرئيسية" },
  ...CATEGORY_LIST.map((category) => ({ href: `/category/${category.key}`, label: category.label })),
  { href: "/search", label: "بحث في الأخبار" },
];

export default function NavDrawer() {
  const pathname = usePathname();
  return <NavDrawerDialog key={pathname} pathname={pathname} />;
}

function NavDrawerDialog({ pathname }: { pathname: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = originalOverflow; };
  }, [open]);

  function openDialog() {
    dialogRef.current?.showModal();
    setOpen(true);
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  return (
    <div className="sm:hidden">
      <button type="button" onClick={openDialog} aria-label="فتح القائمة" aria-expanded={open} className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-md transition-colors hover:bg-paper/10">
        <span className="block h-0.5 w-5 bg-paper" /><span className="block h-0.5 w-5 bg-paper" /><span className="block h-0.5 w-5 bg-paper" />
      </button>
      <dialog ref={dialogRef} onClose={() => setOpen(false)} aria-label="القائمة الرئيسية" className="fixed inset-y-0 right-0 m-0 h-dvh max-h-none w-72 max-w-[80vw] bg-ink p-0 text-paper shadow-2xl backdrop:bg-ink/60">
        <div className="flex h-full flex-col p-5">
          <div className="mb-4 flex items-center justify-between"><span className="font-display text-xl">القائمة</span><button type="button" onClick={closeDialog} aria-label="إغلاق القائمة" className="flex h-11 w-11 items-center justify-center rounded-md text-2xl transition-colors hover:bg-paper/10">×</button></div>
          <nav className="flex flex-col gap-1 font-utility text-base">
            {LINKS.map((link) => { const active = link.href === "/" ? pathname === "/" : pathname === link.href; return <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} className={`flex min-h-11 items-center rounded-md px-3 transition-colors ${active ? "bg-gold font-semibold text-ink" : "hover:bg-paper/10"}`}>{link.label}</Link>; })}
          </nav>
        </div>
      </dialog>
    </div>
  );
}
