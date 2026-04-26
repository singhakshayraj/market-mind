"use client";

import { SectionShell, WTMFYBox, ScoreBar, RS, ErrorSection } from "../ui/ReportPrimitives";
import type { ProblemValidation } from "@/lib/schemas";

interface Props {
  data?: { result: ProblemValidation; modelUsed: string; error?: string };
}

const verdictConfig = {
  weak:       { label: "Weak Problem",       bg: "oklch(96% 0.05 22)",  border: "oklch(88% 0.08 22)",  text: "oklch(40% 0.16 22)" },
  moderate:   { label: "Moderate Problem",   bg: "oklch(96% 0.06 80)",  border: "oklch(88% 0.09 80)",  text: "oklch(42% 0.14 80)" },
  strong:     { label: "Strong Problem",     bg: "oklch(95% 0.06 155)", border: "oklch(85% 0.08 155)", text: "oklch(38% 0.14 155)" },
  very_strong:{ label: "Very Strong Problem",bg: "var(--accent-lt)",    border: "var(--accent-md)",    text: "var(--accent)" },
};

export default function ProblemValidationSection({ data }: Props) {
  if (!data) return <ErrorSection number={5} label="Problem Validation" error="Module data not available" />;
  if (data.error) return <ErrorSection number={5} label="Problem Validation" error={data.error} />;
  const d = data.result;
  const vc = verdictConfig[d.verdict];

  return (
    <SectionShell id="problem-validation" number={5} title="Problem Validation Score" summary={d.plain_english_summary} modelUsed={data.modelUsed}>
      {/* Score hero */}
      <div style={{ display: "flex", alignItems: "center", gap: 28, padding: "24px 28px", border: `1px solid ${vc.border}`, background: vc.bg, borderRadius: 12, marginBottom: 24 }}>
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 56, fontWeight: 400, color: vc.text, lineHeight: 1 }}>{d.score}</div>
          <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>out of 100</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: vc.text, marginBottom: 10 }}>{vc.label}</div>
          <div style={{ height: 6, background: "var(--rule)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${d.score}%`, background: vc.text, borderRadius: 99, transition: "width 1s cubic-bezier(0.16,1,0.3,1)" }} />
          </div>
        </div>
      </div>

      {/* Dimensions */}
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 14, marginBottom: 24 }}>
        {d.dimensions.map((dim, i) => (
          <div key={i}>
            <ScoreBar label={dim.name} value={dim.score} max={10} color="var(--accent)" />
            <p style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4, lineHeight: 1.5 }}>{dim.reasoning}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 4 }}>
        <div>
          <div style={{ ...RS.label, color: "oklch(38% 0.14 155)", marginBottom: 8 }}>Evidence For</div>
          <ul style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
            {d.key_evidence_for.map((e, i) => (
              <li key={i} style={{ fontSize: 13, color: "var(--ink-2)", display: "flex", gap: 8, lineHeight: 1.5 }}>
                <span style={{ color: "var(--green)", flexShrink: 0 }}>✓</span>{e}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div style={{ ...RS.label, color: "oklch(40% 0.16 22)", marginBottom: 8 }}>Evidence Against</div>
          <ul style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
            {d.key_evidence_against.map((e, i) => (
              <li key={i} style={{ fontSize: 13, color: "var(--ink-2)", display: "flex", gap: 8, lineHeight: 1.5 }}>
                <span style={{ color: "oklch(50% 0.16 22)", flexShrink: 0 }}>✗</span>{e}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <WTMFYBox>{d.what_this_means_for_you}</WTMFYBox>
    </SectionShell>
  );
}
