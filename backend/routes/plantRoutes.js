const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const {
  addPlant,
  getAllPlants,
  getPlantById,
  updatePlant,
  deletePlant,
} = require("../controllers/plantController");

// Routes
router.post("/", auth, admin, addPlant);
router.get("/", getAllPlants);
router.get("/:id", getPlantById);
router.put("/:id", auth, admin, updatePlant);
router.delete("/:id", auth, admin, deletePlant);

module.exports = router;
