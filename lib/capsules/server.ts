import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { generationReviewSchema, generationSchema } from "@/schemas/generation-schema";
import { capsuleBaseSchema } from "@/schemas/capsule-schema";
import { Capsule, FormatType, Generation, ReviewStatus } from "@/types/editorial";
import { CapsuleDoc, GenerationDoc } from "@/types/firestore";
import { toCapsuleApp, toCapsuleDoc, toGenerationApp } from "@/lib/firebase/mappers";

const capsulesRef = adminDb.collection("capsules");

export interface CapsuleFilters {
  search?: string;
  area?: string;
  creativeStatus?: string;
  publicationStatus?: string;
}

export async function listCapsules(filters: CapsuleFilters = {}): Promise<Capsule[]> {
  let query: FirebaseFirestore.Query = capsulesRef;

  if (filters.area) query = query.where("area", "==", filters.area);
  if (filters.creativeStatus) query = query.where("creativeStatus", "==", filters.creativeStatus);
  if (filters.publicationStatus) query = query.where("publicationStatus", "==", filters.publicationStatus);

  const snapshot = await query.get();
  let data = snapshot.docs.map((doc) => toCapsuleApp(doc.id, doc.data() as CapsuleDoc));

  if (filters.search) {
    const text = filters.search.toLowerCase();
    data = data.filter((item) => item.title.toLowerCase().includes(text) || item.area.toLowerCase().includes(text));
  }

  return data.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getCapsule(capsuleId: string): Promise<Capsule | null> {
  const snap = await capsulesRef.doc(capsuleId).get();
  if (!snap.exists) return null;
  return toCapsuleApp(snap.id, snap.data() as CapsuleDoc);
}

export async function upsertCapsule(input: unknown): Promise<Capsule> {
  const parsed = capsuleBaseSchema.parse({
    promptInstagram: "",
    promptFacebook: "",
    suggestedFileName: "",
    source: "manual",
    ...((input as Record<string, unknown>) ?? {})
  });
  const existing = await capsulesRef.doc(parsed.id).get();
  const createdAt = existing.exists ? (existing.data() as CapsuleDoc).createdAt : undefined;
  const doc = toCapsuleDoc(parsed, createdAt);

  await capsulesRef.doc(parsed.id).set(doc, { merge: true });
  return toCapsuleApp(parsed.id, doc);
}

export async function listGenerations(capsuleId: string): Promise<Generation[]> {
  const snap = await capsulesRef.doc(capsuleId).collection("generations").orderBy("generatedAt", "desc").get();
  return snap.docs.map((doc) => toGenerationApp(doc.id, capsuleId, doc.data() as GenerationDoc));
}

export async function getNextVersion(capsuleId: string, formatType: FormatType): Promise<number> {
  const snap = await capsulesRef
    .doc(capsuleId)
    .collection("generations")
    .where("formatType", "==", formatType)
    .orderBy("version", "desc")
    .limit(1)
    .get();

  return (snap.docs[0]?.data().version ?? 0) + 1;
}

export async function createGeneration(input: unknown): Promise<Generation> {
  const parsed = generationSchema.parse(input);
  const doc: GenerationDoc = {
    formatType: parsed.formatType,
    version: parsed.version,
    fullPrompt: parsed.fullPrompt,
    imageUrl: parsed.imageUrl,
    thumbnailUrl: parsed.thumbnailUrl,
    fileName: parsed.fileName,
    generatedAt: Timestamp.now(),
    generatedBy: parsed.generatedBy,
    reviewStatus: parsed.reviewStatus,
    reviewComment: parsed.reviewComment
  };

  const ref = await capsulesRef.doc(parsed.capsuleId).collection("generations").add(doc);
  await capsulesRef.doc(parsed.capsuleId).set({ creativeStatus: "generated", updatedAt: Timestamp.now() }, { merge: true });

  return toGenerationApp(ref.id, parsed.capsuleId, doc);
}

export async function updateGenerationReview(capsuleId: string, generationId: string, reviewStatus: ReviewStatus, reviewComment = "") {
  const parsed = generationReviewSchema.parse({ reviewStatus, reviewComment });
  await capsulesRef.doc(capsuleId).collection("generations").doc(generationId).set(parsed, { merge: true });
}
