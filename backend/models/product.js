// This helps us talk to the fridge (MongoDB)
const mongoose = require("mongoose");

// This is the template for a product (like a menu item)
const productSchema = new mongoose.Schema({
  name: {
    type: String,           // Product name (like "iPhone 15")
    required: true          // Must have a name
  },
  price: {
    type: Number,           // Price in KES (like 50000)
    required: true
  },
  description: {
    type: String,           // What the product is about
    required: true
  },
  image: {
    type: String,           // URL of the product image
    required: true
  },
  category: {
    type: String,           // Like "phones", "laptops", etc.
    required: true
  },
  stock: {
    type: Number,           // How many items are available
    default: 0              // Start with 0 if not specified
  }
}, {
  timestamps: true          // Automatically add createdAt and updatedAt
});

// Export the model so we can use it in other files
module.exports = mongoose.model("Product", productSchema);