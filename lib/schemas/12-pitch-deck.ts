import { z } from "zod";

export const SlideTypeEnum = z.enum([
  "problem",
  "solution",
  "market_size",
  "customer",
  "competitor",
  "business_model",
  "go_to_market",
  "risk",
  "why_now",
  "ask",
]);
export type SlideType = z.infer<typeof SlideTypeEnum>;

const ProblemContentSchema = z.object({
  problem_statement: z.string(),
  pain_points: z.array(
    z.object({
      icon_suggestion: z.string(),
      heading: z.string(),
      description: z.string(),
    })
  ).length(3),
  who_feels_this: z.string(),
});

const SolutionContentSchema = z.object({
  solution_statement: z.string(),
  before: z.array(z.string()).length(3),
  after: z.array(z.string()).length(3),
  key_differentiator: z.string(),
});

const MarketSizeContentSchema = z.object({
  tam_inr: z.string(),
  sam_inr: z.string(),
  som_inr: z.string(),
  tam_usd: z.string(),
  growth_rate: z.string(),
  source: z.string(),
  why_now_one_line: z.string(),
});

const CustomerContentSchema = z.object({
  personas: z.array(
    z.object({
      name: z.string(),
      age_range: z.string(),
      tier_city: z.string(),
      income_inr: z.string(),
      job_to_be_done: z.string(),
      biggest_frustration: z.string(),
    })
  ).length(2),
});

const CompetitorContentSchema = z.object({
  our_position: z.string(),
  competitors: z.array(
    z.object({
      name: z.string(),
      their_strength: z.string(),
      their_weakness: z.string(),
      threat_level: z.enum(["low", "medium", "high"]),
    })
  ).max(5),
  our_advantage: z.string(),
});

const BusinessModelContentSchema = z.object({
  revenue_streams: z.array(
    z.object({
      name: z.string(),
      how_it_works: z.string(),
      example: z.string(),
    })
  ).max(3),
  unit_economics_headline: z.string(),
  path_to_profitability: z.string(),
});

const GoToMarketContentSchema = z.object({
  phases: z.array(
    z.object({
      phase: z.string(),
      focus: z.string(),
      key_actions: z.array(z.string()).max(3),
      target_milestone: z.string(),
    })
  ).length(3),
  first_customer_channel: z.string(),
});

const RiskContentSchema = z.object({
  risks: z.array(
    z.object({
      risk: z.string(),
      severity: z.enum(["low", "medium", "high"]),
      mitigation: z.string(),
    })
  ).max(4),
  biggest_risk_acknowledged: z.string(),
});

const WhyNowContentSchema = z.object({
  tailwinds: z.array(
    z.object({
      trend: z.string(),
      evidence: z.string(),
      impact_on_us: z.string(),
    })
  ).length(3),
  inflection_point: z.string(),
});

const AskContentSchema = z.object({
  mode: z.enum(["funding_ask", "next_steps"]),
  amount_inr: z.string().nullable(),
  use_of_funds: z.array(z.string()).max(4).nullable(),
  runway_months: z.number().nullable(),
  next_steps: z.array(z.string()).max(4),
  contact_prompt: z.string(),
  closing_statement: z.string(),
});

export const SlideContentSchema = z.union([
  ProblemContentSchema,
  SolutionContentSchema,
  MarketSizeContentSchema,
  CustomerContentSchema,
  CompetitorContentSchema,
  BusinessModelContentSchema,
  GoToMarketContentSchema,
  RiskContentSchema,
  WhyNowContentSchema,
  AskContentSchema,
]);

export const SlideSchema = z.object({
  slide_number: z.number().min(1).max(10),
  slide_type: SlideTypeEnum,
  title: z.string(),
  subtitle: z.string().nullable(),
  content: z.record(z.string(), z.unknown()),
  speaker_notes: z.string(),
  data_sources: z.array(z.string()),
});

export const PitchDeckOutputSchema = z.object({
  deck_title: z.string(),
  tagline: z.string(),
  generated_at: z.string(),
  idea_name: z.string(),
  slides: z.array(SlideSchema).length(10),
});

export type PitchDeckOutput = z.infer<typeof PitchDeckOutputSchema>;
export type Slide = z.infer<typeof SlideSchema>;
export type ProblemContent = z.infer<typeof ProblemContentSchema>;
export type SolutionContent = z.infer<typeof SolutionContentSchema>;
export type MarketSizeContent = z.infer<typeof MarketSizeContentSchema>;
export type CustomerContent = z.infer<typeof CustomerContentSchema>;
export type CompetitorContent = z.infer<typeof CompetitorContentSchema>;
export type BusinessModelContent = z.infer<typeof BusinessModelContentSchema>;
export type GoToMarketContent = z.infer<typeof GoToMarketContentSchema>;
export type RiskContent = z.infer<typeof RiskContentSchema>;
export type WhyNowContent = z.infer<typeof WhyNowContentSchema>;
export type AskContent = z.infer<typeof AskContentSchema>;
