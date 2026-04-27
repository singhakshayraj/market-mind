import { SlideFooter } from "./ProblemSlide";
import type { GoToMarketContent } from "@/lib/schemas/12-pitch-deck";

interface Props {
  title: string;
  subtitle: string | null;
  content: GoToMarketContent;
}

const colBgs = ["#fff", "#F3F4F6", "#fff"];

export default function GoToMarketSlide({ title, subtitle, content }: Props) {
  return (
    <div className="slide-inner">
      <div className="slide-accent-bar" />
      <div className="slide-body">
        <h2 className="slide-title">{title}</h2>
        {subtitle && <p className="slide-subtitle">{subtitle}</p>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 10 }}>
          {content.phases.map((phase, i) => (
            <div key={i} style={{ background: colBgs[i], borderRadius: 8, padding: "8px 10px", border: "1px solid #E5E7EB", display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "clamp(8px,1.1vw,10px)", fontWeight: 700, color: "#FF9933", marginBottom: 2 }}>{phase.phase}</div>
              <div style={{ fontSize: "clamp(9px,1.2vw,12px)", fontWeight: 700, color: "#111827", marginBottom: 6, lineHeight: 1.2 }}>{phase.focus}</div>
              {phase.key_actions.map((a, j) => (
                <div key={j} style={{ fontSize: "clamp(7px,1vw,10px)", color: "#6B7280", marginBottom: 3 }}>• {a}</div>
              ))}
              <div style={{ marginTop: "auto", background: "#10B981", borderRadius: 4, padding: "3px 6px", textAlign: "center" }}>
                <span style={{ fontSize: "clamp(7px,0.9vw,9px)", fontWeight: 700, color: "#fff" }}>{phase.target_milestone}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "#EFF6FF", border: "1px solid #1A56DB", borderRadius: 6, padding: "6px 10px" }}>
          <span style={{ fontSize: "clamp(9px,1.2vw,11px)", fontWeight: 700, color: "#1A56DB" }}>First customer channel: {content.first_customer_channel}</span>
        </div>
      </div>
      <SlideFooter num={7} />
    </div>
  );
}
