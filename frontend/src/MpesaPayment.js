// src/MpesaPayment.js
import React, { useState } from 'react';
import './MpesaPayment.css';

const MpesaPayment = ({ order, onPaymentComplete, onCancel }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('idle');

  const formatPrice = (price) => {
    return `KSh ${price.toLocaleString()}`;
  };

  const handlePayment = async () => {
    if (!phoneNumber) {
      setError('Please enter your phone number');
      return;
    }

    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    
    if (cleanPhone.length < 9) {
      setError('Please enter a valid Kenyan phone number (minimum 9 digits)');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPaymentStatus('processing');

    try {
      const API_URL = 'http://localhost:5000';
      const formattedPhone = `254${cleanPhone}`;
      
      console.log('📤 Sending request to:', `${API_URL}/api/mpesa/stkpush-mock`);
      console.log('📤 Order ID:', order._id);
      console.log('📤 Phone:', formattedPhone);
      console.log('📤 Amount:', order.totalPrice);
      
      const response = await fetch(`${API_URL}/api/mpesa/stkpush`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order._id,
          phoneNumber: formattedPhone,
          amount: order.totalPrice
        })
      });

      const data = await response.json();
      console.log('📥 Response:', data);

      if (data.success) {
        setPaymentStatus('success');
        setTimeout(() => {
          onPaymentComplete(order);
        }, 4000);
      } else {
        setPaymentStatus('failed');
        setError(data.message || 'Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('❌ Payment error:', error);
      setPaymentStatus('failed');
      setError(`Payment failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    try {
      const API_URL = 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/mpesa/status/${order._id}`);
      const data = await response.json();
      console.log('📥 Payment status:', data);
      
      if (data.isPaid) {
        setPaymentStatus('success');
        setTimeout(() => {
          onPaymentComplete(order);
        }, 1000);
      } else {
        setError('Payment still pending. Please wait...');
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      setError('Failed to check payment status. Please try again.');
    }
  };

  return (
    <div className="mpesa-container">
      <div className="mpesa-card">
        <div className="mpesa-header">
          <span className="mpesa-icon">💳</span>
          <h2>Pay with M-Pesa</h2>
        </div>

        <div className="mpesa-order-summary">
          <p><strong>Order ID:</strong> #{order._id.slice(-8).toUpperCase()}</p>
          <p><strong>Amount to Pay:</strong> {formatPrice(order.totalPrice)}</p>
          <p><strong>Items:</strong> {order.orderItems.length} item(s)</p>
        </div>

        <div className="mpesa-info">
          <div className="mpesa-steps">
            <h4>How to Pay:</h4>
            <ol>
              <li>Enter your M-Pesa phone number</li>
              <li>Click "Pay Now"</li>
              <li>Check your phone for the STK Push prompt</li>
              <li>Enter your M-Pesa PIN to confirm</li>
              <li>Wait for confirmation</li>
            </ol>
          </div>
        </div>

        {paymentStatus === 'processing' && (
          <div className="mpesa-processing">
            <div className="processing-spinner"></div>
            <p>⏳ Waiting for payment confirmation...</p>
            <p className="processing-hint">Please check your phone for the M-Pesa prompt</p>
            <button 
              className="check-status-btn"
              onClick={checkPaymentStatus}
            >
              Check Status
            </button>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="mpesa-success">
            <span className="success-icon">✅</span>
            <h3>Payment Successful!</h3>
            <p>Your order has been confirmed.</p>
            <p>You will receive an M-Pesa confirmation message shortly.</p>
          </div>
        )}

        {paymentStatus === 'idle' && (
          <div className="mpesa-form">
            <div className="form-group">
              <label>Phone Number (M-Pesa)</label>
              <div className="phone-input-group">
                <span className="phone-prefix">+254</span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="712345678"
                  maxLength="12"
                />
              </div>
              <small>Enter the phone number registered with M-Pesa (e.g., 712345678)</small>
            </div>

            {error && (
              <div className="mpesa-error">
                <span>❌</span>
                <p>{error}</p>
              </div>
            )}

            <div className="mpesa-actions">
              <button 
                className="pay-btn"
                onClick={handlePayment}
                disabled={isLoading}
              >
                {isLoading ? '⏳ Processing...' : '💳 Pay Now'}
              </button>
              <button 
                className="cancel-btn"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>

            <div className="mpesa-footer">
              <p>🔒 Secure payment via M-Pesa</p>
              <p className="mpesa-powered">Powered by Safaricom M-Pesa</p>
            </div>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div className="mpesa-failed">
            <span className="failed-icon">❌</span>
            <h3>Payment Failed</h3>
            <p>{error || 'Something went wrong. Please try again.'}</p>
            <button 
              className="retry-btn"
              onClick={() => {
                setPaymentStatus('idle');
                setError(null);
              }}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MpesaPayment;