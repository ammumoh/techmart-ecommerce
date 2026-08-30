# 🛒 TechMart - E-Commerce Platform

A complete e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js) with M-Pesa integration for Kenyan customers.

## ✨ Features

- 🛍️ **Product Catalog** - Browse electronics products with images
- 🛒 **Shopping Cart** - Add products to cart and place orders
- 📱 **M-Pesa Integration** - Real STK Push payments
- 👤 **User Authentication** - Register, Login, and Profile Management
- 📋 **Order Management** - View order history and status
- 🛠️ **Admin Dashboard** - Manage products and orders
- 📦 **Order Confirmation** - Beautiful confirmation page with receipt printing
- 📊 **Order Tracking** - Track order status (Pending → Paid → Delivered)
- 📱 **Responsive Design** - Works on all devices

## 🚀 Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- Bcrypt for password hashing
- M-Pesa API integration
- CORS enabled

### Frontend
- React.js
- React Hooks (useState, useEffect)
- CSS3 with responsive design
- Fetch API for HTTP requests

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file and add your configuration
# (see .env.example)

# Start the backend server
node index.js

Frontend Setup
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the frontend server
npm start

M-Pesa Configuration
Get your M-Pesa API credentials from Safaricom Developer Portal

Add them to your .env file:
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_PASSKEY=your_passkey
MPESA_SHORTCODE=174379

🗺️ Project Structure
e-commerce/
├── backend/
│   ├── models/
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/
│   │   ├── mpesaRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   ├── index.js
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
└── README.md

🎯 API Endpoints
Products
GET /api/products - Get all products

GET /api/products/:id - Get single product

Users
POST /api/users/register - Register new user
POST /api/users/login - Login user

Orders
POST /api/orders - Create new order

GET /api/orders - Get all orders (admin)

GET /api/orders/user/:userId - Get user's orders

PUT /api/orders/:id/pay - Mark order as paid

PUT /api/orders/:id/deliver - Mark order as delivered

M-Pesa
POST /api/mpesa/stkpush - Initiate M-Pesa payment

POST /api/mpesa/callback - M-Pesa callback URL

GET /api/mpesa/status/:orderId - Check payment status

📱 M-Pesa Integration
The platform integrates with Safaricom's M-Pesa API for seamless mobile payments:

Customer selects M-Pesa payment option

Enters phone number

Receives STK Push prompt on phone

Confirms payment with PIN

Order automatically updated to "Paid"

🎨 Screenshots
(Add screenshots of your application here)

🤝 Contributing
Fork the repository

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Safaricom Developer Portal for M-Pesa API

MongoDB for database

React for frontend framework

## Step 5: Create a `.env.example` File

Create a file called `.env.example` in your root folder:

```env
# .env.example
# Backend Environment Variables

PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# M-Pesa Credentials (get from Safaricom Developer Portal)
MPESA_CONSUMER_KEY=your_consumer_key_here
MPESA_CONSUMER_SECRET=your_consumer_secret_here
MPESA_PASSKEY=your_passkey_here
MPESA_SHORTCODE=174379
MPESA_CALLBACK_URL=https://your-domain.com/api/mpesa/callback
MPESA_ENVIRONMENT=sandbox

