import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { Icon } from '@iconify/react/dist/iconify.js';
import './WishlistPage.css';

export default function WishlistPage() {
  const [deletingItems, setDeletingItems] = useState({});

  const {
    wishlistItems,
    loading,
    removeFromWishlist,
    clearWishlist,
    isInWishlist
  } = useWishlist();



  // Handle removing a product from wishlist
  const handleRemoveFromWishlist = async (productId) => {
    setDeletingItems(prev => ({ ...prev, [productId]: true }));
    await removeFromWishlist(productId);
    setDeletingItems(prev => ({ ...prev, [productId]: false }));
  };

  // Handle confirm clear all items
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [clearingAll, setClearingAll] = useState(false);

  const handleClearWishlist = async () => {
    setClearingAll(true);
    await clearWishlist();
    setClearingAll(false);
    setShowConfirmClear(false);
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border" role="status"></div>
        <p className="mt-2">Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-5">
      <h2 className="text-center mb-4">My Wishlist</h2>
      
      {wishlistItems.length === 0 ? (
        <div className="text-center empty-wishlist py-5">
          <Icon icon="mdi:heart-off-outline" width={64} height={64} className="mb-3 text-muted" />
          <h3>Your wishlist is empty</h3>
          <p className="text-muted">Add items you love to your wishlist. Review them anytime and easily move them to the cart.</p>
          <Link to="/shop" className="btn continue-shooping mt-3">Continue Shopping</Link>
        </div>
      ) : (
        <>
          <div className="text-end mb-3">
            {!showConfirmClear ? (
              <button 
                className="btn btn-outline-danger clear-wishlist-btn btn-sm"
                onClick={() => setShowConfirmClear(true)}
              >
                <Icon icon="mdi:trash-can-outline" className="me-1" /> Clear Wishlist
              </button>
            ) : (
              <div className="alert alert-warning p-2 d-inline-flex align-items-center">
                <span>Are you sure?</span>
                <button 
                  className="btn btn-sm btn-danger clear-all-btn ms-2" 
                  onClick={handleClearWishlist}
                  disabled={clearingAll}
                >
                  {clearingAll ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    <>Yes, clear all</>
                  )}
                </button>
                <button 
                  className="btn btn-sm btn-secondary cancle-clear-all-btn ms-2" 
                  onClick={() => setShowConfirmClear(false)}
                  disabled={clearingAll}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          
          <div className="row">
            {wishlistItems.map((product) => {
              // Calculate final price if there's a discount
              const finalPrice = product.hasDiscount 
                ? product.product_price - (product.product_price * product.discountValue) / 100
                : product.product_price;
                
              return (
                <div key={product.wishlistItemId} className="col-12 col-md-6 col-lg-4 mb-4">
                  <div className="card wishlist-item h-100 border-0 position-relative overflow-hidden">
                    <div className="position-absolute top-0 end-0 p-2">
                      <button 
                        className="btn btn-sm btn-light rounded-circle"
                        onClick={() => handleRemoveFromWishlist(product.id)}
                        disabled={deletingItems[product.id]}
                      >
                        {deletingItems[product.id] ? (
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                          <Icon icon="mdi:close" />
                        )}
                      </button>
                    </div>
                    {/* /////////////////////////////////////////////////////////// */}
                    <Link to={`/products/${product.product_documentId}`} className="text-decoration-none">
                      <div className="rounded-3 position-relative overflow-hidden">
                        {product.hasDiscount && (
                          <p className="d-flex justify-content-center align-items-center rounded-circle discount text-light">
                            -{product.discountValue}%
                          </p>
                        )}
                        <img
                          src={`http://localhost:1337${product.image}`}
                          className="card-img-top img-hover-effect"
                          alt={product.name}
                          onError={(e) => {
                            e.target.src = '/images/placeholder.png'; // Fallback image if product image fails to load
                          }}
                        />
                      </div>
                    </Link>
                    
                    <div className="card-body d-flex flex-column">
                      <Link 
                        to={`/products/${product.product_documentId}`}
                        className="text-decoration-none text-black"
                      >
                        <h5 className="card-title">{product.name}</h5>
                      </Link>
                      
                      {/* Rating display */}
                      {product.rating && (
                        <div className="product-rating mb-2">
                          <div className="d-flex align-items-center">
                            <div className="rating-stars me-1">
                              {Array(5).fill().map((_, i) => (
                                <Icon 
                                  key={i} 
                                  icon={i < Math.floor(product.rating) ? "mdi:star" : "mdi:star-outline"} 
                                  className="text-warning"
                                />
                              ))}
                            </div>
                            <small>({product.rating})</small>
                          </div>
                        </div>
                      )}
              
                      


                      <div className="mt-auto">
                        <div className="d-grid gap-2">
                          <div className="d-flex gap-2">
                            <Link 
                              to={`/products/${product.product_documentId}`}
                              className="  view-details btn flex-grow-1"
                            >
                              View Details
                            </Link>
                          </div>
                          <button 
                            className="btn btn-outline-danger delete-btn"
                            onClick={() => handleRemoveFromWishlist(product.id)}
                            disabled={deletingItems[product.id]}
                          >
                            {deletingItems[product.id] ? (
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            ) : (
                              <Icon icon="mdi:trash-can-outline" className="me-2" />
                            )}
                            Remove from Wishlist
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}