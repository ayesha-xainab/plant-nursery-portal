const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const { getAllSales } = require("../controllers/salesController");

router.get("/", auth, admin, getAllSales);

module.exports = router;
