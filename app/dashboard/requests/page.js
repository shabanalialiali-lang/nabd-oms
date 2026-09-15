import { createClient } from "@/lib/supabase/server";
import StatusPill from "@/components/StatusPill";
import RequestForm from "@/components/RequestForm";
import RequestRowActions from "@/components/RequestRowActions";

export default async function RequestsPage() {
  const supabase = createClient();

  const { data: requests } = await supabase
    .from("maintenance_requests")
    .select("*")
    .order("created_at", { ascending: false });

  const all = requests || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-lg font-black">بلاغات الصيانة</h1>
        <RequestForm />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {all.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-12">لا توجد بلاغات مسجلة بعد</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-xs bg-gray-50">
                <th className="text-right px-5 py-3">العنوان</th>
                <th className="text-right px-5 py-3">القسم</th>
                <th className="text-right px-5 py-3">الأولوية</th>
                <th className="text-right px-5 py-3">تاريخ الإنشاء</th>
                <th className="text-right px-5 py-3">الحالة</th>
                <th className="text-right px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {all.map((r) => (
                <tr key={r.id} className="border-t border-gray-100">
                  <td className="px-5 py-3">
                    <div className="font-bold">{r.title}</div>
                    {r.description && <div className="text-xs text-gray-400 mt-0.5">{r.description}</div>}
                  </td>
                  <td className="px-5 py-3 text-gray-500">{r.department || "—"}</td>
                  <td className="px-5 py-3"><StatusPill value={r.priority} /></td>
                  <td className="px-5 py-3 font-mono text-xs text-gray-500">
                    {new Date(r.created_at).toLocaleDateString("ar-EG")}
                  </td>
                  <td className="px-5 py-3"><StatusPill value={r.status} /></td>
                  <td className="px-5 py-3"><RequestRowActions id={r.id} status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
