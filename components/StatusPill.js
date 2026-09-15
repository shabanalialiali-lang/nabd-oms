const styles = {
  urgent: "bg-red-50 text-pulse",
  normal: "bg-teal-50 text-tealDeep",
  pending: "bg-amber-50 text-amber",
  in_progress: "bg-amber-50 text-amber",
  done: "bg-green-50 text-green",
};

const labels = {
  urgent: "طارئ",
  normal: "عادي",
  pending: "بانتظار الإسناد",
  in_progress: "قيد التنفيذ",
  done: "مكتمل",
};

export default function StatusPill({ value }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-block ${styles[value] || "bg-gray-100 text-gray-500"}`}>
      {labels[value] || value}
    </span>
  );
}
