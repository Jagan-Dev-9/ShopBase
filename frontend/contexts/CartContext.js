'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();

  // Fetch cart from API
  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setCart(null);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/cart/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data);
        setError(null); // Clear any previous errors
      } else if (response.status === 401) {
        // Token is invalid, clear cart
        setCart(null);
        localStorage.removeItem('accessToken');
      } else {
        console.error('Failed to fetch cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      // Only set error if user is authenticated
      if (isAuthenticated && localStorage.getItem('accessToken')) {
        setError('Failed to fetch cart');
      }
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      setError('Please login to add items to cart');
      return false;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('Please login to add items to cart');
      return false;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/cart/add/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: quantity,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
        setError(null);
        return true;
      } else {
        const errorData = await response.json();
        console.error('Cart add error:', response.status, errorData);
        setError(errorData.error || errorData.non_field_errors?.[0] || 'Failed to add item to cart');
        return false;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('Failed to add item to cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update cart item quantity
  const updateCartItem = async (itemId, quantity) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/cart/update/${itemId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      if (response.ok) {
        await fetchCart(); // Refresh cart
        setError(null);
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update item');
        return false;
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      setError('Failed to update item');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/cart/remove/${itemId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        await fetchCart(); // Refresh cart
        setError(null);
        return true;
      } else {
        const errorData = await response.json();
        console.error('Cart remove error:', response.status, errorData);
        setError(errorData.error || errorData.non_field_errors?.[0] || 'Failed to remove item');
        return false;
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      setError('Failed to remove item');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/cart/clear/', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setCart({ items: [], total_items: 0, total_price: '0.00' });
        setError(null);
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to clear cart');
        return false;
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError('Failed to clear cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => setError(null);

  // Get cart item count
  const getCartItemCount = () => {
    return cart ? cart.total_items : 0;
  };

  // Get cart total price
  const getCartTotal = () => {
    return cart ? cart.total_price : '0.00';
  };

  // Load cart when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null);
      setError(null);
    }
  }, [isAuthenticated]);

  // Listen for storage changes (when user logs in/out in another tab)
  useEffect(() => {
    const handleStorageChange = () => {
      if (isAuthenticated) {
        const token = localStorage.getItem('accessToken');
        if (token) {
          fetchCart();
        } else {
          setCart(null);
          setError(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isAuthenticated]);

  const value = {
    cart,
    loading,
    error,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    clearError,
    getCartItemCount,
    getCartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
