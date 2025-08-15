
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useTheme } from "../../contexts/ThemeContext";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDark } = useTheme();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

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
          <h1 className={`text-5xl sm:text-6xl md:text-7xl font-bold bg-clip-text text-transparent text-center mb-8 drop-shadow-2xl ${
            isDark 
              ? 'bg-gradient-to-br from-white via-pink-200 to-yellow-200'
              : 'bg-gradient-to-br from-purple-700 via-pink-500 to-orange-500'
          }`}>
            Products
          </h1>
          {loading && <div className={`text-center ${isDark ? 'text-white' : 'text-gray-700'}`}>Loading products...</div>}
          {error && <div className={`text-center ${isDark ? 'text-red-300' : 'text-red-600'}`}>Error: {error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {products.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id}>
                <div className={`cursor-pointer border rounded-xl p-5 shadow-lg backdrop-blur-md hover:scale-105 transition-transform flex flex-col h-96 ${
                  isDark 
                    ? 'border-white/20 bg-white/10'
                    : 'border-gray-200 bg-white/60'
                }`}>
                  {/* Fixed image section - 65% of card height */}
                  <div className="h-3/5 flex items-center justify-center mb-3">
                    {product.image ? (
                      <img
                        src={product.image.startsWith("http") ? product.image : `http://127.0.0.1:8000${product.image}`}
                        alt={product.name}
                        className={`w-full h-full object-cover rounded border ${
                          isDark ? 'border-white/30' : 'border-gray-300'
                        }`}
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center rounded text-sm ${
                        isDark ? 'bg-white/20 text-white/60' : 'bg-gray-100 text-gray-500'
                      }`}>
                        No Image
                      </div>
                    )}
                  </div>
                  
                  {/* Fixed content section - 35% of card height */}
                  <div className="h-2/5 flex flex-col justify-between">
                    <div className="flex-grow">
                      <h2 className={`text-base font-bold mb-1 text-center ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>{product.name}</h2>
                      <p className={`mb-1 text-center text-xs overflow-hidden ${
                        isDark ? 'text-white/80' : 'text-gray-600'
                      }`}
                         style={{ 
                           display: '-webkit-box',
                           WebkitLineClamp: 1,
                           WebkitBoxOrient: 'vertical'
                         }}
                      >
                        {product.description || "\u00A0"}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className={`text-base font-semibold mb-1 ${
                        isDark ? 'text-pink-300' : 'text-pink-600'
                      }`}>${product.price}</div>
                      {product.stock === 0 ? (
                        <div className={`text-xs font-bold mb-1 ${
                          isDark ? 'text-red-400' : 'text-red-600'
                        }`}>Out of Stock</div>
                      ) : (
                        <div className={`text-xs mb-1 ${
                          isDark ? 'text-white/60' : 'text-gray-500'
                        }`}>Stock: {product.stock}</div>
                      )}
                      <button className="w-full py-1.5 bg-gradient-to-r from-pink-500 to-orange-400 text-white text-sm rounded hover:from-pink-600 hover:to-orange-500 transition disabled:bg-gray-600 disabled:opacity-50" disabled={product.stock === 0}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}