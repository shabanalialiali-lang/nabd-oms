"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = { pending: "#FF6B5B", in_progress: "#E3A23C", done: "#0F6E6E" };

export default function RequestsChart({ pending, inProgress, done }) {
  const data = [
    { name: "بانتظار الإسناد", value: pending, key: "pending" },
    { name: "قيد التنفيذ", value: inProgress, key: "in_progress" },
    { name: "مكتمل", value: done, key: "done" },
  ];

  const total = pending + inProgress + done;

  return (
    <div className="relative h-40">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={50} outerRadius={70} paddingAngle={2}>
            {data.map((d) => (
              <Cell key={d.key} fill={COLORS[d.key]} stroke="none" />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <b className="text-lg font-mono">{total ? Math.round((done / total) * 100) : 0}٪</b>
        <span className="text-[10px] text-gray-500">نسبة الإنجاز</span>
      </div>
    </div>
  );
}
