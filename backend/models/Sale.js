const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    plant: { type: mongoose.Schema.Types.ObjectId, ref: "Plant", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    quantity: { type: Number, default: 1 },
    price: { type: Number, default: 0 },
    shipping: {
      fullName: String,
      address: String,
      city: String,
      postalCode: String,
      phone: String,
    },
    paymentType: { type: String, default: "cod" },
    orderId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sale", saleSchema);
