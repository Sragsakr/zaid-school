import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

export default function Footer({ settings }: { settings: SiteSettings }) {
  const hasContact = settings.phone || settings.email || settings.address;
  const hasSocial = settings.facebook_page_url || settings.facebook_group_url;

  return (
    <footer className="mt-16 bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl mb-3">{settings.school_name}</h2>
          {settings.about_text ? (
            <p className="font-body text-sm text-paper/80 leading-relaxed">
              {settings.about_text}
            </p>
          ) : null}
        </div>
        <div className="font-utility text-sm space-y-2">
          {hasContact ? (
            <div className="space-y-1">
              {settings.phone ? <p>هاتف: {settings.phone}</p> : null}
              {settings.email ? <p>البريد الإلكتروني: {settings.email}</p> : null}
              {settings.address ? <p>العنوان: {settings.address}</p> : null}
            </div>
          ) : null}
          {hasSocial ? (
            <div className="flex gap-4 pt-2">
              {settings.facebook_page_url ? (
                <a
                  href={settings.facebook_page_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:underline"
                >
                  صفحة الفيسبوك
                </a>
              ) : null}
              {settings.facebook_group_url ? (
                <a
                  href={settings.facebook_group_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:underline"
                >
                  مجموعة الفيسبوك
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      <div className="border-t border-paper/10 py-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-center text-xs text-paper/60 font-utility">
        <span>
          © {new Date().getFullYear()} {settings.school_name} — جميع الحقوق محفوظة
        </span>
        <span className="hidden sm:inline">·</span>
        <Link href="/about" className="hover:text-gold transition-colors">
          إهداء
        </Link>
      </div>
    </footer>
  );
}
