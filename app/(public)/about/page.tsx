import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "إهداء",
  description: "إهداء خاص بالموقع.",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 flex flex-col gap-8">
      <h1 className="font-display text-3xl text-ink text-center">إهداء</h1>

      {settings.dedication_text ? (
        <div className="bg-maroon/5 border border-maroon/20 rounded-lg p-6 text-center">
          <p className="font-body text-ink/90 leading-relaxed">
            {settings.dedication_text}
          </p>
        </div>
      ) : null}
    </div>
  );
}
