"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DeleteNewsButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`هل تريد حذف الخبر "${title}"؟`)) return;

    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase.from("news").delete().eq("id", id);
    setDeleting(false);

    if (error) {
      alert("تعذر حذف الخبر. حاول مرة أخرى.");
      return;
    }

    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-maroon hover:underline disabled:opacity-60"
    >
      {deleting ? "جارٍ الحذف..." : "حذف"}
    </button>
  );
}
