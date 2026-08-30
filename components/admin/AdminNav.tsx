"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

const NAV_LINKS = [
  { href: "/admin", label: "الأخبار" },
  { href: "/admin/settings", label: "إعدادات الموقع" },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <header className="border-b border-paper/10 bg-ink text-paper">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/admin" className="font-display text-xl text-gold">لوحة إدارة المدرسة</Link>
        <nav aria-label="تنقل الإدارة" className="order-3 flex w-full gap-1 font-utility text-sm sm:order-2 sm:w-auto">
          {NAV_LINKS.map((link) => { const active = pathname === link.href; return <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} className={`flex min-h-10 items-center rounded-md px-3 transition-colors ${active ? "bg-gold font-semibold text-ink" : "text-paper/80 hover:bg-paper/10 hover:text-paper"}`}>{link.label}</Link>; })}
          <Link href="/" target="_blank" className="flex min-h-10 items-center rounded-md px-3 text-paper/80 transition-colors hover:bg-paper/10 hover:text-paper">عرض الموقع ↗</Link>
        </nav>
        <LogoutButton />
      </div>
    </header>
  );
}
