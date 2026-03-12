"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { capsuleBaseSchema, CapsuleInput } from "@/schemas/capsule-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function CapsuleForm({ defaultValues, onSubmit }: { defaultValues: CapsuleInput; onSubmit: (data: CapsuleInput) => Promise<void> }) {
  const form = useForm<CapsuleInput>({ resolver: zodResolver(capsuleBaseSchema), defaultValues });

  return (
    <form className="grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
      <Input {...form.register("id")} placeholder="ID" disabled />
      <Input {...form.register("area")} placeholder="Área" />
      <Input {...form.register("title")} className="md:col-span-2" placeholder="Título" />
      <Textarea {...form.register("point1")} placeholder="Punto 1" />
      <Textarea {...form.register("point2")} placeholder="Punto 2" />
      <Textarea {...form.register("point3")} className="md:col-span-2" placeholder="Punto 3" />
      <Input {...form.register("cta")} className="md:col-span-2" placeholder="CTA" />
      <Textarea {...form.register("visualScene")} className="md:col-span-2" placeholder="Escena visual" />
      <Textarea {...form.register("editorialNote")} className="md:col-span-2" placeholder="Nota editorial" />
      <Input {...form.register("allowedSources.0")} placeholder="Fuente permitida principal" />
      <Input type="date" {...form.register("suggestedPublishDate")} />
      <Textarea {...form.register("promptInstagram")} className="md:col-span-2" placeholder="Prompt Instagram específico (opcional)" />
      <Textarea {...form.register("promptFacebook")} className="md:col-span-2" placeholder="Prompt Facebook específico (opcional)" />
      <Input {...form.register("suggestedFileName")} className="md:col-span-2" placeholder="Nombre sugerido de archivo" />
      <Input {...form.register("source")} disabled className="md:col-span-2" placeholder="Origen" />
      <select className="rounded-md border px-3 py-2" {...form.register("creativeStatus")}>
        <option value="draft">draft</option><option value="ready">ready</option><option value="generated">generated</option><option value="approved">approved</option><option value="rejected">rejected</option>
      </select>
      <select className="rounded-md border px-3 py-2" {...form.register("publicationStatus")}>
        <option value="pending">pending</option><option value="scheduled">scheduled</option><option value="published">published</option>
      </select>
      <label className="col-span-2 flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("requiresEpiValidation")} /> Requiere validación epidemiológica</label>
      {Object.keys(form.formState.errors).length > 0 && (
        <p className="col-span-2 text-sm text-red-600">Revisa los campos obligatorios antes de guardar.</p>
      )}
      <div className="col-span-2"><Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Guardando..." : "Guardar cápsula"}</Button></div>
    </form>
  );
}
