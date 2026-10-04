const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/product');
const { protect, adminOnly } = require('../middleware/auth');

// Create totals and product descriptions on the server so clients cannot alter prices.
router.post('/', protect, async (req, res) => {
  let reserved = [];
  try {
    const { orderItems, shippingAddress, paymentMethod = 'Cash on Delivery', customerName } = req.body;
    if (!Array.isArray(orderItems) || !orderItems.length) return res.status(400).json({ message: 'Your cart is empty' });
    if (!shippingAddress?.address?.trim() || !shippingAddress?.city?.trim() || !shippingAddress?.phone?.trim() || !shippingAddress?.email?.trim()) {
      return res.status(400).json({ message: 'Complete your delivery address, city, phone, and email' });
    }
    const normalizedItems = [];
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      const quantity = Number(item.quantity);
      if (!product) return res.status(400).json({ message: 'A product in your cart is no longer available' });
      if (!Number.isInteger(quantity) || quantity < 1) return res.status(400).json({ message: 'Invalid item quantity' });
      normalizedItems.push({ product: product._id.toString(), name: product.name, price: product.price, quantity, image: product.image });
    }
    const totalPrice = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    for (const item of normalizedItems) {
      const product = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
      if (!product) {
        await Promise.all(reserved.map(previous => Product.updateOne({ _id: previous.product }, { $inc: { stock: previous.quantity } })));
        return res.status(409).json({ message: `${item.name} is out of stock or the available quantity changed` });
      }
      reserved.push(item);
    }
    const order = await Order.create({
      user: req.user._id.toString(),
      orderItems: normalizedItems,
      shippingAddress,
      paymentMethod,
      totalPrice
    });
    res.status(201).json(order);
  } catch (err) {
    if (reserved.length) await Promise.all(reserved.map(item => Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } })));
    res.status(400).json({ message: err.message });
  }
});

router.get('/user/:userId', protect, async (req, res) => {
  if (!req.user.isAdmin && req.user._id.toString() !== req.params.userId) return res.status(403).json({ message: 'You can only view your own orders' });
  try { res.json(await Order.find({ user: req.params.userId }).sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/', protect, adminOnly, async (_req, res) => {
  try { res.json(await Order.find().sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!req.user.isAdmin && order.user !== req.user._id.toString()) return res.status(403).json({ message: 'You can only view your own orders' });
    res.json(order);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id/pay', protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.isPaid = true; order.paidAt = new Date();
    res.json(await order.save());
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id/deliver', protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.isDelivered = true; order.deliveredAt = new Date();
    res.json(await order.save());
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    await order.deleteOne();
    res.json({ message: 'Order deleted' });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;
