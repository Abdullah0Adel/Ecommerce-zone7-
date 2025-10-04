import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useWishlist } from '../../context/WishlistContext';
import Aos from 'aos';
import { Icon } from '@iconify/react/dist/iconify.js';
import QuickView from '../../Components/QuickView/QuickView';
import toast from 'react-hot-toast';
import BASE_URL from '../../Data/BASE_URL';
import './ProductResults.css';

function ProductResults() {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [wishlistLoading, setWishlistLoading] = useState({}); // Track loading per product
  
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/products`, {
          params: {
            populate: "*"
          }
        });
        
        const filteredProducts = response.data.data.filter(product => 
          product.product_name && product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm]);

  // Helper function to open QuickView for specific product
  const openQuickView = (productId) => {
    setSelectedProductId(productId);
  };

  // Helper function to close QuickView
  const closeQuickView = () => {
    setSelectedProductId(null);
  };

  // Single wishlist handler that takes product as parameter
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
        // Calculate final price products
        const finalPrice = product.hasDiscount
          ? product.product_price - (product.product_price * product.discount_value) / 100
          : product.product_price;

        const imageUrl = product.image && product.image.length > 0 
          ? product.image[0].url 
          : '';
          
        const imageId = product.image && product.image.length > 0 
          ? product.image[0].id
          : null;

        const wishlistItem = {
          id: product.id, 
          product_id: product.id,
          product_documentId: product.documentId,
          product_name: product.product_name,
          name: product.product_name,
          price: finalPrice,
          rating: product.product_rating || product.rating,
          imageId: imageId,
          imageUrl: product.image && product.image.length > 0 
            ? `${product.image[0].url}` 
            //modified
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

  useEffect(() => {
    Aos.init({
      duration: 1000,
      once: true,
      offset: 100
    });
  }, []);

  return (
    <div className="container my-5 pt-5">
      <h2>Search Results for "{searchTerm}"</h2>
      
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <p>{products.length} products found</p>
          
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {products.map(product => {
              const finalPrice = product.hasDiscount
                ? product.product_price - (product.product_price * product.discount_value) / 100
                : product.product_price;

              return (
                <div key={product.id} data-aos="fade-up" data-aos-duration="3000" className="col-6 col-md-4 col-lg-4 mb-4">
                  <div className="card h-100 border-0 position-relative overflow-hidden">
                    <div className="rounded-3 position-relative overflow-hidden">
                      {product.hasDiscount && (
                        <p className="d-flex justify-content-center align-items-center rounded-circle discount text-light">
                          -{product.discount_value}%
                        </p>
                      )}

                      <img
                        src={`${product.thumbnail?.url}`}
                        //modified
                        className="card-img-top h-100 img-hover-effect"
                        alt={product.product_name}
                      />

                      <div className="overlay-buttons d-flex justify-content-center align-items-end gap-5 position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-25 opacity-0 transition-opacity">
                        <button 
                          className="wishlist-btn btn-sm mb-2"
                          onClick={(event) => handleWishlistToggle(product, event)}
                          disabled={wishlistLoading[product.id]}
                          type="button"
                        >
                          {wishlistLoading[product.id] ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          ) : isInWishlist(product.id) ? (
                            <Icon icon="line-md:heart-filled" width="24" height="24" style={{ color: '#e91e63' }} />
                          ) : (
                            <Icon icon="line-md:heart" width="24" height="24" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="card-body d-flex flex-column align-items-center">
                      <Link
                        to={`/products/${product.documentId}`}
                        onMouseEnter={(e) => (e.target.style.color = '#006158')}
                        onMouseLeave={(e) => (e.target.style.color = 'black')}
                        className="link-product text-decoration-none text-black"
                      >
                        <h5 className="card-title text-center">{product.product_name}</h5>
                      </Link>

                      <div className="product-rating mb-2">
                          <div className="d-flex align-items-center">
                            <div className="rating-stars me-1">
                              {[...Array(5)].map((_, i) => (
                                <Icon
                                  key={i}
                                  icon={i < Math.floor(product.product_rating) ? "mdi:star" : "mdi:star-outline"}
                                  className="text-warning me-1"
                                />
                              ))}
                            </div>
                              <small>({product.product_rating})</small>
                          </div>
                      </div>

                      {product.hasDiscount ? (
                        <div className='d-flex gap-2'>
                          <p style={{ textDecoration: 'line-through', color: 'gray' }}>
                            EGP {product.product_price}
                          </p>
                          <p style={{ color: 'green', fontWeight: 'bold' }}>
                            EGP {finalPrice.toFixed(2)}
                          </p>
                        </div>
                      ) : (
                        <p className="text-black fw-bold">EGP {product.product_price}</p>
                      )}
                      
                      <button 
                        onClick={() => openQuickView(product.documentId)} 
                        className="quick-view-btn align-items-center gap-1"
                      >
                        <Icon icon="mdi:eye-outline" className="quick-view" />
                        <span className='quick-view mb-0'>Quick View</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {products.length === 0 && (
            <div className="text-center my-5">
              <p>No products found matching your search criteria.</p>
            </div>
          )}
        </>
      )}
      
      {selectedProductId && (
        <QuickView 
          productId={selectedProductId} 
          onClose={closeQuickView} 
        />
      )}
    </div>
  );
}

export default ProductResults;