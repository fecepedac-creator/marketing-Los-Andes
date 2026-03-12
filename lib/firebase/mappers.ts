import { Timestamp } from "firebase-admin/firestore";
import { Capsule, EditorialSettings, Generation } from "@/types/editorial";
import { CapsuleDoc, EditorialSettingsDoc, GenerationDoc } from "@/types/firestore";

const toIso = (value: Timestamp | null) => (value ? value.toDate().toISOString() : null);

export function toCapsuleApp(id: string, doc: CapsuleDoc): Capsule {
  return {
    id,
    area: doc.area,
    title: doc.title,
    point1: doc.point1,
    point2: doc.point2,
    point3: doc.point3,
    cta: doc.cta,
    visualScene: doc.visualScene,
    editorialNote: doc.editorialNote,
    requiresEpiValidation: doc.requiresEpiValidation,
    allowedSources: doc.allowedSources,
    suggestedPublishDate: toIso(doc.suggestedPublishDate),
    creativeStatus: doc.creativeStatus,
    publicationStatus: doc.publicationStatus,
    promptInstagram: doc.promptInstagram ?? "",
    promptFacebook: doc.promptFacebook ?? "",
    suggestedFileName: doc.suggestedFileName ?? "",
    source: doc.source ?? "manual",
    createdAt: doc.createdAt.toDate().toISOString(),
    updatedAt: doc.updatedAt.toDate().toISOString()
  };
}

export function toCapsuleDoc(input: Omit<Capsule, "createdAt" | "updatedAt">, createdAt?: Timestamp): CapsuleDoc {
  const now = Timestamp.now();
  return {
    area: input.area,
    title: input.title,
    point1: input.point1,
    point2: input.point2,
    point3: input.point3,
    cta: input.cta,
    visualScene: input.visualScene,
    editorialNote: input.editorialNote,
    requiresEpiValidation: input.requiresEpiValidation,
    allowedSources: input.allowedSources,
    suggestedPublishDate: input.suggestedPublishDate ? Timestamp.fromDate(new Date(input.suggestedPublishDate)) : null,
    creativeStatus: input.creativeStatus,
    publicationStatus: input.publicationStatus,
    promptInstagram: input.promptInstagram,
    promptFacebook: input.promptFacebook,
    suggestedFileName: input.suggestedFileName,
    source: input.source,
    createdAt: createdAt ?? now,
    updatedAt: now
  };
}

export function toGenerationApp(id: string, capsuleId: string, doc: GenerationDoc): Generation {
  return {
    id,
    capsuleId,
    formatType: doc.formatType,
    version: doc.version,
    fullPrompt: doc.fullPrompt,
    imageUrl: doc.imageUrl,
    thumbnailUrl: doc.thumbnailUrl,
    fileName: doc.fileName,
    generatedAt: doc.generatedAt.toDate().toISOString(),
    generatedBy: doc.generatedBy,
    reviewStatus: doc.reviewStatus,
    reviewComment: doc.reviewComment
  };
}

export function toSettingsApp(doc: EditorialSettingsDoc): EditorialSettings {
  return {
    institutionalPromptBase: doc.institutionalPromptBase,
    instagramFormatBlock: doc.instagramFormatBlock,
    facebookFormatBlock: doc.facebookFormatBlock,
    brandNotes: doc.brandNotes,
    logoUrl: doc.logoUrl,
    fileNamingPattern: doc.fileNamingPattern,
    updatedAt: doc.updatedAt.toDate().toISOString()
  };
}

export function toSettingsDoc(input: Omit<EditorialSettings, "updatedAt">): EditorialSettingsDoc {
  return {
    institutionalPromptBase: input.institutionalPromptBase,
    instagramFormatBlock: input.instagramFormatBlock,
    facebookFormatBlock: input.facebookFormatBlock,
    brandNotes: input.brandNotes,
    logoUrl: input.logoUrl,
    fileNamingPattern: input.fileNamingPattern,
    updatedAt: Timestamp.now()
  };
}
