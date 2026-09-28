// جميع المهن المتاحة في التطبيق. لإضافة مهنة جديدة أضف سطرًا هنا فقط.
export const CATEGORIES = [
  { id: "electrical", label: "كهرباء", icon: "⚡", color: "#F2B705" },
  { id: "plumbing", label: "سباكة", icon: "🚿", color: "#2F80ED" },
  { id: "ac", label: "تكييف وتبريد", icon: "❄️", color: "#56CCF2" },
  { id: "electronics", label: "إلكترونيات", icon: "📺", color: "#9B51E0" },
  { id: "appliances", label: "أجهزة منزلية", icon: "🧺", color: "#6FCF97" },
  { id: "carpentry", label: "نجارة", icon: "🪚", color: "#A0522D" },
  { id: "painting", label: "دهانات", icon: "🎨", color: "#EB5757" },
  { id: "tiling", label: "بلاط وسيراميك", icon: "🧱", color: "#C0724A" },
  { id: "gypsum", label: "جبس وديكور", icon: "🏛️", color: "#BDBDBD" },
  { id: "metal", label: "حدادة ولحام", icon: "🔩", color: "#607D8B" },
  { id: "aluminum", label: "ألمنيوم وزجاج", icon: "🪟", color: "#4FC3F7" },
  { id: "locksmith", label: "أقفال ومفاتيح", icon: "🔑", color: "#F2994A" },
  { id: "cctv", label: "كاميرات وشبكات", icon: "📹", color: "#333F48" },
  { id: "satellite", label: "دش ورسيفر", icon: "📡", color: "#828282" },
  { id: "water", label: "خزانات ومضخات", icon: "💧", color: "#2D9CDB" },
  { id: "heaters", label: "سخانات", icon: "🔥", color: "#F2711C" },
  { id: "insulation", label: "عزل مائي وحراري", icon: "🛡️", color: "#27AE60" },
  { id: "solar", label: "طاقة شمسية", icon: "☀️", color: "#F2C94C" },
  { id: "pest", label: "مكافحة حشرات", icon: "🐜", color: "#8D6E63" },
  { id: "cleaning", label: "تنظيف", icon: "🧽", color: "#26A69A" },
  { id: "gardening", label: "حدائق وزراعة", icon: "🌳", color: "#43A047" },
  { id: "moving", label: "نقل أثاث", icon: "🚚", color: "#5C6BC0" },
  { id: "handyman", label: "أعمال متنوعة", icon: "🧰", color: "#0F6E6E" },
];

const byId = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

export function getCategory(id) {
  return byId[id] || { id, label: id, icon: "🛠️", color: "#0F6E6E" };
}
