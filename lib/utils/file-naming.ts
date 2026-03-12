import { Capsule, FormatType } from "@/types/editorial";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function buildFileName(pattern: string, capsule: Capsule, format: FormatType, version: number) {
  return pattern
    .replace("[AREA]", slugify(capsule.area).toUpperCase())
    .replace("[ID]", capsule.id)
    .replace("[slugTitulo]", slugify(capsule.title))
    .replace("[formato]", format === "instagram_4x5" ? "instagram" : "facebook")
    .replace("[version]", `v${version}`)
    .concat(".png");
}
