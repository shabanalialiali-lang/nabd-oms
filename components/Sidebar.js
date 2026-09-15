const items = [
  { label: "لوحة التحكم", href: "/dashboard" },
  { label: "بلاغات الصيانة", href: "/dashboard/requests" },
];

export default function Sidebar() {
  return (
    <aside className="w-56 bg-ink text-gray-300 p-4 hidden md:block">
      <div className="flex items-center gap-2 pb-5 mb-4 border-b border-white/10">
        <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
          <circle cx="20" cy="20" r="19" stroke="#FF6B5B" strokeWidth="2" />
          <path d="M6 21h6l3-9 5 16 4-12 2 5h8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <span className="text-white font-black text-lg">نبـض</span>
      </div>

      <p className="text-[10px] text-gray-500 font-bold px-2 mb-2">عام</p>
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/5 mb-1"
        >
          {item.label}
        </a>
      ))}

      <p className="text-[10px] text-gray-500 font-bold px-2 mt-5 mb-2">قريبًا</p>
      <div className="px-3 py-2 text-sm text-gray-500">إدارة الأصول</div>
      <div className="px-3 py-2 text-sm text-gray-500">الصيانة الدورية</div>
      <div className="px-3 py-2 text-sm text-gray-500">المستودعات</div>
    </aside>
  );
}
