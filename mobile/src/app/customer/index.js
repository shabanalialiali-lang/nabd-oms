import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../lib/auth";
import { Screen } from "../../components/ui";
import { CATEGORIES } from "../../constants/categories";
import { colors, radius } from "../../constants/theme";

export default function CustomerHome() {
  const { profile } = useAuth();
  const [search, setSearch] = useState("");
  const list = CATEGORIES.filter((c) => c.label.includes(search.trim()));
  const firstName = (profile?.full_name || "").split(" ")[0];

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.hello}>أهلًا {firstName} 👋</Text>
        <Text style={styles.heroTitle}>ما الخدمة التي تحتاجها اليوم؟</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="ابحث عن خدمة... (مثال: سباكة)"
          placeholderTextColor="#9FC3C3"
          style={styles.search}
        />
      </View>

      <View style={styles.grid}>
        {list.map((c) => (
          <Pressable
            key={c.id}
            onPress={() => router.push({ pathname: "/new-order", params: { category: c.id } })}
            style={({ pressed }) => [styles.tile, pressed && { transform: [{ scale: 0.97 }] }]}
          >
            <View style={[styles.tileIcon, { backgroundColor: c.color + "22" }]}>
              <Text style={styles.tileEmoji}>{c.icon}</Text>
            </View>
            <Text style={styles.tileLabel} numberOfLines={2}>
              {c.label}
            </Text>
          </Pressable>
        ))}
      </View>
      {list.length === 0 && <Text style={styles.none}>لا توجد خدمة بهذا الاسم — جرّب «أعمال متنوعة»</Text>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.tealDeep, borderRadius: radius.lg, padding: 18, marginBottom: 16 },
  hello: { color: "#CFE6E6", fontSize: 14, fontWeight: "600" },
  heroTitle: { color: "#fff", fontSize: 20, fontWeight: "900", marginTop: 4, marginBottom: 14 },
  search: { backgroundColor: "rgba(255,255,255,0.12)", borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 11, color: "#fff", fontSize: 14 },
  grid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -5 },
  tile: {
    width: "33.333%",
    paddingHorizontal: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  tileIcon: { width: "100%", aspectRatio: 1.15, borderRadius: radius.lg, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  tileEmoji: { fontSize: 34 },
  tileLabel: { fontSize: 13, fontWeight: "700", color: colors.ink, marginTop: 6, textAlign: "center" },
  none: { textAlign: "center", color: colors.muted, marginTop: 20 },
});
