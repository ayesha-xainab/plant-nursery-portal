const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const { register, login, deleteUserDev, changePassword, getUsers } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

router.post("/register", [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
], register);

router.post("/login", [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
], login);

// Development-only delete endpoint (only available when NODE_ENV !== 'production')
router.post("/delete-dev", deleteUserDev);

router.post("/change-password", auth, [
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
], changePassword);

router.get("/users", getUsers);

module.exports = router;
