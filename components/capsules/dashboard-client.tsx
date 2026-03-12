"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Capsule, FormatType } from "@/types/editorial";
import { Header } from "@/components/layout/header";
import { CapsulesTable } from "@/components/capsules/capsules-table";

interface GenerationApiResponse {
  ok: boolean;
  data?: { id: string; version: number; formatType: FormatType };
  error?: { message: string };
}

export function DashboardClient({ capsules }: { capsules: Capsule[] }) {
  const [filtered, setFiltered] = useState(capsules);
  const [generatingKey, setGeneratingKey] = useState<string | null>(null);

  const onGenerate = async (capsuleId: string, formatType: FormatType) => {
    const key = `${capsuleId}:${formatType}`;
    setGeneratingKey(key);
    toast.info(`Generando ${formatType === "instagram_4x5" ? "Instagram" : "Facebook"}...`);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ capsuleId, formatType, generatedBy: "admin" })
      });
      const payload = (await response.json()) as GenerationApiResponse;

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error?.message ?? "No se pudo generar imagen");
      }

      toast.success(`Imagen generada (${formatType}) v${payload.data?.version}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error inesperado al generar imagen");
    } finally {
      setGeneratingKey(null);
    }
  };

  return (
    <div>
      <Header title="Dashboard editorial" onSearch={(text) => setFiltered(capsules.filter((c) => [c.title, c.area, c.id].join(" ").toLowerCase().includes(text.toLowerCase())))} />
      <div className="p-6">
        <CapsulesTable data={filtered} onGenerate={onGenerate} generatingKey={generatingKey} />
      </div>
    </div>
  );
}
