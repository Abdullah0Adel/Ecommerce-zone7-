import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../context/CartContext"; // Import useCart from your context
import './CheckoutPage.css'
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast } from 'react-toastify';

const egyptCities = [
  "Cairo", "Giza", "Alexandria", "Aswan", "Luxor",
  "Mansoura", "Zagazig", "Tanta", "Suez", "Port Said"
];

const CheckoutPage = () => {
  const location = useLocation();
  const { cartItems, grandTotal } = location.state || { cartItems: [], totalPrice: 0 };
  const [phoneNumber, setPhoneNumber] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [country, setCountry] = useState("Egypt");
  const [city, setCity] = useState(egyptCities[0]);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [isProcessing, setIsProcessing] = useState(false);
  const [custName ,setCustName] = useState()  
  const navigate = useNavigate();

  // Use the context's clearCart function directly
  const { clearCart } = useCart();

  // ✅ Get user data
  const getUserId = () => {
    const user = localStorage.getItem("user");
    if (!user) return null;

    try {
      const parsedUser = JSON.parse(user);
      return parsedUser.id;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  };

  const getUserToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found!");
      return null;
    }
    return token;
  };

  const userId = getUserId();
  const userToken = getUserToken();

  // ✅ Submit order function
  const handleCheckout = async () => {
    if (!phoneNumber || !shippingAddress) {
      alert("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      alert("Order placed successfully!");
      setIsProcessing(false);
      // Would navigate or clear cart here in real implementation
    }, 1500);

    
    if (!userToken) {
      alert("User is not authenticated! Please log in.");
      return;
    }

    try {
      const orderData = {
        users_permissions_user: userId,
        items: cartItems,
        grandTotal,
        phoneNumber,
        shippingAddress,
        country,
        city,
        paymentMethod,
        custName,
        status_O: "Pending",
      };

      const response = await fetch("http://localhost:1337/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ data: orderData }),
      });

      if (response.ok) {
        // ✅ Clear cart using the context's clearCart function after successful order
        await clearCart();
        
        alert("Order Placed Successfully!");
        // ✅ Navigate to order confirmation page
        navigate("/order-confirmation");
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing your order.");
    }
  };

  return (
    <div className="container-fluid bg-light py-5">
      <div className="container">
        {/* Header */}
        <div className="mb-4 text-center">
          <h1 className="display-5 fw-bold">ACTIVEWEAR CHECKOUT</h1>
          <p className="text-muted">Complete your purchase to gear up for your next workout</p>
        </div>

        <div className="row g-4">
          {/* Shipping Information */}
          <div className="col-lg-7">
            <div className="card shadow">
              <div className="card-header  text-white py-3">
                <h2 className="h5 mb-0 d-flex align-items-center">
                  <Icon icon="mingcute:truck-line" width="24" height="24" className="me-2" /> 
                  Shipping Information
                </h2>
              </div>
              
              <div className="card-body p-4">
                <div className="mb-3">
                  <label className="form-label">Your Name *</label>
                  <div className="input-group rounded p-3">
                    <span className="text-secondary">
                      <Icon icon="fluent:person-24-regular" width="24" height="24" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your Name"
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                    />
                </div>

                </div>
                <div className="mb-3">
                  <label className="form-label">Phone Number *</label>
                  <div className="input-group rounded p-3">
                    <span className="text-secondary">
                      <Icon icon="mdi-light:phone" width="24" height="24" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Shipping Address *</label>
                  <div className="input-group rounded p-3">
                    <span className="text-secondary">
                      <Icon icon="basil:location-outline" width="24" height="24" />
                    </span>
                    <textarea
                      className="form-control"
                      placeholder="Enter your complete address"
                      rows={3}
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">City</label>
                  <select
                    className="form-select"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    {egyptCities.map((cityOption) => (
                      <option key={cityOption} value={cityOption}>
                        {cityOption}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Payment Method</label>
                  <div className="d-flex flex-column gap-2">
                    <div className="form-check border rounded p-3 d-flex align-items-center gap-4">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="payment"
                        id="cashOnDelivery"
                        value="Cash on Delivery"
                        checked={paymentMethod === "Cash on Delivery"}
                        onChange={() => setPaymentMethod("Cash on Delivery")}
                      />
                      <label className="form-check-label w-100" htmlFor="cashOnDelivery">
                        Cash on Delivery
                      </label>
                    </div>
                    <div className="form-check border rounded p-3 d-flex align-items-center gap-4">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="payment"
                        id="creditCard"
                        value="Credit Card"
                        checked={paymentMethod === "Credit Card"}
                        onChange={() => setPaymentMethod("Credit Card")}
                      />
                      <label className="form-check-label w-100 d-flex align-items-center" htmlFor="creditCard">
                        <Icon icon="quill:creditcard" width="32" height="32" className="me-2" /> Credit Card
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-5">
            <div className="card shadow mb-4">
              <div className="card-header text-white py-3">
                <h2 className="h5 mb-0 d-flex align-items-center">
                  <Icon icon="charm:shopping-bag" width="16" height="16" className="me-2" /> Order Summary
                </h2>
              </div>
              
              <div className="card-body p-4">
                <div className="mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                      <div className="flex-shrink-0 me-3">
                        <div className="bg-light rounded" style={{width: "64px", height: "64px"}}>
                    <img
                        src={
                          typeof item.image === 'string'
                            ? item.image
                            : item.image?.url
                              ? `http://localhost:1337${item.image.url}`
                              : '/images/placeholder.jpg'
                        }
                        alt={item.name}
                        className="img-fluid rounded"
                    />                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h3 className="fs-6 fw-medium">{item.name}</h3>
                        <p className="small text-muted">Qty: {item.quantity}</p>
                      </div>
                      <div className="fw-medium ">EGP {item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>

                <div className="border-top pt-3">
                  <div className="d-flex justify-content-between fw-bold fs-5 pt-2 border-top">
                    <span>Total</span>
                    <span className="text-secondary">EGP {grandTotal}</span>
                  </div>
                </div>

                <button
                  className={`btn ${isProcessing ? 'btn-secondary' : 'btn-dark'} w-100 mt-4 py-2 d-flex align-items-center justify-content-center`}
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      Complete Order <Icon icon="oui:arrow-right" width="16" height="16" className="ms-2" />
                    </>
                  )}
                </button>

                <p className="small text-muted mt-3 text-center">
                  By completing this order, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>

            {/* Order Benefits */}
            <div className="card shadow">
              <div className="card-body p-4">
                <h3 className="fw-medium mb-3">Why Shop With Us</h3>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center">
                    <div className="features-bg bg-opacity-10 rounded-circle p-2 me-3">
                      <Icon icon="mingcute:truck-line" width="24" height="24" />
                    </div>
                    <span>Free shipping on orders over EGP 1000</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="features-bg bg-opacity-10 rounded-circle p-2 me-3">
                      <Icon icon="quill:creditcard" width="24" height="24" />
                    </div>
                    <span>Secure payment processing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;