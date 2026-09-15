import { createClient } from "@/lib/supabase/server";
import StatCard from "@/components/StatCard";
import StatusPill from "@/components/StatusPill";
import RequestsChart from "@/components/RequestsChart";

export default async function DashboardPage() {
  const supabase = createClient();

  const { data: requests } = await supabase
    .from("maintenance_requests")
    .select("*")
    .order("created_at", { ascending: false });

  const all = requests || [];
  const total = all.length;
  const done = all.filter((r) => r.status === "done").length;
  const inProgress = all.filter((r) => r.status === "in_progress").length;
  const pending = all.filter((r) => r.status === "pending").length;
  const urgentOpen = all.filter((r) => r.priority === "urgent" && r.status !== "done").length;
  const completion = total ? Math.round((done / total) * 100) : 0;

  const recent = all.slice(0, 6);

  return (
    <div>
      <div
        className="rounded-2xl p-7 text-white mb-6"
        style={{ background: "linear-gradient(120deg, #0A4F52, #0F6E6E 65%, #12807F)" }}
      >
        <h1 className="text-xl font-black mb-1">نظرة عامة على الصيانة</h1>
        <p className="text-sm opacity-85">
          {urgentOpen > 0
            ? `لديك ${urgentOpen} بلاغ طارئ مفتوح يحتاج متابعة`
            : "لا توجد بلاغات طارئة مفتوحة حاليًا"}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="إجمالي البلاغات" value={total} color="#0F6E6E" />
        <StatCard label="نسبة الإنجاز" value={`${completion}٪`} color="#3E8E68" deltaText="محسوبة من كل البلاغات" />
        <StatCard label="طارئة مفتوحة" value={urgentOpen} color="#FF6B5B" deltaText={urgentOpen > 0 ? "تحتاج إسناد فوري" : "لا يوجد"} deltaColor={urgentOpen > 0 ? "#FF6B5B" : "#3E8E68"} />
        <StatCard label="قيد التنفيذ" value={inProgress} color="#E3A23C" />
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200">
          <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
            <h3 className="font-bold text-sm">أحدث البلاغات</h3>
            <a href="/dashboard/requests" className="text-xs text-teal font-bold">عرض الكل ←</a>
          </div>
          {recent.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">لا توجد بلاغات بعد</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs">
                  <th className="text-right px-5 py-2">العنوان</th>
                  <th className="text-right px-5 py-2">القسم</th>
                  <th className="text-right px-5 py-2">الأولوية</th>
                  <th className="text-right px-5 py-2">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.id} className="border-t border-gray-100">
                    <td className="px-5 py-3">{r.title}</td>
                    <td className="px-5 py-3 text-gray-500">{r.department || "—"}</td>
                    <td className="px-5 py-3"><StatusPill value={r.priority} /></td>
                    <td className="px-5 py-3"><StatusPill value={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="font-bold text-sm mb-3">حالة البلاغات</h3>
          <RequestsChart pending={pending} inProgress={inProgress} done={done} />
        </div>
      </div>
    </div>
  );
}
