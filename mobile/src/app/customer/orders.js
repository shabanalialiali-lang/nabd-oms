import { useCallback } from "react";
import { FlatList, RefreshControl } from "react-native";
import { router } from "expo-router";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/auth";
import { useFocusedQuery } from "../../lib/useOrders";
import OrderCard from "../../components/OrderCard";
import { Button, EmptyState, Loading } from "../../components/ui";
import { colors } from "../../constants/theme";

export default function CustomerOrders() {
  const { user } = useAuth();
  const query = useCallback(
    () => supabase.from("service_orders").select("*").eq("customer_id", user.id).order("created_at", { ascending: false }),
    [user.id]
  );
  const { data, loading, refreshing, refresh } = useFocusedQuery(query);
  if (loading) return <Loading />;

  return (
    <FlatList
      style={{ backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 16 }}
      data={data}
      keyExtractor={(o) => String(o.id)}
      renderItem={({ item }) => <OrderCard order={item} />}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      ListEmptyComponent={
        <EmptyState icon="📋" title="لا توجد طلبات بعد" subtitle="اختر الخدمة التي تحتاجها وسيصلك أقرب فني متاح">
          <Button title="اطلب خدمة الآن" onPress={() => router.push("/customer")} style={{ marginTop: 16, alignSelf: "stretch" }} />
        </EmptyState>
      }
    />
  );
}
