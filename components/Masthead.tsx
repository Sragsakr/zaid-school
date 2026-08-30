import Link from "next/link";
import Image from "next/image";
import type { SiteSettings } from "@/lib/types";
import { issueLine } from "@/lib/format-date";
import MastheadNav from "./MastheadNav";
import StickyHeader from "./StickyHeader";

export default function Masthead({ settings }: { settings: SiteSettings }) {
  return (
    <header className="bg-ink text-paper">
      {settings.logo_url ? (
        <Link href="/" className="block relative w-full">
          <Image
            src={settings.logo_url}
            alt={settings.school_name}
            width={1600}
            height={900}
            priority
            sizes="100vw"
            className="w-full h-auto"
          />
        </Link>
      ) : null}

      <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col items-center gap-2 text-center">
        {!settings.logo_url ? (
          <Link href="/">
            <h1 className="font-display text-3xl sm:text-4xl leading-tight">
              {settings.school_name}
            </h1>
          </Link>
        ) : null}
        <p className="font-utility text-sm text-gold">
          نشرة الأخبار الرسمية للمدرسة
        </p>
        <p className="font-utility text-xs text-paper/70">{issueLine()}</p>
        <MastheadNav />
      </div>

      <StickyHeader settings={settings} />
    </header>
  );
}
