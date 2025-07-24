import React from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react/dist/iconify.js';
import './CartPage.css';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../Data/BASE_URL';

export default function CartPage() {


const { 
  cartItems, 
  updateCartItem, 
  removeFromCart, 
  totalPrice, 
  shippingCost,
  hasFreeShipping 
} = useCart();

const navigate = useNavigate();

const handleProceedToCheckout = () => {
  navigate('/checkout', { state: { cartItems, grandTotal } });
};

  // Handle quantity change
const handleQuantityChange = (item, newQuantity) => {
  if (newQuantity < 1) newQuantity = 1;
  if (newQuantity > item.maxStock) newQuantity = item.maxStock;
  
  if (updateCartItem) {
    updateCartItem(item.cartItemId, { quantity: newQuantity });
  } else {
    console.error('updateCartItem is not defined');
  }
};

  // Calculate subtotal for each item
  const calculateItemSubtotal = (price, quantity) => {
    return (price * quantity).toFixed(2);
  };

  // Calculate grand total
const actualShippingCost = hasFreeShipping ? 0 : shippingCost;
const grandTotal = totalPrice + actualShippingCost;

  // Calculate how much more needed for free shipping
  const amountForFreeShipping = 1000 - totalPrice;

  return (
    <div className="cart-page container my-5 pt-5">
      <h2 className="mb-4">Shopping Cart</h2>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart text-center py-5">
          <Icon icon="mdi:cart-off" width="64" height="64" className="text-muted mb-3" />
          <h3>Your cart is empty</h3>
          <p className="mb-4">Looks like you haven't added any items to your cart yet.</p>
          <Link to="/shop" className="btn btn-primary continue-shooping">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-8">
            {/* Free shipping progress bar */}
            <div className="shipping-progress mb-4">
              <div className="progress" style={{ height: '10px' }}>
                <div 
                  className="progress-bar bg-success" 
                  role="progressbar" 
                  style={{ width: `${Math.min(totalPrice / 10, 100)}%` }}
                  aria-valuenow={Math.min(totalPrice / 10, 100)} 
                  aria-valuemin="0" 
                  aria-valuemax="100"
                ></div>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <span>EGP 0</span>
                <span>EGP 1000</span>
              </div>
              
              {hasFreeShipping ? (
                <div className="alert alert-success mt-2">
                  <Icon icon="mdi:truck-check" className="me-2" />
                  Congratulations! You've qualified for free shipping!
                </div>
              ) : (
                <div className="alert alert-info mt-2">
                  <Icon icon="mdi:truck-fast" className="me-2" />
                  Add EGP {amountForFreeShipping.toFixed(2)} more to qualify for FREE shipping!
                </div>
              )}
            </div>

            {/* Cart Items */}
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="cart-item mb-3 p-3 border rounded">
                  <div className="row align-items-center">
                    <div className="col-md-2 col-4">
                    <img
                        src={
                          typeof item.image === 'string'
                            ? item.image
                            : item.image?.url
                              ? `${item.image.url}`
                              //modified
                              : '/images/placeholder.jpg'
                        }
                        alt={item.name}
                        className="img-fluid rounded"
                    />

                    </div>
                    <div className="col-md-4 col-8">
                      <h5>{item.name}</h5>
                      <p className="text-muted">Size: {item.size}</p>
                      <p className="price">EGP {item.price.toFixed(2)}</p>
                    </div>
                    <div className="col-md-3 col-6 mt-md-0 mt-3">
                      <div className="quantity-control cart-quantity">
                        <button 
                          className="quantity-btn quantity-minus"
                          onClick={() => handleQuantityChange(item, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="quantity-input"
                          value={item.quantity}
                          readOnly
                        />
                        <button 
                          className="quantity-btn quantity-plus"
                          onClick={() => handleQuantityChange(item, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                        >
                          +
                        </button>
                      </div>
                      {item.quantity === item.maxStock && (
                        <small className="text-danger d-block">Max stock</small>
                      )}
                    </div>
                    <div className="col-md-2 col-6 text-md-right text-center mt-md-0 mt-3">
                      <p className="subtotal fw-bold">
                        EGP {calculateItemSubtotal(item.price, item.quantity)}
                      </p>
                    </div>
                    <div className="col-md-1 col-12 text-center mt-3 mt-md-0">
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeFromCart(item.cartItemId)}
                      >
                        <Icon icon="mdi:delete" width="20" height="20" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className=" mt-4">
              <Link to="/shop" className="btn btn-outline-primary continue-shooping">
                <Icon icon="mdi:arrow-left" className="me-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
          
          {/* Cart Summary */}
          <div className="col-lg-4 mt-4 mt-lg-0">
            <div className="cart-summary p-4 border rounded">
              <h3 className="mb-4">Order Summary</h3>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>EGP {totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-3">
                <span>Shipping</span>
                {hasFreeShipping ? (
                  <span className="text-success">FREE</span>
                ) : (
                  <span>EGP {shippingCost.toFixed(2)}</span>
                )}
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between mb-4 fw-bold">
                <span>Total</span>
                {hasFreeShipping ? (
                    <span>EGP {totalPrice.toFixed(2)}</span>

                ) :(
                  <span>EGP {grandTotal.toFixed(2)}</span>
                )}
              </div>
              
              <button className="btn btn-primary proceed-btn w-100 py-2" onClick={handleProceedToCheckout}>
                Proceed to Checkout
              </button>
              
              <div className="payment-methods mt-4">
                <p className="text-center mb-2">We Accept</p>
                <div className="d-flex flex-lg-row flex-column align-items-center justify-content-center gap-2 pament-icons">
                  <span>
                  <img src="/images/instapay.png" alt="Instapay" height="30" />
                  </span>
                  <span>
                  <img src="/images/vodafon cash.png" alt="Vodafone Cash" height="30" />
                  </span>
                  <span>
                  <img src="/images/visa.png" alt="Visa" height="30" />
                  </span>
                  <span>
                  <img src="/images/mastercard.png" alt="Mastercard" height="30" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}