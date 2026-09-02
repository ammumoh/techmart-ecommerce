// src/Review.js
import React, { useState, useEffect } from 'react';
import './Review.css';

const Review = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(0);
  const [name, setName] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Load reviews from localStorage
    const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const productReviews = allReviews.filter(r => r.productId === productId);
    setReviews(productReviews);
  }, [productId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    
    const newReview = {
      productId,
      name: name || 'Anonymous',
      rating,
      comment,
      date: new Date().toISOString()
    };
    
    // Save to localStorage
    const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    allReviews.push(newReview);
    localStorage.setItem('reviews', JSON.stringify(allReviews));
    
    setReviews([...reviews, newReview]);
    setRating(0);
    setComment('');
    setName('');
    setShowForm(false);
    alert('✅ Review added successfully!');
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="review-container">
      <div className="review-header">
        <div className="rating-summary">
          <span className="average-rating">{getAverageRating()}</span>
          <span className="stars-display">{renderStars(Math.round(getAverageRating()))}</span>
          <span className="review-count">({reviews.length} reviews)</span>
        </div>
        <button 
          className="write-review-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✖ Cancel' : '✏️ Write Review'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="review-form">
          <div className="star-rating">
            <label>Your Rating:</label>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star ${star <= (hover || rating) ? 'active' : ''}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                ★
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="review-input"
          />
          <textarea
            placeholder="Share your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="review-textarea"
            required
          />
          <button type="submit" className="submit-review-btn">
            📝 Submit Review
          </button>
        </form>
      )}

      <div className="reviews-list">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="review-item">
              <div className="reviewer-info">
                <strong>{review.name}</strong>
                <span className="review-stars">{'★'.repeat(review.rating)}</span>
                <span className="review-date">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="no-reviews">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
};

export default Review;