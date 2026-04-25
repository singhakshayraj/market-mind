import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import ReportClient from "@/components/report/ReportClient";

interface Props {
  params: { reportId: string };
}

export default async function ReportPage({ params }: Props) {
  const supabase = createServiceClient();
  const { data: report, error } = await supabase
    .from("reports")
    .select("*")
    .eq("id", params.reportId)
    .single();

  if (error || !report) {
    notFound();
  }

  return <ReportClient report={report} />;
}
