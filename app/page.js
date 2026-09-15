import { redirect } from "next/navigation";

export default function RootPage() {
  // الحماية الفعلية تتم في middleware.js
  redirect("/dashboard");
}
