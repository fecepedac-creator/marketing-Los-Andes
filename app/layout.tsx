import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Panel Editorial Los Andes",
  description: "MVP editorial sanitario"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
