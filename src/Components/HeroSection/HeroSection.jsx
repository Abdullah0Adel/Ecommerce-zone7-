import React, { useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles

// Import required Swiper modules
import { FreeMode, Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
// Import icons
import { ChevronLeft, ChevronRight } from 'lucide-react';

import styles from "./HeroSection.module.css";
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Slider data
  const slides = [
    {
      id: 1,
      image: "/public/images/stadium.jpg",
      title: "Gear Up for Greatness",
      subtitle: "Own the moment—on the pitch or in the stands",
      description: "Evokes the grand experience of the game, whether you're playing or watching.",
      buttonText: "Shop Now",
      bgColor: "rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)", // dark green with opacity
    },
    {
      id: 2,
      image: "/public/images/running.jpg",
      title: "Every Step Counts",
      subtitle: "Engineered to move with you—no matter the pace.",
      description: "Motivational and personalized, perfect for fitness wear or running gear promotions.",
      buttonText: "Browse to level up",
      bgColor: "rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)", // emerald with opacity
    },
    {
      id: 3,
      image: "/public/images/ad.jpg",
      title: "Power. Pride. Performance",
      subtitle: "Unleash your inner champion with elite gear worn by the best.",
      description: "Conveys elite, professional-level quality and aspiration by showing famous footballers.",
      buttonText: "See What's New",
      bgColor: "rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)", // green with opacity
    }
  ];

  return (
    <div className={styles.heroSlider}>
      <Swiper
        spaceBetween={0}
        effect={'fade'}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className={styles.swiperContainer}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id} className={styles.heroSlide}>
            {/* Background Image with Gradient Overlay */}
            <div className={styles.slideBg}>
              <img 
                src={slide.image} 
                alt={slide.title} 
                className={styles.slideImg} 
              />
              <div 
                className={styles.slideOverlay} 
                style={{ background: `linear-gradient(to right, ${slide.bgColor}, transparent)` }}
              ></div>
            </div>
            
            {/* Slide Content */}
            <div className={styles.slideContent}>
              <div className={styles.contentContainer}>
                <div className={styles.contentWrapper}>
                  <div>
                    <span className={`${styles.slideBadge} ${activeIndex === index ? styles.slideInRight : styles.inactive}`}>
                      {slide.subtitle}
                    </span>
                  </div>
                  
                  <h2 className={`${styles.slideTitle} ${activeIndex === index ? styles.slideInLeft : styles.inactive}`}>
                    {slide.title}
                  </h2>
                  
                  <p className={`${styles.slideDescription} ${activeIndex === index ? styles.slideInRight : styles.inactive}`}>
                    {slide.description}
                  </p>
                  
                  <div className={`${styles.buttonContainer} ${activeIndex === index ? styles.slideInLeft : styles.inactive}`}>
                    <Link to={"/shop"}>
                    <button className={`${styles.slideButton} border-0 rounded-pill`}>
                      {slide.buttonText}
                    </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>  
  );
};

export default HeroSection;