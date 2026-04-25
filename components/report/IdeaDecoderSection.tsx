import SectionCard, { WhatThisMeansBox } from "@/components/ui/SectionCard";
import type { IdeaDecoder } from "@/lib/schemas";

interface Props {
  data?: { result: IdeaDecoder; modelUsed: string; error?: string };
}

export default function IdeaDecoderSection({ data }: Props) {
  if (!data) return null;
  if (data.error) return <SectionCard title="Idea Decoder" emoji="💡" error={data.error}><></></SectionCard>;

  const r = data.result;
  return (
    <SectionCard title="Idea Decoder" emoji="💡" modelUsed={data.modelUsed} summary={r.plain_english_summary}>
      <div className="space-y-4 mt-4">
        {[
          { label: "The Problem", value: r.problem_statement },
          { label: "Your Solution", value: r.solution },
          { label: "Who It's For", value: r.target_customer },
          { label: "Why People Will Choose You", value: r.value_proposition },
        ].map(({ label, value }) => (
          <div key={label} className="bg-slate-700/30 rounded-xl p-4">
            <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">{label}</div>
            <p className="text-white text-sm leading-relaxed">{value}</p>
          </div>
        ))}

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-700/30 rounded-xl p-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Industry</div>
            <p className="text-white text-sm capitalize">{r.industry}</p>
          </div>
          <div className="bg-slate-700/30 rounded-xl p-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Geography</div>
            <p className="text-white text-sm">{r.geography}</p>
          </div>
        </div>

        {r.key_assumptions.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Key Assumptions</div>
            <ul className="space-y-2">
              {r.key_assumptions.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-amber-400 mt-0.5 shrink-0">→</span>
                  {a}
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
