export default function StatCard({ label, value, color, deltaText, deltaColor }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-gray-500">{label}</span>
        <span className="w-7 h-7 rounded-lg" style={{ backgroundColor: color }} />
      </div>
      <div className="text-2xl font-black font-mono">{value}</div>
      {deltaText && (
        <div className="text-[11px] font-bold mt-1" style={{ color: deltaColor || "#3E8E68" }}>
          {deltaText}
        </div>
      )}
    </div>
  );
}
