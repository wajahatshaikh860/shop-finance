"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import SummaryCards from "@/components/dashboard/SummaryCards";
import TransactionForm from "@/components/forms/TransactionForm";
import ConfirmationModal from "@/components/ConfirmationModal";
import EditTransactionModal from "@/components/EditTransactionModal";
import FilterDropdown from "@/components/FilterDropdown";
import DailySummaryTable from "@/components/tables/DailySummaryTable";
import ReportModal from "@/components/ReportModal";
import Toast from "@/components/ui/Toast";
import { DashboardProvider, useDashboard } from "@/context/DashboardContext";
import { downloadDailyReportPdf } from "@/utils/pdf";
import { filterDailySummaries, groupTransactionsByDate } from "@/utils/transactions";

function DashboardContent() {
  const {
    summary,
    transactions,
    rents,
    loading,
    toast,
    setToast,
    refreshDashboard,
    addDailyTransactions,
    editDailyTransactions,
    deleteDailyTransactions,
  } = useDashboard();
  const [filters, setFilters] = useState({ date: "", month: "" });
  const [selectedDay, setSelectedDay] = useState(null);
  const [editingDay, setEditingDay] = useState(null);
  const [deletingDay, setDeletingDay] = useState(null);
  const [downloading, setDownloading] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    refreshDashboard().catch(() => setToast({ type: "error", message: "Could not load dashboard" }));
  }, [refreshDashboard, setToast]);

  const allRows = useMemo(() => groupTransactionsByDate(transactions), [transactions]);
  const filteredRows = useMemo(() => filterDailySummaries(allRows, filters), [allRows, filters]);
  const paidRent = useMemo(
    () => rents.reduce((total, rent) => (rent.status === "paid" ? total + (Number(rent.amount) || 0) : total), 0),
    [rents]
  );
  const balanceBreakdown = useMemo(() => {
    const totals = transactions.reduce(
      (acc, transaction) => {
        const amount = Number(transaction.amount) || 0;
        const direction = transaction.type === "income" ? 1 : -1;
        acc[transaction.mode] += amount * direction;
        return acc;
      },
      { cash: 0, online: 0 }
    );
    const cash = totals.cash - paidRent;
    const online = totals.online;
    return { cash, online, total: cash + online };
  }, [transactions, paidRent]);
  const displaySummary = useMemo(
    () => ({ ...summary, totalExpense: (summary?.totalExpense || 0) + paidRent, netBalance: balanceBreakdown.total }),
    [summary, paidRent, balanceBreakdown.total]
  );

  const download = async () => {
    setDownloading("report");
    try {
      const hasFilters = filters.date || filters.month;
      const rows = hasFilters ? filteredRows : allRows;
      downloadDailyReportPdf(rows, hasFilters ? "filtered-daily-finance-report.pdf" : "all-daily-finance-report.pdf");
    } finally {
      setTimeout(() => setDownloading(""), 350);
    }
  };

  const saveEdit = async (payload) => {
    setSavingEdit(true);
    try {
      await editDailyTransactions(editingDay, payload);
      setEditingDay(null);
      setSelectedDay(null);
    } catch (error) {
      setToast({ type: "error", message: error.response?.data?.message || "Could not update report" });
    } finally {
      setSavingEdit(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteDailyTransactions(deletingDay);
      setDeletingDay(null);
      setSelectedDay(null);
    } catch (error) {
      setToast({ type: "error", message: error.response?.data?.message || "Could not delete report" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">Finance dashboard</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Shop Finance Manager</h1>
          <p className="mt-2 text-sm text-slate-500">Track cash, online income, expenses, and daily net balance.</p>
        </div>
        {loading ? <span className="text-sm font-semibold text-slate-500">Syncing dashboard...</span> : null}
      </div>
      <div className="space-y-6">
        <SummaryCards summary={displaySummary} balanceBreakdown={balanceBreakdown} />
        <TransactionForm onSubmit={addDailyTransactions} />
        <FilterDropdown
          filters={filters}
          setFilters={setFilters}
          onDownload={download}
          downloading={downloading === "report"}
          hasRows={allRows.length > 0}
        />
        <DailySummaryTable rows={filteredRows} onView={setSelectedDay} />
      </div>
      <ReportModal
        day={selectedDay}
        onClose={() => setSelectedDay(null)}
        onEdit={() => setEditingDay(selectedDay)}
        onDelete={() => setDeletingDay(selectedDay)}
      />
      <EditTransactionModal
        day={editingDay}
        open={Boolean(editingDay)}
        loading={savingEdit}
        onClose={() => setEditingDay(null)}
        onSave={saveEdit}
      />
      <ConfirmationModal
        open={Boolean(deletingDay)}
        title="Delete this report?"
        message="This will remove every transaction saved for this daily report."
        loading={deleting}
        onCancel={() => setDeletingDay(null)}
        onConfirm={confirmDelete}
      />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </DashboardLayout>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardProvider>
        <DashboardContent />
      </DashboardProvider>
    </ProtectedRoute>
  );
}
