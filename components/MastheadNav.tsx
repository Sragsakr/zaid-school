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
  ];

  if (compact) {
    return (
      <nav className="flex flex-wrap items-center gap-1 font-utility text-sm">
        {links.map((link) => {
          const isActive =
            link.href === "/" ? pathname === "/" : pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`rounded-full px-3 py-1 transition-colors ${
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
    <nav className="mt-2 flex flex-wrap justify-center gap-1 rounded-full bg-ink/70 backdrop-blur-sm px-2 py-2 font-utility text-sm">
      {links.map((link) => {
        const isActive =
          link.href === "/" ? pathname === "/" : pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-full px-3 py-1 transition-colors ${
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
