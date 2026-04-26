import { NextRequest } from "next/server";
import { runAIModule } from "@/lib/ai/router";
import { searchWeb, formatSearchResults } from "@/lib/search/serper";
import { createServiceClient } from "@/lib/supabase/server";
import {
  IdeaDecoderSchema,
  MarketSizingSchema,
  CustomerProfilingSchema,
  CompetitorLandscapeSchema,
  ProblemValidationSchema,
  BusinessModelSchema,
  GoToMarketSchema,
  RiskRadarSchema,
  TrendTimingSchema,
  InvestorLensSchema,
} from "@/lib/schemas";
import {
  systemPrompt as ideaPrompt,
  buildUserPrompt as ideaUserPrompt,
} from "@/lib/ai/prompts/01-idea-decoder";
import {
  systemPrompt as marketPrompt,
  buildUserPrompt as marketUserPrompt,
} from "@/lib/ai/prompts/02-market-sizing";
import {
  systemPrompt as customerPrompt,
  buildUserPrompt as customerUserPrompt,
} from "@/lib/ai/prompts/03-customer-profiling";
import {
  systemPrompt as competitorPrompt,
  buildUserPrompt as competitorUserPrompt,
} from "@/lib/ai/prompts/04-competitor-landscape";
import {
  systemPrompt as validationPrompt,
  buildUserPrompt as validationUserPrompt,
} from "@/lib/ai/prompts/05-problem-validation";
import {
  systemPrompt as businessPrompt,
  buildUserPrompt as businessUserPrompt,
} from "@/lib/ai/prompts/06-business-model";
import {
  systemPrompt as gtmPrompt,
  buildUserPrompt as gtmUserPrompt,
} from "@/lib/ai/prompts/07-go-to-market";
import {
  systemPrompt as riskPrompt,
  buildUserPrompt as riskUserPrompt,
} from "@/lib/ai/prompts/08-risk-radar";
import {
  systemPrompt as trendPrompt,
  buildUserPrompt as trendUserPrompt,
} from "@/lib/ai/prompts/09-trend-timing";
import {
  systemPrompt as investorPrompt,
  buildUserPrompt as investorUserPrompt,
} from "@/lib/ai/prompts/10-investor-lens";

export const runtime = "nodejs";

function send(
  controller: ReadableStreamDefaultController,
  event: string,
  data: unknown
) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  controller.enqueue(new TextEncoder().encode(payload));
}

export async function POST(req: NextRequest) {
  const { ideaText, geography, industry } = await req.json();

  if (!ideaText || typeof ideaText !== "string" || ideaText.trim().length < 10) {
    return new Response(JSON.stringify({ error: "Idea text is required (min 10 chars)" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const modules: Record<string, unknown> = {};

      try {
        // Step 1: Run Module 1 (Idea Decoder) first — its output seeds all other modules
        send(controller, "progress", { moduleId: "01-idea-decoder", status: "running", label: "Decoding your idea..." });

        const ideaResult = await runAIModule(
          "01-idea-decoder",
          ideaPrompt,
          ideaUserPrompt(ideaText, geography, industry),
          IdeaDecoderSchema
        );

        modules["01-idea-decoder"] = ideaResult;
        send(controller, "progress", { moduleId: "01-idea-decoder", status: "done", modelUsed: ideaResult.modelUsed });

        const ideaJson = JSON.stringify(ideaResult.result, null, 2);
        const detectedGeography = ideaResult.result.geography;

        // Step 2: Web searches for modules that need them
        send(controller, "progress", { moduleId: "search", status: "running", label: "Searching the web for market data..." });

        const [marketSearch, competitorSearch, trendSearch] = await Promise.allSettled([
          searchWeb(`${ideaResult.result.industry} market size ${detectedGeography} 2024`, detectedGeography),
          searchWeb(`${ideaResult.result.industry} startups competitors ${detectedGeography}`, detectedGeography),
          searchWeb(`${ideaResult.result.industry} trends 2024 2025 ${detectedGeography}`, detectedGeography),
        ]);

        const marketSearchText = marketSearch.status === "fulfilled"
          ? formatSearchResults(marketSearch.value) : "No search results available.";
        const competitorSearchText = competitorSearch.status === "fulfilled"
          ? formatSearchResults(competitorSearch.value) : "No search results available.";
        const trendSearchText = trendSearch.status === "fulfilled"
          ? formatSearchResults(trendSearch.value) : "No search results available.";

        send(controller, "progress", { moduleId: "search", status: "done" });

        // Step 3: Run all remaining modules in parallel
        const moduleLabels: Record<string, string> = {
          "02-market-sizing": "Sizing your market...",
          "03-customer-profiling": "Building customer profiles...",
          "04-competitor-landscape": "Mapping your competitors...",
          "05-problem-validation": "Validating the problem...",
          "06-business-model": "Exploring business models...",
          "07-go-to-market": "Building your GTM playbook...",
          "08-risk-radar": "Scanning for risks...",
          "09-trend-timing": "Analysing market trends...",
          "10-investor-lens": "Putting on the investor lens...",
        };

        Object.entries(moduleLabels).forEach(([moduleId, label]) => {
          send(controller, "progress", { moduleId, status: "running", label });
        });

        const parallelResults = await Promise.allSettled([
          runAIModule("02-market-sizing", marketPrompt, marketUserPrompt(ideaJson, marketSearchText), MarketSizingSchema),
          runAIModule("03-customer-profiling", customerPrompt, customerUserPrompt(ideaJson), CustomerProfilingSchema),
          runAIModule("04-competitor-landscape", competitorPrompt, competitorUserPrompt(ideaJson, competitorSearchText), CompetitorLandscapeSchema),
          runAIModule("05-problem-validation", validationPrompt, validationUserPrompt(ideaJson), ProblemValidationSchema),
          runAIModule("06-business-model", businessPrompt, businessUserPrompt(ideaJson), BusinessModelSchema),
          runAIModule("07-go-to-market", gtmPrompt, gtmUserPrompt(ideaJson), GoToMarketSchema),
          runAIModule("08-risk-radar", riskPrompt, riskUserPrompt(ideaJson), RiskRadarSchema),
          runAIModule("09-trend-timing", trendPrompt, trendUserPrompt(ideaJson, trendSearchText), TrendTimingSchema),
          runAIModule("10-investor-lens", investorPrompt, investorUserPrompt(ideaJson), InvestorLensSchema),
        ]);

        const moduleIds = [
          "02-market-sizing", "03-customer-profiling", "04-competitor-landscape",
          "05-problem-validation", "06-business-model", "07-go-to-market",
          "08-risk-radar", "09-trend-timing", "10-investor-lens",
        ] as const;

        moduleIds.forEach((moduleId, i) => {
          const r = parallelResults[i];
          if (r.status === "fulfilled") {
            modules[moduleId] = r.value;
            send(controller, "progress", { moduleId, status: "done", modelUsed: r.value.modelUsed });
          } else {
            modules[moduleId] = { error: String(r.reason) };
            send(controller, "progress", { moduleId, status: "error", error: String(r.reason) });
          }
        });

        // Step 4: Save to Supabase
        const supabase = createServiceClient();
        const { data: savedReport, error: dbError } = await supabase
          .from("reports")
          .insert({
            idea_text: ideaText,
            geography: geography ?? detectedGeography,
            industry: industry ?? ideaResult.result.industry,
            modules,
          })
          .select("id")
          .single();

        if (dbError) {
          console.error("Supabase save error:", dbError);
          send(controller, "error", { message: "Failed to save report" });
        } else {
          send(controller, "complete", { reportId: savedReport.id });
        }
      } catch (err) {
        console.error("Orchestration error:", err);
        send(controller, "error", { message: String(err) });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
