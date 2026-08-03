import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import dns from 'dns';

// Set global DNS servers for resolving SRV database records
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

// Ensure default-product.png is available as a public static asset
try {
  const srcAsset = path.join(process.cwd(), 'src/assets/default-product.png');
  const destAsset = path.join(process.cwd(), 'public/default-product.png');
  if (fs.existsSync(srcAsset) && !fs.existsSync(destAsset)) {
    fs.copyFileSync(srcAsset, destAsset);
  }
} catch (e) {}

import connectDB from '@/server/config/db';

// Import controllers
const addressController = require('@/server/controllers/addressController');
const adminAuthController = require('@/server/controllers/adminAuthController');
const adminProductController = require('@/server/controllers/adminProductController');
const adminUserController = require('@/server/controllers/adminUserController');
const cartController = require('@/server/controllers/cartController');
const categoryController = require('@/server/controllers/categoryController');
const orderController = require('@/server/controllers/orderController');
const publicProductController = require('@/server/controllers/publicProductController');
const userController = require('@/server/controllers/userController');
const wishlistController = require('@/server/controllers/wishlistController');

// Import authentication middlewares
const { protect, authorize } = require('@/server/middleware/adminAuth');
const { userProtect } = require('@/server/middleware/userAuth');

// Registry of all API routes
const routeRegistry = [
  // ==================== USER AUTH & PROFILE ====================
  { method: 'POST', pattern: '/api/users/register', handlers: [userController.register] },
  { method: 'POST', pattern: '/api/users/login', handlers: [userController.login] },
  { method: 'POST', pattern: '/api/users/logout', handlers: [userController.logout] },
  { method: 'GET', pattern: '/api/users/profile', handlers: [userProtect, userController.getProfile] },
  { method: 'PUT', pattern: '/api/users/profile', handlers: [userProtect, userController.updateProfile] },
  { method: 'PUT', pattern: '/api/users/change-password', handlers: [userProtect, userController.changePassword] },
  { method: 'DELETE', pattern: '/api/users/profile-image', handlers: [userProtect, userController.deleteProfileImage] },

  // ==================== ADMIN AUTH & ACCOUNT ====================
  { method: 'POST', pattern: '/api/admin/login', handlers: [adminAuthController.login] },
  { method: 'POST', pattern: '/api/admin/logout', handlers: [protect, adminAuthController.logout] },
  { method: 'GET', pattern: '/api/admin/me', handlers: [protect, adminAuthController.getMe] },
  { method: 'PUT', pattern: '/api/admin/profile', handlers: [protect, adminAuthController.updateProfile] },
  { method: 'PUT', pattern: '/api/admin/change-password', handlers: [protect, adminAuthController.changePassword] },

  // ==================== ADMIN USERS ====================
  { method: 'GET', pattern: '/api/admin/users', handlers: [protect, adminUserController.getAllUsers] },
  { method: 'GET', pattern: '/api/admin/users/stats', handlers: [protect, adminUserController.getUserStats] },
  { method: 'GET', pattern: '/api/admin/users/:id', handlers: [protect, adminUserController.getUserById] },
  { method: 'PUT', pattern: '/api/admin/users/:id/toggle-status', handlers: [protect, adminUserController.toggleUserStatus] },
  { method: 'PUT', pattern: '/api/admin/users/:id', handlers: [protect, adminUserController.updateUser] },
  { method: 'DELETE', pattern: '/api/admin/users/:id', handlers: [protect, adminUserController.deleteUser] },
  { method: 'PUT', pattern: '/api/admin/users/:id/verify', handlers: [protect, adminUserController.verifyUser] },

  // ==================== ADMIN PRODUCTS ====================
  { method: 'GET', pattern: '/api/admin/products/stats', handlers: [protect, adminProductController.getProductStats] },
  { method: 'GET', pattern: '/api/admin/products', handlers: [protect, authorize('products.view'), adminProductController.getAllProducts] },
  { method: 'POST', pattern: '/api/admin/products', handlers: [protect, authorize('products.create'), adminProductController.createProduct] },
  { method: 'GET', pattern: '/api/admin/products/:id', handlers: [protect, authorize('products.view'), adminProductController.getProductById] },
  { method: 'PUT', pattern: '/api/admin/products/:id', handlers: [protect, authorize('products.edit'), adminProductController.updateProduct] },
  { method: 'DELETE', pattern: '/api/admin/products/:id', handlers: [protect, authorize('products.delete'), adminProductController.deleteProduct] },
  { method: 'DELETE', pattern: '/api/admin/products/:id/images/:filename', handlers: [protect, authorize('products.edit'), adminProductController.deleteProductImage] },
  { method: 'PUT', pattern: '/api/admin/products/:id/toggle-featured', handlers: [protect, authorize('products.edit'), adminProductController.toggleFeatured] },
  { method: 'PUT', pattern: '/api/admin/products/:id/status', handlers: [protect, authorize('products.edit'), adminProductController.updateProductStatus] },

  // ==================== ADMIN ORDERS ====================
  { method: 'GET', pattern: '/api/admin/orders', handlers: [protect, orderController.getAllOrders] },
  { method: 'GET', pattern: '/api/admin/orders/stats', handlers: [protect, orderController.getOrderStats] },
  { method: 'PUT', pattern: '/api/admin/orders/:id/status', handlers: [protect, orderController.updateOrderStatus] },

  // ==================== PUBLIC PRODUCTS ====================
  { method: 'GET', pattern: '/api/products', handlers: [publicProductController.getAllProducts] },
  { method: 'GET', pattern: '/api/products/featured', handlers: [publicProductController.getFeaturedProducts] },
  { method: 'GET', pattern: '/api/products/best-sellers', handlers: [publicProductController.getBestSellers] },
  { method: 'GET', pattern: '/api/products/new-arrivals', handlers: [publicProductController.getNewArrivals] },
  { method: 'GET', pattern: '/api/products/slug/:slug', handlers: [publicProductController.getProductBySlug] },
  { method: 'GET', pattern: '/api/products/category/:categoryIdOrSlug', handlers: [publicProductController.getProductsByCategory] },
  { method: 'GET', pattern: '/api/products/search', handlers: [publicProductController.searchProducts] },
  { method: 'GET', pattern: '/api/products/:id', handlers: [publicProductController.getProductById] },

  // ==================== CART ====================
  { method: 'GET', pattern: '/api/cart', handlers: [userProtect, cartController.getCart] },
  { method: 'GET', pattern: '/api/cart/count', handlers: [userProtect, cartController.getCartCount] },
  { method: 'POST', pattern: '/api/cart/add', handlers: [userProtect, cartController.addToCart] },
  { method: 'PUT', pattern: '/api/cart/update', handlers: [userProtect, cartController.updateCartItem] },
  { method: 'DELETE', pattern: '/api/cart/remove/:productId', handlers: [userProtect, cartController.removeFromCart] },
  { method: 'DELETE', pattern: '/api/cart/clear', handlers: [userProtect, cartController.clearCart] },

  // ==================== ADDRESSES ====================
  { method: 'GET', pattern: '/api/addresses', handlers: [userProtect, addressController.getAddresses] },
  { method: 'POST', pattern: '/api/addresses', handlers: [userProtect, addressController.createAddress] },
  { method: 'GET', pattern: '/api/addresses/:id', handlers: [userProtect, addressController.getAddress] },
  { method: 'PUT', pattern: '/api/addresses/:id', handlers: [userProtect, addressController.updateAddress] },
  { method: 'DELETE', pattern: '/api/addresses/:id', handlers: [userProtect, addressController.deleteAddress] },
  { method: 'PUT', pattern: '/api/addresses/:id/default', handlers: [userProtect, addressController.setDefaultAddress] },

  // ==================== WISHLIST ====================
  { method: 'GET', pattern: '/api/wishlist', handlers: [userProtect, wishlistController.getWishlist] },
  { method: 'GET', pattern: '/api/wishlist/count', handlers: [userProtect, wishlistController.getWishlistCount] },
  { method: 'GET', pattern: '/api/wishlist/check/:productId', handlers: [userProtect, wishlistController.checkWishlist] },
  { method: 'POST', pattern: '/api/wishlist/add', handlers: [userProtect, wishlistController.addToWishlist] },
  { method: 'DELETE', pattern: '/api/wishlist/remove/:productId', handlers: [userProtect, wishlistController.removeFromWishlist] },
  { method: 'DELETE', pattern: '/api/wishlist/clear', handlers: [userProtect, wishlistController.clearWishlist] },
  { method: 'POST', pattern: '/api/wishlist/move-to-cart/:productId', handlers: [userProtect, wishlistController.moveToCart] },

  // ==================== CATEGORIES ====================
  { method: 'GET', pattern: '/api/categories', handlers: [categoryController.getAllCategories] },
  { method: 'GET', pattern: '/api/categories/slug/:slug', handlers: [categoryController.getCategoryBySlug] },
  { method: 'GET', pattern: '/api/categories/:id', handlers: [categoryController.getCategory] },
  { method: 'POST', pattern: '/api/categories', handlers: [protect, authorize('admin', 'super_admin'), categoryController.createCategory] },
  { method: 'PUT', pattern: '/api/categories/:id', handlers: [protect, authorize('admin', 'super_admin'), categoryController.updateCategory] },
  { method: 'DELETE', pattern: '/api/categories/:id', handlers: [protect, authorize('admin', 'super_admin'), categoryController.deleteCategory] },
  { method: 'PUT', pattern: '/api/categories/:id/toggle-active', handlers: [protect, authorize('admin', 'super_admin'), categoryController.toggleActive] },
  { method: 'PUT', pattern: '/api/categories/:id/toggle-featured', handlers: [protect, authorize('admin', 'super_admin'), categoryController.toggleFeatured] },
  { method: 'DELETE', pattern: '/api/categories/:id/image', handlers: [protect, authorize('admin', 'super_admin'), categoryController.deleteCategoryImage] },

  // ==================== ORDERS ====================
  { method: 'POST', pattern: '/api/orders', handlers: [userProtect, orderController.createOrder] },
  { method: 'GET', pattern: '/api/orders/my-orders', handlers: [userProtect, orderController.getMyOrders] },
  { method: 'GET', pattern: '/api/orders/:id', handlers: [userProtect, orderController.getOrderById] },
  { method: 'PUT', pattern: '/api/orders/:id/cancel', handlers: [userProtect, orderController.cancelOrder] },
];

// Helper to save uploaded file
async function saveUploadedFile(file, folder) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const uploadDir = path.join(process.cwd(), 'public/uploads', folder);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const ext = path.extname(file.name) || '.jpg';
  // Standardize naming category/product/profile
  const prefix = folder.endsWith('s') ? folder.slice(0, -1) : folder;
  const filename = `${prefix}-${uniqueSuffix}${ext}`;
  const filePath = path.join(uploadDir, filename);
  
  fs.writeFileSync(filePath, buffer);
  return filename;
}

// Match route pattern with parameters
function matchRoute(routePattern, requestPath) {
  const patternSegments = routePattern.split('/').filter(Boolean);
  const pathSegments = requestPath.split('/').filter(Boolean);
  
  if (patternSegments.length !== pathSegments.length) {
    return null;
  }
  
  const params = {};
  for (let i = 0; i < patternSegments.length; i++) {
    const patternSeg = patternSegments[i];
    const pathSeg = pathSegments[i];
    
    if (patternSeg.startsWith(':')) {
      const paramName = patternSeg.slice(1);
      params[paramName] = pathSeg;
    } else if (patternSeg.toLowerCase() !== pathSeg.toLowerCase()) {
      return null;
    }
  }
  
  return params;
}

// Dynamic handler for incoming requests
async function handleRequest(request, context) {
  try {
    // connectDB will throw if all retries fail — caught below as 503
    await connectDB();
    
    const method = request.method;
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Search registry for matching route
    let matchedRoute = null;
    let pathParams = {};

    for (const route of routeRegistry) {
      if (route.method === method) {
        const params = matchRoute(route.pattern, pathname);
        if (params) {
          matchedRoute = route;
          pathParams = params;
          break;
        }
      }
    }

    if (!matchedRoute) {
      return NextResponse.json({ success: false, message: `Route not found: ${method} ${pathname}` }, { status: 404 });
    }

    // 1. Reconstruct Express req object
    const req = {
      method: method,
      headers: Object.fromEntries(request.headers.entries()),
      url: request.url,
      params: pathParams,
      query: Object.fromEntries(url.searchParams.entries()),
      body: {},
    };

    // Parse body if applicable
    if (method !== 'GET' && method !== 'HEAD') {
      const contentType = request.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        try {
          req.body = await request.json();
        } catch (e) {
          req.body = {};
        }
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        const text = await request.text();
        req.body = Object.fromEntries(new URLSearchParams(text).entries());
      } else if (contentType.includes('multipart/form-data')) {
        const formData = await request.formData();
        req.body = {};
        
        for (const [key, value] of formData.entries()) {
          if (value instanceof File) {
            // Handled separately
          } else {
            req.body[key] = value;
          }
        }

        // Process file: single category image
        const imageField = formData.get('image');
        if (imageField && imageField instanceof File && imageField.size > 0) {
          const filename = await saveUploadedFile(imageField, 'categories');
          req.file = {
            fieldname: 'image',
            originalname: imageField.name,
            mimetype: imageField.type,
            filename: filename,
            size: imageField.size,
          };
        }

        // Process file: single user profile image
        const profileField = formData.get('profile');
        if (profileField && profileField instanceof File && profileField.size > 0) {
          const filename = await saveUploadedFile(profileField, 'profiles');
          req.file = {
            fieldname: 'profile',
            originalname: profileField.name,
            mimetype: profileField.type,
            filename: filename,
            size: profileField.size,
          };
        }

        // Process file: multiple product images
        const images = formData.getAll('images');
        if (images && images.length > 0) {
          req.files = [];
          for (const img of images) {
            if (img instanceof File && img.size > 0) {
              const filename = await saveUploadedFile(img, 'products');
              req.files.push({
                fieldname: 'images',
                originalname: img.name,
                mimetype: img.type,
                filename: filename,
                size: img.size,
              });
            }
          }
        }
      }
    }

    // 2. Reconstruct Express res object
    let resStatus = 200;
    let resHeaders = {};
    let resBody = null;

    const res = {
      status(code) {
        resStatus = code;
        return this;
      },
      json(data) {
        resBody = JSON.stringify(data);
        resHeaders['content-type'] = 'application/json';
        return this;
      },
      send(data) {
        if (typeof data === 'object') {
          resBody = JSON.stringify(data);
          resHeaders['content-type'] = 'application/json';
        } else {
          resBody = data;
        }
        return this;
      },
      setHeader(name, value) {
        resHeaders[name.toLowerCase()] = value;
        return this;
      },
    };

    // 3. Process middleware pipeline
    const pipeline = matchedRoute.handlers;
    let currentIdx = 0;
    let wasNextCalled = false;

    const next = (err) => {
      if (err) {
        throw err;
      }
      currentIdx++;
      wasNextCalled = true;
    };

    while (currentIdx < pipeline.length) {
      wasNextCalled = false;
      const currentHandler = pipeline[currentIdx];
      
      await currentHandler(req, res, next);
      
      // If the handler didn't call next(), it means it completed the response
      if (!wasNextCalled) {
        break;
      }
    }

    // 4. Return matching NextResponse
    return new Response(resBody, {
      status: resStatus,
      headers: resHeaders,
    });

  } catch (error) {
    // DB connection failure → 503
    if (error.message && (error.message.includes('querySrv') || error.message.includes('ECONNREFUSED') || error.message.includes('timed out') || error.message.includes('ETIMEDOUT'))) {
      console.error('DB connection error:', error.message);
      return NextResponse.json({
        success: false,
        message: 'Database connection unavailable. Please try again shortly.',
      }, { status: 503 });
    }
    console.error('API execution error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    }, { status: 500 });
  }
}

export async function GET(request, context) {
  return handleRequest(request, context);
}

export async function POST(request, context) {
  return handleRequest(request, context);
}

export async function PUT(request, context) {
  return handleRequest(request, context);
}

export async function DELETE(request, context) {
  return handleRequest(request, context);
}

export async function PATCH(request, context) {
  return handleRequest(request, context);
}
export const dynamic = 'force-dynamic';
