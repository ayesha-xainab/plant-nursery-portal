const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema(
  {
    plant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plant",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rentDate: {
      type: Date,
      default: Date.now,
    },
    rentDays: {
      type: Number,
      default: 0,
    },
    totalRent: {
      type: Number,
      default: 0,
    },
    dueDate: {
      type: Date,
    },
    returnDate: {
      type: Date,
    },
    shipping: {
      fullName: String,
      address: String,
      city: String,
      postalCode: String,
      phone: String,
    },
    payment: {
      type: { type: String },
      nameOnCard: String,
      cardNumber: String,
      expiry: String,
    },
    status: {
      type: String,
      enum: ["borrowed", "returned"],
      default: "borrowed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rental", rentalSchema);
