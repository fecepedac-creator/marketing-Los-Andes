"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/capsules", label: "Cápsulas" },
  { href: "/gallery", label: "Galería" },
  { href: "/settings", label: "Settings" }
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 border-r bg-white p-4">
      <h1 className="mb-6 text-lg font-semibold text-primary">Panel Editorial</h1>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "block rounded px-3 py-2 text-sm",
              pathname.startsWith(link.href) ? "bg-primary text-white" : "text-muted-foreground hover:bg-secondary"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
