"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="relative h-screen overflow-hidden bg-gradient-to-tr from-[#191720] via-[#35235e] via-70% to-[#fb7185]">
      {/* Glass/blur premium overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute left-1/4 top-0 h-80 w-2/5 blur-3xl bg-pink-300 opacity-20 rounded-full" />
        <div className="absolute right-5 bottom-1/4 h-72 w-1/3 blur-3xl bg-indigo-400 opacity-20 rounded-full" />
      </div>
      <Navbar />
      <main className="relative z-10 h-full overflow-y-auto pt-20 pb-8">
        <div className="px-6">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-br from-white via-pink-200 to-yellow-200 bg-clip-text text-transparent text-center mb-8 drop-shadow-2xl">
            Products
          </h1>
          {loading && <div className="text-center text-white">Loading products...</div>}
          {error && <div className="text-center text-red-300">Error: {error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {products.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id}>
                <div className="cursor-pointer border border-white/20 rounded-xl p-5 shadow-lg bg-white/10 backdrop-blur-md hover:scale-105 transition-transform flex flex-col items-center h-84 justify-between">
                  {product.image ? (
                    <img
                      src={product.image.startsWith("http") ? product.image : `http://127.0.0.1:8000${product.image}`}
                      alt={product.name}
                      className="w-32 h-32 object-cover rounded mb-4 border border-white/30"
                    />
                  ) : (
                    <div className="w-32 h-32 flex items-center justify-center bg-white/20 rounded mb-4 text-white/60">
                      No Image
                    </div>
                  )}
                  <h2 className="text-lg font-bold mb-2 text-white text-center">{product.name}</h2>
                  <p className="text-white/80 mb-2 text-center line-clamp-3 h-12 overflow-hidden text-sm">{product.description || <span>&nbsp;</span>}</p>
                  <div className="text-lg font-semibold text-pink-300 mb-2">${product.price}</div>
                  {product.stock === 0 ? (
                    <div className="text-sm font-bold text-red-400 mb-2">Out of Stock</div>
                  ) : (
                    <div className="text-sm text-white/60 mb-2">Stock: {product.stock}</div>
                  )}
                  <button className="mt-2 w-full py-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded hover:from-pink-600 hover:to-orange-500 transition disabled:bg-gray-600 disabled:opacity-50" disabled={product.stock === 0}>
                    Add to Cart
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
