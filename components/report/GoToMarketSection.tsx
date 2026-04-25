import SectionCard, { WhatThisMeansBox } from "@/components/ui/SectionCard";
import type { GoToMarket } from "@/lib/schemas";

interface Props {
  data?: { result: GoToMarket; modelUsed: string; error?: string };
}

export default function GoToMarketSection({ data }: Props) {
  if (!data) return null;
  if (data.error) return <SectionCard title="Go-to-Market Playbook" emoji="🚀" error={data.error}><></></SectionCard>;

  const r = data.result;
  return (
    <SectionCard title="Go-to-Market Playbook" emoji="🚀" modelUsed={data.modelUsed} summary={r.plain_english_summary}>
      <div className="space-y-5 mt-4">
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
          <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">Your Positioning</div>
          <p className="text-white text-sm leading-relaxed">{r.positioning_statement}</p>
        </div>

        {/* 90 day plan */}
        <div>
          <div className="text-sm font-semibold text-white mb-3">First 90 Days</div>
          <div className="space-y-3">
            {r.first_90_days.map((phase, i) => (
              <div key={i} className="border border-slate-700 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded">{phase.week_range}</span>
                  <span className="font-semibold text-white text-sm">{phase.focus}</span>
                </div>
                <ul className="space-y-1.5">
                  {phase.actions.map((a, j) => (
                    <li key={j} className="text-slate-300 text-sm flex items-start gap-2">
                      <span className="text-indigo-400 shrink-0 mt-0.5">→</span>{a}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Channels */}
        <div>
          <div className="text-sm font-semibold text-white mb-3">Channels to Focus On</div>
          <div className="space-y-3">
            {r.channels.map((ch, i) => (
              <div key={i} className="bg-slate-700/30 rounded-xl p-4">
                <div className="font-semibold text-white text-sm mb-1">{ch.channel}</div>
                <p className="text-slate-400 text-xs mb-2">{ch.why}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-emerald-400 font-medium">First step: </span>
                    <span className="text-slate-300">{ch.how_to_start}</span>
                  </div>
                  <div>
                    <span className="text-amber-400 font-medium">Expect: </span>
                    <span className="text-slate-300">{ch.expected_outcome}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* First customer script */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Your First Outreach Script</div>
          <p className="text-slate-300 text-sm leading-relaxed italic">&ldquo;{r.first_customer_script}&rdquo;</p>
        </div>

        <div className="bg-slate-700/40 rounded-xl p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Your One Key Message</div>
          <p className="text-white text-sm font-medium">{r.key_message}</p>
        </div>
      </div>
      <WhatThisMeansBox text={r.what_this_means_for_you} />
    </SectionCard>
  );
}
