import { ZodSchema } from "zod";
import { callGrok } from "./grok";
import { callGemini } from "./gemini";

type ModelName = "gemini" | "grok";

interface ModuleConfig {
  primary: ModelName;
  fallback: ModelName;
}

const MODULE_ROUTING: Record<string, ModuleConfig> = {
  "01-idea-decoder":       { primary: "gemini", fallback: "grok" },
  "02-market-sizing":      { primary: "grok",   fallback: "gemini" },
  "03-customer-profiling": { primary: "gemini", fallback: "grok" },
  "04-competitor-landscape": { primary: "grok", fallback: "gemini" },
  "05-problem-validation": { primary: "gemini", fallback: "grok" },
  "06-business-model":     { primary: "grok",   fallback: "gemini" },
  "07-go-to-market":       { primary: "gemini", fallback: "grok" },
  "08-risk-radar":         { primary: "grok",   fallback: "gemini" },
  "09-trend-timing":       { primary: "gemini", fallback: "grok" },
  "10-investor-lens":      { primary: "grok",   fallback: "gemini" },
};

async function callModel(
  model: ModelName,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  if (model === "gemini") return callGemini(systemPrompt, userPrompt);
  return callGrok(systemPrompt, userPrompt);
}

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
  const config = MODULE_ROUTING[moduleId];
  if (!config) throw new Error(`Unknown moduleId: ${moduleId}`);

  const tryModel = async (model: ModelName): Promise<T> => {
    const raw = await callModel(model, systemPrompt, userPrompt);

    try {
      const parsed = parseJson(raw);
      return outputSchema.parse(parsed);
    } catch {
      // One retry with explicit JSON instruction
      const correctionPrompt = `Your previous response was not valid JSON. Respond ONLY with valid JSON matching the required schema. No prose, no markdown code fences.\n\n${userPrompt}`;
      const raw2 = await callModel(model, systemPrompt, correctionPrompt);
      const parsed2 = parseJson(raw2);
      return outputSchema.parse(parsed2);
    }
  };

  try {
    const result = await tryModel(config.primary);
    console.log(`[AI Router] ${moduleId} → ${config.primary} (primary)`);
    return { result, modelUsed: config.primary };
  } catch (primaryErr) {
    console.warn(
      `[AI Router] ${moduleId} primary (${config.primary}) failed:`,
      primaryErr
    );
    try {
      const result = await tryModel(config.fallback);
      console.log(`[AI Router] ${moduleId} → ${config.fallback} (fallback)`);
      return { result, modelUsed: config.fallback };
    } catch (fallbackErr) {
      console.error(
        `[AI Router] ${moduleId} fallback (${config.fallback}) also failed:`,
        fallbackErr
      );
      throw fallbackErr;
    }
  }
}
