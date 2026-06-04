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

    const { email, password } = await request.json();
    if (!email || !password) {
      throw createHttpError("Email and password are required", 400);
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      throw createHttpError("Invalid email or password", 401);
    }

    return json({
      user: sanitizeUser(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
