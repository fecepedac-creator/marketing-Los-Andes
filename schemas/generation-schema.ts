import { z } from "zod";

export const generationSchema = z.object({
  capsuleId: z.string().min(1),
  formatType: z.enum(["instagram_4x5", "facebook_1x1"]),
  version: z.number().int().positive(),
  fullPrompt: z.string().min(20),
  imageUrl: z.string().url(),
  thumbnailUrl: z.string().url(),
  fileName: z.string().min(5),
  generatedBy: z.string().min(1),
  reviewStatus: z.enum(["pending", "approved", "rejected"]),
  reviewComment: z.string().default("")
});

export const generationReviewSchema = z.object({
  reviewStatus: z.enum(["pending", "approved", "rejected"]),
  reviewComment: z.string().default("")
});
