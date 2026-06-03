"use client";

import { useState } from "react";
import { FiSave } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { toInputDate } from "@/utils/formatters";

const initialForm = {
  cashIncome: "",
  onlineIncome: "",
  cashExpense: "",
  onlineExpense: "",
  description: "",
  date: toInputDate(),
};

export default function TransactionForm({ onSubmit }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setError("");
    setForm((current) => ({ ...current, [field]: value }));
  };

  const validate = () => {
    const amountFields = ["cashIncome", "onlineIncome", "cashExpense", "onlineExpense"];
    const hasAnyValue = amountFields.some((field) => Number(form[field]) > 0);
    const hasNegative = amountFields.some((field) => Number(form[field]) < 0);

    if (hasNegative) return "Amounts cannot be negative";
    if (!hasAnyValue) return "Enter at least one income or expense amount";
    if (!form.date) return "Date is required";
    return "";
  };

  const submit = async (event) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        date: form.date,
        cashIncome: Number(form.cashIncome) || 0,
        onlineIncome: Number(form.onlineIncome) || 0,
        cashExpense: Number(form.cashExpense) || 0,
        onlineExpense: Number(form.onlineExpense) || 0,
        description: form.description.trim(),
      });
      setForm(initialForm);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not save transactions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-xl bg-white p-5 shadow-md shadow-slate-200/70 ring-1 ring-slate-200">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-black text-slate-950">Daily Transaction</h2>
          <p className="text-sm text-slate-500">Add income and expenses for a selected date.</p>
        </div>
        <Input label="Date" type="date" value={form.date} onChange={(event) => handleChange("date", event.target.value)} className="sm:w-48" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Input label="Cash Income" type="number" min="0" step="0.01" placeholder="0" value={form.cashIncome} onChange={(event) => handleChange("cashIncome", event.target.value)} />
        <Input label="Online Income" type="number" min="0" step="0.01" placeholder="0" value={form.onlineIncome} onChange={(event) => handleChange("onlineIncome", event.target.value)} />
        <Input label="Cash Expense" type="number" min="0" step="0.01" placeholder="0" value={form.cashExpense} onChange={(event) => handleChange("cashExpense", event.target.value)} />
        <Input label="Online Expense" type="number" min="0" step="0.01" placeholder="0" value={form.onlineExpense} onChange={(event) => handleChange("onlineExpense", event.target.value)} />
      </div>
      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-bold text-slate-700">Expense Description</span>
        <textarea
          rows={2}
          value={form.description}
          onChange={(event) => handleChange("description", event.target.value)}
          placeholder="rent, transport, stock purchase, electricity..."
          className="min-h-20 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
        />
      </label>
      {error ? <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p> : null}
      <div className="mt-5 flex justify-end">
        <Button type="submit" loading={loading}>
          <FiSave />
          Save day
        </Button>
      </div>
    </form>
  );
}
