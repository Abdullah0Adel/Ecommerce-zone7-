import React, { useEffect, useRef, useState } from 'react';
import './InfoSection.css';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react/dist/iconify.js';

const InfoSection = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update visibility state when the element enters the viewport
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1, // When 10% of the element is visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className={`info-section ${isVisible ? 'fade-in' : ''}`}>
      <div className="info-container">
        <div className="info-text">
          <h2>Experienced Team Crafting High-Quality<br />Cannabis Essential Oil Products</h2>
          <p>
            Experienced professionals in cultivation, extraction, formulation, and product development create high-quality cannabis
            essential oil products. With years of expertise in the cannabis industry, they understand the nuances of plant cultivation,
            precise extraction techniques, and formulating effective products. Their knowledge ensures the production of safe,
            consistent, and premium cannabis essential oil products.
          </p>
          <p className="contact-info">
            If you need more information? Please call us for the fastest support!
          </p>
          <div className="phone-number">
            <div className="phone-icon ">
              <Icon icon="ic:round-phone" width="24" height="24" />
            </div>
            <Link to={"tel:+19094782742"}>+1 (909)-478-2742</Link>
          </div>
          <Link to={"/contactus"}>
          <button className="contact-button">CONTACT US</button>
          </Link>
        </div>
        <div className="">
        <video width="600" loop autoPlay muted className='info-image'>
          <source src="/images/nike-ad.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>        
        </div>
      </div>
    </section>
  );
};

export default InfoSection;