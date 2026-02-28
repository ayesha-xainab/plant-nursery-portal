const Plant = require("../models/Plant");

// ➕ Add new plant
exports.addPlant = async (req, res) => {
  try {
    const plant = new Plant(req.body);
    await plant.save();
    res.status(201).json(plant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📥 Get all plants (WITH search & category filter)
exports.getAllPlants = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    // 🔍 Search by name (case-insensitive)
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // 🏷️ Filter by category (supports multi-category plants)
    if (category) {
      query.categories = { $in: [category] };
    }

    const plants = await Plant.find(query);
    res.json(plants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📄 Get single plant by ID
exports.getPlantById = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant)
      return res.status(404).json({ message: "Plant not found" });

    res.json(plant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update plant
exports.updatePlant = async (req, res) => {
  try {
    const updatedPlant = await Plant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedPlant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Delete plant
exports.deletePlant = async (req, res) => {
  try {
    await Plant.findByIdAndDelete(req.params.id);
    res.json({ message: "Plant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
