"use client";

import EmptyState from "@/components/ui/EmptyState";
import { formatCurrency, formatDate } from "@/utils/formatters";

export default function RentTable({ rents = [] }) {
  if (!rents.length) {
    return <EmptyState title="No paid rent history" description="Paid shop rent entries will appear here." />;
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-md shadow-slate-200/70 ring-1 ring-slate-200">
      <div className="overflow-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-slate-950 text-white">
            <tr>
              {["Month", "Amount", "Paid Date", "Status"].map((heading) => (
                <th key={heading} className="px-5 py-4 font-bold">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rents.map((rent) => (
              <tr key={rent._id || rent.month} className="transition hover:bg-slate-50">
                <td className="px-5 py-4 font-bold text-slate-900">{rent.month}</td>
                <td className="px-5 py-4 font-semibold text-slate-700">{formatCurrency(rent.amount)}</td>
                <td className="px-5 py-4 text-slate-700">{rent.paidDate ? formatDate(rent.paidDate) : "-"}</td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-700">
                    Paid
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
