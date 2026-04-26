"use client";

import { SectionShell, WTMFYBox, Chip, RS, ErrorSection } from "../ui/ReportPrimitives";
import type { RiskRadar } from "@/lib/schemas";

interface Props {
  data?: { result: RiskRadar; modelUsed: string; error?: string };
}

const categoryEmoji: Record<string, string> = {
  market: "📉", regulatory: "⚖️", operational: "⚙️", competitive: "🥊", financial: "💸", technical: "🔧",
};

export default function RiskRadarSection({ data }: Props) {
  if (!data) return <ErrorSection number={8} label="Risk Radar" error="Module data not available" />;
  if (data.error) return <ErrorSection number={8} label="Risk Radar" error={data.error} />;
  const d = data.result;

  const overallColor = { low: "green", medium: "amber", high: "red", very_high: "red" } as const;
  const levelChipColor = { low: "green", medium: "amber", high: "red" } as const;

  return (
    <SectionShell id="risk-radar" number={8} title="Risk Radar" summary={d.plain_english_summary} modelUsed={data.modelUsed}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <span style={RS.label}>Overall Risk</span>
        <Chip label={d.overall_risk_level.replace("_", " ")} color={overallColor[d.overall_risk_level]} />
      </div>

      <div style={{ display: "flex", flexDirection: "column" as const, gap: 12, marginBottom: 20 }}>
        {d.risks.map((risk, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid var(--rule)", borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{categoryEmoji[risk.category] ?? "⚠️"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{risk.title}</span>
                  <Chip label={risk.category} color="neutral" />
                </div>
                <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5 }}>{risk.description}</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={RS.label}>Probability</span>
                <Chip label={risk.probability} color={levelChipColor[risk.probability]} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={RS.label}>Impact</span>
                <Chip label={risk.impact} color={levelChipColor[risk.impact]} />
              </div>
            </div>

            <div style={{ padding: "10px 14px", background: "var(--green-lt)", border: "1px solid oklch(85% 0.08 155)", borderRadius: 8, fontSize: 12, lineHeight: 1.5 }}>
              <span style={{ fontWeight: 600, color: "oklch(38% 0.14 155)" }}>Mitigation: </span>
              <span style={{ color: "var(--ink-2)" }}>{risk.mitigation}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "16px 18px", background: "oklch(96% 0.05 22)", border: "1px solid oklch(88% 0.08 22)", borderRadius: 10 }}>
        <div style={{ ...RS.label, color: "oklch(40% 0.16 22)", marginBottom: 6 }}>Biggest Risk</div>
        <p style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.65 }}>{d.biggest_risk_summary}</p>
      </div>

      <WTMFYBox>{d.what_this_means_for_you}</WTMFYBox>
    </SectionShell>
  );
}
