// src/Wishlist.js
import React, { useState, useEffect } from 'react';
import './Wishlist.css';

const Wishlist = ({ onBackToShop }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(saved);
  }, []);

  const removeFromWishlist = (productId) => {
    const updated = wishlist.filter(item => item.id !== productId);
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  const formatPrice = (price) => `KSh ${price.toLocaleString()}`;

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <button className="back-btn" onClick={onBackToShop}>
          ← Back to Shop
        </button>
        <h1>❤️ My Wishlist</h1>
      </div>

      {wishlist.length === 0 ? (
        <div className="empty-wishlist">
          <span className="empty-icon">🛒</span>
          <h3>Your wishlist is empty</h3>
          <p>Start adding items you love!</p>
          <button className="shop-btn" onClick={onBackToShop}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map(item => (
            <div key={item.id} className="wishlist-card">
              <div className="wishlist-image">
                <span className="item-emoji">{item.image}</span>
              </div>
              <div className="wishlist-info">
                <h3>{item.name}</h3>
                <p className="wishlist-price">{formatPrice(item.price)}</p>
                <p className="wishlist-category">{item.category}</p>
                <button 
                  className="remove-btn"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  ❌ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;