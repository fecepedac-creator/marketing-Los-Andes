"use client";

import { Input } from "@/components/ui/input";

export function Header({ title, onSearch }: { title: string; onSearch?: (value: string) => void }) {
  return (
    <header className="flex items-center justify-between border-b bg-white px-6 py-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="w-80">
        <Input placeholder="Buscar..." onChange={(e) => onSearch?.(e.target.value)} />
      </div>
    </header>
  );
}
