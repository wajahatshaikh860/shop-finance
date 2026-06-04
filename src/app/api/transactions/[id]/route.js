import { getAuthUser } from "@/lib/auth";
import { createHttpError, handleApiError } from "@/lib/errorHandler";
import { json, message } from "@/lib/apiResponse";
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

export async function PUT(request, { params }) {
  try {
    const user = await getAuthUser(request);
    const body = await request.json();
    const { id } = await params;
    const allowed = {};

    ["amount", "type", "mode", "date", "description"].forEach((field) => {
      if (body[field] !== undefined) allowed[field] = body[field];
    });

    if (allowed.amount !== undefined && Number(allowed.amount) < 0) {
      throw createHttpError("Amount cannot be negative", 400);
    }

    if (allowed.date) allowed.date = normalizeDate(allowed.date);
    if (allowed.description !== undefined) allowed.description = String(allowed.description).trim();

    const transaction = await Transaction.findOneAndUpdate({ _id: id, userId: user._id }, allowed, {
      new: true,
      runValidators: true,
    });

    if (!transaction) {
      throw createHttpError("Transaction not found", 404);
    }

    return json({ transaction });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getAuthUser(request);
    const { id } = await params;
    const transaction = await Transaction.findOneAndDelete({ _id: id, userId: user._id });

    if (!transaction) {
      throw createHttpError("Transaction not found", 404);
    }

    return message("Transaction deleted");
  } catch (error) {
    return handleApiError(error);
  }
}
