"use client";

import { useState } from "react";
import { SectionShell, WTMFYBox, Chip, RS, ErrorSection } from "../ui/ReportPrimitives";
import type { DigitalMarketing } from "@/lib/schemas";

interface Props {
  data?: { result: DigitalMarketing; modelUsed: string; error?: string };
}

const platformEmoji: Record<string, string> = {
  facebook: "📘", instagram: "📸", google: "🔍", linkedin: "💼",
  youtube: "▶️", whatsapp: "💬", tiktok: "🎵", twitter: "🐦", seo: "📈",
};

function platformIcon(name: string) {
  const key = Object.keys(platformEmoji).find((k) => name.toLowerCase().includes(k));
  return key ? platformEmoji[key] : "📣";
}

const phases = ["phase_1", "phase_2", "phase_3"] as const;

export default function DigitalMarketingSection({ data }: Props) {
  const [activeChannel, setActiveChannel] = useState(0);
  const [activePhase, setActivePhase] = useState<typeof phases[number]>("phase_1");

  if (!data) return <ErrorSection number={11} label="Digital Marketing Strategy" error="Module data not available" />;
  if (data.error) return <ErrorSection number={11} label="Digital Marketing Strategy" error={data.error} />;
  const d = data.result;
  const ch = d.recommended_channels[activeChannel];

  return (
    <SectionShell id="digital-marketing" number={11} title="Digital Marketing Strategy" summary={d.plain_english_summary} modelUsed={data.modelUsed}>

      {/* Budget summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "#fff", border: "1px solid var(--rule)", borderRadius: 12, padding: "16px 20px" }}>
          <div style={{ ...RS.label, marginBottom: 6 }}>Bootstrapped Monthly Budget</div>
          <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 22, fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.02em" }}>
            {d.total_monthly_budget_estimate.bootstrapped}
          </div>
        </div>
        <div style={{ background: "#fff", border: "1px solid var(--rule)", borderRadius: 12, padding: "16px 20px" }}>
          <div style={{ ...RS.label, marginBottom: 6 }}>Growth Stage Monthly Budget</div>
          <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 22, fontWeight: 400, color: "var(--accent)", letterSpacing: "-0.02em" }}>
            {d.total_monthly_budget_estimate.growth_stage}
          </div>
        </div>
      </div>
      <div style={{ fontSize: 12, color: "var(--ink-3)", lineHeight: 1.6, marginBottom: 28 }}>
        {d.total_monthly_budget_estimate.breakdown_note}
      </div>

      {/* Channel tabs */}
      <div style={{ ...RS.label, marginBottom: 12 }}>Recommended Channels</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
        {d.recommended_channels.map((c, i) => (
          <button key={i} onClick={() => setActiveChannel(i)} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", border: "1px solid",
            background: activeChannel === i ? "var(--accent)" : "var(--bg-card)",
            color: activeChannel === i ? "#fff" : "var(--ink-2)",
            borderColor: activeChannel === i ? "var(--accent)" : "var(--rule)",
            transition: "all 0.15s",
          }}>
            <span>{platformIcon(c.platform)}</span>
            <span>{c.platform}</span>
          </button>
        ))}
      </div>

      {ch && (
        <div style={{ background: "#fff", border: "1px solid var(--rule)", borderRadius: 12, padding: "20px 24px", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 22 }}>{platformIcon(ch.platform)}</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{ch.platform}</div>
              <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{ch.campaign_type}</div>
            </div>
          </div>

          <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6, marginBottom: 16 }}>{ch.why_this_platform}</p>

          {/* Cost metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
            {[
              { label: "CPC (per click)", value: ch.estimated_cpc },
              { label: "CPM (per 1k views)", value: ch.estimated_cpm },
              { label: "CPA (per customer)", value: ch.estimated_cpa },
            ].map(({ label, value }) => (
              <div key={label} style={{ padding: "12px 14px", background: "var(--bg-card)", border: "1px solid var(--rule)", borderRadius: 8, textAlign: "center" }}>
                <div style={{ ...RS.label, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Monthly budget */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ ...RS.label, marginBottom: 10 }}>Monthly Budget Range</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 100, padding: "10px 14px", background: "var(--green-lt)", border: "1px solid oklch(85% 0.08 155)", borderRadius: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "oklch(38% 0.14 155)", marginBottom: 4 }}>Minimum</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{ch.monthly_budget_range.minimum}</div>
              </div>
              <div style={{ flex: 1, minWidth: 100, padding: "10px 14px", background: "var(--accent-lt)", border: "1px solid var(--accent-md)", borderRadius: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "var(--accent)", marginBottom: 4 }}>Recommended</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{ch.monthly_budget_range.recommended}</div>
              </div>
              <div style={{ flex: 1, minWidth: 100, padding: "10px 14px", background: "oklch(96% 0.06 80)", border: "1px solid oklch(88% 0.09 80)", borderRadius: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "oklch(42% 0.14 80)", marginBottom: 4 }}>Growth Stage</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{ch.monthly_budget_range.scale}</div>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 12 }}>
            <div>
              <div style={{ ...RS.label, marginBottom: 6 }}>Targeting Strategy</div>
              <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5 }}>{ch.targeting_strategy}</p>
            </div>
            <div>
              <div style={{ ...RS.label, marginBottom: 6 }}>Creative Strategy</div>
              <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5 }}>{ch.creative_strategy}</p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div style={{ fontSize: 12, color: "var(--ink-3)" }}>
              <span style={{ fontWeight: 600, color: "var(--green)" }}>Expected ROAS: </span>{ch.expected_roas}
            </div>
            <div style={{ fontSize: 12, color: "var(--ink-3)" }}>
              <span style={{ fontWeight: 600, color: "var(--accent)" }}>Time to results: </span>{ch.time_to_results}
            </div>
          </div>
        </div>
      )}

      {/* Launch plan phases */}
      <div style={{ ...RS.label, marginBottom: 12 }}>3-Phase Launch Plan</div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {phases.map((p) => (
          <button key={p} onClick={() => setActivePhase(p)} style={{
            padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", border: "1px solid",
            background: activePhase === p ? "var(--ink)" : "var(--bg-card)",
            color: activePhase === p ? "#fff" : "var(--ink-2)",
            borderColor: activePhase === p ? "var(--ink)" : "var(--rule)",
            transition: "all 0.15s",
          }}>
            {d.launch_campaign_plan[p].name}
          </button>
        ))}
      </div>

      {(() => {
        const phase = d.launch_campaign_plan[activePhase];
        return (
          <div style={{ background: "#fff", border: "1px solid var(--rule)", borderRadius: 12, padding: "18px 22px", marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{phase.objective}</div>
              <Chip label={phase.budget} color="blue" />
            </div>
            <ul style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
              {phase.actions.map((a, i) => (
                <li key={i} style={{ fontSize: 13, color: "var(--ink-2)", display: "flex", gap: 10, lineHeight: 1.5 }}>
                  <span style={{ color: "var(--accent)", flexShrink: 0 }}>→</span>{a}
                </li>
              ))}
            </ul>
          </div>
        );
      })()}

      {/* Funnel breakdown */}
      <div style={{ ...RS.label, marginBottom: 12 }}>Marketing Funnel</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, marginBottom: 24 }}>
        {[
          { stage: "Awareness", text: d.funnel_breakdown.awareness, color: "var(--accent-lt)", border: "var(--accent-md)", labelColor: "var(--accent)" },
          { stage: "Consideration", text: d.funnel_breakdown.consideration, color: "oklch(96% 0.06 80)", border: "oklch(88% 0.09 80)", labelColor: "oklch(42% 0.14 80)" },
          { stage: "Conversion", text: d.funnel_breakdown.conversion, color: "var(--green-lt)", border: "oklch(85% 0.08 155)", labelColor: "oklch(38% 0.14 155)" },
          { stage: "Retention", text: d.funnel_breakdown.retention, color: "var(--bg-card)", border: "var(--rule)", labelColor: "var(--ink-3)" },
        ].map(({ stage, text, color, border, labelColor }) => (
          <div key={stage} style={{ padding: "14px 16px", background: color, border: `1px solid ${border}`, borderRadius: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: labelColor, marginBottom: 6 }}>{stage}</div>
            <p style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.55 }}>{text}</p>
          </div>
        ))}
      </div>

      {/* Organic strategy */}
      <div style={{ padding: "14px 18px", background: "var(--bg-card)", border: "1px solid var(--rule)", borderRadius: 10, marginBottom: 20 }}>
        <div style={{ ...RS.label, marginBottom: 6 }}>Free / Organic Strategy</div>
        <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6 }}>{d.organic_strategy}</p>
      </div>

      {/* Metrics + mistakes */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 4 }}>
        <div>
          <div style={{ ...RS.label, color: "oklch(38% 0.14 155)", marginBottom: 10 }}>Key Metrics to Track</div>
          <ul style={{ display: "flex", flexDirection: "column" as const, gap: 7 }}>
            {d.key_metrics_to_track.map((m, i) => (
              <li key={i} style={{ fontSize: 13, color: "var(--ink-2)", display: "flex", gap: 8, lineHeight: 1.5 }}>
                <span style={{ color: "var(--green)", flexShrink: 0 }}>📊</span>{m}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div style={{ ...RS.label, color: "oklch(40% 0.16 22)", marginBottom: 10 }}>Mistakes to Avoid</div>
          <ul style={{ display: "flex", flexDirection: "column" as const, gap: 7 }}>
            {d.common_mistakes_to_avoid.map((m, i) => (
              <li key={i} style={{ fontSize: 13, color: "var(--ink-2)", display: "flex", gap: 8, lineHeight: 1.5 }}>
                <span style={{ color: "oklch(50% 0.16 22)", flexShrink: 0 }}>⚠️</span>{m}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <WTMFYBox>{d.what_this_means_for_you}</WTMFYBox>
    </SectionShell>
  );
}
