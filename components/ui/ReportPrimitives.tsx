"use client";

import { useState, useEffect } from "react";

/* ── Design tokens (inline style objects matching the design) ── */
export const RS = {
  sectionNum:  { fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "var(--accent)" },
  sectionTitle:{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(22px,2.4vw,28px)", fontWeight: 400, letterSpacing: "-0.02em", color: "var(--ink)", lineHeight: 1.15 },
  summary:     { fontSize: 15, lineHeight: 1.7, color: "var(--ink-2)", fontWeight: 300, maxWidth: 640 },
  label:       { fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "var(--ink-3)" },
  body:        { fontSize: 14, lineHeight: 1.7, color: "var(--ink-2)", fontWeight: 300 },
};

const MODULE_NAMES = [
  "Idea Decoder","Market Sizing","Customer Profiles","Competitor Map","Problem Validation",
  "Business Model","Go-to-Market","Risk Radar","Trend & Timing","Investor Lens","Digital Marketing",
];

/* ── WhatThisMeansForYou ── */
export function WTMFYBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 28, padding: "18px 22px", background: "oklch(96% 0.04 258)", borderLeft: "3px solid var(--accent)", borderRadius: "0 10px 10px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 14 }}>💡</span>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--accent)" }}>What This Means For You</span>
      </div>
      <p style={{ fontSize: 14, lineHeight: 1.75, color: "var(--ink)", fontWeight: 400 }}>{children}</p>
    </div>
  );
}

/* ── SectionShell ── */
export function SectionShell({ id, number, title, summary, children, modelUsed }: {
  id: string; number: number; title: string; summary?: string;
  children: React.ReactNode; modelUsed?: string;
}) {
  return (
    <section id={id} style={{ scrollMarginTop: 80, paddingBottom: 56, borderBottom: "1px solid var(--rule)" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={RS.sectionNum}>Module {number}</span>
          <span style={{ width: 1, height: 12, background: "var(--rule)" }} />
          <span style={{ fontSize: 11, color: "var(--ink-3)", fontWeight: 400, letterSpacing: "0.02em" }}>{MODULE_NAMES[number - 1]}</span>
          {modelUsed && (
            <>
              <span style={{ width: 1, height: 12, background: "var(--rule)" }} />
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "var(--ink-3)" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: modelUsed === "gemini" ? "oklch(58% 0.18 258)" : "oklch(55% 0.17 80)", display: "inline-block" }} />
                {modelUsed === "gemini" ? "Gemini 1.5 Pro" : "Grok-3"}
              </span>
            </>
          )}
        </div>
        <h2 style={RS.sectionTitle}>{title}</h2>
        {summary && <p style={{ ...RS.summary, marginTop: 10 }}>{summary}</p>}
      </div>
      {children}
    </section>
  );
}

/* ── IndiaBadge ── */
export function IndiaBadge() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 7px", borderRadius: 99, fontSize: 10, fontWeight: 700, background: "#FF9933", color: "#fff", letterSpacing: "0.04em", flexShrink: 0 }}>
      🇮🇳 India Data
    </span>
  );
}

/* ── Chip ── */
type ChipColor = "neutral"|"green"|"red"|"amber"|"blue";
export function Chip({ label, color = "neutral" }: { label: string; color?: ChipColor }) {
  const colors: Record<ChipColor, { bg: string; text: string; border: string }> = {
    neutral: { bg: "var(--bg-card)", text: "var(--ink-2)", border: "var(--rule)" },
    green:   { bg: "oklch(95% 0.06 155)", text: "oklch(38% 0.14 155)", border: "oklch(85% 0.08 155)" },
    red:     { bg: "oklch(96% 0.05 22)",  text: "oklch(40% 0.16 22)",  border: "oklch(88% 0.08 22)" },
    amber:   { bg: "oklch(96% 0.06 80)",  text: "oklch(42% 0.14 80)",  border: "oklch(88% 0.09 80)" },
    blue:    { bg: "var(--accent-lt)",    text: "var(--accent)",       border: "var(--accent-md)" },
  };
  const c = colors[color];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 500, background: c.bg, color: c.text, border: `1px solid ${c.border}`, lineHeight: 1.6, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

/* ── ScoreBar ── */
export function ScoreBar({ label, value, max = 100, color = "var(--accent)" }: { label: string; value: number; max?: number; color?: string }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW((value / max) * 100), 120); return () => clearTimeout(t); }, [value, max]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: 13, color: "var(--ink)", fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 13, color: "var(--ink-2)", fontVariantNumeric: "tabular-nums" }}>
          {value}<span style={{ color: "var(--ink-3)", fontSize: 11 }}>/{max}</span>
        </span>
      </div>
      <div style={{ height: 5, background: "var(--rule)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${w}%`, background: color, borderRadius: 99, transition: "width 1s cubic-bezier(0.16,1,0.3,1)" }} />
      </div>
    </div>
  );
}

/* ── InfoCard ── */
export function InfoCard({ icon, title, children, style }: { icon?: string; title?: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "#fff", border: "1px solid var(--rule)", borderRadius: 12, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 10, ...style }}>
      {icon && <span style={{ fontSize: 20 }}>{icon}</span>}
      {title && <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.01em" }}>{title}</div>}
      {children}
    </div>
  );
}

/* ── ErrorSection ── */
export function ErrorSection({ number, label, error }: { number: number; label: string; error: string }) {
  return (
    <section style={{ scrollMarginTop: 80, paddingBottom: 56, borderBottom: "1px solid var(--rule)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <span style={RS.sectionNum}>Module {number}</span>
        <span style={{ width: 1, height: 12, background: "var(--rule)" }} />
        <span style={{ fontSize: 11, color: "var(--ink-3)" }}>{label}</span>
      </div>
      <div style={{ padding: "20px", background: "oklch(96% 0.05 22)", border: "1px solid oklch(88% 0.08 22)", borderRadius: 10 }}>
        <p style={{ fontSize: 13, color: "oklch(40% 0.16 22)" }}>This module encountered an error: {error}</p>
      </div>
    </section>
  );
}
