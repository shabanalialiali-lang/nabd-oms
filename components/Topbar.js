"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Topbar({ userName }) {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const initials = (userName || "؟").trim().slice(0, 2);

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
      <span className="text-sm text-gray-400">مرحبًا، {userName || "مستخدم"}</span>
      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="text-xs font-bold text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50"
        >
          تسجيل الخروج
        </button>
        <div className="w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center text-xs font-bold">
          {initials}
        </div>
      </div>
    </div>
  );
}
