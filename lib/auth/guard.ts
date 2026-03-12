import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth/session";

export async function requireAdmin() {
  const decoded = await verifySession();
  if (!decoded || decoded.email !== process.env.ADMIN_EMAIL) {
    redirect("/login");
  }
  return decoded;
}
