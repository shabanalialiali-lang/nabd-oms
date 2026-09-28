import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { getCategory } from "../constants/categories";
import { formatDate } from "../constants/status";
import { colors, radius } from "../constants/theme";
import { StatusPill } from "./ui";

export default function OrderCard({ order }) {
  const cat = getCategory(order.category);
  return (
    <Pressable
      onPress={() => router.push(`/order/${order.id}`)}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
    >
      <View style={[styles.icon, { backgroundColor: cat.color + "22" }]}>
        <Text style={styles.iconText}>{cat.icon}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {order.title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {cat.label}
          {order.city ? ` • ${order.city}` : ""} • {formatDate(order.created_at)}
        </Text>
        <View style={styles.pills}>
          <StatusPill value={order.status} />
          {order.urgency === "urgent" && order.status !== "completed" && order.status !== "cancelled" && (
            <StatusPill value="urgent" />
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
    alignItems: "center",
  },
  icon: { width: 52, height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center", marginEnd: 12 },
  iconText: { fontSize: 26 },
  body: { flex: 1 },
  title: { fontSize: 15, fontWeight: "800", color: colors.ink },
  meta: { fontSize: 12, color: colors.muted, marginTop: 3 },
  pills: { flexDirection: "row", gap: 6, marginTop: 8 },
});
