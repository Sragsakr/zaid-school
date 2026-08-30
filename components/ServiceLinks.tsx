import Link from "next/link";

const SERVICE_LINKS = [
  { href: "/category/announcements", label: "الإعلانات المهمة", icon: "!" },
  { href: "/category/results", label: "النتائج والمسابقات", icon: "✓" },
  { href: "/category/events", label: "الفعاليات المدرسية", icon: "◷" },
  { href: "/about", label: "عن المدرسة والتواصل", icon: "i" },
] as const;

export default function ServiceLinks() {
  return (
    <section aria-labelledby="services-heading" className="flex flex-col gap-4">
      <div>
        <p className="font-utility text-xs font-semibold tracking-wide text-maroon">تجد هنا</p>
        <h2 id="services-heading" className="font-display text-2xl text-ink">كل ما يهم مجتمع المدرسة</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICE_LINKS.map((service) => (
          <Link key={service.href} href={service.href} className="group flex min-h-24 items-center gap-3 rounded-xl border border-ink/10 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-gold hover:shadow-md">
            <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-lg font-semibold text-gold">{service.icon}</span>
            <span className="font-utility text-sm font-semibold leading-relaxed text-ink transition-colors group-hover:text-maroon">{service.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
