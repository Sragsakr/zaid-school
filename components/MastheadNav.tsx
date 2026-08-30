"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORY_LIST } from "@/lib/categories";

export default function MastheadNav({
  compact = false,
}: {
  compact?: boolean;
}) {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "الرئيسية" },
    ...CATEGORY_LIST.map((cat) => ({
      href: `/category/${cat.key}`,
      label: cat.label,
    })),
    { href: "/search", label: "بحث" },
  ];

  if (compact) {
    return (
      <nav className="hidden sm:flex flex-wrap items-center gap-1 font-utility text-sm">
        {links.map((link) => {
          const isActive =
            link.href === "/" ? pathname === "/" : pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center rounded-full px-3 min-h-11 transition-colors ${
                isActive ? "bg-gold text-ink font-semibold" : "hover:text-gold"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="hidden sm:flex mt-2 flex-wrap justify-center gap-1 rounded-full bg-ink/70 backdrop-blur-sm px-2 py-1 font-utility text-sm">
      {links.map((link) => {
        const isActive =
          link.href === "/" ? pathname === "/" : pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={`flex items-center rounded-full px-3 min-h-11 transition-colors ${
              isActive ? "bg-gold text-ink font-semibold" : "hover:text-gold"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
