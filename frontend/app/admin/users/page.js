"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useTheme } from "../../../contexts/ThemeContext";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import { 
  UserIcon, 
  EnvelopeIcon, 
  ShieldCheckIcon, 
  TrashIcon, 
  PencilIcon,
  MagnifyingGlassIcon,
  PlusIcon
} from "@heroicons/react/24/outline";
import { getApiUrl, apiConfig } from "../../../utils/apiConfig";

export default function AdminUsersPage() {
  const { user, isAuthenticated, isAdmin, accessToken } = useAuth();
  const { isDark } = useTheme();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    role: "user",
    is_active: true,
  });

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push("/");
      return;
    }
    fetchUsers();
  }, [isAuthenticated, isAdmin, router]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(getApiUrl(apiConfig.endpoints.users), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } else {
        setMessage("Failed to fetch users");
        setUsers([]);
      }
    } catch (error) {
      setMessage("Network error");
      setUsers([]);
    }
    setLoading(false);
  };

  const handleEdit = (userToEdit) => {
    setEditingUser(userToEdit.id);
    setFormData({
      username: userToEdit.username,
      email: userToEdit.email,
      first_name: userToEdit.first_name || "",
      last_name: userToEdit.last_name || "",
      role: userToEdit.role,
      is_active: userToEdit.is_active,
    });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(getApiUrl(`${apiConfig.endpoints.users}${editingUser}/`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage("User updated successfully");
        setEditingUser(null);
        fetchUsers();
      } else {
        setMessage("Failed to update user");
      }
    } catch (error) {
      setMessage("Network error");
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const res = await fetch(getApiUrl(`${apiConfig.endpoints.users}${userId}/toggle-status/`), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        setMessage("User status updated");
        fetchUsers();
      } else {
        setMessage("Failed to update user status");
      }
    } catch (error) {
      setMessage("Network error");
    }
  };

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.first_name && u.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.last_name && u.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className={`relative min-h-screen flex items-center justify-center ${
        isDark 
          ? 'bg-gradient-to-tr from-[#191720] via-[#35235e] via-70% to-[#fb7185]'
          : 'bg-gradient-to-tr from-blue-50 via-pink-50 via-70% to-purple-100'
      }`}>
        <div className={`text-center ${isDark ? 'text-white' : 'text-gray-700'}`}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
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
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className={`text-5xl sm:text-6xl font-bold bg-clip-text text-transparent ${
              isDark 
                ? 'bg-gradient-to-br from-white via-pink-200 to-yellow-200'
                : 'bg-gradient-to-br from-purple-700 via-pink-500 to-orange-500'
            }`}>
              User Management
            </h1>
            <p className={`mt-2 text-lg ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
              Manage system users and permissions
            </p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg text-center ${
              message.includes('success') || message.includes('updated')
                ? isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-50 text-green-600'
                : isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-50 text-red-600'
            }`}>
              {message}
            </div>
          )}

          {/* Search and Filter */}
          <div className={`mb-6 p-4 rounded-xl border backdrop-blur-md shadow-xl ${
            isDark 
              ? 'bg-white/10 border-white/20'
              : 'bg-white/80 border-gray-300'
          }`}>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                  isDark ? 'text-white/70' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border backdrop-blur-md transition ${
                    isDark 
                      ? 'bg-white/10 border-white/20 text-white placeholder-gray-300'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-pink-500/50`}
                />
              </div>
              <div className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className={`rounded-xl border backdrop-blur-md shadow-xl overflow-hidden ${
            isDark 
              ? 'bg-white/10 border-white/20'
              : 'bg-white/80 border-gray-300'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${
                  isDark ? 'bg-white/5' : 'bg-gray-50/80'
                }`}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      User
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      Email
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      Role
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      Status
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className={`hover:${isDark ? 'bg-white/5' : 'bg-gray-50/50'} transition`}>
                      <td className="px-6 py-4">
                        {editingUser === u.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={formData.username}
                              onChange={(e) => setFormData({...formData, username: e.target.value})}
                              className={`w-full px-2 py-1 rounded border backdrop-blur-md text-sm ${
                                isDark 
                                  ? 'bg-white/10 border-white/20 text-white'
                                  : 'bg-white border-gray-300 text-gray-900'
                              }`}
                              placeholder="Username"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={formData.first_name}
                                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                className={`w-full px-2 py-1 rounded border backdrop-blur-md text-sm ${
                                  isDark 
                                    ? 'bg-white/10 border-white/20 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                                }`}
                                placeholder="First name"
                              />
                              <input
                                type="text"
                                value={formData.last_name}
                                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                className={`w-full px-2 py-1 rounded border backdrop-blur-md text-sm ${
                                  isDark 
                                    ? 'bg-white/10 border-white/20 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                                }`}
                                placeholder="Last name"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${
                              isDark ? 'bg-pink-500/20' : 'bg-pink-100'
                            }`}>
                              <UserIcon className={`h-4 w-4 ${
                                isDark ? 'text-pink-300' : 'text-pink-600'
                              }`} />
                            </div>
                            <div>
                              <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {u.username}
                              </div>
                              <div className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-500'}`}>
                                {u.first_name || u.last_name 
                                  ? `${u.first_name || ''} ${u.last_name || ''}`.trim()
                                  : 'No name set'
                                }
                              </div>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingUser === u.id ? (
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className={`w-full px-2 py-1 rounded border backdrop-blur-md text-sm ${
                              isDark 
                                ? 'bg-white/10 border-white/20 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                            placeholder="Email"
                          />
                        ) : (
                          <div className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {u.email}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingUser === u.id ? (
                          <select
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                            className={`px-2 py-1 rounded border backdrop-blur-md text-sm ${
                              isDark 
                                ? 'bg-white/10 border-white/20 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            u.role === 'admin'
                              ? isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-800'
                              : isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-800'
                          }`}>
                            <ShieldCheckIcon className="h-3 w-3 mr-1" />
                            {u.role === 'admin' ? 'Admin' : 'User'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingUser === u.id ? (
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.is_active}
                              onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                              className="mr-2"
                            />
                            <span className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              Active
                            </span>
                          </label>
                        ) : (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            u.is_active
                              ? isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-800'
                              : isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-800'
                          }`}>
                            {u.is_active ? 'Active' : 'Inactive'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {editingUser === u.id ? (
                            <>
                              <button
                                onClick={handleSave}
                                className={`p-1 rounded transition ${
                                  isDark 
                                    ? 'text-green-300 hover:bg-green-500/20'
                                    : 'text-green-600 hover:bg-green-100'
                                }`}
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingUser(null)}
                                className={`p-1 rounded transition ${
                                  isDark 
                                    ? 'text-gray-300 hover:bg-gray-500/20'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(u)}
                                className={`p-1 rounded transition ${
                                  isDark 
                                    ? 'text-blue-300 hover:bg-blue-500/20'
                                    : 'text-blue-600 hover:bg-blue-100'
                                }`}
                                disabled={u.id === user?.id}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleToggleStatus(u.id)}
                                className={`p-1 rounded transition ${
                                  u.is_active
                                    ? isDark ? 'text-red-300 hover:bg-red-500/20' : 'text-red-600 hover:bg-red-100'
                                    : isDark ? 'text-green-300 hover:bg-green-500/20' : 'text-green-600 hover:bg-green-100'
                                }`}
                                disabled={u.id === user?.id}
                              >
                                {u.is_active ? 'Deactivate' : 'Activate'}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className={`text-center py-8 ${isDark ? 'text-white/70' : 'text-gray-500'}`}>
                No users found
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
