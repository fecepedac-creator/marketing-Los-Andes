import { listCapsules } from "@/lib/capsules/server";
import { DashboardClient } from "@/components/capsules/dashboard-client";

export default async function DashboardPage() {
  const capsules = await listCapsules();
  return <DashboardClient capsules={capsules} />;
}
