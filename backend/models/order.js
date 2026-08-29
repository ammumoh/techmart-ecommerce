const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: String, // Changed from mongoose.Schema.Types.ObjectId
    required: true
  },
  orderItems: [{
    product: {
      type: String, // Changed from mongoose.Schema.Types.ObjectId
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    image: {
      type: String
    }
  }],
  shippingAddress: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String // ADD THIS FOR CUSTOMER EMAIL
    },
    specialInstructions: {
      type: String
    }
  },
  paymentMethod: {
    type: String,
    required: true,
    default: 'Cash on Delivery'
  },
  totalPrice: {
    type: Number,
    required: true
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  // ========== M-PESA FIELDS - ADD THESE ==========
  mpesaCheckoutRequestId: {
    type: String
  },
  mpesaPhoneNumber: {
    type: String
  },
  mpesaResult: {
    type: mongoose.Schema.Types.Mixed
  }
  // ==============================================
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);