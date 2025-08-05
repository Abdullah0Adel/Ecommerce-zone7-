// Register.jsx - Modern Sports-Themed Register Component
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useCart } from '../../context/CartContext';
import './Register.css';
import { Icon } from '@iconify/react/dist/iconify.js';
import BASE_URL from '../../Data/BASE_URL';

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { mergeCartsOnLogin } = useCart();

  const handleRegister = async (values, { setSubmitting, resetForm }) => {
    setIsLoading(true);
    const url = `${BASE_URL}/api/auth/local/register`;
    
    try {
      const { username, email, password } = values;
      const { data } = await axios.post(url, { username, email, password });
      
      
      // Save user data in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.jwt);

      
      // Merge any items in local cart with the new user's cart
      if (mergeCartsOnLogin) {
        await mergeCartsOnLogin(data.user.id);
      }
      
      toast.success('Account created successfully! Welcome to Zone7! 🎉');
      resetForm();
      navigate("/");
    } catch (error) {
      const msg = error.response?.data?.error?.message || 'Registration failed. Please try again.';
      toast.error(msg);
      console.error('Registration error:', error.response?.data?.error?.message);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="register-page">
      <div className="container-fluid h-100">
        <div className="row h-100">
          {/* Left Side - Hero Image */}
          <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center sports-hero">
            <div className="hero-content text-center text-white">
              <h2 className="hero-title">Join the Zone7 Family</h2>
              <p className="hero-subtitle">
                Create your account and start your journey to peak performance
              </p>
              <div className="hero-features">
                <div className="feature-item">
                  <i className="fas fa-star"></i>
                  <span>Exclusive Collections</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-gift"></i>
                  <span>Member Rewards</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-headset"></i>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center p-4">
            <div className="register-form-container">
              {/* Logo */}
              <div className="text-center mb-4">
                <img 
                  src="/images/Zone7.png" 
                  alt="Zone7 Logo" 
                  className="register-logo mb-3"
                />
                <h1 className="register-title">Create Account</h1>
                <p className="register-subtitle">Join thousands of athletes worldwide</p>
              </div>

              {/* Formik Form */}
              <Formik
                initialValues={{ 
                  username: '', 
                  email: '', 
                  password: '', 
                  confirmPassword: '' 
                }}
                validationSchema={RegisterSchema}
                onSubmit={handleRegister}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form className="register-form">
                    {/* Username Field */}
                    <div className="form-group  mb-3">
                      <label className="form-label">Username</label>
                      <div className="input-group rounded">
                        <span className="input-group-text">
                          <Icon icon="mdi:user" width="24" height="24" />
                        </span>
                        <Field
                          type="text"
                          name="username"
                          className={`form-control ${
                            errors.username && touched.username ? 'is-invalid' : ''
                          }`}
                          placeholder="Enter your username"
                        />
                      </div>
                      <ErrorMessage 
                        name="username" 
                        component="div" 
                        className="invalid-feedback d-block" 
                      />
                    </div>

                    {/* Email Field */}
                    <div className="form-group mb-3">
                      <label className="form-label">Email Address</label>
                      <div className="input-group rounded">
                        <span className="input-group-text">
                          <Icon icon="ix:e-mail" width="24" height="24" />
                        </span>
                        <Field
                          type="email"
                          name="email"
                          className={`form-control ${
                            errors.email && touched.email ? 'is-invalid' : ''
                          }`}
                          placeholder="Enter your email"
                        />
                      </div>
                      <ErrorMessage 
                        name="email" 
                        component="div" 
                        className="invalid-feedback d-block" 
                      />
                    </div>

                    {/* Password Field */}
                    <div className="form-group mb-3">
                      <label className="form-label">Password</label>
                      <div className="input-group rounded">
                        <span className="input-group-text">
                          <Icon icon="material-symbols:lock" width="24" height="24" />
                        </span>
                        <Field
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          className={`form-control ${
                            errors.password && touched.password ? 'is-invalid' : ''
                          }`}
                          placeholder="Create a password"
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary border-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <Icon icon="mdi:eye" width="24" height="24" className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}/>
                        </button>
                      </div>
                      <ErrorMessage 
                        name="password" 
                        component="div" 
                        className="invalid-feedback d-block" 
                      />
                    </div>

                    {/* Confirm Password Field */}
                    <div className="form-group mb-4">
                      <label className="form-label">Confirm Password</label>
                      <div className="input-group rounded">
                        <span className="input-group-text">
                          <Icon icon="material-symbols:lock" width="24" height="24" />
                        </span>
                        <Field
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          className={`form-control ${
                            errors.confirmPassword && touched.confirmPassword ? 'is-invalid' : ''
                          }`}
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary border-0"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          <Icon icon="mdi:eye" width="24" height="24" className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}/>
                        </button>
                      </div>
                      <ErrorMessage 
                        name="confirmPassword" 
                        component="div" 
                        className="invalid-feedback d-block" 
                      />
                    </div>

                    {/* Terms & Conditions */}
                    <div className="form-check mb-4">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="terms"
                        required
                      />
                      <label className="form-check-label" htmlFor="terms">
                        I agree to the{' '}
                        <Link to="#" className="text-decoration-none">
                          Terms & Conditions
                        </Link>{' '}
                        and{' '}
                        <Link to="#" className="text-decoration-none">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting || isLoading}
                      className="btn btn-primary w-100 register-btn"
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-user-plus me-2"></i>
                          Create Account
                        </>
                      )}
                    </button>

                    {/* Login Link */}
                    <div className="text-center mt-4">
                      <p className="login-link">
                        Already have an account?{' '}
                        <Link to="/login" className="text-decoration-none">
                          Sign In
                        </Link>
                      </p>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}