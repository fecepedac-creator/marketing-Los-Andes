"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Capsule, FormatType, Generation, ReviewStatus } from "@/types/editorial";
import { CapsuleForm } from "@/components/capsules/capsule-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CapsuleInput } from "@/schemas/capsule-schema";

interface ApiResponse<T> {
  ok?: boolean;
  data?: T;
  error?: { message?: string };
}

export function CapsuleDetailClient({ capsule, generations: initialGenerations }: { capsule: Capsule; generations: Generation[] }) {
  const [generations, setGenerations] = useState(initialGenerations);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState<FormatType | null>(null);
  const latestTwo = useMemo(() => generations.slice(0, 2), [generations]);

  const refreshGenerations = async () => {
    const response = await fetch(`/api/capsules/${capsule.id}/generations`);
    const payload = (await response.json()) as ApiResponse<Generation[]> | Generation[];
    const data = Array.isArray(payload) ? payload : payload.data;
    if (response.ok && data) setGenerations(data);
  };

  const save = async (data: CapsuleInput) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/capsules/${capsule.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const payload = (await response.json()) as ApiResponse<Capsule>;
      if (!response.ok || payload.ok === false) throw new Error(payload.error?.message ?? "Error al guardar");
      toast.success("Cápsula guardada");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const generate = async (formatType: FormatType) => {
    setGenerating(formatType);
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ capsuleId: capsule.id, formatType, generatedBy: "admin" })
      });
      const payload = (await response.json()) as ApiResponse<Generation>;
      if (!response.ok || payload.ok === false) throw new Error(payload.error?.message ?? "Error al generar");
      toast.success(`Nueva versión ${formatType} creada`);
      await refreshGenerations();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al generar");
    } finally {
      setGenerating(null);
    }
  };

  const updateReview = async (generationId: string, reviewStatus: ReviewStatus) => {
    const response = await fetch(`/api/capsules/${capsule.id}/generations/${generationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewStatus })
    });
    const payload = (await response.json()) as ApiResponse<{ ok: true }>;
    if (!response.ok || payload.ok === false) return toast.error(payload.error?.message ?? "No se pudo actualizar revisión");
    toast.success("Estado de revisión actualizado");
    await refreshGenerations();
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader><CardTitle>Ficha de cápsula {capsule.id}</CardTitle></CardHeader>
        <CardContent>
          <CapsuleForm defaultValues={capsule} onSubmit={save} />
          {saving && <p className="mt-3 text-sm text-muted-foreground">Guardando cambios...</p>}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button disabled={!!generating} onClick={() => generate("instagram_4x5")}>{generating === "instagram_4x5" ? "Generando Instagram..." : "Generar Instagram"}</Button>
        <Button variant="outline" disabled={!!generating} onClick={() => generate("facebook_1x1")}>{generating === "facebook_1x1" ? "Generando Facebook..." : "Generar Facebook"}</Button>
      </div>


      <Card>
        <CardHeader><CardTitle>Datos editoriales importados</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>Origen:</strong> {capsule.source}</p>
          <p><strong>Nombre sugerido:</strong> {capsule.suggestedFileName || "—"}</p>
          <p><strong>Prompt Instagram:</strong></p>
          <p className="whitespace-pre-wrap rounded bg-slate-50 p-2 text-xs text-slate-700">{capsule.promptInstagram || "—"}</p>
          <p><strong>Prompt Facebook:</strong></p>
          <p className="whitespace-pre-wrap rounded bg-slate-50 p-2 text-xs text-slate-700">{capsule.promptFacebook || "—"}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Preview últimas generaciones</CardTitle></CardHeader>
        <CardContent>
          {!latestTwo.length ? (
            <p className="text-sm text-muted-foreground">Todavía no hay piezas generadas para esta cápsula.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {latestTwo.map((g) => (
                <div key={g.id} className="space-y-2">
                  <Image src={g.thumbnailUrl} alt={g.fileName} width={500} height={500} className="h-48 w-full rounded object-cover" />
                  <p className="text-xs text-muted-foreground">{g.formatType} · v{g.version}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Historial de generaciones</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {!generations.length ? (
            <p className="text-sm text-muted-foreground">Sin generaciones todavía.</p>
          ) : generations.map((g) => (
            <div key={g.id} className="rounded border p-3 text-sm">
              <p className="font-medium">{g.formatType} · v{g.version} · revisión: {g.reviewStatus}</p>
              <p className="text-xs text-muted-foreground">{new Date(g.generatedAt).toLocaleString("es-CL")}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(g.fullPrompt); toast.success("Prompt copiado"); }}>Copiar prompt final</Button>
                <Button size="sm" asChild><a href={g.imageUrl} download={g.fileName}>Descargar</a></Button>
                <select className="h-9 rounded-md border px-2 text-xs" value={g.reviewStatus} onChange={(e) => updateReview(g.id, e.target.value as ReviewStatus)}>
                  <option value="pending">pending</option>
                  <option value="approved">approved</option>
                  <option value="rejected">rejected</option>
                </select>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
