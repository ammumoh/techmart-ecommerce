// backend/routes/mpesaRoutes.js
const express = require("express");
const router = express.Router();
const Order = require("../models/order");

console.log('🔥 mpesaRoutes.js is loading...');

// ================================================================
// TEST ROUTE - Check if routes are working
// ================================================================
router.get('/test', (req, res) => {
  console.log('✅ Test route was called!');
  res.json({ 
    success: true, 
    message: '✅ M-Pesa routes are working!',
    timestamp: new Date().toISOString(),
    environment: process.env.MPESA_ENVIRONMENT || 'not set',
    routes: {
      test: 'GET /api/mpesa/test',
      mock: 'POST /api/mpesa/stkpush-mock',
      real: 'POST /api/mpesa/stkpush',
      status: 'GET /api/mpesa/status/:orderId'
    }
  });
});

// ================================================================
// MOCK M-PESA STK PUSH - For testing without real credentials
// ================================================================
router.post('/stkpush-mock', async (req, res) => {
  console.log('📤 MOCK route called!');
  
  try {
    if (process.env.NODE_ENV === 'production') return res.status(404).json({ success: false, message: 'Mock payments are disabled in production' });
    const { orderId, phoneNumber } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.isPaid) return res.status(409).json({ success: false, message: 'This order is already paid' });
    const amount = order.totalPrice;
    if (!phoneNumber || !/^2547\d{8}$/.test(phoneNumber)) return res.status(400).json({ success: false, message: 'Enter a valid Kenyan Safaricom phone number' });
    console.log('📤 Data:', { orderId, phoneNumber, amount });

    const mockId = 'MOCK_' + Date.now();
    order.mpesaCheckoutRequestId = mockId;
    order.mpesaPhoneNumber = phoneNumber;
    await order.save();

    res.json({
      success: true,
      message: 'MOCK: Payment initiated successfully!',
      checkoutRequestId: mockId,
      orderFound: true,
      note: 'Mock mode does not confirm or record a real payment'
    });

  } catch (error) {
    console.error('❌ MOCK error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Payment failed' 
    });
  }
});

// ================================================================
// REAL M-PESA STK PUSH - Use this when you have credentials
// ================================================================
router.post('/stkpush', async (req, res) => {
  console.log('📤 REAL M-Pesa route called!');
  
  try {
    const { orderId, phoneNumber } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.isPaid) return res.status(409).json({ success: false, message: 'This order is already paid' });
    const amount = order.totalPrice;
    if (!phoneNumber || !/^2547\d{8}$/.test(phoneNumber)) return res.status(400).json({ success: false, message: 'Enter a valid Kenyan Safaricom phone number' });

    // Get credentials from environment
    const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
    const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
    const MPESA_PASSKEY = process.env.MPESA_PASSKEY;
    const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE || '174379';
    const MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL || 'https://your-domain.com/api/mpesa/callback';
    const MPESA_BASE_URL = process.env.MPESA_ENVIRONMENT === 'production' 
      ? 'https://api.safaricom.co.ke' 
      : 'https://sandbox.safaricom.co.ke';

    console.log('📤 Environment:', process.env.MPESA_ENVIRONMENT || 'sandbox');
    console.log('📤 Shortcode:', MPESA_SHORTCODE);
    console.log('📤 Callback URL:', MPESA_CALLBACK_URL);

    // Validate phone number
    const formattedPhone = phoneNumber.replace(/^0/, '');
    
    // Check if consumer key exists
    if (!MPESA_CONSUMER_KEY || MPESA_CONSUMER_KEY === 'your_consumer_key_here') {
      return res.status(400).json({
        success: false,
        message: 'M-Pesa credentials not configured. Please add your Consumer Key and Secret to .env file.',
        tip: 'Get credentials from https://developer.safaricom.co.ke/'
      });
    }

    // Get access token
    const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
    console.log('📤 Getting access token...');
    
    const tokenResponse = await fetch(`${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`
      }
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('❌ Token error:', errorText);
      throw new Error(`Failed to get access token: ${errorText}`);
    }
    
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    console.log('✅ Access token received');

    // Generate timestamp
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    
    // Generate password
    const passwordBuffer = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`);
    const password = passwordBuffer.toString('base64');

    // Prepare STK Push request
    const stkRequest = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: formattedPhone,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: MPESA_CALLBACK_URL,
      AccountReference: `ORDER${orderId.slice(-6)}`,
      TransactionDesc: 'Payment for TechMart Order'
    };

    console.log('📤 Sending STK Push request...');

    // Send STK Push
    const response = await fetch(`${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(stkRequest)
    });

    const data = await response.json();
    console.log('📥 M-Pesa Response:', JSON.stringify(data, null, 2));

    if (data.ResponseCode === '0') {
      // Success - Save CheckoutRequestID to order
      const order = await Order.findById(orderId);
      if (order) {
        order.mpesaCheckoutRequestId = data.CheckoutRequestID;
        order.mpesaPhoneNumber = formattedPhone;
        await order.save();
        console.log(`✅ Order ${orderId} saved with CheckoutRequestID: ${data.CheckoutRequestID}`);
      }

      res.json({
        success: true,
        message: 'STK Push sent successfully! Please check your phone for M-Pesa prompt.',
        checkoutRequestId: data.CheckoutRequestID,
        responseCode: data.ResponseCode,
        responseDescription: data.ResponseDescription
      });
    } else {
      console.error('❌ M-Pesa error:', data);
      res.status(400).json({
        success: false,
        message: data.ResponseDescription || 'Failed to initiate payment',
        errorCode: data.errorCode,
        fullResponse: data
      });
    }

  } catch (error) {
    console.error('❌ M-Pesa STK Push error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to initiate payment. Please try again.'
    });
  }
});

// ================================================================
// M-Pesa Callback URL (M-Pesa sends response here)
// ================================================================
router.post('/callback', async (req, res) => {
  console.log('📞 M-Pesa Callback received:', JSON.stringify(req.body, null, 2));

  try {
    const { Body } = req.body;
    
    if (Body.stkCallback.ResultCode === 0) {
      // Payment successful
      const { CheckoutRequestID, ResultDesc } = Body.stkCallback;
      
      // Update order status
      const order = await Order.findOne({ mpesaCheckoutRequestId: CheckoutRequestID });
      if (order) {
        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentMethod = 'M-Pesa';
        order.mpesaResult = Body.stkCallback;
        await order.save();
        console.log(`✅ Order ${order._id} marked as paid via M-Pesa`);
      } else {
        console.log(`❌ Order not found for CheckoutRequestID: ${CheckoutRequestID}`);
      }
    } else {
      // Payment failed
      console.log('❌ M-Pesa payment failed:', Body.stkCallback.ResultDesc);
    }

    // Respond to M-Pesa
    res.json({ ResultCode: 0, ResultDesc: 'Success' });
  } catch (error) {
    console.error('❌ M-Pesa Callback error:', error);
    res.json({ ResultCode: 1, ResultDesc: 'Failed' });
  }
});

// ================================================================
// CHECK PAYMENT STATUS
// ================================================================
router.get('/status/:orderId', async (req, res) => {
  console.log('📤 Status check for order:', req.params.orderId);
  
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    res.json({
      success: true,
      isPaid: order.isPaid || false,
      paidAt: order.paidAt,
      paymentMethod: order.paymentMethod,
      mpesaCheckoutRequestId: order.mpesaCheckoutRequestId
    });
  } catch (error) {
    console.error('❌ Status error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

console.log('✅ mpesaRoutes.js loaded successfully!');
module.exports = router;
