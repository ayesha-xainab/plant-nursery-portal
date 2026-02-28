const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    careInstructions: {
      type: String,
    },
    isAvailableForRent: {
      type: Boolean,
      default: false,
    },
    rentPerDay: {
      type: Number,
      default: 0,
    },
    categories: {
    type: [String],
    enum: [
      "Indoor",
      "Outdoor",
      "Flowering",
      "Succulent",
      "Herbal",
      "Medicinal",
    ],
    required: true,
  },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plant", plantSchema);
