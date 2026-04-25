import SectionCard, { WhatThisMeansBox } from "@/components/ui/SectionCard";
import type { CompetitorLandscape } from "@/lib/schemas";

interface Props {
  data?: { result: CompetitorLandscape; modelUsed: string; error?: string };
}

const threatColors = {
  low: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  medium: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  high: "text-red-400 bg-red-400/10 border-red-400/20",
};

const typeColors = {
  direct: "bg-red-500/20 text-red-300",
  indirect: "bg-amber-500/20 text-amber-300",
  substitute: "bg-blue-500/20 text-blue-300",
};

const maturityColors = {
  emerging: "text-emerald-400",
  growing: "text-blue-400",
  mature: "text-amber-400",
  declining: "text-red-400",
};

export default function CompetitorLandscapeSection({ data }: Props) {
  if (!data) return null;
  if (data.error) return <SectionCard title="Competitor Landscape" emoji="🗺️" error={data.error}><></></SectionCard>;

  const r = data.result;
  return (
    <SectionCard title="Competitor Landscape" emoji="🗺️" modelUsed={data.modelUsed} summary={r.plain_english_summary}>
      <div className="space-y-4 mt-4">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm">Market stage:</span>
          <span className={`font-semibold capitalize text-sm ${maturityColors[r.market_maturity]}`}>
            {r.market_maturity}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {r.competitors.map((c, i) => (
            <div key={i} className="border border-slate-700 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-white">{c.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[c.type]}`}>{c.type}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${threatColors[c.threat_level]}`}>
                      {c.threat_level} threat
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mt-1">{c.description}</p>
                  {c.estimated_pricing && (
                    <p className="text-slate-500 text-xs mt-1">Pricing: {c.estimated_pricing}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="text-xs font-semibold text-emerald-400 mb-1">Strengths</div>
                  <ul className="space-y-0.5">
                    {c.strengths.map((s, j) => (
                      <li key={j} className="text-slate-300 text-xs flex items-start gap-1"><span className="text-emerald-400 shrink-0">+</span>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-xs font-semibold text-red-400 mb-1">Weaknesses</div>
                  <ul className="space-y-0.5">
                    {c.weaknesses.map((w, j) => (
                      <li key={j} className="text-slate-300 text-xs flex items-start gap-1"><span className="text-red-400 shrink-0">−</span>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-slate-700/30 rounded-lg p-3 text-xs text-slate-300">
                <span className="font-semibold text-indigo-300">Learn from them: </span>
                {c.what_you_can_learn_from_them}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">Whitespace Opportunity</div>
          <p className="text-white text-sm leading-relaxed">{r.whitespace_opportunity}</p>
        </div>
      </div>
      <WhatThisMeansBox text={r.what_this_means_for_you} />
    </SectionCard>
  );
}
