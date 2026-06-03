"use client";

import { useEffect, useMemo, useState } from "react";
import { FiHome } from "react-icons/fi";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import RentPDFButton from "@/components/RentPDFButton";
import RentTable from "@/components/RentTable";
import Toast from "@/components/ui/Toast";
import { useDashboard } from "@/context/DashboardContext";
import { formatCurrency, toInputDate, toInputMonth } from "@/utils/formatters";

const emptyForm = {
  month: toInputMonth(),
  amount: "",
  paidDate: toInputDate(),
};

export default function RentPage() {
  const { rents, loading, toast, setToast, refreshDashboard, saveMonthlyRent } = useDashboard();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    refreshDashboard().catch(() => setToast({ type: "error", message: "Could not load rent history" }));
  }, [refreshDashboard, setToast]);

  const paidRents = useMemo(
    () => rents.filter((rent) => rent.status === "paid").sort((a, b) => b.month.localeCompare(a.month)),
    [rents]
  );

  const paidTotal = useMemo(
    () => paidRents.reduce((total, rent) => total + (Number(rent.amount) || 0), 0),
    [paidRents]
  );

  const updateForm = (field, value) => {
    setError("");
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();

    if (!form.month) return setError("Month is required");
    if (!form.paidDate) return setError("Paid date is required");
    if (form.amount === "" || Number(form.amount) <= 0) return setError("Enter a valid rent amount");

    setSaving(true);
    try {
      await saveMonthlyRent({
        month: form.month,
        amount: Number(form.amount),
        paidDate: form.paidDate,
        status: "paid",
      });
      setForm(emptyForm);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not save rent");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">Shop rent</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Shop Rent Management</h1>
          <p className="mt-2 text-sm text-slate-500">Record paid rent and keep it deducted from the overall balance.</p>
        </div>
        <RentPDFButton rents={paidRents} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <section className="rounded-xl bg-white p-5 shadow-md shadow-slate-200/70 ring-1 ring-slate-200">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
              <FiHome className="text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-950">Add Rent Form</h2>
              <p className="text-sm text-slate-500">Paid entries update the dashboard balance.</p>
            </div>
          </div>

          <div className="mb-5 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Total Paid Rent</p>
            <p className="mt-1 text-2xl font-black text-slate-950">{formatCurrency(paidTotal)}</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <Input label="Month" type="month" value={form.month} onChange={(event) => updateForm("month", event.target.value)} />
            <Input label="Amount" type="number" min="0" step="0.01" value={form.amount} onChange={(event) => updateForm("amount", event.target.value)} />
            <Input label="Paid date" type="date" value={form.paidDate} onChange={(event) => updateForm("paidDate", event.target.value)} />
            {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p> : null}
            <Button type="submit" loading={saving} className="w-full">
              Pay Rent
            </Button>
          </form>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-950">Paid Rent History</h2>
              <p className="text-sm text-slate-500">{loading ? "Syncing rent history..." : `${paidRents.length} paid record${paidRents.length === 1 ? "" : "s"}`}</p>
            </div>
          </div>
          <RentTable rents={paidRents} />
        </section>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </DashboardLayout>
  );
}
