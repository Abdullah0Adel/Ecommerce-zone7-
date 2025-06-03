// components/QuickViewModal.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import { Icon } from '@iconify/react';
import DOMPurify from 'dompurify';
import { useCart } from '../../context/CartContext';
import './QuickView.css'

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

export default function QuickView({ productId, onClose }) {
  const [product, setProduct] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();


  useEffect(() => {
    // Disable scroll on mount
    document.body.classList.add('overflow-hidden');
  
    // Enable scroll when component unmounts
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);
  

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:1337/api/products/${productId}?populate=*`);
        setProduct(res.data.data);

        if (res.data.data.sizes?.length > 0) {
          setSelectedSize(res.data.data.sizes[0]);
        }
      } catch (err) {
        console.error("Quick view product fetch error:", err);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!product) return null;

  const finalPrice = product.hasDiscount
    ? product.product_price - (product.product_price * product.discount_value) / 100
    : product.product_price;

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    if (quantity > size.stock) setQuantity(1);
  };

  const increment = () => {
    if (selectedSize && quantity < selectedSize.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize || selectedSize.stock <= 0) {
      toast.error("Please select an available size");
      return;
    };

    const finalPrice = product.hasDiscount
      ? product.product_price - (product.product_price * product.discount_value) / 100
      : product.product_price;


  const imageId = product.image && product.image.length > 0 
    ? product.image[0].id  // Use the image ID rather than the URL
    : null;

  const cartItem = {
    product_id: product.id,
    product_name: product.product_name,
    price: finalPrice,
    quantity: quantity,
    size: selectedSize.size,
    // Instead of storing the URL, store the image ID for API calls
    imageId: imageId,
    // Keep a display URL for local use
    imageUrl: product.image && product.image.length > 0 
      ? `http://localhost:1337${product.image[0].url}` 
      : '',
    maxStock: selectedSize.stock,
  };

    addToCart(cartItem);
    onClose();
  };




    

  return (
    <AnimatePresence>
        {product &&(
     <motion.div
      className="position-fixed top-0 start-0 end-0 bottom-0 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center z-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ backdropFilter: 'blur(5px)', overflowY: 'auto' }}
    >
      {/* BACKDROP OVERLAY with onClick */}
      <div
        className="w-100 h-100 position-absolute"
        style={{ zIndex: 100 }}
        onClick={onClose}
      ></div>

      {/* MODAL CONTENT */}
      <motion.div
        className="bg-white p-4 rounded-3 shadow-lg position-relative"
        style={{ maxWidth: '900px', width: '95%', zIndex: 200 }}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        
      >


          <div className="row rounded-pill">
            {/* Images */}
            <div className="col-md-6 mb-3">
              {product.image?.length > 0 && (
                <>
                  <Swiper
                    loop
                    navigation
                    pagination={{ clickable: true }}
                    thumbs={{ swiper: thumbsSwiper }}
                    modules={[Navigation, Pagination, Thumbs]}
                    className="mb-2"
                  >
                    {product.image.map((img, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={`http://localhost:1337${img.url}`}
                          alt={product.product_name}
                          className="img-fluid rounded"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  <Swiper
                    onSwiper={setThumbsSwiper}
                    slidesPerView={4}
                    spaceBetween={10}
                    loop
                    modules={[Thumbs]}
                  >
                  </Swiper>
                </>
              )}
            </div>

            {/* Details */}
            <div className="col-md-6">
              {/* Title + Close */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">{product.product_name}</h4>
                <button className="close-btn rounded-circle align-self-start d-flex justify-content-center align-items-center" onClick={onClose}>
                  <Icon icon="material-symbols-light:close" width="24" height="24" />
                </button>
                </div>
              {/* Price */}
              <div className="mb-2">
                {product.hasDiscount ? (
                  <>
                    <span className="text-muted text-decoration-line-through">EGP {product.product_price}</span>{" "}
                    <span className="fw-bold text-success">EGP {finalPrice.toFixed(2)}</span>{" "}
                    <span className="badge bg-danger">-{product.discount_value}%</span>
                  </>
                ) : (
                  <h5 className="fw-bold">EGP {product.product_price}</h5>
                )}
              </div>

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

              {/* Sizes */}
              {product.sizes?.length > 0 && (
                <div className="mb-3">
                  <h6 className="fw-bold">Size:</h6>
                  <div className="d-flex flex-wrap">
                    {product.sizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => handleSizeSelect(size)}
                        className={`btn btn-sm me-2 mb-2 ${
                          selectedSize?.id === size.id ? 'btn-dark' : 'btn-outline-secondary'
                        }`}
                        disabled={size.stock <= 0}
                      >
                        {size.size}
                        {size.stock <= 3 && size.stock > 0 && (
                          <span className="ms-1 text-danger">({size.stock} left)</span>
                        )}
                        {size.stock <= 0 && <span className="ms-1">(Out of stock)</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* available in stock */}
              {selectedSize && (
                  <small className="greenColor ">
                    {selectedSize.stock > 3
                      ? `(${selectedSize.stock}) In stock
                      `
                      : `Only (${selectedSize.stock}) left!`}
                  </small>
                )}


            {/* Quantity */}
            <div className="mb-4">
              <h5 className='font-14 fw-bold'>Quantity</h5>
              <div className="quantity-control">
                <button 
                  className="quantity-btn quantity-minus"
                  onClick={decrement}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  className="quantity-input"
                  value={quantity}
                  readOnly
                />
                <button 
                  className="quantity-btn quantity-plus"
                  onClick={increment}
                  disabled={selectedSize && quantity >= selectedSize.stock}
                >
                  +
                </button>
              </div>
              {selectedSize && quantity === selectedSize.stock && (
                <small className="text-danger mt-2 d-block">Maximum available quantity selected</small>
              )}
            </div>

              {/* Add to cart */}
              <button
                className="btn-addToCart  rounded-pill w-100 fw-bold"
                onClick={handleAddToCart}
                disabled={!selectedSize || selectedSize.stock === 0}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}
