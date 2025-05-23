import React, { useEffect, useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

import './NewArrivals.css';

// import required modules
import { FreeMode, Pagination } from 'swiper/modules';
import axios from 'axios';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function NewArrivals() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);

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
        setProducts(newProduct);
        console.log("New Products:", newProduct);
      } catch (err){
        console.log(err)
      }     
    }

    fetchProduct();
  }, [])

  // if (loading) {
  //   return <div>NO NEW PRODUCTS FOR NOW</div>
  // }

  return (
    <>
    <div className='container'>
      <Swiper
        slidesPerView={3}
        spaceBetween={30}
        freeMode={true}
        pagination={{
          clickable: true,
        }}
        modules={[FreeMode, Pagination]}
        className="mySwiper newArrivals-c"
      >
        {products.length > 0 ? (
          products.map((product) => (
            <SwiperSlide key={product.id} id={products.documentId} className=''>
              <div className="card h-100 border-0 position-relative overflow-hidden">
                <div className="rounded-3 position-relative overflow-hidden">
                  {product.hasDiscount && (
                    <p className="d-flex justify-content-center align-items-center rounded-circle discount text-light">-{product.discount_value}%</p>
                  )}
                  <img
                    src={`http://localhost:1337${product.thumbnail?.url}`}
                    className="card-img-top h-100 img-hover-effect"
                    alt={product.product_name}
                  />


                  <div className="overlay-buttons d-flex justify-content-center align-items-end gap-5 position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-25 opacity-0 transition-opacity">
                  <button 
                  className="cart-btn mb-2"
                  // onClick={handleQuickAddToCart}
                  // disabled={loading}  
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                    ) : (
                      <Icon icon="solar:cart-large-2-broken" width="24" height="24" />
                    )}
                  </button>
                  <button
                  className="wishlist-btn btn-sm mb-2"
                  // onClick={handleWishlistToggle}
                  // disabled={wishlistLoading}
                  
                  >
                  <Icon icon="solar:heart-linear" width="24" height="24" />
                  {/* {wishlistLoading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : isInWishlist(id) ? (
                    <Icon icon="solar:heart-bold" width="24" height="24" style={{ color: '#e91e63' }} />
                  ) : (
                    <Icon icon="solar:heart-linear" width="24" height="24" />
                  )} */}
                  </button>
                  </div>

                </div>
                  <div className="card-body d-flex flex-column align-items-center">
                    <Link
                      to={`/products/${product.documentId}`}
                      // onMouseEnter={(e) => (e.target.style.color = '#006158')}
                      // onMouseLeave={(e) => (e.target.style.color = 'black')}
                      className="link-product text-decoration-none text-black"
                    >
                      <h5 className="card-title text-center">{product.product_name}</h5>
                    </Link>
                      {/* Rating */}
                      <div className="d-flex align-items-center mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Icon
                            key={i}
                            icon={i < Math.floor(product.product_rating || 0) ? "mdi:star" : "mdi:star-outline"}
                            className="text-warning me-1"
                          />
                        ))}
                        <span>({product.product_rating})</span>
                      </div>
                    
                  </div>
              </div>
            </SwiperSlide>

          ))
        ) : (
          <SwiperSlide className='bg-secondary'>Slide 1</SwiperSlide>
        )}
        {/* <SwiperSlide className='bg-secondary'>Slide 1</SwiperSlide>
        <SwiperSlide className='bg-secondary'>Slide 1</SwiperSlide>
        <SwiperSlide className='bg-secondary'>Slide 1</SwiperSlide>
        <SwiperSlide className='bg-secondary'>Slide 1</SwiperSlide>
        <SwiperSlide className='bg-secondary'>Slide 1</SwiperSlide> */}

      </Swiper>
      </div>
    </>
  )
}
