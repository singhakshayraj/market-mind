import { ZodSchema } from "zod";
import { callGroq } from "./groq";

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
  const tryGroq = async (prompt: string): Promise<T> => {
    const raw = await callGroq(systemPrompt, prompt);
    try {
      return outputSchema.parse(parseJson(raw));
    } catch {
      const correctionPrompt = `Your previous response was not valid JSON matching the required schema. Respond ONLY with valid JSON. No prose, no markdown.\n\n${prompt}`;
      const raw2 = await callGroq(systemPrompt, correctionPrompt);
      return outputSchema.parse(parseJson(raw2));
    }
  };

  const result = await tryGroq(userPrompt);
  console.log(`[AI Router] ${moduleId} → groq`);
  return { result, modelUsed: "groq" };
}
