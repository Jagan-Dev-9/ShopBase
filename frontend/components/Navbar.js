"use client";
import { useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon, ShoppingCartIcon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import ProfileIcon from "./ProfileIcon";
import { usePathname } from "next/navigation";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isDark, toggleTheme, mounted } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const { getCartItemCount } = useCart();

  // Background matching theme - use consistent styling during SSR
  const bgClass = isDark 
    ? "bg-[#35235e] shadow sticky top-0 left-0 w-full z-[60] border-b border-pink-300/20"
    : "bg-white shadow sticky top-0 left-0 w-full z-[60] border-b border-gray-200";

  // Prevent hydration mismatch by showing a consistent state during SSR
  if (!mounted) {
    return (
      <header className="bg-[#35235e] shadow sticky top-0 left-0 w-full z-[60] border-b border-pink-300/20">
        <nav className="flex items-center justify-between px-6 py-3 mx-auto max-w-7xl" aria-label="Global">
          {/* Logo and branding */}
          <div className="flex items-center gap-2 group">
            <img
              src="/shopbase_logo.png"
              alt="ShopBase Logo"
              className="h-10 w-auto rounded"
            />
            <span
              className="text-2xl font-extrabold text-white"
              style={{
                fontFamily: "'Racing Sans One', cursive",
                letterSpacing: "2px",
              }}
            >
              ShopBase
            </span>
          </div>
          
          {/* Placeholder for other elements */}
          <div className="hidden md:flex gap-4 items-center">
            <div className="w-16 h-8"></div> {/* Home placeholder */}
            <div className="w-20 h-8"></div> {/* Products placeholder */}
            <div className="w-8 h-8"></div> {/* Cart placeholder */}
            <div className="w-8 h-8"></div> {/* Theme toggle placeholder */}
            <div className="w-16 h-8"></div> {/* Login placeholder */}
            <div className="w-20 h-8"></div> {/* Register placeholder */}
          </div>
          
          {/* Mobile hamburger placeholder */}
          <div className="flex md:hidden">
            <div className="w-8 h-8"></div>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className={bgClass}>
      <nav className="flex items-center justify-between px-6 py-3 mx-auto max-w-7xl" aria-label="Global">
        {/* Logo and branding */}
        <Link href="/" className="flex items-center gap-2 group">
          <img
            src="/shopbase_logo.png"
            alt="ShopBase Logo"
            className="h-10 w-auto rounded"
          />
          <span
            className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}
            style={{
              fontFamily: "'Racing Sans One', cursive",
              letterSpacing: "2px",
            }}
          >
            ShopBase
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex gap-4 items-center">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`font-semibold px-4 py-2 rounded-full text-sm transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 ${
                  isActive
                    ? isDark 
                      ? "bg-pink-500 text-white"
                      : "bg-pink-500 text-white"
                    : isDark
                      ? "text-gray-300 hover:bg-pink-400 hover:text-white"
                      : "text-gray-600 hover:bg-pink-400 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
          {/* Cart icon */}
          <Link
            href="/cart"
            className={`ml-2 p-2 rounded-full border-2 transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 relative ${
              isDark 
                ? 'border-pink-300/40 bg-white/10 text-gray-300 hover:text-white hover:bg-pink-500/20 hover:border-pink-300'
                : 'border-pink-400/50 bg-pink-50/80 text-gray-600 hover:text-pink-600 hover:bg-pink-100 hover:border-pink-500'
            }`}
            aria-label="View cart"
          >
            <ShoppingCartIcon className="h-4 w-4" />
            {isAuthenticated && getCartItemCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {getCartItemCount()}
              </span>
            )}
          </Link>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`ml-2 p-2 rounded-full border-2 transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 ${
              isDark 
                ? 'border-pink-300/40 bg-white/10 text-gray-300 hover:text-white hover:bg-pink-500/20 hover:border-pink-300'
                : 'border-pink-400/50 bg-pink-50/80 text-gray-600 hover:text-pink-600 hover:bg-pink-100 hover:border-pink-500'
            }`}
            aria-label="Toggle theme"
          >
            {isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
          </button>

          {/* Auth buttons */}
          {!isAuthenticated ? (
            <>
              <Link
                href="/login"
                className="ml-4 font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-white text-sm transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 hover:from-pink-600 hover:to-orange-500"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className={`ml-2 font-semibold px-4 py-2 rounded-full border text-sm transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 ${
                  isDark 
                    ? 'border-pink-400 text-pink-300 bg-transparent hover:bg-pink-400 hover:text-white'
                    : 'border-pink-500 text-pink-500 bg-transparent hover:bg-pink-500 hover:text-white'
                }`}
              >
                Register
              </Link>
            </>
          ) : (
            <Link href="/account" className="ml-4 transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95">
              <ProfileIcon />
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="flex md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(true)} 
            aria-label="Open menu"
            className="p-2 rounded-full transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95"
          >
            <Bars3Icon className={`h-6 w-6 transition ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden fixed inset-0 z-[80] flex flex-col ${isDark ? 'bg-[#35235e]' : 'bg-white'}`}>
          <div className={`flex items-center justify-between px-6 py-3 border-b ${isDark ? 'border-pink-300/20' : 'border-gray-200'}`}>
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/shopbase_logo.png"
                alt="ShopBase Logo"
                className="h-8 w-auto rounded"
              />
              <span
                className={`text-xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}
                style={{
                  fontFamily: "'Racing Sans One', cursive",
                  letterSpacing: "2px",
                  textShadow: isDark ? "0 0 4px rgba(239, 67, 120, 0.6)" : "none",
                  marginTop: "-5px",
                }}
              >
                ShopBase
              </span>
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(false)} 
              aria-label="Close menu"
              className="p-2 rounded-full transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95"
            >
              <XMarkIcon className={`h-6 w-6 transition ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`} />
            </button>
          </div>
          <div className="flex flex-col gap-5 px-8 mt-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-lg px-6 py-3 rounded-full font-semibold transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 ${
                    isActive
                      ? isDark
                        ? "bg-[#C95792] text-white shadow-lg"
                        : "bg-pink-500 text-white shadow-lg"
                      : isDark
                        ? "text-gray-300 hover:bg-[#EF4378] hover:text-white"
                        : "text-gray-600 hover:bg-pink-400 hover:text-white"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}

            <div className="flex items-center gap-4 mt-6">
              <Link
                href="/cart"
                className={`p-2 rounded-full border-2 transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 ${
                  isDark 
                    ? 'border-pink-300/40 bg-white/10 text-gray-300 hover:text-white hover:bg-pink-500/20 hover:border-pink-300'
                    : 'border-pink-400/50 bg-pink-50/80 text-gray-600 hover:text-pink-600 hover:bg-pink-100 hover:border-pink-500'
                }`}
                onClick={() => setMobileMenuOpen(false)}
                aria-label="View cart"
              >
                <ShoppingCartIcon className="h-5 w-5" />
              </Link>

              {/* Theme toggle for mobile */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full border-2 transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 ${
                  isDark 
                    ? 'border-pink-300/40 bg-white/10 text-gray-300 hover:text-white hover:bg-pink-500/20 hover:border-pink-300'
                    : 'border-pink-400/50 bg-pink-50/80 text-gray-600 hover:text-pink-600 hover:bg-pink-100 hover:border-pink-500'
                }`}
                aria-label="Toggle theme"
              >
                {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </button>
            </div>

            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className="mt-8 font-semibold px-6 py-3 rounded-full bg-gradient-to-tr from-[#C95792] to-[#EF4378] text-white shadow-lg text-center transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 hover:from-[#c3507f]/90 hover:to-[#df346d]/90"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="mt-3 font-semibold px-6 py-3 rounded-full border border-[#EF4378] text-[#EF4378] bg-transparent shadow text-center transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 hover:bg-[#EF4378]/20 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            ) : (
              <Link
                href="/account"
                className="mt-8 transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ProfileIcon />
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
