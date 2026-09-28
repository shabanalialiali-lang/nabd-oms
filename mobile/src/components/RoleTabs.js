import { Redirect, Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../lib/auth";
import { Loading } from "./ui";
import TabIcon from "./TabIcon";
import { colors } from "../constants/theme";

// شريط التبويبات السفلي مع حماية: يجب تسجيل الدخول وبالدور الصحيح
export default function RoleTabs({ role, tabs }) {
  const { session, profile, loading } = useAuth();
  const insets = useSafeAreaInsets();
  if (loading || (session && !profile)) return <Loading />;
  if (!session) return <Redirect href="/login" />;
  if ((profile.account_type === "technician") !== (role === "technician")) return <Redirect href="/" />;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tealDeep,
        tabBarInactiveTintColor: colors.faint,
        // ارتفاع أكبر قليلًا من الافتراضي ليتسع للأيقونة والنص العربي
        tabBarStyle: { height: 60 + insets.bottom, paddingTop: 6 },
        tabBarLabelStyle: { fontSize: 11, lineHeight: 14, fontWeight: "700" },
        headerTitleStyle: { fontWeight: "800", color: colors.ink },
        headerShadowVisible: false,
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      {tabs.map((t) => (
        <Tabs.Screen
          key={t.name}
          name={t.name}
          options={{ title: t.title, tabBarIcon: ({ focused }) => <TabIcon icon={t.icon} focused={focused} /> }}
        />
      ))}
    </Tabs>
  );
}
