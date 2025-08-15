"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import { ArrowLeftIcon, TagIcon, CurrencyDollarIcon, CubeIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../../contexts/ThemeContext";
import { useAuth } from "../../../contexts/AuthContext";
import { useCart } from "../../../contexts/CartContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isDark } = useTheme();
  const { isAuthenticated } = useAuth();
  const { addToCart, loading: cartLoading, error: cartError, clearError } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setAddingToCart(true);
    const success = await addToCart(product.id, quantity);
    if (success) {
      // Show stylish success message
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-20 right-4 z-50 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-md transform transition-all duration-500 translate-x-full';
      successDiv.innerHTML = `
        <div class="flex items-center space-x-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span class="font-semibold">Added to cart successfully!</span>
        </div>
      `;
      document.body.appendChild(successDiv);
      
      // Animate in
      setTimeout(() => successDiv.classList.remove('translate-x-full'), 100);
      
      // Remove after 3 seconds
      setTimeout(() => {
        successDiv.classList.add('translate-x-full');
        setTimeout(() => document.body.removeChild(successDiv), 500);
      }, 3000);
    }
    setAddingToCart(false);
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setAddingToCart(true);
    const success = await addToCart(product.id, quantity);
    if (success) {
      router.push('/cart');
    }
    setAddingToCart(false);
  };

  // Helper function to get valid image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl || imageUrl === 'null' || imageUrl === 'undefined' || imageUrl.trim() === '') {
      return null;
    }
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `http://localhost:8000${imageUrl}`;
  };

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`http://localhost:8000/api/products/${id}/`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
      } catch (e) {
        console.error("Error fetching product:", e);
        setError(e.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className={`relative min-h-screen ${
        isDark 
          ? 'bg-gradient-to-tr from-[#191720] via-[#35235e] via-70% to-[#fb7185]'
          : 'bg-gradient-to-tr from-blue-50 via-pink-50 via-70% to-purple-100'
      }`}>
        <Navbar />
        <div className="relative z-10 pt-20 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className={`text-center ${isDark ? 'text-white' : 'text-gray-700'}`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-lg">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={`relative min-h-screen ${
        isDark 
          ? 'bg-gradient-to-tr from-[#191720] via-[#35235e] via-70% to-[#fb7185]'
          : 'bg-gradient-to-tr from-blue-50 via-pink-50 via-70% to-purple-100'
      }`}>
        <Navbar />
        <div className="relative z-10 pt-20 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className={`text-center ${isDark ? 'text-white' : 'text-gray-700'}`}>
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-orange-500 transition"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
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
        <div className="max-w-6xl mx-auto px-4">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/products"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border backdrop-blur-md transition hover:scale-105 ${
                isDark 
                  ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  : 'bg-white/80 border-gray-300 text-gray-700 hover:bg-white'
              }`}
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Products
            </Link>
          </div>

          {/* Product Card */}
          <div className={`rounded-xl border backdrop-blur-md shadow-2xl overflow-hidden ${
            isDark 
              ? 'bg-white/10 border-white/20'
              : 'bg-white/90 border-gray-300'
          }`}>
            <div className="grid lg:grid-cols-2 gap-8 p-6 lg:p-8">
              {/* Product Image */}
              <div className="flex justify-center lg:justify-start">
                <div className={`relative w-full max-w-md h-80 lg:h-96 rounded-xl overflow-hidden shadow-lg border-2 ${
                  isDark ? 'border-pink-300/30 bg-black/30' : 'border-pink-200 bg-white'
                }`}>
                  {getImageUrl(product.image) ? (
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className={`w-full h-full flex flex-col items-center justify-center ${
                      isDark ? 'text-white/60' : 'text-gray-400'
                    }`}>
                      <CubeIcon className="h-16 w-16 mb-4" />
                      <p className="text-lg font-medium">No Image Available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col justify-center space-y-6">
                {/* Category Badge */}
                {product.category_name && (
                  <div className="flex items-center gap-2">
                    <TagIcon className={`h-4 w-4 ${isDark ? 'text-pink-300' : 'text-pink-600'}`} />
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      isDark 
                        ? 'bg-pink-500/20 text-pink-300'
                        : 'bg-pink-100 text-pink-800'
                    }`}>
                      {product.category_name}
                    </span>
                  </div>
                )}

                {/* Product Name */}
                <h1 className={`text-3xl lg:text-4xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {product.name}
                </h1>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <CurrencyDollarIcon className={`h-6 w-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  <span className={`text-3xl font-bold ${
                    isDark ? 'text-green-400' : 'text-green-600'
                  }`}>
                    ${product.price}
                  </span>
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2">
                  <CubeIcon className={`h-5 w-5 ${
                    product.stock > 0 
                      ? isDark ? 'text-blue-400' : 'text-blue-600'
                      : isDark ? 'text-red-400' : 'text-red-600'
                  }`} />
                  {product.stock > 0 ? (
                    <span className={`text-lg font-medium ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      {product.stock} in stock
                    </span>
                  ) : (
                    <span className={`text-lg font-bold ${
                      isDark ? 'text-red-400' : 'text-red-600'
                    }`}>
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <div>
                    <h3 className={`text-lg font-semibold mb-2 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      Description
                    </h3>
                    <p className={`text-base leading-relaxed ${
                      isDark ? 'text-white/80' : 'text-gray-700'
                    }`}>
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-4 pt-4">
                  {/* Cart Error Display */}
                  {cartError && (
                    <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg">
                      <div className="flex justify-between items-center">
                        <p className="text-red-700 dark:text-red-300 text-sm">{cartError}</p>
                        <button
                          onClick={clearError}
                          className="text-red-500 hover:text-red-700 dark:hover:text-red-300"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Quantity Selector */}
                  {product.stock > 0 && (
                    <div className="flex items-center gap-4">
                      <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>
                        Quantity:
                      </span>
                      <div className="flex items-center">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className={`px-3 py-1 border rounded-l-lg ${
                            isDark 
                              ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                              : 'border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          max={product.stock}
                          value={quantity}
                          onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                          className={`w-16 px-2 py-1 border-t border-b text-center ${
                            isDark 
                              ? 'border-white/20 bg-white/5 text-white'
                              : 'border-gray-300 bg-white text-gray-700'
                          }`}
                        />
                        <button
                          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                          className={`px-3 py-1 border rounded-r-lg ${
                            isDark 
                              ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                              : 'border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0 || addingToCart}
                      className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition ${
                        product.stock === 0 || addingToCart
                          ? 'bg-gray-500 cursor-not-allowed opacity-50'
                          : 'bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 hover:scale-105'
                      }`}
                    >
                      {addingToCart 
                        ? 'Adding...' 
                        : product.stock === 0 
                          ? 'Out of Stock' 
                          : 'Add to Cart'
                      }
                    </button>
                    
                    <button
                      onClick={handleBuyNow}
                      disabled={product.stock === 0 || addingToCart}
                      className={`flex-1 py-3 px-6 rounded-lg border font-semibold transition hover:scale-105 ${
                        product.stock === 0 || addingToCart
                          ? 'border-gray-500 text-gray-500 cursor-not-allowed opacity-50'
                          : isDark
                            ? 'border-pink-400 text-pink-300 bg-transparent hover:bg-pink-400 hover:text-white'
                            : 'border-pink-500 text-pink-600 bg-transparent hover:bg-pink-500 hover:text-white'
                      }`}
                    >
                      {addingToCart 
                        ? 'Processing...' 
                        : product.stock === 0 
                          ? 'Unavailable' 
                          : 'Buy Now'
                      }
                    </button>
                  </div>
                </div>

                {/* Product Meta */}
                <div className={`pt-4 border-t text-sm ${
                  isDark ? 'border-white/20 text-white/60' : 'border-gray-200 text-gray-500'
                }`}>
                  <p>Product ID: {product.id}</p>
                  {product.created_at && (
                    <p>Added: {new Date(product.created_at).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
