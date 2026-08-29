// src/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = ({ onBackToShop }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Fetch all orders from backend
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
      console.log('📦 Admin - Orders fetched:', data);
      setOrders(data);
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update order status to Paid
  const markAsPaid = async (orderId) => {
    setUpdating(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/orders/${orderId}/pay`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      const updatedOrder = await response.json();
      console.log('✅ Order marked as paid:', updatedOrder);
      
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId ? updatedOrder : order
      ));
      
      alert('✅ Order marked as Paid successfully!');
    } catch (error) {
      console.error('❌ Error updating order:', error);
      alert('❌ Failed to update order. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  // Update order status to Delivered
  const markAsDelivered = async (orderId) => {
    setUpdating(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/orders/${orderId}/deliver`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      const updatedOrder = await response.json();
      console.log('✅ Order marked as delivered:', updatedOrder);
      
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId ? updatedOrder : order
      ));
      
      alert('✅ Order marked as Delivered successfully!');
    } catch (error) {
      console.error('❌ Error updating order:', error);
      alert('❌ Failed to update order. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  // Delete order
  const deleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    setUpdating(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete order');
      }

      console.log('🗑️ Order deleted:', orderId);
      
      // Update local state
      setOrders(orders.filter(order => order._id !== orderId));
      
      alert('🗑️ Order deleted successfully!');
      setShowOrderDetail(false);
    } catch (error) {
      console.error('❌ Error deleting order:', error);
      alert('❌ Failed to delete order. Please try again.');
    } finally {
      setUpdating(false);
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
      return <span className="admin-badge delivered">✅ Delivered</span>;
    } else if (order.isPaid) {
      return <span className="admin-badge paid">💰 Paid</span>;
    } else {
      return <span className="admin-badge pending">⏳ Pending</span>;
    }
  };

  const getStatusActions = (order) => {
    if (order.isDelivered) {
      return <span className="status-complete">Complete</span>;
    } else if (order.isPaid) {
      return (
        <button 
          className="action-btn deliver-btn"
          onClick={() => markAsDelivered(order._id)}
          disabled={updating}
        >
          📦 Mark Delivered
        </button>
      );
    } else {
      return (
        <div className="action-buttons">
          <button 
            className="action-btn pay-btn"
            onClick={() => markAsPaid(order._id)}
            disabled={updating}
          >
            💰 Mark Paid
          </button>
          <button 
            className="action-btn deliver-btn"
            onClick={() => markAsDelivered(order._id)}
            disabled={updating}
          >
            📦 Mark Delivered
          </button>
        </div>
      );
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (filter === 'pending') return !order.isPaid && !order.isDelivered;
    if (filter === 'paid') return order.isPaid && !order.isDelivered;
    if (filter === 'delivered') return order.isDelivered;
    return true;
  });

  // Count orders by status
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => !o.isPaid && !o.isDelivered).length;
  const paidOrders = orders.filter(o => o.isPaid && !o.isDelivered).length;
  const deliveredOrders = orders.filter(o => o.isDelivered).length;

  // Calculate total revenue
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  return (
    <div className="admin-container">
      <div className="admin-header">
        <button className="back-btn" onClick={onBackToShop}>
          ← Back to Shop
        </button>
        <h1>🛠️ Admin Dashboard</h1>
        <button className="refresh-btn" onClick={fetchOrders}>
          🔄 Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats">
        <div className="admin-stat-card total">
          <span className="stat-icon">📦</span>
          <div className="stat-info">
            <span className="stat-number">{totalOrders}</span>
            <span className="stat-label">Total Orders</span>
          </div>
        </div>
        <div className="admin-stat-card pending">
          <span className="stat-icon">⏳</span>
          <div className="stat-info">
            <span className="stat-number">{pendingOrders}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
        <div className="admin-stat-card paid">
          <span className="stat-icon">💰</span>
          <div className="stat-info">
            <span className="stat-number">{paidOrders}</span>
            <span className="stat-label">Paid</span>
          </div>
        </div>
        <div className="admin-stat-card delivered">
          <span className="stat-icon">✅</span>
          <div className="stat-info">
            <span className="stat-number">{deliveredOrders}</span>
            <span className="stat-label">Delivered</span>
          </div>
        </div>
        <div className="admin-stat-card revenue">
          <span className="stat-icon">💵</span>
          <div className="stat-info">
            <span className="stat-number">{formatPrice(totalRevenue)}</span>
            <span className="stat-label">Total Revenue</span>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="admin-filter">
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
          className={`filter-btn ${filter === 'paid' ? 'active' : ''}`}
          onClick={() => setFilter('paid')}
        >
          💰 Paid
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
          <p>Loading orders...</p>
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

      {/* Orders Table */}
      {!isLoading && !error && (
        <div className="admin-table-container">
          {filteredOrders.length === 0 ? (
            <div className="empty-orders">
              <span className="empty-icon">📭</span>
              <h3>No orders found</h3>
              <p>There are no orders matching your filter.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="order-id-cell">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td>{order.user}</td>
                    <td>{order.orderItems.length}</td>
                    <td className="price-cell">{formatPrice(order.totalPrice)}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{getStatusBadge(order)}</td>
                    <td>
                      <div className="action-cell">
                        {getStatusActions(order)}
                        <button 
                          className="action-btn view-btn"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderDetail(true);
                          }}
                        >
                          👁️ View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Order Detail Modal */}
      {showOrderDetail && selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setShowOrderDetail(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setShowOrderDetail(false)}>
              ×
            </button>
            
            <h2>Order Details</h2>
            <p className="order-detail-id">Order #{selectedOrder._id}</p>
            
            <div className="order-detail-grid">
              <div className="detail-section">
                <h3>👤 Customer</h3>
                <p><strong>Name:</strong> {selectedOrder.user}</p>
                <p><strong>Email:</strong> {selectedOrder.shippingAddress?.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {selectedOrder.shippingAddress?.phone}</p>
              </div>
              
              <div className="detail-section">
                <h3>📍 Shipping</h3>
                <p><strong>Address:</strong> {selectedOrder.shippingAddress?.address}</p>
                <p><strong>City:</strong> {selectedOrder.shippingAddress?.city}</p>
                {selectedOrder.shippingAddress?.specialInstructions && (
                  <p><strong>Instructions:</strong> {selectedOrder.shippingAddress.specialInstructions}</p>
                )}
              </div>
              
              <div className="detail-section full-width">
                <h3>📦 Items</h3>
                {selectedOrder.orderItems.map((item, index) => (
                  <div key={index} className="detail-item">
                    <span>{item.name}</span>
                    <span>× {item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="detail-total">
                  <strong>Total:</strong>
                  <span>{formatPrice(selectedOrder.totalPrice)}</span>
                </div>
              </div>
              
              <div className="detail-section">
                <h3>💳 Payment</h3>
                <p><strong>Method:</strong> {selectedOrder.paymentMethod}</p>
                <p><strong>Status:</strong> {selectedOrder.isPaid ? '✅ Paid' : '⏳ Pending'}</p>
                {selectedOrder.paidAt && (
                  <p><strong>Paid At:</strong> {formatDate(selectedOrder.paidAt)}</p>
                )}
              </div>
              
              <div className="detail-section">
                <h3>📦 Delivery</h3>
                <p><strong>Status:</strong> {selectedOrder.isDelivered ? '✅ Delivered' : '⏳ Pending'}</p>
                {selectedOrder.deliveredAt && (
                  <p><strong>Delivered At:</strong> {formatDate(selectedOrder.deliveredAt)}</p>
                )}
              </div>
            </div>

            <div className="admin-modal-actions">
              {!selectedOrder.isPaid && (
                <button 
                  className="action-btn pay-btn"
                  onClick={() => {
                    markAsPaid(selectedOrder._id);
                    setShowOrderDetail(false);
                  }}
                  disabled={updating}
                >
                  💰 Mark Paid
                </button>
              )}
              {!selectedOrder.isDelivered && (
                <button 
                  className="action-btn deliver-btn"
                  onClick={() => {
                    markAsDelivered(selectedOrder._id);
                    setShowOrderDetail(false);
                  }}
                  disabled={updating}
                >
                  📦 Mark Delivered
                </button>
              )}
              <button 
                className="action-btn delete-btn"
                onClick={() => {
                  deleteOrder(selectedOrder._id);
                  setShowOrderDetail(false);
                }}
                disabled={updating}
              >
                🗑️ Delete Order
              </button>
              <button 
                className="action-btn close-btn"
                onClick={() => setShowOrderDetail(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;