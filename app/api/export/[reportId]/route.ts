import { NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: { reportId: string } }
) {
  const { reportId } = params;

  // Verify report exists
  const supabase = createServiceClient();
  const { data: report, error } = await supabase
    .from("reports")
    .select("id, idea_text")
    .eq("id", reportId)
    .single();

  if (error || !report) {
    return new Response(JSON.stringify({ error: "Report not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Build the absolute URL for the report page
  const host = req.headers.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const reportUrl = `${protocol}://${host}/report/${reportId}?print=1`;

  let browser;
  try {
    const puppeteer = await import("puppeteer");
    browser = await puppeteer.default.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    // Wait for full page render including all section components
    await page.goto(reportUrl, { waitUntil: "networkidle0", timeout: 45000 });

    // Inject print-optimised styles
    await page.addStyleTag({
      content: `
        header { display: none !important; }
        nav { display: none !important; }
        button { display: none !important; }
        body { background: #fff !important; color: #111 !important; }
        * { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      `,
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "16mm", bottom: "16mm", left: "12mm", right: "12mm" },
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-size:9px;color:#6b7280;width:100%;text-align:center;padding:0 12mm;">
          MarketMind AI Report
        </div>`,
      footerTemplate: `
        <div style="font-size:9px;color:#6b7280;width:100%;text-align:center;padding:0 12mm;">
          Page <span class="pageNumber"></span> of <span class="totalPages"></span>
          &nbsp;·&nbsp; marketmind.ai
        </div>`,
    });

    const filename = `marketmind-report-${reportId.slice(0, 8)}.pdf`;

    return new Response(Buffer.from(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("PDF export error:", err);
    return new Response(JSON.stringify({ error: "PDF generation failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await browser?.close();
  }
}
