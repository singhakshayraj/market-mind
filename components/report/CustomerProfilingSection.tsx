import SectionCard, { WhatThisMeansBox } from "@/components/ui/SectionCard";
import type { CustomerProfiling } from "@/lib/schemas";

interface Props {
  data?: { result: CustomerProfiling; modelUsed: string; error?: string };
}

export default function CustomerProfilingSection({ data }: Props) {
  if (!data) return null;
  if (data.error) return <SectionCard title="Customer Profiles" emoji="👥" error={data.error}><></></SectionCard>;

  const r = data.result;
  return (
    <SectionCard title="Customer Profiles" emoji="👥" modelUsed={data.modelUsed} summary={r.plain_english_summary}>
      <div className="space-y-4 mt-4">
        {r.personas.map((p, i) => (
          <div key={i} className="border border-slate-700 rounded-xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-white text-base">{p.name}</h3>
                <p className="text-slate-400 text-sm">{p.occupation} · {p.age_range}</p>
              </div>
              <div className="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full">
                Persona {i + 1}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Goals</div>
                <ul className="space-y-1">
                  {p.goals.map((g, j) => (
                    <li key={j} className="text-slate-300 text-sm flex items-start gap-1.5">
                      <span className="text-emerald-400 shrink-0">✓</span>{g}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">Pain Points</div>
                <ul className="space-y-1">
                  {p.pain_points.map((pain, j) => (
                    <li key={j} className="text-slate-300 text-sm flex items-start gap-1.5">
                      <span className="text-red-400 shrink-0">✗</span>{pain}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">Where to Find Them</div>
                <ul className="space-y-1">
                  {p.where_to_find_them.map((w, j) => (
                    <li key={j} className="text-slate-400 text-xs">→ {w}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Willingness to Pay</div>
                <p className="text-slate-300 text-sm">{p.willingness_to_pay}</p>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">Your First Customer</div>
          <p className="text-slate-300 text-sm leading-relaxed">{r.early_adopter_profile}</p>
        </div>
      </div>
      <WhatThisMeansBox text={r.what_this_means_for_you} />
    </SectionCard>
  );
}
