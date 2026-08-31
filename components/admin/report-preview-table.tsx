import type { ReportRow } from "@/types";

export function ReportPreviewTable({ rows }: { rows: ReportRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-subtle">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50 text-left text-sm text-slate-500 whitespace-nowrap">
          <tr>
            <th className="px-4 py-3">Loan</th>
            <th className="px-4 py-3">Item</th>
            <th className="px-4 py-3">Borrower</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Qty</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 whitespace-nowrap">
          {rows.map((row) => (
            <tr key={row.loanId}>
              <td className="px-4 py-4 text-sm text-slate-700">{row.loanId}</td>
              <td className="px-4 py-4 text-sm text-slate-700">{row.itemName}</td>
              <td className="px-4 py-4 text-sm text-slate-700">{row.borrowerName}</td>
              <td className="px-4 py-4 text-sm text-slate-700">{row.status}</td>
              <td className="px-4 py-4 text-sm text-slate-700">{row.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
