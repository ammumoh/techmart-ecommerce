// src/OrderConfirmation.js
import React, { useState } from 'react';
import './OrderConfirmation.css';
import MpesaPayment from './MpesaPayment';

const OrderConfirmation = ({ order, onBackToShop }) => {
  const [showMpesa, setShowMpesa] = useState(false);

  // Handle M-Pesa payment
  const handleMpesaPayment = () => {
    setShowMpesa(true);
  };

  // Handle payment complete
  const handlePaymentComplete = (paidOrder) => {
    setShowMpesa(false);
    // You can add additional logic here like refreshing order status
  };

  // Handle M-Pesa cancel
  const handleMpesaCancel = () => {
    setShowMpesa(false);
  };

  if (!order) {
    return (
      <div className="confirmation-container">
        <div className="confirmation-card">
          <h2>No Order Found</h2>
          <button onClick={onBackToShop} className="back-to-shop-btn">
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  // If showing M-Pesa payment, render it
  if (showMpesa) {
    return (
      <MpesaPayment 
        order={order} 
        onPaymentComplete={handlePaymentComplete}
        onCancel={handleMpesaCancel}
      />
    );
  }

  const formatPrice = (price) => {
    return `KSh ${price.toLocaleString()}`;
  };

  const getPaymentStatus = () => {
    if (order.isPaid) {
      return <span className="status-paid">✅ Paid</span>;
    } else {
      return <span className="status-pending">⏳ Pending</span>;
    }
  };

  const getPaymentMethod = () => {
    if (order.paymentMethod === 'M-Pesa') {
      return '💳 M-Pesa';
    } else if (order.paymentMethod === 'Cash on Delivery') {
      return '💰 Cash on Delivery';
    } else {
      return order.paymentMethod || 'Not specified';
    }
  };

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        {/* Success Icon */}
        <div className="success-icon">✅</div>
        
        <h1 className="confirmation-title">Order Placed Successfully! 🎉</h1>
        <p className="confirmation-subtitle">Thank you for your order. We'll process it shortly.</p>

        {/* Order ID */}
        <div className="order-id-section">
          <span className="order-id-label">Order ID:</span>
          <span className="order-id-value">#{order._id}</span>
        </div>

        {/* Order Details */}
        <div className="order-details-grid">
          <div className="detail-section">
            <h3>📦 Order Items</h3>
            {order.orderItems.map((item, index) => (
              <div key={index} className="order-item">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-quantity">× {item.quantity}</span>
                </div>
                <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="order-total">
              <span>Total:</span>
              <span className="total-price">{formatPrice(order.totalPrice)}</span>
            </div>
          </div>

          <div className="detail-section">
            <h3>👤 Customer Details</h3>
            <div className="customer-detail">
              <span className="detail-label">Name:</span>
              <span>{order.user}</span>
            </div>
            <div className="customer-detail">
              <span className="detail-label">Email:</span>
              <span>{order.shippingAddress?.email || 'N/A'}</span>
            </div>
            <div className="customer-detail">
              <span className="detail-label">Phone:</span>
              <span>{order.shippingAddress?.phone}</span>
            </div>
          </div>

          <div className="detail-section">
            <h3>📍 Delivery Address</h3>
            <div className="address-detail">
              <p>{order.shippingAddress?.address}</p>
              <p>{order.shippingAddress?.city}</p>
            </div>
            {order.shippingAddress?.specialInstructions && (
              <div className="special-instructions">
                <strong>Special Instructions:</strong>
                <p>{order.shippingAddress.specialInstructions}</p>
              </div>
            )}
          </div>

          <div className="detail-section">
            <h3>💳 Payment</h3>
            <div className="payment-detail">
              <span className="detail-label">Method:</span>
              <span>{getPaymentMethod()}</span>
            </div>
            <div className="payment-detail">
              <span className="detail-label">Status:</span>
              {getPaymentStatus()}
            </div>
            <div className="payment-detail">
              <span className="detail-label">Order Date:</span>
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <div className="payment-options-section">
          <h3>💳 Payment Options</h3>
          <div className="payment-options-grid">
            <div className="payment-option-card">
              <h4>💰 Cash on Delivery</h4>
              <p>Pay when you receive your order</p>
              <button 
                className="payment-option-btn cod-btn"
                onClick={() => alert('You have chosen Cash on Delivery. You will pay when you receive your order.')}
              >
                Select Cash on Delivery
              </button>
            </div>
            <div className="payment-option-card mpesa-card">
              <h4>💳 M-Pesa</h4>
              <p>Pay instantly via M-Pesa</p>
              <button 
                className="payment-option-btn mpesa-btn"
                onClick={handleMpesaPayment}
              >
                Pay with M-Pesa
              </button>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="next-steps">
          <h3>📋 Next Steps</h3>
          <ol>
            <li>We'll confirm your order via email/phone</li>
            <li>Your order will be prepared for delivery</li>
            <li>You'll receive a delivery confirmation</li>
            <li>Complete payment using your chosen method</li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="confirmation-actions">
          <button onClick={onBackToShop} className="continue-shopping-btn">
            🛍️ Continue Shopping
          </button>
          <button 
            onClick={() => window.print()} 
            className="print-btn"
          >
            🖨️ Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;