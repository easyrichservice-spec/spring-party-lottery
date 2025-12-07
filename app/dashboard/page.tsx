export const revalidate = 0;    
export const dynamic = "force-dynamic";  

import { createServerClient } from "@/lib/supabase";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = createServerClient({ cache: "no-store" });

  const { data: tickets, error } = await supabase
    .from("prize_tickets")
    .select("*");

  if (error) {
    return <div className="text-red-600 p-6">資料讀取失敗：{error.message}</div>;
  }

  return <DashboardClient tickets={tickets || []} />;
}
