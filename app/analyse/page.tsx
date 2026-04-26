"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface ModuleProgress {
  moduleId: string;
  status: "pending" | "running" | "done" | "error";
  label?: string;
  modelUsed?: string;
  error?: string;
}

const MODULE_CONFIG = [
  { id: "01-idea-decoder",       label: "Decoding your idea",          num: "01" },
  { id: "search",                label: "Searching the web",           num: "—"  },
  { id: "02-market-sizing",      label: "Sizing the market",           num: "02" },
  { id: "03-customer-profiling", label: "Building customer profiles",  num: "03" },
  { id: "04-competitor-landscape",label: "Mapping competitors",        num: "04" },
  { id: "05-problem-validation", label: "Validating the problem",      num: "05" },
  { id: "06-business-model",     label: "Exploring business models",   num: "06" },
  { id: "07-go-to-market",       label: "Building GTM playbook",       num: "07" },
  { id: "08-risk-radar",         label: "Scanning for risks",          num: "08" },
  { id: "09-trend-timing",       label: "Analysing trends & timing",   num: "09" },
  { id: "10-investor-lens",      label: "Putting on investor lens",     num: "10" },
  { id: "11-digital-marketing",  label: "Planning digital marketing",  num: "11" },
];

function Spinner() {
  return (
    <span style={{
      display: "inline-block", width: 14, height: 14, borderRadius: "50%",
      border: "2px solid var(--accent-md)", borderTopColor: "var(--accent)",
      animation: "spin 0.7s linear infinite", flexShrink: 0,
    }} />
  );
}

function AnalysePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [modules, setModules] = useState<Record<string, ModuleProgress>>(() =>
    Object.fromEntries(MODULE_CONFIG.map((m) => [m.id, { moduleId: m.id, status: "pending" }]))
  );
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  const completedCount = Object.values(modules).filter((m) => m.status === "done").length;
  const totalCount = MODULE_CONFIG.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const idea = searchParams.get("idea");
    const geography = searchParams.get("geography");
    const industry = searchParams.get("industry");

    if (!idea) { router.push("/"); return; }

    const startAnalysis = async () => {
      const res = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideaText: idea, geography, industry }),
      });

      if (!res.ok || !res.body) { setError("Failed to start analysis. Please try again."); return; }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        let event = "";
        for (const line of lines) {
          if (line.startsWith("event: ")) {
            event = line.slice(7).trim();
          } else if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (event === "progress") {
                setModules((prev) => ({ ...prev, [data.moduleId]: { ...prev[data.moduleId], ...data } }));
              } else if (event === "complete") {
                router.push(`/report/${data.reportId}`);
              } else if (event === "error") {
                setError(data.message);
              }
            } catch { /* ignore */ }
            event = "";
          }
        }
      }
    };

    startAnalysis().catch((err) => setError(String(err)));
  }, [searchParams, router]);

  if (error) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 28, fontWeight: 400, color: "var(--ink)", marginBottom: 8 }}>Something went wrong</h2>
          <p style={{ fontSize: 15, color: "var(--ink-2)", marginBottom: 24, lineHeight: 1.6 }}>{error}</p>
          <button
            onClick={() => router.push("/")}
            style={{ background: "var(--accent)", color: "#fff", border: "none", padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 520 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 14 }}>
            Generating your report
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(26px,3.5vw,36px)", fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 12 }}>
            Your 11-module analysis<br />is being prepared
          </h1>
          <p style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.65 }}>
            Multiple AI experts are working in parallel — this takes about 2–3 minutes.
          </p>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "var(--ink-2)" }}>{completedCount} of {totalCount} modules complete</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>{progressPct}%</span>
          </div>
          <div style={{ height: 6, background: "var(--rule)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 99, background: "var(--accent)",
              width: `${progressPct}%`, transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)",
            }} />
          </div>
        </div>

        {/* Module list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {MODULE_CONFIG.map(({ id, label, num }) => {
            const mod = modules[id];
            const status = mod?.status ?? "pending";

            const bg = status === "done"    ? "var(--green-lt)"  :
                       status === "running" ? "var(--accent-lt)" :
                       status === "error"   ? "oklch(96% 0.05 22)" :
                       "#fff";
            const border = status === "done"    ? "oklch(85% 0.08 155)" :
                           status === "running" ? "var(--accent-md)"    :
                           status === "error"   ? "oklch(88% 0.08 22)"  :
                           "var(--rule)";

            return (
              <div key={id} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "11px 16px", borderRadius: 10,
                background: bg, border: `1px solid ${border}`,
                transition: "all 0.3s ease",
              }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-3)", minWidth: 20, letterSpacing: "0.04em" }}>{num}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: status === "running" ? 600 : 400, color: status === "pending" ? "var(--ink-3)" : "var(--ink)", transition: "all 0.2s" }}>
                    {mod?.label ?? label}
                  </div>
                  {mod?.error && <div style={{ fontSize: 11, color: "oklch(40% 0.16 22)", marginTop: 2 }}>{mod.error}</div>}
                </div>
                <div style={{ flexShrink: 0 }}>
                  {status === "done"    && <span style={{ fontSize: 13, color: "oklch(38% 0.14 155)", fontWeight: 700 }}>✓</span>}
                  {status === "running" && <Spinner />}
                  {status === "error"   && <span style={{ fontSize: 13, color: "oklch(40% 0.16 22)" }}>✗</span>}
                  {status === "pending" && <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "var(--rule)" }} />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <p style={{ textAlign: "center", fontSize: 12, color: "var(--ink-3)", marginTop: 28, lineHeight: 1.6 }}>
          Don&apos;t close this tab — you&apos;ll be redirected automatically when your report is ready.
        </p>
      </div>
    </main>
  );
}

export default function AnalysePageWrapper() {
  return (
    <Suspense>
      <AnalysePage />
    </Suspense>
  );
}
