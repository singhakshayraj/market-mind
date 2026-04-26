interface SerperResult {
  title: string;
  link: string;
  snippet: string;
  position: number;
}

interface SerperResponse {
  organic: SerperResult[];
}

export async function searchWeb(
  query: string,
  geography?: string
): Promise<SerperResult[]> {
  const gl = geographyToCountryCode(geography);

  const res = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "X-API-KEY": process.env.SERPER_API_KEY ?? "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ q: query, gl, hl: "en", num: 5 }),
  });

  if (!res.ok) {
    throw new Error(`Serper API error: ${res.status}`);
  }

  const data: SerperResponse = await res.json();
  return (data.organic ?? []).slice(0, 5);
}

export function formatSearchResults(results: SerperResult[]): string {
  return results
    .map(
      (r, i) =>
        `[${i + 1}] ${r.title}\nURL: ${r.link}\n${r.snippet}`
    )
    .join("\n\n");
}

// India-specific search — always targets google.co.in, returns 8 results
export async function indiaSearch(query: string): Promise<SerperResult[]> {
  const res = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "X-API-KEY": process.env.SERPER_API_KEY ?? "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ q: query, gl: "in", hl: "en", num: 8 }),
  });

  if (!res.ok) {
    throw new Error(`Serper India API error: ${res.status}`);
  }

  const data: SerperResponse = await res.json();
  return (data.organic ?? []).slice(0, 8);
}

function geographyToCountryCode(geography?: string): string {
  if (!geography) return "us";
  const map: Record<string, string> = {
    india: "in",
    "united states": "us",
    usa: "us",
    uk: "gb",
    "united kingdom": "gb",
    australia: "au",
    canada: "ca",
    singapore: "sg",
    uae: "ae",
    germany: "de",
    france: "fr",
  };
  return map[geography.toLowerCase()] ?? "us";
}
