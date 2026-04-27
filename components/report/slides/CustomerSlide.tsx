import { SlideFooter } from "./ProblemSlide";
import type { CustomerContent } from "@/lib/schemas/12-pitch-deck";

interface Props {
  title: string;
  subtitle: string | null;
  content: CustomerContent;
}

export default function CustomerSlide({ title, subtitle, content }: Props) {
  return (
    <div className="slide-inner">
      <div className="slide-accent-bar" />
      <div className="slide-body">
        <h2 className="slide-title">{title}</h2>
        {subtitle && <p className="slide-subtitle">{subtitle}</p>}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {content.personas.map((p, i) => {
            const isTier2or3 = p.tier_city.includes("2") || p.tier_city.includes("3");
            return (
              <div key={i} style={{ background: "#F3F4F6", borderRadius: 10, overflow: "hidden", border: "1px solid #E5E7EB" }}>
                <div style={{ background: "#111827", padding: "7px 10px" }}>
                  <span style={{ fontSize: "clamp(10px,1.4vw,13px)", fontWeight: 700, color: "#fff" }}>{p.name} · {p.age_range}</span>
                </div>
                <div style={{ padding: "8px 10px" }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: "clamp(7px,0.9vw,9px)", fontWeight: 700, color: "#fff", background: isTier2or3 ? "#FF9933" : "#1A56DB", padding: "2px 7px", borderRadius: 4 }}>{p.tier_city}</span>
                    <span style={{ fontSize: "clamp(9px,1.2vw,11px)", fontWeight: 700, color: "#10B981" }}>{p.income_inr}</span>
                  </div>
                  <div style={{ fontSize: "clamp(7px,0.9vw,9px)", fontWeight: 700, color: "#6B7280", marginBottom: 2 }}>Job to be done:</div>
                  <div style={{ fontSize: "clamp(9px,1.2vw,11px)", color: "#111827", marginBottom: 6 }}>{p.job_to_be_done}</div>
                  <div style={{ fontSize: "clamp(7px,0.9vw,9px)", fontWeight: 700, color: "#EF4444", marginBottom: 2 }}>Biggest frustration:</div>
                  <div style={{ fontSize: "clamp(9px,1.2vw,11px)", color: "#111827" }}>{p.biggest_frustration}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <SlideFooter num={4} />
    </div>
  );
}
