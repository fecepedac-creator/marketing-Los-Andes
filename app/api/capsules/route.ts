import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { listCapsules, upsertCapsule } from "@/lib/capsules/server";
import { capsuleFiltersSchema } from "@/schemas/api-schema";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const filters = capsuleFiltersSchema.parse({
      search: params.get("search") ?? undefined,
      area: params.get("area") ?? undefined,
      creativeStatus: params.get("creativeStatus") ?? undefined,
      publicationStatus: params.get("publicationStatus") ?? undefined
    });

    const data = await listCapsules(filters);
    return NextResponse.json({ ok: true, data });
  } catch {
    return NextResponse.json({ ok: false, error: { message: "Filtros inválidos." } }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const saved = await upsertCapsule(body);
    return NextResponse.json({ ok: true, data: saved });
  } catch (error) {
    const message = error instanceof z.ZodError ? "Datos de cápsula inválidos." : "No se pudo crear cápsula.";
    return NextResponse.json({ ok: false, error: { message } }, { status: 400 });
  }
}
