"use client";

import { FiEdit3, FiTrash2, FiX } from "react-icons/fi";
import Button from "@/components/ui/Button";
import { formatCurrency, formatDate } from "@/utils/formatters";

function AmountLine({ label, value, strong = false }) {
  return (
    <div className={`flex items-center justify-between gap-4 py-2 ${strong ? "font-black text-slate-950" : "font-semibold text-slate-600"}`}>
      <span>{label}</span>
      <span className="text-right">{formatCurrency(value)}</span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
      <h4 className="mb-2 text-xs font-black uppercase tracking-wide text-slate-400">{title}</h4>
      {children}
    </div>
  );
}

export default function ReportModal({ day, onClose, onEdit, onDelete }) {
  if (!day) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <button className="absolute inset-0 bg-slate-950/60" onClick={onClose} type="button" />
      <section className="relative max-h-[92vh] w-full max-w-2xl animate-[fadeIn_.2s_ease] overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-slate-200">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">Daily Report</p>
            <h3 className="mt-2 text-2xl font-black text-slate-950">{formatDate(day.date)}</h3>
          </div>
          <Button variant="ghost" className="min-h-0 rounded-lg p-2" onClick={onClose}>
            <FiX />
          </Button>
        </div>

        <div className="max-h-[calc(92vh-164px)] space-y-4 overflow-y-auto p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Section title="Income">
              <AmountLine label="Cash Income" value={day.cashIncome} />
              <AmountLine label="Online Income" value={day.onlineIncome} />
              <div className="mt-2 border-t border-slate-200 pt-2">
                <AmountLine label="Total Income" value={day.totalIncome} strong />
              </div>
            </Section>

            <Section title="Expense">
              <AmountLine label="Cash Expense" value={day.cashExpense} />
              <AmountLine label="Online Expense" value={day.onlineExpense} />
              <div className="mt-2 border-t border-slate-200 pt-2">
                <AmountLine label="Total Expense" value={day.totalExpense} strong />
              </div>
            </Section>
          </div>

          <div className={`rounded-xl p-4 ring-1 ${day.net >= 0 ? "bg-emerald-50 text-emerald-800 ring-emerald-100" : "bg-rose-50 text-rose-800 ring-rose-100"}`}>
            <AmountLine label="Net Balance" value={day.net} strong />
          </div>

          <Section title="Expense Notes / Description">
            {day.descriptions?.length ? (
              <ul className="space-y-2">
                {day.descriptions.map((description) => (
                  <li key={description} className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
                    {description}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm font-semibold text-slate-500">No expense description saved for this report.</p>
            )}
          </Section>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-5">
          <Button type="button" variant="secondary" onClick={onEdit}>
            <FiEdit3 />
            Edit
          </Button>
          <Button type="button" className="bg-rose-600 hover:bg-rose-700" onClick={onDelete}>
            <FiTrash2 />
            Delete
          </Button>
        </div>
      </section>
    </div>
  );
}
