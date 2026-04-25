import SectionCard, { WhatThisMeansBox } from "@/components/ui/SectionCard";
import type { BusinessModel } from "@/lib/schemas";

interface Props {
  data?: { result: BusinessModel; modelUsed: string; error?: string };
}

const complexityColors = {
  low: "text-emerald-400 bg-emerald-400/10",
  medium: "text-amber-400 bg-amber-400/10",
  high: "text-red-400 bg-red-400/10",
};

export default function BusinessModelSection({ data }: Props) {
  if (!data) return null;
  if (data.error) return <SectionCard title="Business Model Options" emoji="💰" error={data.error}><></></SectionCard>;

  const r = data.result;
  return (
    <SectionCard title="Business Model Options" emoji="💰" modelUsed={data.modelUsed} summary={r.plain_english_summary}>
      <div className="space-y-4 mt-4">
        {r.models.map((m, i) => (
          <div
            key={i}
            className={`border rounded-xl p-5 ${m.name === r.recommended_model
              ? "border-indigo-500/50 bg-indigo-500/5"
              : "border-slate-700 bg-slate-700/20"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white">{m.name}</h3>
                  {m.name === r.recommended_model && (
                    <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">Recommended</span>
                  )}
                </div>
                <p className="text-slate-400 text-sm mt-1">{m.description}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0 ml-3">
                <span className={`text-xs px-2 py-0.5 rounded-full ${complexityColors[m.complexity]}`}>
                  {m.complexity} complexity
                </span>
                <span className="text-xs text-slate-400">{m.estimated_time_to_revenue}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs font-semibold text-emerald-400 mb-1">Pros</div>
                <ul className="space-y-0.5">
                  {m.pros.map((p, j) => (
                    <li key={j} className="text-slate-300 text-xs flex items-start gap-1"><span className="text-emerald-400">+</span>{p}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs font-semibold text-red-400 mb-1">Cons</div>
                <ul className="space-y-0.5">
                  {m.cons.map((c, j) => (
                    <li key={j} className="text-slate-300 text-xs flex items-start gap-1"><span className="text-red-400">−</span>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            {m.example_companies.length > 0 && (
              <div className="mt-3 text-xs text-slate-500">
                Similar to: {m.example_companies.join(", ")}
              </div>
            )}
          </div>
        ))}

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">Unit Economics Example</div>
          <p className="text-white text-sm leading-relaxed">{r.unit_economics_example}</p>
        </div>
      </div>
      <WhatThisMeansBox text={r.what_this_means_for_you} />
    </SectionCard>
  );
}
