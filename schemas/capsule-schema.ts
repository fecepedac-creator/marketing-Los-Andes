import { z } from "zod";

export const capsuleBaseSchema = z.object({
  id: z.string().min(1),
  area: z.string().min(1),
  title: z.string().min(3),
  point1: z.string().min(3),
  point2: z.string().min(3),
  point3: z.string().min(3),
  cta: z.string().min(3),
  visualScene: z.string().min(3),
  editorialNote: z.string().default(""),
  requiresEpiValidation: z.boolean().default(false),
  allowedSources: z.array(z.string()).default([]),
  suggestedPublishDate: z.string().nullable(),
  creativeStatus: z.enum(["draft", "ready", "generated", "approved", "rejected"]),
  publicationStatus: z.enum(["pending", "scheduled", "published"]),
  promptInstagram: z.string().default(""),
  promptFacebook: z.string().default(""),
  suggestedFileName: z.string().default(""),
  source: z.enum(["manual", "excel_import"]).default("manual")
});

export const capsuleSchema = capsuleBaseSchema.extend({
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export type CapsuleInput = z.infer<typeof capsuleBaseSchema>;
