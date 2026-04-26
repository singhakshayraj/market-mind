import { GoogleGenerativeAI } from "@google/generative-ai";

export async function callGemini(
  systemPrompt: string,
  userPrompt: string,
  timeoutMs = 25000
): Promise<string> {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_GEMINI_API_KEY is not set");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: systemPrompt,
    generationConfig: { responseMimeType: "application/json" },
  });

  const result = await Promise.race([
    model.generateContent(userPrompt),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Gemini timeout")), timeoutMs)
    ),
  ]);

  return (result as Awaited<ReturnType<typeof model.generateContent>>).response.text();
}
