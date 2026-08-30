import Link from "next/link";

export default function SectionHeading({
  eyebrow,
  title,
  href,
  linkLabel = "عرض الكل",
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-ink/15 pb-3">
      <div className="flex flex-col gap-1">
        {eyebrow ? (
          <span className="font-utility text-xs font-semibold tracking-wide text-maroon">
            {eyebrow}
          </span>
        ) : null}
        <h2 className="font-display text-2xl sm:text-3xl text-ink">{title}</h2>
      </div>
      {href ? (
        <Link
          href={href}
          className="shrink-0 rounded-md px-2 py-2 font-utility text-sm text-ink/65 transition-colors hover:bg-ink/5 hover:text-maroon"
        >
          {linkLabel} ←
        </Link>
      ) : null}
    </div>
  );
}
