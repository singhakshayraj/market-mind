"use client";

import { useState } from "react";
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

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  report: Record<string, any>;
}

const NAV_ITEMS = [
  { id: "idea-decoder", label: "Idea Decoder", emoji: "💡" },
  { id: "market-sizing", label: "Market Sizing", emoji: "📊" },
  { id: "customer-profiling", label: "Customer Profiles", emoji: "👥" },
  { id: "competitor-landscape", label: "Competitors", emoji: "🗺️" },
  { id: "problem-validation", label: "Problem Validation", emoji: "✅" },
  { id: "business-model", label: "Business Model", emoji: "💰" },
  { id: "go-to-market", label: "Go-to-Market", emoji: "🚀" },
  { id: "risk-radar", label: "Risk Radar", emoji: "⚠️" },
  { id: "trend-timing", label: "Trends & Timing", emoji: "📈" },
  { id: "investor-lens", label: "Investor Lens", emoji: "🔭" },
];

export default function ReportClient({ report }: Props) {
  const [activeSection, setActiveSection] = useState("idea-decoder");
  const [exporting, setExporting] = useState(false);
  const modules = report.modules ?? {};

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
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
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <div>
          <span className="font-bold text-indigo-400">MarketMind AI</span>
          <span className="text-slate-500 text-sm ml-3 hidden md:inline">
            {report.idea_text?.slice(0, 60)}...
          </span>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition flex items-center gap-2"
        >
          {exporting ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating PDF...
            </>
          ) : (
            "Export PDF"
          )}
        </button>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Left navigation */}
        <nav className="hidden lg:flex flex-col w-56 shrink-0 sticky top-14 self-start h-[calc(100vh-3.5rem)] overflow-y-auto pt-6 pb-6 px-3 border-r border-slate-800">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition mb-1 ${
                activeSection === item.id
                  ? "bg-indigo-600/20 text-indigo-300"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <span>{item.emoji}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Report content */}
        <main className="flex-1 px-4 md:px-8 py-8 max-w-4xl">
          <div className="mb-8 p-6 bg-slate-800/40 rounded-2xl border border-slate-700">
            <h1 className="text-2xl font-bold text-white mb-2">Your Market Research Report</h1>
            <p className="text-slate-400 text-sm">
              Generated {new Date(report.created_at).toLocaleDateString("en-GB", {
                day: "numeric", month: "long", year: "numeric",
              })} · {report.geography ?? "Global"} · {report.industry ?? "General"}
            </p>
          </div>

          <div className="space-y-8">
            <div id="idea-decoder">
              <IdeaDecoderSection data={modules["01-idea-decoder"]} />
            </div>
            <div id="market-sizing">
              <MarketSizingSection data={modules["02-market-sizing"]} />
            </div>
            <div id="customer-profiling">
              <CustomerProfilingSection data={modules["03-customer-profiling"]} />
            </div>
            <div id="competitor-landscape">
              <CompetitorLandscapeSection data={modules["04-competitor-landscape"]} />
            </div>
            <div id="problem-validation">
              <ProblemValidationSection data={modules["05-problem-validation"]} />
            </div>
            <div id="business-model">
              <BusinessModelSection data={modules["06-business-model"]} />
            </div>
            <div id="go-to-market">
              <GoToMarketSection data={modules["07-go-to-market"]} />
            </div>
            <div id="risk-radar">
              <RiskRadarSection data={modules["08-risk-radar"]} />
            </div>
            <div id="trend-timing">
              <TrendTimingSection data={modules["09-trend-timing"]} />
            </div>
            <div id="investor-lens">
              <InvestorLensSection data={modules["10-investor-lens"]} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
