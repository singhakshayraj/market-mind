import { SlideFooter } from "./ProblemSlide";
import type { BusinessModelContent } from "@/lib/schemas/12-pitch-deck";

interface Props {
  title: string;
  subtitle: string | null;
  content: BusinessModelContent;
}

export default function BusinessModelSlide({ title, subtitle, content }: Props) {
  return (
    <div className="slide-inner">
      <div className="slide-accent-bar" />
      <div className="slide-body">
        <h2 className="slide-title">{title}</h2>
        {subtitle && <p className="slide-subtitle">{subtitle}</p>}
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${content.revenue_streams.length}, 1fr)`, gap: 12, marginBottom: 14 }}>
          {content.revenue_streams.map((rs, i) => (
            <div key={i} style={{ background: "#F3F4F6", borderRadius: 10, padding: "10px 12px", border: "1px solid #E5E7EB" }}>
              <div style={{ fontSize: "clamp(10px,1.4vw,13px)", fontWeight: 700, color: "#111827", marginBottom: 4 }}>{rs.name}</div>
              <div style={{ fontSize: "clamp(8px,1.1vw,11px)", color: "#6B7280", marginBottom: 8 }}>{rs.how_it_works}</div>
              <div style={{ fontSize: "clamp(12px,1.8vw,18px)", fontWeight: 700, color: "#FF9933" }}>{rs.example}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <span style={{ fontSize: "clamp(13px,1.8vw,20px)", fontWeight: 700, color: "#10B981" }}>{content.unit_economics_headline}</span>
        </div>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: "clamp(9px,1.2vw,12px)", color: "#6B7280", fontStyle: "italic" }}>{content.path_to_profitability}</span>
        </div>
      </div>
      <SlideFooter num={6} />
    </div>
  );
}
