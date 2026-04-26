"use client";

import { useState, useEffect } from "react";
import IdeaDecoderSection from "./IdeaDecoderSection";
import MarketSizingSection from "./MarketSizingSection";
import CustomerProfilingSection from "./CustomerProfilingSection";
import CompetitorLandscapeSection from "./CompetitorLandscapeSection";
import ProblemValidationSection from "./ProblemValidationSection";
import BusinessModelSection from "./BusinessModelSection";
import GoToMarketSection from "./GoToMarketSection";
import RiskRadarSection from "./RiskRadarSection";
import TrendTimingSection from "./TrendTimingSection";
import InvestorLensSection from "./InvestorLensSection";
import DigitalMarketingSection from "./DigitalMarketingSection";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  report: Record<string, any>;
}

const NAV_ITEMS = [
  { id: "idea-decoder",          num: 1,  label: "Idea Decoder" },
  { id: "market-sizing",         num: 2,  label: "Market Sizing" },
  { id: "customer-profiling",    num: 3,  label: "Customer Profiles" },
  { id: "competitor-landscape",  num: 4,  label: "Competitor Map" },
  { id: "problem-validation",    num: 5,  label: "Problem Validation" },
  { id: "business-model",        num: 6,  label: "Business Model" },
  { id: "go-to-market",          num: 7,  label: "Go-to-Market" },
  { id: "risk-radar",            num: 8,  label: "Risk Radar", locked: true },
  { id: "trend-timing",          num: 9,  label: "Trend & Timing", locked: true },
  { id: "investor-lens",         num: 10, label: "Investor Lens", locked: true },
  { id: "digital-marketing",     num: 11, label: "Digital Marketing" },
];

function useReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return progress;
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const listener = () => {
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(ids[i]);
          return;
        }
      }
      setActive(ids[0]);
    };
    window.addEventListener("scroll", listener, { passive: true });
    return () => window.removeEventListener("scroll", listener);
  }, [ids]);
  return [active, setActive] as const;
}

export default function ReportClient({ report }: Props) {
  const modules = report.modules ?? {};
  const progress = useReadingProgress();
  const sectionIds = NAV_ITEMS.map((n) => n.id);
  const [activeSection, setActiveSection] = useActiveSection(sectionIds);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const pvData = modules["05-problem-validation"]?.result;
  const validationScore = pvData?.score ?? null;

  const idData = modules["01-idea-decoder"]?.result;
  const msData = modules["02-market-sizing"]?.result;

  const readMins = Math.ceil(Object.keys(modules).length * 1.5);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch(`/api/export/${report.id}`);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `marketmind-report-${report.id.slice(0, 8)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("PDF export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", fontFamily: "'DM Sans',sans-serif" }}>
      {/* Reading progress */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, zIndex: 100, background: "var(--rule)" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: "var(--accent)", transition: "width 0.1s linear" }} />
      </div>

      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        height: 60, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px",
        background: "oklch(98% 0.01 258 / 0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--rule)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--ink)", textDecoration: "none" }}>
            <span style={{ fontSize: 13 }}>←</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-2)" }}>New idea</span>
          </a>
          <span style={{ width: 1, height: 16, background: "var(--rule)" }} />
          <span style={{ fontSize: 13, color: "var(--ink)", fontWeight: 500, maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {idData?.industry ?? report.industry ?? "Market Research"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {validationScore !== null && (
            <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 99, background: "oklch(95% 0.06 155)", color: "oklch(38% 0.14 155)", border: "1px solid oklch(85% 0.08 155)" }}>
              {validationScore}/100 Validation
            </span>
          )}
          <button onClick={handleShare} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, background: "var(--bg-card)", border: "1px solid var(--rule)", color: "var(--ink-2)", cursor: "pointer" }}>
            {copied ? "Copied!" : "Share"}
          </button>
          <button onClick={handleExport} disabled={exporting} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, background: "var(--accent)", color: "#fff", border: "none", cursor: exporting ? "not-allowed" : "pointer", opacity: exporting ? 0.7 : 1 }}>
            {exporting ? "Exporting…" : "Export PDF"}
          </button>
        </div>
      </header>

      <div style={{ display: "flex", maxWidth: 1200, margin: "0 auto" }}>
        {/* Left Nav */}
        <nav style={{
          width: 252, flexShrink: 0,
          position: "sticky", top: 60, alignSelf: "flex-start",
          height: "calc(100vh - 60px)", overflowY: "auto",
          padding: "28px 16px 24px",
          borderRight: "1px solid var(--rule)",
          display: "flex", flexDirection: "column",
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 12, paddingLeft: 8 }}>
            Report Contents
          </div>
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            const isLocked = item.locked;
            return (
              <button
                key={item.id}
                onClick={() => !isLocked && scrollTo(item.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "7px 10px", borderRadius: 8, border: "none",
                  background: isActive ? "var(--accent-lt)" : "transparent",
                  color: isActive ? "var(--accent)" : isLocked ? "var(--ink-3)" : "var(--ink-2)",
                  fontSize: 13, fontWeight: isActive ? 600 : 400, textAlign: "left",
                  cursor: isLocked ? "default" : "pointer",
                  opacity: isLocked ? 0.5 : 1,
                  transition: "all 0.15s",
                  width: "100%", marginBottom: 2,
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 600, color: isActive ? "var(--accent)" : "var(--ink-3)", minWidth: 16 }}>
                  {item.num.toString().padStart(2, "0")}
                </span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {isLocked && <span style={{ fontSize: 11 }}>🔒</span>}
              </button>
            );
          })}

          {/* Upgrade nudge */}
          <div style={{ marginTop: "auto", paddingTop: 24 }}>
            <div style={{ padding: "14px 14px", borderRadius: 10, background: "var(--accent-lt)", border: "1px solid var(--accent-md)" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", marginBottom: 4 }}>Unlock 3 more modules</div>
              <div style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.5, marginBottom: 10 }}>Risk Radar, Trend & Timing, and Investor Lens are available on Pro.</div>
              <button style={{ width: "100%", padding: "7px 0", borderRadius: 7, background: "var(--accent)", color: "#fff", fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer" }}>
                Upgrade to Pro
              </button>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main style={{ flex: 1, minWidth: 0, padding: "40px 40px 80px" }}>
          {/* Report title block */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {(idData?.industry ?? report.industry) && (
                <span style={{ fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 99, background: "var(--bg-card)", border: "1px solid var(--rule)", color: "var(--ink-2)" }}>
                  {idData?.industry ?? report.industry}
                </span>
              )}
              {(idData?.geography ?? report.geography) && (
                <span style={{ fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 99, background: "var(--bg-card)", border: "1px solid var(--rule)", color: "var(--ink-2)" }}>
                  {idData?.geography ?? report.geography}
                </span>
              )}
            </div>
            <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(26px,3.5vw,40px)", fontWeight: 400, letterSpacing: "-0.03em", color: "var(--ink)", lineHeight: 1.1, marginBottom: 12 }}>
              {idData?.plain_english_summary?.slice(0, 80) ?? "Your Market Research Report"}
            </h1>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--ink-2)", fontWeight: 300, maxWidth: 600, marginBottom: 28 }}>
              {idData?.value_proposition ?? report.idea_text?.slice(0, 200)}
            </p>
            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12 }}>
              {validationScore !== null && (
                <StatCard label="Validation Score" value={`${validationScore}/100`} color="var(--green)" />
              )}
              {msData?.tam && (
                <StatCard label="Total Market (TAM)" value={msData.tam.value} />
              )}
              <StatCard label="Est. Read Time" value={`${readMins} min`} />
              <StatCard label="Modules Run" value={`${Object.keys(modules).length}/10`} />
            </div>
          </div>

          {/* Sections */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <IdeaDecoderSection data={modules["01-idea-decoder"]} />
            <MarketSizingSection data={modules["02-market-sizing"]} />
            <CustomerProfilingSection data={modules["03-customer-profiling"]} />
            <CompetitorLandscapeSection data={modules["04-competitor-landscape"]} />
            <ProblemValidationSection data={modules["05-problem-validation"]} />
            <BusinessModelSection data={modules["06-business-model"]} />
            <GoToMarketSection data={modules["07-go-to-market"]} />
            <RiskRadarSection data={modules["08-risk-radar"]} />
            <TrendTimingSection data={modules["09-trend-timing"]} />
            <InvestorLensSection data={modules["10-investor-lens"]} />
            <DigitalMarketingSection data={modules["11-digital-marketing"]} />
          </div>

          {/* Bottom CTA */}
          <div style={{ marginTop: 64, padding: "40px 40px", borderRadius: 16, background: "var(--ink)", textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(70% 0.04 258)", marginBottom: 12 }}>Unlock the full report</div>
            <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(22px,2.5vw,30px)", fontWeight: 400, color: "#fff", marginBottom: 10, letterSpacing: "-0.02em" }}>
              3 modules still locked
            </h2>
            <p style={{ fontSize: 14, color: "oklch(75% 0.03 258)", lineHeight: 1.6, maxWidth: 400, margin: "0 auto 24px" }}>
              Risk Radar, Trend & Timing, and Investor Lens reveal the risks, market timing, and VC potential of your idea.
            </p>
            <button style={{ padding: "12px 28px", borderRadius: 10, background: "var(--accent)", color: "#fff", fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer" }}>
              Upgrade to Pro — $29/mo
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ padding: "14px 16px", borderRadius: 10, background: "#fff", border: "1px solid var(--rule)", display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)" }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 600, color: color ?? "var(--ink)", letterSpacing: "-0.02em" }}>{value}</div>
    </div>
  );
}
