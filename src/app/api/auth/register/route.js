import { generateToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { createHttpError, handleApiError } from "@/lib/errorHandler";
import { json } from "@/lib/apiResponse";
import User from "@/models/User";

export const runtime = "nodejs";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

export async function POST(request) {
  try {
    await connectDB();

    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
      throw createHttpError("Name, email, and password are required", 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createHttpError("Email is already registered", 409);
    }

    const user = await User.create({ name, email, password });

    return json(
      {
        user: sanitizeUser(user),
        token: generateToken(user._id),
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
