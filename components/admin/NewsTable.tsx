"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORY_LIST } from "@/lib/categories";
import { getCategoryInfo } from "@/lib/categories";
import { formatArabicDate } from "@/lib/format-date";
import type { NewsItem } from "@/lib/types";
import DeleteNewsButton from "./DeleteNewsButton";

type StatusFilter = "all" | "published" | "draft";

export default function NewsTable({ news }: { news: NewsItem[] }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    return news.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" ? item.published : !item.published);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [news, search, categoryFilter, statusFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث بالعنوان..."
          className="flex-1 min-w-[200px] rounded-md border border-ink/20 px-3 py-2 font-body text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-md border border-ink/20 px-3 py-2 font-utility text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <option value="all">كل التصنيفات</option>
          {CATEGORY_LIST.map((cat) => (
            <option key={cat.key} value={cat.key}>
              {cat.label}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="rounded-md border border-ink/20 px-3 py-2 font-utility text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <option value="all">كل الحالات</option>
          <option value="published">منشور</option>
          <option value="draft">مسودة</option>
        </select>
      </div>

      <div className="bg-white rounded-lg border border-ink/10 overflow-hidden">
        <table className="w-full text-sm font-body">
          <thead className="bg-ink/5 font-utility text-ink/70">
            <tr>
              <th className="text-right px-4 py-3">العنوان</th>
              <th className="text-right px-4 py-3">التصنيف</th>
              <th className="text-right px-4 py-3">الحالة</th>
              <th className="text-right px-4 py-3">التاريخ</th>
              <th className="text-right px-4 py-3">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-t border-ink/10">
                <td className="px-4 py-3">{item.title}</td>
                <td className="px-4 py-3">
                  {getCategoryInfo(item.category)?.label ?? item.category}
                </td>
                <td className="px-4 py-3">
                  {item.published ? (
                    <span className="text-teal">منشور</span>
                  ) : (
                    <span className="text-ink/50">مسودة</span>
                  )}
                </td>
                <td className="px-4 py-3 font-utility text-xs text-ink/60">
                  {formatArabicDate(item.created_at)}
                </td>
                <td className="px-4 py-3 flex gap-3">
                  <Link
                    href={`/admin/news/${item.id}/edit`}
                    className="text-ink hover:text-gold transition-colors"
                  >
                    تعديل
                  </Link>
                  <DeleteNewsButton id={item.id} title={item.title} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink/50">
                  {news.length === 0
                    ? "لا توجد أخبار بعد."
                    : "لا توجد نتائج مطابقة."}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
