import { SlideFooter } from "./ProblemSlide";
import type { WhyNowContent } from "@/lib/schemas/12-pitch-deck";

interface Props {
  title: string;
  subtitle: string | null;
  content: WhyNowContent;
}

export default function WhyNowSlide({ title, subtitle, content }: Props) {
  return (
    <div className="slide-inner">
      <div className="slide-accent-bar" />
      <div className="slide-body">
        <h2 className="slide-title">{title}</h2>
        {subtitle && <p className="slide-subtitle">{subtitle}</p>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 12 }}>
          {content.tailwinds.map((tw, i) => (
            <div key={i} style={{ background: "#F3F4F6", borderRadius: 10, padding: "10px 12px", border: "1px solid #E5E7EB" }}>
              <div style={{ fontSize: "clamp(10px,1.4vw,13px)", fontWeight: 700, color: "#111827", marginBottom: 6, lineHeight: 1.2 }}>{tw.trend}</div>
              <div style={{ fontSize: "clamp(8px,1.1vw,10px)", color: "#6B7280", fontStyle: "italic", marginBottom: 8, lineHeight: 1.4 }}>{tw.evidence}</div>
              <div style={{ fontSize: "clamp(9px,1.2vw,11px)", fontWeight: 700, color: "#FF9933" }}>{tw.impact_on_us}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "#111827", borderRadius: 8, padding: "8px 14px", textAlign: "center" }}>
          <span style={{ fontSize: "clamp(10px,1.4vw,13px)", fontWeight: 700, color: "#fff" }}>⚡ {content.inflection_point}</span>
        </div>
      </div>
      <SlideFooter num={9} />
    </div>
  );
}
