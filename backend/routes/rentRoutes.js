const express = require("express");
const { getRents, upsertRent } = require("../controllers/rentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, getRents).post(protect, upsertRent);

module.exports = router;
