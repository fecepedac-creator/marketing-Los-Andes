import { adminDb, adminStorage } from "@/lib/firebase/admin";
import { defaultEditorialSettings } from "@/lib/settings/defaults";
import { EditorialSettings } from "@/types/editorial";
import { settingsSchema } from "@/schemas/settings-schema";
import { toSettingsApp, toSettingsDoc } from "@/lib/firebase/mappers";
import { EditorialSettingsDoc } from "@/types/firestore";

const settingsRef = adminDb.collection("settings").doc("editorial");
const URL_EXPIRATION = "03-01-2035";

export async function getSettings(): Promise<EditorialSettings> {
  const snap = await settingsRef.get();
  if (!snap.exists) {
    const seedDoc = toSettingsDoc(defaultEditorialSettings);
    await settingsRef.set(seedDoc);
    return toSettingsApp(seedDoc);
  }
  return toSettingsApp(snap.data() as EditorialSettingsDoc);
}

export async function saveSettings(input: unknown): Promise<EditorialSettings> {
  const parsed = settingsSchema.parse(input);
  const doc = toSettingsDoc({
    institutionalPromptBase: parsed.institutionalPromptBase,
    instagramFormatBlock: parsed.instagramFormatBlock,
    facebookFormatBlock: parsed.facebookFormatBlock,
    brandNotes: parsed.brandNotes,
    logoUrl: parsed.logoUrl,
    fileNamingPattern: parsed.fileNamingPattern
  });
  await settingsRef.set(doc, { merge: true });
  return toSettingsApp(doc);
}

export async function uploadLogo(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const destination = adminStorage.file("branding/logo-main.png");
  await destination.save(buffer, { metadata: { contentType: file.type || "image/png" }, resumable: false });
  const [logoUrl] = await destination.getSignedUrl({ action: "read", expires: URL_EXPIRATION });
  return logoUrl;
}

export async function ensureInitialSettings() {
  const current = await settingsRef.get();
  if (!current.exists) {
    await settingsRef.set(toSettingsDoc(defaultEditorialSettings));
  }
}
