const express = require("express");
const {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, createTransaction).get(protect, getTransactions);
router.route("/:id").delete(protect, deleteTransaction).put(protect, updateTransaction);

module.exports = router;
