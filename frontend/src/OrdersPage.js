// src/OrdersPage.js
import React, { useState, useEffect } from 'react';
import './OrdersPage.css';

const OrdersPage = ({ onBackToShop }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, delivered

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

  const getStatusIcon = (order) => {
    if (order.isDelivered) {
      return '📦';
    } else if (order.isPaid) {
      return '💳';
    } else {
      return '⏳';
    }
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
                          {item.image ? (
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

                <div className="order-footer">
                  <span className="payment-method">💳 {order.paymentMethod}</span>
                  <div className="order-actions">
                    <button className="view-details-btn">View Details</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;