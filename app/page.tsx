"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

/* ─── Constants ─── */
const MODULES = [
  { icon: "◈", label: "Idea Decoder" },
  { icon: "◎", label: "Market Sizing" },
  { icon: "◉", label: "Customer Profiles" },
  { icon: "◐", label: "Competitor Map" },
  { icon: "◆", label: "Problem Validation" },
  { icon: "◇", label: "Business Model" },
  { icon: "◑", label: "Go-to-Market" },
  { icon: "◒", label: "Risk Radar" },
  { icon: "◓", label: "Trend & Timing" },
  { icon: "◔", label: "Investor Lens" },
];

/* ─── NavBar ─── */
function NavBar() {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 200, height: 58,
      background: "rgba(248,246,242,0.94)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--rule)",
    }}>
      <div className="landing-nav-inner" style={{
        maxWidth: 1140, margin: "0 auto", padding: "0 32px", height: "100%",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{
            width: 28, height: 28, background: "var(--accent)", color: "#fff",
            borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700,
          }}>M</div>
          <span style={{ fontSize: 15, fontWeight: 500, color: "var(--ink)", letterSpacing: "-0.02em" }}>
            MarketMind <span style={{ color: "var(--accent)", fontWeight: 600 }}>AI</span>
          </span>
        </div>
        <div className="landing-nav-links" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <a href="#how-it-works" style={{ padding: "5px 12px", borderRadius: 6, fontSize: 13, color: "var(--ink-2)" }}>How it works</a>
          <a href="#pricing" style={{ padding: "5px 12px", borderRadius: 6, fontSize: 13, color: "var(--ink-2)" }}>Pricing</a>
          <a href="#hero-form" style={{
            padding: "7px 16px", borderRadius: 7, fontSize: 13, fontWeight: 600,
            background: "var(--accent)", color: "#fff", marginLeft: 4,
          }}>Try free →</a>
        </div>
      </div>
    </nav>
  );
}

/* ─── Social Proof Strip ─── */
function SocialProofStrip() {
  const items = [
    { val: "2,400+", label: "founders" },
    { val: "48", label: "countries" },
    { val: "4.8★", label: "avg rating" },
    { val: "<3 min", label: "per report" },
  ];
  return (
    <div style={{ background: "var(--ink)", padding: "10px 0" }}>
      <div className="social-strip-inner" style={{
        maxWidth: 1140, margin: "0 auto", padding: "0 32px",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 40, flexWrap: "wrap",
      }}>
        {items.map(({ val, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{val}</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{label}</span>
          </div>
        ))}
        <div className="social-strip-divider" style={{ width: 1, height: 14, background: "rgba(255,255,255,0.12)" }} />
        <span className="social-strip-quote" style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontStyle: "italic" }}>
          &ldquo;The first tool that actually replaced a consultant.&rdquo; — Priya S., Bengaluru
        </span>
      </div>
    </div>
  );
}

/* ─── Idea Form ─── */
function IdeaForm({ ctaLabel = "Analyse My Idea →", compact = false }: { ctaLabel?: string; compact?: boolean }) {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [geography, setGeography] = useState("");
  const [industry, setIndustry] = useState("");
  const [showContext, setShowContext] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const words = idea.trim().split(/\s+/).filter(Boolean).length;
  const ready = words >= 15;
  const pct = Math.min(words / 15, 1);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready) return;
    setSubmitted(true);
    const params = new URLSearchParams({ idea: idea.trim() });
    if (geography) params.set("geography", geography);
    if (industry) params.set("industry", industry);
    setTimeout(() => router.push(`/analyse?${params.toString()}`), 600);
  }

  return (
    <form id="hero-form" onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{
        background: "#fff", borderRadius: 13,
        boxShadow: "0 2px 14px rgba(0,0,0,0.06), 0 0 0 1.5px var(--rule)", overflow: "hidden",
      }}>
        <textarea
          value={idea}
          onChange={e => setIdea(e.target.value)}
          placeholder="Describe your business idea in plain English — what it does, who it's for, and the problem it solves. The more detail you give, the sharper your report."
          rows={compact ? 4 : 6}
          style={{
            width: "100%", display: "block", padding: "20px 22px 14px",
            fontSize: 15, lineHeight: 1.7, color: "var(--ink)", background: "transparent",
            border: "none", outline: "none", resize: "none",
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
          }}
        />
        <div style={{
          padding: "8px 16px 12px", borderTop: "1px solid var(--rule)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 72, height: 3, background: "var(--rule)", borderRadius: 99 }}>
              <div style={{
                width: `${pct * 100}%`, height: "100%",
                background: ready ? "var(--accent)" : "var(--amber)",
                borderRadius: 99, transition: "width 0.2s",
              }} />
            </div>
            <span style={{ fontSize: 12, color: ready ? "var(--accent)" : "var(--ink-3)" }}>
              {ready ? `${words} words — ready!` : `${Math.max(0, 15 - words)} more words`}
            </span>
          </div>
          <span style={{ fontSize: 12, color: "var(--ink-3)" }}>Max 500 words</span>
        </div>
      </div>

      {/* Optional context toggle */}
      <button
        type="button"
        onClick={() => setShowContext(v => !v)}
        style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 13, color: "var(--ink-3)", textAlign: "left",
          display: "flex", alignItems: "center", gap: 5, padding: 0,
        }}
      >
        <span style={{ transition: "transform 0.2s", display: "inline-block", transform: showContext ? "rotate(180deg)" : "none" }}>↓</span>
        Add context (optional)
      </button>

      {showContext && (
        <div className="landing-context-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <input
            type="text"
            value={geography}
            onChange={e => setGeography(e.target.value)}
            placeholder="Target geography (e.g. India)"
            style={{
              background: "#fff", border: "1px solid var(--rule)", borderRadius: 9,
              padding: "11px 14px", fontSize: 14, color: "var(--ink)",
              outline: "none", fontFamily: "'DM Sans', sans-serif",
            }}
          />
          <input
            type="text"
            value={industry}
            onChange={e => setIndustry(e.target.value)}
            placeholder="Industry (e.g. Logistics)"
            style={{
              background: "#fff", border: "1px solid var(--rule)", borderRadius: 9,
              padding: "11px 14px", fontSize: 14, color: "var(--ink)",
              outline: "none", fontFamily: "'DM Sans', sans-serif",
            }}
          />
        </div>
      )}

      <button
        type="submit"
        style={{
          padding: "15px 28px", borderRadius: 10, border: "none",
          background: submitted ? "var(--ink-3)" : ready ? "var(--accent)" : "var(--ink-3)",
          color: "#fff", fontSize: 16, fontWeight: 600,
          cursor: ready && !submitted ? "pointer" : "default",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          boxShadow: ready ? "0 2px 18px rgba(0,0,0,0.13)" : "none",
          transition: "background 0.25s, box-shadow 0.25s",
        }}
      >
        {submitted ? (
          <>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ animation: "spin 0.8s linear infinite", flexShrink: 0 }}>
              <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
              <path d="M8 2 A6 6 0 0 1 14 8" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Analysing…
          </>
        ) : ctaLabel}
      </button>

      <p style={{ fontSize: 12, color: "var(--ink-3)", textAlign: "center", letterSpacing: "0.01em" }}>
        No credit card · Your first full report is free · Results in under 3 minutes
      </p>
    </form>
  );
}

/* ─── Hero (Variant A — The Friend) ─── */
function Hero() {
  return (
    <div className="landing-hero" style={{ padding: "72px 32px 60px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "var(--ink-2)" }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%", background: "var(--accent)",
            display: "inline-block", boxShadow: "0 0 0 3px var(--accent-md)",
          }} />
          MBA-level market research · Without the MBA fees
        </div>
        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(40px, 5.5vw, 62px)", fontWeight: 400,
          lineHeight: 1.06, letterSpacing: "-0.025em", color: "var(--ink)",
        }}>
          Know your market<br />
          <em style={{ color: "var(--ink-2)" }}>before you build.</em>
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.65, color: "var(--ink-2)", fontWeight: 300, maxWidth: 580 }}>
          Hiring a market research consultant costs ₹4–20 lakhs and takes weeks.
          MarketMind generates the same report — 10 modules, plain English, fully sourced — in under 3 minutes.
          For free.
        </p>
        <IdeaForm ctaLabel="Analyse My Idea — it's free →" />
      </div>
    </div>
  );
}

/* ─── Animated bar for report preview ─── */
function MiniBar({ label, pct, accent, delay = 0 }: { label: string; pct: number; accent: string; delay?: number }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(pct), 300 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 10, alignItems: "center" }}>
      <span style={{ fontSize: 11, color: "var(--ink-3)", fontWeight: 500 }}>{label}</span>
      <div style={{ height: 5, background: "var(--rule)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${w}%`, background: accent, borderRadius: 99,
          transition: "width 1.1s cubic-bezier(0.16,1,0.3,1)",
        }} />
      </div>
    </div>
  );
}

/* ─── Report Preview Section ─── */
function ReportPreviewSection() {
  return (
    <section id="how-it-works" style={{ padding: "80px 32px", borderTop: "1px solid var(--rule)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 10 }}>Report preview</div>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 400,
            lineHeight: 1.1, letterSpacing: "-0.025em", color: "var(--ink)", marginBottom: 14,
          }}>
            Here&apos;s what you get in 3 minutes.
          </h2>
          <p style={{ fontSize: 16, color: "var(--ink-2)", fontWeight: 300, maxWidth: 540, margin: "0 auto", lineHeight: 1.65 }}>
            Every report has 10 modules. Here are three of them, showing what the actual output looks like for a real idea.
          </p>
        </div>

        <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
          {/* Module 02 — Market Sizing */}
          <div style={{ background: "#fff", border: "1px solid var(--rule)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px 12px", borderBottom: "1px solid var(--rule)", background: "var(--bg-card)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 3 }}>Module 02</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Market Sizing</div>
            </div>
            <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
              <MiniBar label="Total market" pct={100} accent="var(--ink-3)" delay={0} />
              <MiniBar label="Your slice" pct={62} accent="oklch(58% 0.14 258)" delay={120} />
              <MiniBar label="Year 1 target" pct={20} accent="var(--accent)" delay={240} />
              <div style={{ marginTop: 4, padding: "10px 12px", background: "var(--bg-card)", borderRadius: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-3)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>Year 1 Target</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "var(--ink)", letterSpacing: "-0.02em" }}>₹8–15 crore</div>
                <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>3 metros · 500 active pairs</div>
              </div>
            </div>
          </div>

          {/* Module 04 — Competitor Map */}
          <div style={{ background: "#fff", border: "1px solid var(--rule)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px 12px", borderBottom: "1px solid var(--rule)", background: "var(--bg-card)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 3 }}>Module 04</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Competitor Map</div>
            </div>
            <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 9 }}>
              {[
                { name: "MentorKart",   threat: "high",   type: "Direct"   },
                { name: "LetsVenture",  threat: "medium", type: "Adjacent" },
                { name: "Gyan99",       threat: "medium", type: "Direct"   },
                { name: "Flexi-Mentor", threat: "low",    type: "Direct"   },
              ].map(c => {
                const tc = c.threat === "high"
                  ? { bg: "oklch(96% 0.05 22)", text: "oklch(40% 0.16 22)" }
                  : c.threat === "medium"
                  ? { bg: "oklch(96% 0.06 80)", text: "oklch(42% 0.14 80)" }
                  : { bg: "oklch(95% 0.06 155)", text: "oklch(38% 0.14 155)" };
                return (
                  <div key={c.name} style={{
                    display: "flex", alignItems: "center", gap: 9, padding: "8px 10px",
                    background: "var(--bg-card)", borderRadius: 7, border: "1px solid var(--rule)",
                  }}>
                    <div style={{
                      width: 28, height: 28, background: "var(--accent)", color: "#fff", borderRadius: 6,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 9, fontWeight: 700, flexShrink: 0,
                    }}>{c.name.slice(0, 2).toUpperCase()}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)" }}>{c.name}</div>
                      <div style={{ fontSize: 10, color: "var(--ink-3)" }}>{c.type}</div>
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 500, padding: "2px 7px", borderRadius: 99,
                      background: tc.bg, color: tc.text, flexShrink: 0,
                    }}>{c.threat}</span>
                  </div>
                );
              })}
              <div style={{ padding: "8px 10px", background: "oklch(95% 0.06 155)", borderRadius: 7, border: "1px solid oklch(85% 0.08 155)" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "oklch(38% 0.14 155)", marginBottom: 2 }}>Whitespace found ✓</div>
                <div style={{ fontSize: 11, color: "var(--ink-2)", lineHeight: 1.5 }}>No competitor offers rigorous vetting + structured fractional engagement.</div>
              </div>
            </div>
          </div>

          {/* Module 07 — Go-to-Market */}
          <div style={{ background: "#fff", border: "1px solid var(--rule)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px 12px", borderBottom: "1px solid var(--rule)", background: "var(--bg-card)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 3 }}>Module 07</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Go-to-Market</div>
            </div>
            <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 2 }}>Your 90-day plan</div>
              {[
                { phase: "Days 1–30",  action: "Recruit 15–20 retired execs via LinkedIn", color: "var(--accent)" },
                { phase: "Days 31–60", action: "Run 3 free pilot matches, get testimonials", color: "oklch(44% 0.14 80)" },
                { phase: "Days 61–90", action: "Launch paid take-rate model, 5+ active pairs", color: "oklch(50% 0.18 155)" },
              ].map(({ phase, action, color }) => (
                <div key={phase} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color, minWidth: 64, marginTop: 2, letterSpacing: "0.03em" }}>{phase}</span>
                  <span style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.5, fontWeight: 300 }}>{action}</span>
                </div>
              ))}
              <div style={{ marginTop: 4, padding: "11px 13px", background: "oklch(96% 0.04 258)", borderLeft: "3px solid var(--accent)", borderRadius: "0 8px 8px 0" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>💡 What This Means For You</div>
                <p style={{ fontSize: 12, color: "var(--ink)", lineHeight: 1.6 }}>Don&apos;t build tech first. Do 20 matches by hand. Your first code should be written after your 5th paying customer.</p>
              </div>
            </div>
          </div>
        </div>

        {/* All 10 module chips */}
        <div style={{ marginTop: 36, padding: "24px 28px", background: "var(--bg-card)", borderRadius: 14, border: "1px solid var(--rule)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 14 }}>All 10 modules in every report</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {MODULES.map(m => (
              <span key={m.label} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
                borderRadius: 6, background: "var(--bg)", border: "1px solid var(--rule)",
                fontSize: 12, color: "var(--ink-2)",
              }}>
                <span style={{ color: "var(--accent)", fontSize: 10 }}>{m.icon}</span>
                {m.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ─── */
function TestimonialsSection() {
  const quotes = [
    { quote: "I was about to hire a market research consultant for ₹4 lakhs. MarketMind gave me a better report in 4 minutes. I nearly cried.", name: "Rahul Mehta", role: "Founder, Agritech startup · Pune", initial: "RM", rating: 5 },
    { quote: "The competitor map alone was worth it. I found a gap my entire founding team had missed in 6 months of research.", name: "Divya Krishnan", role: "Co-founder, HealthTech SaaS · Bengaluru", initial: "DK", rating: 5 },
    { quote: "The 'What This Means For You' sections are the best part. It doesn't just give you data — it tells you what to actually do about it.", name: "Arjun Shetty", role: "Founder, D2C brand · Mumbai", initial: "AS", rating: 5 },
  ];
  return (
    <section style={{ padding: "72px 32px", background: "var(--bg-card)", borderTop: "1px solid var(--rule)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 10 }}>Founder stories</div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(24px, 2.8vw, 36px)", fontWeight: 400, letterSpacing: "-0.02em", color: "var(--ink)" }}>
            What founders say.
          </h2>
        </div>
        <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
          {quotes.map(q => (
            <div key={q.name} style={{
              background: "#fff", border: "1px solid var(--rule)", borderRadius: 14,
              padding: "24px 22px", display: "flex", flexDirection: "column", gap: 16,
            }}>
              <div style={{ display: "flex", gap: 3 }}>
                {Array.from({ length: q.rating }).map((_, i) => (
                  <span key={i} style={{ color: "var(--amber)", fontSize: 14 }}>★</span>
                ))}
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: "var(--ink)", fontWeight: 300, flex: 1 }}>
                &ldquo;{q.quote}&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 4, borderTop: "1px solid var(--rule)" }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%", background: "var(--accent)", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, flexShrink: 0,
                }}>{q.initial}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{q.name}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{q.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing ─── */
function PricingSection() {
  const tiers = [
    {
      name: "Free", price: "₹0", period: "forever", cta: "Start for free", badge: null as string | null,
      features: ["1 full report per month", "All 10 modules included", "PDF export", "No login required"],
    },
    {
      name: "Pro", price: "₹999", period: "per month", cta: "Start Pro trial", badge: "Most popular",
      features: ["Unlimited reports", "Word + PDF export", "Share via link", "'Dig Deeper' follow-ups", "Saved report history", "Priority processing"],
    },
    {
      name: "Team", price: "₹3,999", period: "per month", cta: "Try Team free", badge: null as string | null,
      features: ["Everything in Pro", "3 seats included", "White-label PDF export", "API access", "Cohort / portfolio dashboard"],
    },
  ];
  return (
    <section id="pricing" style={{ padding: "80px 32px", borderTop: "1px solid var(--rule)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 10 }}>Pricing</div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 400, letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: 12 }}>
            The free tier is genuinely useful.
          </h2>
          <p style={{ fontSize: 15, color: "var(--ink-2)", fontWeight: 300, maxWidth: 480, margin: "0 auto", lineHeight: 1.65 }}>
            We don&apos;t cripple the free plan to force upgrades. Every tier gets all 10 modules.
            You&apos;ll upgrade when you need more reports, not because we blocked you.
          </p>
        </div>
        <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {tiers.map(t => (
            <div key={t.name} style={{
              background: t.badge ? "var(--ink)" : "#fff",
              border: t.badge ? "none" : "1px solid var(--rule)",
              borderRadius: 16, padding: "28px 26px",
              display: "flex", flexDirection: "column", gap: 20,
              position: "relative", overflow: "hidden",
            }}>
              {t.badge && (
                <div style={{
                  position: "absolute", top: 0, right: 0,
                  background: "var(--accent)", color: "#fff", fontSize: 10, fontWeight: 700,
                  padding: "4px 12px", borderRadius: "0 16px 0 8px", letterSpacing: "0.06em", textTransform: "uppercase",
                }}>{t.badge}</div>
              )}
              <div>
                <div style={{
                  fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
                  color: t.badge ? "rgba(255,255,255,0.5)" : "var(--ink-3)", marginBottom: 8,
                }}>{t.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{
                    fontFamily: "'DM Serif Display', serif", fontSize: 36, fontWeight: 400,
                    color: t.badge ? "#fff" : "var(--ink)", letterSpacing: "-0.02em",
                  }}>{t.price}</span>
                  <span style={{ fontSize: 13, color: t.badge ? "rgba(255,255,255,0.4)" : "var(--ink-3)" }}>/{t.period}</span>
                </div>
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9, flex: 1, padding: 0, margin: 0 }}>
                {t.features.map((f, i) => (
                  <li key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                    <span style={{ color: t.badge ? "oklch(70% 0.12 155)" : "var(--accent)", fontSize: 12, marginTop: 2, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 13, color: t.badge ? "rgba(255,255,255,0.7)" : "var(--ink-2)", lineHeight: 1.5 }}>{f}</span>
                  </li>
                ))}
              </ul>
              <button style={{
                padding: "12px", borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: "pointer",
                background: t.badge ? "var(--accent)" : "transparent",
                color: t.badge ? "#fff" : "var(--accent)",
                border: t.badge ? "none" : "1.5px solid var(--accent)",
                transition: "opacity 0.15s",
              }}>{t.cta}</button>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--ink-3)" }}>
          All plans include a 7-day full-access trial of Pro · Cancel anytime · No hidden fees
        </p>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--rule)", padding: "22px 32px" }}>
      <div style={{
        maxWidth: 1140, margin: "0 auto", display: "flex", alignItems: "center",
        gap: 16, fontSize: 13, color: "var(--ink-3)", flexWrap: "wrap",
      }}>
        <span>© 2025 MarketMind AI</span>
        <span style={{ color: "var(--rule)" }}>·</span>
        <a href="#" style={{ color: "var(--ink-3)" }}>Privacy</a>
        <span style={{ color: "var(--rule)" }}>·</span>
        <a href="#" style={{ color: "var(--ink-3)" }}>Terms</a>
        <div style={{ marginLeft: "auto", display: "flex", gap: 16, flexWrap: "wrap" }}>
          {["No credit card required", "Your data is never used for training"].map(t => (
            <span key={t} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
              <span style={{ color: "oklch(50% 0.18 155)", fontSize: 10 }}>✓</span>
              {t}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ─── */
export default function LandingPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <SocialProofStrip />
      <NavBar />
      <main style={{ flex: 1 }}>
        <Hero />
        <ReportPreviewSection />
        <TestimonialsSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
