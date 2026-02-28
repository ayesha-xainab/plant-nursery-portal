const Cart = require("../models/Cart");
const Plant = require("../models/Plant");
const Sale = require("../models/Sale");

exports.addToCart = async (req, res) => {
  try {
    const { plantId } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.plant.toString() === plantId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ plant: plantId, quantity: 1 });
    }

    await cart.save();
    res.json({ message: "Plant added to cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId }).populate("items.plant");

    if (!cart) {
      return res.json({ items: [] });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { plantId, quantity } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => item.plant.toString() === plantId);

    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
    } else if (quantity > 0) {
      cart.items.push({ plant: plantId, quantity });
    }

    await cart.save();
    res.json({ message: "Cart updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.checkout = async (req, res) => {
  try {
    const userId = req.user.id;
    const payment = req.body.payment || { type: "cod" };
    const shipping = req.body.shipping || {};

    // Validate shipping info for all orders. Accept either `address` or `addressLine1` for backward compatibility.
    const fullName = shipping.fullName;
    const address = shipping.address || shipping.addressLine1;
    const city = shipping.city;
    const postalCode = shipping.postalCode;
    const phone = shipping.phone;

    if (!fullName || !address || !city || !postalCode || !phone) {
      return res.status(400).json({ message: "Shipping details (fullName, address, city, postalCode, phone) are required" });
    }

    // Support Cash On Delivery (COD) (case-insensitive)
    console.log("Checkout called", { payment, shipping });
    const paymentType = (payment.type || "cod").toString().toLowerCase();
    if (paymentType !== "cod") {
      // Basic payment validation for card payments (mock)
      const { nameOnCard, cardNumber, expiry, cvv } = payment;
      if (!nameOnCard || !cardNumber || !expiry || !cvv) {
        return res.status(400).json({ message: "Payment details are required for card payment" });
      }

      if (typeof cardNumber !== "string" || cardNumber.replace(/\s+/g, "").length < 12) {
        return res.status(400).json({ message: "Invalid card number" });
      }

      if (!/^[0-9]{3,4}$/.test(String(cvv))) {
        return res.status(400).json({ message: "Invalid CVV" });
      }

      // Simulate payment processing (in real app integrate payment gateway)
      const paymentSuccess = true;
      if (!paymentSuccess) {
        return res.status(402).json({ message: "Payment failed" });
      }
    }

    const cart = await Cart.findOne({ user: userId }).populate("items.plant");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Check stock and update
    for (const item of cart.items) {
      const plant = await Plant.findById(item.plant._id);
      if (plant.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${plant.name}` });
      }
      plant.stock -= item.quantity;
      await plant.save();
    }

    // Create a simple order confirmation id and Sales records
    const orderId = `ORD-${Date.now()}-${String(userId).slice(-4)}`;

    const sales = cart.items.map(item => ({
      plant: item.plant._id ? item.plant._id : item.plant,
      user: userId,
      quantity: item.quantity,
      price: item.plant.price || 0,
      shipping: { fullName, address, city, postalCode, phone },
      paymentType,
      orderId,
    }));

    if (sales.length > 0) {
      await Sale.insertMany(sales);
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    // Return shipping and payment type info in response for confirmation
    res.json({ message: "Checkout successful", orderId, shipping: { fullName, address, city, postalCode, phone }, paymentType });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
