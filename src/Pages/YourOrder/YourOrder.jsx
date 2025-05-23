import React, { useEffect, useState } from "react";
import axios from "axios";
import "./YourOrder.css";

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

        const response = await axios.get(
          `http://localhost:1337/api/orders?filters[users_permissions_user]=${userId}&populate=*`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API Response:", response.data);
        
        if (response.data && response.data.data) {
          // Check the actual structure of the orders data
          const ordersData = response.data.data;
          console.log("Orders data:", ordersData);
          
          // Transform data if needed - looking at your console log, we need to handle items differently
          const processedOrders = ordersData.map(order => {
            // Print the raw order data to see its structure
            console.log("Raw order data:", order);
            return order;
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

  // Add debug information to the UI
  if (loading) return <p>Loading your orders...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  
  console.log("Orders state:", orders);
  
  if (!orders || orders.length === 0) {
    return (
      <div className="container my-5">
        <h2>Your Orders</h2>
        <div className="alert alert-info">
          <p>No orders found. This could be due to:</p>
          <ul>
            <li>You haven't placed any orders yet</li>
            <li>User authentication issue - try logging out and back in</li>
          </ul>
          <p><strong>Authentication:</strong> {getUserToken() ? "loged in" : "you have to login"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2>Your Orders</h2>

      {orders.map((order) => {
        // Destructure safely to avoid reference errors
        const { id } = order;
        const attributes = order || {};
        
        // Log the entire attributes object to see its structure
        console.log(`Order ${id} attributes:`, attributes);
        
        // Check if items exist in a nested structure
        let items = [];
        if (attributes.items) {
          items = attributes.items;
        } else if (attributes.products && Array.isArray(attributes.products.data)) {
          // Try to use products if available (common in Strapi structure)
          items = attributes.products.data.map(product => {
            const productAttributes = product.attributes || {};
            return {
              name: productAttributes.name || "Unknown product",
              price: productAttributes.price || 0,
              quantity: productAttributes.quantity || 1
            };
          });
        }
        
        console.log(`Order ${id} processed items:`, items);
        
        const totalPrice = attributes.totalPrice || 0;
        const status_O = attributes.status_O || "Pending";
        const createdAt = attributes.createdAt || new Date().toISOString();

        return (
          <div key={id} className="card mb-4 p-3">
            <h4 className="mb-3">Order ID: {id}</h4>
            <p><strong>Order Date:</strong> {new Date(createdAt).toLocaleDateString()}</p>

            {/* Order Status Bar */}
            <div className="order-status-bar mb-4">
              {orderStages.map((stage, index) => (
                <div
                  key={stage}
                  className={`status-item ${index <= getStatusIndex(status_O) ? "active" : ""}`}
                >
                  <span>{stage}</span>
                  {index < orderStages.length - 1 && <div className="divider" />}
                </div>
              ))}
            </div>

            {/* Items Summary */}
            <div className="card p-3">
              <h5>Items:</h5>
              {items && items.length > 0 ? (
                items.map((item, idx) => {
                  console.log("Item data:", item);
                  const name = item.name || (item && item.name) || "Unnamed item";
                  const price = item.price || (item && item.price) || 0;
                  const quantity = item.quantity || (item && item.quantity) || 1;
                  
                  return (
                    <div key={idx} className="d-flex justify-content-between mb-2">
                      <span>{name} (x{quantity})</span>
                      <span>EGP {price * quantity}</span>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted">No items found for this order.</p>
              )}
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total:</span>
                <span>EGP {order.grandTotal}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default YourOrder;