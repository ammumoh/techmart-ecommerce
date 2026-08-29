// This helps us create routes (doors in the kitchen)
const express = require("express");
const router = express.Router();

// Import the Product model (the menu template)
const Product = require("../models/Product");

// Route 1: Get all products (see the whole menu)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();  // Get all products from fridge
    res.json(products);                      // Send them back
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route 2: Get one product by ID (see one item)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route 3: Add a new product (add item to menu)
router.post("/", async (req, res) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    image: req.body.image,
    category: req.body.category,
    stock: req.body.stock
  });

  try {
    const newProduct = await product.save();  // Save to fridge
    res.status(201).json(newProduct);         // Send back the new product
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route 4: Update a product (change menu item)
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update fields if provided
    if (req.body.name) product.name = req.body.name;
    if (req.body.price) product.price = req.body.price;
    if (req.body.description) product.description = req.body.description;
    if (req.body.image) product.image = req.body.image;
    if (req.body.category) product.category = req.body.category;
    if (req.body.stock != null) product.stock = req.body.stock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route 5: Delete a product (remove from menu)
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Export the router so we can use it in index.js
module.exports = router;