const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/plantnursery")
  .then(() => console.log("MongoDB Connected 🌱"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("Plant Nursery Backend Running 🌿");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});

const plantRoutes = require("./routes/plantRoutes");

app.use("/api/plants", plantRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const rentalRoutes = require("./routes/rentalRoutes");
app.use("/api/rentals", rentalRoutes);

const cartRoutes = require("./routes/cartRoutes");
app.use("/api/cart", cartRoutes);

const salesRoutes = require("./routes/salesRoutes");
app.use("/api/sales", salesRoutes);

