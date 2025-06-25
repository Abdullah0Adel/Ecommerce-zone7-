import React, { useEffect, useState } from "react";
import axios from "axios";
import "./YourOrder.css";
import { Icon } from "@iconify/react/dist/iconify.js";
import BASE_URL from "../../Data/BASE_URL";

const orderStages = ["Pending", "Processing", "Shipped", "Delivered"];

const YourOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUserToken = () => {
    return localStorage.getItem("token");
  };

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

  const userId = getUserId();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        setError("User ID not found. Please log in again.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const token = getUserToken();
        if (!token) {
          setError("Authentication token not found. Please log in again.");
          setLoading(false);
          return;
        }

        console.log("Fetching orders for user:", userId);

        // Enhanced API call with deeper population to get product images and details
        const response = await axios.get(
          `${BASE_URL}orders?filters[users_permissions_user]=${userId}&populate`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API Response:", response.data);
        
        if (response.data && response.data.data) {
          const ordersData = response.data.data;
          console.log("Orders data:", ordersData);
          
          // Process orders to extract product information with images
          const processedOrders = ordersData.map(order => {
            console.log("Raw order data:", order);
            
            // Extract items from the JSON field or direct relation
            let items = [];
            const attributes = order || {};
            
            if (attributes.items) {
              // If items is a JSON field, parse it and enhance with product data
              try {
                const itemsData = typeof attributes.items === 'string' 
                  ? JSON.parse(attributes.items) 
                  : attributes.items;
                
                items = Array.isArray(itemsData) ? itemsData : [];
              } catch (e) {
                console.error("Error parsing items JSON:", e);
                items = [];
              }
            }
            
            // Return processed order with enhanced structure
            return {
              ...order,
              processedItems: items
            };
          });
          
          setOrders(processedOrders);
        } else {
          console.warn("No orders data found in response");
          setOrders([]);
        }
        
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setError("Failed to load your orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const getStatusIndex = (status) => {
    return orderStages.indexOf(status) !== -1 ? orderStages.indexOf(status) : 0;
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      "Pending": "bg-warning text-dark",
      "Processing": "bg-primary text-white", 
      "Shipped": "bg-info text-white",
      "Delivered": "bg-success text-white"
    };
    return classes[status] || "bg-secondary text-white";
  };

  // Get product image URL from Strapi
const getProductImageUrl = (item) => {
  const thumbnailUrl = item?.image?.formats?.thumbnail?.url || item?.image?.url;
  return thumbnailUrl 
    ? (thumbnailUrl.startsWith("http") ? thumbnailUrl : `${BASE_URL}${thumbnailUrl}`) 
    : null;
};

  // Loading Component
  if (loading) {
    return (
      <>
        <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{background: 'linear-gradient(135deg, #f0f4ff 0%, #e6f0ff 100%)'}}>
          <div className="text-center">
            <div className="spinner-border spinner-border-custom text-primary mb-4" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h4 className="text-muted">Loading your orders...</h4>
          </div>
        </div>
      </>
    );
  }

  // Error Component
  if (error) {
    return (
      <>
        <div className="min-vh-100 py-5" style={{background: 'linear-gradient(135deg, #f0f4ff 0%, #e6f0ff 100%)'}}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="card shadow-lg border-0 rounded-4">
                  <div className="card-body text-center p-5">
                    <div className="bg-danger bg-opacity-10 rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center" style={{width: '80px', height: '80px'}}>
                      <i className="bi bi-exclamation-triangle text-danger" style={{fontSize: '2rem'}}></i>
                    </div>
                    <h3 className="card-title mb-3">Oops! Something went wrong</h3>
                    <p className="text-danger fw-semibold">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  console.log("Orders state:", orders);

  // No Orders Component
  if (!orders || orders.length === 0) {
    return (
      <>
        <div className="min-vh-100 py-5" style={{background: 'linear-gradient(135deg, #f0f4ff 0%, #e6f0ff 100%)'}}>
          <div className="container">
            <div className="text-center mb-5">
              <h1 className="display-4 fw-bold text-dark mb-3">Your Orders</h1>
              <p className="lead text-muted">Track and manage your order history</p>
            </div>
            
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="card shadow-lg border-0 rounded-4">
                  <div className="card-body text-center p-5">
                    <div className="bg-primary bg-opacity-10 rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center" style={{width: '120px', height: '120px'}}>
                      <i className="bi bi-bag text-primary" style={{fontSize: '3rem'}}></i>
                    </div>
                    <h3 className="card-title mb-4">No orders yet</h3>
                    <p className="text-muted mb-4">You haven't placed any orders yet. Start shopping to see your orders here!</p>
                    
                    <div className="bg-light rounded-3 p-4 mb-4">
                      <h5 className="fw-semibold text-dark mb-3">Possible reasons:</h5>
                      <ul className="list-unstyled text-start text-muted">
                        <li className="d-flex align-items-center mb-2">
                          <div className="bg-primary rounded-circle me-3" style={{width: '8px', height: '8px'}}></div>
                          You haven't placed any orders yet
                        </li>
                        <li className="d-flex align-items-center">
                          <div className="bg-primary rounded-circle me-3" style={{width: '8px', height: '8px'}}></div>
                          User authentication issue - try logging out and back in
                        </li>
                      </ul>
                    </div>
                    
                    <span className={`badge rounded-pill px-3 py-2 ${getUserToken() ? 'bg-success' : 'bg-danger'}`}>
                      <div className={`bg-white rounded-circle d-inline-block me-2`} style={{width: '8px', height: '8px'}}></div>
                      {getUserToken() ? "Logged in" : "Please log in"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-vh-100 py-5 mt-5" style={{background: 'linear-gradient(135deg,rgb(243, 255, 250) 0%,rgb(235, 255, 250) 100%)'}}>
        <div className="container">
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-dark mb-3">Your Orders</h1>
            <p className="lead text-muted">Track and manage your order history</p>
          </div>

          {/* Orders List */}
          <div className="row g-4">
            {orders.map((order, orderIndex) => {
              const { id } = order;
              const attributes = order || {};
              
              console.log(`Order ${id} attributes:`, attributes);
              
              // Use processedItems from our enhanced order processing
              const items = order.processedItems || [];
              
              console.log(`Order ${id} processed items:`, items);
              
              const grandTotal = attributes.grandTotal || 0;
              const status_O = attributes.status_O || "Pending";
              const createdAt = attributes.createdAt || new Date().toISOString();
              const currentStatusIndex = getStatusIndex(status_O);
              const custName = attributes.custName || "Customer";
              const phoneNumber = attributes.phoneNumber || "";
              const shippingAddress = attributes.shippingAddress || "";
              const city = attributes.city || "";
              const country = attributes.country || "";
              const paymentMethod = attributes.paymentMethod || "";

              return (
                <div key={id} className="col-12">
                  <div className="card shadow-lg border-0 rounded-4 overflow-hidden fade-in" style={{animationDelay: `${orderIndex * 0.1}s`}}>
                    {/* Order Header */}
                    <div className="gradient-bg text-white p-4">
                      <div className="d-flex justify-content-between align-items-start flex-wrap">
                        <div>
                          <h3 className="fw-bold mb-2">Order #{id}</h3>
                          <p className="mb-1 opacity-75">
                            Customer: {custName}
                          </p>
                          <p className="mb-0 opacity-75">
                            Placed on {new Date(createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <span className={`badge rounded-pill px-3 py-2 fs-6 ${getStatusBadgeClass(status_O)}`}>
                          {status_O}
                        </span>
                      </div>
                    </div>

                    <div className="card-body p-4 p-md-5">
                      {/* Progress Bar */}
                      <div className="mb-5">
                        <div className="d-flex align-items-center justify-content-between mb-4">
                          {orderStages.map((stage, index) => (
                            <div key={stage} className="d-flex align-items-center flex-fill">
                              <div className="d-flex flex-column align-items-center">
                                <div className={`progress-circle ${index <= currentStatusIndex ? 'completed' : 'pending'}`}>
                                  {index <= currentStatusIndex ? (
                                    <Icon icon="clarity:success-line" width="20" height="20" />
                                  ) : (
                                    index + 1
                                  )}
                                </div>
                                <small className={`mt-2 fw-medium ${index <= currentStatusIndex ? 'text-success' : 'text-muted'}`}>
                                  {stage}
                                </small>
                              </div>
                              {index < orderStages.length - 1 && (
                                <div className={`progress-line ${index < currentStatusIndex ? 'completed' : 'pending'}`}></div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="row mb-4">
                        <div className="col-md-6">
                          <div className="bg-light rounded-3 p-3 h-100">
                            <h6 className="fw-semibold text-dark mb-3">
                              <i className="bi bi-person me-2 text-primary"></i>
                              Customer Information
                            </h6>
                            <p className="mb-1"><strong>Name:</strong> {custName}</p>
                            {phoneNumber && <p className="mb-1"><strong>Phone:</strong> {phoneNumber}</p>}
                            {paymentMethod && <p className="mb-0"><strong>Payment:</strong> {paymentMethod}</p>}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="bg-light rounded-3 p-3 h-100">
                            <h6 className="fw-semibold text-dark mb-3">
                              <i className="bi bi-geo-alt me-2 text-primary"></i>
                              Shipping Address
                            </h6>
                            {shippingAddress && <p className="mb-1">{shippingAddress}</p>}
                            {city && <p className="mb-1">{city}</p>}
                            {country && <p className="mb-0">{country}</p>}
                            {!shippingAddress && !city && !country && <p className="text-muted mb-0">No address provided</p>}
                          </div>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="bg-light rounded-3 p-4">
                        <h5 className="fw-semibold text-dark mb-4 d-flex align-items-center">
                          <i className="bi bi-bag me-2 text-primary"></i>
                          Order Items
                        </h5>
                        
                        {items && items.length > 0 ? (
                          <div className="row g-3">
                            {items.map((item, idx) => {
                              console.log("Item data:", item);
                              const name = item.name || "Unnamed item";
                              const price = item.price || 0;
                              const quantity = item.quantity || 1;
                              const product = item.product;
                              const imageUrl = getProductImageUrl(item);
                              
                              return (
                                <div key={idx} className="col-12">
                                  <div className="item-card bg-white rounded-3 p-3">
                                    <div className="d-flex flex-lg-row flex-column justify-content-between align-items-center">
                                      <div className="d-flex justify-content-center flex-md-row  flex-column align-items-center">
                                        {imageUrl ? (
                                          <img 
                                            src={imageUrl} 
                                            alt={name}
                                            className="product-image me-3 h-100"
                                            onError={(e) => {
                                              e.target.style.display = 'none';
                                              e.target.nextSibling.style.display = 'flex';
                                            }}
                                          />
                                        ) : null}                                       
                                        <div className={`product-image-placeholder me-3 ${imageUrl ? 'd-none' : ''}`}>
                                          <i className="bi bi-image text-muted"></i>
                                        </div>
                                        <div className="text-center text-md-start">
                                          <h6 className="fw-semibold text-dark mb-1 text-center">{name}</h6>
                                          <small className="text-muted">Quantity: {quantity}</small>
                                        </div>
                                      </div>
                                      <div className="text-end">
                                        <div className="fw-bold text-dark">EGP {(price * quantity).toFixed(2)}</div>
                                        <small className="text-muted">EGP {price.toFixed(2)} each</small>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-5">
                            <i className="bi bi-inbox text-muted mb-3" style={{fontSize: '3rem'}}></i>
                            <p className="text-muted">No items found for this order.</p>
                          </div>
                        )}
                        
                        {/* Total */}
                        <div className="border-top mt-4 pt-4">
                          <div className="d-flex justify-content-between align-items-center">
                            <h5 className="fw-semibold text-dark mb-0">Order Total:</h5>
                            <h4 className="fw-bold text-primary mb-0">EGP {grandTotal.toFixed(2)}</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default YourOrder;