import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCapsule, upsertCapsule } from "@/lib/capsules/server";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getCapsule(id);
  if (!data) return NextResponse.json({ ok: false, error: { message: "No encontrado" } }, { status: 404 });
  return NextResponse.json({ ok: true, data });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const saved = await upsertCapsule({ ...body, id });
    return NextResponse.json({ ok: true, data: saved });
  } catch (error) {
    const message = error instanceof z.ZodError ? "Datos de cápsula inválidos." : "No se pudo guardar cápsula.";
    return NextResponse.json({ ok: false, error: { message } }, { status: 400 });
  }
}
