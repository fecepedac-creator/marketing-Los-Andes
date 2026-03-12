import { z } from "zod";

export const settingsSchema = z.object({
  institutionalPromptBase: z.string().min(10),
  instagramFormatBlock: z.string().min(10),
  facebookFormatBlock: z.string().min(10),
  brandNotes: z.string().default(""),
  logoUrl: z.string().url().or(z.literal("")),
  fileNamingPattern: z.string().min(5),
  updatedAt: z.string().optional()
});

export type SettingsInput = z.infer<typeof settingsSchema>;
