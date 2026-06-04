import { getAuthUser } from "@/lib/auth";
import { createHttpError, handleApiError } from "@/lib/errorHandler";
import { json } from "@/lib/apiResponse";
import Transaction from "@/models/Transaction";

export const runtime = "nodejs";

const normalizeDate = (date) => {
  const dateOnlyMatch = typeof date === "string" && date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch.map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate()));
};

const buildDailyTransactions = (body, userId) => {
  const date = normalizeDate(body.date);
  if (!date) {
    throw createHttpError("A valid date is required", 400);
  }

  const description = typeof body.description === "string" ? body.description.trim() : "";
  const entries = [
    { amount: Number(body.cashIncome) || 0, type: "income", mode: "cash", description: "" },
    { amount: Number(body.onlineIncome) || 0, type: "income", mode: "online", description: "" },
    { amount: Number(body.cashExpense) || 0, type: "expense", mode: "cash", description },
    { amount: Number(body.onlineExpense) || 0, type: "expense", mode: "online", description },
  ];

  if (entries.some((entry) => entry.amount < 0)) {
    throw createHttpError("Amounts cannot be negative", 400);
  }

  const transactions = entries.filter((entry) => entry.amount > 0).map((entry) => ({ ...entry, userId, date }));

  if (!transactions.length) {
    throw createHttpError("Enter at least one amount", 400);
  }

  return transactions;
};

export async function GET(request) {
  try {
    const user = await getAuthUser(request);
    const transactions = await Transaction.find({ userId: user._id }).sort({ date: -1, createdAt: -1 });

    return json({ transactions });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request) {
  try {
    const user = await getAuthUser(request);
    const body = await request.json();
    const transactions = buildDailyTransactions(body, user._id);
    const created = await Transaction.insertMany(transactions);

    return json({ transactions: created }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
