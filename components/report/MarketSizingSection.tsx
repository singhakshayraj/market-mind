"use client";

import { SectionShell, WTMFYBox, Chip, RS, ErrorSection } from "../ui/ReportPrimitives";
import type { MarketSizing } from "@/lib/schemas";

interface Props {
  data?: { result: MarketSizing; modelUsed: string; error?: string };
}

export default function MarketSizingSection({ data }: Props) {
  if (!data) return <ErrorSection number={2} label="Market Sizing" error="Module data not available" />;
  if (data.error) return <ErrorSection number={2} label="Market Sizing" error={data.error} />;
  const d = data.result;

  const confidenceColor = d.confidence_level === "high" ? "green" : d.confidence_level === "medium" ? "amber" : "red";

  const markets = [
    { acronym: "TAM", name: "Total Addressable Market", sub: "Everyone who could ever buy this", val: d.tam },
    { acronym: "SAM", name: "Serviceable Addressable Market", sub: "The segment you can reach", val: d.sam },
    { acronym: "SOM", name: "Serviceable Obtainable Market", sub: "Your realistic first-year slice", val: d.som },
  ];

  return (
    <SectionShell id="market-sizing" number={2} title="Market Sizing" summary={d.plain_english_summary} modelUsed={data.modelUsed}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
        {markets.map(({ acronym, name, sub, val }) => (
          <div key={acronym} style={{ background: "#fff", border: "1px solid var(--rule)", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "var(--accent)", marginBottom: 4 }}>{acronym}</div>
            <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(20px,2vw,26px)", fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.02em", marginBottom: 4 }}>{val.value}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-2)", marginBottom: 6 }}>{name}</div>
            <p style={{ fontSize: 12, color: "var(--ink-3)", lineHeight: 1.5 }}>{sub}</p>
            <p style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.5, marginTop: 8 }}>{val.explanation}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={RS.label}>Confidence</span>
        <Chip label={d.confidence_level} color={confidenceColor as "green" | "amber" | "red"} />
      </div>

      {d.data_sources.length > 0 && (
        <div>
          <div style={{ ...RS.label, marginBottom: 8 }}>Sources</div>
          <ul style={{ display: "flex", flexDirection: "column" as const, gap: 4 }}>
            {d.data_sources.map((s, i) => (
              <li key={i} style={{ fontSize: 12, color: "var(--ink-3)", display: "flex", gap: 6 }}>
                <span style={{ color: "var(--ink-3)", flexShrink: 0 }}>[{i + 1}]</span>{s}
              </li>
            ))}
          </ul>
        </div>
      )}

      <WTMFYBox>{d.what_this_means_for_you}</WTMFYBox>
    </SectionShell>
  );
}
