const Rental = require("../models/Rental");
const Plant = require("../models/Plant");

exports.borrowPlant = async (req, res) => {
  try {
    const { plantId, days = 0, shipping = null, payment = null } = req.body;

    const plant = await Plant.findById(plantId);
    if (!plant || plant.stock <= 0 || !plant.isAvailableForRent) {
      return res.status(400).json({ message: "Plant not available for rent" });
    }

    // Check if user already has an active rental for this plant
    const existingRental = await Rental.findOne({
      user: req.user.id,
      plant: plantId,
      status: "borrowed",
    });
    if (existingRental) {
      return res.status(400).json({ message: "You have already borrowed this plant" });
    }

    const rentDays = Number(days) || 0;
    const totalRent = rentDays * (plant.rentPerDay || 0);
    const rentDate = new Date();
    const dueDate = rentDays > 0 ? new Date(rentDate.getTime() + rentDays * 24 * 60 * 60 * 1000) : null;

    const rental = new Rental({
      plant: plantId,
      user: req.user.id,
      rentDays,
      totalRent,
      dueDate,
      shipping,
      payment,
    });

    plant.stock -= 1;
    await plant.save();
    await rental.save();

    res.status(201).json({ message: "Plant borrowed successfully", rental });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.returnPlant = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental || rental.status === "returned") {
      return res.status(400).json({ message: "Invalid rental" });
    }

    rental.status = "returned";
    rental.returnDate = new Date();

    const plant = await Plant.findById(rental.plant);
    plant.stock += 1;

    await plant.save();
    await rental.save();

    res.json({ message: "Plant returned successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserRentals = async (req, res) => {
  const rentals = await Rental.find({ user: req.user.id })
    .populate("plant");

  // Attach remaining time calculation on server to simplify client
  const results = rentals.map((r) => {
    const obj = r.toObject();
    if (obj.status === "borrowed" && obj.dueDate) {
      const now = new Date();
      const diffMs = new Date(obj.dueDate) - now;
      obj.remainingMs = diffMs > 0 ? diffMs : 0;
    } else {
      obj.remainingMs = 0;
    }
    return obj;
  });

  res.json(results);
};

// Admin: get all rentals
exports.getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.find().populate("plant").populate("user").sort({ createdAt: -1 });
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.find().populate("plant").populate("user").sort({ createdAt: -1 });
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
