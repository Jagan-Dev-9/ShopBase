
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import CustomSelect from "../../components/CustomSelect";
import { useTheme } from "../../contexts/ThemeContext";
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { isDark } = useTheme();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [inStockOnly, setInStockOnly] = useState(false);

  // Fetch products and categories
  useEffect(() => {
    Promise.all([
      fetch("http://127.0.0.1:8000/api/products/"),
      fetch("http://127.0.0.1:8000/api/products/categories/")
    ])
      .then(([productsRes, categoriesRes]) => {
        if (!productsRes.ok) throw new Error("Failed to fetch products");
        if (!categoriesRes.ok) throw new Error("Failed to fetch categories");
        return Promise.all([productsRes.json(), categoriesRes.json()]);
      })
      .then(([productsData, categoriesData]) => {
        setAllProducts(productsData);
        setFilteredProducts(productsData);
        setCategories(categoriesData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...allProducts];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category_slug === selectedCategory);
    }

    // Price range filter
    if (priceRange.min !== "") {
      filtered = filtered.filter(product => parseFloat(product.price) >= parseFloat(priceRange.min));
    }
    if (priceRange.max !== "") {
      filtered = filtered.filter(product => parseFloat(product.price) <= parseFloat(priceRange.max));
    }

    // Stock filter
    if (inStockOnly) {
      filtered = filtered.filter(product => product.stock > 0);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "price":
          aValue = parseFloat(a.price);
          bValue = parseFloat(b.price);
          break;
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "created_at":
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProducts(filtered);
  }, [allProducts, searchTerm, selectedCategory, sortBy, sortOrder, priceRange, inStockOnly]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSortBy("name");
    setSortOrder("asc");
    setPriceRange({ min: "", max: "" });
    setInStockOnly(false);
  };

  // Dynamic grid classes based on number of products
  const getGridClasses = (productCount) => {
    if (productCount === 1) {
      return "grid grid-cols-1 place-items-center gap-6 max-w-md mx-auto";
    } else if (productCount === 2) {
      return "grid grid-cols-1 sm:grid-cols-2 place-items-center gap-6 max-w-2xl mx-auto";
    } else if (productCount === 3) {
      return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 place-items-center gap-6 max-w-4xl mx-auto";
    } else {
      return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto";
    }
  };

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
          {/* Header */}
          <h1 className={`text-5xl sm:text-6xl md:text-7xl font-bold bg-clip-text text-transparent text-center mb-8 drop-shadow-2xl ${
            isDark 
              ? 'bg-gradient-to-br from-white via-pink-200 to-yellow-200'
              : 'bg-gradient-to-br from-purple-700 via-pink-500 to-orange-500'
          }`}>
            Products
          </h1>

          {/* Search and Filter Controls */}
          <div className="max-w-7xl mx-auto mb-8 overflow-visible">
            {/* Search Bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 z-10 pointer-events-none ${
                  isDark ? 'text-white/70' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 rounded-lg border backdrop-blur-md transition shadow-lg ${
                    isDark 
                      ? 'bg-white/10 border-white/20 text-white placeholder-gray-300 focus:border-pink-400 hover:bg-white/15'
                      : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-pink-500 hover:bg-white/90'
                  } focus:outline-none focus:ring-2 focus:ring-pink-500/50`}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition z-10 ${
                      isDark ? 'hover:bg-white/20 text-white/70' : 'hover:bg-gray-200 text-gray-500'
                    }`}
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              {/* Sort Controls */}
              <div className="flex gap-2">
                <CustomSelect
                  value={sortBy}
                  onChange={setSortBy}
                  options={[
                    { value: 'name', label: 'Sort by Name' },
                    { value: 'price', label: 'Sort by Price' },
                    { value: 'created_at', label: 'Sort by Date' }
                  ]}
                  placeholder="Sort by..."
                  className="min-w-[160px]"
                />
                
                <CustomSelect
                  value={sortOrder}
                  onChange={setSortOrder}
                  options={[
                    { value: 'asc', label: 'Ascending' },
                    { value: 'desc', label: 'Descending' }
                  ]}
                  placeholder="Order..."
                  className="min-w-[140px]"
                />
                
                <button
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className={`px-4 py-3 rounded-lg border backdrop-blur-md transition flex items-center gap-2 shadow-lg ${
                    isDark 
                      ? 'bg-white/10 border-white/20 text-white hover:bg-pink-500/20 hover:border-pink-400/40'
                      : 'bg-white/80 border-gray-300 text-gray-900 hover:bg-pink-100 hover:border-pink-400'
                  }`}
                >
                  <FunnelIcon className="h-5 w-5" />
                  Filters
                  <svg 
                    className={`w-4 h-4 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Advanced Filters Panel */}
            {filtersOpen && (
              <div className={`relative z-50 p-6 rounded-lg border backdrop-blur-md mb-6 shadow-xl transform transition-all duration-300 animate-fadeInUp overflow-visible ${
                isDark 
                  ? 'bg-white/10 border-white/20'
                  : 'bg-white/80 border-gray-300'
              }`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-visible">
                  {/* Category Filter */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-white' : 'text-gray-700'
                    }`}>
                      Category
                    </label>
                    <CustomSelect
                      value={selectedCategory}
                      onChange={setSelectedCategory}
                      options={[
                        { value: '', label: 'All Categories' },
                        ...categories.map(category => ({
                          value: category.slug,
                          label: category.name
                        }))
                      ]}
                      placeholder="Select category..."
                    />
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-white' : 'text-gray-700'
                    }`}>
                      Price Range
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                        className={`w-full px-3 py-2 rounded border transition shadow-md ${
                          isDark 
                            ? 'bg-white/10 border-white/20 text-white placeholder-gray-300 hover:bg-white/15 focus:border-pink-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:bg-gray-50 focus:border-pink-500'
                        } focus:outline-none focus:ring-2 focus:ring-pink-500/50`}
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                        className={`w-full px-3 py-2 rounded border transition shadow-md ${
                          isDark 
                            ? 'bg-white/10 border-white/20 text-white placeholder-gray-300 hover:bg-white/15 focus:border-pink-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:bg-gray-50 focus:border-pink-500'
                        } focus:outline-none focus:ring-2 focus:ring-pink-500/50`}
                      />
                    </div>
                  </div>

                  {/* Stock Filter */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-white' : 'text-gray-700'
                    }`}>
                      Availability
                    </label>
                    <label className={`flex items-center p-3 rounded border cursor-pointer transition ${
                      isDark 
                        ? 'bg-white/5 border-white/10 hover:bg-white/10'
                        : 'bg-white/50 border-gray-200 hover:bg-white/80'
                    }`}>
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="mr-3 rounded border-gray-300 text-pink-600 focus:ring-pink-500 focus:ring-2"
                      />
                      <span className={isDark ? 'text-white' : 'text-gray-700'}>
                        In Stock Only
                      </span>
                    </label>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className={`w-full px-4 py-2 rounded border transition flex items-center justify-center gap-2 shadow-md ${
                        isDark 
                          ? 'bg-red-500/20 border-red-400/30 text-red-300 hover:bg-red-500/30 hover:border-red-400/50'
                          : 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100 hover:border-red-400'
                      }`}
                    >
                      <XMarkIcon className="h-4 w-4" />
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Results Info */}
            <div className={`text-center mb-6 ${isDark ? 'text-white' : 'text-gray-700'}`}>
              Showing {filteredProducts.length} of {allProducts.length} products
              {searchTerm && (
                <span> for "{searchTerm}"</span>
              )}
            </div>
          </div>

          {loading && <div className={`text-center ${isDark ? 'text-white' : 'text-gray-700'}`}>Loading products...</div>}
          {error && <div className={`text-center ${isDark ? 'text-red-300' : 'text-red-600'}`}>Error: {error}</div>}
          
          {/* Products Grid */}
          <div className={getGridClasses(filteredProducts.length)}>
            {filteredProducts.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id}>
                <div className={`relative z-10 cursor-pointer border rounded-xl p-5 shadow-lg backdrop-blur-md hover:scale-105 transition-transform flex flex-col h-96 w-full max-w-sm ${
                  isDark 
                    ? 'border-white/20 bg-white/10'
                    : 'border-gray-200 bg-white/60'
                }`}>
                  {/* Fixed image section - 60% of card height with proper fitting */}
                  <div className={`h-3/5 flex items-center justify-center mb-3 overflow-hidden rounded ${
                    isDark ? 'bg-black/30 backdrop-blur-sm' : 'bg-white'
                  }`}>
                    {product.image ? (
                      <img
                        src={product.image.startsWith("http") ? product.image : `http://127.0.0.1:8000${product.image}`}
                        alt={product.name}
                        className={`w-full h-full object-contain rounded border ${
                          isDark ? 'border-white/30' : 'border-gray-300'
                        }`}
                        style={{ objectFit: 'contain' }}
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