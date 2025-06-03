// Login.jsx - Modern Sports-Themed Login Component
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useCart } from '../../context/CartContext';
import './Login.css';
import { Icon } from '@iconify/react/dist/iconify.js';

const LoginSchema = Yup.object().shape({
  identifier: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { mergeCartsOnLogin } = useCart();

  const handleLogin = async (values, { setSubmitting, resetForm }) => {
    setIsLoading(true);
    const url = `http://localhost:1337/api/auth/local`;
    
    try {
      const { data } = await axios.post(url, values);
      
      Cookies.set('token', data.jwt, { expires: 7 });
      localStorage.setItem('token', data.jwt);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Merge any items in local cart with the user's cart
      if (mergeCartsOnLogin) {
        await mergeCartsOnLogin(data.user.id);
      }
      
      toast.success('Welcome back! 🎉');
      resetForm();
      navigate("/");
    } catch (error) {
      const msg = error.response?.data?.error?.message || 'Login failed. Please try again.';
      toast.error(msg);
      console.error('Login error:', error.response?.data?.error?.message);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container-fluid h-100">
        <div className="row h-100">
          {/* Left Side - Form */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center p-4">
            <div className="login-form-container">
              {/* Logo */}
              <div className="text-center mb-4">
                <img 
                  src="/images/Zone7.png" 
                  alt="Zone7 Logo" 
                  className="login-logo mb-3"
                />
                <h1 className="login-title">Welcome Back</h1>
                <p className="login-subtitle">Sign in to your Zone7 account</p>
              </div>

              {/* Formik Form */}
              <Formik
                initialValues={{ identifier: '', password: '' }}
                validationSchema={LoginSchema}
                onSubmit={handleLogin}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form className="login-form">
                    {/* Email Field */}
                    <div className="form-group  mb-3 ">
                      <label className="form-label">Email Address</label>
                      <div className="input-group rounded">
                        <span className="input-group-text">
                          <Icon icon="ix:e-mail" width="24" height="24" />
                        </span>
                        <Field
                          type="email"
                          name="identifier"
                          className={`form-control ${
                            errors.identifier && touched.identifier ? 'is-invalid' : ''
                          }`}
                          placeholder="Enter your email"
                        />
                      </div>
                      <ErrorMessage 
                        name="identifier" 
                        component="div" 
                        className="invalid-feedback d-block" 
                      />
                    </div>

                    {/* Password Field */}
                    <div className="form-group  mb-4">
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
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary border-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <Icon icon="mdi:eye" width="24" height="24"/>
                        </button>
                      </div>
                      <ErrorMessage 
                        name="password" 
                        component="div" 
                        className="invalid-feedback d-block" 
                      />
                    </div>

                    {/* Forgot Password Link */}
                    <div className="text-end mb-3">
                      <Link to="/forgot-password" className="forgot-password-link">
                        Forgot Password?
                      </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting || isLoading}
                      className="btn btn-primary w-100 login-btn"
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Signing In...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-in-alt me-2"></i>
                          Sign In
                        </>
                      )}
                    </button>

                    {/* Register Link */}
                    <div className="text-center mt-4">
                      <p className="register-link">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-decoration-none">
                          Create Account
                        </Link>
                      </p>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>

          {/* Right Side - Hero Image */}
          <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center sports-hero">
            <div className="hero-content text-center text-white">
              <h2 className="hero-title">Gear Up for Greatness</h2>
              <p className="hero-subtitle">
                Discover premium sportswear designed for champions like you
              </p>
              <div className="hero-features">
                <div className="feature-item">
                  <i className="fas fa-shipping-fast"></i>
                  <span>Free Shipping</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-medal"></i>
                  <span>Premium Quality</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-users"></i>
                  <span>Trusted by Athletes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}