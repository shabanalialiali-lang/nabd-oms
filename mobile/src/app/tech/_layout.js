import RoleTabs from "../../components/RoleTabs";

export default function TechLayout() {
  return (
    <RoleTabs
      role="technician"
      tabs={[
        { name: "index", title: "طلبات متاحة", icon: "🔔" },
        { name: "jobs", title: "أعمالي", icon: "🧰" },
        { name: "profile", title: "حسابي", icon: "👤" },
      ]}
    />
  );
}
