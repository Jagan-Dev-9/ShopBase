"use client";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Products", href: "/products" },
  { name: "Features", href: "#" },
  { name: "Marketplace", href: "#" },
  { name: "Company", href: "#" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-300 shadow">
      <nav className="flex items-center justify-between p-4 mx-auto max-w-7xl" aria-label="Global">
        <div className="flex items-center">
          <a href="#" className="flex items-center gap-2">
            <img
              src="/shopbase_logo.png"
              alt="ShopBase Logo"
              className="h-10 w-auto rounded"
            />
            <span className="text-xl font-semibold text-white">ShopBase</span>
          </a>
        </div>
        <div className="hidden md:flex gap-10">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-white font-medium hover:text-yellow-200"
            >
              {item.name}
            </a>
          ))}
          <a href="/login" className="ml-8 text-white font-semibold hover:text-yellow-200">
            Log in
          </a>
          <a href="/register" className="ml-4 text-white font-semibold hover:text-yellow-200">
            Register
          </a>
        </div>
        <div className="flex md:hidden">
          <button onClick={() => setMobileMenuOpen(true)}>
            <Bars3Icon className="h-8 w-8 text-white" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-gray-900 bg-opacity-95 flex flex-col">
          <div className="flex items-center justify-between p-4">
            <a href="#" className="flex items-center gap-2">
              <img src="/shopbase_logo.png" alt="Logo" className="h-8 w-auto rounded" />
              <span className="text-xl font-semibold text-white">ShopBase</span>
            </a>
            <button onClick={() => setMobileMenuOpen(false)}>
              <XMarkIcon className="h-8 w-8 text-white" />
            </button>
          </div>
          <div className="flex flex-col gap-6 px-6 mt-10">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-white text-lg font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <a href="#" className="mt-4 text-white font-semibold" onClick={() => setMobileMenuOpen(false)}>
              Log in
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
