import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default async function DashboardLayout({ children }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  return (
    <div className="grid md:grid-cols-[224px_1fr] min-h-screen">
      <Sidebar />
      <div className="flex flex-col min-w-0">
        <Topbar userName={profile?.full_name || user.email} />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
