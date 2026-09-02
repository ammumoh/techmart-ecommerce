// backend/index.js
// This is the kitchen. We are using Express to make the kitchen easy.
require('dotenv').config();
console.log('🔑 Environment variables loaded');

const express = require("express");

// This helps the dining room (frontend) talk to the kitchen
const cors = require("cors");

// This helps us talk to the fridge (MongoDB)
const mongoose = require("mongoose");

// Import routes
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");

console.log('📦 Loading mpesaRoutes...');
const mpesaRoutes = require("./routes/mpesaRoutes");
console.log('✅ mpesaRoutes loaded!');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes - REGISTER M-PESA FIRST
console.log('📦 Registering routes...');
app.use("/api/mpesa", mpesaRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
console.log('✅ Routes registered!');

// Test route
app.get("/", (req, res) => {
  res.send("Hello from the kitchen! Backend is working.");
});

// =============================================
// ✅ USE .env - NO HARDCODED CREDENTIALS!
// =============================================
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error("❌ MONGODB_URI is not defined in .env file!");
  console.error("📝 Create a .env file in the backend folder with MONGODB_URI=your_connection_string");
  process.exit(1);
}

console.log("📤 Connecting to MongoDB...");

// Connect to the fridge FIRST, then open the kitchen
mongoose.connect(mongoURI)
  .then(() => {
    console.log("✅ Fridge connected successfully!");
    console.log("📦 Available routes:");
    console.log("  - /api/mpesa/test");
    console.log("  - /api/mpesa/stkpush-mock (test mode)");
    console.log("  - /api/mpesa/stkpush (real M-Pesa)");
    console.log("  - /api/mpesa/status/:orderId");
    console.log("  - /api/products");
    console.log("  - /api/users");
    console.log("  - /api/orders");

    app.listen(PORT, () => {
      console.log(`🚀 Kitchen is open on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ Error connecting to fridge:", err.message);
  });