const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const rentRoutes = require("./routes/rentRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "shop-finance-manager" });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/rents", rentRoutes);
app.use("/api/transactions", transactionRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
  });
};

startServer();
