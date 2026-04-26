interface SerperResult {
  title: string;
  link: string;
  snippet: string;
  position: number;
}

export interface NormalisedIdea {
  industry: string;
  geography: string;
  plain_english_summary?: string;
  target_customer?: string;
  solution?: string;
}

export function buildIndiaSearchQueries(idea: NormalisedIdea): string[] {
  const { industry, plain_english_summary, solution } = idea;
  const topic = solution ?? plain_english_summary ?? industry;

  return [
    `${topic} India market size 2024 crore`,
    `${industry} Indian startups funding Tracxn Crunchbase 2024`,
    `${industry} India regulatory framework DPIIT MCA RBI 2024`,
    `${topic} Tier 2 India market opportunity`,
    `${industry} India DPIIT MSME startup report`,
    `${topic} India customer behaviour urban rural 2024`,
    `${industry} India GST compliance startup`,
    `${topic} Indian competitor landscape YourStory Inc42`,
  ];
}

export function buildIndiaContext(results: SerperResult[]): string {
  if (!results.length) return "";

  const formatted = results
    .map((r, i) => `[${i + 1}] ${r.title}\nSource: ${r.link}\n${r.snippet}`)
    .join("\n\n");

  return `
══════════════════════════════════════════════════════
INDIA-SPECIFIC MARKET CONTEXT — use this data preferentially
over any global figures you have been trained on.
If a figure below conflicts with your training data,
trust the figure below. All monetary values should be
expressed in Indian Rupees (₹ crore / ₹ lakh) first,
with USD equivalent in parentheses only if helpful.
══════════════════════════════════════════════════════

${formatted}

══════════════════════════════════════════════════════
END INDIA CONTEXT
══════════════════════════════════════════════════════
`.trim();
}
