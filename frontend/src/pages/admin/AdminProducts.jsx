import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminProductAPI } from '../../services/api';
import '../../styles/admin/AdminProducts.css';
import defaultProduct from '../../assets/default-product.png';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState('');

  // Ref for debouncing search
  const searchTimeoutRef = useRef(null);

  // Debounced search effect
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout - fetch after 500ms of no typing
    searchTimeoutRef.current = setTimeout(() => {
      fetchProducts();
    }, 500);

    // Cleanup
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, filterCategory, filterStatus, currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page: currentPage,
        limit: 20,
        search: searchTerm.trim(),
        category: filterCategory,
        status: filterStatus,
      };

      const response = await adminProductAPI.getAll(params);

      if (response.data.success) {
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
        setTotalProducts(response.data.totalProducts);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.response?.data?.message || 'Failed to load products');
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      const response = await adminProductAPI.delete(selectedProduct._id);

      if (response.data.success) {
        setProducts(products.filter(p => p._id !== selectedProduct._id));
        setTotalProducts(totalProducts - 1);
        setShowDeleteModal(false);
        setSelectedProduct(null);

        // If current page is empty after delete, go to previous page
        if (products.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleToggleFeatured = async (productId) => {
    try {
      const response = await adminProductAPI.toggleFeatured(productId);

      if (response.data.success) {
        setProducts(products.map(p =>
          p._id === productId ? { ...p, isFeatured: !p.isFeatured } : p
        ));
      }
    } catch (error) {
      console.error('Error toggling featured:', error);
      alert(error.response?.data?.message || 'Failed to toggle featured status');
    }
  };

  if (loading && products.length === 0) {
    return (
      <AdminLayout>
        <div className="admin-loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading products...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-products">
        <div className="page-header">
          <div>
            <h1>Products Management</h1>
            <p>Manage your product catalog ({totalProducts} total)</p>
          </div>
          <Link to="/admin/products/new" className="btn-primary">
            <i className="fas fa-plus"></i>
            Add New Product
          </Link>
        </div>

        {error && (
          <div className="error-message" style={{
            background: '#fee',
            border: '1px solid #fcc',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
            color: '#c53030'
          }}>
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        {/* Filters */}
        <div className="products-controls">
          <div className="search-bar" style={{ position: 'relative' }}>
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            {loading && searchTerm && (
              <i className="fas fa-spinner fa-spin" style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#999'
              }}></i>
            )}
          </div>

          <div className="filter-group">
            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              <option value="Incinerator Machines">Incinerator Machines</option>
              <option value="Vending Machines">Vending Machines</option>
              <option value="GPS Devices">GPS Devices</option>
              <option value="Accessories">Accessories</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card-admin">
              <div className="product-image">
                <img
                  src={
                    product.images?.length > 0
                      ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/uploads/products/${product.images[0]}`
                      : product.thumbnail
                        ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/uploads/products/${product.thumbnail}`
                        : defaultProduct
                  }
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = defaultProduct;
                  }}
                />

                {product.isFeatured && (
                  <span className="featured-badge">
                    <i className="fas fa-star"></i> Featured
                  </span>
                )}
                <span className={`stock-badge ${product.stock?.status?.toLowerCase().replace(' ', '-')}`}>
                  {product.stock?.status || 'Unknown'}
                </span>
              </div>

              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-category">
                  <i className="fas fa-tag"></i>
                  {product.category?.name || 'Uncategorized'}
                </p>

                <div className="product-pricing">
                  <span className="selling-price">
                    ₹{product.price?.selling?.toLocaleString() || 0}
                  </span>
                  <span className="mrp-price">
                    ₹{product.price?.mrp?.toLocaleString() || 0}
                  </span>
                  {product.price?.discount && (
                    <span className="discount">
                      {product.price.discount}% OFF
                    </span>
                  )}
                </div>

                <div className="product-meta">
                  <div className="meta-item">
                    <i className="fas fa-star"></i>
                    <span>
                      {product.rating?.average || 0} ({product.rating?.count || 0})
                    </span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-boxes"></i>
                    <span>{product.stock?.available || 0} in stock</span>
                  </div>
                </div>

                <div className="product-actions">
                  <Link to={`/admin/products/edit/${product._id}`} className="btn-action btn-edit">
                    <i className="fas fa-edit"></i>
                    Edit
                  </Link>
                  <button
                    className="btn-action btn-view"
                    onClick={() => window.open(`/products/${product.slug || product._id}`, '_blank')}
                  >
                    <i className="fas fa-eye"></i>
                    View
                  </button>
                  <button
                    className={`btn-action ${product.isFeatured ? 'btn-featured' : 'btn-secondary'}`}
                    onClick={() => handleToggleFeatured(product._id)}
                    title="Toggle Featured"
                  >
                    <i className="fas fa-star"></i>
                  </button>
                  <button
                    className="btn-action btn-delete"
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowDeleteModal(true);
                    }}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && !error && (
          <div className="no-data">
            <i className="fas fa-box-open"></i>
            <p>No products found</p>
            <Link to="/admin/products/new" className="btn-primary">
              Add Your First Product
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <i className="fas fa-chevron-left"></i>
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button onClick={() => setShowDeleteModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="delete-warning">
                <i className="fas fa-exclamation-triangle"></i>
                <p>
                  Are you sure you want to delete{' '}
                  <strong>{selectedProduct?.name}</strong>?
                </p>
                <p className="warning-text">This action cannot be undone.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={handleDeleteProduct}
              >
                <i className="fas fa-trash"></i>
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;