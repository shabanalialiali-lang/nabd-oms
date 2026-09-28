import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";
import { Button, Field, Screen } from "../components/ui";
import { colors } from "../constants/theme";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      return;
    }
    router.replace("/");
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.tealDeep }}>
      <Screen style={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.logo}>🛠️</Text>
          <Text style={styles.brand}>نبض خدمات</Text>
          <Text style={styles.tagline}>كل خدمات الصيانة في مكان واحد{"\n"}كهرباء • سباكة • تكييف • إلكترونيات والمزيد</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>تسجيل الدخول</Text>
          <Field label="البريد الإلكتروني" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="name@example.com" />
          <Field label="كلمة المرور" value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" />
          {!!error && <Text style={styles.error}>{error}</Text>}
          <Button title="دخول" onPress={handleLogin} loading={loading} disabled={!email || !password} />
          <Link href="/signup" style={styles.link}>
            ليس لديك حساب؟ <Text style={{ fontWeight: "800" }}>أنشئ حسابًا جديدًا</Text>
          </Link>
        </View>
      </Screen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, justifyContent: "center" },
  hero: { alignItems: "center", marginBottom: 24 },
  logo: { fontSize: 56 },
  brand: { fontSize: 28, fontWeight: "900", color: colors.tealDeep, marginTop: 6 },
  tagline: { fontSize: 13, color: colors.muted, textAlign: "center", marginTop: 6, lineHeight: 21 },
  card: { backgroundColor: "#fff", borderRadius: 20, padding: 20, borderWidth: 1, borderColor: colors.border },
  title: { fontSize: 18, fontWeight: "900", color: colors.ink, marginBottom: 16 },
  error: { color: colors.pulse, fontWeight: "700", marginBottom: 10, fontSize: 13 },
  link: { color: colors.teal, textAlign: "center", marginTop: 16, fontSize: 14 },
});
