import { useEffect } from "react";
import { DevSettings, I18nManager, Platform } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Updates from "expo-updates";
import { AuthProvider } from "../lib/auth";
import { colors } from "../constants/theme";

// التطبيق عربي بالكامل: نفرض اتجاه من اليمين لليسار ثم نعيد التحميل مرة واحدة
if (Platform.OS !== "web" && !I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
  if (__DEV__) DevSettings.reload();
  else Updates.reloadAsync().catch(() => {});
}

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === "web") {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";
    }
  }, []);

  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#fff" },
          headerTintColor: colors.tealDeep,
          headerTitleStyle: { fontWeight: "800", color: colors.ink },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ title: "حساب جديد" }} />
        <Stack.Screen name="customer" options={{ headerShown: false }} />
        <Stack.Screen name="tech" options={{ headerShown: false }} />
        <Stack.Screen name="new-order" options={{ title: "طلب خدمة جديد" }} />
        <Stack.Screen name="order/[id]" options={{ title: "تفاصيل الطلب" }} />
      </Stack>
    </AuthProvider>
  );
}
