import { Header } from "@/components/layout/header";
import { SettingsForm } from "@/components/settings/settings-form";
import { getSettings } from "@/lib/settings/server";

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <div>
      <Header title="Configuración editorial" />
      <div className="p-6"><SettingsForm initial={settings} /></div>
    </div>
  );
}
