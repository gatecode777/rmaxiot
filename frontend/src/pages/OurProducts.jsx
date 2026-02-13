import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { productAPI, categoryAPI, wishlistAPI } from '../services/api';
import '../styles/ourproduct.css';
import defaultProduct from '../assets/default-product.png';

const OurProducts = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('createdAt');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Wishlist tracking
  const [wishlistItems, setWishlistItems] = useState(new Set());

  // Load initial data
  useEffect(() => {
    fetchCategories();
    fetchWishlist();
    
    // Get category from URL if present
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [selectedCategories, searchTerm, sortOption, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll({ isActive: true });

      // console.log(response.data.categories); // Log the categories data for debugging
      
      if (response.data.success) {
        // Only show main categories (no parent) and sort by order
        const mainCategories = response.data.categories
          .filter(cat => !cat.parentCategory)
          .sort((a, b) => a.order - b.order);
        
        setCategories(mainCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);

      const params = {
        page: currentPage,
        limit: 12,
        search: searchTerm.trim(),
        status: 'active',
      };

      // Add category filter
      if (selectedCategories.length > 0) {
        // Get category IDs
        const categoryIds = selectedCategories.map(catId => catId);
        params.category = categoryIds.join(',');
      }

      // Add sort
      if (sortOption === 'price-low') {
        params.sortBy = 'price.selling';
        params.order = 'asc';
      } else if (sortOption === 'price-high') {
        params.sortBy = 'price.selling';
        params.order = 'desc';
      } else if (sortOption === 'rating') {
        params.sortBy = 'rating.average';
        params.order = 'desc';
      } else {
        params.sortBy = 'createdAt';
        params.order = 'desc';
      }

      const response = await productAPI.getAll(params);

      if (response.data.success) {
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
        setTotalProducts(response.data.totalProducts);
      }

      setLoading(false);
      setLoadingProducts(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      setLoading(false);
      setLoadingProducts(false);
    }
  };

  const fetchWishlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await wishlistAPI.getWishlist();
      if (response.data.success) {
        const wishlistProductIds = new Set(
          response.data.wishlist.items.map(item => item.product._id)
        );
        setWishlistItems(wishlistProductIds);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
    setCurrentPage(1); // Reset to first page
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  const handleToggleWishlist = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to add to wishlist');
      navigate('/login');
      return;
    }

    try {
      const isInWishlist = wishlistItems.has(productId);

      if (isInWishlist) {
        await wishlistAPI.removeFromWishlist(productId);
        setWishlistItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        toast.success('Removed from wishlist');
      } else {
        await wishlistAPI.addToWishlist(productId);
        setWishlistItems(prev => new Set([...prev, productId]));
        toast.success('Added to wishlist');
      }

      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error(error.response?.data?.message || 'Failed to update wishlist');
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getImageUrl = (product) => {
    if (product.images && product.images.length > 0) {
      const apiUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      return `${apiUrl}/uploads/products/${product.images[0]}`;
    }
    return defaultProduct;
  };

  const formatPrice = (price) => {
    return `₹${price?.toLocaleString() || 0}/-`;
  };

  const renderColorDots = (product) => {
    if (product.specifications?.colors && product.specifications.colors.length > 0) {
      return product.specifications.colors.slice(0, 2).map((color, index) => (
        <span
          key={index}
          className="dot"
          style={{
            backgroundColor: color.hexCode || '#ccc',
            border: '1px solid #ddd',
          }}
          title={color.name}
        ></span>
      ));
    }
    return (
      <>
        <span className="dot blue"></span>
        <span className="dot pink"></span>
      </>
    );
  };

  const getCategoryProductCount = (categoryId) => {
    const category = categories.find(c => c._id === categoryId);
    return category?.productCount || 0;
  };

  // Calculate selected products count
  const selectedProductsCount = selectedCategories.reduce((count, categoryId) => 
    count + getCategoryProductCount(categoryId), 0
  );

  if (loading) {
    return (
      <div className="product-page-container">
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '40px', color: '#667eea' }}></i>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-page-container">
      {/* Sidebar Filters */}
      <aside className="sidebar">
        <div className="filter-group-pd">
          <div className="filter-header">
            <h3>Product Range</h3>
          </div>

          <div className="search-box">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <ul className="category-list">
            {categories.length === 0 ? (
              <li style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                No categories available
              </li>
            ) : (
              categories.map(category => (
                <li key={category._id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category._id)}
                      onChange={() => handleCategoryChange(category._id)}
                    />
                    {category.name}
                    <span>{category.productCount || 0}</span>
                  </label>
                </li>
              ))
            )}
          </ul>

          {selectedCategories.length > 0 && (
            <button
              className="clear-filters-btn"
              onClick={() => {
                setSelectedCategories([]);
                setCurrentPage(1);
              }}
              style={{
                marginTop: '16px',
                padding: '8px 16px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                width: '100%',
                fontWeight: '600',
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="top-bar">
          <div className="product-count">
            {selectedCategories.length > 0 ? (
              <>
                Filtered Products: <strong>{totalProducts}</strong>
              </>
            ) : (
              <>
                Total Products: <strong>{totalProducts}</strong>
              </>
            )}
          </div>
          <div className="sort-dropdown">
            <select value={sortOption} onChange={handleSortChange}>
              <option value="createdAt">Newest First</option>
              <option value="rating">By Rating</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loadingProducts ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '40px', color: '#667eea' }}></i>
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <i className="fas fa-box-open" style={{ fontSize: '60px', color: '#ddd', marginBottom: '20px' }}></i>
            <h3 style={{ color: '#999', marginBottom: '10px' }}>No products found</h3>
            <p style={{ color: '#999' }}>
              {searchTerm
                ? `No results for "${searchTerm}"`
                : selectedCategories.length > 0
                ? 'No products in selected categories'
                : 'No products available'}
            </p>
            {(searchTerm || selectedCategories.length > 0) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategories([]);
                  setCurrentPage(1);
                }}
                style={{
                  marginTop: '20px',
                  padding: '12px 24px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="product-grid">
            {products.map(product => (
              <div className="product-card" key={product._id}>
                <i
                  className={`fa-${wishlistItems.has(product._id) ? 'solid' : 'regular'} fa-heart wishlist`}
                  onClick={() => handleToggleWishlist(product._id)}
                  style={{
                    cursor: 'pointer',
                    color: wishlistItems.has(product._id) ? '#ff4757' : '#ccc',
                  }}
                ></i>
                <div
                  className="product-img"
                  onClick={() => navigate(`/products/${product.slug || product._id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={getImageUrl(product)}
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = defaultProduct;
                    }}
                  />
                </div>
                <h4
                  className="product-title"
                  onClick={() => navigate(`/products/${product.slug || product._id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  {product.name}
                </h4>
                <div className="swatches">{renderColorDots(product)}</div>
                <div className="price">{formatPrice(product.price?.selling)}</div>
                <button
                  className="buy-btn"
                  onClick={() => navigate(`/products/${product.slug || product._id}`)}
                >
                  VIEW DETAILS
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <a
              href="#"
              className={`arrow ${currentPage === 1 ? 'disabled' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage - 1);
              }}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </a>

            {/* Page Numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <a
                  key={pageNum}
                  href="#"
                  className={`page-num ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(pageNum);
                  }}
                >
                  {pageNum}
                </a>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="dots">....</span>
                <a
                  href="#"
                  className="page-num"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(totalPages);
                  }}
                >
                  {totalPages}
                </a>
              </>
            )}

            <a
              href="#"
              className={`arrow ${currentPage === totalPages ? 'disabled' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage + 1);
              }}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </a>
          </div>
        )}
      </main>
    </div>
  );
};

export default OurProducts;