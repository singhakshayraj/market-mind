"use client";

import { SectionShell, WTMFYBox, ScoreBar, Chip, RS, ErrorSection } from "../ui/ReportPrimitives";
import type { InvestorLens } from "@/lib/schemas";

interface Props {
  data?: { result: InvestorLens; modelUsed: string; error?: string };
}

export default function InvestorLensSection({ data }: Props) {
  if (!data) return <ErrorSection number={10} label="Investor Lens" error="Module data not available" />;
  if (data.error) return <ErrorSection number={10} label="Investor Lens" error={data.error} />;
  const d = data.result;

  const scoreColor = d.vc_attractiveness_score >= 7 ? "oklch(50% 0.18 155)" : d.vc_attractiveness_score >= 5 ? "var(--amber)" : "oklch(50% 0.16 22)";

  return (
    <SectionShell id="investor-lens" number={10} title="Investor Lens" summary={d.plain_english_summary} modelUsed={data.modelUsed}>
      {/* VC Score */}
      <div style={{ display: "flex", alignItems: "center", gap: 28, padding: "20px 24px", background: "#fff", border: "1px solid var(--rule)", borderRadius: 12, marginBottom: 24 }}>
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 48, fontWeight: 400, color: scoreColor, lineHeight: 1 }}>
            {d.vc_attractiveness_score}
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>out of 10</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 10 }}>{d.thesis_fit}</div>
          <ScoreBar label="VC Attractiveness" value={d.vc_attractiveness_score} max={10} color={scoreColor} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div>
          <div style={{ ...RS.label, color: "oklch(38% 0.14 155)", marginBottom: 10 }}>What VCs Will Love</div>
          <ul style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
            {d.what_vcs_love.map((w, i) => (
              <li key={i} style={{ fontSize: 13, color: "var(--ink-2)", display: "flex", gap: 8, lineHeight: 1.5 }}>
                <span style={{ color: "var(--green)", flexShrink: 0 }}>✓</span>{w}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div style={{ ...RS.label, color: "oklch(40% 0.16 22)", marginBottom: 10 }}>Red Flags</div>
          <ul style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
            {d.red_flags.map((rf, i) => (
              <li key={i} style={{ fontSize: 13, color: "var(--ink-2)", display: "flex", gap: 8, lineHeight: 1.5 }}>
                <span style={{ color: "oklch(50% 0.16 22)", flexShrink: 0 }}>✗</span>{rf}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ ...RS.label, color: "oklch(42% 0.14 80)", marginBottom: 10 }}>Questions VCs Will Ask You</div>
        <ol style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
          {d.questions_vcs_will_ask.map((q, i) => (
            <li key={i} style={{ fontSize: 13, color: "var(--ink-2)", display: "flex", gap: 10, lineHeight: 1.5 }}>
              <span style={{ fontWeight: 700, color: "var(--amber)", flexShrink: 0, minWidth: 18 }}>{i + 1}.</span>{q}
            </li>
          ))}
        </ol>
      </div>

      {d.comparable_funded_companies.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ ...RS.label, marginBottom: 10 }}>Comparable Funded Companies</div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
            {d.comparable_funded_companies.map((c, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid var(--rule)", borderRadius: 10, padding: "12px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{c.name}</span>
                  <Chip label={c.funding} color="blue" />
                </div>
                <p style={{ fontSize: 12, color: "var(--ink-3)", lineHeight: 1.5 }}>{c.relevance}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ padding: "14px 18px", background: d.bootstrappable ? "var(--green-lt)" : "oklch(96% 0.06 80)", border: `1px solid ${d.bootstrappable ? "oklch(85% 0.08 155)" : "oklch(88% 0.09 80)"}`, borderRadius: 10 }}>
        <div style={{ ...RS.label, color: d.bootstrappable ? "oklch(38% 0.14 155)" : "oklch(42% 0.14 80)", marginBottom: 6 }}>
          {d.bootstrappable ? "Bootstrappable" : "Likely Needs Funding"}
        </div>
        <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6 }}>{d.bootstrappable_reason}</p>
      </div>

      <WTMFYBox>{d.what_this_means_for_you}</WTMFYBox>
    </SectionShell>
  );
}
