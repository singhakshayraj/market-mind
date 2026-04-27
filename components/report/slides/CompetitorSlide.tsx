import { SlideFooter } from "./ProblemSlide";
import type { CompetitorContent } from "@/lib/schemas/12-pitch-deck";

interface Props {
  title: string;
  subtitle: string | null;
  content: CompetitorContent;
}

export default function CompetitorSlide({ title, subtitle, content }: Props) {
  const threatColor = (level: string) =>
    level === "high" ? "#EF4444" : level === "medium" ? "#F59E0B" : "#10B981";

  return (
    <div className="slide-inner">
      <div className="slide-accent-bar" />
      <div className="slide-body">
        <h2 className="slide-title">{title}</h2>
        {subtitle && <p className="slide-subtitle">{subtitle}</p>}
        <p style={{ fontSize: "clamp(9px,1.3vw,12px)", color: "#1A56DB", fontStyle: "italic", fontWeight: 600, marginBottom: 8 }}>{content.our_position}</p>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 10, fontSize: "clamp(8px,1.1vw,11px)" }}>
          <thead>
            <tr>
              {["Competitor", "Strength", "Weakness", "Threat"].map((h) => (
                <th key={h} style={{ background: "#111827", color: "#fff", padding: "5px 8px", textAlign: "left", fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {content.competitors.map((comp, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#F3F4F6" }}>
                <td style={{ padding: "5px 8px", fontWeight: 700, color: "#111827", border: "1px solid #E5E7EB" }}>{comp.name}</td>
                <td style={{ padding: "5px 8px", color: "#6B7280", border: "1px solid #E5E7EB" }}>{comp.their_strength}</td>
                <td style={{ padding: "5px 8px", color: "#6B7280", border: "1px solid #E5E7EB" }}>{comp.their_weakness}</td>
                <td style={{ padding: "5px 8px", border: "1px solid #E5E7EB", background: threatColor(comp.threat_level), color: "#fff", fontWeight: 700, textAlign: "center" }}>
                  {comp.threat_level.toUpperCase()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ background: "#FF9933", borderRadius: 6, padding: "6px 12px", textAlign: "center" }}>
          <span style={{ fontSize: "clamp(9px,1.3vw,12px)", fontWeight: 700, color: "#111827" }}>Our advantage: {content.our_advantage}</span>
        </div>
      </div>
      <SlideFooter num={5} />
    </div>
  );
}
