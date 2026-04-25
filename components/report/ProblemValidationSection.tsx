import SectionCard, { WhatThisMeansBox } from "@/components/ui/SectionCard";
import type { ProblemValidation } from "@/lib/schemas";

interface Props {
  data?: { result: ProblemValidation; modelUsed: string; error?: string };
}

const verdictConfig = {
  weak: { label: "Weak Problem", color: "text-red-400", bg: "bg-red-500/10 border-red-500/30" },
  moderate: { label: "Moderate Problem", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" },
  strong: { label: "Strong Problem", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" },
  very_strong: { label: "Very Strong Problem", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
};

export default function ProblemValidationSection({ data }: Props) {
  if (!data) return null;
  if (data.error) return <SectionCard title="Problem Validation" emoji="✅" error={data.error}><></></SectionCard>;

  const r = data.result;
  const vc = verdictConfig[r.verdict];
  return (
    <SectionCard title="Problem Validation Score" emoji="✅" modelUsed={data.modelUsed} summary={r.plain_english_summary}>
      <div className="space-y-4 mt-4">
        {/* Score */}
        <div className={`border ${vc.bg} rounded-xl p-5 flex items-center gap-5`}>
          <div className="text-center">
            <div className={`text-5xl font-bold ${vc.color}`}>{r.score}</div>
            <div className="text-slate-400 text-xs mt-1">out of 100</div>
          </div>
          <div>
            <div className={`font-bold text-lg ${vc.color}`}>{vc.label}</div>
            <div className="h-2 bg-slate-700 rounded-full w-48 mt-2">
              <div
                className={`h-full rounded-full transition-all ${r.score >= 70 ? "bg-emerald-500" : r.score >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                style={{ width: `${r.score}%` }}
              />
            </div>
          </div>
        </div>

        {/* Dimensions */}
        <div className="space-y-2">
          {r.dimensions.map((d, i) => (
            <div key={i} className="bg-slate-700/30 rounded-lg p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-white">{d.name}</span>
                <span className="text-sm font-bold text-indigo-300">{d.score}/10</span>
              </div>
              <div className="h-1.5 bg-slate-600 rounded-full mb-2">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${d.score * 10}%` }} />
              </div>
              <p className="text-slate-400 text-xs">{d.reasoning}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Evidence For</div>
            <ul className="space-y-1.5">
              {r.key_evidence_for.map((e, i) => (
                <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                  <span className="text-emerald-400 shrink-0">✓</span>{e}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">Evidence Against</div>
            <ul className="space-y-1.5">
              {r.key_evidence_against.map((e, i) => (
                <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                  <span className="text-red-400 shrink-0">✗</span>{e}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <WhatThisMeansBox text={r.what_this_means_for_you} />
    </SectionCard>
  );
}
