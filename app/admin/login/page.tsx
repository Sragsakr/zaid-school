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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError("بيانات الدخول غير صحيحة. يرجى المحاولة مرة أخرى.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-lg shadow-sm border border-ink/10 p-8 flex flex-col gap-4"
      >
        <h1 className="font-display text-2xl text-ink text-center mb-2">
          تسجيل دخول الإدارة
        </h1>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="font-utility text-sm text-ink/70">
            البريد الإلكتروني
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-ink/20 px-3 py-2 font-body focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="font-utility text-sm text-ink/70"
          >
            كلمة المرور
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md border border-ink/20 px-3 py-2 font-body focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          />
        </div>

        {error ? (
          <p className="font-utility text-sm text-maroon" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-md bg-ink text-paper font-utility py-2 hover:bg-ink/90 transition-colors disabled:opacity-60"
        >
          {loading ? "جارٍ الدخول..." : "دخول"}
        </button>
      </form>
    </div>
  );
}
