import { z } from "zod";

export const generateImageRequestSchema = z.object({
  capsuleId: z.string().min(1),
  formatType: z.enum(["instagram_4x5", "facebook_1x1"]),
  generatedBy: z.string().min(1).default("admin")
});

export const capsuleFiltersSchema = z.object({
  search: z.string().optional(),
  area: z.string().optional(),
  creativeStatus: z.string().optional(),
  publicationStatus: z.string().optional()
});
