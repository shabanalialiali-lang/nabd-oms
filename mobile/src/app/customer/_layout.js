import RoleTabs from "../../components/RoleTabs";

export default function CustomerLayout() {
  return (
    <RoleTabs
      role="customer"
      tabs={[
        { name: "index", title: "الخدمات", icon: "🏠" },
        { name: "orders", title: "طلباتي", icon: "📋" },
        { name: "profile", title: "حسابي", icon: "👤" },
      ]}
    />
  );
}
