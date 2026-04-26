import Groq from "groq-sdk";
import type { ChatCompletion } from "groq-sdk/resources/chat/completions";

export async function callGroq(
  systemPrompt: string,
  userPrompt: string,
  timeoutMs = 25000
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not set");

  const client = new Groq({ apiKey });

  const result = await Promise.race([
    client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
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
}
