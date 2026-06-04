import { getAuthUser } from "@/lib/auth";
import { createHttpError, handleApiError } from "@/lib/errorHandler";
import { json, message } from "@/lib/apiResponse";
import Rent from "@/models/Rent";

export const runtime = "nodejs";

function buildRentUpdate(body) {
  const allowed = {};

  if (body.amount !== undefined) {
    const amount = Number(body.amount);
    if (!Number.isFinite(amount) || amount < 0) {
      throw createHttpError("Rent amount cannot be negative", 400);
    }
    allowed.amount = amount;
  }

  if (body.month !== undefined) {
    const month = String(body.month || "");
    if (!/^\d{4}-\d{2}$/.test(month)) {
      throw createHttpError("A valid rent month is required", 400);
    }
    allowed.month = month;
  }

  if (body.status !== undefined) {
    allowed.status = body.status === "paid" ? "paid" : "upcoming";
  }

  if (body.paidDate !== undefined) {
    allowed.paidDate = body.paidDate ? new Date(body.paidDate) : undefined;
  }

  if (allowed.status === "paid" && (!allowed.paidDate || Number.isNaN(allowed.paidDate.getTime()))) {
    throw createHttpError("A valid paid date is required", 400);
  }

  if (allowed.status === "upcoming") {
    allowed.paidDate = undefined;
  }

  return allowed;
}

export async function PUT(request, { params }) {
  try {
    const user = await getAuthUser(request);
    const body = await request.json();
    const { id } = await params;
    const payload = buildRentUpdate(body);

    const rent = await Rent.findOneAndUpdate({ _id: id, userId: user._id }, payload, {
      new: true,
      runValidators: true,
    });

    if (!rent) {
      throw createHttpError("Rent not found", 404);
    }

    return json({ rent });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getAuthUser(request);
    const { id } = await params;
    const rent = await Rent.findOneAndDelete({ _id: id, userId: user._id });

    if (!rent) {
      throw createHttpError("Rent not found", 404);
    }

    return message("Rent deleted");
  } catch (error) {
    return handleApiError(error);
  }
}
