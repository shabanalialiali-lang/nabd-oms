import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import { supabase } from "../lib/supabase";
import { notify } from "../lib/notify";
import { Button, Card, Field, Screen, SectionTitle, Segmented } from "../components/ui";
import TradePicker from "../components/TradePicker";
import { colors } from "../constants/theme";

export default function Signup() {
  const [accountType, setAccountType] = useState("customer");
  const [form, setForm] = useState({ fullName: "", phone: "", city: "", email: "", password: "" });
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));
  const isTech = accountType === "technician";

  async function handleSignup() {
    setError("");
    if (!form.fullName || !form.email || form.password.length < 6) {
      setError("أكمل الاسم والبريد، وكلمة مرور 6 أحرف على الأقل");
      return;
    }
    if (isTech && trades.length === 0) {
      setError("اختر مهنة واحدة على الأقل");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        data: {
          full_name: form.fullName.trim(),
          phone: form.phone.trim(),
          city: form.city.trim(),
          account_type: accountType,
          trades: isTech ? trades : [],
        },
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (!data.session) {
      notify("تم إنشاء الحساب", "تحقق من بريدك الإلكتروني لتأكيد الحساب ثم سجّل الدخول.");
      router.replace("/login");
      return;
    }
    router.replace("/");
  }

  return (
    <Screen>
      <Segmented
        value={accountType}
        onChange={setAccountType}
        options={[
          { value: "customer", label: "🏠 أحتاج خدمة" },
          { value: "technician", label: "🧰 أنا فني" },
        ]}
      />
      <Card>
        <Field label="الاسم الكامل" value={form.fullName} onChangeText={set("fullName")} placeholder="مثال: محمد أحمد" />
        <Field label="رقم الجوال" value={form.phone} onChangeText={set("phone")} keyboardType="phone-pad" placeholder="05xxxxxxxx" />
        <Field label="المدينة" value={form.city} onChangeText={set("city")} placeholder="مثال: الرياض" />
        <Field label="البريد الإلكتروني" value={form.email} onChangeText={set("email")} autoCapitalize="none" keyboardType="email-address" />
        <Field label="كلمة المرور" value={form.password} onChangeText={set("password")} secureTextEntry placeholder="6 أحرف على الأقل" />
      </Card>

      {isTech && (
        <Card>
          <SectionTitle>المهن التي تعمل بها</SectionTitle>
          <Text style={styles.hint}>ستصلك الطلبات الجديدة في هذه المهن فقط</Text>
          <TradePicker value={trades} onChange={setTrades} />
        </Card>
      )}

      {!!error && <Text style={styles.error}>{error}</Text>}
      <Button title="إنشاء الحساب" onPress={handleSignup} loading={loading} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hint: { fontSize: 12, color: colors.muted, marginBottom: 12 },
  error: { color: colors.pulse, fontWeight: "700", marginBottom: 12, fontSize: 13 },
});
