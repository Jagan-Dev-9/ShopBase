// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://shopbase.onrender.com';

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    // Auth endpoints
    login: '/api/accounts/login/',
    register: '/api/accounts/register/',
    profile: '/api/accounts/profile/',
    userProfile: '/api/accounts/me/',
    users: '/api/accounts/users/',
    
    // Product endpoints
    products: '/api/products/',
    categories: '/api/products/categories/',
    
    // Cart endpoints
    cart: '/api/cart/',
    cartAdd: '/api/cart/add/',
    cartUpdate: '/api/cart/update/',
    cartRemove: '/api/cart/remove/',
    cartClear: '/api/cart/clear/',
    
    // Payment endpoints
    createCheckoutSession: '/api/payments/create-checkout-session/',
    createCartCheckoutSession: '/api/payments/create-cart-checkout-session/',
    paymentHistory: '/api/payments/history/',
  }
};

// Helper function to build full API URLs
export const getApiUrl = (endpoint) => {
  return `${apiConfig.baseURL}${endpoint}`;
};

// Helper function to get media URL
export const getMediaUrl = (mediaPath) => {
  if (mediaPath.startsWith('http')) {
    return mediaPath;
  }
  return `${apiConfig.baseURL}${mediaPath}`;
};

export default apiConfig;
