import SectionCard, { WhatThisMeansBox } from "@/components/ui/SectionCard";
import type { InvestorLens } from "@/lib/schemas";

interface Props {
  data?: { result: InvestorLens; modelUsed: string; error?: string };
}

export default function InvestorLensSection({ data }: Props) {
  if (!data) return null;
  if (data.error) return <SectionCard title="Investor Lens" emoji="🔭" error={data.error}><></></SectionCard>;

  const r = data.result;
  const scoreColor = r.vc_attractiveness_score >= 7 ? "text-emerald-400" :
    r.vc_attractiveness_score >= 5 ? "text-amber-400" : "text-red-400";

  return (
    <SectionCard title="Investor Lens" emoji="🔭" modelUsed={data.modelUsed} summary={r.plain_english_summary}>
      <div className="space-y-4 mt-4">
        {/* Score */}
        <div className="flex items-center gap-5 p-4 bg-slate-700/30 rounded-xl">
          <div className="text-center">
            <div className={`text-4xl font-bold ${scoreColor}`}>{r.vc_attractiveness_score}/10</div>
            <div className="text-slate-400 text-xs mt-1">VC Attractiveness</div>
          </div>
          <div>
            <div className="text-white font-semibold">{r.thesis_fit}</div>
            <div className="h-2 bg-slate-600 rounded-full w-40 mt-2">
              <div
                className={`h-full rounded-full ${r.vc_attractiveness_score >= 7 ? "bg-emerald-500" : r.vc_attractiveness_score >= 5 ? "bg-amber-500" : "bg-red-500"}`}
                style={{ width: `${r.vc_attractiveness_score * 10}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">What VCs Will Love</div>
            <ul className="space-y-1.5">
              {r.what_vcs_love.map((w, i) => (
                <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                  <span className="text-emerald-400 shrink-0">✓</span>{w}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">Red Flags</div>
            <ul className="space-y-1.5">
              {r.red_flags.map((rf, i) => (
                <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                  <span className="text-red-400 shrink-0">✗</span>{rf}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Questions VCs Will Ask You</div>
          <ol className="space-y-2">
            {r.questions_vcs_will_ask.map((q, i) => (
              <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                <span className="text-amber-400 font-bold shrink-0">{i + 1}.</span>{q}
              </li>
            ))}
          </ol>
        </div>

        {r.comparable_funded_companies.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">Comparable Funded Companies</div>
            <div className="space-y-2">
              {r.comparable_funded_companies.map((c, i) => (
                <div key={i} className="bg-slate-700/30 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">{c.name}</span>
                    <span className="text-xs text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded">{c.funding}</span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">{c.relevance}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={`border rounded-xl p-4 ${r.bootstrappable ? "border-emerald-500/30 bg-emerald-500/5" : "border-amber-500/30 bg-amber-500/5"}`}>
          <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${r.bootstrappable ? "text-emerald-400" : "text-amber-400"}`}>
            {r.bootstrappable ? "Bootstrappable" : "Likely Needs Funding"}
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">{r.bootstrappable_reason}</p>
        </div>
      </div>
      <WhatThisMeansBox text={r.what_this_means_for_you} />
    </SectionCard>
  );
}
