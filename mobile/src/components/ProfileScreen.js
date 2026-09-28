import { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { router } from "expo-router";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/auth";
import { notify } from "../lib/notify";
import { Button, Card, Field, Screen, SectionTitle } from "./ui";
import TradePicker from "./TradePicker";
import { colors } from "../constants/theme";

export default function ProfileScreen() {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        city: profile.city || "",
        bio: profile.bio || "",
        account_type: profile.account_type,
        trades: profile.trades || [],
      });
    }
  }, [profile]);

  if (!form) return null;
  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));
  const isTech = form.account_type === "technician";

  async function save() {
    if (isTech && form.trades.length === 0) {
      notify("اختر مهنة واحدة على الأقل");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("profiles").update(form).eq("id", user.id);
    setSaving(false);
    if (error) {
      notify("تعذر الحفظ", error.message);
      return;
    }
    const switched = form.account_type !== profile.account_type;
    await refreshProfile();
    if (switched) router.replace("/");
    else notify("تم حفظ البيانات");
  }

  async function logout() {
    await signOut();
    router.replace("/login");
  }

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{(form.full_name || "؟").trim().slice(0, 2)}</Text>
        </View>
        <Text style={styles.name}>{form.full_name || "مستخدم"}</Text>
        <Text style={styles.email}>{profile?.phone || ""}</Text>
      </View>

      <Card>
        <Field label="الاسم الكامل" value={form.full_name} onChangeText={set("full_name")} />
        <Field label="رقم التواصل" value={form.phone} onChangeText={set("phone")} keyboardType="phone-pad" />
        <Field label="المدينة" value={form.city} onChangeText={set("city")} />
        {isTech && <Field label="نبذة عنك وخبرتك" value={form.bio} onChangeText={set("bio")} multiline />}
      </Card>

      <Card>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>حساب فني (استقبال طلبات العملاء)</Text>
          <Switch
            value={isTech}
            onValueChange={(v) => set("account_type")(v ? "technician" : "customer")}
            trackColor={{ true: colors.teal }}
          />
        </View>
        {isTech && (
          <View style={{ marginTop: 12 }}>
            <SectionTitle>المهن التي تعمل بها</SectionTitle>
            <TradePicker value={form.trades} onChange={set("trades")} />
          </View>
        )}
      </Card>

      <Button title="حفظ التعديلات" onPress={save} loading={saving} />
      <Button title="تسجيل الخروج" variant="danger" onPress={logout} style={{ marginTop: 10 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "center", marginBottom: 16 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontSize: 24, fontWeight: "800" },
  name: { fontSize: 18, fontWeight: "900", color: colors.ink, marginTop: 10 },
  email: { fontSize: 13, color: colors.muted, marginTop: 2 },
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  switchLabel: { fontSize: 14, fontWeight: "700", color: colors.ink, flex: 1 },
});
