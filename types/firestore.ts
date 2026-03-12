import { Timestamp } from "firebase-admin/firestore";
import { CapsuleSource, CreativeStatus, FormatType, PublicationStatus, ReviewStatus } from "@/types/editorial";

export interface CapsuleDoc {
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
  suggestedPublishDate: Timestamp | null;
  creativeStatus: CreativeStatus;
  publicationStatus: PublicationStatus;
  promptInstagram: string;
  promptFacebook: string;
  suggestedFileName: string;
  source: CapsuleSource;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface GenerationDoc {
  formatType: FormatType;
  version: number;
  fullPrompt: string;
  imageUrl: string;
  thumbnailUrl: string;
  fileName: string;
  generatedAt: Timestamp;
  generatedBy: string;
  reviewStatus: ReviewStatus;
  reviewComment: string;
}

export interface EditorialSettingsDoc {
  institutionalPromptBase: string;
  instagramFormatBlock: string;
  facebookFormatBlock: string;
  brandNotes: string;
  logoUrl: string;
  fileNamingPattern: string;
  updatedAt: Timestamp;
}
