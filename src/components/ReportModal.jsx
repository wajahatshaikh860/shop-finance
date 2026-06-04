"use client";

import {
  FiArrowDownCircle,
  FiArrowUpCircle,
  FiEdit3,
  FiFileText,
  FiTrendingUp,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import Button from "@/components/ui/Button";
import { formatCurrency, formatDate } from "@/utils/formatters";

function AmountLine({ label, value, strong = false, tone = "slate" }) {
  const toneClass = {
    slate: strong ? "text-slate-950" : "text-slate-600",
    emerald: strong ? "text-emerald-900" : "text-emerald-700",
    rose: strong ? "text-rose-900" : "text-rose-700",
  };

  return (
    <div className={`flex items-center justify-between gap-4 py-2 ${strong ? "font-black" : "font-semibold"} ${toneClass[tone]}`}>
      <span className="min-w-0">{label}</span>
      <span className="shrink-0 text-right tabular-nums">{formatCurrency(value)}</span>
    </div>
  );
}

function Section({ title, icon: Icon, children, className = "" }) {
  return (
    <section className={`min-w-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-950/5 ${className}`}>
      <div className="mb-3 flex items-center gap-2">
        {Icon ? (
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-50 text-slate-600 ring-1 ring-slate-200">
            <Icon className="text-lg" />
          </span>
        ) : null}
        <h4 className="text-sm font-black tracking-tight text-slate-950">{title}</h4>
      </div>
      {children}
    </section>
  );
}

export default function ReportModal({ day, onClose, onEdit, onDelete }) {
  if (!day) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:px-4 sm:py-8">
      <button className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm" onClick={onClose} type="button" />
      <section className="relative flex h-dvh w-full animate-[fadeIn_.2s_ease] flex-col overflow-hidden bg-slate-50 shadow-2xl ring-1 ring-slate-200 sm:h-auto sm:max-h-[92vh] sm:max-w-4xl sm:rounded-3xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200/80 bg-white/95 px-5 py-5 backdrop-blur sm:px-7">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">Daily Report Details</p>
            <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{formatDate(day.date)}</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">Income, expenses, net balance, and saved notes.</p>
          </div>
          <Button variant="ghost" className="min-h-11 w-11 shrink-0 rounded-2xl p-0" onClick={onClose} aria-label="Close report details">
            <FiX className="text-lg" />
          </Button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto scroll-smooth p-5 sm:p-7">
          <div className="grid gap-4 md:grid-cols-2">
            <Section title="Income Summary" icon={FiArrowUpCircle}>
              <AmountLine label="Cash Income" value={day.cashIncome} tone="emerald" />
              <AmountLine label="Online Income" value={day.onlineIncome} tone="emerald" />
              <div className="mt-2 border-t border-slate-200 pt-2">
                <AmountLine label="Total Income" value={day.totalIncome} strong tone="emerald" />
              </div>
            </Section>

            <Section title="Expense Summary" icon={FiArrowDownCircle}>
              <AmountLine label="Cash Expense" value={day.cashExpense} tone="rose" />
              <AmountLine label="Online Expense" value={day.onlineExpense} tone="rose" />
              <div className="mt-2 border-t border-slate-200 pt-2">
                <AmountLine label="Total Expense" value={day.totalExpense} strong tone="rose" />
              </div>
            </Section>
          </div>

          <Section
            title="Net Balance"
            icon={FiTrendingUp}
            className={day.net >= 0 ? "border-emerald-100 bg-emerald-50/80" : "border-rose-100 bg-rose-50/80"}
          >
            <AmountLine label="Net Balance" value={day.net} strong tone={day.net >= 0 ? "emerald" : "rose"} />
          </Section>

          <Section title="Expense Notes" icon={FiFileText}>
            {day.descriptions?.length ? (
              <ul className="min-w-0 space-y-2">
                {day.descriptions.map((description, index) => (
                  <li
                    key={`${description}-${index}`}
                    className="max-h-32 min-w-0 overflow-y-auto whitespace-pre-wrap break-words rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-700 ring-1 ring-slate-200"
                  >
                    {description}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm font-semibold text-slate-500">No expense description saved for this report.</p>
            )}
          </Section>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200/80 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-7 sm:py-5">
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
