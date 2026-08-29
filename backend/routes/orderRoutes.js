// This helps us create routes (doors in the kitchen)
const express = require("express");
const router = express.Router();

// Import the Order model
const Order = require("../models/Order");

// Route 1: Create a new order (place order)
router.post("/", async (req, res) => {
  try {
    const {
      user,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice
    } = req.body;

    // Check if order has items
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // Create new order
    const order = new Order({
      user,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice
    });

    const createdOrder = await order.save();  // Save to fridge
    res.status(201).json(createdOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route 2: Get order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route 3: Get all orders for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route 4: Get all orders (for admin)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route 5: Update order to paid
router.put("/:id/pay", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route 6: Update order to delivered
router.put("/:id/deliver", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Export the router
module.exports = router;