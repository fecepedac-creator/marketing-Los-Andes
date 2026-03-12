import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { updateGenerationReview } from "@/lib/capsules/server";

const payloadSchema = z.object({
  reviewStatus: z.enum(["pending", "approved", "rejected"]),
  reviewComment: z.string().optional()
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; generationId: string }> }
) {
  try {
    const { id, generationId } = await params;
    const payload = payloadSchema.parse(await request.json());
    await updateGenerationReview(id, generationId, payload.reviewStatus, payload.reviewComment ?? "");
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof z.ZodError ? "Estado de revisión inválido." : "No se pudo actualizar revisión.";
    return NextResponse.json({ ok: false, error: { message } }, { status: 400 });
  }
}
