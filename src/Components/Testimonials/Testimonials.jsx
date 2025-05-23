import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Icon } from '@iconify/react';
import './Testimonials.css'

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const TestimonialsCarousel = () => {
  const testimonials = [
    {
      id: 1,
      name: "Luis Williams",
      role: "Wellness Coaches",
      text: "I've found Edens Garden Cannabis Essential Oil to be a great addition to my skincare routine. It has a soothing effect on my skin and helps reduce redness and inflammation.",
      rating: 5,
      avatar: "/images/pic1.jpg"
    },
    {
      id: 2,
      name: "Mary Fields",
      role: "Holistic Practitioners",
      text: "I appreciate that Edens Garden Cannabis Essential Oil is 100% pure therapeutic grade. It gives me peace of mind knowing that I'm using a high-quality product.",
      rating: 4,
      avatar: "/images/pic2.jpg"
    },
    {
      id: 3,
      name: "Alvin Johnson",
      role: "Skincare Professionals",
      text: "I use this oil in my diffuser, and it creates a wonderfully calming atmosphere in my home. The earthy aroma is very pleasant and helps me unwind after a long day.",
      rating: 5,
      avatar: "/images/pic3.jpg"
    },
        {
      id: 3,
      name: "Alvin Johnson",
      role: "Skincare Professionals",
      text: "I use this oil in my diffuser, and it creates a wonderfully calming atmosphere in my home. The earthy aroma is very pleasant and helps me unwind after a long day.",
      rating: 5,
      avatar: "/images/pic4.jpg"
    },
    {
          id: 2,
      name: "Mary Fields",
      role: "Holistic Practitioners",
      text: "I appreciate that Edens Garden Cannabis Essential Oil is 100% pure therapeutic grade. It gives me peace of mind knowing that I'm using a high-quality product.",
      rating: 4,
      avatar: "/images/pic2.jpg"
    },

  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon
          key={i}
          icon={i <= rating ? "material-symbols:star" : "material-symbols:star-outline"}
          className={`star ${i <= rating ? "filled" : "empty"} `}
        />
      );
    }
    return stars;
  };

  return (
    <div className="testimonials-section">
      <div className="container-fluid">
        <div className="text-center mb-5">
          <h2 className="testimonials-title">Testimonials</h2>
          <p className="testimonials-subtitle">Stories of Satisfaction and Delight from Our Esteemed Clients</p>
        </div>
        
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet custom-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active custom-bullet-active'
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="testimonials-swiper"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="testimonial-card rounded">
                <div className="top-color"></div>
                <div className="quote-icon">
                  <Icon icon="clarity:block-quote-line" width="36" height="36" />
                </div>
                <div className="testimonial-content d-flex gap-3">
                  <div className="testimonial-header">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="testimonial-avatar"
                    />
                  </div>
                  <div>
                    <div className="testimonial-info">
                      <h5 className="testimonial-name">{testimonial.name}</h5>
                      <p className="testimonial-role">{testimonial.role}</p>
                    </div>

                  <p className="testimonial-text">{testimonial.text}</p>
                  <div className="testimonial-rating">
                    {renderStars(testimonial.rating)}
                  </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </div>
  );
};

export default TestimonialsCarousel;