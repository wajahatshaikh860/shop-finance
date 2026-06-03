"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { getDashboardSummary } from "@/services/dashboardService";
import { getRents, saveRent } from "@/services/rentService";
import { createTransactions, deleteTransaction, getTransactions, updateTransaction } from "@/services/transactionService";

const DashboardContext = createContext(null);

const defaultSummary = {
  totalCash: 0,
  totalOnline: 0,
  totalExpense: 0,
  netBalance: 0,
};

export function DashboardProvider({ children }) {
  const [summary, setSummary] = useState(defaultSummary);
  const [transactions, setTransactions] = useState([]);
  const [rents, setRents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const refreshDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [summaryData, transactionData, rentData] = await Promise.all([
        getDashboardSummary(),
        getTransactions(),
        getRents(),
      ]);
      setSummary(summaryData.summary || defaultSummary);
      setTransactions(transactionData.transactions || []);
      setRents(rentData.rents || []);
    } finally {
      setLoading(false);
    }
  }, []);

  const addDailyTransactions = useCallback(async (payload) => {
    const data = await createTransactions(payload);
    setTransactions((current) => [...data.transactions, ...current]);
    await refreshDashboard();
    setToast({ type: "success", message: "Daily transactions saved" });
  }, [refreshDashboard]);

  const editDailyTransactions = useCallback(async (day, payload) => {
    const fields = [
      { key: "cashIncome", type: "income", mode: "cash" },
      { key: "onlineIncome", type: "income", mode: "online" },
      { key: "cashExpense", type: "expense", mode: "cash" },
      { key: "onlineExpense", type: "expense", mode: "online" },
    ];

    const missingPayload = {
      date: payload.date,
      cashIncome: 0,
      onlineIncome: 0,
      cashExpense: 0,
      onlineExpense: 0,
      description: payload.description,
    };

    const updates = [];
    const deletes = [];

    fields.forEach(({ key, type, mode }) => {
      const amount = Number(payload[key]) || 0;
      const existing = day.transactions.find((transaction) => transaction.type === type && transaction.mode === mode);
      const description = type === "expense" ? payload.description : "";

      if (existing && amount > 0) {
        updates.push(updateTransaction(existing._id, { amount, type, mode, date: payload.date, description }));
      } else if (existing && amount <= 0) {
        deletes.push(deleteTransaction(existing._id).then(() => ({ deletedId: existing._id })));
      } else if (!existing && amount > 0) {
        missingPayload[key] = amount;
      }
    });

    const hasNewTransactions = ["cashIncome", "onlineIncome", "cashExpense", "onlineExpense"].some(
      (key) => Number(missingPayload[key]) > 0
    );

    const [updatedResults, deletedResults, createdResult] = await Promise.all([
      Promise.all(updates),
      Promise.all(deletes),
      hasNewTransactions ? createTransactions(missingPayload) : Promise.resolve({ transactions: [] }),
    ]);

    const updatedTransactions = updatedResults.map((result) => result.transaction);
    const deletedIds = new Set(deletedResults.map((result) => result.deletedId));
    const createdTransactions = createdResult.transactions || [];

    setTransactions((current) => {
      const byId = new Map(
        current.filter((transaction) => !deletedIds.has(transaction._id)).map((transaction) => [transaction._id, transaction])
      );
      updatedTransactions.forEach((transaction) => byId.set(transaction._id, transaction));
      createdTransactions.forEach((transaction) => byId.set(transaction._id, transaction));
      return Array.from(byId.values()).sort((a, b) => new Date(b.date) - new Date(a.date));
    });

    setToast({ type: "success", message: "Report updated" });
    refreshDashboard().catch(() => {});
  }, [refreshDashboard]);

  const deleteDailyTransactions = useCallback(async (day) => {
    const ids = day.transactions.map((transaction) => transaction._id);
    await Promise.all(ids.map((id) => deleteTransaction(id)));
    setTransactions((current) => current.filter((transaction) => !ids.includes(transaction._id)));
    setToast({ type: "success", message: "Report deleted" });
    refreshDashboard().catch(() => {});
  }, [refreshDashboard]);

  const saveMonthlyRent = useCallback(async (payload) => {
    const data = await saveRent(payload);
    setRents((current) => {
      const next = current.filter((rent) => rent._id !== data.rent._id && rent.month !== data.rent.month);
      return [data.rent, ...next].sort((a, b) => b.month.localeCompare(a.month));
    });
    setToast({ type: "success", message: "Rent saved" });
  }, []);

  const value = useMemo(
    () => ({
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
      saveMonthlyRent,
    }),
    [summary, transactions, rents, loading, toast, refreshDashboard, addDailyTransactions, editDailyTransactions, deleteDailyTransactions, saveMonthlyRent]
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboard must be used inside DashboardProvider");
  return context;
};
