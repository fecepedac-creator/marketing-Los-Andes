export type CreativeStatus = "draft" | "ready" | "generated" | "approved" | "rejected";
export type PublicationStatus = "pending" | "scheduled" | "published";
export type FormatType = "instagram_4x5" | "facebook_1x1";
export type ReviewStatus = "pending" | "approved" | "rejected";
export type CapsuleSource = "manual" | "excel_import";

export interface Capsule {
  id: string;
  area: string;
  title: string;
  point1: string;
  point2: string;
  point3: string;
  cta: string;
  visualScene: string;
  editorialNote: string;
  requiresEpiValidation: boolean;
  allowedSources: string[];
  suggestedPublishDate: string | null;
  creativeStatus: CreativeStatus;
  publicationStatus: PublicationStatus;
  promptInstagram: string;
  promptFacebook: string;
  suggestedFileName: string;
  source: CapsuleSource;
  createdAt: string;
  updatedAt: string;
}

export interface Generation {
  id: string;
  capsuleId: string;
  formatType: FormatType;
  version: number;
  fullPrompt: string;
  imageUrl: string;
  thumbnailUrl: string;
  fileName: string;
  generatedAt: string;
  generatedBy: string;
  reviewStatus: ReviewStatus;
  reviewComment: string;
  capsuleTitle?: string;
  area?: string;
}

export interface EditorialSettings {
  institutionalPromptBase: string;
  instagramFormatBlock: string;
  facebookFormatBlock: string;
  brandNotes: string;
  logoUrl: string;
  fileNamingPattern: string;
  updatedAt: string;
}
