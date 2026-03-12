import "dotenv/config";
import path from "node:path";
import XLSX from "xlsx";
import { upsertCapsule } from "../lib/capsules/server";
import { CapsuleInput } from "../schemas/capsule-schema";

type ExcelRow = Record<string, unknown>;

/**
 * Mapeo explícito entre columnas del Excel v2 y campos internos.
 * Si en el archivo real cambian encabezados, ajustar aquí.
 */
const COLUMN_MAP: Record<string, keyof CapsuleInput> = {
  id: "id",
  ID: "id",
  area: "area",
  Área: "area",
  title: "title",
  Título: "title",
  point1: "point1",
  "Punto 1": "point1",
  point2: "point2",
  "Punto 2": "point2",
  point3: "point3",
  "Punto 3": "point3",
  cta: "cta",
  CTA: "cta",
  visualScene: "visualScene",
  "Escena visual sugerida": "visualScene",
  editorialNote: "editorialNote",
  "Nota editorial": "editorialNote",
  requiresEpiValidation: "requiresEpiValidation",
  "Requiere validación epidemiológica": "requiresEpiValidation",
  allowedSources: "allowedSources",
  "Fuentes permitidas": "allowedSources",
  suggestedPublishDate: "suggestedPublishDate",
  "Fecha sugerida de publicación": "suggestedPublishDate",
  creativeStatus: "creativeStatus",
  "Estado creativo": "creativeStatus",
  publicationStatus: "publicationStatus",
  "Estado publicación": "publicationStatus",
  promptInstagram: "promptInstagram",
  "Prompt Instagram": "promptInstagram",
  promptFacebook: "promptFacebook",
  "Prompt Facebook": "promptFacebook",
  suggestedFileName: "suggestedFileName",
  "Nombre sugerido archivo": "suggestedFileName"
};

const REQUIRED_FIELDS: Array<keyof CapsuleInput> = [
  "id",
  "area",
  "title",
  "point1",
  "point2",
  "point3",
  "cta",
  "visualScene",
  "creativeStatus",
  "publicationStatus"
];

function normalizeBoolean(value: unknown): boolean {
  const text = String(value ?? "").trim().toLowerCase();
  return ["true", "1", "sí", "si", "yes", "x"].includes(text);
}

function normalizeSources(value: unknown): string[] {
  return String(value ?? "")
    .split(/[;,|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeDate(value: unknown): string | null {
  if (value === null || value === undefined || String(value).trim() === "") return null;

  if (typeof value === "number") {
    const parsed = XLSX.SSF.parse_date_code(value);
    if (!parsed) return null;
    const d = new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d));
    return d.toISOString().slice(0, 10);
  }

  const raw = String(value).trim();
  const dmy = raw.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (dmy) {
    const [, dd, mm, yyyy] = dmy;
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }

  return raw;
}

function mapRow(row: ExcelRow): CapsuleInput {
  const mapped: Partial<CapsuleInput> = {
    creativeStatus: "draft",
    publicationStatus: "pending",
    source: "excel_import",
    promptInstagram: "",
    promptFacebook: "",
    suggestedFileName: "",
    editorialNote: "",
    suggestedPublishDate: null,
    allowedSources: [],
    requiresEpiValidation: false
  };

  for (const [excelColumn, value] of Object.entries(row)) {
    const field = COLUMN_MAP[excelColumn.trim()];
    if (!field) continue;

    if (field === "requiresEpiValidation") mapped[field] = normalizeBoolean(value) as never;
    else if (field === "allowedSources") mapped[field] = normalizeSources(value) as never;
    else if (field === "suggestedPublishDate") mapped[field] = normalizeDate(value) as never;
    else mapped[field] = String(value ?? "").trim() as never;
  }

  return mapped as CapsuleInput;
}

function getMissingRequiredFields(capsule: CapsuleInput): string[] {
  return REQUIRED_FIELDS.filter((field) => {
    const value = capsule[field];
    return value === null || value === undefined || String(value).trim() === "";
  });
}

async function main() {
  const inputPath = process.argv[2] ?? "data/biblioteca_capsulas_los_andes_v2.xlsx";
  const resolvedPath = path.resolve(process.cwd(), inputPath);
  const workbook = XLSX.readFile(resolvedPath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<ExcelRow>(sheet, { defval: "" });

  const headers = Object.keys(rows[0] ?? {});
  const mappedHeaders = headers.filter((header) => COLUMN_MAP[header.trim()]);
  if (!mappedHeaders.length) {
    throw new Error("No se encontraron columnas compatibles con COLUMN_MAP. Revisa encabezados del Excel.");
  }

  let imported = 0;
  let skipped = 0;

  for (const [index, row] of rows.entries()) {
    const capsule = mapRow(row);
    const missing = getMissingRequiredFields(capsule);

    if (missing.length) {
      skipped += 1;
      console.warn(`[WARN] Fila ${index + 2} omitida. Campos requeridos faltantes: ${missing.join(", ")}`);
      continue;
    }

    if (!capsule.promptInstagram && !capsule.promptFacebook) {
      console.warn(`[WARN] Fila ${index + 2} (${capsule.id}) sin prompts específicos IG/FB.`);
    }

    await upsertCapsule(capsule);
    imported += 1;
  }

  console.log(`Importación completada: ${imported} cápsulas importadas, ${skipped} omitidas.`);
  console.log(`Origen: ${resolvedPath}`);
  console.log("Si alguna columna del Excel no matchea, ajusta COLUMN_MAP en scripts/import-capsules-xlsx.ts");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
