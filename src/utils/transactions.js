import { toDateKey } from "./formatters";

export const createEmptyDailySummary = (date) => ({
  date,
  cashIncome: 0,
  onlineIncome: 0,
  cashExpense: 0,
  onlineExpense: 0,
  transactions: [],
});

export const groupTransactionsByDate = (transactions = []) => {
  const grouped = transactions.reduce((acc, transaction) => {
    const key = toDateKey(transaction.date);
    if (!key) return acc;

    if (!acc[key]) acc[key] = createEmptyDailySummary(key);

    const amount = Number(transaction.amount) || 0;
    const field = `${transaction.mode}${transaction.type === "income" ? "Income" : "Expense"}`;
    acc[key][field] += amount;
    acc[key].transactions.push(transaction);

    return acc;
  }, {});

  return Object.values(grouped)
    .map((day) => ({
      ...day,
      totalIncome: day.cashIncome + day.onlineIncome,
      totalExpense: day.cashExpense + day.onlineExpense,
      net: day.cashIncome + day.onlineIncome - day.cashExpense - day.onlineExpense,
      descriptions: [
        ...new Set(
          day.transactions
            .filter((transaction) => transaction.type === "expense" && transaction.description)
            .map((transaction) => transaction.description)
        ),
      ],
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
};

export const filterDailySummaries = (summaries, filters) => {
  if (filters.date) return summaries.filter((day) => day.date === filters.date);
  if (filters.month) return summaries.filter((day) => day.date.startsWith(filters.month));
  return summaries;
};
