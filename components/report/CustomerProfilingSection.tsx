"use client";

import { useState } from "react";
import { SectionShell, WTMFYBox, Chip, RS, ErrorSection, IndiaBadge } from "../ui/ReportPrimitives";
import type { CustomerProfiling } from "@/lib/schemas";

interface Props {
  data?: { result: CustomerProfiling; modelUsed: string; error?: string };
}

export default function CustomerProfilingSection({ data }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  if (!data) return <ErrorSection number={3} label="Customer Profiles" error="Module data not available" />;
  if (data.error) return <ErrorSection number={3} label="Customer Profiles" error={data.error} />;
  const d = data.result;
  const p = d.personas[activeTab];

  return (
    <SectionShell id="customer-profiling" number={3} title="Customer Profiles" summary={d.plain_english_summary} modelUsed={data.modelUsed}>
      {/* Persona tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {d.personas.map((persona, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            style={{
              padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", border: "1px solid",
              background: activeTab === i ? "var(--accent)" : "var(--bg-card)",
              color: activeTab === i ? "#fff" : "var(--ink-2)",
              borderColor: activeTab === i ? "var(--accent)" : "var(--rule)",
              transition: "all 0.15s",
            }}
          >
            {persona.name}
          </button>
        ))}
      </div>

      {p && (
        <div style={{ background: "#fff", border: "1px solid var(--rule)", borderRadius: 12, padding: "22px 24px", marginBottom: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 20, fontWeight: 400, color: "var(--ink)", marginBottom: 4 }}>{p.name}</div>
            <div style={{ fontSize: 13, color: "var(--ink-3)" }}>{p.occupation} · {p.age_range}</div>
          </div>

          <div className="two-col-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 16 }}>
            <div>
              <div style={{ ...RS.label, marginBottom: 8, color: "oklch(38% 0.14 155)" }}>Goals</div>
              <ul style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
                {p.goals.map((g, i) => (
                  <li key={i} style={{ fontSize: 13, color: "var(--ink-2)", display: "flex", gap: 8 }}>
                    <span style={{ color: "var(--green)", flexShrink: 0 }}>✓</span>{g}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div style={{ ...RS.label, marginBottom: 8, color: "oklch(40% 0.16 22)" }}>Pain Points</div>
              <ul style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
                {p.pain_points.map((pain, i) => (
                  <li key={i} style={{ fontSize: 13, color: "var(--ink-2)", display: "flex", gap: 8 }}>
                    <span style={{ color: "oklch(50% 0.16 22)", flexShrink: 0 }}>✗</span>{pain}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="two-col-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: p.monthly_income_inr ? 16 : 0 }}>
            <div>
              <div style={{ ...RS.label, marginBottom: 8 }}>Where to Find Them</div>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                {p.where_to_find_them.map((w, i) => <Chip key={i} label={w} color="blue" />)}
              </div>
            </div>
            <div>
              <div style={{ ...RS.label, marginBottom: 8 }}>Willingness to Pay</div>
              <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6 }}>{p.willingness_to_pay}</p>
            </div>
          </div>

          {/* India Intelligence fields */}
          {(p.monthly_income_inr || p.tier_city || p.preferred_payment_method || p.where_to_find_them_india) && (
            <div style={{ borderTop: "1px solid #FF993330", paddingTop: 14, marginTop: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <IndiaBadge />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: p.where_to_find_them_india ? 12 : 0 }}>
                {p.monthly_income_inr && (
                  <div>
                    <div style={{ ...RS.label, marginBottom: 4 }}>Monthly Income</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{p.monthly_income_inr}</div>
                  </div>
                )}
                {p.tier_city && (
                  <div>
                    <div style={{ ...RS.label, marginBottom: 4 }}>City Tier</div>
                    <Chip label={p.tier_city} color="blue" />
                  </div>
                )}
                {p.preferred_payment_method && (
                  <div>
                    <div style={{ ...RS.label, marginBottom: 4 }}>Preferred Payment</div>
                    <div style={{ fontSize: 13, color: "var(--ink-2)" }}>{p.preferred_payment_method}</div>
                  </div>
                )}
                {p.language_preference && (
                  <div>
                    <div style={{ ...RS.label, marginBottom: 4 }}>Language</div>
                    <div style={{ fontSize: 13, color: "var(--ink-2)" }}>{p.language_preference}</div>
                  </div>
                )}
              </div>
              {p.where_to_find_them_india && p.where_to_find_them_india.length > 0 && (
                <div>
                  <div style={{ ...RS.label, marginBottom: 8 }}>🇮🇳 Where to Find Them in India</div>
                  <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                    {p.where_to_find_them_india.map((w, i) => (
                      <span key={i} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 99, background: "#FF993315", color: "#cc7a00", border: "1px solid #FF993340", fontWeight: 500 }}>{w}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div style={{ padding: "16px 18px", background: "oklch(96% 0.06 80)", border: "1px solid oklch(88% 0.09 80)", borderRadius: 10, marginBottom: 4 }}>
        <div style={{ ...RS.label, color: "oklch(42% 0.14 80)", marginBottom: 6 }}>Your Early Adopter</div>
        <p style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.65 }}>{d.early_adopter_profile}</p>
      </div>

      <WTMFYBox>{d.what_this_means_for_you}</WTMFYBox>
    </SectionShell>
  );
}
