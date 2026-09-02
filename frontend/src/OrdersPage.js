// src/OrdersPage.js
import React, { useState, useEffect } from 'react';
import './OrdersPage.css';

const OrdersPage = ({ onBackToShop }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  // Fetch orders from backend
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/orders`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      console.log('📦 Orders fetched:', data);
      setOrders(data);
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price) => {
    return `KSh ${price.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (order) => {
    if (order.isDelivered) {
      return <span className="badge delivered">✅ Delivered</span>;
    } else if (order.isPaid) {
      return <span className="badge paid">💰 Paid</span>;
    } else {
      return <span className="badge pending">⏳ Pending</span>;
    }
  };

  const openOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const closeOrderDetail = () => {
    setShowOrderDetail(false);
    setSelectedOrder(null);
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (filter === 'pending') return !order.isDelivered;
    if (filter === 'delivered') return order.isDelivered;
    return true;
  });

  // Count orders by status
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => !o.isDelivered).length;
  const deliveredOrders = orders.filter(o => o.isDelivered).length;

  return (
    <div className="orders-container">
      <div className="orders-header">
        <button className="back-btn" onClick={onBackToShop}>
          ← Back to Shop
        </button>
        <h1>📋 My Orders</h1>
        <button className="refresh-btn" onClick={fetchOrders}>
          🔄 Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <span className="stat-icon">📦</span>
          <div className="stat-info">
            <span className="stat-number">{totalOrders}</span>
            <span className="stat-label">Total Orders</span>
          </div>
        </div>
        <div className="stat-card pending-stat">
          <span className="stat-icon">⏳</span>
          <div className="stat-info">
            <span className="stat-number">{pendingOrders}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
        <div className="stat-card delivered-stat">
          <span className="stat-icon">✅</span>
          <div className="stat-info">
            <span className="stat-number">{deliveredOrders}</span>
            <span className="stat-label">Delivered</span>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="filter-container">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Orders
        </button>
        <button 
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          ⏳ Pending
        </button>
        <button 
          className={`filter-btn ${filter === 'delivered' ? 'active' : ''}`}
          onClick={() => setFilter('delivered')}
        >
          ✅ Delivered
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-container">
          <span className="error-icon">❌</span>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchOrders}>
            Try Again
          </button>
        </div>
      )}

      {/* Orders List */}
      {!isLoading && !error && (
        <div className="orders-list">
          {filteredOrders.length === 0 ? (
            <div className="empty-orders">
              <span className="empty-icon">🛒</span>
              <h3>No orders found</h3>
              <p>You haven't placed any orders yet.</p>
              <button className="start-shopping-btn" onClick={onBackToShop}>
                Start Shopping
              </button>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-id-date">
                    <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                    <span className="order-date">📅 {formatDate(order.createdAt)}</span>
                  </div>
                  <div className="order-status">
                    {getStatusBadge(order)}
                    <span className="order-total">{formatPrice(order.totalPrice)}</span>
                  </div>
                </div>

                <div className="order-body">
                  <div className="order-items">
                    {order.orderItems.map((item, index) => (
                      <div key={index} className="order-item-detail">
                        <div className="item-image-placeholder">
                          {item.image && typeof item.image === 'string' && item.image.startsWith('http') ? (
                            <img src={item.image} alt={item.name} className="order-item-image" />
                          ) : (
                            <span className="item-emoji">🔧</span>
                          )}
                        </div>
                        <div className="item-detail-info">
                          <span className="item-detail-name">{item.name}</span>
                          <span className="item-detail-qty">× {item.quantity}</span>
                          <span className="item-detail-price">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-shipping">
                    <div className="shipping-info">
                      <span className="info-label">📍 Shipping Address</span>
                      <span className="info-value">{order.shippingAddress?.address}</span>
                      <span className="info-value">{order.shippingAddress?.city}</span>
                      <span className="info-value">📞 {order.shippingAddress?.phone}</span>
                    </div>
                    <div className="customer-info">
                      <span className="info-label">👤 Customer</span>
                      <span className="info-value">{order.user}</span>
                      <span className="info-value">📧 {order.shippingAddress?.email}</span>
                    </div>
                  </div>
                </div>

                {/* Order Tracking Timeline */}
                <div className="order-tracking">
                  <h4>📦 Order Status</h4>
                  <div className="order-timeline">
                    <div className={`timeline-item ${order.createdAt ? 'completed' : ''}`}>
                      <span className="timeline-icon">✅</span>
                      <span className="timeline-text">Order Placed</span>
                      {order.createdAt && (
                        <span className="timeline-date">{formatDate(order.createdAt)}</span>
                      )}
                    </div>
                    
                    <div className={`timeline-item ${order.isPaid ? 'completed' : 'pending'}`}>
                      <span className="timeline-icon">{order.isPaid ? '💰' : '⏳'}</span>
                      <span className="timeline-text">Payment Confirmed</span>
                      {order.paidAt && (
                        <span className="timeline-date">{formatDate(order.paidAt)}</span>
                      )}
                      {!order.isPaid && (
                        <span className="timeline-waiting">Waiting for payment...</span>
                      )}
                    </div>
                    
                    <div className={`timeline-item ${order.isDelivered ? 'completed' : 'pending'}`}>
                      <span className="timeline-icon">{order.isDelivered ? '📦' : '🚚'}</span>
                      <span className="timeline-text">{order.isDelivered ? 'Delivered' : 'Processing'}</span>
                      {order.deliveredAt && (
                        <span className="timeline-date">{formatDate(order.deliveredAt)}</span>
                      )}
                      {!order.isDelivered && order.isPaid && (
                        <span className="timeline-waiting">Preparing for delivery...</span>
                      )}
                      {!order.isDelivered && !order.isPaid && (
                        <span className="timeline-waiting">Awaiting payment...</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="order-footer">
                  <span className="payment-method">💳 {order.paymentMethod}</span>
                  <div className="order-actions">
                    <button 
                      className="view-details-btn" 
                      onClick={() => openOrderDetail(order)}
                    >
                      👁️ View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ===== ORDER DETAIL MODAL ===== */}
      {showOrderDetail && selectedOrder && (
        <div className="order-detail-modal-overlay" onClick={closeOrderDetail}>
          <div className="order-detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeOrderDetail}>×</button>
            
            <h2 className="modal-title">📋 Order Details</h2>
            <p className="modal-order-id">Order #{selectedOrder._id}</p>
            
            {/* Order Info Grid */}
            <div className="order-detail-grid">
              {/* Customer Info */}
              <div className="detail-section">
                <h4>👤 Customer</h4>
                <p><strong>Name:</strong> {selectedOrder.user}</p>
                <p><strong>Email:</strong> {selectedOrder.shippingAddress?.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {selectedOrder.shippingAddress?.phone}</p>
              </div>
              
              {/* Shipping Info */}
              <div className="detail-section">
                <h4>📍 Shipping Address</h4>
                <p><strong>Address:</strong> {selectedOrder.shippingAddress?.address}</p>
                <p><strong>City:</strong> {selectedOrder.shippingAddress?.city}</p>
                {selectedOrder.shippingAddress?.specialInstructions && (
                  <p><strong>Instructions:</strong> {selectedOrder.shippingAddress.specialInstructions}</p>
                )}
              </div>
              
              {/* Order Items */}
              <div className="detail-section full-width">
                <h4>📦 Items</h4>
                {selectedOrder.orderItems.map((item, index) => (
                  <div key={index} className="detail-item">
                    <span className="detail-item-name">{item.name}</span>
                    <span className="detail-item-qty">× {item.quantity}</span>
                    <span className="detail-item-price">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="detail-total">
                  <strong>Total:</strong>
                  <span>{formatPrice(selectedOrder.totalPrice)}</span>
                </div>
              </div>
              
              {/* Payment Info */}
              <div className="detail-section">
                <h4>💳 Payment</h4>
                <p><strong>Method:</strong> {selectedOrder.paymentMethod}</p>
                <p><strong>Status:</strong> {selectedOrder.isPaid ? '✅ Paid' : '⏳ Pending'}</p>
                {selectedOrder.paidAt && (
                  <p><strong>Paid At:</strong> {formatDate(selectedOrder.paidAt)}</p>
                )}
              </div>
              
              {/* Delivery Info */}
              <div className="detail-section">
                <h4>📦 Delivery</h4>
                <p><strong>Status:</strong> {selectedOrder.isDelivered ? '✅ Delivered' : '⏳ Pending'}</p>
                {selectedOrder.deliveredAt && (
                  <p><strong>Delivered At:</strong> {formatDate(selectedOrder.deliveredAt)}</p>
                )}
              </div>
            </div>
            
            <button className="close-detail-btn" onClick={closeOrderDetail}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;