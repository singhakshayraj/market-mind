import SectionCard, { WhatThisMeansBox } from "@/components/ui/SectionCard";
import type { RiskRadar } from "@/lib/schemas";

interface Props {
  data?: { result: RiskRadar; modelUsed: string; error?: string };
}

const levelColor = {
  low: "text-emerald-400",
  medium: "text-amber-400",
  high: "text-red-400",
  very_high: "text-red-500",
};

const categoryEmoji: Record<string, string> = {
  market: "📉",
  regulatory: "⚖️",
  operational: "⚙️",
  competitive: "🥊",
  financial: "💸",
  technical: "🔧",
};

export default function RiskRadarSection({ data }: Props) {
  if (!data) return null;
  if (data.error) return <SectionCard title="Risk Radar" emoji="⚠️" error={data.error}><></></SectionCard>;

  const r = data.result;
  return (
    <SectionCard title="Risk Radar" emoji="⚠️" modelUsed={data.modelUsed} summary={r.plain_english_summary}>
      <div className="space-y-4 mt-4">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm">Overall risk level:</span>
          <span className={`font-bold capitalize ${levelColor[r.overall_risk_level]}`}>
            {r.overall_risk_level.replace("_", " ")}
          </span>
        </div>

        {r.risks.map((risk, i) => (
          <div key={i} className="border border-slate-700 rounded-xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-xl shrink-0">{categoryEmoji[risk.category] ?? "⚠️"}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-white text-sm">{risk.title}</h3>
                  <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full capitalize">{risk.category}</span>
                </div>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">{risk.description}</p>
              </div>
            </div>
            <div className="flex gap-4 mb-3">
              {[
                { label: "Probability", val: risk.probability },
                { label: "Impact", val: risk.impact },
              ].map(({ label, val }) => (
                <div key={label} className="text-xs">
                  <span className="text-slate-500">{label}: </span>
                  <span className={`font-semibold capitalize ${levelColor[val as keyof typeof levelColor]}`}>{val}</span>
                </div>
              ))}
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3 text-xs">
              <span className="font-semibold text-emerald-400">Mitigation: </span>
              <span className="text-slate-300">{risk.mitigation}</span>
            </div>
          </div>
        ))}

        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <div className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-1">Biggest Risk</div>
          <p className="text-white text-sm leading-relaxed">{r.biggest_risk_summary}</p>
        </div>
      </div>
      <WhatThisMeansBox text={r.what_this_means_for_you} />
    </SectionCard>
  );
}
