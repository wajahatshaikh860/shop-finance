import { json } from "@/lib/apiResponse";

export function createHttpError(message, statusCode = 500) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

export function handleApiError(error, fallbackStatus = 500) {
  const statusCode = error.statusCode || fallbackStatus;

  return json(
    {
      message: error.message || "Server error",
      stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
    },
    statusCode
  );
}
