import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Newsletter.css'; 

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
      // Reset after 3 seconds
    //   setTimeout(() => {
    //     setIsSubmitted(false);
    //     setEmail('');
    //   }, 3000);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-4" style={{ backgroundColor: '#f8f9fa' }}>
      <div 
        className="newsletter-bg  w-100 rounded-4 position-relative overflow-hidden shadow-lg "

      >
        {/* Cannabis leaf background pattern */}
        <div 
          className="position-absolute w-100 h-100" />
        <div className="position-absolute top-50 start-50 translate-middle text-center w-100 px-4">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-white mb-4 fw-bold" style={{ fontSize: '2.5rem' }}>
                  Sign Up For Our Newsletter
                </h1>
                <p className="text-light mb-4" style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod torus tempor incididunter.
                </p>
                
                <div className="mx-auto" style={{ maxWidth: '500px' }}>
                  <div className="d-flex rounded-pill overflow-hidden shadow-sm">
                    <input
                      type="email"
                      className="form-control border-0 py-3 px-4"
                      placeholder="Enter Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                      style={{
                        fontSize: '1rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0
                      }}
                    />
                    <button
                      onClick={handleSubmit}
                      className="btn text-white fw-bold px-4"
                      style={{
                        backgroundColor: '#0d5d4a',
                        borderColor: '#0d5d4a',
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        minWidth: '120px',
                        fontSize: '0.95rem',
                        letterSpacing: '0.5px'
                      }}
                    >
                      SUBMIT
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <div className="mb-3">
                    <svg 
                      width="80" 
                      height="80" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      className="text-success"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22,4 12,14.01 9,11.01"/>
                    </svg>
                  </div>
                  <h2 className="text-white mb-3 fw-bold" style={{ fontSize: '2.2rem' }}>
                    Thanks for subscribing
                  </h2>
                  <p className="text-light" style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod torus tempor incididunter.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;