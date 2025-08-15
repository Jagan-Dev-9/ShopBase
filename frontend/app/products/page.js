
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
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="pt-28 pb-12">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-300 text-center mb-8">
          Products
        </h1>
        {loading && <div className="text-center">Loading products...</div>}
        {error && <div className="text-center text-red-500">Error: {error}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products.map((product) => (
            <Link href={`/products/${product.id}`} key={product.id}>
              <div className="cursor-pointer border rounded-xl p-6 shadow-lg bg-white hover:scale-105 transition-transform flex flex-col items-center h-96 justify-between">
                {product.image ? (
                  <img
                    src={product.image.startsWith("http") ? product.image : `http://127.0.0.1:8000${product.image}`}
                    alt={product.name}
                    className="w-40 h-40 object-cover rounded mb-4 border"
                  />
                ) : (
                  <div className="w-40 h-40 flex items-center justify-center bg-gray-200 rounded mb-4 text-gray-400">
                    No Image
                  </div>
                )}
                <h2 className="text-xl font-bold mb-2 text-gray-800 text-center">{product.name}</h2>
                <p className="text-gray-600 mb-2 text-center line-clamp-3 h-16 overflow-hidden">{product.description || <span>&nbsp;</span>}</p>
                <div className="text-lg font-semibold text-pink-500 mb-2">${product.price}</div>
                {product.stock === 0 ? (
                  <div className="text-sm font-bold text-red-500 mb-2">Out of Stock</div>
                ) : (
                  <div className="text-sm text-gray-500 mb-2">Stock: {product.stock}</div>
                )}
                <button className="mt-2 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:bg-gray-400" disabled={product.stock === 0}>
                  Add to Cart
                </button>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}