export interface GenerationResult {
  imageBase64: string;
  mimeType: string;
}

export interface ImageGenerationProvider {
  generate(prompt: string, size: "1024x1024" | "1024x1536"): Promise<GenerationResult>;
}
