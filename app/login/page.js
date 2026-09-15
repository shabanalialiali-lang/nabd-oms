"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState("login"); // login | signup
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      setNotice("تم إنشاء الحساب. تحقق من بريدك الإلكتروني لتأكيد الحساب ثم سجّل الدخول.");
      setMode("login");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{
        background:
          "radial-gradient(circle at 20% 20%, rgba(15,110,110,0.25), transparent 45%), radial-gradient(circle at 80% 80%, rgba(255,107,91,0.15), transparent 40%), linear-gradient(160deg, #0A2E36 0%, #0E2A33 55%, #0A1F26 100%)",
      }}
    >
      <div className="w-full max-w-sm bg-white rounded-2xl p-9 pt-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-l from-pulse to-teal" />

        <div className="flex items-center gap-2 mb-1">
          <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
            <circle cx="20" cy="20" r="19" stroke="#0F6E6E" strokeWidth="2" />
            <path d="M6 21h6l3-9 5 16 4-12 2 5h8" stroke="#FF6B5B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <span className="font-black text-xl text-tealDeep">نبـض</span>
        </div>
        <p className="text-gray-500 text-sm mb-6">نظام تشغيل وصيانة مرافق المستشفى</p>

        <div className="flex gap-2 mb-5 bg-gray-100 rounded-lg p-1 text-sm font-bold">
          <button
            className={`flex-1 py-2 rounded-md ${mode === "login" ? "bg-white text-tealDeep shadow" : "text-gray-500"}`}
            onClick={() => setMode("login")}
            type="button"
          >
            تسجيل دخول
          </button>
          <button
            className={`flex-1 py-2 rounded-md ${mode === "signup" ? "bg-white text-tealDeep shadow" : "text-gray-500"}`}
            onClick={() => setMode("signup")}
            type="button"
          >
            حساب جديد
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">الاسم الكامل</label>
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm"
                placeholder="م. شعبان علي"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">البريد الإلكتروني</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm"
              placeholder="name@hospital.sa"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">كلمة المرور</label>
            <input
              required
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-pulse text-xs font-bold">{error}</p>}
          {notice && <p className="text-green text-xs font-bold">{notice}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-tealDeep hover:bg-teal transition text-white font-bold text-sm disabled:opacity-60"
          >
            {loading ? "جارٍ التنفيذ..." : mode === "login" ? "تسجيل الدخول ←" : "إنشاء الحساب ←"}
          </button>
        </form>

        <p className="text-center text-[11px] text-gray-400 mt-5">
          متصل بقاعدة بيانات حقيقية عبر Supabase
        </p>
      </div>
    </div>
  );
}
