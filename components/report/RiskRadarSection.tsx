"use client";

import { SectionShell, WTMFYBox, Chip, RS, ErrorSection, IndiaBadge } from "../ui/ReportPrimitives";
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
  const severityColor = { low: "green", medium: "amber", high: "red", fatal: "red" } as const;

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

      {/* India Regulatory Risks */}
      {d.regulatory_risks && d.regulatory_risks.length > 0 && (
        <div style={{ background: "#fff8f0", border: "1px solid #FF993340", borderRadius: 12, padding: "18px 20px", marginTop: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <IndiaBadge />
            <span style={{ fontSize: 12, color: "var(--ink-3)" }}>Indian regulatory compliance risks</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
            {d.regulatory_risks.map((reg, i) => (
              <div key={i} style={{
                background: reg.severity === "fatal" ? "oklch(96% 0.05 22)" : "#fff",
                border: `1px solid ${reg.severity === "fatal" ? "oklch(88% 0.08 22)" : "#FF993330"}`,
                borderRadius: 10, padding: "14px 16px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" as const }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: reg.severity === "fatal" ? "oklch(40% 0.16 22)" : "var(--ink)" }}>{reg.risk}</span>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, background: "#FF993320", color: "#cc7a00", fontWeight: 700, letterSpacing: "0.04em" }}>{reg.governing_body}</span>
                  <Chip label={reg.severity} color={severityColor[reg.severity as keyof typeof severityColor] ?? "neutral"} />
                  {reg.severity === "fatal" && <span style={{ fontSize: 11, fontWeight: 700, color: "oklch(40% 0.16 22)", letterSpacing: "0.04em" }}>⚠️ FATAL</span>}
                </div>
                <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.55, marginBottom: 8 }}>{reg.plain_english_explanation}</p>
                <div style={{ padding: "8px 12px", background: "#FF993315", border: "1px solid #FF993330", borderRadius: 8, fontSize: 12 }}>
                  <span style={{ fontWeight: 600, color: "#cc7a00" }}>First step: </span>
                  <span style={{ color: "var(--ink-2)" }}>{reg.what_to_do}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <WTMFYBox>{d.what_this_means_for_you}</WTMFYBox>
    </SectionShell>
  );
}
