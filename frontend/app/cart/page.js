'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import ImageWithFallback from '../../components/ImageWithFallback';
import PayNowButton from '../../components/PayNowButton';

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const { cart, loading, error, updateCartItem, removeFromCart, clearCart, clearError } = useCart();
  const { isDark } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateCartItem(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId) => {
    await removeFromCart(itemId);
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  if (authLoading || loading) {
    return (
      <div className={`relative min-h-screen ${
        isDark 
          ? 'bg-gradient-to-tr from-[#191720] via-[#35235e] via-70% to-[#fb7185]'
          : 'bg-gradient-to-tr from-blue-50 via-pink-50 via-70% to-purple-100'
      }`}>
        {/* Glass/blur premium overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className={`absolute left-1/4 top-0 h-80 w-2/5 blur-3xl rounded-full ${
            isDark ? 'bg-pink-300 opacity-20' : 'bg-pink-400 opacity-30'
          }`} />
          <div className={`absolute right-5 bottom-1/4 h-72 w-1/3 blur-3xl rounded-full ${
            isDark ? 'bg-indigo-400 opacity-20' : 'bg-blue-400 opacity-30'
          }`} />
        </div>
        <Navbar />
        <main className="relative z-10 pt-20 pb-8">
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className={`backdrop-blur-lg rounded-3xl p-12 shadow-2xl border ${
              isDark 
                ? 'bg-white/10 border-white/20'
                : 'bg-white/40 border-white/30'
            }`}>
              <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-pink-500 border-r-purple-500 border-b-blue-500"></div>
                  <div className="animate-ping absolute inset-0 rounded-full h-16 w-16 border-4 border-purple-400 opacity-20"></div>
                </div>
                <p className="text-xl font-medium bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                  Loading your cart...
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className={`relative min-h-screen ${
      isDark 
        ? 'bg-gradient-to-tr from-[#191720] via-[#35235e] via-70% to-[#fb7185]'
        : 'bg-gradient-to-tr from-blue-50 via-pink-50 via-70% to-purple-100'
    }`}>
      {/* Glass/blur premium overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className={`absolute left-1/4 top-0 h-80 w-2/5 blur-3xl rounded-full ${
          isDark ? 'bg-pink-300 opacity-20' : 'bg-pink-400 opacity-30'
        }`} />
        <div className={`absolute right-5 bottom-1/4 h-72 w-1/3 blur-3xl rounded-full ${
          isDark ? 'bg-indigo-400 opacity-20' : 'bg-blue-400 opacity-30'
        }`} />
      </div>
      <Navbar />
      <main className="relative z-10 pt-20 pb-8">
        <div className="px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-12 text-center">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Shopping Cart
              </h1>
              <div className={`inline-block px-6 py-3 rounded-2xl border backdrop-blur-md shadow-lg ${
                isDark 
                  ? 'bg-white/10 border-white/20 text-white/90'
                  : 'bg-white/30 border-white/20 text-gray-700'
              }`}>
                <p className="font-medium">
                  {cart?.total_items || 0} {cart?.total_items === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className={`mb-8 p-6 backdrop-blur-md border rounded-2xl shadow-lg ${
                isDark 
                  ? 'bg-red-900/80 border-red-700 text-red-300'
                  : 'bg-red-100/80 border-red-300 text-red-700'
              }`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="text-red-500 text-xl">⚠️</div>
                    <p className="font-medium">{error}</p>
                  </div>
                  <button
                    onClick={clearError}
                    className={`transition-colors duration-200 text-xl font-bold ${
                      isDark 
                        ? 'text-red-400 hover:text-red-300'
                        : 'text-red-500 hover:text-red-700'
                    }`}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Cart Content */}
            {!cart?.items || cart.items.length === 0 ? (
              <div className="text-center py-16">
                <div className={`max-w-md mx-auto rounded-3xl p-12 shadow-2xl border backdrop-blur-lg ${
                  isDark 
                    ? 'bg-white/10 border-white/20'
                    : 'bg-white/40 border-white/30'
                }`}>
                  <div className="text-8xl mb-6 animate-bounce">🛒</div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent mb-4">
                    Your cart is empty
                  </h2>
                  <p className={`mb-8 text-lg ${
                    isDark ? 'text-white/70' : 'text-gray-600'
                  }`}>
                    Discover amazing products and start shopping
                  </p>
                  <button
                    onClick={() => router.push('/products')}
                    className="px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-2xl hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-xl font-semibold text-lg"
                  >
                    Browse Products
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="xl:col-span-2">
                  <div className={`backdrop-blur-lg rounded-3xl p-8 shadow-2xl border ${
                    isDark 
                      ? 'bg-white/10 border-white/20'
                      : 'bg-white/40 border-white/30'
                  }`}>
                    <div className="flex justify-between items-center mb-8">
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                        Cart Items
                      </h2>
                      <button
                        onClick={handleClearCart}
                        className={`px-4 py-2 rounded-xl transition-all duration-200 backdrop-blur-sm border font-medium ${
                          isDark 
                            ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-300/30'
                            : 'bg-red-500/20 hover:bg-red-500/30 text-red-600 border-red-300/30'
                        }`}
                    >
                      Clear Cart
                    </button>
                  </div>

                    <div className="space-y-6">
                      {cart.items.map((item) => (
                        <div
                          key={item.id}
                          className={`group p-6 backdrop-blur-md rounded-2xl border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] ${
                            isDark 
                              ? 'bg-white/10 border-white/20'
                              : 'bg-white/50 border-white/30'
                          }`}
                        >
                        <div className="flex items-center space-x-6">
                          {/* Product Image */}
                          <div className="w-24 h-24 relative overflow-hidden rounded-xl shadow-md">
                            <ImageWithFallback
                              src={item.product.image}
                              alt={item.product.name || 'Product'}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-bold text-lg mb-2 truncate ${
                              isDark ? 'text-white/90' : 'text-gray-800'
                            }`}>
                              {item.product.name}
                            </h3>
                            <div className="flex items-center space-x-2 mb-3">
                              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                ${item.product.price}
                              </span>
                              <span className={`text-sm ${
                                isDark ? 'text-white/60' : 'text-gray-500'
                              }`}>each</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <span className={`px-2 py-1 rounded-lg font-medium ${
                                isDark 
                                  ? 'bg-green-900/40 text-green-300 border border-green-700/50'
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                In Stock: {item.product.stock}
                              </span>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className={`w-10 h-10 flex items-center justify-center backdrop-blur-sm rounded-full transition-all duration-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed ${
                                isDark 
                                  ? 'bg-white/10 hover:bg-white/20 text-white/80'
                                  : 'bg-gray-200/70 hover:bg-gray-300/70 text-gray-700'
                              }`}
                              disabled={item.quantity <= 1}
                            >
                              −
                            </button>
                            <div className="w-16 text-center">
                              <span className={`text-xl font-bold backdrop-blur-sm px-3 py-2 rounded-lg ${
                                isDark 
                                  ? 'text-white/90 bg-white/10'
                                  : 'text-gray-800 bg-white/50'
                              }`}>
                                {item.quantity}
                              </span>
                            </div>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className={`w-10 h-10 flex items-center justify-center backdrop-blur-sm rounded-full transition-all duration-200 font-bold ${
                                isDark 
                                  ? 'bg-white/10 hover:bg-white/20 text-white/80'
                                  : 'bg-gray-200/70 hover:bg-gray-300/70 text-gray-700'
                              }`}
                            >
                              +
                            </button>
                          </div>

                          {/* Subtotal */}
                          <div className="text-right min-w-[100px]">
                            <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                              ${item.subtotal}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">subtotal</p>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className={`p-3 transition-colors duration-200 rounded-xl backdrop-blur-sm ${
                              isDark 
                                ? 'text-red-400 hover:text-red-300 hover:bg-red-900/50'
                                : 'text-red-500 hover:text-red-700 hover:bg-red-100/50'
                            }`}
                            title="Remove item"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="xl:col-span-1">
                <div className={`backdrop-blur-lg rounded-3xl p-8 shadow-2xl border sticky top-8 ${
                  isDark 
                    ? 'bg-white/10 border-white/20'
                    : 'bg-white/40 border-white/30'
                }`}>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent mb-8">
                    Order Summary
                  </h2>

                  <div className="space-y-6 mb-8">
                    <div className={`flex justify-between items-center p-4 backdrop-blur-sm rounded-xl ${
                      isDark 
                        ? 'bg-white/10'
                        : 'bg-white/30'
                    }`}>
                      <span className={`font-medium ${
                        isDark ? 'text-white/80' : 'text-gray-700'
                      }`}>
                        Items ({cart.total_items})
                      </span>
                      <span className={`text-xl font-bold ${
                        isDark ? 'text-white/90' : 'text-gray-800'
                      }`}>
                        ${cart.total_price}
                      </span>
                    </div>
                    
                    <div className={`flex justify-between items-center p-4 backdrop-blur-sm rounded-xl border ${
                      isDark 
                        ? 'bg-green-900/30 border-green-700/50'
                        : 'bg-green-100/50 border-green-200/50'
                    }`}>
                      <div className="flex items-center space-x-2">
                        <span className={isDark ? 'text-green-400' : 'text-green-600'}>🚚</span>
                        <span className={`font-medium ${
                          isDark ? 'text-green-300' : 'text-green-700'
                        }`}>Shipping</span>
                      </div>
                      <span className={`font-bold ${
                        isDark ? 'text-green-300' : 'text-green-700'
                      }`}>Free</span>
                    </div>
                    
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                    
                    <div className={`flex justify-between items-center p-6 backdrop-blur-sm rounded-xl border ${
                      isDark 
                        ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-700/50'
                        : 'bg-gradient-to-r from-purple-100/50 to-pink-100/50 border-purple-200/50'
                    }`}>
                      <span className={`text-xl font-bold ${
                        isDark ? 'text-white/90' : 'text-gray-800'
                      }`}>Total</span>
                      <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        ${cart.total_price}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <PayNowButton 
                      type="cart"
                      amount={cart.total_price}
                    />

                    <button
                      onClick={() => router.push('/products')}
                      className={`w-full py-4 rounded-2xl transition-all duration-300 backdrop-blur-sm border font-semibold text-lg ${
                        isDark 
                          ? 'bg-white/10 border-white/30 text-white/90 hover:bg-white/20'
                          : 'bg-white/50 border-white/30 text-gray-800 hover:bg-white/70'
                      }`}
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
      </main>
    </div>
  );
}
