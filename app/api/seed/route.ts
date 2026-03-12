import { NextResponse } from "next/server";
import seedData from "@/data/capsules-demo.json";
import { ensureInitialSettings } from "@/lib/settings/server";
import { upsertCapsule } from "@/lib/capsules/server";

export async function POST() {
  await ensureInitialSettings();
  await Promise.all(seedData.map((capsule) => upsertCapsule(capsule)));
  return NextResponse.json({ ok: true, capsules: seedData.length, settings: "initialized" });
}
