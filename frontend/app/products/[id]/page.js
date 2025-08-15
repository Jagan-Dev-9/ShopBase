"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`http://localhost:8000/api/products/${id}/`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setProduct(data);
      } catch (e) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!product) return <div className="text-center mt-20">Product not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      <p className="mb-6 text-gray-700">{product.description}</p>
      <p className="mb-4 font-semibold">Price: ${product.price}</p>
      <p className="mb-8">Stock: {product.stock}</p>
      {/* Add image, add to cart, etc. later */}
    </div>
  );
}
