import { SlideFooter } from "./ProblemSlide";
import type { AskContent } from "@/lib/schemas/12-pitch-deck";

interface Props {
  title: string;
  subtitle: string | null;
  content: AskContent;
}

const dotColors = ["#1A56DB", "#FF9933", "#10B981", "#8B5CF6"];

export default function AskSlide({ title, subtitle, content }: Props) {
  return (
    <div className="slide-inner">
      <div className="slide-accent-bar" />
      <div className="slide-body">
        <h2 className="slide-title">{title}</h2>
        {subtitle && <p className="slide-subtitle">{subtitle}</p>}

        {content.mode === "funding_ask" && content.amount_inr ? (
          <>
            <div style={{ textAlign: "center", marginBottom: 8 }}>
              <span style={{ fontSize: "clamp(24px,4vw,48px)", fontWeight: 800, color: "#1A56DB" }}>{content.amount_inr}</span>
            </div>
            {content.runway_months && (
              <div style={{ textAlign: "center", marginBottom: 10 }}>
                <span style={{ background: "#D1FAE5", border: "1px solid #10B981", borderRadius: 6, padding: "3px 12px", fontSize: "clamp(9px,1.3vw,12px)", fontWeight: 700, color: "#065F46" }}>
                  {content.runway_months} months runway
                </span>
              </div>
            )}
            <div style={{ marginBottom: 10 }}>
              {(content.use_of_funds ?? []).map((use, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: dotColors[i % dotColors.length], flexShrink: 0 }} />
                  <span style={{ fontSize: "clamp(9px,1.2vw,12px)", color: "#111827" }}>{use}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            {(content.next_steps ?? []).slice(0, 4).map((step, i) => (
              <div key={i} style={{ background: "#F3F4F6", borderRadius: 8, padding: "8px 10px", border: "1px solid #E5E7EB", display: "flex", alignItems: "flex-start", gap: 8 }}>
                <span style={{ fontSize: "clamp(16px,2.5vw,28px)", fontWeight: 800, color: "#FF9933", lineHeight: 1 }}>{i + 1}</span>
                <span style={{ fontSize: "clamp(9px,1.2vw,12px)", color: "#111827", lineHeight: 1.4 }}>{step}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 8 }}>
          <div style={{ fontSize: "clamp(10px,1.4vw,14px)", fontWeight: 700, color: "#111827", marginBottom: 4 }}>{content.contact_prompt}</div>
          <div style={{ fontSize: "clamp(9px,1.2vw,12px)", color: "#6B7280", fontStyle: "italic" }}>{content.closing_statement}</div>
        </div>
      </div>
      <SlideFooter num={10} />
    </div>
  );
}
