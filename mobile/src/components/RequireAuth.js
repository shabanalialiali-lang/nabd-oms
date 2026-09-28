import { Redirect } from "expo-router";
import { useAuth } from "../lib/auth";
import { Loading } from "./ui";

// يعرض الشاشة فقط بعد تحميل الجلسة، ويحوّل غير المسجلين لصفحة الدخول
export default function RequireAuth({ children }) {
  const { session, profile, loading } = useAuth();
  if (loading || (session && !profile)) return <Loading />;
  if (!session) return <Redirect href="/login" />;
  return children;
}
