import { useCallback, useEffect, useState } from "react";
import { RefreshControl, SectionList, StyleSheet, Text, View } from "react-native";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/auth";
import { useFocusedQuery } from "../../lib/useOrders";
import OrderCard from "../../components/OrderCard";
import { EmptyState, Loading } from "../../components/ui";
import { colors, radius } from "../../constants/theme";

export default function MyJobs() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  const query = useCallback(
    () => supabase.from("service_orders").select("*").eq("technician_id", user.id).order("updated_at", { ascending: false }),
    [user.id]
  );
  const { data, loading, refreshing, refresh } = useFocusedQuery(query);

  useEffect(() => {
    supabase
      .from("technician_stats")
      .select("*")
      .eq("technician_id", user.id)
      .maybeSingle()
      .then(({ data }) => setStats(data));
  }, [user.id, data]);

  if (loading) return <Loading />;

  const active = data.filter((o) => o.status === "accepted" || o.status === "in_progress");
  const done = data.filter((o) => o.status === "completed");
  const earnings = done.reduce((sum, o) => sum + Number(o.price || 0), 0);
  const sections = [
    { title: `جارية (${active.length})`, data: active },
    { title: `منجزة (${done.length})`, data: done },
  ].filter((s) => s.data.length > 0);

  return (
    <SectionList
      style={{ backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 16 }}
      sections={sections}
      keyExtractor={(o) => String(o.id)}
      renderItem={({ item }) => <OrderCard order={item} />}
      renderSectionHeader={({ section }) => <Text style={styles.section}>{section.title}</Text>}
      stickySectionHeadersEnabled={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      ListHeaderComponent={
        <View style={styles.stats}>
          <Stat label="أعمال منجزة" value={stats?.completed_jobs ?? 0} />
          <Stat label="التقييم" value={stats?.avg_rating ? `${stats.avg_rating} ⭐` : "—"} />
          <Stat label="الدخل" value={earnings.toLocaleString("ar-EG")} />
        </View>
      }
      ListEmptyComponent={<EmptyState icon="🧰" title="لا توجد أعمال بعد" subtitle="اقبل طلبًا من تبويب «طلبات متاحة» ليظهر هنا" />}
    />
  );
}

function Stat({ label, value }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stats: { flexDirection: "row", gap: 10, marginBottom: 8 },
  stat: { flex: 1, backgroundColor: "#fff", borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 14, alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "900", color: colors.tealDeep },
  statLabel: { fontSize: 12, color: colors.muted, marginTop: 4, fontWeight: "600" },
  section: { fontSize: 14, fontWeight: "800", color: colors.muted, marginTop: 12, marginBottom: 8 },
});
