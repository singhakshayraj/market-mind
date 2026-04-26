"use client";

import { useState } from "react";
import { SectionShell, WTMFYBox, Chip, RS, ErrorSection } from "../ui/ReportPrimitives";
import type { BusinessModel } from "@/lib/schemas";

interface Props {
  data?: { result: BusinessModel; modelUsed: string; error?: string };
}

export default function BusinessModelSection({ data }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  if (!data) return <ErrorSection number={6} label="Business Model" error="Module data not available" />;
  if (data.error) return <ErrorSection number={6} label="Business Model" error={data.error} />;
  const d = data.result;
  const m = d.models[activeTab];

  const complexityColor = { low: "green", medium: "amber", high: "red" } as const;

  return (
    <SectionShell id="business-model" number={6} title="Business Model Options" summary={d.plain_english_summary} modelUsed={data.modelUsed}>
      {/* Model tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {d.models.map((model, i) => {
          const isRec = model.name === d.recommended_model;
          const isActive = activeTab === i;
          return (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              style={{
                padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", border: "1px solid",
                background: isActive ? "var(--accent)" : isRec ? "var(--accent-lt)" : "var(--bg-card)",
                color: isActive ? "#fff" : isRec ? "var(--accent)" : "var(--ink-2)",
                borderColor: isActive ? "var(--accent)" : isRec ? "var(--accent-md)" : "var(--rule)",
                transition: "all 0.15s",
              }}
            >
              {model.name}
              {isRec && !isActive && <span style={{ marginLeft: 6, fontSize: 10 }}>★</span>}
            </button>
          );
        })}
      </div>

      {m && (
        <div style={{ background: "#fff", border: `1px solid ${m.name === d.recommended_model ? "var(--accent-md)" : "var(--rule)"}`, borderRadius: 12, padding: "20px 22px", marginBottom: 20 }}>
          {m.name === d.recommended_model && (
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "var(--accent)", marginBottom: 8 }}>★ Recommended Model</div>
          )}
          <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.65, marginBottom: 16 }}>{m.description}</p>

          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <Chip label={`${m.complexity} complexity`} color={complexityColor[m.complexity]} />
            <Chip label={m.estimated_time_to_revenue} color="neutral" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 16 }}>
            <div>
              <div style={{ ...RS.label, color: "oklch(38% 0.14 155)", marginBottom: 8 }}>Pros</div>
              <ul style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
                {m.pros.map((p, i) => (
                  <li key={i} style={{ fontSize: 13, color: "var(--ink-2)", display: "flex", gap: 6 }}>
                    <span style={{ color: "var(--green)", flexShrink: 0 }}>+</span>{p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div style={{ ...RS.label, color: "oklch(40% 0.16 22)", marginBottom: 8 }}>Cons</div>
              <ul style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
                {m.cons.map((c, i) => (
                  <li key={i} style={{ fontSize: 13, color: "var(--ink-2)", display: "flex", gap: 6 }}>
                    <span style={{ color: "oklch(50% 0.16 22)", flexShrink: 0 }}>−</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {m.example_companies.length > 0 && (
            <div style={{ fontSize: 12, color: "var(--ink-3)" }}>
              Similar to: {m.example_companies.join(", ")}
            </div>
          )}
        </div>
      )}

      <div style={{ padding: "16px 18px", background: "oklch(96% 0.06 80)", border: "1px solid oklch(88% 0.09 80)", borderRadius: 10 }}>
        <div style={{ ...RS.label, color: "oklch(42% 0.14 80)", marginBottom: 6 }}>Unit Economics Example</div>
        <p style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.65 }}>{d.unit_economics_example}</p>
      </div>

      <WTMFYBox>{d.what_this_means_for_you}</WTMFYBox>
    </SectionShell>
  );
}
