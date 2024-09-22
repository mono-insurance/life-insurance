import React from 'react';
import { FaStar } from 'react-icons/fa';

export const StarRating = ({ rating, onRatingChange }) => {
  return (
    <div className="form-label">
      <div className="star-rating">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1; // Value for the star (1, 2, 3, etc.)
          return (
            <label key={index}>
              <input
                type="radio"
                name="rating"
                value={ratingValue}
                onClick={() => onRatingChange(ratingValue)}
                style={{ display: 'none' }} // Hide the actual radio button
              />
              <FaStar
                className="star"
                color={ratingValue <= rating ? "#475be8" : "#e4e5e9"} // Yellow if selected, gray otherwise
                size={60} // Star size
                style={{ cursor: 'pointer', marginRight: '5px' }}
                onMouseEnter={() => onRatingChange(ratingValue)} // Optional: Hover to preview
                onMouseLeave={() => onRatingChange(rating)}
              />
            </label>
          );
        })}
      </div>
    </div>
  );
};
