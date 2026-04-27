"use client";

import { useState, useEffect, useCallback } from "react";
import type { PitchDeckOutput, Slide } from "@/lib/schemas/12-pitch-deck";
import ProblemSlide from "./slides/ProblemSlide";
import SolutionSlide from "./slides/SolutionSlide";
import MarketSizeSlide from "./slides/MarketSizeSlide";
import CustomerSlide from "./slides/CustomerSlide";
import CompetitorSlide from "./slides/CompetitorSlide";
import BusinessModelSlide from "./slides/BusinessModelSlide";
import GoToMarketSlide from "./slides/GoToMarketSlide";
import RiskSlide from "./slides/RiskSlide";
import WhyNowSlide from "./slides/WhyNowSlide";
import AskSlide from "./slides/AskSlide";

const SLIDE_LABELS = [
  "Problem Statement",
  "Our Solution",
  "Market Size",
  "Customer Profiles",
  "Competitive Landscape",
  "Business Model",
  "Go-to-Market",
  "Risk Radar",
  "Why Now",
  "Ask / Next Steps",
];

type State = "idle" | "generating" | "preview" | "error";

interface Props {
  reportId: string;
  initialDeck?: PitchDeckOutput | null;
}

function SlideRenderer({ slide }: { slide: Slide }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = slide.content as any;
  switch (slide.slide_type) {
    case "problem": return <ProblemSlide title={slide.title} subtitle={slide.subtitle} content={c} />;
    case "solution": return <SolutionSlide title={slide.title} subtitle={slide.subtitle} content={c} />;
    case "market_size": return <MarketSizeSlide title={slide.title} subtitle={slide.subtitle} content={c} />;
    case "customer": return <CustomerSlide title={slide.title} subtitle={slide.subtitle} content={c} />;
    case "competitor": return <CompetitorSlide title={slide.title} subtitle={slide.subtitle} content={c} />;
    case "business_model": return <BusinessModelSlide title={slide.title} subtitle={slide.subtitle} content={c} />;
    case "go_to_market": return <GoToMarketSlide title={slide.title} subtitle={slide.subtitle} content={c} />;
    case "risk": return <RiskSlide title={slide.title} subtitle={slide.subtitle} content={c} />;
    case "why_now": return <WhyNowSlide title={slide.title} subtitle={slide.subtitle} content={c} />;
    case "ask": return <AskSlide title={slide.title} subtitle={slide.subtitle} content={c} />;
    default: return <div style={{ padding: 20, color: "#6B7280" }}>Unknown slide type</div>;
  }
}

export default function PitchDeckGenerator({ reportId, initialDeck }: Props) {
  const [state, setState] = useState<State>(initialDeck ? "preview" : "idle");
  const [deck, setDeck] = useState<PitchDeckOutput | null>(initialDeck ?? null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [revealedSlides, setRevealedSlides] = useState(0);
  const [progress, setProgress] = useState(0);
  const [notesOpen, setNotesOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  const generateDeck = useCallback(async () => {
    setState("generating");
    setRevealedSlides(0);
    setProgress(0);

    // Progressive reveal animation
    const revealInterval = setInterval(() => {
      setRevealedSlides((r) => {
        if (r >= 9) { clearInterval(revealInterval); return 9; }
        return r + 1;
      });
      setProgress((p) => Math.min(p + 9, 90));
    }, 2500);

    try {
      const res = await fetch(`/api/deck?reportId=${reportId}`);
      clearInterval(revealInterval);
      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg ?? "Failed to generate pitch deck");
      }
      const { deck: data } = await res.json();
      setRevealedSlides(10);
      setProgress(100);
      await new Promise((r) => setTimeout(r, 600));
      setDeck(data);
      setCurrentSlide(0);
      setState("preview");
    } catch (err) {
      clearInterval(revealInterval);
      setError(err instanceof Error ? err.message : "Unknown error");
      setState("error");
    }
  }, [reportId]);

  // Keyboard navigation
  useEffect(() => {
    if (state !== "preview") return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") setCurrentSlide((s) => Math.min(s + 1, 9));
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") setCurrentSlide((s) => Math.max(s - 1, 0));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [state]);

  const handleDownload = async () => {
    if (!deck) return;
    setDownloading(true);
    try {
      const { generatePPTX } = await import("@/lib/deck/generator");
      const blob = await generatePPTX(deck);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${deck.idea_name.replace(/\s+/g, "-").toLowerCase()}-pitch-deck.pptx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("PPTX download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyNotes = async () => {
    if (!deck) return;
    const notes = deck.slides[currentSlide]?.speaker_notes ?? "";
    await navigator.clipboard.writeText(notes).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── IDLE STATE ──────────────────────────────────────────────
  if (state === "idle") {
    return (
      <section id="pitch-deck" style={{ marginTop: 48 }}>
        <div style={{ background: "#111827", borderRadius: 16, padding: "40px 40px", color: "#fff" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 24 }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#FF9933", marginBottom: 10 }}>Module 12 · New</div>
              <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(22px,2.5vw,32px)", fontWeight: 400, color: "#fff", marginBottom: 10, letterSpacing: "-0.02em" }}>
                Pitch Deck Generator
              </h2>
              <p style={{ fontSize: 14, color: "oklch(75% 0.03 258)", lineHeight: 1.6, marginBottom: 20, maxWidth: 440 }}>
                AI distils all 11 modules into a investor-ready 10-slide pitch deck. Preview in browser, download as PPTX — ready for Sequoia, Peak XV, or your angel network.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 24, maxWidth: 380 }}>
                {SLIDE_LABELS.map((label, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "oklch(65% 0.03 258)" }}>
                    <span style={{ color: "#FF9933", fontWeight: 700, fontSize: 11 }}>{String(i + 1).padStart(2, "0")}</span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 12, color: "oklch(55% 0.03 258)", marginBottom: 20 }}>Takes about 30 seconds · Uses all 11 module outputs</div>
              <button
                onClick={generateDeck}
                style={{ padding: "12px 28px", borderRadius: 10, background: "#FF9933", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}
              >
                Generate My Pitch Deck →
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── GENERATING STATE ─────────────────────────────────────────
  if (state === "generating") {
    return (
      <section id="pitch-deck" style={{ marginTop: 48 }}>
        <div style={{ background: "#111827", borderRadius: 16, padding: "40px 40px", color: "#fff" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#FF9933", marginBottom: 10 }}>Building your deck…</div>
          <div style={{ background: "oklch(20% 0.02 258)", borderRadius: 8, height: 6, marginBottom: 28, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "#FF9933", transition: "width 0.4s ease" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {SLIDE_LABELS.map((label, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: i <= revealedSlides ? "#fff" : "oklch(40% 0.02 258)", transition: "color 0.3s" }}>
                <span style={{ fontSize: 16, transition: "all 0.3s" }}>
                  {i < revealedSlides ? "✓" : i === revealedSlides ? "⟳" : "○"}
                </span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── ERROR STATE ───────────────────────────────────────────────
  if (state === "error") {
    return (
      <section id="pitch-deck" style={{ marginTop: 48 }}>
        <div style={{ background: "#111827", borderRadius: 16, padding: "40px 40px", color: "#fff" }}>
          <div style={{ fontSize: 14, color: "#EF4444", marginBottom: 12 }}>⚠ {error}</div>
          <button
            onClick={generateDeck}
            style={{ padding: "10px 22px", borderRadius: 8, background: "#FF9933", color: "#fff", fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer" }}
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  // ── PREVIEW STATE ─────────────────────────────────────────────
  if (!deck) return null;
  const slide = deck.slides[currentSlide];
  const wordCount = slide.speaker_notes.split(/\s+/).length;
  const speakSecs = Math.round((wordCount / 130) * 60);

  return (
    <section id="pitch-deck" style={{ marginTop: 48 }}>
      {/* Header */}
      <div style={{ marginBottom: 20, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#FF9933", marginBottom: 4 }}>Module 12 · Pitch Deck</div>
          <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(18px,2vw,26px)", fontWeight: 400, color: "var(--ink)", margin: 0, letterSpacing: "-0.02em" }}>
            {deck.deck_title}
          </h2>
          <p style={{ fontSize: 13, color: "var(--ink-2)", margin: "4px 0 0" }}>{deck.tagline}</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={handleDownload}
            disabled={downloading}
            style={{ padding: "8px 18px", borderRadius: 8, background: "#FF9933", color: "#fff", fontWeight: 600, fontSize: 13, border: "none", cursor: downloading ? "not-allowed" : "pointer", opacity: downloading ? 0.7 : 1 }}
          >
            {downloading ? "Generating…" : "Download PPTX"}
          </button>
          <button
            onClick={handleCopyNotes}
            style={{ padding: "8px 18px", borderRadius: 8, background: "var(--bg-card)", color: "var(--ink-2)", fontWeight: 500, fontSize: 13, border: "1px solid var(--rule)", cursor: "pointer" }}
          >
            {copied ? "Copied!" : "Copy Notes"}
          </button>
          <button
            onClick={() => setState("idle")}
            style={{ padding: "8px 14px", borderRadius: 8, background: "transparent", color: "var(--ink-3)", fontWeight: 500, fontSize: 13, border: "1px solid var(--rule)", cursor: "pointer" }}
          >
            Start Over
          </button>
        </div>
      </div>

      {/* Slide Preview */}
      <div style={{ width: "100%", aspectRatio: "16/9", position: "relative", background: "#fff", borderRadius: 12, border: "1px solid var(--rule)", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <style>{`
          .slide-inner { position: relative; width: 100%; height: 100%; background: #fff; overflow: hidden; }
          .slide-accent-bar { position: absolute; left: 0; top: 0; width: 1.4%; height: 100%; background: #FF9933; }
          .slide-body { position: absolute; left: 3%; right: 1.5%; top: 3%; bottom: 10%; overflow: hidden; }
          .slide-title { font-size: clamp(14px,2.2vw,22px); font-weight: 700; color: #111827; margin: 0 0 4px; line-height: 1.2; font-family: Arial,sans-serif; }
          .slide-subtitle { font-size: clamp(9px,1.3vw,13px); color: #6B7280; margin: 0 0 8px; }
        `}</style>
        <SlideRenderer slide={slide} />
      </div>

      {/* Thumbnail Strip */}
      <div style={{ display: "flex", gap: 6, marginTop: 12, overflowX: "auto", paddingBottom: 4 }}>
        {deck.slides.map((s, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            style={{
              flexShrink: 0, width: 80, aspectRatio: "16/9",
              background: "#fff", border: `2px solid ${i === currentSlide ? "#FF9933" : "#E5E7EB"}`,
              borderRadius: 6, cursor: "pointer", overflow: "hidden",
              display: "flex", flexDirection: "column", padding: "4px 5px", gap: 2,
              transition: "border-color 0.15s",
            }}
          >
            <div style={{ fontSize: 7, fontWeight: 700, color: i === currentSlide ? "#FF9933" : "#9CA3AF" }}>{String(i + 1).padStart(2, "0")}</div>
            <div style={{ fontSize: 7, color: "#111827", fontWeight: 600, lineHeight: 1.2, overflow: "hidden" }}>{s.title}</div>
          </button>
        ))}
      </div>

      {/* Navigator */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 12 }}>
        <button
          onClick={() => setCurrentSlide((s) => Math.max(s - 1, 0))}
          disabled={currentSlide === 0}
          style={{ padding: "7px 16px", borderRadius: 8, border: "1px solid var(--rule)", background: "var(--bg-card)", color: "var(--ink-2)", cursor: currentSlide === 0 ? "not-allowed" : "pointer", opacity: currentSlide === 0 ? 0.4 : 1, fontSize: 13 }}
        >
          ← Prev
        </button>
        <span style={{ fontSize: 13, color: "var(--ink-3)", fontWeight: 500 }}>Slide {currentSlide + 1} of 10</span>
        <button
          onClick={() => setCurrentSlide((s) => Math.min(s + 1, 9))}
          disabled={currentSlide === 9}
          style={{ padding: "7px 16px", borderRadius: 8, border: "1px solid var(--rule)", background: "var(--bg-card)", color: "var(--ink-2)", cursor: currentSlide === 9 ? "not-allowed" : "pointer", opacity: currentSlide === 9 ? 0.4 : 1, fontSize: 13 }}
        >
          Next →
        </button>
      </div>

      {/* Speaker Notes Panel */}
      <div style={{ marginTop: 16, borderRadius: 10, border: "1px solid var(--rule)", overflow: "hidden" }}>
        <button
          onClick={() => setNotesOpen((o) => !o)}
          style={{ width: "100%", padding: "10px 16px", background: "var(--bg-card)", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, fontWeight: 500, color: "var(--ink-2)" }}
        >
          <span>🎤 {notesOpen ? "Hide Speaker Notes" : "Show Speaker Notes"}</span>
          <span style={{ fontSize: 12, color: "var(--ink-3)" }}>~{speakSecs}s speaking time</span>
        </button>
        {notesOpen && (
          <div style={{ background: "#F3F4F6", padding: "14px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>What to say on this slide:</div>
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: 0 }}>{slide.speaker_notes}</p>
          </div>
        )}
      </div>
    </section>
  );
}
