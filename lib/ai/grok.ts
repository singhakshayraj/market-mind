import OpenAI from "openai";

const grokClient = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

export async function callGrok(
  systemPrompt: string,
  userPrompt: string,
  timeoutMs = 15000
): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await grokClient.chat.completions.create(
      {
        model: "grok-3",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      },
      { signal: controller.signal }
    );
    return response.choices[0].message.content ?? "";
  } finally {
    clearTimeout(timer);
  }
}
