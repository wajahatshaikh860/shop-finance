const Transaction = require("../models/Transaction");

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
    const error = new Error("A valid date is required");
    error.statusCode = 400;
    throw error;
  }

  const description = typeof body.description === "string" ? body.description.trim() : "";
  const entries = [
    { amount: Number(body.cashIncome) || 0, type: "income", mode: "cash", description: "" },
    { amount: Number(body.onlineIncome) || 0, type: "income", mode: "online", description: "" },
    { amount: Number(body.cashExpense) || 0, type: "expense", mode: "cash", description },
    { amount: Number(body.onlineExpense) || 0, type: "expense", mode: "online", description },
  ];

  if (entries.some((entry) => entry.amount < 0)) {
    const error = new Error("Amounts cannot be negative");
    error.statusCode = 400;
    throw error;
  }

  const transactions = entries
    .filter((entry) => entry.amount > 0)
    .map((entry) => ({ ...entry, userId, date }));

  if (!transactions.length) {
    const error = new Error("Enter at least one amount");
    error.statusCode = 400;
    throw error;
  }

  return transactions;
};

const createTransaction = async (req, res, next) => {
  try {
    const transactions = buildDailyTransactions(req.body, req.user._id);
    const created = await Transaction.insertMany(transactions);
    res.status(201).json({ transactions: created });
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ date: -1, createdAt: -1 });
    res.json({ transactions });
  } catch (error) {
    next(error);
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!transaction) {
      res.status(404);
      throw new Error("Transaction not found");
    }
    res.json({ message: "Transaction deleted" });
  } catch (error) {
    next(error);
  }
};

const updateTransaction = async (req, res, next) => {
  try {
    const allowed = {};
    ["amount", "type", "mode", "date", "description"].forEach((field) => {
      if (req.body[field] !== undefined) allowed[field] = req.body[field];
    });

    if (allowed.amount !== undefined && Number(allowed.amount) < 0) {
      res.status(400);
      throw new Error("Amount cannot be negative");
    }

    if (allowed.date) allowed.date = normalizeDate(allowed.date);
    if (allowed.description !== undefined) allowed.description = String(allowed.description).trim();

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      allowed,
      { new: true, runValidators: true }
    );

    if (!transaction) {
      res.status(404);
      throw new Error("Transaction not found");
    }

    res.json({ transaction });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
};
