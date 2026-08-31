"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import type { ReportRow } from "@/types";

function downloadBlob(content: Blob, filename: string) {
  const url = URL.createObjectURL(content);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportReportCsv(rows: ReportRow[]) {
  const csv = Papa.unparse(rows);
  downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8;" }), "sims-report.csv");
}

export function exportReportPdf(rows: ReportRow[]) {
  const doc = new jsPDF();
  autoTable(doc, {
    head: [["Loan ID", "Item", "Borrower", "Status", "Qty", "Borrow", "Return"]],
    body: rows.map((row) => [row.loanId, row.itemName, row.borrowerName, row.status, String(row.quantity), row.borrowDate, row.returnDate])
  });
  doc.save("sims-report.pdf");
}
