import { Redirect } from "expo-router";
import { useAuth } from "../lib/auth";
import { Loading } from "../components/ui";

// نقطة البداية: توجيه المستخدم حسب حالته (زائر / عميل / فني)
export default function Index() {
  const { session, profile, loading } = useAuth();
  if (loading || (session && !profile)) return <Loading />;
  if (!session) return <Redirect href="/login" />;
  return <Redirect href={profile.account_type === "technician" ? "/tech" : "/customer"} />;
}
