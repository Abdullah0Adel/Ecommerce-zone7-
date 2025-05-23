import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function RelatedProducts({ categoryName }) {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!categoryName) return;

      try {
        setLoading(true);
        const relatedUrl = 'http://localhost:1337/api/products';
        const response = await axios.get(relatedUrl, {
          params: {
            populate: "*"
          }
        });
        // Filter products that match the category name
        const filteredProducts = response.data.data.filter(product => {
          return product.categories && 
                 product.categories.some(cat => 
                   cat.category_name === categoryName
                 );
        });

        console.log(response.data.data)
        setRelatedProducts(filteredProducts);
      } catch (err) {
        console.error('Error fetching related products:', err);
        setError('Failed to load related products');
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [categoryName]);

  if (loading) return <div className="container my-4 text-center"><div className="spinner-border" role="status"></div></div>;
  if (error) return <div className="container my-4 alert alert-danger">{error}</div>;
  if (!relatedProducts.length) return null;

  return (
    <div className="related-products container my-5">
      <h3 className="mb-4">Related Products</h3>
    {relatedProducts.length > 0 && (
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
        className="related-products-slider"
      >
        
        {relatedProducts.map((product) => (
          <SwiperSlide key={product.id}>

            <div className="product-card my-5">
              <Link to={`/products/${product.documentId || product.id }`} className="text-decoration-none text-center text-dark">
                <div className="product-image mb-3 ">
                  {product.image && product.image.length > 0 ? (
                    <img
                      src={`http://localhost:1337${product.image[0].url}`}
                      alt={product.product_name}
                      className="img-fluid rounded"
                    />
                  ) : (
                    <div className="no-image-placeholder">No Image Available</div>
                  )}                </div>
                <div className="product-info">
                  <h5 className="product-title">{product.product_name}</h5>
                  
                  <div className="product-price mb-2">
                    {product.hasDiscount ? (
                      <div className="d-flex align-items-center">
                        <span className="text-muted text-decoration-line-through me-2">
                          EGP {product.product_price}
                        </span>
                        <span className="text-success fw-bold">
                          EGP {(product.product_price - (product.product_price * product.discount_value) / 100).toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span>EGP {product.product_price}</span>
                    )}
                  </div>
                  
                  <div className="product-rating">
                    <Icon icon="ic:baseline-star" className="text-warning" />
                    <span>{product.product_rating || "N/A"}</span>
                  </div>
                </div>
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    )}
    </div>
  );
}