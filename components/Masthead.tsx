import Link from "next/link";
import Image from "next/image";
import type { SiteSettings } from "@/lib/types";
import MastheadNav from "./MastheadNav";
import StickyHeader from "./StickyHeader";
import NavDrawer from "./NavDrawer";

export default function Masthead({ settings }: { settings: SiteSettings }) {
  return (
    <header className="bg-ink text-paper">
      <div className="border-b border-paper/10 bg-maroon px-4 py-2 text-center font-utility text-xs sm:text-sm">
        <span>البوابة الرسمية لمجمع مدارس الشيخ زايد الرسمية لغات</span>
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:py-5">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          {settings.logo_url ? (
            <Image
              src={settings.logo_url}
              alt=""
              width={52}
              height={52}
              priority
              className="h-12 w-12 shrink-0 rounded-full bg-paper object-contain p-1 sm:h-14 sm:w-14"
            />
          ) : null}
          <span className="min-w-0">
            <span className="block truncate font-display text-xl leading-tight sm:text-2xl">
              {settings.school_name}
            </span>
            <span className="mt-1 block font-utility text-xs text-gold sm:text-sm">
              أخبار · إعلانات · فعاليات المدرسة
            </span>
          </span>
        </Link>
        <div className="sm:hidden">
          <NavDrawer />
        </div>
        <MastheadNav />
      </div>
      <StickyHeader settings={settings} />
    </header>
  );
}
