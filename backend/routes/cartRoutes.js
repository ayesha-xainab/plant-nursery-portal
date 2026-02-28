const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const {
  addToCart,
  getCart,
  updateCart,
  checkout,
} = require("../controllers/cartController");

router.post("/add", auth, addToCart);
router.post("/update", auth, updateCart);
router.get("/", auth, getCart);
router.post("/checkout", auth, checkout);

module.exports = router;
