// CartBar.jsx - Updated to show cart items count and improve UX
import React from 'react';
import './CartBar.css';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; // Import cart context

export default function CartBar() {
  const { 
    cartItems, 
    updateCartItem, 
    removeFromCart, 
    totalPrice, 
    shippingCost,
    hasFreeShipping 
  } = useCart();
  const grandTotal = totalPrice + shippingCost;

  // Calculate total quantity of items (not just unique items)
  const itemCount = cartItems.length/* reduce((total, item) => total + item.length , 0) */;
  



    // Handle quantity change
    const handleQuantityChange = (item, newQuantity) => {
      // Ensure quantity is within valid range
      if (newQuantity < 1) newQuantity = 1;
      if (newQuantity > item.maxStock) newQuantity = item.maxStock;
      
      updateCartItem(item.cartItemId, { quantity: newQuantity });
    };

    

  return (
    <div className='cartBara-content'>
      <Link to="/cartpage" className='text-decoration-none'>
        <div className="cart-head d-flex gap-3 align-items-center position-relative">
          <div className="cart-icon-wrapper position-relative">
            <Icon 
              className='text-dark text-decoration-none' 
              icon="hugeicons:shopping-cart-check-in-01" 
              width="30" 
              height="30" 
            />
            {itemCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </div>
          <div className="cart-text">
            <p className='fw-bold mb-0 text-dark'>My Cart</p>
            {hasFreeShipping ? (
                    <span className="text-muted">EGP {totalPrice.toFixed(2)}</span>

                ) :(
                  <span className="text-muted">EGP {grandTotal.toFixed(2)}</span>
                )}
          </div>
        </div>
      </Link>

      {/* {cartItems.length === 0 ? (
        <div>
          <h3>Your cart is empty</h3>
          <p className="mb-4">Looks like you haven't added any items to your cart yet.</p>
          </div>
      ): (
        <div className='d-flex flex-column mx-2'>

        <div className="topCart h-50 d-flex flex-column gap-2">
          {cartItems.map((item) => (
                      <div className='item d-flex  gap-2'>
                      <div className="cart-item-img w-50 rounded bg-secondary">
                        <img src="./images/Zone7.png" 
                             alt=""
                        />
                      </div>
                      <div className="cart-item-details w-75 d-flex flex-column ">
                        <p className="item-name"> {item.name} </p>
                        <p>EGP {item.price.toFixed(2)} </p>
                        <p>{item.size}</p>
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
                    </div>
            
          ))}
        </div>

        <div className="bottomCart h-50"></div>

      </div>

      )} */}
    </div>
  );
}