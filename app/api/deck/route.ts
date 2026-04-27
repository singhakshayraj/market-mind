import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { runAIModule } from "@/lib/ai/router";
import { systemPrompt, buildUserPrompt } from "@/lib/ai/prompts/12-pitch-deck";
import { PitchDeckOutputSchema } from "@/lib/schemas/12-pitch-deck";

export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const reportId = req.nextUrl.searchParams.get("reportId");
  if (!reportId) {
    return NextResponse.json({ error: "reportId required" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data: report, error } = await supabase
    .from("reports")
    .select("*")
    .eq("id", reportId)
    .single();

  if (error || !report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  // Return cached deck if available
  if (report.pitch_deck_data) {
    return NextResponse.json({ deck: report.pitch_deck_data, cached: true });
  }

  // Build the prompt input — all module outputs
  const allModulesJson = JSON.stringify(report.modules ?? {}, null, 2);
  const userPrompt = buildUserPrompt(allModulesJson);

  try {
    const { result } = await runAIModule(
      "12-pitch-deck",
      systemPrompt,
      userPrompt,
      PitchDeckOutputSchema
    );

    // Persist to Supabase
    await supabase
      .from("reports")
      .update({
        pitch_deck_data: result,
        pitch_deck_generated_at: new Date().toISOString(),
      })
      .eq("id", reportId);

    return NextResponse.json({ deck: result, cached: false });
  } catch (err) {
    console.error("[/api/deck] AI error:", err);
    return NextResponse.json(
      { error: "Failed to generate pitch deck. Please try again." },
      { status: 500 }
    );
  }
}
