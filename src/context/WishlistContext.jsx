import axios from 'axios';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import BASE_URL from '../Data/BASE_URL';

const WishlistContext = createContext();

export const useWishlist = () => {
  return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true); // Start as true to show loading state

  const getUserId = () => {
    const user = localStorage.getItem('user');
    if (!user) return null;
    
    try {
      const parsedUser = JSON.parse(user);
      return parsedUser.id;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  };

  // Get authentication token
  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    return token;
  };

  // Load wishlist data when component mounts
  const loadWishlist = async () => {
    setLoading(true);
    
    const userId = getUserId();
    const token = getAuthToken();
    
    // If no user ID, don't try to fetch from backend
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}wishlists`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined
        },
        params: {
          filters: {
            users_permissions_user: userId,
          },
          populate: '*'
        }
      });
      
      if (response.data && response.data.data) {
        const wishlistData = response.data.data.map(item => {
          // Extract necessary data from the API response
          // Making sure all needed fields for the WishlistPage component are included
          return {
            wishlistItemId: item.documentId,  // The Strapi ID
            id: item.product_id, // Product ID for reference
            product_id:  item.product_id,
            product_documentId: item.product_documentId, // For links
            name:  item.product_name,
            price: item.price || 0,
            image: item.image && item.image.length > 0 ? item.image[0].url : '',            // Include other fields that might be needed by WishlistPage
            rating: item?.rating || item.rating,
          };
        });
        
        setWishlistItems(wishlistData);
        console.log(wishlistData.image)
        console.log("Loaded wishlist data:", wishlistData);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading wishlist from Strapi:', error);
      toast.error('Failed to load your wishlist');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);



  // Add item to wishlist
  const addToWishlist = async (product) => {
    try {
      const userId = getUserId();
      if (!userId) {
        toast.error('Please log in to add items to wishlist');
        return;
      }
      
      const token = getAuthToken();
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }
      
      // Check if product already exists in wishlist
      const existingItem = wishlistItems.find(item => item.id === product.id);
      if (existingItem) {
        toast.info(`${product.name} is already in your wishlist`);
        return;
      }
      
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      
      // Prepare the data for the API
      const wishlistData = {
        data: {
          users_permissions_user: userId,
          product_documentId: product.product_documentId,
          product_id: product.id,
          product_name: product.name,
          product_price: product.price,
          image: product.imageId ? { id: product.imageId } : null,
          
          product_rating: product.rating
        }
      };

      // Make POST request to add to wishlist
      await axios.post(`${BASE_URL}wishlists`, wishlistData, {headers});
      await loadWishlist();
      toast.success(`Added ${product.product_name || product.name} to your wishlist`)      

      
      // if (response.data && response.data.data) {
      //   // Format the new item to match the structure used in the wishlist state
      //   const newWishlistItem = {
      //     wishlistItemId: response.data.data.id,
      //     id: product.id,
      //     product_id: product.id,
      //     documentId: product.documentId || product.id,
      //     product_name: product.name,
      //     price: product.price,
      //     image: {
      //       url: product.imageUrl ? product.imageUrl.replace('http://localhost:1337', '') : '/images/placeholder.png'
      //     },
      //     product_rating: product.rating,
      //   };
        
      //   // Update state with the new item
      //   setWishlistItems(prev => [...prev, newWishlistItem]);
      //   toast.success(`${product.name} added to wishlist!`);
      // }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add item to wishlist');
    }
  };
  
  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      const userId = getUserId();
      const token = getAuthToken();
      
      if (!userId || !token) {
        toast.error('Please log in to manage your wishlist');
        return;
      }
      
      // Find the item to be removed
      const itemToRemove = wishlistItems.find(item => item.id === productId || item.product_id === productId);
      
      if (!itemToRemove) {
        toast.error('Item not found in your wishlist');
        return;
      }
      
      // Remove from API first
      await axios.delete(`${BASE_URL}wishlists/${itemToRemove.wishlistItemId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Remove from state for immediate UI update
      const updatedWishlist = wishlistItems.filter(item => 
        item.id !== productId && item.product_id !== productId
      );
      
      setWishlistItems(updatedWishlist);
      toast.success('Item removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item from wishlist');
    }
  };

  // Clear entire wishlist
  const clearWishlist = async () => {
    try {
      const userId = getUserId();
      const token = getAuthToken();
      
      if (!userId || !token) {
        toast.error('Please log in to manage your wishlist');
        return;
      }
      
      // Delete all wishlist items from API
      // We need to delete each item one by one
      const deletePromises = wishlistItems.map(item => 
        axios.delete(`${BASE_URL}wishlists/${item.wishlistItemId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      );
      
      await Promise.all(deletePromises);
      
      // Clear state
      setWishlistItems([]);
      toast.success('Wishlist cleared');
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error('Failed to clear wishlist');
    }
  };

  // Check if a product is in the wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => 
      item.id === productId || item.product_id === productId
    );
  };

  const value = {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};