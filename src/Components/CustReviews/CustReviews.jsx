import React from 'react';
import styles from './CustReviews.module.css';

const CustReviews = ({productId, review}) => {

  return (
    <div className='container'>
      <div className='d-flex align-items-center gap-3 mb-2'>
        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white" style={{ width: '40px', height: '40px', minWidth: '40px' }}>
          {review.users_permissions_user?.username?.charAt(0) || 'U'}
        </div>
        <h6> {review.users_permissions_user?.username} </h6>
      </div>
        <p>
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < (review.customer_rating || review.rating) ? 'text-warning' : 'text-muted'}>★</span>
          ))}
        </p>
        <p>{review.comment}</p>
    </div>
  );
};

export default CustReviews;