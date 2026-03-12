import { Capsule, EditorialSettings, FormatType } from "@/types/editorial";

const safeText = (value: string | null | undefined, fallback: string) => {
  const normalized = (value ?? "").trim();
  return normalized || fallback;
};

export function buildPrompt(capsule: Capsule, formatType: FormatType, settings: EditorialSettings): string {
  const isInstagram = formatType === "instagram_4x5";
  const formatBlock = safeText(isInstagram ? settings.instagramFormatBlock : settings.facebookFormatBlock, "Sin bloque de formato.");
  const capsulePromptOverride = safeText(isInstagram ? capsule.promptInstagram : capsule.promptFacebook, "Sin prompt específico para este formato.");

  return [
    "[01_BLOQUE_INSTITUCIONAL]",
    safeText(settings.institutionalPromptBase, "Sin bloque institucional configurado."),
    "",
    "[02_BLOQUE_IDENTIDAD_VISUAL]",
    "Mantener logo oficial conocido de Centro Médico Los Andes, limpio, visible y correctamente proporcionado dentro de la composición.",
    `Referencia de logo configurada: ${safeText(settings.logoUrl, "No configurado")}`,
    `Notas de marca: ${safeText(settings.brandNotes, "Sin notas adicionales")}`,
    "",
    "[03_BLOQUE_FORMATO]",
    `Formato objetivo: ${isInstagram ? "Instagram 4:5 (vertical)" : "Facebook 1:1 (cuadrado)"}`,
    formatBlock,
    "",
    "[04_BLOQUE_CAPSULA]",
    `ID cápsula: ${safeText(capsule.id, "Sin ID")}`,
    `Tema del afiche: ${safeText(capsule.area, "Sin área")}`,
    `Título principal: ${safeText(capsule.title, "Sin título")}`,
    `Punto 1: ${safeText(capsule.point1, "Sin punto 1")}`,
    `Punto 2: ${safeText(capsule.point2, "Sin punto 2")}`,
    `Punto 3: ${safeText(capsule.point3, "Sin punto 3")}`,
    `CTA final: ${safeText(capsule.cta, "Sin CTA")}`,
    `Escena visual sugerida: ${safeText(capsule.visualScene, "Sin escena visual sugerida")}`,
    `Nota editorial: ${safeText(capsule.editorialNote, "Sin nota")}`,
    `Requiere validación epidemiológica: ${capsule.requiresEpiValidation ? "Sí" : "No"}`,
    `Fuentes permitidas: ${capsule.allowedSources?.length ? capsule.allowedSources.join(", ") : "No especificadas"}`,
    `Nombre sugerido de archivo: ${safeText(capsule.suggestedFileName, "Sin sugerencia")}`,
    `Origen del dato: ${safeText(capsule.source, "manual")}`,
    "",
    "[05_BLOQUE_PROMPT_ESPECIFICO]",
    capsulePromptOverride,
    "",
    "[06_SALIDA_ESPERADA]",
    "Genera una única pieza final, texto totalmente en español, legible, lista para publicar en el formato objetivo."
  ].join("\n");
}
