import { notFound } from "next/navigation";
import { getCapsule, listGenerations } from "@/lib/capsules/server";
import { CapsuleDetailClient } from "@/components/capsules/capsule-detail-client";

export default async function CapsuleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const capsule = await getCapsule(id);
  if (!capsule) return notFound();
  const generations = await listGenerations(id);
  return <CapsuleDetailClient capsule={capsule} generations={generations} />;
}
