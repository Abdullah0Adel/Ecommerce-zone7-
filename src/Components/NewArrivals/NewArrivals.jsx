import React, { useEffect, useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import styles from './NewArrivals.module.css';
// import required modules
import { FreeMode, Pagination } from 'swiper/modules';
import axios from 'axios';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { useWishlist } from '../../context/WishlistContext';
import QuickView from '../QuickView/QuickView';
export default function NewArrivals() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [containerRef, isInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [selectedProductId, setSelectedProductId] = useState(null);




  useEffect(() => {
    const fetchProduct = async() => {
      try{
        setLoading(true);
        const url = `http://localhost:1337/api/products`;
        const response = await axios.get(url, {
          params: {
            populate: "*"
          }
        });
        
        const newProduct = response.data.data.filter(product =>
          product.isNew === true
        );
        setLoading(false);
        setProducts(newProduct);
        console.log("New Products:", newProduct);
      } catch (err){
        console.log(err)
        setLoading(true);
      }     
    }

    fetchProduct();
  }, [])
  console.log('isInView:', isInView);


  const openQuickView = (productId) => {
    setSelectedProductId(productId);
  }

  const closeQuickView = () => {
    setSelectedProductId(null);
  }



    const handleWishlistToggle = async (product, event) => {
    // Prevent event bubbling and default behavior
    event.preventDefault();
    event.stopPropagation();
    
    // Prevent double clicks
    if (wishlistLoading[product.id]) {
      return;
    }
    
    setWishlistLoading(prev => ({ ...prev, [product.id]: true }));
    
    const productInWishlist = isInWishlist(product.id);
    
    try {
      if (productInWishlist) {
        await removeFromWishlist(product.id);
      } else {
        // Calculate final price for this specific product
        const finalPrice = product.hasDiscount
          ? product.product_price - (product.product_price * product.discount_value) / 100
          : product.product_price;

        // Prepare image object correctly
        const imageUrl = product.image && product.image.length > 0 
          ? product.image[0].url 
          : '';
          
        const imageId = product.image && product.image.length > 0 
          ? product.image[0].id
          : null;

        // Create wishlist item matching the format expected by WishlistContext
        const wishlistItem = {
          id: product.id, // Add this for consistency
          product_id: product.id,
          product_documentId: product.documentId,
          product_name: product.product_name,
          name: product.product_name,
          price: finalPrice,
          rating: product.product_rating || product.rating,
          imageId: imageId,
          imageUrl: product.image && product.image.length > 0 
            ? `http://localhost:1337${product.image[0].url}` 
            : '',
        };
        
        await addToWishlist(wishlistItem);
      }
    } catch (error) {
      console.error('Error toggling wishlist status:', error);
      toast.error('Failed to update wishlist');
    } finally {
      setWishlistLoading(prev => ({ ...prev, [product.id]: false }));
    }
  };



  if (loading) {
    return <div className='text-center fw-bold'>!NO NEW PRODUCTS FOR NOW :(</div>
  }

  return (
    <>
<div className="container-fluid">
  <div ref={containerRef}>
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 1.2 }}
      className={`${styles.newArrivalsCard} shadow-sm p-4`}
    >
      <h1 className={`mb-5 text-center fw-light`}>
        <span className={styles.newArrivalsTitle}>New Arrivals</span>
      </h1>

      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        freeMode={true}
        pagination={{ clickable: true }}
        modules={[FreeMode, Pagination]}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className={`mySwiper ${styles.newArrivalsSwiper}`}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} id={product.documentId} className='mb-4'>
            <div className={`${styles.productCard} card h-100 border-0 position-relative overflow-hidden`}>
              <div className="rounded-3 position-relative overflow-hidden">
                {product.hasDiscount && (
                  <p className={`${styles.discountBadge} bg-danger d-flex justify-content-center align-items-center rounded-circle text-light`}>
                    -{product.discount_value}%
                  </p>
                )}
                <div className={styles.imageWrapper}>
                  {product.hasDiscount && (
                    <p className="d-flex justify-content-center align-items-center rounded-circle discount text-light">
                      -{product.discount_value}%
                    </p>
                  )}
                  <img
                    src={`http://localhost:1337${product.thumbnail?.url}`}
                    className={styles.productImage}
                    alt={product.product_name}
                  />
                
                  <div className={styles.overlay}>
                    <button 
                      className={styles.wishlistBtn}
                      onClick={(event) => handleWishlistToggle(product, event)}
                      disabled={wishlistLoading[product.id]}
                      type="button"
                    >
                      {wishlistLoading[product.id] ? (
                        <span className="spinner-border  spinner-border-sm" role="status" aria-hidden="true"></span>
                      ) : isInWishlist(product.id) ? (
                        <Icon icon="line-md:heart-filled" width="30" height="30" style={{ color: '#e91e63' }} />
                      ) : (
                        <Icon icon="line-md:heart" width="30" height="30" />
                      )}
                    </button>
                
                  </div>
                </div>
              </div>
              <div className="card-body d-flex flex-column align-items-center">
                <Link
                  to={`/products/${product.documentId}`}
                  className={`${styles.productLink} text-decoration-none text-black`}
                >
                  <h5 className="card-title text-center">{product.product_name}</h5>
                </Link>
                <div className="d-flex align-items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Icon
                      key={i}
                      icon={i < Math.floor(product.product_rating || 0) ? 'mdi:star' : 'mdi:star-outline'}
                      className="text-warning me-1"
                    />
                  ))}
                  <span>({product.product_rating})</span>
                </div>
                {product.hasDiscount ? (
                  <div className="d-flex gap-2">
                    <p style={{ textDecoration: 'line-through', color: 'gray' }}>EGP {product.product_price}</p>
                    <p style={{ color: 'green', fontWeight: 'bold' }}>
                      EGP {(product.product_price - (product.product_price * product.discount_value / 100)).toFixed(2)}
                    </p>
                  </div>
                ) : (
                  <p style={{ color: 'black', fontWeight: 'bold' }}>EGP {product.product_price}</p>
                )}
                <button
                  onClick={()=> openQuickView(product.documentId)}
                  className={`${styles.quickViewBtn}  d-flex  align-items-center`}
                  type='button'
                >
                  <Icon icon="mdi:eye-outline" className="quick-view" />
                  <p className={`quick-view mb-0`}>Quick View</p>
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
    {selectedProductId && (
      <QuickView 
        productId={selectedProductId}
        onClose={closeQuickView}
        isOpen={!!selectedProductId}
      />
    )}
  </div>
</div>    </>
  )
}
