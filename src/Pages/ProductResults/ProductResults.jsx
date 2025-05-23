import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useWishlist } from '../../context/WishlistContext';
import Aos from 'aos';
import { Icon } from '@iconify/react/dist/iconify.js';

function ProductResults() {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist(); // Use wishlist context
  const [wishlistLoading, setWishlistLoading] = useState(false);


    useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:1337/api/products', {
          params: {
            populate: "*"
          }
        });
        
        // Filter products based on search term
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








  const finalPrice =products.hasDiscount
    ? products.product_price - (products.product_price * discount_value) / 100
    : products.product_price;
    
  // Quick add to cart with default size (if available)
  const handleQuickAddToCart = () => {
  // if (!selectedSize[0] || selectedSize[0].stock <= 0) {
  //   toast.error("Please select an available size");
  //   return;
  // }
  const finalPrice = products.hasDiscount
    ? products.product_price - (products.product_price * discount_value) / 100
    : products.product_price;

  // Get the image ID instead of the URL path
  const imageId = products.image && products.image.length > 0 
    ? products.image[0].id  // Use the image ID rather than the URL
    : null;

  const cartItem = {
    product_id: products.id,
    product_name: products.product_name,
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
  
  const productInWishlist = isInWishlist(products.id);
  
  try {
    if (productInWishlist) {
      await removeFromWishlist(products.id);
    } else {
            // Prepare image object correctly
      const imageUrl = products.image && products.image.length > 0 
        ? products.image[0].url 
        : '';
        
      const imageId = products.image && products.image.length > 0 
        ? products.image[0].id
        : null;
      // Create wishlist item matching the format expected by WishlistContext
      const wishlistItem = {
        id: products.id,

        product_documentId: products.documentId,
        product_name: products.product_name,
        price: finalPrice,
        rating: products.product_rating,
        // Handle image safely - create an array with a single object containing url
        imageId: imageId,
        imageUrl: products.image && products.image.length > 0 
          ? `http://localhost:1337${products.image[0].url}` 
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
  const [isQuickViewOpen, setQuickViewOpen] = useState(false);

  useEffect(() => {
    Aos.init({
      duration: 1000,
      once: true,
      offset: 100
    });
  }, []);



  return (
    <div className="container my-4">
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
            {products.map(product => (
    <div key={product.id} data-aos="fade-up" data-aos-duration="3000" className="col-6 col-md-4 col-lg-4 mb-4">
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
              className="wishlist-btn btn-sm mb-2"
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

        <div className="card-body d-flex flex-column align-items-center">
          <Link
            to={`/products/${product.documentId}`}
            onMouseEnter={(e) => (e.target.style.color = '#006158')}
            onMouseLeave={(e) => (e.target.style.color = 'black')}
            className="link-product text-decoration-none text-black"
          >
            <h5 className="card-title text-center">{product.product_name}</h5>
          </Link>

          {/* Rating display */}
          <div className="product-rating mb-2">
            {product.product_rating && (
              <div className="d-flex align-items-center">
                <div className="rating-stars me-1">
                  {Array(5).fill().map((_, i) => (
                    <Icon 
                      key={i} 
                      icon={i < Math.floor(product.product_rating) ? "mdi:star" : "mdi:star-outline"} 
                      className="text-warning"
                    />
                  ))}
                </div>
                <small>({product.product_rating})</small>
              </div>
            )}
          </div>

          {product.hasDiscount ? (
            <div className='d-flex gap-2'>
              <p style={{ textDecoration: 'line-through', color: 'gray' }}>
                EGP {product.product_price}
              </p>
              <p style={{ color: 'green', fontWeight: 'bold' }}>
                EGP {product.finalPrice}
              </p>
            </div>
          ) : (
            <p className="text-black fw-bold">EGP {product.product_price}</p>
          )}
          
          <button onClick={() => setQuickViewOpen(true)} className="quick-view-btn d-flex align-items-center gap-1">
            <Icon icon="mdi:eye-outline" className="quick-view" />
            <p className='quick-view mb-0'>Quick View</p>
          </button>
          {isQuickViewOpen && (
            <>
            <div className="container"></div>
            <QuickView productId={product.id} onClose={() => setQuickViewOpen(false)} />
            </>
          )}
        </div>
      </div>
    </div>
            ))}
          </div>
          
          {products.length === 0 && (
            <div className="text-center my-5">
              <p>No products found matching your search criteria.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ProductResults;