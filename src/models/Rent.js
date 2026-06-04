import mongoose from "mongoose";

const rentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    month: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}$/,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["paid", "upcoming"],
      default: "upcoming",
    },
    paidDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

rentSchema.index({ userId: 1, month: 1 }, { unique: true });

export default mongoose.models.Rent || mongoose.model("Rent", rentSchema);
