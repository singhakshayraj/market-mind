import Groq from "groq-sdk";
import type { ChatCompletion } from "groq-sdk/resources/chat/completions";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY ?? "" });

// Modules that don't need the large 70b model — use the fast 8b to save TPD quota
const FAST_MODULES = new Set([
  "03-customer-profiling",
  "05-problem-validation",
  "06-business-model",
]);

export function modelForModule(moduleId: string): string {
  return FAST_MODULES.has(moduleId)
    ? "llama-3.1-8b-instant"
    : "llama-3.3-70b-versatile";
}

export async function callGroq(
  systemPrompt: string,
  userPrompt: string,
  timeoutMs = 30000,
  moduleId = ""
): Promise<string> {
  if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY is not set");

  const model = modelForModule(moduleId);
  const MAX_RETRIES = 3;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const result = await Promise.race([
        client.chat.completions.create({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.4,
        }) as Promise<ChatCompletion>,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Groq timeout")), timeoutMs)
        ),
      ]);

      return result.choices[0]?.message?.content ?? "";
    } catch (err: unknown) {
      const msg = String(err);
      const is429 = msg.includes("429") || msg.includes("rate_limit");

      if (is429 && attempt < MAX_RETRIES - 1) {
        // Exponential backoff: 3s, 6s
        const delay = 3000 * (attempt + 1);
        console.warn(`[Groq] 429 on ${moduleId} (${model}), retrying in ${delay}ms…`);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      throw err;
    }
  }

  throw new Error("Groq: max retries exceeded");
}
