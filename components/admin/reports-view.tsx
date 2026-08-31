"use client";

import { useMemo, useState } from "react";
import { ReportExportButtons } from "@/components/admin/report-export-buttons";
import { ReportFilters } from "@/components/admin/report-filters";
import { ReportPreviewTable } from "@/components/admin/report-preview-table";
import type { ReportRow } from "@/types";

export function ReportsView({ rows }: { rows: ReportRow[] }) {
  const [range, setRange] = useState({ from: "", to: "" });
  const filtered = useMemo(
    () =>
      rows.filter((row) => {
        if (range.from && row.borrowDate < range.from) return false;
        if (range.to && row.returnDate > range.to) return false;
        return true;
      }),
    [rows, range]
  );

  return (
    <div className="space-y-6">
      <ReportFilters onChange={setRange} />
      <ReportExportButtons rows={filtered} />
      <ReportPreviewTable rows={filtered} />
    </div>
  );
}
