import { useCallback, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/auth";
import { useFocusedQuery } from "../../lib/useOrders";
import OrderCard from "../../components/OrderCard";
import { Button, Chip, EmptyState, Loading } from "../../components/ui";
import { getCategory } from "../../constants/categories";
import { colors } from "../../constants/theme";

export default function AvailableJobs() {
  const { profile } = useAuth();
  const trades = profile?.trades || [];
  const [filter, setFilter] = useState("all");
  const [cityOnly, setCityOnly] = useState(!!profile?.city);

  const query = useCallback(() => {
    let q = supabase
      .from("service_orders")
      .select("*")
      .eq("status", "open")
      .is("technician_id", null)
      .in("category", filter === "all" ? trades : [filter])
      .order("urgency", { ascending: false }) // الطارئ أولًا
      .order("created_at", { ascending: false });
    if (cityOnly && profile?.city) q = q.eq("city", profile.city);
    return q;
  }, [filter, cityOnly, trades.join(","), profile?.city]);

  const { data, loading, refreshing, refresh } = useFocusedQuery(query);

  if (trades.length === 0) {
    return (
      <EmptyState icon="🧰" title="لم تحدد مهنك بعد" subtitle="اختر المهن التي تعمل بها لتظهر لك الطلبات المناسبة">
        <Button title="تحديد المهن" onPress={() => router.push("/tech/profile")} style={{ marginTop: 16, alignSelf: "stretch" }} />
      </EmptyState>
    );
  }

  return (
    <FlatList
      style={{ backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 16 }}
      data={loading ? [] : data}
      keyExtractor={(o) => String(o.id)}
      renderItem={({ item }) => <OrderCard order={item} />}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      ListHeaderComponent={
        <View style={styles.filters}>
          <Chip label="كل مهني" selected={filter === "all"} onPress={() => setFilter("all")} />
          {trades.map((t) => {
            const c = getCategory(t);
            return <Chip key={t} icon={c.icon} label={c.label} selected={filter === t} onPress={() => setFilter(t)} />;
          })}
          {!!profile?.city && (
            <Chip label={`📍 ${profile.city} فقط`} selected={cityOnly} onPress={() => setCityOnly((v) => !v)} />
          )}
        </View>
      }
      ListEmptyComponent={
        loading ? (
          <Loading />
        ) : (
          <EmptyState icon="🔔" title="لا توجد طلبات جديدة حاليًا" subtitle="اسحب للأسفل للتحديث — الطلبات الجديدة في مهنك ستظهر هنا" />
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: "row", flexWrap: "wrap", marginBottom: 6 },
});

