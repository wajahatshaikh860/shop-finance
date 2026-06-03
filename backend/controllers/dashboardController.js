const Transaction = require("../models/Transaction");

const getSummary = async (req, res, next) => {
  try {
    const rows = await Transaction.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: null,
          totalCashIncome: {
            $sum: { $cond: [{ $and: [{ $eq: ["$type", "income"] }, { $eq: ["$mode", "cash"] }] }, "$amount", 0] },
          },
          totalOnlineIncome: {
            $sum: { $cond: [{ $and: [{ $eq: ["$type", "income"] }, { $eq: ["$mode", "online"] }] }, "$amount", 0] },
          },
          totalExpense: {
            $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
          },
        },
      },
    ]);

    const totals = rows[0] || { totalCashIncome: 0, totalOnlineIncome: 0, totalExpense: 0 };
    const totalIncome = totals.totalCashIncome + totals.totalOnlineIncome;

    res.json({
      summary: {
        totalCash: totals.totalCashIncome,
        totalOnline: totals.totalOnlineIncome,
        totalExpense: totals.totalExpense,
        netBalance: totalIncome - totals.totalExpense,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSummary };
