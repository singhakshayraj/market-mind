/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { buildReportDocument } from "@/lib/pdf/ReportDocument";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: { reportId: string } }
) {
  const { reportId } = params;

  const supabase = createServiceClient();
  const { data: report, error } = await supabase
    .from("reports")
    .select("*")
    .eq("id", reportId)
    .single();

  if (error || !report) {
    return new Response(JSON.stringify({ error: "Report not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const pdfBuffer = await renderToBuffer(buildReportDocument(report) as any);

    const filename = `marketmind-report-${reportId.slice(0, 8)}.pdf`;

    return new Response(new Uint8Array(pdfBuffer), {
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
  }
}
