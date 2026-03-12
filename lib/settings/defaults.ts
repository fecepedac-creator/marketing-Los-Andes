import { EditorialSettings } from "@/types/editorial";

export const defaultEditorialSettings: Omit<EditorialSettings, "updatedAt"> = {
  institutionalPromptBase:
    "Toda pieza visual del Centro Médico Los Andes debe estar completamente en español, con ortografía correcta y texto legible. Mantener estética médica institucional, profesional, cercana, limpia y moderna. Dirigido a público general de San Javier de Loncomilla y alrededores, Chile. Evitar tono alarmista. No usar texto en inglés. No inventar cifras epidemiológicas. Si se incluye algún dato epidemiológico, debe basarse en estadísticas chilenas publicadas por MINSAL, ENS, DEIS o sociedades médicas reconocidas. La imagen debe mantener el logo oficial conocido de Centro Médico Los Andes, tener formato vertical 4:5 para Instagram o 1:1 para Facebook según corresponda, verse como un afiche real publicable, dejar clara la jerarquía visual, tener diseño sobrio, confiable y sanitario, composición limpia, evitar exceso de elementos, evitar texto ilegible y evitar errores anatómicos.",
  instagramFormatBlock: "Formato Instagram 4:5 (1080x1350), prioriza lectura móvil y jerarquía visual.",
  facebookFormatBlock: "Formato Facebook 1:1 (1080x1080), equilibrio entre texto y elementos visuales.",
  brandNotes: "Usar tonos institucionales, iconografía médica limpia, estilo confiable.",
  logoUrl: "",
  fileNamingPattern: "[AREA]_[ID]_[slugTitulo]_[formato]_[version]"
};
