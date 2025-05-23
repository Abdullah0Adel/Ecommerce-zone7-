import { create } from 'zustand';
import axios from 'axios';

const useCartStore = create((set, get) => ({
  cartItems: [],
  isLoading: false,
  error: null,
  
  // Fetch cart items for a user
  fetchCartItems: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`http://localhost:1337/api/carts`, {
        params: {
          filters: {
            user_id: userId
          },
          populate: '*'
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      set({ 
        cartItems: response.data.data || [], 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching cart items:', error);
      set({ 
        error: 'Failed to fetch cart items', 
        isLoading: false 
      });
    }
  },
  
  // Add item to cart
  addToCart: async (item, userId) => {
    try {
      set({ isLoading: true, error: null });
      
      // Check if item already exists in cart
      const { data } = await axios.get(`http://localhost:1337/api/carts`, {
        params: {
          filters: {
            product_id: item.id,
            size: item.size.size,
            user_id: userId
          }
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (data.data && data.data.length > 0) {
        // Update existing cart item
        const existingItem = data.data[0];
        const existingQuantity = existingItem.quantity;
        const newQuantity = existingQuantity + item.quantity;
        const finalQuantity = newQuantity > item.maxStock ? item.maxStock : newQuantity;
        
        await axios.put(
          `http://localhost:1337/api/carts/${existingItem.id}`,
          {
            data: {
              quantity: finalQuantity
            }
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
      } else {
        // Add new cart item
        await axios.post(
          'http://localhost:1337/api/carts',
          {
            data: {
              product_id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
              categoryId: item.categoryId || null,
              maxStock: item.maxStock,
              size: item.size.size,
              user_id: userId,
              users_permissions_user: userId
            }
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
      }
      
      // Refresh cart items
      get().fetchCartItems(userId);
      set({ isLoading: false });
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      set({ 
        error: 'Failed to add item to cart', 
        isLoading: false 
      });
      return false;
    }
  },
  
  // Update cart item quantity
  updateCartItem: async (itemId, quantity, userId) => {
    try {
      set({ isLoading: true, error: null });
      
      await axios.put(
        `http://localhost:1337/api/carts/${itemId}`,
        {
          data: {
            quantity
          }
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // Refresh cart items
      get().fetchCartItems(userId);
      set({ isLoading: false });
    } catch (error) {
      console.error('Error updating cart item:', error);
      set({ 
        error: 'Failed to update cart item', 
        isLoading: false 
      });
    }
  },
  
  // Remove item from cart
  removeFromCart: async (itemId, userId) => {
    try {
      set({ isLoading: true, error: null });
      
      await axios.delete(`http://localhost:1337/api/carts/${itemId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Refresh cart items
      get().fetchCartItems(userId);
      set({ isLoading: false });
    } catch (error) {
      console.error('Error removing from cart:', error);
      set({ 
        error: 'Failed to remove item from cart', 
        isLoading: false 
      });
    }
  },
  
  // Clear entire cart
  clearCart: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      
      const { cartItems } = get();
      
      // Delete all items one by one
      for (const item of cartItems) {
        await axios.delete(`http://localhost:1337/api/carts/${item.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      }
      
      set({ cartItems: [], isLoading: false });
    } catch (error) {
      console.error('Error clearing cart:', error);
      set({ 
        error: 'Failed to clear cart', 
        isLoading: false 
      });
    }
  },
  
  // Get cart total
  getCartTotal: () => {
    return get().cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  },
  
  // Get cart item count
  getCartItemCount: () => {
    return get().cartItems.reduce((count, item) => {
      return count + item.quantity;
    }, 0);
  }
}));

export default useCartStore;