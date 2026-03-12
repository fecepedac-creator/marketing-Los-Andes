"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { EditorialSettings } from "@/types/editorial";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export function SettingsForm({ initial }: { initial: EditorialSettings }) {
  const [form, setForm] = useState(initial);
  const [logo, setLogo] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const body = new FormData();
    body.set("payload", JSON.stringify(form));
    if (logo) body.set("logo", logo);

    const response = await fetch("/api/settings", { method: "PUT", body });
    if (!response.ok) {
      setSaving(false);
      return toast.error("Error guardando settings");
    }

    const updated = (await response.json()) as EditorialSettings;
    setForm(updated);
    setLogo(null);
    setSaving(false);
    toast.success("Settings guardados");
  };

  return (
    <div className="space-y-4">
      <Textarea value={form.institutionalPromptBase} onChange={(e) => setForm({ ...form, institutionalPromptBase: e.target.value })} />
      <Textarea value={form.instagramFormatBlock} onChange={(e) => setForm({ ...form, instagramFormatBlock: e.target.value })} />
      <Textarea value={form.facebookFormatBlock} onChange={(e) => setForm({ ...form, facebookFormatBlock: e.target.value })} />
      <Textarea value={form.brandNotes} onChange={(e) => setForm({ ...form, brandNotes: e.target.value })} />
      <Input value={form.fileNamingPattern} onChange={(e) => setForm({ ...form, fileNamingPattern: e.target.value })} />

      <div className="space-y-2">
        <p className="text-sm font-medium">Logo oficial actual</p>
        {form.logoUrl ? (
          <Image src={form.logoUrl} alt="Logo Centro Médico Los Andes" width={240} height={80} className="h-20 w-auto rounded border bg-white p-2" />
        ) : (
          <p className="text-sm text-muted-foreground">No hay logo cargado todavía.</p>
        )}
      </div>

      <Input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0] ?? null)} />
      <Button onClick={save} disabled={saving}>{saving ? "Guardando..." : "Guardar configuración editorial"}</Button>
    </div>
  );
}
