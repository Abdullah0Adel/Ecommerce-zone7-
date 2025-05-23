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
import { useWishlist } from '../../context/WishlistContext'; // Import wishlist context
import RelatedProducts from '../../Components/RelatedProducts/RelatedProducts';
import Descriptions from '../../Components/Descriptions/Descriptions';
import CustReviews from '../../Components/CustReviews/CustReviews';

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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const domain = 'http://localhost:1337/';
        const endPoint = `api/products/${id}`;
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




  const incrementQuantity = () => {
    // Limit quantity to available stock if size is selected
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
    // Reset quantity if it's more than the available stock
    if (quantity > size.stock) {
      setQuantity(1);
    }
  };

  // const handleAddToCart = async () => {
  //   const url = 'http://localhost:1337/api/carts';
  //   try {
  //     const token = localStorage.getItem('token');
  //     const user = JSON.parse(localStorage.getItem('user'));
  //     const userId = user.id;
  
  //     const payload = {
  //       data: {
  //         users_permissions_user: userId,
  //         product_id: product.id,
  //         name: product.product_name,
  //         price: product.product_price,
  //         quantity: quantity,
  //         size: selectedSize?.size || '',
  //         image: product.thumbnail.url, // ✅ Correct media relation
  //       }
  //     };
  
  //     const res = await axios.post(url, payload, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  
  //     console.log("Added to cart:", res.data);
  //     toast.success(`Added to Cart Successfully :)`)
  //   } catch (err) {
  //     console.error("Error adding to cart", err.response?.data || err.message);
  //   }
  // };
    
// Modified handleAddToCart function in SingleProducts.jsx
const handleAddToCart = () => {
  if (!selectedSize || selectedSize.stock <= 0) {
    toast.error("Please select an available size");
    return;
  }
  const finalPrice = product.hasDiscount
    ? product.product_price - (product.product_price * product.discount_value) / 100
    : product.product_price;

  // Get the image ID instead of the URL path
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

  // Save to localStorage for local cart management
  // let existingCart = JSON.parse(localStorage.getItem("cart")) || [];

  // const existingIndex = existingCart.findIndex(
  //   (item) => item.product_id === cartItem.product_id && item.size === cartItem.size
  // );

  // if (existingIndex >= 0) {
  //   // If item with same ID and size exists, increase quantity
  //   const existingItem = existingCart[existingIndex];
  //   const newQuantity = existingItem.quantity + cartItem.quantity;

  //   existingCart[existingIndex] = {
  //     ...existingItem,
  //     quantity: newQuantity > cartItem.maxStock ? cartItem.maxStock : newQuantity,
  //   };
  // } else {
  //   existingCart.push(cartItem);
  // }

  // localStorage.setItem("cart", JSON.stringify(existingCart));

  // Call the context function to update the server-side cart
  addToCart(cartItem);

  toast.success(`Added ${product.product_name} to cart!`);
};
  // Toggle wishlist functionality
// Updated handleWishlistToggle function for SingleProducts.jsx

const handleWishlistToggle = async () => {
  if (!product) return;
  
  setWishlistLoading(true);
  
  const productInWishlist = isInWishlist(product.id);
  
  try {
    if (productInWishlist) {
      await removeFromWishlist(product.id);
    } else {
      // Prepare image object correctly
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
          ? `http://localhost:1337${product.image[0].url}` 
          : '',
      };
      
      await addToWishlist(wishlistItem);
    }
    
    // No need for toast here as the context functions already show toasts
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
    <div>
      <div className="container-sm product-content my-4">
        <div className="row">
          {/* Product Images - Left Side */}
          <div className=" slider-img col-12 col-lg-7 mb-4">
            {/* Image gallery code remains the same */}
            <div className="product-gallery h-100">
              {product.image && product.image.length > 0 && (
                <>
                  <Swiper
                    loop={true}
                    modules={[Navigation, Pagination, Thumbs]}
                    thumbs={{ swiper: thumbsSwiper }}
                    navigation
                    pagination={{ clickable: true }}
                    className="main-swiper mb-3"
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
                    loop={true}
                    modules={[Thumbs]}
                    className="thumbs-swiper"
                  >
                    {product.image.map((img, index) => (
                      <SwiperSlide key={index}>
                        <img 
                          src={`http://localhost:1337${img.url}`} 
                          alt={`Thumbnail ${index + 1}`} 
                          className="img-fluid rounded cursor-pointer"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </>
              )}
            </div>
          </div>

          {/* Product Info - Right Side */}
          <div className="col-lg-5 col-12">
            <h3 className="productName mb-3 fw-bold">{product.product_name}</h3>
            
            <div className="d-flex align-items-start mb-3 gap-3">
              <div className="me-3">{product.product_rating}</div>
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
                      ? `(${selectedSize.stock}) In stock
                      `
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
                {/* Add to Cart Button - Modified with onClick handler */}
                <div className="mb-4 p-0 col-9 col-sm-10 add-cart-btn rounded-pill">
                  <button 
                    className="btn w-100 rounded-pill text-dark fw-bold add-cart-btn w-100 py-2"
                    disabled={!selectedSize || selectedSize.stock <= 0}
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </button>
                </div>
                
                {/* Wishlist btn - Updated with wishlist toggle functionality */}
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
              <CustReviews
              />
            </div>
      
      {/* Pass the category name to the RelatedProducts component */}
      {singleCategory && <RelatedProducts categoryName={singleCategory} />}
      
    </div>
  );
}