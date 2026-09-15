"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RequestForm() {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", department: "", description: "", priority: "normal" });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from("maintenance_requests").insert({
      title: form.title,
      department: form.department,
      description: form.description,
      priority: form.priority,
      status: "pending",
      created_by: user?.id,
    });

    setLoading(false);
    setForm({ title: "", department: "", description: "", priority: "normal" });
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="bg-tealDeep text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-teal"
      >
        + بلاغ جديد
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-5 mb-5 grid md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <label className="block text-xs font-bold text-gray-500 mb-1">عنوان البلاغ</label>
        <input
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm"
          placeholder="مثال: عطل في وحدة التكييف"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-1">القسم / الموقع</label>
        <input
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm"
          placeholder="مثال: العناية المركزة"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-1">الأولوية</label>
        <select
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm"
        >
          <option value="normal">عادي</option>
          <option value="urgent">طارئ</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="block text-xs font-bold text-gray-500 mb-1">تفاصيل إضافية</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm"
          rows={2}
        />
      </div>
      <div className="md:col-span-2 flex gap-2">
        <button type="submit" disabled={loading} className="bg-tealDeep text-white text-sm font-bold px-4 py-2 rounded-lg disabled:opacity-60">
          {loading ? "جارٍ الحفظ..." : "حفظ البلاغ"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-sm font-bold px-4 py-2 rounded-lg border border-gray-200 text-gray-500">
          إلغاء
        </button>
      </div>
    </form>
  );
}
