"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CATEGORY_LIST } from "@/lib/categories";
import { slugify } from "@/lib/slug";
import type { NewsImage, NewsItem } from "@/lib/types";
import { safeHttpUrl } from "@/lib/safe-url";
import {
  addNewsImages,
  deleteNewsImage,
  uploadNewsImages,
} from "@/lib/supabase/gallery";
import GalleryField from "./GalleryField";
import FeaturedImageField from "./FeaturedImageField";

interface NewsFormProps {
  initial?: NewsItem;
  initialGallery?: NewsImage[];
}

interface PendingImage {
  key: string;
  file: File;
  previewUrl: string;
}

function toDateTimeLocal(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

export default function NewsForm({ initial, initialGallery = [] }: NewsFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [category, setCategory] = useState(initial?.category ?? "school");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [featuredInCarousel, setFeaturedInCarousel] = useState(
    initial?.featured_in_carousel ?? false
  );
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [imageAlt, setImageAlt] = useState(initial?.image_alt ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pinned, setPinned] = useState(initial?.pinned ?? false);
  const [priority, setPriority] = useState(initial?.priority ?? 0);
  const [publishAt, setPublishAt] = useState(toDateTimeLocal(initial?.publish_at));
  const [eventAt, setEventAt] = useState(toDateTimeLocal(initial?.event_at));
  const [location, setLocation] = useState(initial?.location ?? "");
  const [audience, setAudience] = useState(initial?.audience ?? "");
  const [ctaLabel, setCtaLabel] = useState(initial?.cta_label ?? "");
  const [ctaUrl, setCtaUrl] = useState(initial?.cta_url ?? "");

  const [existingGallery, setExistingGallery] =
    useState<NewsImage[]>(initialGallery);
  const [pendingGallery, setPendingGallery] = useState<PendingImage[]>([]);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  function handleAddGalleryFiles(files: File[]) {
    const next = files.map((file) => ({
      key: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setPendingGallery((prev) => [...prev, ...next]);
  }

  function handleRemovePending(key: string) {
    setPendingGallery((prev) => prev.filter((img) => img.key !== key));
  }

  async function handleRemoveExisting(id: string) {
    if (!confirm("هل تريد حذف هذه الصورة من المعرض؟")) return;

    setDeletingImageId(id);
    try {
      const supabase = createClient();
      await deleteNewsImage(supabase, id);
      setExistingGallery((prev) => prev.filter((img) => img.id !== id));
    } catch {
      alert("تعذر حذف الصورة. حاول مرة أخرى.");
    } finally {
      setDeletingImageId(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!imageUrl && !imageFile) {
      setError("يجب إضافة صورة رئيسية قبل الحفظ.");
      return;
    }

    if (Boolean(ctaLabel.trim()) !== Boolean(ctaUrl.trim())) {
      setError("أضف نص زر الإجراء والرابط معًا، أو اتركهما فارغين.");
      return;
    }

    if (ctaUrl.trim() && !safeHttpUrl(ctaUrl.trim())) {
      setError("رابط الإجراء يجب أن يبدأ بـ http:// أو https://.");
      return;
    }

    setSaving(true);

    const supabase = createClient();
    let finalImageUrl = imageUrl;

    try {
      if (imageFile) {
        setUploading(true);
        const [uploadedUrl] = await uploadNewsImages(supabase, [imageFile]);
        finalImageUrl = uploadedUrl;
      }

      const payload = {
        title,
        slug: slug || slugify(title),
        excerpt,
        content,
        category,
        image_url: finalImageUrl || null,
        image_alt: imageAlt.trim() || null,
        published,
        featured_in_carousel: featuredInCarousel,
        pinned,
        priority,
        publish_at: publishAt ? new Date(publishAt).toISOString() : null,
        event_at: eventAt ? new Date(eventAt).toISOString() : null,
        location: location.trim() || null,
        audience: audience.trim() || null,
        cta_label: ctaLabel.trim() || null,
        cta_url: ctaUrl.trim() || null,
      };

      let newsId = initial?.id;

      if (isEdit && initial) {
        const { error: updateError } = await supabase
          .from("news")
          .update(payload)
          .eq("id", initial.id);
        if (updateError) throw updateError;
      } else {
        const { data: inserted, error: insertError } = await supabase
          .from("news")
          .insert(payload)
          .select("id")
          .single();
        if (insertError) throw insertError;
        newsId = inserted.id;
      }

      if (pendingGallery.length > 0 && newsId) {
        setUploading(true);
        const uploadedUrls = await uploadNewsImages(
          supabase,
          pendingGallery.map((p) => p.file)
        );
        await addNewsImages(
          supabase,
          newsId,
          uploadedUrls,
          existingGallery.length
        );
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "حدث خطأ أثناء الحفظ. حاول مرة أخرى."
      );
    } finally {
      setSaving(false);
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="font-utility text-sm text-ink/70">
          العنوان
        </label>
        <input
          id="title"
          required
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="rounded-md border border-ink/20 px-3 py-2 font-body focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="slug" className="font-utility text-sm text-ink/70">
          الرابط المختصر (slug)
        </label>
        <input
          id="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTouched(true);
          }}
          dir="ltr"
          className="rounded-md border border-ink/20 px-3 py-2 font-body text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="excerpt" className="font-utility text-sm text-ink/70">
          مقتطف مختصر
        </label>
        <textarea
          id="excerpt"
          required
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="rounded-md border border-ink/20 px-3 py-2 font-body focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="content" className="font-utility text-sm text-ink/70">
          محتوى الخبر
        </label>
        <textarea
          id="content"
          required
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="rounded-md border border-ink/20 px-3 py-2 font-body focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="category" className="font-utility text-sm text-ink/70">
          التصنيف
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value as NewsItem["category"])
          }
          className="rounded-md border border-ink/20 px-3 py-2 font-body focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          {CATEGORY_LIST.map((cat) => (
            <option key={cat.key} value={cat.key}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="grid gap-4 rounded-xl border border-ink/10 bg-white p-5 sm:grid-cols-2">
        <legend className="px-2 font-display text-xl text-ink">بيانات النشر</legend>
        <div className="flex flex-col gap-1">
          <label htmlFor="priority" className="font-utility text-sm text-ink/70">الأولوية</label>
          <select id="priority" value={priority} onChange={(event) => setPriority(Number(event.target.value))} className="min-h-11 rounded-md border border-ink/20 px-3 font-body">
            <option value={0}>عادية</option>
            <option value={1}>مهمة</option>
            <option value={2}>عاجلة</option>
            <option value={3}>قصوى</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="audience" className="font-utility text-sm text-ink/70">الجمهور المستهدف</label>
          <input id="audience" value={audience} onChange={(event) => setAudience(event.target.value)} placeholder="مثال: أولياء الأمور" className="min-h-11 rounded-md border border-ink/20 px-3 font-body" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="publish-at" className="font-utility text-sm text-ink/70">موعد النشر الاختياري</label>
          <input id="publish-at" type="datetime-local" value={publishAt} onChange={(event) => setPublishAt(event.target.value)} className="min-h-11 rounded-md border border-ink/20 px-3 font-body" />
          <p className="font-utility text-xs text-ink/50">اتركه فارغًا للنشر فورًا عند تفعيل «منشور».</p>
        </div>
        <label className="flex items-center gap-2 font-utility text-sm sm:col-span-2">
          <input type="checkbox" checked={pinned} onChange={(event) => setPinned(event.target.checked)} className="h-4 w-4" />
          تثبيت الخبر ضمن المحتوى المهم
        </label>
      </fieldset>

      <fieldset className="grid gap-4 rounded-xl border border-ink/10 bg-white p-5 sm:grid-cols-2">
        <legend className="px-2 font-display text-xl text-ink">تفاصيل الفعالية أو الموعد</legend>
        <div className="flex flex-col gap-1">
          <label htmlFor="event-at" className="font-utility text-sm text-ink/70">التاريخ والوقت</label>
          <input id="event-at" type="datetime-local" value={eventAt} onChange={(event) => setEventAt(event.target.value)} className="min-h-11 rounded-md border border-ink/20 px-3 font-body" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="location" className="font-utility text-sm text-ink/70">المكان</label>
          <input id="location" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="مثال: مسرح المدرسة" className="min-h-11 rounded-md border border-ink/20 px-3 font-body" />
        </div>
      </fieldset>

      <fieldset className="grid gap-4 rounded-xl border border-ink/10 bg-white p-5 sm:grid-cols-2">
        <legend className="px-2 font-display text-xl text-ink">رابط الإجراء</legend>
        <div className="flex flex-col gap-1">
          <label htmlFor="cta-label" className="font-utility text-sm text-ink/70">نص الزر</label>
          <input id="cta-label" value={ctaLabel} onChange={(event) => setCtaLabel(event.target.value)} placeholder="مثال: التسجيل الآن" className="min-h-11 rounded-md border border-ink/20 px-3 font-body" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="cta-url" className="font-utility text-sm text-ink/70">الرابط</label>
          <input id="cta-url" type="url" dir="ltr" value={ctaUrl} onChange={(event) => setCtaUrl(event.target.value)} placeholder="https://" className="min-h-11 rounded-md border border-ink/20 px-3 text-left font-body" />
        </div>
      </fieldset>

      <FeaturedImageField
        imageUrl={imageUrl}
        onFileSelected={(file) => {
          setImageFile(file);
          setImageUrl(URL.createObjectURL(file));
        }}
        onRemove={() => {
          setImageFile(null);
          setImageUrl("");
        }}
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="image-alt" className="font-utility text-sm text-ink/70">وصف الصورة لذوي الإعاقة البصرية</label>
        <input id="image-alt" value={imageAlt} onChange={(event) => setImageAlt(event.target.value)} placeholder="صف ما يظهر في الصورة باختصار" className="min-h-11 rounded-md border border-ink/20 px-3 font-body" />
        <p className="font-utility text-xs text-ink/50">اتركه فارغًا فقط إذا كانت الصورة زخرفية ولا تضيف معنى.</p>
      </div>

      <GalleryField
        existingImages={existingGallery}
        pendingImages={pendingGallery}
        onAddFiles={handleAddGalleryFiles}
        onRemoveExisting={handleRemoveExisting}
        onRemovePending={handleRemovePending}
        deletingId={deletingImageId}
      />

      <label className="flex items-center gap-2 font-utility text-sm">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4"
        />
        منشور (يظهر للعامة)
      </label>

      <label className="flex items-center gap-2 font-utility text-sm">
        <input
          type="checkbox"
          checked={featuredInCarousel}
          onChange={(e) => setFeaturedInCarousel(e.target.checked)}
          className="h-4 w-4"
        />
        عرض في الكاروسيل الرئيسي
      </label>
      {featuredInCarousel && !imageUrl ? (
        <p className="font-utility text-xs text-maroon -mt-3">
          يجب إضافة صورة رئيسية حتى يظهر الخبر في الكاروسيل.
        </p>
      ) : null}

      {error ? (
        <p className="font-utility text-sm text-maroon" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={saving || uploading}
        className="self-start rounded-md bg-ink text-paper font-utility text-sm px-6 py-2 hover:bg-ink/90 transition-colors disabled:opacity-60"
      >
        {uploading ? "جارٍ رفع الصور..." : saving ? "جارٍ الحفظ..." : "حفظ"}
      </button>
    </form>
  );
}
