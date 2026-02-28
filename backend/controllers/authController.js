const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    let { name, email, password, role } = req.body;

    email = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    if (error && error.code === 11000) return res.status(409).json({ message: "Email already exists" });
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    const { validationResult } = require("express-validator");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    email = email.trim().toLowerCase();
    console.log("login attempt for", email);

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const jwtSecret = process.env.JWT_SECRET || "secretKey";

    const token = jwt.sign(
      { id: user._id, role: user.role },
      jwtSecret,
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role, name: user.name });
  } catch (error) {
    console.error(error && error.stack ? error.stack : error);
    res.status(500).json({ message: "Server error" });
  }
};

// Development helper: delete a user by email (only when not in production)
exports.deleteUserDev = async (req, res) => {
  try {
    console.log("DELETE-DEV called", { NODE_ENV: process.env.NODE_ENV, body: req.body });

    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({ message: "Not allowed in production" });
    }

    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const normalized = String(email).trim().toLowerCase();
    const deleted = await User.findOneAndDelete({ email: normalized });

    if (!deleted) return res.status(404).json({ message: "User not found" });

    console.log("DELETE-DEV deleted user", { email: normalized, id: deleted._id });

    res.json({ message: "User deleted", userId: deleted._id });
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: "Current and new passwords are required" });
    if (String(newPassword).length < 6) return res.status(400).json({ message: "New password must be at least 6 characters" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: "Current password is incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
