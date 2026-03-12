"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Capsule, FormatType } from "@/types/editorial";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Props {
  data: Capsule[];
  generatingKey?: string | null;
  onGenerate: (capsuleId: string, format: FormatType) => Promise<void>;
}

const badgeByStatus: Record<string, string> = {
  draft: "bg-slate-100",
  ready: "bg-blue-100",
  generated: "bg-amber-100",
  approved: "bg-emerald-100",
  rejected: "bg-rose-100",
  pending: "bg-slate-100",
  scheduled: "bg-purple-100",
  published: "bg-emerald-100"
};

export function CapsulesTable({ data, onGenerate, generatingKey }: Props) {
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [creativeFilter, setCreativeFilter] = useState("");

  const areas = useMemo(() => Array.from(new Set(data.map((c) => c.area))).sort(), [data]);

  const filtered = useMemo(
    () =>
      data.filter((c) => {
        const matchSearch = [c.title, c.area, c.id].join(" ").toLowerCase().includes(search.toLowerCase());
        const matchArea = !areaFilter || c.area === areaFilter;
        const matchCreative = !creativeFilter || c.creativeStatus === creativeFilter;
        return matchSearch && matchArea && matchCreative;
      }),
    [data, search, areaFilter, creativeFilter]
  );

  const columns: ColumnDef<Capsule>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "area", header: "Área" },
    { accessorKey: "title", header: "Título" },
    { accessorKey: "source", header: "Origen", cell: ({ row }) => <Badge>{row.original.source}</Badge> },
    {
      accessorKey: "suggestedPublishDate",
      header: "Fecha",
      cell: ({ row }) => (row.original.suggestedPublishDate ? new Date(row.original.suggestedPublishDate).toLocaleDateString("es-CL") : "—")
    },
    { accessorKey: "creativeStatus", header: "Estado creativo", cell: ({ row }) => <Badge className={badgeByStatus[row.original.creativeStatus]}>{row.original.creativeStatus}</Badge> },
    { accessorKey: "publicationStatus", header: "Publicación", cell: ({ row }) => <Badge className={badgeByStatus[row.original.publicationStatus]}>{row.original.publicationStatus}</Badge> },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const igKey = `${row.original.id}:instagram_4x5`;
        const fbKey = `${row.original.id}:facebook_1x1`;

        return (
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline"><Link href={`/capsules/${row.original.id}`}>Ver</Link></Button>
            <Button size="sm" disabled={generatingKey === igKey || !!generatingKey} onClick={() => onGenerate(row.original.id, "instagram_4x5")}>Instagram</Button>
            <Button size="sm" variant="outline" disabled={generatingKey === fbKey || !!generatingKey} onClick={() => onGenerate(row.original.id, "facebook_1x1")}>Facebook</Button>
          </div>
        );
      }
    }
  ];

  const table = useReactTable({ data: filtered, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="space-y-4">
      <div className="grid gap-2 md:grid-cols-3">
        <Input placeholder="Buscar por título, área o ID" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="h-10 rounded-md border px-3 text-sm" value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)}>
          <option value="">Todas las áreas</option>
          {areas.map((area) => <option key={area} value={area}>{area}</option>)}
        </select>
        <select className="h-10 rounded-md border px-3 text-sm" value={creativeFilter} onChange={(e) => setCreativeFilter(e.target.value)}>
          <option value="">Todos los estados creativos</option>
          <option value="draft">draft</option>
          <option value="ready">ready</option>
          <option value="generated">generated</option>
          <option value="approved">approved</option>
          <option value="rejected">rejected</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b">
                {hg.headers.map((header) => (
                  <th className="px-3 py-2 text-left font-medium" key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {!table.getRowModel().rows.length ? (
              <tr><td colSpan={8} className="px-3 py-8 text-center text-muted-foreground">Sin resultados para los filtros actuales.</td></tr>
            ) : table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b">
                {row.getVisibleCells().map((cell) => (
                  <td className="px-3 py-2 align-top" key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
