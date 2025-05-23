import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './WeeklyDeals.css'
import BASE_URL from '../../Data/BASE_URL';
import axios from 'axios';
import { marked } from 'marked';
import DOMPurify from 'dompurify';


function WeeklyDeals() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
const [countdown, setCountdown] = useState({
  days: 7,
  hours: 0,
  minutes: 0,
  seconds: 0,
});


useEffect(() => {
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const url = `${BASE_URL}products`;
      const response = await axios.get(url, {
        params: {
          populate: "*"
        }
      })
      const weeklyDeals = response.data.data.filter(product => product.isWeeklyDeal);
      setProducts(weeklyDeals);
    } catch (error) {
      console.error('Error fetching product:', err);
      setError('Failed to load product. Please try again later.');
      setLoading(false);
    }
  }
  fetchProduct();
}, [])

  // Handle animation on scroll using Intersection Observer
  useEffect(() => {
    // Create a reference for the observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When element is visible in viewport
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of element is visible
      }
    );
    
    // Get the element to observe
    const element = document.querySelector('.weekly-deals-container');
    if (element) {
      observer.observe(element);
    }
    
    // Cleanup the observer when component unmounts
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  // Countdown timer logic
useEffect(() => {
  const timer = setInterval(() => {
    setCountdown(prev => {
      if (prev.seconds > 0) {
        return { ...prev, seconds: prev.seconds - 1 };
      } else if (prev.minutes > 0) {
        return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
      } else if (prev.hours > 0) {
        return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
      } else if (prev.days > 0) {
        return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
      } else {
        clearInterval(timer); // Clear the timer if countdown is finished
        return prev;
      }
    });
  }, 1000);

  return () => clearInterval(timer);
}, []);


  if (countdown.days === 0 && countdown.hours === 0 && countdown.minutes === 0 && countdown.seconds === 0) {
    return (
      <div className="text-center my-5">
        <h2>Weekly Deals have ended!</h2>
      </div>
    );
  }


  return (     
            <div className="container my-5 weekly-deals-container">
      {products.map((product) =>{
        const finalPrice = product.hasDiscount
    ? product.product_price -(product.product_price * product.discount_value) / 100
    : product.product_price;

        return (
      <div 
      key={product.id}
        className={`card border-0 shadow-sm p-4 ${visible ? 'opacity-100' : 'opacity-0'}`} 
        style={{
          transition: 'all 2s ease',
          transform: visible ? 'translateY(0)' : 'translateY(50px)',
          backgroundColor: '#f8f9fa'
        }}
      >
        <div className="text-center mb-4">
          <h1 className="display-5 ">Weekly Deals</h1>
          <p className="text-muted">
            Time is Running Out! Hurry Up and Grab These Unbeatable Weekly Deals Before They're Gone!
          </p>
        </div>
        
        <div className="row g-0">
          <div className="col-lg-6">
            <div className="position-relative h-100">
              <div className="bg-light h-100 d-flex align-items-center justify-content-center rounded-start" style={{ backgroundColor: '#e9f0e6' }}>
                <img 
                  src={`http://localhost:1337${product.thumbnail?.url}`}
                  alt={product.product_name}
                  className="img-fluid" 
                  style={{ maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>
            </div>
          </div>
          
          <div className="col-lg-6">
            <div className="p-4">
              <h2 className="mb-2">{product.product_name}</h2>
              
              {product.hasDiscount ?(
              <div className="mb-3 d-flex align-items-center">
                <span className="text-muted text-decoration-line-through me-2">{product.product_price}</span>
                <span className="fs-3 fw-bold text-success">{finalPrice.toFixed(2)}</span>
                <span className='bg-danger pt-1 px-2 text-white mx-1 rounded-pill'>-{product.discount_value}%</span>
              </div>
              ) : (
                <span className="fs-3 fw-bold text-success">{product.product_price}</span>
              )
              }
            {product.desc && (
              <p className="text-muted mb-4">
                <div
                  className="rich-text-preview"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(marked(product.desc)),
                  }}
                />
                </p>
            )}

              <div className="mb-4">
                <div className="d-flex align-items-center mb-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success me-2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 12l2 2 6-6"></path>
                  </svg>
                  <span>Sativa-Dominant</span>
                </div>
                
                <div className="d-flex align-items-center mb-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success me-2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 12l2 2 6-6"></path>
                  </svg>
                  <span>THC 110.0-160.0mg/g</span>
                </div>
                
                <div className="d-flex align-items-center mb-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success me-2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 12l2 2 6-6"></path>
                  </svg>
                  <span>CBD 0.0-1.0mg/g</span>
                </div>
              </div>
              
              <div className="row text-center mb-4">
                <div className="col-3">
                  <div className="bg-white p-2 rounded shadow-sm">
                    <div className="fw-bold fs-4">{String(countdown.days).padStart(2, '0')}</div>
                    <div className="small text-muted">Days</div>
                  </div>
                </div>
                <div className="col-3">
                  <div className="bg-white p-2 rounded shadow-sm">
                    <div className="fw-bold fs-4">{String(countdown.hours).padStart(2, '0')}</div>
                    <div className="small text-muted">Hours</div>
                  </div>
                </div>
                <div className="col-3">
                  <div className="bg-white p-2 rounded shadow-sm">
                    <div className="fw-bold fs-4">{String(countdown.minutes).padStart(2, '0')}</div>
                    <div className="small text-muted">Minutes</div>
                  </div>
                </div>
                <div className="col-3">
                  <div className="bg-white p-2 rounded shadow-sm">
                    <div className="fw-bold fs-4">{String(countdown.seconds).padStart(2, '0')}</div>
                    <div className="small text-muted">Seconds</div>
                  </div>
                </div>
              </div>
              
                <Link to={`/products/${product.documentId}`}>
                    <button className="weekly-btn btn-lg text-white border-0 rounded-pill text-uppercase ">
                        Shop Now
                   </button>
                </Link>
            </div>
          </div>
        </div>
      </div>
  )})}
    </div>
  )
}

export default WeeklyDeals
