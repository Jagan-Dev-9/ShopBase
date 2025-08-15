"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import { ArrowLeftIcon, TagIcon, CurrencyDollarIcon, CubeIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../../contexts/ThemeContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isDark } = useTheme();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
                  {product.image ? (
                    <img
                      src={product.image.startsWith("http") ? product.image : `http://localhost:8000${product.image}`}
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
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    disabled={product.stock === 0}
                    className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition ${
                      product.stock === 0
                        ? 'bg-gray-500 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 hover:scale-105'
                    }`}
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  
                  <button
                    disabled={product.stock === 0}
                    className={`flex-1 py-3 px-6 rounded-lg border font-semibold transition hover:scale-105 ${
                      product.stock === 0
                        ? 'border-gray-500 text-gray-500 cursor-not-allowed opacity-50'
                        : isDark
                          ? 'border-pink-400 text-pink-300 bg-transparent hover:bg-pink-400 hover:text-white'
                          : 'border-pink-500 text-pink-600 bg-transparent hover:bg-pink-500 hover:text-white'
                    }`}
                  >
                    {product.stock === 0 ? 'Unavailable' : 'Buy Now'}
                  </button>
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
