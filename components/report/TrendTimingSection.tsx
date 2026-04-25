import SectionCard, { WhatThisMeansBox } from "@/components/ui/SectionCard";
import type { TrendTiming } from "@/lib/schemas";

interface Props {
  data?: { result: TrendTiming; modelUsed: string; error?: string };
}

const verdictConfig = {
  too_early: { label: "Too Early", color: "text-amber-400", desc: "The market isn't ready yet — but you can be first" },
  good_timing: { label: "Good Timing", color: "text-emerald-400", desc: "The timing is right — move now" },
  peak_timing: { label: "Peak Timing", color: "text-blue-400", desc: "The market is hot — but differentiation is key" },
  late: { label: "Late", color: "text-red-400", desc: "The market is saturated — you'll need a very specific angle" },
};

export default function TrendTimingSection({ data }: Props) {
  if (!data) return null;
  if (data.error) return <SectionCard title="Trend & Timing Analysis" emoji="📈" error={data.error}><></></SectionCard>;

  const r = data.result;
  const vc = verdictConfig[r.timing_verdict];
  return (
    <SectionCard title="Trend & Timing Analysis" emoji="📈" modelUsed={data.modelUsed} summary={r.plain_english_summary}>
      <div className="space-y-4 mt-4">
        <div className={`border rounded-xl p-4 bg-opacity-10`} style={{ borderColor: "rgba(99,102,241,0.3)" }}>
          <div className="flex items-center gap-3">
            <div>
              <div className={`text-2xl font-bold ${vc.color}`}>{vc.label}</div>
              <p className="text-slate-400 text-sm mt-0.5">{vc.desc}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Tailwinds (helping you)</div>
            <div className="space-y-2">
              {r.tailwinds.map((t, i) => (
                <div key={i} className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                  <div className="font-medium text-white text-sm">{t.trend}</div>
                  <p className="text-slate-400 text-xs mt-1">{t.explanation}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">Headwinds (working against you)</div>
            <div className="space-y-2">
              {r.headwinds.map((h, i) => (
                <div key={i} className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                  <div className="font-medium text-white text-sm">{h.trend}</div>
                  <p className="text-slate-400 text-xs mt-1">{h.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {r.notable_recent_developments.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">Recent Developments</div>
            <ul className="space-y-1.5">
              {r.notable_recent_developments.map((d, i) => (
                <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                  <span className="text-blue-400 shrink-0">•</span>{d}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-xs text-slate-500">
          <span className="font-medium">Market stage: </span>{r.market_maturity_stage}
        </div>
      </div>
      <WhatThisMeansBox text={r.what_this_means_for_you} />
    </SectionCard>
  );
}
