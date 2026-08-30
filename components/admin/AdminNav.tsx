import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function AdminNav() {
  return (
    <header className="bg-ink text-paper">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <nav className="flex gap-6 font-utility text-sm">
          <Link href="/admin" className="hover:text-gold transition-colors">
            الأخبار
          </Link>
          <Link
            href="/admin/settings"
            className="hover:text-gold transition-colors"
          >
            إعدادات الموقع
          </Link>
          <Link
            href="/"
            target="_blank"
            className="hover:text-gold transition-colors"
          >
            عرض الموقع
          </Link>
        </nav>
        <LogoutButton />
      </div>
    </header>
  );
}
