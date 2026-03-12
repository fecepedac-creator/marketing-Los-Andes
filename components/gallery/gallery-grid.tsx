"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Generation, ReviewStatus } from "@/types/editorial";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function GalleryGrid({ items }: { items: Generation[] }) {
  const [formatFilter, setFormatFilter] = useState("");
  const [reviewFilter, setReviewFilter] = useState("");
  const [localItems, setLocalItems] = useState(items);

  const filtered = useMemo(
    () =>
      localItems.filter((item) => {
        const byFormat = !formatFilter || item.formatType === formatFilter;
        const byReview = !reviewFilter || item.reviewStatus === reviewFilter;
        return byFormat && byReview;
      }),
    [localItems, formatFilter, reviewFilter]
  );

  const updateReview = async (item: Generation, reviewStatus: ReviewStatus) => {
    const response = await fetch(`/api/capsules/${item.capsuleId}/generations/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewStatus })
    });
    const payload = await response.json();
    if (!response.ok || payload.ok === false) return toast.error(payload.error?.message ?? "Error actualizando revisión");
    setLocalItems((current) => current.map((g) => (g.id === item.id ? { ...g, reviewStatus } : g)));
    toast.success("Review actualizado");
  };

  if (!items.length) return <p className="text-sm text-muted-foreground">No hay generaciones todavía.</p>;

  return (
    <div className="space-y-4">
      <div className="grid gap-2 md:grid-cols-2">
        <select className="h-10 rounded-md border px-3 text-sm" value={formatFilter} onChange={(e) => setFormatFilter(e.target.value)}>
          <option value="">Todos los formatos</option>
          <option value="instagram_4x5">instagram_4x5</option>
          <option value="facebook_1x1">facebook_1x1</option>
        </select>
        <select className="h-10 rounded-md border px-3 text-sm" value={reviewFilter} onChange={(e) => setReviewFilter(e.target.value)}>
          <option value="">Todos los review status</option>
          <option value="pending">pending</option>
          <option value="approved">approved</option>
          <option value="rejected">rejected</option>
        </select>
      </div>

      {!filtered.length ? (
        <p className="text-sm text-muted-foreground">No hay elementos para estos filtros.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="text-base">{item.capsuleTitle ?? item.capsuleId}</CardTitle>
                <p className="text-xs text-muted-foreground">Área: {item.area ?? "Sin área"}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <Image src={item.thumbnailUrl} alt={item.fileName} width={500} height={500} className="h-64 w-full rounded-md object-cover" />
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge>{item.formatType}</Badge>
                  <Badge>v{item.version}</Badge>
                  <Badge>{item.reviewStatus}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{format(new Date(item.generatedAt), "dd/MM/yyyy HH:mm")}</p>
                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm"><a href={item.imageUrl} download={item.fileName}>Descargar</a></Button>
                  <Button asChild size="sm" variant="outline"><Link href={`/capsules/${item.capsuleId}`}>Ver cápsula</Link></Button>
                  <select className="h-9 rounded-md border px-2 text-xs" value={item.reviewStatus} onChange={(e) => updateReview(item, e.target.value as ReviewStatus)}>
                    <option value="pending">pending</option>
                    <option value="approved">approved</option>
                    <option value="rejected">rejected</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
