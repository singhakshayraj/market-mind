"use client";

import { SectionShell, WTMFYBox, Chip, RS, ErrorSection } from "../ui/ReportPrimitives";
import type { CompetitorLandscape } from "@/lib/schemas";

interface Props {
  data?: { result: CompetitorLandscape; modelUsed: string; error?: string };
}

export default function CompetitorLandscapeSection({ data }: Props) {
  if (!data) return <ErrorSection number={4} label="Competitor Map" error="Module data not available" />;
  if (data.error) return <ErrorSection number={4} label="Competitor Map" error={data.error} />;
  const d = data.result;

  const maturityColor = { emerging: "green", growing: "blue", mature: "amber", declining: "red" } as const;
  const threatColor = { low: "green", medium: "amber", high: "red" } as const;
  const typeColor = { direct: "red", indirect: "amber", substitute: "blue" } as const;

  return (
    <SectionShell id="competitor-landscape" number={4} title="Competitor Map" summary={d.plain_english_summary} modelUsed={data.modelUsed}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <span style={RS.label}>Market Stage</span>
        <Chip label={d.market_maturity} color={maturityColor[d.market_maturity]} />
      </div>

      <div style={{ display: "flex", flexDirection: "column" as const, gap: 12, marginBottom: 20 }}>
        {d.competitors.map((c, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid var(--rule)", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{c.name}</span>
                  <Chip label={c.type} color={typeColor[c.type]} />
                  <Chip label={`${c.threat_level} threat`} color={threatColor[c.threat_level]} />
                </div>
                <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5 }}>{c.description}</p>
                {c.estimated_pricing && (
                  <p style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>Pricing: {c.estimated_pricing}</p>
                )}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}>
              <div>
                <div style={{ ...RS.label, color: "oklch(38% 0.14 155)", marginBottom: 6 }}>Strengths</div>
                <ul style={{ display: "flex", flexDirection: "column" as const, gap: 4 }}>
                  {c.strengths.map((s, j) => (
                    <li key={j} style={{ fontSize: 12, color: "var(--ink-2)", display: "flex", gap: 6 }}>
                      <span style={{ color: "var(--green)", flexShrink: 0 }}>+</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div style={{ ...RS.label, color: "oklch(40% 0.16 22)", marginBottom: 6 }}>Weaknesses</div>
                <ul style={{ display: "flex", flexDirection: "column" as const, gap: 4 }}>
                  {c.weaknesses.map((w, j) => (
                    <li key={j} style={{ fontSize: 12, color: "var(--ink-2)", display: "flex", gap: 6 }}>
                      <span style={{ color: "oklch(50% 0.16 22)", flexShrink: 0 }}>−</span>{w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ padding: "10px 14px", background: "var(--accent-lt)", borderRadius: 8, fontSize: 12, color: "var(--ink-2)", lineHeight: 1.5 }}>
              <span style={{ fontWeight: 600, color: "var(--accent)" }}>Learn from them: </span>
              {c.what_you_can_learn_from_them}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "16px 18px", background: "var(--green-lt)", border: "1px solid oklch(85% 0.08 155)", borderRadius: 10 }}>
        <div style={{ ...RS.label, color: "oklch(38% 0.14 155)", marginBottom: 6 }}>Whitespace Opportunity</div>
        <p style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.65 }}>{d.whitespace_opportunity}</p>
      </div>

      <WTMFYBox>{d.what_this_means_for_you}</WTMFYBox>
    </SectionShell>
  );
}
