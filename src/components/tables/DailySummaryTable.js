"use client";

import { FiEye } from "react-icons/fi";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { formatCurrency, formatDate } from "@/utils/formatters";

export default function DailySummaryTable({ rows, onView }) {
  if (!rows.length) {
    return <EmptyState title="No transactions found" description="Add a daily entry or change the active filters." />;
  }

  return (
    <div id="transactions" className="overflow-hidden rounded-xl bg-white shadow-md shadow-slate-200/70 ring-1 ring-slate-200">
      <div className="max-h-[620px] overflow-auto">
        <table className="w-full min-w-[860px] border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-950 text-white">
            <tr>
              {["Date", "Cash Income", "Online Income", "Cash Expense", "Online Expense", "Net", "Action"].map((head) => (
                <th key={head} className="px-5 py-4 font-bold">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.date} className="transition hover:bg-slate-50">
                <td className="px-5 py-4 font-bold text-slate-900">{formatDate(row.date)}</td>
                <td className="px-5 py-4 text-slate-700">{formatCurrency(row.cashIncome)}</td>
                <td className="px-5 py-4 text-slate-700">{formatCurrency(row.onlineIncome)}</td>
                <td className="px-5 py-4 text-slate-700">{formatCurrency(row.cashExpense)}</td>
                <td className="px-5 py-4 text-slate-700">{formatCurrency(row.onlineExpense)}</td>
                <td className={`px-5 py-4 font-black ${row.net >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                  {formatCurrency(row.net)}
                </td>
                <td className="px-5 py-4">
                  <Button variant="secondary" className="min-h-10 px-3" onClick={() => onView(row)}>
                    <FiEye />
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
