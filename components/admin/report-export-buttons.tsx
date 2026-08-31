"use client";

import { Button } from "@/components/ui/button";
import { exportReportCsv, exportReportPdf } from "@/lib/utils/report-export";
import type { ReportRow } from "@/types";

export function ReportExportButtons({ rows }: { rows: ReportRow[] }) {
  return (
    <div className="flex gap-3">
      <Button variant="secondary" onClick={() => exportReportCsv(rows)}>
        Export CSV
      </Button>
      <Button onClick={() => exportReportPdf(rows)}>Export PDF</Button>
    </div>
  );
}
