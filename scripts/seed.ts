import "dotenv/config";
import seedData from "../data/capsules-demo.json";
import { ensureInitialSettings } from "../lib/settings/server";
import { upsertCapsule } from "../lib/capsules/server";

async function main() {
  await ensureInitialSettings();

  for (const item of seedData) {
    await upsertCapsule(item);
  }

  console.log(`Seed completado: ${seedData.length} cápsulas + settings/editorial`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
