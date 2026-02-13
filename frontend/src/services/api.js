// frontend/src/services/api.js
// Updated API service with separate admin and public product endpoints

import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('adminToken');
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      localStorage.removeItem('user');

      // Redirect to login if on admin page
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ==================== ADMIN AUTH ====================
export const adminAuth = {
  login: (credentials) => api.post('/admin/login', credentials),
  logout: () => api.post('/admin/logout'),
  getProfile: () => api.get('/admin/me'),
  updateProfile: (data) => api.put('/admin/profile', data),
  changePassword: (data) => api.put('/admin/change-password', data),
};

// ==================== USER AUTH ====================
export const userAuth = {
  register: (data) => api.post('/users/register', data),
  loginUser: (data) => api.post('/users/login', data),
  logout: () => api.post('/users/logout'),

  // PROFILE ENDPOINTS
  getProfile: () => api.get('/users/profile'),

  // Note: updateProfile uses fetch because FormData with axios has issues
  // Use the component's direct fetch call instead
  updateProfile: (formData) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const token = localStorage.getItem('token');

    return fetch(`${apiUrl}/users/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    }).then(res => res.json());
  },

  changePassword: (data) => api.put('/users/change-password', data),
  deleteProfileImage: () => api.delete('/users/profile-image'),
};

// ==================== USER MANAGEMENT (ADMIN) ====================
export const userAPI = {
  getAll: (params) => api.get('/admin/users', { params }),
  getById: (id) => api.get(`/admin/users/${id}`),
  toggleStatus: (id) => api.put(`/admin/users/${id}/toggle-status`),
  update: (id, data) => api.put(`/admin/users/${id}`, data),
  delete: (id) => api.delete(`/admin/users/${id}`),
  getStats: () => api.get('/admin/users/stats'),
  verify: (id) => api.put(`/admin/users/${id}/verify`),
};

// ==================== PRODUCT API ====================

// PUBLIC PRODUCT ENDPOINTS (No authentication required)
export const productAPI = {
  // Get all active products (PUBLIC)
  getAll: (params) => api.get('/products', { params }),

  // Get product by ID (PUBLIC)
  getById: (id) => api.get(`/products/${id}`),

  // Get product by slug (PUBLIC)
  getBySlug: (slug) => api.get(`/products/slug/${slug}`),

  // Get featured products (PUBLIC)
  getFeatured: (limit = 10) => api.get('/products/featured', { params: { limit } }),

  // Get best sellers (PUBLIC)
  getBestSellers: (limit = 10) => api.get('/products/best-sellers', { params: { limit } }),

  // Get new arrivals (PUBLIC)
  getNewArrivals: (limit = 10) => api.get('/products/new-arrivals', { params: { limit } }),

  // Get products by category (PUBLIC)
  getByCategory: (category, params = {}) => api.get(`/products/category/${category}`, { params }),

  // Search products (PUBLIC)
  search: (query, params = {}) => api.get('/products/search', { params: { q: query, ...params } }),
};

// ADMIN PRODUCT ENDPOINTS (Authentication required)
export const adminProductAPI = {
  // Get all products (ADMIN - can see all statuses)
  getAll: (params) => api.get('/admin/products', { params }),

  // Get product by ID (ADMIN)
  getById: (id) => api.get(`/admin/products/${id}`),

  // Create product (ADMIN)
  create: (formData) => api.post('/admin/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  // Update product (ADMIN)
  update: (id, formData) => api.put(`/admin/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  // Delete product (ADMIN)
  delete: (id) => api.delete(`/admin/products/${id}`),

  // Delete product image (ADMIN)
  deleteImage: (id, filename) => api.delete(`/admin/products/${id}/images/${filename}`),

  // Toggle featured status (ADMIN)
  toggleFeatured: (id) => api.put(`/admin/products/${id}/toggle-featured`),

  // Update product status (ADMIN)
  updateStatus: (id, status) => api.put(`/admin/products/${id}/status`, { status }),

  // Get product statistics (ADMIN)
  getStats: () => api.get('/admin/products/stats'),
};

// ==================== DASHBOARD ====================
export const dashboardAPI = {
  getStats: async () => {
    try {
      const [userStats, productStats] = await Promise.all([
        userAPI.getStats(),
        adminProductAPI.getStats(),
      ]);

      return {
        data: {
          success: true,
          stats: {
            ...userStats.data.stats,
            ...productStats.data.stats,
          },
        },
      };
    } catch (error) {
      return {
        data: {
          success: false,
          message: 'Failed to fetch dashboard stats',
        },
      };
    }
  },
};

// ==================== CART ====================
export const cartAPI = {
  getCart: () => api.get('/cart'),
  getCartCount: () => api.get('/cart/count'),
  addToCart: (productId, quantity, selectedColor) =>
    api.post('/cart/add', { productId, quantity, selectedColor }),
  updateQuantity: (productId, quantity, selectedColor) =>
    api.put('/cart/update', { productId, quantity, selectedColor }),
  removeItem: (productId, colorName) =>
    api.delete(`/cart/remove/${productId}?colorName=${colorName}`),
  clearCart: () => api.delete('/cart/clear'),
};

export const addressAPI = {
  getAll: () => api.get('/addresses'),
  getOne: (id) => api.get(`/addresses/${id}`),
  create: (data) => api.post('/addresses', data),
  update: (id, data) => api.put(`/addresses/${id}`, data),
  delete: (id) => api.delete(`/addresses/${id}`),
  setDefault: (id) => api.put(`/addresses/${id}/default`),
};

// ==================== WISHLIST ====================
export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  getWishlistCount: () => api.get('/wishlist/count'),
  checkWishlist: (productId) => api.get(`/wishlist/check/${productId}`),
  addToWishlist: (productId) => api.post('/wishlist/add', { productId }),
  removeFromWishlist: (productId) => api.delete(`/wishlist/remove/${productId}`),
  clearWishlist: () => api.delete('/wishlist/clear'),
  moveToCart: (productId) => api.post(`/wishlist/move-to-cart/${productId}`),
};

// ==================== ORDERS ====================
export const orderAPI = {
  createOrder: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),

  // Admin endpoints
  getAllOrders: (params) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
};


// ==================== CATEGORIES ====================

// PUBLIC CATEGORY ENDPOINTS
export const categoryAPI = {
  getAll: (params) => api.get('/categories', { params }),
  getById: (id) => api.get(`/categories/${id}`),
  getBySlug: (slug) => api.get(`/categories/slug/${slug}`),
};

// ADMIN CATEGORY ENDPOINTS
export const adminCategoryAPI = {
  getAll: (params) => api.get('/categories', { params }),
  getById: (id) => api.get(`/categories/${id}`),
  create: (formData) => api.post('/categories', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, formData) => api.put(`/categories/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/categories/${id}`),
  toggleActive: (id) => api.put(`/categories/${id}/toggle-active`),
  toggleFeatured: (id) => api.put(`/categories/${id}/toggle-featured`),
  deleteImage: (id) => api.delete(`/categories/${id}/image`),
  updateProductCounts: () => api.post('/categories/update-counts'),
};

export default api;