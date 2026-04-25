import SectionCard, { WhatThisMeansBox } from "@/components/ui/SectionCard";
import type { MarketSizing } from "@/lib/schemas";

interface Props {
  data?: { result: MarketSizing; modelUsed: string; error?: string };
}

const confidenceColors = {
  low: "text-red-400 bg-red-400/10",
  medium: "text-amber-400 bg-amber-400/10",
  high: "text-emerald-400 bg-emerald-400/10",
};

export default function MarketSizingSection({ data }: Props) {
  if (!data) return null;
  if (data.error) return <SectionCard title="Market Sizing" emoji="📊" error={data.error}><></></SectionCard>;

  const r = data.result;
  return (
    <SectionCard title="Market Sizing" emoji="📊" modelUsed={data.modelUsed} summary={r.plain_english_summary}>
      <div className="space-y-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { label: "Total Market (TAM)", sub: "Everyone who could ever buy this", data: r.tam, color: "border-blue-500/30 bg-blue-500/5" },
            { label: "Your Market (SAM)", sub: "The segment you can realistically reach", data: r.sam, color: "border-indigo-500/30 bg-indigo-500/5" },
            { label: "Year 1 Target (SOM)", sub: "Your realistic first-year slice", data: r.som, color: "border-emerald-500/30 bg-emerald-500/5" },
          ].map(({ label, sub, data: mData, color }) => (
            <div key={label} className={`border ${color} rounded-xl p-4`}>
              <div className="text-xs text-slate-400 mb-1">{sub}</div>
              <div className="text-2xl font-bold text-white mb-2">{mData.value}</div>
              <div className="text-xs font-semibold text-slate-300 mb-1">{label}</div>
              <p className="text-slate-400 text-xs leading-relaxed">{mData.explanation}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-sm">Data confidence:</span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${confidenceColors[r.confidence_level]}`}>
            {r.confidence_level}
          </span>
        </div>

        {r.data_sources.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Sources</div>
            <ul className="space-y-1">
              {r.data_sources.map((s, i) => (
                <li key={i} className="text-slate-400 text-xs flex items-start gap-1.5">
                  <span className="text-slate-500 shrink-0">[{i + 1}]</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <WhatThisMeansBox text={r.what_this_means_for_you} />
    </SectionCard>
  );
}
