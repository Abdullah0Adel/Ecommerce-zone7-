import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import './RelatedProducts.css';
import BASE_URL from '../../Data/BASE_URL';

export default function RelatedProducts({ 
  categoryName, 
  currentProductId, 
  currentProductDocumentId 
}) {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quickAddLoading, setQuickAddLoading] = useState({});

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [containerRef, isInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!categoryName) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        

        const relatedUrl = `${BASE_URL}/api/products`;
        
        const response = await axios.get(relatedUrl, {
          params: {
            populate: ['image', 'categories', 'sizes'],
            'pagination[pageSize]': 20, // Get more products to filter from
          }
        });

        if (!response.data?.data) {
          throw new Error('Invalid response format');
        }

        // Filter products by category and exclude current product
        let filteredProducts = response.data.data.filter(product => {
          // Check if product has categories and matches the current category
          const hasMatchingCategory = product.categories?.some(cat => 
            cat.category_name?.toLowerCase().trim() === categoryName.toLowerCase().trim()
          );
          
          // Exclude current product using both id and documentId for safety
          const isCurrentProduct = 
            product.id === currentProductId || 
            product.documentId === currentProductDocumentId;
          
          // Ensure product has either documentId or id for navigation
          const hasValidId = product.documentId || product.id;
          
          return hasMatchingCategory && !isCurrentProduct && hasValidId;
        });

        // Shuffle and limit to 8 products for better variety
        filteredProducts = shuffleArray(filteredProducts).slice(0, 8);
        
        setRelatedProducts(filteredProducts);

      } catch (err) {
        console.error('Error fetching related products:', err);
        setError('Unable to load related products at the moment');
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [categoryName, currentProductDocumentId, currentProductId]);

  // Utility function to shuffle array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async (product, e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();

    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
      } else {
        const wishlistItem = {
          id: product.id,
          product_documentId: product.documentId,
          name: product.product_name,
          price: product.product_price,
          rating: product.product_rating,
          imageId: product.image?.[0]?.id || null,
          imageUrl: product.image?.[0]?.url 
            ? `${product.image[0].url}` 
            //modified
            : '',
        };
        await addToWishlist(wishlistItem);
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      toast.error('Failed to update wishlist');
    }
  };

  // Quick add to cart functionality
  const handleQuickAddToCart = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if product has sizes
    if (product.sizes && product.sizes.length > 0) {
      toast.info('Please select a size on the product page');
      return;
    }

    setQuickAddLoading(prev => ({ ...prev, [product.id]: true }));

    try {
      const finalPrice = product.hasDiscount
        ? product.product_price - (product.product_price * product.discount_value) / 100
        : product.product_price;

      const cartItem = {
        product_id: product.id,
        product_name: product.product_name,
        price: finalPrice,
        quantity: 1,
        size: '',
        imageId: product.image?.[0]?.id || null,
        imageUrl: product.image?.[0]?.url 
          ? `${product.image[0].url}` 
          //modified
          : '',
        maxStock: 999, // Default stock for products without sizes
      };

      await addToCart(cartItem);
      toast.success(`${product.product_name} added to cart!`);
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setQuickAddLoading(prev => ({ ...prev, [product.id]: false }));
    }
  };

  // Calculate discounted price
  const getDiscountedPrice = (product) => {
    if (!product.hasDiscount) return product.product_price;
    return (product.product_price - (product.product_price * product.discount_value) / 100).toFixed(2);
  };

  // Generate product link - prefer documentId, fallback to id
  const getProductLink = (product) => {
    return `/products/${product.documentId || product.id}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="related-products  my-5">
        <h3 className="mb-4">Related Products</h3>
        <div className="row">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <div className="card h-100">
                <div className="card-img-top bg-light" style={{ height: '200px' }}>
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <div className="spinner-border text-secondary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="placeholder-glow">
                    <span className="placeholder col-8"></span>
                    <span className="placeholder col-6"></span>
                    <span className="placeholder col-4"></span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="related-products  my-5">
        <h3 className="mb-4">Related Products</h3>
        <div className="alert alert-warning d-flex align-items-center">
          <Icon icon="mdi:alert-circle-outline" className="me-2" width="24" height="24" />
          {error}
        </div>
      </div>
    );
  }

  // No products found
  if (!relatedProducts.length) {
    return (
      <div className="related-products  my-5">
        <h3 className="mb-4">Related Products</h3>
        <div className="text-center py-5">
          <Icon icon="mdi:package-variant" width="64" height="64" className="text-muted mb-3" />
          <p className="text-muted">No related products found in this category.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="related-products  my-5  py-4" ref={containerRef}>
      <div className="d-flex flex-column justify-content-between  align-items-center mb-4">
        <h3 className="mb-0">You Might Also Like</h3>
        <small className="text-muted">{relatedProducts.length} products found</small>
      </div>

      <motion.div
            initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 1.2 }}
      >
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        pagination={{ 
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          576: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        className="related-products-slider position-relative py-4 px-5 mx-1"
      >
        {relatedProducts.map((product) => (
          <SwiperSlide key={`${product.id}-${product.documentId}`}>
            <div className="product-card h-100 position-relative">
              <Link 
                to={getProductLink(product)}
                className="text-decoration-none text-dark"
                title={`View ${product.product_name}`}
              >
                <div className="card h-100 border-0 shadow-sm hover-shadow-lg transition-all">
                  {/* Product Image */}
                  <div className="position-relative overflow-hidden">
                    {product.image && product.image.length > 0 ? (
                      <img
                        src={`${product.image[0].url}`}
                        //modified
                        alt={product.product_name}
                        className="card-img-top"
                        style={{ 
                          height: '250px', 
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                        loading="lazy"
                      />
                    ) : (
                      <div 
                        className="card-img-top bg-light d-flex align-items-center justify-content-center"
                        style={{ height: '250px' }}
                      >
                        <Icon icon="mdi:image-off" width="48" height="48" className="text-muted" />
                      </div>
                    )}

                    {/* Discount Badge */}
                    {product.hasDiscount && (
                      <span className="position-absolute top-0 start-0 badge bg-danger m-2">
                        -{product.discount_value}%
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                      className="related-wishlist-btn position-absolute top-0 end-0 m-2 rounded-circle p-2"
                      onClick={(e) => handleWishlistToggle(product, e)}
                      title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Icon 
                        icon={isInWishlist(product.id) ? "mdi:heart" : "mdi:heart-outline"}
                        width="25" 
                        height="25"
                        className={isInWishlist(product.id) ? "text-danger" : "text-muted"}
                      />
                    </button>

                    {/* Quick Add Button - Only for products without sizes */}
                    {(!product.sizes || product.sizes.length === 0) && (
                      <button
                        className="btn btn-dark position-absolute bottom-0 start-50 translate-middle-x mb-2 opacity-0 quick-add-btn"
                        onClick={(e) => handleQuickAddToCart(product, e)}
                        disabled={quickAddLoading[product.id]}
                        style={{ 
                          transition: 'opacity 0.3s ease',
                          fontSize: '0.8rem',
                          padding: '0.4rem 0.8rem'
                        }}
                        title="Quick add to cart"
                      >
                        {quickAddLoading[product.id] ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                            Adding...
                          </>
                        ) : (
                          <>
                            <Icon icon="mdi:cart-plus" className="me-1" />
                            Quick Add
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title mb-2 text-truncate" title={product.product_name}>
                      {product.product_name}
                    </h6>
                    
                    {/* Price */}
                    <div className="mb-2">
                      {product.hasDiscount ? (
                        <div className="d-flex align-items-center">
                          <span className="text-muted text-decoration-line-through me-2 small">
                            EGP {product.product_price}
                          </span>
                          <span className="text-success fw-bold">
                            EGP {getDiscountedPrice(product)}
                          </span>
                        </div>
                      ) : (
                        <span className="fw-bold">EGP {product.product_price}</span>
                      )}
                    </div>
                    
                    {/* Rating */}
                    <div className="d-flex align-items-center mt-auto">
                      <div className="d-flex me-2">
                        {[...Array(5)].map((_, i) => (
                          <Icon
                            key={i}
                            icon={i < Math.floor(product.product_rating || 0) ? "mdi:star" : "mdi:star-outline"}
                            className="text-warning"
                            width="16"
                            height="16"
                          />
                        ))}
                      </div>
                      <small className="text-muted">
                        ({product.product_rating || "No rating"})
                      </small>
                    </div>

                    {/* Sizes indicator */}
                    {product.sizes && product.sizes.length > 0 && (
                      <small className="text-muted mt-1">
                        <Icon icon="mdi:resize" className="me-1" />
                        {product.sizes.length} size{product.sizes.length > 1 ? 's' : ''} available
                      </small>
                    )}

                    {/* Stock status for products without sizes */}
                    {(!product.sizes || product.sizes.length === 0) && (
                      <small className="text-success mt-1">
                        <Icon icon="mdi:check-circle" className="me-1" />
                        In Stock
                      </small>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation Buttons */}
        <div className="swiper-button-prev-custom position-absolute top-50 start-0 translate-middle-y bg-white shadow rounded-circle d-flex align-items-center justify-content-center" 
             style={{ width: '40px', height: '40px', zIndex: 10, cursor: 'pointer' }}>
          <Icon icon="mdi:chevron-left" width="24" height="24" />
        </div>
        <div className="swiper-button-next-custom position-absolute top-50 end-0 translate-middle-y bg-white shadow rounded-circle d-flex align-items-center justify-content-center" 
             style={{ width: '40px', height: '40px', zIndex: 10, cursor: 'pointer' }}>
          <Icon icon="mdi:chevron-right" width="24" height="24" />
        </div>
      </Swiper>
      </motion.div>


    </div>
  );
}