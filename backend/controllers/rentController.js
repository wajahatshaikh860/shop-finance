const Rent = require("../models/Rent");

const getRents = async (req, res, next) => {
  try {
    const rents = await Rent.find({ userId: req.user._id }).sort({ month: -1, createdAt: -1 });
    res.json({ rents });
  } catch (error) {
    next(error);
  }
};

const upsertRent = async (req, res, next) => {
  try {
    const amount = Number(req.body.amount);
    const month = String(req.body.month || "");
    const status = req.body.status === "paid" ? "paid" : "upcoming";
    const paidDate = req.body.paidDate ? new Date(req.body.paidDate) : undefined;

    if (!/^\d{4}-\d{2}$/.test(month)) {
      res.status(400);
      throw new Error("A valid rent month is required");
    }

    if (!Number.isFinite(amount) || amount < 0) {
      res.status(400);
      throw new Error("Rent amount cannot be negative");
    }

    if (status === "paid" && (!paidDate || Number.isNaN(paidDate.getTime()))) {
      res.status(400);
      throw new Error("A valid paid date is required");
    }

    const rent = await Rent.findOneAndUpdate(
      { userId: req.user._id, month },
      { amount, status, paidDate: status === "paid" ? paidDate : undefined },
      { new: true, runValidators: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ rent });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRents, upsertRent };
