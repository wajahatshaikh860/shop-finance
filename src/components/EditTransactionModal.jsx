"use client";

import { useState } from "react";
import { FiSave, FiX } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const emptyForm = {
  cashIncome: "",
  onlineIncome: "",
  cashExpense: "",
  onlineExpense: "",
  description: "",
  date: "",
};

const formFromDay = (day) => {
  if (!day) return emptyForm;
  const firstExpense = day.transactions.find((transaction) => transaction.type === "expense" && transaction.description);
  return {
    cashIncome: day.cashIncome || "",
    onlineIncome: day.onlineIncome || "",
    cashExpense: day.cashExpense || "",
    onlineExpense: day.onlineExpense || "",
    description: firstExpense?.description || "",
    date: day.date,
  };
};

function EditTransactionModalContent({ day, open, loading, onClose, onSave }) {
  const [form, setForm] = useState(() => formFromDay(day));
  const [error, setError] = useState("");

  if (!open || !day) return null;

  const handleChange = (field, value) => {
    setError("");
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const amountFields = ["cashIncome", "onlineIncome", "cashExpense", "onlineExpense"];
    const hasAnyValue = amountFields.some((field) => Number(form[field]) > 0);
    const hasNegative = amountFields.some((field) => Number(form[field]) < 0);

    if (hasNegative) return setError("Amounts cannot be negative");
    if (!hasAnyValue) return setError("Enter at least one amount");
    if (!form.date) return setError("Date is required");

    await onSave({
      date: form.date,
      cashIncome: Number(form.cashIncome) || 0,
      onlineIncome: Number(form.onlineIncome) || 0,
      cashExpense: Number(form.cashExpense) || 0,
      onlineExpense: Number(form.onlineExpense) || 0,
      description: form.description.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-8">
      <button className="absolute inset-0 bg-slate-950/60" onClick={onClose} />
      <form onSubmit={submit} className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">Edit Report</p>
            <h3 className="mt-2 text-2xl font-black text-slate-950">Daily transaction details</h3>
          </div>
          <Button type="button" variant="ghost" className="min-h-0 rounded-lg p-2" onClick={onClose}>
            <FiX />
          </Button>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Input label="Date" type="date" value={form.date} onChange={(event) => handleChange("date", event.target.value)} />
          <div />
          <Input label="Cash Income" type="number" min="0" step="0.01" value={form.cashIncome} onChange={(event) => handleChange("cashIncome", event.target.value)} />
          <Input label="Online Income" type="number" min="0" step="0.01" value={form.onlineIncome} onChange={(event) => handleChange("onlineIncome", event.target.value)} />
          <Input label="Cash Expense" type="number" min="0" step="0.01" value={form.cashExpense} onChange={(event) => handleChange("cashExpense", event.target.value)} />
          <Input label="Online Expense" type="number" min="0" step="0.01" value={form.onlineExpense} onChange={(event) => handleChange("onlineExpense", event.target.value)} />
          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-bold text-slate-700">Expense Description</span>
            <textarea
              rows={3}
              value={form.description}
              onChange={(event) => handleChange("description", event.target.value)}
              placeholder="rent, transport, stock purchase..."
              className="min-h-24 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            />
          </label>
        </div>
        {error ? <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p> : null}
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            <FiSave />
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function EditTransactionModal(props) {
  return <EditTransactionModalContent key={props.day?.date || "empty"} {...props} />;
}
