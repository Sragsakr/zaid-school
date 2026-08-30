import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

export default function Footer({ settings }: { settings: SiteSettings }) {
  const hasContact = settings.phone || settings.email || settings.address;
  const hasSocial = settings.facebook_page_url || settings.facebook_group_url;

  return (
    <footer className="mt-16 bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <h2 className="font-display text-2xl">{settings.school_name}</h2>
          {settings.about_text ? <p className="mt-3 max-w-md font-body text-sm leading-7 text-paper/75">{settings.about_text}</p> : null}
          <nav aria-label="روابط الموقع" className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-utility text-sm">
            <Link href="/" className="flex min-h-11 items-center hover:text-gold">الرئيسية</Link>
            <Link href="/about" className="flex min-h-11 items-center hover:text-gold">عن المدرسة</Link>
            {settings.dedication_text ? <Link href="/dedication" className="flex min-h-11 items-center hover:text-gold">إهداء</Link> : null}
          </nav>
        </div>
        <div>
          <h2 className="font-display text-xl">الوصول السريع</h2>
          <nav aria-label="الوصول السريع" className="mt-3 flex flex-col items-start gap-1 font-utility text-sm text-paper/75">
            <Link href="/category/announcements" className="min-h-10 py-2 hover:text-gold">الإعلانات المهمة</Link>
            <Link href="/category/events" className="min-h-10 py-2 hover:text-gold">الفعاليات</Link>
            <Link href="/category/results" className="min-h-10 py-2 hover:text-gold">النتائج والمسابقات</Link>
          </nav>
        </div>
        <div className="font-utility text-sm text-paper/75">
          <h2 className="font-display text-xl text-paper">تواصل معنا</h2>
          {hasContact ? <div className="mt-3 space-y-2">{settings.phone ? <a href={`tel:${settings.phone}`} dir="ltr" className="block text-right hover:text-gold">{settings.phone}</a> : null}{settings.email ? <a href={`mailto:${settings.email}`} dir="ltr" className="block text-right hover:text-gold">{settings.email}</a> : null}{settings.address ? <p>{settings.address}</p> : null}</div> : <p className="mt-3">بيانات التواصل ستُضاف قريبًا.</p>}
          {hasSocial ? <div className="mt-4 flex flex-wrap gap-4">{settings.facebook_page_url ? <a href={settings.facebook_page_url} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">صفحة فيسبوك</a> : null}{settings.facebook_group_url ? <a href={settings.facebook_group_url} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">مجموعة فيسبوك</a> : null}</div> : null}
        </div>
      </div>
      <div className="border-t border-paper/10 py-4 text-center font-utility text-xs text-paper/55">© {new Date().getFullYear()} {settings.school_name} — جميع الحقوق محفوظة</div>
    </footer>
  );
}
