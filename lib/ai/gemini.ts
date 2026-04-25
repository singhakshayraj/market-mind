import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY ?? "");

export async function callGemini(
  systemPrompt: string,
  userPrompt: string,
  timeoutMs = 15000
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
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
