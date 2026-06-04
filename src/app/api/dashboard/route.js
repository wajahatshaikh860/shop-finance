import { getAuthUser } from "@/lib/auth";
import { handleApiError } from "@/lib/errorHandler";
import { json } from "@/lib/apiResponse";
import Transaction from "@/models/Transaction";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const user = await getAuthUser(request);

    const rows = await Transaction.aggregate([
      { $match: { userId: user._id } },
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

    return json({
      summary: {
        totalCash: totals.totalCashIncome,
        totalOnline: totals.totalOnlineIncome,
        totalExpense: totals.totalExpense,
        netBalance: totalIncome - totals.totalExpense,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
