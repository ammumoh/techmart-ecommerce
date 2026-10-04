// backend/index.js
// This is the kitchen. We are using Express to make the kitchen easy.
require('dotenv').config();
console.log('🔑 Environment variables loaded');

const express = require("express");

// This helps the dining room (frontend) talk to the kitchen
const cors = require("cors");

// This helps us talk to the fridge (MongoDB)
const mongoose = require("mongoose");
const path = require('path');
const Product = require('./models/product');

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
app.use('/catalog', express.static(path.join(__dirname, '../frontend/src')));

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
    return Product.countDocuments().then(async (count) => {
      if (!count && process.env.SEED_CATALOG !== 'false') {
        const catalog = [
          ['Arduino Uno R3',3500,'Microcontroller board for electronics learning and prototyping.','/catalog/arduino.webp','kits','arduino.webp',0,['ATmega328P','5V','14 digital I/O pins']],
          ['Raspberry Pi 4',10500,'Compact single-board computer for coding, media and connected projects.','/catalog/raspberrypi5_1_large.jpg','kits','raspberrypi5_1_large.jpg',0,['Quad-core processor','2GB/4GB/8GB RAM options']],
          ['Temperature Sensor',1500,'Digital temperature and humidity sensor for microcontroller projects.','/catalog/temperature%20sensor.jpg','sensors','temperature sensor.jpg',0,['-40°C to 80°C','3-5V']],
          ['Soldering Iron Kit',5500,'Temperature-controlled soldering iron kit for electronics assembly and repair.','/catalog/electric%20soldering%20iron%20kit.jpg','tools','electric soldering iron kit.jpg',0,['60W','200-480°C']],
          ['Ultrasonic Sensor',1200,'HC-SR04 distance sensor for robotics and obstacle avoidance.','/catalog/ultrasonic%20sensor.jpg','sensors','ultrasonic sensor.jpg',0,['2-400cm range','5V DC']],
          ['Servo Motor',1800,'SG90 micro servo motor for robotics and hobby projects.','/catalog/servo%20motor.jpg','accessories','servo motor.jpg',0,['4.8-6V','180° rotation']],
          ['Breadboard Kit',2500,'830-point solderless breadboard kit with jumper wires.','/catalog/breadboard%20kit.png','kits','breadboard kit.png',0,['830 tie-points','65 jumper wires']],
          ['Digital Multimeter',4800,'Digital multimeter for electronics testing and diagnostics.','/catalog/digitalmultimeter.avif','tools','digitalmultimeter.avif',0,['AC/DC voltage','Auto-ranging']]
        ].map(([name,price,description,image,category,_file,stock,specifications]) => ({name,price,description,image,category,stock,specifications,featured:true}));
        await Product.insertMany(catalog);
        console.log('Starter catalog added with zero stock; inventory must be set before products can be purchased.');
      }
    });
  })
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
