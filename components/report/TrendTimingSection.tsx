"use client";

import { SectionShell, WTMFYBox, Chip, RS, ErrorSection } from "../ui/ReportPrimitives";
import type { TrendTiming } from "@/lib/schemas";

interface Props {
  data?: { result: TrendTiming; modelUsed: string; error?: string };
}

const verdictConfig = {
  too_early:    { label: "Too Early",    color: "amber" as const, desc: "The market isn't ready yet — but you can be first" },
  good_timing:  { label: "Good Timing",  color: "green" as const, desc: "The timing is right — move now" },
  peak_timing:  { label: "Peak Timing",  color: "blue" as const,  desc: "The market is hot — differentiation is key" },
  late:         { label: "Late",         color: "red" as const,   desc: "The market is saturated — you'll need a specific angle" },
};

export default function TrendTimingSection({ data }: Props) {
  if (!data) return <ErrorSection number={9} label="Trend & Timing" error="Module data not available" />;
  if (data.error) return <ErrorSection number={9} label="Trend & Timing" error={data.error} />;
  const d = data.result;
  const vc = verdictConfig[d.timing_verdict];

  return (
    <SectionShell id="trend-timing" number={9} title="Trend & Timing Analysis" summary={d.plain_english_summary} modelUsed={data.modelUsed}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 22px", background: "var(--bg-card)", border: "1px solid var(--rule)", borderRadius: 12, marginBottom: 24 }}>
        <Chip label={vc.label} color={vc.color} />
        <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.5 }}>{vc.desc}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div>
          <div style={{ ...RS.label, color: "oklch(38% 0.14 155)", marginBottom: 10 }}>Tailwinds (helping you)</div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
            {d.tailwinds.map((t, i) => (
              <div key={i} style={{ padding: "12px 14px", background: "var(--green-lt)", border: "1px solid oklch(85% 0.08 155)", borderRadius: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>{t.trend}</div>
                <p style={{ fontSize: 12, color: "var(--ink-3)", lineHeight: 1.5 }}>{t.explanation}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ ...RS.label, color: "oklch(40% 0.16 22)", marginBottom: 10 }}>Headwinds (working against you)</div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
            {d.headwinds.map((h, i) => (
              <div key={i} style={{ padding: "12px 14px", background: "oklch(96% 0.05 22)", border: "1px solid oklch(88% 0.08 22)", borderRadius: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>{h.trend}</div>
                <p style={{ fontSize: 12, color: "var(--ink-3)", lineHeight: 1.5 }}>{h.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {d.notable_recent_developments.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ ...RS.label, marginBottom: 10 }}>Recent Developments</div>
          <ul style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
            {d.notable_recent_developments.map((dev, i) => (
              <li key={i} style={{ fontSize: 13, color: "var(--ink-2)", display: "flex", gap: 8, lineHeight: 1.5 }}>
                <span style={{ color: "var(--accent)", flexShrink: 0 }}>•</span>{dev}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ fontSize: 12, color: "var(--ink-3)" }}>
        <span style={{ fontWeight: 600 }}>Market stage: </span>{d.market_maturity_stage}
      </div>

      <WTMFYBox>{d.what_this_means_for_you}</WTMFYBox>
    </SectionShell>
  );
}
