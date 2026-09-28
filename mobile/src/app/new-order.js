import { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { supabase } from "../lib/supabase";
import RequireAuth from "../components/RequireAuth";
import { useAuth } from "../lib/auth";
import { notify } from "../lib/notify";
import { Button, Card, Chip, Field, Screen, SectionTitle } from "../components/ui";
import { CATEGORIES, getCategory } from "../constants/categories";
import { PREFERRED_TIMES } from "../constants/status";
import { colors } from "../constants/theme";

export default function NewOrderScreen() {
  return (
    <RequireAuth>
      <NewOrder />
    </RequireAuth>
  );
}

function NewOrder() {
  const params = useLocalSearchParams();
  const { profile } = useAuth();
  const [category, setCategory] = useState(params.category || CATEGORIES[0].id);
  const [form, setForm] = useState({
    title: "",
    description: "",
    city: profile?.city || "",
    address: "",
    phone: profile?.phone || "",
    time: PREFERRED_TIMES[0],
  });
  const [urgent, setUrgent] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));
  const cat = getCategory(category);

  async function submit() {
    if (!form.title.trim()) {
      notify("اكتب وصفًا مختصرًا للمشكلة");
      return;
    }
    if (!form.phone.trim()) {
      notify("رقم الجوال مطلوب ليتواصل معك الفني");
      return;
    }
    setLoading(true);
    const { data: id, error } = await supabase.rpc("create_service_order", {
      p_category: category,
      p_title: form.title.trim(),
      p_description: form.description.trim() || null,
      p_city: form.city.trim() || null,
      p_address: form.address.trim() || null,
      p_contact_phone: form.phone.trim(),
      p_preferred_time: form.time,
      p_urgency: urgent ? "urgent" : "normal",
    });
    setLoading(false);
    if (error) {
      notify("تعذر إرسال الطلب", error.message);
      return;
    }
    router.replace(`/order/${id}`);
  }

  return (
    <Screen>
      <View style={[styles.banner, { backgroundColor: cat.color + "22" }]}>
        <Text style={styles.bannerIcon}>{cat.icon}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerLabel}>نوع الخدمة</Text>
          <Text style={styles.bannerTitle}>{cat.label}</Text>
        </View>
      </View>

      <Card>
        <Field label="ما المشكلة؟" value={form.title} onChangeText={set("title")} placeholder={`مثال: ${examples[category] || "وصف مختصر للعطل"}`} />
        <Field label="تفاصيل إضافية (اختياري)" value={form.description} onChangeText={set("description")} multiline placeholder="نوع الجهاز، منذ متى بدأ العطل، أي ملاحظات..." />
      </Card>

      <Card>
        <SectionTitle>الموقع والتواصل</SectionTitle>
        <Field label="المدينة" value={form.city} onChangeText={set("city")} placeholder="مثال: الرياض" />
        <Field label="الحي / العنوان" value={form.address} onChangeText={set("address")} placeholder="يظهر للفني فقط بعد قبول الطلب" />
        <Field label="رقم الجوال" value={form.phone} onChangeText={set("phone")} keyboardType="phone-pad" />
      </Card>

      <Card>
        <SectionTitle>الموعد المناسب</SectionTitle>
        <View style={styles.row}>
          {PREFERRED_TIMES.map((t) => (
            <Chip key={t} label={t} selected={form.time === t} onPress={() => set("time")(t)} />
          ))}
        </View>
        <View style={styles.urgent}>
          <View style={{ flex: 1 }}>
            <Text style={styles.urgentTitle}>🚨 طلب طارئ</Text>
            <Text style={styles.urgentSub}>يظهر في أعلى قائمة الفنيين</Text>
          </View>
          <Switch value={urgent} onValueChange={setUrgent} trackColor={{ true: colors.pulse }} />
        </View>
      </Card>

      <Button title="إرسال الطلب" onPress={submit} loading={loading} />
    </Screen>
  );
}

const examples = {
  electrical: "انقطاع الكهرباء عن غرفة النوم",
  plumbing: "تسريب مياه تحت المغسلة",
  ac: "المكيف لا يبرد",
  electronics: "الشاشة لا تعرض صورة",
  appliances: "الغسالة لا تصرف الماء",
  carpentry: "باب الخزانة مكسور",
  painting: "دهان صالة 4×5 متر",
};

const styles = StyleSheet.create({
  banner: { flexDirection: "row", alignItems: "center", borderRadius: 18, padding: 16, marginBottom: 12 },
  bannerIcon: { fontSize: 40, marginEnd: 12 },
  bannerLabel: { fontSize: 12, color: colors.muted, fontWeight: "600" },
  bannerTitle: { fontSize: 20, fontWeight: "900", color: colors.ink },
  row: { flexDirection: "row", flexWrap: "wrap" },
  urgent: { flexDirection: "row", alignItems: "center", marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border },
  urgentTitle: { fontSize: 14, fontWeight: "800", color: colors.ink },
  urgentSub: { fontSize: 12, color: colors.muted, marginTop: 2 },
});
