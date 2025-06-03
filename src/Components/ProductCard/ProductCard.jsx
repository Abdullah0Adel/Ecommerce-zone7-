import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext'; // Import wishlist context
import { toast } from 'react-toastify';
import './ProductCard.css';
import { Icon } from '@iconify/react/dist/iconify.js';
import QuickView from '../QuickView/QuickView';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';


export default function ProductCard({id,funId, img, category, thumbnail, productName, rating, productPrice, hasDiscount, discountValue, sizes}) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist(); // Use wishlist context
  const [isLoading, setIsLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isQuickViewOpen, setQuickViewOpen] = useState(false);
    const [containerRef, isInView] = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });

  const finalPrice = hasDiscount
    ? productPrice - (productPrice * discountValue) / 100
    : productPrice;
    
  // Quick add to cart with default size (if available)
  const handleQuickAddToCart = () => {
  // if (!selectedSize[0] || selectedSize[0].stock <= 0) {
  //   toast.error("Please select an available size");
  //   return;
  // }
  const finalPrice = hasDiscount
    ? productPrice - (productPrice * discountValue) / 100
    : productPrice;

  // Get the image ID instead of the URL path
  const imageId = img && img.length > 0 
    ? img[0].id  // Use the image ID rather than the URL
    : null;

  const cartItem = {
    product_id: id,
    product_name: productName,
    price: finalPrice,
    quantity: quantity,
    size: selectedSize[0].size,
    // Instead of storing the URL, store the image ID for API calls
    imageId: imageId,
    // Keep a display URL for local use
    imageUrl: product.image && product.image.length > 0 
      ? `http://localhost:1337${product.image[0].url}` 
      : '',
    maxStock: selectedSize.stock,
  };

  addToCart(cartItem);

  toast.success(`Added ${product_name} to cart!`);
  };

  // Toggle wishlist functionality
const handleWishlistToggle = async () => {
  setWishlistLoading(true);
  
  const productInWishlist = isInWishlist(funId);
  
  try {
    if (productInWishlist) {
      await removeFromWishlist(funId);
    } else {
            // Prepare image object correctly
      const imageUrl = img && img.length > 0 
        ? img[0].url 
        : '';
        
      const imageId = img && img.length > 0 
        ? img[0].id
        : null;
      // Create wishlist item matching the format expected by WishlistContext
      const wishlistItem = {
        id: funId,
        product_id: funId,
        product_documentId: id,
        product_name: productName,
        name: productName,
        price: finalPrice,
        rating: rating,
        // Handle image safely - create an array with a single object containing url
        imageId: imageId,
        imageUrl: img && img.length > 0 
          ? `http://localhost:1337${img[0].url}` 
          : '',
      };
      
      await addToWishlist(wishlistItem);
    }
  } catch (error) {
    console.error('Error toggling wishlist status:', error);
    toast.error('Failed to update wishlist');
  } finally {
    setWishlistLoading(false);
  }
};


  return (
    <div className="col-6 col-md-4 col-lg-4 mb-4">
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="card h-100 border-0 position-relative overflow-hidden">
        <div className="rounded-3 position-relative overflow-hidden">
          {hasDiscount && (
            <p className="d-flex justify-content-center align-items-center rounded-circle discount text-light">-{discountValue}%</p>
          )}

          <img
            src={`http://localhost:1337${thumbnail}`}
            className="card-img-top h-100 img-hover-effect"
            alt={productName}
          />

          <div className="overlay-buttons d-flex justify-content-center align-items-end gap-5 position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-25 opacity-0 transition-opacity">

            <button 
              className="wishlist-btn btn-sm mb-2"
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
            >
                    {wishlistLoading ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : isInWishlist(funId) ? (
                      <Icon icon="line-md:heart-filled" width="24" height="24" style={{ color: '#e91e63' }} />
                    ) : (
                      <Icon icon="line-md:heart" width="24" height="24" />
                    )}
            </button>
          </div>
        </div>

        <div className="card-body d-flex flex-column align-items-center">
          <Link
            to={`/products/${id}`}
            onMouseEnter={(e) => (e.target.style.color = '#006158')}
            onMouseLeave={(e) => (e.target.style.color = 'black')}
            className="link-product text-decoration-none text-black"
          >
            <h5 className="card-title text-center">{productName}</h5>
          </Link>

          {/* Rating display */}
          <div className="product-rating mb-2">
              <div className="d-flex align-items-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    icon={i < Math.floor(rating) ? "mdi:star" : "mdi:star-outline"}
                    className="text-warning me-1"
                  />
                ))}
                <span>({rating})</span>
              </div>
          </div>

          {hasDiscount ? (
            <div className='d-flex gap-2'>
              <p style={{ textDecoration: 'line-through', color: 'gray' }}>
                EGP {productPrice}
              </p>
              <p style={{ color: 'green', fontWeight: 'bold' }}>
                EGP {finalPrice.toFixed(2)}
              </p>
            </div>
          ) : (
            <p className="text-black fw-bold">EGP {productPrice}</p>
          )}
          
          <button onClick={() => setQuickViewOpen(true)} className="quick-view-btn d-flex align-items-center gap-1">
            <Icon icon="mdi:eye-outline" className="quick-view" />
            <p className='quick-view mb-0'>Quick View</p>
          </button>
          {isQuickViewOpen && (
            <>
            <div className="container"></div>
            <QuickView productId={id} onClose={() => setQuickViewOpen(false)} />
            </>
          )}
        </div>
      </div>
      </motion.div>
    </div>
  );
}