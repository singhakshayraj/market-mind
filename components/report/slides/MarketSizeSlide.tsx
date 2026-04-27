import { SlideFooter } from "./ProblemSlide";
import type { MarketSizeContent } from "@/lib/schemas/12-pitch-deck";

interface Props {
  title: string;
  subtitle: string | null;
  content: MarketSizeContent;
}

export default function MarketSizeSlide({ title, subtitle, content }: Props) {
  const boxes = [
    { label: "TAM — Total Market", value: content.tam_inr, sub: content.tam_usd, bg: "#1A56DB", fg: "#fff", flex: 2 },
    { label: "SAM — Serviceable", value: content.sam_inr, sub: "", bg: "#3B82F6", fg: "#fff", flex: 1.5 },
    { label: "SOM — Your Target", value: content.som_inr, sub: "", bg: "#BFDBFE", fg: "#111827", flex: 1 },
  ];

  return (
    <div className="slide-inner">
      <div className="slide-accent-bar" />
      <div className="slide-body">
        <h2 className="slide-title">{title}</h2>
        {subtitle && <p className="slide-subtitle">{subtitle}</p>}
        <div style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "stretch" }}>
          {boxes.map((box, i) => (
            <div key={i} style={{ flex: box.flex, background: box.bg, borderRadius: 10, padding: "10px 10px", color: box.fg, minHeight: 80 }}>
              <div style={{ fontSize: "clamp(7px,1vw,10px)", fontWeight: 700, marginBottom: 4, opacity: 0.85 }}>{box.label}</div>
              <div style={{ fontSize: "clamp(12px,1.8vw,22px)", fontWeight: 800, lineHeight: 1.1 }}>{box.value}</div>
              {box.sub && <div style={{ fontSize: "clamp(8px,1.1vw,11px)", opacity: 0.75, marginTop: 3 }}>{box.sub}</div>}
            </div>
          ))}
          <div style={{ background: "#D1FAE5", border: "1px solid #10B981", borderRadius: 8, padding: "8px 10px", display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 80 }}>
            <div style={{ fontSize: "clamp(7px,1vw,9px)", color: "#065F46", fontWeight: 700 }}>📈 Growth</div>
            <div style={{ fontSize: "clamp(10px,1.4vw,14px)", fontWeight: 800, color: "#065F46" }}>{content.growth_rate}</div>
          </div>
        </div>
        <p style={{ fontSize: "clamp(9px,1.2vw,11px)", color: "#6B7280", fontStyle: "italic", textAlign: "center", marginBottom: 4 }}>{content.why_now_one_line}</p>
        <p style={{ fontSize: "clamp(7px,0.9vw,9px)", color: "#9CA3AF", textAlign: "center" }}>Source: {content.source}</p>
      </div>
      <SlideFooter num={3} />
    </div>
  );
}
