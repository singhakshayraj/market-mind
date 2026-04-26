"use client";

import { SectionShell, WTMFYBox, Chip, RS, ErrorSection } from "../ui/ReportPrimitives";
import type { IdeaDecoder } from "@/lib/schemas";

interface Props {
  data?: { result: IdeaDecoder; modelUsed: string; error?: string };
}

export default function IdeaDecoderSection({ data }: Props) {
  if (!data) return <ErrorSection number={1} label="Idea Decoder" error="Module data not available" />;
  if (data.error) return <ErrorSection number={1} label="Idea Decoder" error={data.error} />;
  const d = data.result;

  const rows = [
    { icon: "🎯", label: "Problem", text: d.problem_statement },
    { icon: "💡", label: "Solution", text: d.solution },
    { icon: "👤", label: "Target Customer", text: d.target_customer },
    { icon: "⭐", label: "Value Proposition", text: d.value_proposition },
  ];

  return (
    <SectionShell id="idea-decoder" number={1} title="Idea Decoder" summary={d.plain_english_summary} modelUsed={data.modelUsed}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, marginBottom: 20 }}>
        {rows.map((r) => (
          <div key={r.label} style={{ background: "#fff", border: "1px solid var(--rule)", borderRadius: 10, padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 16 }}>{r.icon}</span>
              <span style={RS.label}>{r.label}</span>
            </div>
            <p style={RS.body}>{r.text}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
        <span style={RS.label}>Stage</span>
        <Chip label={d.stage} color="blue" />
        {d.industry && <><span style={RS.label}>Industry</span><Chip label={d.industry} color="neutral" /></>}
        {d.geography && <><span style={RS.label}>Geography</span><Chip label={d.geography} color="neutral" /></>}
      </div>

      {d.key_assumptions.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ ...RS.label, marginBottom: 10 }}>Key Assumptions</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {d.key_assumptions.map((a, i) => <Chip key={i} label={a} color="amber" />)}
          </div>
        </div>
      )}

      <WTMFYBox>{d.what_this_means_for_you}</WTMFYBox>
    </SectionShell>
  );
}
