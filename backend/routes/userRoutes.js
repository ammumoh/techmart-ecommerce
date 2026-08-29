// backend/routes/userRoutes.js - With manual password hashing
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// REGISTER - Manual password hashing
router.post("/register", async (req, res) => {
  console.log('📤 Registration request received:', req.body.email);
  
  try {
    const { name, email, password, phone, address, city } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, password, and phone"
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email"
      });
    }

    // Hash password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with hashed password
    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword, // Store the hashed password
      phone,
      address: address || '',
      city: city || ''
    });

    await user.save();
    console.log('✅ User registered:', user.email);

    const token = jwt.sign(
      { userId: user._id, email: user.email, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        isAdmin: user.isAdmin
      }
    });

  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to register user"
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  console.log('📤 Login request received:', req.body.email);
  
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password"
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Compare password manually
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ User logged in:', user.email);

    res.json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        isAdmin: user.isAdmin
      }
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to login"
    });
  }
});

module.exports = router;