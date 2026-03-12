import { NextRequest, NextResponse } from "next/server";
import { createSessionCookie } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  const { idToken } = await request.json();
  if (!idToken) return NextResponse.json({ error: "idToken requerido" }, { status: 400 });
  await createSessionCookie(idToken);
  return NextResponse.json({ ok: true });
}
