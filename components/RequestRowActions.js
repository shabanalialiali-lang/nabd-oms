"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RequestRowActions({ id, status }) {
  const router = useRouter();
  const supabase = createClient();

  async function updateStatus(newStatus) {
    await supabase
      .from("maintenance_requests")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", id);
    router.refresh();
  }

  return (
    <div className="flex gap-1.5">
      {status !== "in_progress" && status !== "done" && (
        <button onClick={() => updateStatus("in_progress")} className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-amber-50 text-amber">
          بدء التنفيذ
        </button>
      )}
      {status !== "done" && (
        <button onClick={() => updateStatus("done")} className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-green-50 text-green">
          إنهاء
        </button>
      )}
    </div>
  );
}
