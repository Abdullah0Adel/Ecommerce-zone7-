import React, { useEffect, useRef, useState } from 'react';
import './SportsWearPromo.css'
import { Link } from 'react-router-dom';

export default function SportsWearPromo() {
  const [isVisible, setIsVisible] = useState(false);
  const componentRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the component comes into view
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1, // Trigger when at least 10% of the element is visible
      }
    );
    
    if (componentRef.current) {
      observer.observe(componentRef.current);
    }
    
    // Cleanup observer on unmount
    return () => {
      if (componentRef.current) {
        observer.unobserve(componentRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={componentRef}
      className={`promo-container ${isVisible ? 'visible' : ''}`}
    >
      <div className="image-container">
        <img 
          src="./images/nikeShoe.png" 
          alt="Premium Sports Shoes" 
          className="promo-image"
        />
      </div>
      
      <div className="content-container">
        <p className="intro-text">
          Our premium sportswear comes from quality
        </p>
        
        <h2 className="heading">
          Athletic Gear From The USA
        </h2>
        
        <p className="description">
          Sportswear from the USA is known for its superior quality. The country's strict manufacturing standards, advanced techniques, and rigorous testing ensure that the sportswear produced is of the highest caliber. With optimal design conditions and a focus on premium materials, USA-made athletic gear delivers a rich profile of comfort and performance. When you choose sportswear from the USA, you can expect a top-notch product that has been created with expertise and a commitment to excellence.
        </p>
        
        <div className="button-container">
          <Link to={"/shop"}>
          <button className="shop-now-button">
            Shop Now
          </button>
          </Link>
        </div>
      </div>


    </div>
  );
}