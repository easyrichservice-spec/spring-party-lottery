export const revalidate = 0;
export const dynamic = "force-dynamic";

import { createServerClient } from "@/lib/supabase";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = createServerClient();

  const { data: tickets, error } = await supabase
    .from("prize_tickets")
    .select("*")
    .order("ticket_no");

  if (error) {
    return <div className="text-red-600 p-6">資料讀取失敗：{error.message}</div>;
  }

  return <DashboardClient tickets={tickets || []} />;
}
