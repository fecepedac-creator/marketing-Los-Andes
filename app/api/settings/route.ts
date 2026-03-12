import { NextRequest, NextResponse } from "next/server";
import { getSettings, saveSettings, uploadLogo } from "@/lib/settings/server";

const MAX_LOGO_SIZE_BYTES = 5 * 1024 * 1024;

export async function GET() {
  const data = await getSettings();
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  const formData = await request.formData();
  const payload = JSON.parse((formData.get("payload") as string) || "{}");
  const logo = formData.get("logo");

  if (logo instanceof File && logo.size > 0) {
    if (!logo.type.startsWith("image/")) {
      return NextResponse.json({ error: "El logo debe ser un archivo de imagen." }, { status: 400 });
    }

    if (logo.size > MAX_LOGO_SIZE_BYTES) {
      return NextResponse.json({ error: "El logo excede el tamaño máximo de 5MB." }, { status: 400 });
    }

    const logoUrl = await uploadLogo(logo);
    payload.logoUrl = logoUrl;
  }

  const saved = await saveSettings(payload);
  return NextResponse.json(saved);
}
