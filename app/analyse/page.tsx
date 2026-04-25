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

const MODULE_CONFIG: { id: string; label: string; emoji: string }[] = [
  { id: "01-idea-decoder", label: "Decoding your idea", emoji: "💡" },
  { id: "search", label: "Searching the web", emoji: "🔍" },
  { id: "02-market-sizing", label: "Sizing the market", emoji: "📊" },
  { id: "03-customer-profiling", label: "Building customer profiles", emoji: "👥" },
  { id: "04-competitor-landscape", label: "Mapping competitors", emoji: "🗺️" },
  { id: "05-problem-validation", label: "Validating the problem", emoji: "✅" },
  { id: "06-business-model", label: "Exploring business models", emoji: "💰" },
  { id: "07-go-to-market", label: "Building GTM playbook", emoji: "🚀" },
  { id: "08-risk-radar", label: "Scanning for risks", emoji: "⚠️" },
  { id: "09-trend-timing", label: "Analysing trends & timing", emoji: "📈" },
  { id: "10-investor-lens", label: "Putting on investor lens", emoji: "🔭" },
];

function AnalysePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [modules, setModules] = useState<Record<string, ModuleProgress>>(() =>
    Object.fromEntries(
      MODULE_CONFIG.map((m) => [m.id, { moduleId: m.id, status: "pending" }])
    )
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

    if (!idea) {
      router.push("/");
      return;
    }

    const startAnalysis = async () => {
      const res = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideaText: idea, geography, industry }),
      });

      if (!res.ok || !res.body) {
        setError("Failed to start analysis. Please try again.");
        return;
      }

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
                setModules((prev) => ({
                  ...prev,
                  [data.moduleId]: {
                    ...prev[data.moduleId],
                    ...data,
                  },
                }));
              } else if (event === "complete") {
                router.push(`/report/${data.reportId}`);
              } else if (event === "error") {
                setError(data.message);
              }
            } catch {
              // ignore parse errors
            }
            event = "";
          }
        }
      }
    };

    startAnalysis().catch((err) => setError(String(err)));
  }, [searchParams, router]);

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium transition"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Generating your report</h1>
          <p className="text-slate-400">10 AI modules running — this takes about 2–3 minutes</p>
        </div>

        {/* Overall progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>{completedCount} of {totalCount} modules complete</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Module list */}
        <div className="space-y-3">
          {MODULE_CONFIG.map(({ id, label, emoji }) => {
            const mod = modules[id];
            const status = mod?.status ?? "pending";
            return (
              <div
                key={id}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 ${
                  status === "done"
                    ? "bg-emerald-500/10 border-emerald-500/20"
                    : status === "running"
                    ? "bg-indigo-500/10 border-indigo-500/30"
                    : status === "error"
                    ? "bg-red-500/10 border-red-500/20"
                    : "bg-slate-800/30 border-slate-700/30"
                }`}
              >
                <span className="text-xl">{emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium">{mod?.label ?? label}</div>
                  {mod?.modelUsed && (
                    <div className="text-slate-500 text-xs mt-0.5">via {mod.modelUsed}</div>
                  )}
                  {mod?.error && (
                    <div className="text-red-400 text-xs mt-0.5 truncate">{mod.error}</div>
                  )}
                </div>
                <div className="shrink-0">
                  {status === "done" && <span className="text-emerald-400 text-lg">✓</span>}
                  {status === "running" && (
                    <span className="w-4 h-4 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin block" />
                  )}
                  {status === "error" && <span className="text-red-400 text-lg">✗</span>}
                  {status === "pending" && <span className="w-2 h-2 rounded-full bg-slate-600 block" />}
                </div>
              </div>
            );
          })}
        </div>
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
