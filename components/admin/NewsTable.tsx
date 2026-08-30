"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORY_LIST, getCategoryInfo } from "@/lib/categories";
import { formatArabicDate } from "@/lib/format-date";
import type { NewsItem } from "@/lib/types";
import DeleteNewsButton from "./DeleteNewsButton";

type StatusFilter = "all" | "published" | "draft";

export default function NewsTable({ news }: { news: NewsItem[] }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const filtered = useMemo(() => news.filter((item) => item.title.toLowerCase().includes(search.trim().toLowerCase()) && (categoryFilter === "all" || item.category === categoryFilter) && (statusFilter === "all" || (statusFilter === "published" ? item.published : !item.published))), [news, search, categoryFilter, statusFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]"><label className="sr-only" htmlFor="news-search">البحث في الأخبار</label><input id="news-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث بالعنوان..." className="min-h-11 min-w-0 rounded-lg border border-ink/15 bg-white px-3 font-body text-sm focus-visible:ring-2 focus-visible:ring-gold" /><select aria-label="فلترة حسب التصنيف" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="min-h-11 rounded-lg border border-ink/15 bg-white px-3 font-utility text-sm focus-visible:ring-2 focus-visible:ring-gold"><option value="all">كل التصنيفات</option>{CATEGORY_LIST.map((category) => <option key={category.key} value={category.key}>{category.label}</option>)}</select><select aria-label="فلترة حسب الحالة" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)} className="min-h-11 rounded-lg border border-ink/15 bg-white px-3 font-utility text-sm focus-visible:ring-2 focus-visible:ring-gold"><option value="all">كل الحالات</option><option value="published">منشور</option><option value="draft">مسودة</option></select></div>
      <div className="overflow-x-auto rounded-xl border border-ink/10 bg-white"><table className="w-full min-w-[700px] text-sm font-body"><caption className="sr-only">قائمة الأخبار وإجراءات إدارتها</caption><thead className="bg-ink/[0.04] font-utility text-ink/70"><tr>{["العنوان", "التصنيف", "الحالة", "التاريخ", "إجراءات"].map((heading) => <th key={heading} scope="col" className="px-4 py-3 text-right">{heading}</th>)}</tr></thead><tbody>{filtered.map((item) => <tr key={item.id} className="border-t border-ink/10"><td className="max-w-[320px] px-4 py-4 font-medium">{item.title}</td><td className="px-4 py-4">{getCategoryInfo(item.category)?.label ?? item.category}</td><td className="px-4 py-4">{item.published ? <span className="rounded-full bg-teal/10 px-2 py-1 text-xs text-teal">منشور</span> : <span className="rounded-full bg-ink/5 px-2 py-1 text-xs text-ink/55">مسودة</span>}</td><td className="px-4 py-4 font-utility text-xs text-ink/60">{formatArabicDate(item.created_at)}</td><td className="flex gap-3 px-4 py-4"><Link href={`/admin/news/${item.id}/edit`} className="text-ink hover:text-maroon">تعديل</Link><DeleteNewsButton id={item.id} title={item.title} /></td></tr>)}{filtered.length === 0 ? <tr><td colSpan={5} className="px-4 py-10 text-center text-ink/50">{news.length === 0 ? "لا توجد أخبار بعد." : "لا توجد نتائج مطابقة."}</td></tr> : null}</tbody></table></div>
    </div>
  );
}
