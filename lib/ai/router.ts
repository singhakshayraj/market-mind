import { ZodSchema } from "zod";
import { callGemini } from "./gemini";

function parseJson(raw: string): unknown {
  const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned);
}

export async function runAIModule<T>(
  moduleId: string,
  systemPrompt: string,
  userPrompt: string,
  outputSchema: ZodSchema<T>
): Promise<{ result: T; modelUsed: string }> {
  const tryGemini = async (prompt: string): Promise<T> => {
    const raw = await callGemini(systemPrompt, prompt);
    try {
      return outputSchema.parse(parseJson(raw));
    } catch {
      const correctionPrompt = `Your previous response was not valid JSON. Respond ONLY with valid JSON matching the required schema. No prose, no markdown.\n\n${prompt}`;
      const raw2 = await callGemini(systemPrompt, correctionPrompt);
      return outputSchema.parse(parseJson(raw2));
    }
  };

  const result = await tryGemini(userPrompt);
  console.log(`[AI Router] ${moduleId} → gemini`);
  return { result, modelUsed: "gemini" };
}
