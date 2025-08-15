"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const { isDark } = useTheme();
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated (use useEffect to avoid render-time navigation)
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/account");
    }
  }, [isAuthenticated, authLoading, router]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className={`relative min-h-screen flex items-center justify-center ${
        isDark 
          ? 'bg-gradient-to-tr from-[#191720] via-[#35235e] via-70% to-[#fb7185]'
          : 'bg-gradient-to-tr from-blue-50 via-pink-50 via-70% to-purple-100'
      }`}>
        <div className={`text-center ${isDark ? 'text-white' : 'text-gray-700'}`}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render login form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(form.username, form.password);
    
    if (result.success) {
      router.push("/account");
    } else {
      setError(result.error);
    }
    setLoading(false);
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
        <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] px-4">
          <div className={`w-full max-w-md p-8 rounded-xl border backdrop-blur-md shadow-xl ${
            isDark 
              ? 'bg-white/10 border-white/20'
              : 'bg-white/80 border-gray-300'
          }`}>
            <div className="text-center mb-8">
              <h1 className={`text-3xl font-bold bg-clip-text text-transparent ${
                isDark 
                  ? 'bg-gradient-to-br from-white via-pink-200 to-yellow-200'
                  : 'bg-gradient-to-br from-purple-700 via-pink-500 to-orange-500'
              }`}>
                Welcome Back
              </h1>
              <p className={`mt-2 ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                Sign in to your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-white' : 'text-gray-700'
                }`}>
                  Username
                </label>
                <input
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={onChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border backdrop-blur-md transition shadow-md ${
                    isDark 
                      ? 'bg-white/10 border-white/20 text-white placeholder-gray-300 focus:border-pink-400'
                      : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-pink-500'
                  } focus:outline-none focus:ring-2 focus:ring-pink-500/50`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-white' : 'text-gray-700'
                }`}>
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={onChange}
                    required
                    className={`w-full px-4 py-3 pr-12 rounded-lg border backdrop-blur-md transition shadow-md ${
                      isDark 
                        ? 'bg-white/10 border-white/20 text-white placeholder-gray-300 focus:border-pink-400'
                        : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-pink-500'
                    } focus:outline-none focus:ring-2 focus:ring-pink-500/50`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                      isDark ? 'text-white/70 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className={`text-sm p-3 rounded-lg ${
                  isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-50 text-red-600'
                }`}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all shadow-lg ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 focus:from-pink-600 focus:to-orange-500'
                } text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50`}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                Don't have an account?{' '}
                <Link 
                  href="/register" 
                  className={`font-medium hover:underline ${
                    isDark ? 'text-pink-300' : 'text-pink-600'
                  }`}
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
