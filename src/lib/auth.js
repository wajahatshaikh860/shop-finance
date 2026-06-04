import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import { createHttpError } from "@/lib/errorHandler";
import User from "@/models/User";

export function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
}

export async function getAuthUser(request) {
  const header = request.headers.get("authorization");

  if (!header || !header.startsWith("Bearer ")) {
    throw createHttpError("Not authorized, token missing", 401);
  }

  await connectDB();

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw createHttpError("Not authorized, user not found", 401);
    }

    return user;
  } catch (error) {
    if (error.statusCode) throw error;
    throw createHttpError(error.message || "Not authorized", 401);
  }
}
