import React from 'react';
import styles from './CustReviews.module.css';

const CustReviews = () => {
  const ratings = [
    { stars: 5, count: 0 },
    { stars: 4, count: 0 },
    { stars: 3, count: 0 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 }
  ];

  const renderStars = (rating, filled = false) => {
    return [...Array(5)].map((_, index) => (
      <span 
        key={index} 
        className={`${styles.star} ${filled ? styles.filledStar : styles.emptyStar}`}
      >
        {index < rating ? '★' : '☆'}
      </span>
    ));
  };

  return (
    <div className={styles.container}>
      <div className={styles.reviewsSection}>
        <h2 className={styles.title}>CUSTOMER REVIEWS</h2>
        
        {/* Overall Rating Display */}
        <div className={styles.overallRating}>
          <div className={styles.starsContainer}>
            {renderStars(0)}
          </div>
          <p className={styles.noReviewsText}>Be the first to write a review</p>
        </div>

        {/* Rating Breakdown */}
        <div className={styles.ratingBreakdown}>
          {ratings.map((rating) => (
            <div key={rating.stars} className={styles.ratingRow}>
              <div className={styles.ratingStars}>
                {renderStars(rating.stars, true)}
              </div>
              <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ width: `${rating.count}%` }}
                  />
                </div>
              </div>
              <div className={styles.ratingCount}>
                {rating.count}
              </div>
            </div>
          ))}
        </div>

        {/* Write Review Button */}
        <div className={styles.buttonContainer}>
          <button className={styles.writeReviewBtn}>
            WRITE A REVIEW
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustReviews;