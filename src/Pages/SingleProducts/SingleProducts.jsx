import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import { toast } from 'react-toastify';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import './SingleProducts.css';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Icon } from '@iconify/react/dist/iconify.js';

import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import RelatedProducts from '../../Components/RelatedProducts/RelatedProducts';
import Descriptions from '../../Components/Descriptions/Descriptions';
import CustReviews from '../../Components/CustReviews/CustReviews';
import BASE_URL from '../../Data/BASE_URL';

export default function SingleProducts() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [singleCategory, setSingleCategory] = useState('');
  
  // Get cart and wishlist functions
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Reset component state when ID changes
  useEffect(() => {
    // Reset all states when navigating to a new product
    setProduct(null);
    setLoading(true);
    setError(null);
    setQuantity(1);
    setSelectedSize(null);
    setThumbsSwiper(null);
    setWishlistLoading(false);
    setSingleCategory('');
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const domain = `${BASE_URL}`;
        const endPoint = `products/${id}`;
        const url = domain + endPoint;
        
        const response = await axios.get(url, {
          params: {
            populate: "*"
          }
        });
        
        setProduct(response.data.data);
        // If there are sizes, select the first one by default
        if (response.data.data.sizes && response.data.data.sizes.length > 0) {
          setSelectedSize(response.data.data.sizes[0]);
        }
        
        // Set the category if available
        if (response.data.data.categories && response.data.data.categories.length > 0) {
          setSingleCategory(response.data.data.categories[0].category_name);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again later.');
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Clean up Swiper instances on unmount
  useEffect(() => {
    return () => {
      if (thumbsSwiper && thumbsSwiper.destroy) {
        thumbsSwiper.destroy(true, true);
      }
    };
  }, [thumbsSwiper]);

  const incrementQuantity = () => {
    if (selectedSize && quantity < selectedSize.stock) {
      setQuantity(quantity + 1);
    } else if (!selectedSize) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    if (quantity > size.stock) {
      setQuantity(1);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize || selectedSize.stock <= 0) {
      toast.error("Please select an available size");
      return;
    }
    const finalPrice = product.hasDiscount
      ? product.product_price - (product.product_price * product.discount_value) / 100
      : product.product_price;

    const imageId = product.image && product.image.length > 0 
      ? product.image[0].id
      : null;

    const cartItem = {
      product_id: product.id,
      product_name: product.product_name,
      price: finalPrice,
      quantity: quantity,
      size: selectedSize.size,
      imageId: imageId,
      imageUrl: product.image && product.image.length > 0 
        ? `${BASE_URL}${product.image[0].url}` 
        : '',
      maxStock: selectedSize.stock,
    };

    addToCart(cartItem);
    toast.success(`Added ${product.product_name} to cart!`);
  };

  const handleWishlistToggle = async () => {
    if (!product) return;
    
    setWishlistLoading(true);
    
    const productInWishlist = isInWishlist(product.id);
    
    try {
      if (productInWishlist) {
        await removeFromWishlist(product.id);
      } else {
        const imageUrl = product.image && product.image.length > 0 
          ? product.image[0].url 
          : '';
          
        const imageId = product.image && product.image.length > 0 
          ? product.image[0].id
          : null;
          
        const wishlistItem = {
          id: product.id,
          product_documentId: product.documentId,
          name: product.product_name,
          price: product.product_price,
          rating: product.product_rating,
          imageId: imageId,
          imageUrl: product.image && product.image.length > 0 
            ? `${BASE_URL}${product.image[0].url}` 
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

  if (loading) return <div className="container my-5 text-center"><div className="spinner-border" role="status"></div></div>;
  if (error) return <div className="container my-5 alert alert-danger">{error}</div>;
  if (!product) return <div className="container my-5 alert alert-warning">Product not found</div>;

  const finalPrice = product.hasDiscount
    ? product.product_price - (product.product_price * product.discount_value) / 100
    : product.product_price;

  return (
    <div className='pt-5 mt-5'>
      <div className="container-sm product-content my-4">
        <div className="row">
          {/* Product Images - Left Side */}
          <div className="slider-img col-12 col-lg-7 mb-4">
            <div className="product-gallery h-100">
              {product.image && product.image.length > 0 && (
                <>
                  <Swiper
                    key={`main-${product.id}`} // Add unique key
                    loop={product.image.length > 1} // Only enable loop if more than 1 image
                    modules={[Navigation, Pagination, Thumbs]}
                    thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : {}}
                    navigation
                    pagination={{ clickable: true }}
                    className="main-swiper mb-3"
                    onSwiper={(swiper) => {
                      // Store main swiper reference if needed
                    }}
                  >
                    {product.image.map((img, index) => (
                      <SwiperSlide key={`main-slide-${index}`}>
                        <img 
                          src={`http://localhost:1337${img.url}`} 
                          alt={product.product_name} 
                          className="img-fluid rounded"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  
                  {/* Only show thumbs if more than 1 image */}
                  {product.image.length > 1 && (
                    <Swiper
                      key={`thumbs-${product.id}`} // Add unique key
                      onSwiper={(swiper) => {
                        // Small delay to ensure DOM is ready
                        setTimeout(() => {
                          setThumbsSwiper(swiper);
                        }, 100);
                      }}
                      slidesPerView={Math.min(4, product.image.length)}
                      spaceBetween={10}
                      loop={false} // Disable loop for thumbs
                      modules={[Thumbs]}
                      className="thumbs-swiper"
                      watchSlidesProgress={true}
                    >
                      {product.image.map((img, index) => (
                        <SwiperSlide key={`thumb-slide-${index}`}>
                          <img 
                            src={`http://localhost:1337${img.url}`} 
                            alt={`Thumbnail ${index + 1}`} 
                            className="img-fluid rounded cursor-pointer"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Product Info - Right Side */}
          <div className="col-lg-5 col-12">
            <h3 className="productName mb-3 fw-bold">{product.product_name}</h3>
            
            <div className="d-flex align-items-start mb-3 gap-3">
              <div className="product-rating mb-2">
                <div className="d-flex align-items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Icon
                      key={i}
                      icon={i < Math.floor(product.product_rating) ? "mdi:star" : "mdi:star-outline"}
                      className="text-warning me-1"
                    />
                  ))}
                  <span>({product.product_rating})</span>
                </div>
              </div>
              <p className='viewAllReviews fw-bold'>VIEW ALL REVIEWS</p>
            </div>
            
            <div className='category d-flex gap-3'>
              <p className='fw-bold'>CATEGORY:</p> {singleCategory}
            </div>

            {/* Price */}
            <div className="mb-4">
              {product.hasDiscount ? (
                <div className="d-flex align-items-center">
                  <span className="text-muted text-decoration-line-through me-2">EGP {product.product_price}</span>
                  <h3 className="text-danger mb-0">EGP {finalPrice.toFixed(2)}</h3>
                  <span className="badge bg-success ms-2">-{product.discount_value}% OFF</span>
                </div>
              ) : (
                <h3 className='bold'>EGP {product.product_price}</h3>
              )}
            </div>

            {product.desc && (
              <div className="productDesc mb-4 preview-mode">
                <div
                  className="rich-text-preview"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(marked(product.desc)),
                  }}
                />
              </div>
            )}
            
            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-4">
                <h5 className='font-14 fw-bold'>SIZE:</h5>
                <div className="d-flex flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size.id}
                      className={`sizeBtn btn rounded-pill me-2 mb-2 ${
                        selectedSize && selectedSize.id === size.id
                          ? 'btn-dark'
                          : 'btn-outline-secondary'
                      }`}
                      onClick={() => handleSizeSelect(size)}
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
                {selectedSize && (
                  <small className="greenColor ">
                    {selectedSize.stock > 3
                      ? `(${selectedSize.stock}) In stock`
                      : `Only (${selectedSize.stock}) left!`}
                  </small>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="mb-4">
              <h5 className='font-14 fw-bold'>QUANTITY</h5>
              <div className="quantity-control">
                <button 
                  className="quantity-btn quantity-minus"
                  onClick={decrementQuantity}
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
                  onClick={incrementQuantity}
                  disabled={selectedSize && quantity >= selectedSize.stock}
                >
                  +
                </button>
              </div>
              {selectedSize && quantity === selectedSize.stock && (
                <small className="text-danger mt-2 d-block">Maximum available quantity selected</small>
              )}
            </div>

            <div className="container">
              <div className='add-btns row d-flex justify-content-between'>
                <div className="mb-4 p-0 col-9 col-sm-10 add-cart-btn rounded-pill">
                  <button 
                    className="btn w-100 rounded-pill text-dark fw-bold add-cart-btn w-100 py-2"
                    disabled={!selectedSize || selectedSize.stock <= 0}
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </button>
                </div>
                
                <div className="wishlistbtn col-3 col-sm-2 ">
                  <button 
                    className='wishlist-icon rounded-pill'
                    onClick={handleWishlistToggle}
                    disabled={wishlistLoading}
                  >
                    {wishlistLoading ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : isInWishlist(product.id) ? (
                      <Icon icon="line-md:heart-filled" width="24" height="24" style={{ color: '#e91e63' }} />
                    ) : (
                      <Icon icon="line-md:heart" width="24" height="24" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Guaranteed safe checkout */}
            <div className="safe-checkout d-flex justify-content-center align-items-center">
              <p className=''>Guaranteed safe checkout</p>
              <div className="pay-logos d-flex justify-content-center align-items-center gap-4">
                <img src="/images/instapay.png" alt="" />
                <img src="/images/vodafon cash.png" alt="" />
                <img src="/images/visa.png" alt="" />
                <img src="/images/mastercard.png" alt="" />
              </div>
            </div>

            <div className="estimated-shipping d-flex gap-3 mt-4">
              <Icon icon="svg-spinners:clock" width="24" height="24" />
              <p>Orders ship within 2 to 7 business days.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <Descriptions/>
      </div>

      <div>
        <CustReviews/>
      </div>
      
      {/* Pass the category name to the RelatedProducts component */}
      {singleCategory && (
        <RelatedProducts 
          key={product.id} 
          categoryName={singleCategory}
          currentProductId={product.id}
          currentProductDocumentId={product.documentId}
        />
      )}      
    </div>
  );
}