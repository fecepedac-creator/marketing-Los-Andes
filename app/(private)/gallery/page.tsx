import { Header } from "@/components/layout/header";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { listCapsules, listGenerations } from "@/lib/capsules/server";

export default async function GalleryPage() {
  const capsules = await listCapsules();
  const all = await Promise.all(
    capsules.map(async (capsule) => {
      const generations = await listGenerations(capsule.id);
      return generations.map((g) => ({ ...g, capsuleTitle: capsule.title, area: capsule.area }));
    })
  );

  const items = all.flat().sort((a, b) => b.generatedAt.localeCompare(a.generatedAt));

  return (
    <div>
      <Header title="Galería de afiches" />
      <div className="p-6"><GalleryGrid items={items} /></div>
    </div>
  );
}
