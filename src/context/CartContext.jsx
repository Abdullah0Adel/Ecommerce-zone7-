import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import BASE_URL from '../Data/BASE_URL';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  const shippingCost = 50;
  const FREE_SHIPPING_THRESHOLD = 1000;
  const hasFreeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;

  // Get user ID from localStorage
  const getUserId = () => {
    const user = localStorage.getItem('user');
    if (!user) return null;

    try {
      const parsedUser = JSON.parse(user);
      return parsedUser.id;
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      return null;
    }
  };

  // Get authentication token
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Load cart data from Strapi backend
  const loadCart = async () => {
    setLoading(true);

    const userId = getUserId();
    const token = getAuthToken();

    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/api/carts`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        params: {
          filters: {
            users_permissions_user: userId,
          },
          populate: ['image', 'users_permissions_user'],
        },
      });

      if (response.data && response.data.data) {
        const cartData = response.data.data.map((item) => {
          const attributes = item || item;
          return {
            cartItemId: item.documentId,
            id: item.id,
            product_id: attributes.product_id,
            name: attributes.name,
            price: attributes.price,
            quantity: attributes.quantity,
            image: attributes.image,
            size: attributes.size,
            maxStock: attributes.maxStock,
          users_permissions_user: attributes.users_permissions_user, //  هنا بقى مربوط صح
          };
        });

        setCartItems(cartData);
        console.log(cartData);
const cartIds = cartData.map(item => item.id);
localStorage.setItem("cartIds", JSON.stringify(cartIds));
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading cart from Strapi:', error);
      setLoading(false);
    }
  };

  // Load cart when component mounts
  useEffect(() => {
    loadCart();
  }, []);





  //  Calculate total price whenever cart items change
  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  
  //  Add item to cart
  const addToCart = async (newItem) => {
    try {
      if (!newItem.product_id || !newItem.product_name || !newItem.price) {
        toast.error('Invalid product data');
        return;
      }

      const userId = getUserId();
      if (!userId) {
        toast.error('Please log in to add items to cart');
        return;
      }

      const token = getAuthToken();
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      //  Check if item already exists in the cart
      const response = await axios.get(`${BASE_URL}/api/carts`, {
        headers,
        params: {
          filters: {
            users_permissions_user: {
              id: {
                $eq: userId,
              },
            },
            product_id: {
              $eq: newItem.product_id,
            },
            size: {
              $eq: newItem.size,
            },
          },
          populate: '*',
        },
      });

      const existingItems = response.data.data || [];

      if (existingItems.length > 0) {
        //  Item exists, update the quantity
        const existingItem = existingItems[0];
        const existingId = existingItem.documentId;
        const currentQuantity = existingItem.quantity || 0;
        const maxStock = newItem.maxStock;
        const newQuantity = currentQuantity + (newItem.quantity || 1);

        if (newQuantity > maxStock) {
          toast.error(`Cannot add more than ${maxStock} units of this product.`);
          return;
        }

        await axios.put(
          `${BASE_URL}/api/carts/${existingId}`,
          { data: { quantity: newQuantity } },
          { headers }
        );

        await loadCart(); 
        toast.success(`Updated ${newItem.product_name} quantity to ${newQuantity}`);
      } else {
        // Item doesn't exist, create a new entry
        const payload = {
          data: {
            users_permissions_user: userId,
            product_id: newItem.product_id,
            name: newItem.product_name,
            price: newItem.price,
            quantity: newItem.quantity || 1,
            size: newItem.size || '',
            maxStock: newItem.maxStock || 100,
          },
        };

        if (newItem.imageId) {
          payload.data.image = newItem.imageId;
        }

        await axios.post(`${BASE_URL}/api/carts`, payload, { headers });
        await loadCart(); // Reload the cart after creation
        toast.success(`Added ${newItem.product_name} to your cart`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error.response?.data || error);
      toast.error('Failed to add item to cart');
    }
  };



  // Update Cart Item
const updateCartItem = async (cartItemId, updates) => {
  try {
    if (!cartItemId) {
      console.error('Missing cart item ID for update');
      toast.error('Failed to update cart: item ID not found');
      return;
    }

    const token = getAuthToken();
    if (!token) {
      toast.error('Authentication token not found');
      return;
    }

    // Update in Strapi
    const response = await axios.put(
      `${BASE_URL}/api/carts/${cartItemId}`,
      {
        data: updates
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data) {
      // Update the state with the new data
      const updatedCart = cartItems.map(item =>
        item.cartItemId === cartItemId ? { ...item, ...updates } : item
      );

      setCartItems(updatedCart);
      toast.success('Cart updated successfully!');
    }
  } catch (error) {
    console.error('Error updating cart item:', error);
    toast.error('Failed to update cart item');
  }
};


  // Remove item from cart
  const removeFromCart = async (cartItemId) => {
    try {
      if (!cartItemId) return;
      const token = getAuthToken();

      await axios.delete(`${BASE_URL}/api/carts/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems(cartItems.filter((item) => item.cartItemId !== cartItemId));
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      for (const item of cartItems) {
        if (item.cartItemId) {
          await removeFromCart(item.cartItemId);
        }
      }
      await loadCart(); // Reload the cart after clearing
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  return (
<CartContext.Provider
  value={{
    cartItems,
    addToCart,
    updateCartItem, 
    removeFromCart,
    clearCart,
    totalPrice,
    shippingCost,
    hasFreeShipping,
    loading,
  }}
>
  {children}
</CartContext.Provider>  );
};
