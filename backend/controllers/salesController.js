const Sale = require("../models/Sale");

exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate("plant").populate("user").sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
