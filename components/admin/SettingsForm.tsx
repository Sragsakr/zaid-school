"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { SiteSettings } from "@/lib/types";

export default function SettingsForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter();

  const [schoolName, setSchoolName] = useState(initial.school_name);
  const [logoUrl, setLogoUrl] = useState(initial.logo_url ?? "");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [email, setEmail] = useState(initial.email ?? "");
  const [address, setAddress] = useState(initial.address ?? "");
  const [facebookPage, setFacebookPage] = useState(
    initial.facebook_page_url ?? ""
  );
  const [facebookGroup, setFacebookGroup] = useState(
    initial.facebook_group_url ?? ""
  );
  const [aboutText, setAboutText] = useState(initial.about_text ?? "");

  const [developerName, setDeveloperName] = useState(
    initial.developer_name ?? ""
  );
  const [developerEmail, setDeveloperEmail] = useState(
    initial.developer_email ?? ""
  );
  const [developerPhone, setDeveloperPhone] = useState(
    initial.developer_phone ?? ""
  );
  const [developerBio, setDeveloperBio] = useState(
    initial.developer_bio ?? ""
  );
  const [developerPhotoUrl, setDeveloperPhotoUrl] = useState(
    initial.developer_photo_url ?? ""
  );
  const [developerPhotoFile, setDeveloperPhotoFile] = useState<File | null>(
    null
  );
  const [dedicationText, setDedicationText] = useState(
    initial.dedication_text ?? ""
  );

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);

    const supabase = createClient();
    let finalLogoUrl = logoUrl;
    let finalDeveloperPhotoUrl = developerPhotoUrl;

    try {
      if (logoFile) {
        setUploading(true);
        const ext = logoFile.name.split(".").pop();
        const path = `logo-${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("site-assets")
          .upload(path, logoFile, { upsert: false });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("site-assets")
          .getPublicUrl(path);

        finalLogoUrl = publicUrlData.publicUrl;
        setUploading(false);
      }

      if (developerPhotoFile) {
        setUploading(true);
        const ext = developerPhotoFile.name.split(".").pop();
        const path = `developer-${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("site-assets")
          .upload(path, developerPhotoFile, { upsert: false });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("site-assets")
          .getPublicUrl(path);

        finalDeveloperPhotoUrl = publicUrlData.publicUrl;
        setUploading(false);
      }

      const { error: updateError } = await supabase
        .from("site_settings")
        .update({
          school_name: schoolName,
          logo_url: finalLogoUrl || null,
          phone: phone || null,
          email: email || null,
          address: address || null,
          facebook_page_url: facebookPage || null,
          facebook_group_url: facebookGroup || null,
          about_text: aboutText || null,
          developer_name: developerName || null,
          developer_email: developerEmail || null,
          developer_phone: developerPhone || null,
          developer_bio: developerBio || null,
          developer_photo_url: finalDeveloperPhotoUrl || null,
          dedication_text: dedicationText || null,
        })
        .eq("id", 1);

      if (updateError) throw updateError;

      setSuccess(true);
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-2xl">
      <div className="flex flex-col gap-1">
        <label
          htmlFor="school_name"
          className="font-utility text-sm text-ink/70"
        >
          اسم المدرسة
        </label>
        <input
          id="school_name"
          required
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          className="rounded-md border border-ink/20 px-3 py-2 font-body focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-utility text-sm text-ink/70">شعار المدرسة</span>
        {logoUrl ? (
          <div className="relative w-24 h-24 rounded-full overflow-hidden border border-ink/10 bg-white">
            <Image src={logoUrl} alt="" fill className="object-contain p-1" />
          </div>
        ) : null}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setLogoFile(file);
              setLogoUrl(URL.createObjectURL(file));
            }
          }}
          className="font-utility text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="phone" className="font-utility text-sm text-ink/70">
          الهاتف
        </label>
        <input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          dir="ltr"
          className="rounded-md border border-ink/20 px-3 py-2 font-body text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="font-utility text-sm text-ink/70">
          البريد الإلكتروني
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          dir="ltr"
          className="rounded-md border border-ink/20 px-3 py-2 font-body text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="address" className="font-utility text-sm text-ink/70">
          العنوان
        </label>
        <input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="rounded-md border border-ink/20 px-3 py-2 font-body focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="facebook_page"
          className="font-utility text-sm text-ink/70"
        >
          رابط صفحة الفيسبوك
        </label>
        <input
          id="facebook_page"
          type="url"
          value={facebookPage}
          onChange={(e) => setFacebookPage(e.target.value)}
          dir="ltr"
          className="rounded-md border border-ink/20 px-3 py-2 font-body text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="facebook_group"
          className="font-utility text-sm text-ink/70"
        >
          رابط مجموعة الفيسبوك
        </label>
        <input
          id="facebook_group"
          type="url"
          value={facebookGroup}
          onChange={(e) => setFacebookGroup(e.target.value)}
          dir="ltr"
          className="rounded-md border border-ink/20 px-3 py-2 font-body text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="about" className="font-utility text-sm text-ink/70">
          نبذة عن المدرسة
        </label>
        <textarea
          id="about"
          rows={4}
          value={aboutText}
          onChange={(e) => setAboutText(e.target.value)}
          className="rounded-md border border-ink/20 px-3 py-2 font-body focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        />
      </div>

      <hr className="border-ink/10" />
      <h2 className="font-display text-xl text-ink">صفحة عن المطور</h2>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="developer_name"
          className="font-utility text-sm text-ink/70"
        >
          اسم المطور
        </label>
        <input
          id="developer_name"
          value={developerName}
          onChange={(e) => setDeveloperName(e.target.value)}
          className="rounded-md border border-ink/20 px-3 py-2 font-body focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-utility text-sm text-ink/70">صورة المطور</span>
        {developerPhotoUrl ? (
          <div className="relative w-24 h-24 rounded-full overflow-hidden border border-ink/10 bg-white">
            <Image
              src={developerPhotoUrl}
              alt=""
              fill
              className="object-cover"
            />
          </div>
        ) : null}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setDeveloperPhotoFile(file);
              setDeveloperPhotoUrl(URL.createObjectURL(file));
            }
          }}
          className="font-utility text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="developer_email"
          className="font-utility text-sm text-ink/70"
        >
          بريد المطور الإلكتروني
        </label>
        <input
          id="developer_email"
          type="email"
          value={developerEmail}
          onChange={(e) => setDeveloperEmail(e.target.value)}
          dir="ltr"
          className="rounded-md border border-ink/20 px-3 py-2 font-body text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="developer_phone"
          className="font-utility text-sm text-ink/70"
        >
          هاتف المطور
        </label>
        <input
          id="developer_phone"
          value={developerPhone}
          onChange={(e) => setDeveloperPhone(e.target.value)}
          dir="ltr"
          className="rounded-md border border-ink/20 px-3 py-2 font-body text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="developer_bio"
          className="font-utility text-sm text-ink/70"
        >
          نبذة عن المطور
        </label>
        <textarea
          id="developer_bio"
          rows={4}
          value={developerBio}
          onChange={(e) => setDeveloperBio(e.target.value)}
          className="rounded-md border border-ink/20 px-3 py-2 font-body focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="dedication"
          className="font-utility text-sm text-ink/70"
        >
          نص الإهداء
        </label>
        <textarea
          id="dedication"
          rows={3}
          value={dedicationText}
          onChange={(e) => setDedicationText(e.target.value)}
          className="rounded-md border border-ink/20 px-3 py-2 font-body focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        />
      </div>

      {error ? (
        <p className="font-utility text-sm text-maroon" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="font-utility text-sm text-teal" role="status">
          تم حفظ التغييرات بنجاح.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={saving || uploading}
        className="self-start rounded-md bg-ink text-paper font-utility text-sm px-6 py-2 hover:bg-ink/90 transition-colors disabled:opacity-60"
      >
        {uploading
          ? "جارٍ رفع الصور..."
          : saving
            ? "جارٍ الحفظ..."
            : "حفظ التغييرات"}
      </button>
    </form>
  );
}
