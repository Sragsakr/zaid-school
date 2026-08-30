"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault(); setError(null); setLoading(true);
    const { error: signInError } = await createClient().auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) { setError("بيانات الدخول غير صحيحة. يرجى المحاولة مرة أخرى."); return; }
    router.push("/admin"); router.refresh();
  }

  return <main className="flex min-h-screen items-center justify-center bg-ink px-4 py-10"><form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-5 rounded-2xl border border-paper/10 bg-paper p-6 shadow-2xl sm:p-8"><div className="text-center"><p className="font-utility text-sm font-semibold text-maroon">البوابة الداخلية</p><h1 className="mt-1 font-display text-3xl text-ink">تسجيل دخول الإدارة</h1><p className="mt-2 font-body text-sm text-ink/60">أدخل بيانات الحساب لإدارة أخبار المدرسة.</p></div><div className="flex flex-col gap-2"><label htmlFor="email" className="font-utility text-sm text-ink/75">البريد الإلكتروني</label><input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="min-h-11 rounded-lg border border-ink/15 bg-white px-3 font-body focus-visible:ring-2 focus-visible:ring-gold" /></div><div className="flex flex-col gap-2"><label htmlFor="password" className="font-utility text-sm text-ink/75">كلمة المرور</label><input id="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="min-h-11 rounded-lg border border-ink/15 bg-white px-3 font-body focus-visible:ring-2 focus-visible:ring-gold" /></div>{error ? <p className="rounded-lg bg-maroon/10 px-3 py-2 font-utility text-sm text-maroon" role="alert">{error}</p> : null}<button type="submit" disabled={loading} className="min-h-11 rounded-lg bg-ink font-utility text-sm text-paper transition-colors hover:bg-maroon disabled:opacity-60">{loading ? "جارٍ الدخول..." : "دخول آمن"}</button></form></main>;
}
