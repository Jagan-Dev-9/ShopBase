"use client";
import Navbar from "../components/Navbar";
import { useTheme } from "../contexts/ThemeContext";

export default function Page() {
  const { isDark, mounted } = useTheme();

  // Prevent hydration mismatch by showing consistent state during SSR
  if (!mounted) {
    return (
      <div className="relative h-screen overflow-hidden bg-gradient-to-tr from-[#191720] via-[#35235e] via-70% to-[#fb7185]">
        {/* Glass/blur premium overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute left-1/4 top-0 h-80 w-2/5 blur-3xl bg-pink-300 opacity-20 rounded-full" />
          <div className="absolute right-5 bottom-1/4 h-72 w-1/3 blur-3xl bg-indigo-400 opacity-20 rounded-full" />
        </div>
        <Navbar />
        <div className="relative z-10 px-6 flex flex-col justify-center items-center h-full">
          <div className="text-center">
            <h1
              className="bg-gradient-to-br from-white via-pink-200 to-yellow-200 bg-clip-text text-transparent text-5xl sm:text-7xl font-extrabold drop-shadow-2xl tracking-tight"
              style={{
                textShadow: "0 6px 20px rgba(251,113,133,0.18), 0 1px 2px rgba(0,0,0,0.10)",
              }}
            >
              Powering your business<br />with <span className="font-black italic">ShopBase</span>
            </h1>
            <p className="mt-8 text-lg font-medium text-gray-200 sm:text-xl">
              The premium all-in-one ecommerce platform. Browse trending products, manage carts, and scale fast with modern tools.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">
              <a
                href="/products"
                className="rounded-lg bg-gradient-to-tr from-pink-500 via-orange-400 to-pink-400 px-7 py-3 text-base font-semibold text-white shadow-lg outline-none focus-visible:bg-pink-600 hover:scale-105 transition-all drop-shadow-lg border border-pink-300/40"
              >
                Shop Products
              </a>
              <a
                href="/register"
                className="border border-pink-300 px-7 py-3 text-base rounded-lg font-semibold text-pink-100 bg-white/5 backdrop-blur-md shadow hover:scale-105 transition hover:bg-pink-50/10 hover:text-pink-200"
              >
                Create Account <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-screen overflow-hidden ${
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
      <div className="relative z-10 px-6 flex flex-col justify-center items-center h-full">
        {/* Big premium hero */}
        <div className="text-center">
          <h1
            className={`bg-clip-text text-transparent text-5xl sm:text-7xl font-extrabold drop-shadow-2xl tracking-tight ${
              isDark 
                ? 'bg-gradient-to-br from-white via-pink-200 to-yellow-200'
                : 'bg-gradient-to-br from-purple-700 via-pink-500 to-orange-500'
            }`}
            style={{
              textShadow: isDark
                ? "0 6px 20px rgba(251,113,133,0.18), 0 1px 2px rgba(0,0,0,0.10)"
                : "0 6px 20px rgba(251,113,133,0.25), 0 1px 2px rgba(0,0,0,0.15)",
            }}
          >
            Powering your business<br />with <span className="font-black italic">ShopBase</span>
          </h1>
          <p className={`mt-8 text-lg font-medium sm:text-xl ${
            isDark ? 'text-gray-200' : 'text-gray-700'
          }`}>
            The premium all-in-one ecommerce platform. Browse trending products, manage carts, and scale fast with modern tools.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">
            <a
              href="/products"
              className="rounded-lg bg-gradient-to-tr from-pink-500 via-orange-400 to-pink-400 px-7 py-3 text-base font-semibold text-white shadow-lg outline-none focus-visible:bg-pink-600 hover:scale-105 transition-all drop-shadow-lg border border-pink-300/40"
            >
              Shop Products
            </a>
            <a
              href="/register"
              className={`border px-7 py-3 text-base rounded-lg font-semibold shadow hover:scale-105 transition ${
                isDark 
                  ? 'border-pink-300 text-pink-100 bg-white/5 backdrop-blur-md hover:bg-pink-50/10 hover:text-pink-200'
                  : 'border-pink-500 text-pink-600 bg-white/50 backdrop-blur-md hover:bg-pink-100/70 hover:text-pink-700'
              }`}
            >
              Create Account <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
