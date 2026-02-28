const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const {
  borrowPlant,
  returnPlant,
  getUserRentals,
  getAllRentals,
} = require("../controllers/rentalController");

router.post("/borrow", auth, borrowPlant);
router.put("/return/:id", auth, returnPlant);
router.get("/my", auth, getUserRentals);
router.get("/", auth, admin, getAllRentals);

module.exports = router;
