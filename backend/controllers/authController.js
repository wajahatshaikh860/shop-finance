const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Name, email, and password are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409);
      throw new Error("Email is already registered");
    }

    const user = await User.create({ name, email, password });
    res.status(201).json({
      user: sanitizeUser(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    res.json({
      user: sanitizeUser(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
