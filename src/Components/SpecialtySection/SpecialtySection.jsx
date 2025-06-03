import { useState, useEffect } from 'react';
import './SpecialtySection.css';

const SpecialtySection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const sectionElement = document.getElementById('specialty-section');
      
      if (sectionElement) {
        const sectionPosition = sectionElement.offsetTop + 100;
        if (scrollPosition > sectionPosition) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Check visibility on mount
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div id="specialty-section" className="specialty-section">
      <h2 className="section-title">Our Specialties</h2>
      <h3 className="section-subtitle">Discovering the Specialty Features That Elevate Performance</h3>
      
      <div className="specialty-content">
        <div className="left-column">
          <div className={`specialty-item ${isVisible ? 'animate-left' : ''}`}>
            <div className="icon-container">
              <span role="img" aria-label="Performance" className="icon">🏃</span>
            </div>
            <div className="text-content">
              <h3>Performance Technology</h3>
              <p>Our fabrics feature advanced moisture-wicking technology that keeps you dry and comfortable during intense workouts.</p>
            </div>
          </div>
          
          <div className={`specialty-item ${isVisible ? 'animate-left' : ''}`}>
            <div className="icon-container">
              <span role="img" aria-label="Durability" className="icon">🛡️</span>
            </div>
            <div className="text-content">
              <h3>Exceptional Durability</h3>
              <p>Engineered to withstand rigorous training sessions with reinforced seams and premium materials that maintain shape.</p>
            </div>
          </div>
          
          <div className={`specialty-item ${isVisible ? 'animate-left' : ''}`}>
            <div className="icon-container">
              <span role="img" aria-label="Sleep" className="icon">😴</span>
            </div>
            <div className="text-content">
              <h3>Recovery Wear</h3>
              <p>Specialized compression clothing designed to promote blood circulation and reduce muscle fatigue after workouts.</p>
            </div>
          </div>
        </div>
        
        <div className={`center-image ${isVisible ? 'animate-center' : ''}`}>
          <img src="/images/adidas-soccer-boots.png" alt="Sports apparel" className="product-image h-100" />
        </div>
        
        <div className="right-column">
          <div className={`specialty-item ${isVisible ? 'animate-right' : ''}`}>
            <div className="icon-container">
              <span role="img" aria-label="Eco-friendly" className="icon">🌿</span>
            </div>
            <div className="text-content">
              <h3>Sustainable Materials</h3>
              <p>Eco-friendly athletic wear made from recycled materials without compromising on performance or comfort.</p>
            </div>
          </div>
          
          <div className={`specialty-item ${isVisible ? 'animate-right' : ''}`}>
            <div className="icon-container">
              <span role="img" aria-label="Custom fit" className="icon">📏</span>
            </div>
            <div className="text-content">
              <h3>Ergonomic Design</h3>
              <p>Athletic wear designed to conform to your body's natural movements, enhancing performance and preventing injuries.</p>
            </div>
          </div>
          
          <div className={`specialty-item ${isVisible ? 'animate-right' : ''}`}>
            <div className="icon-container">
              <span role="img" aria-label="Style" className="icon">🎨</span>
            </div>
            <div className="text-content">
              <h3>Fashion-Forward</h3>
              <p>Trendy designs that transition seamlessly from workout sessions to casual outings, never compromising on style.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialtySection;