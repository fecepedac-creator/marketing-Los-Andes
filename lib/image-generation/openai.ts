import OpenAI from "openai";
import { ImageGenerationProvider } from "@/lib/image-generation/provider";

export class OpenAIImageProvider implements ImageGenerationProvider {
  private client: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("Falta OPENAI_API_KEY en el entorno del servidor.");
    }
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 50_000 });
  }

  async generate(prompt: string, size: "1024x1024" | "1024x1536") {
    const result = await this.client.images.generate({
      model: "gpt-image-1",
      prompt,
      size
    });

    const imageBase64 = result.data?.[0]?.b64_json;
    if (!imageBase64) {
      throw new Error("OpenAI no devolvió imagen en base64.");
    }

    return { imageBase64, mimeType: "image/png" };
  }
}
