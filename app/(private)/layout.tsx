import { AppShell } from "@/components/layout/app-shell";
import { requireAdmin } from "@/lib/auth/guard";

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <AppShell>{children}</AppShell>;
}
