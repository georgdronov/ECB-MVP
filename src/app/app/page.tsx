import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/user";
import { getChatbotForUser, getWorkspaceSummary } from "@/lib/db/queries";
import { DashboardLive } from "@/components/dashboard/dashboard-live";

export default async function AppPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const summary = getWorkspaceSummary(user.id);
  const bot = getChatbotForUser(user.id);

  return <DashboardLive initialSummary={summary} bot={bot} />;
}
