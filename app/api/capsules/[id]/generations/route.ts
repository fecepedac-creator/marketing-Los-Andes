import { NextRequest, NextResponse } from "next/server";
import { listGenerations } from "@/lib/capsules/server";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await listGenerations(id);
  return NextResponse.json({ ok: true, data });
}
