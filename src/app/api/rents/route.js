import { getAuthUser } from "@/lib/auth";
import { createHttpError, handleApiError } from "@/lib/errorHandler";
import { json } from "@/lib/apiResponse";
import Rent from "@/models/Rent";

export const runtime = "nodejs";

function buildRentPayload(body) {
  const amount = Number(body.amount);
  const month = String(body.month || "");
  const status = body.status === "paid" ? "paid" : "upcoming";
  const paidDate = body.paidDate ? new Date(body.paidDate) : undefined;

  if (!/^\d{4}-\d{2}$/.test(month)) {
    throw createHttpError("A valid rent month is required", 400);
  }

  if (!Number.isFinite(amount) || amount < 0) {
    throw createHttpError("Rent amount cannot be negative", 400);
  }

  if (status === "paid" && (!paidDate || Number.isNaN(paidDate.getTime()))) {
    throw createHttpError("A valid paid date is required", 400);
  }

  return { amount, month, status, paidDate: status === "paid" ? paidDate : undefined };
}

export async function GET(request) {
  try {
    const user = await getAuthUser(request);
    const rents = await Rent.find({ userId: user._id }).sort({ month: -1, createdAt: -1 });

    return json({ rents });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request) {
  try {
    const user = await getAuthUser(request);
    const body = await request.json();
    const payload = buildRentPayload(body);

    const rent = await Rent.findOneAndUpdate({ userId: user._id, month: payload.month }, payload, {
      new: true,
      runValidators: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });

    return json({ rent }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
