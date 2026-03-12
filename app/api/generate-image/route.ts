import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminStorage } from "@/lib/firebase/admin";
import { OpenAIImageProvider } from "@/lib/image-generation/openai";
import { buildPrompt } from "@/lib/image-generation/prompt-builder";
import { getSettings } from "@/lib/settings/server";
import { buildFileName } from "@/lib/utils/file-naming";
import { createGeneration, getCapsule, getNextVersion } from "@/lib/capsules/server";
import { generateImageRequestSchema } from "@/schemas/api-schema";

const TIMEOUT_MS = 60_000;
const URL_EXPIRATION = "03-01-2035";

function errorResponse(message: string, status: number, code: string) {
  return NextResponse.json({ ok: false, error: { code, message } }, { status });
}

export async function POST(request: NextRequest) {
  try {
    const parsed = generateImageRequestSchema.parse(await request.json());

    const capsule = await getCapsule(parsed.capsuleId);
    if (!capsule) {
      return errorResponse("Cápsula no encontrada.", 404, "CAPSULE_NOT_FOUND");
    }

    const settings = await getSettings();
    const prompt = buildPrompt(capsule, parsed.formatType, settings);
    const version = await getNextVersion(parsed.capsuleId, parsed.formatType);
    const fileName = buildFileName(settings.fileNamingPattern, capsule, parsed.formatType, version);

    const provider = new OpenAIImageProvider();
    const size = parsed.formatType === "instagram_4x5" ? "1024x1536" : "1024x1024";
    const generated = await Promise.race([
      provider.generate(prompt, size),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Tiempo de espera agotado al generar imagen")), TIMEOUT_MS))
    ]);

    const buffer = Buffer.from(generated.imageBase64, "base64");
    const posterPath = `capsules/${parsed.capsuleId}/${parsed.formatType}/v${version}.png`;
    const thumbnailPath = `capsules/${parsed.capsuleId}/${parsed.formatType}/thumb_v${version}.png`;

    const posterFile = adminStorage.file(posterPath);
    await posterFile.save(buffer, { metadata: { contentType: generated.mimeType }, resumable: false });

    const thumbnailFile = adminStorage.file(thumbnailPath);
    await thumbnailFile.save(buffer, { metadata: { contentType: generated.mimeType }, resumable: false });

    const [imageUrl] = await posterFile.getSignedUrl({ action: "read", expires: URL_EXPIRATION });
    const [thumbnailUrl] = await thumbnailFile.getSignedUrl({ action: "read", expires: URL_EXPIRATION });

    const generation = await createGeneration({
      capsuleId: parsed.capsuleId,
      formatType: parsed.formatType,
      version,
      fullPrompt: prompt,
      imageUrl,
      thumbnailUrl,
      fileName,
      generatedBy: parsed.generatedBy,
      reviewStatus: "pending",
      reviewComment: ""
    });

    return NextResponse.json({ ok: true, data: generation });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Payload inválido para generar imagen.", 400, "INVALID_PAYLOAD");
    }

    return errorResponse(error instanceof Error ? error.message : "Error inesperado al generar imagen.", 500, "GENERATION_ERROR");
  }
}
