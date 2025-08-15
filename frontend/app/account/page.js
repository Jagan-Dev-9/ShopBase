"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { UserIcon, EnvelopeIcon, CalendarIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function AccountPage() {
  const { user, isAuthenticated, loading, logout, updateUserProfile } = useAuth();
  const { isDark } = useTheme();
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setMessage("");

    const result = await updateUserProfile(formData);
    
    if (result.success) {
      setMessage("Profile updated successfully!");
      setEditMode(false);
    } else {
      setMessage("Failed to update profile. Please try again.");
    }
    
    setUpdateLoading(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (loading) {
    return (
      <div className={`relative min-h-screen flex items-center justify-center ${
        isDark 
          ? 'bg-gradient-to-tr from-[#191720] via-[#35235e] via-70% to-[#fb7185]'
          : 'bg-gradient-to-tr from-blue-50 via-pink-50 via-70% to-purple-100'
      }`}>
        <div className={`text-center ${isDark ? 'text-white' : 'text-gray-700'}`}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p>Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
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
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className={`text-5xl sm:text-6xl font-bold bg-clip-text text-transparent ${
              isDark 
                ? 'bg-gradient-to-br from-white via-pink-200 to-yellow-200'
                : 'bg-gradient-to-br from-purple-700 via-pink-500 to-orange-500'
            }`}>
              My Account
            </h1>
            <p className={`mt-2 text-lg ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
              Welcome back, {user?.first_name || user?.username}!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className={`md:col-span-2 p-6 rounded-xl border backdrop-blur-md shadow-xl ${
              isDark 
                ? 'bg-white/10 border-white/20'
                : 'bg-white/80 border-gray-300'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Profile Information
                </h2>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`px-4 py-2 rounded-lg transition ${
                    isDark 
                      ? 'bg-pink-500/20 text-pink-300 hover:bg-pink-500/30'
                      : 'bg-pink-100 text-pink-600 hover:bg-pink-200'
                  }`}
                >
                  {editMode ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {message && (
                <div className={`mb-4 p-3 rounded-lg ${
                  message.includes('success') 
                    ? isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-50 text-green-600'
                    : isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-50 text-red-600'
                }`}>
                  {message}
                </div>
              )}

              {editMode ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        isDark ? 'text-white' : 'text-gray-700'
                      }`}>
                        First Name
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 rounded-lg border backdrop-blur-md transition ${
                          isDark 
                            ? 'bg-white/10 border-white/20 text-white placeholder-gray-300'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        } focus:outline-none focus:ring-2 focus:ring-pink-500/50`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        isDark ? 'text-white' : 'text-gray-700'
                      }`}>
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 rounded-lg border backdrop-blur-md transition ${
                          isDark 
                            ? 'bg-white/10 border-white/20 text-white placeholder-gray-300'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        } focus:outline-none focus:ring-2 focus:ring-pink-500/50`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      isDark ? 'text-white' : 'text-gray-700'
                    }`}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 rounded-lg border backdrop-blur-md transition ${
                        isDark 
                          ? 'bg-white/10 border-white/20 text-white placeholder-gray-300'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:outline-none focus:ring-2 focus:ring-pink-500/50`}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={updateLoading}
                      className={`px-6 py-2 rounded-lg font-semibold transition ${
                        updateLoading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500'
                      } text-white`}
                    >
                      {updateLoading ? 'Updating...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <UserIcon className={`h-5 w-5 ${isDark ? 'text-white/70' : 'text-gray-500'}`} />
                    <div>
                      <p className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-500'}`}>Full Name</p>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {user?.first_name || user?.last_name 
                          ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                          : 'Not provided'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <UserIcon className={`h-5 w-5 ${isDark ? 'text-white/70' : 'text-gray-500'}`} />
                    <div>
                      <p className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-500'}`}>Username</p>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {user?.username}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <EnvelopeIcon className={`h-5 w-5 ${isDark ? 'text-white/70' : 'text-gray-500'}`} />
                    <div>
                      <p className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-500'}`}>Email</p>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheckIcon className={`h-5 w-5 ${isDark ? 'text-white/70' : 'text-gray-500'}`} />
                    <div>
                      <p className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-500'}`}>Role</p>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {user?.role === 'admin' ? 'Administrator' : 'User'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CalendarIcon className={`h-5 w-5 ${isDark ? 'text-white/70' : 'text-gray-500'}`} />
                    <div>
                      <p className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-500'}`}>Member Since</p>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions Card */}
            <div className={`p-6 rounded-xl border backdrop-blur-md shadow-xl ${
              isDark 
                ? 'bg-white/10 border-white/20'
                : 'bg-white/80 border-gray-300'
            }`}>
              <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Quick Actions
              </h3>
              <div className="space-y-3">
                {user?.role === 'admin' && (
                  <button
                    onClick={() => router.push('/admin/users')}
                    className={`w-full p-3 rounded-lg text-left transition ${
                      isDark 
                        ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                        : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                    }`}
                  >
                    <div className="font-medium">Admin Panel</div>
                    <div className="text-sm opacity-70">Manage users and settings</div>
                  </button>
                )}
                
                <button
                  onClick={() => router.push('/products')}
                  className={`w-full p-3 rounded-lg text-left transition ${
                    isDark 
                      ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                >
                  <div className="font-medium">Browse Products</div>
                  <div className="text-sm opacity-70">Explore our catalog</div>
                </button>
                
                <button
                  onClick={handleLogout}
                  className={`w-full p-3 rounded-lg text-left transition ${
                    isDark 
                      ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}
                >
                  <div className="font-medium">Sign Out</div>
                  <div className="text-sm opacity-70">Log out of your account</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
