"use client";

import { SectionShell, WTMFYBox, Chip, RS, ErrorSection, IndiaBadge } from "../ui/ReportPrimitives";
import type { GoToMarket } from "@/lib/schemas";

interface Props {
  data?: { result: GoToMarket; modelUsed: string; error?: string };
}

export default function GoToMarketSection({ data }: Props) {
  if (!data) return <ErrorSection number={7} label="Go-to-Market" error="Module data not available" />;
  if (data.error) return <ErrorSection number={7} label="Go-to-Market" error={data.error} />;
  const d = data.result;

  return (
    <SectionShell id="go-to-market" number={7} title="Go-to-Market Playbook" summary={d.plain_english_summary} modelUsed={data.modelUsed}>
      {/* Positioning */}
      <div style={{ padding: "16px 20px", background: "var(--accent-lt)", border: "1px solid var(--accent-md)", borderRadius: 10, marginBottom: 24 }}>
        <div style={{ ...RS.label, color: "var(--accent)", marginBottom: 6 }}>Your Positioning Statement</div>
        <p style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.65, fontWeight: 400 }}>{d.positioning_statement}</p>
      </div>

      {/* 90 day plan */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ ...RS.label, marginBottom: 14 }}>First 90 Days</div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
          {d.first_90_days.map((phase, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid var(--rule)", borderRadius: 10, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "var(--accent)", background: "var(--accent-lt)", padding: "3px 10px", borderRadius: 99 }}>{phase.week_range}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{phase.focus}</span>
              </div>
              <ul style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
                {phase.actions.map((a, j) => (
                  <li key={j} style={{ fontSize: 13, color: "var(--ink-2)", display: "flex", gap: 10, lineHeight: 1.5 }}>
                    <span style={{ color: "var(--accent)", flexShrink: 0 }}>→</span>{a}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Channels */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ ...RS.label, marginBottom: 14 }}>Channels to Focus On</div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
          {d.channels.map((ch, i) => (
            <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--rule)", borderRadius: 10, padding: "14px 18px" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>{ch.channel}</div>
              <p style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 10, lineHeight: 1.5 }}>{ch.why}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 12 }}>
                <div>
                  <span style={{ fontWeight: 600, color: "var(--green)" }}>First step: </span>
                  <span style={{ color: "var(--ink-2)" }}>{ch.how_to_start}</span>
                </div>
                <div>
                  <span style={{ fontWeight: 600, color: "var(--amber)" }}>Expect: </span>
                  <span style={{ color: "var(--ink-2)" }}>{ch.expected_outcome}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* First customer script */}
      <div style={{ padding: "16px 20px", background: "var(--green-lt)", border: "1px solid oklch(85% 0.08 155)", borderRadius: 10, marginBottom: 16 }}>
        <div style={{ ...RS.label, color: "oklch(38% 0.14 155)", marginBottom: 8 }}>Your First Outreach Script</div>
        <p style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.7, fontStyle: "italic" }}>&ldquo;{d.first_customer_script}&rdquo;</p>
      </div>

      <div style={{ padding: "14px 18px", background: "var(--bg-card)", border: "1px solid var(--rule)", borderRadius: 10 }}>
        <span style={{ ...RS.label, marginRight: 8 }}>Key Message</span>
        <span style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>{d.key_message}</span>
      </div>

      {/* India Intelligence */}
      {(d.indian_digital_channels?.length || d.offline_india_channels?.length || d.india_first_customer_playbook) && (
        <div style={{ background: "#fff8f0", border: "1px solid #FF993340", borderRadius: 12, padding: "18px 20px", marginTop: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <IndiaBadge />
            <span style={{ fontSize: 12, color: "var(--ink-3)" }}>India-specific go-to-market tactics</span>
          </div>

          {d.indian_digital_channels && d.indian_digital_channels.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ ...RS.label, marginBottom: 8 }}>Digital Channels (India)</div>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                {d.indian_digital_channels.map((ch, i) => (
                  <span key={i} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 99, background: "#FF993315", color: "#cc7a00", border: "1px solid #FF993340", fontWeight: 500 }}>{ch}</span>
                ))}
              </div>
            </div>
          )}

          {d.offline_india_channels && d.offline_india_channels.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ ...RS.label, marginBottom: 8 }}>Offline Channels (India)</div>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                {d.offline_india_channels.map((ch, i) => (
                  <Chip key={i} label={ch} color="neutral" />
                ))}
              </div>
            </div>
          )}

          {d.india_first_customer_playbook && (
            <div style={{ padding: "12px 16px", background: "#FF993318", border: "1px solid #FF993340", borderRadius: 10 }}>
              <div style={{ ...RS.label, color: "#cc7a00", marginBottom: 6 }}>30-Day India Playbook</div>
              <p style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.7 }}>{d.india_first_customer_playbook}</p>
            </div>
          )}
        </div>
      )}

      <WTMFYBox>{d.what_this_means_for_you}</WTMFYBox>
    </SectionShell>
  );
}
