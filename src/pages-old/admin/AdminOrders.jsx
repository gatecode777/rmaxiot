import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/admin/AdminLayout';
import { orderAPI } from '../../services/api';
import '../../styles/admin/AdminOrders.css';

const AdminOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [statusFormData, setStatusFormData] = useState({
    status: '',
    comment: '',
    trackingNumber: '',
    carrier: '',
  });

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [searchTerm, filterStatus, filterPayment, currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const params = {
        page: currentPage,
        limit: 20,
      };

      if (searchTerm) params.search = searchTerm;
      if (filterStatus !== 'all') params.status = filterStatus;
      if (filterPayment !== 'all') params.paymentStatus = filterPayment;

      const response = await orderAPI.getAllOrders(params);

      if (response.data.success) {
        setOrders(response.data.orders);
        setTotalPages(response.data.totalPages);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await orderAPI.getOrderStats();
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();

    try {
      const response = await orderAPI.updateOrderStatus(
        selectedOrder._id,
        statusFormData
      );

      if (response.data.success) {
        toast.success('Order status updated successfully');
        setShowStatusModal(false);
        fetchOrders();
        fetchStats();
        resetStatusForm();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleChangeStatus = (order) => {
    setSelectedOrder(order);
    setStatusFormData({
      status: order.status,
      comment: '',
      trackingNumber: order.tracking?.trackingNumber || '',
      carrier: order.tracking?.carrier || '',
    });
    setShowStatusModal(true);
  };

  const resetStatusForm = () => {
    setStatusFormData({
      status: '',
      comment: '',
      trackingNumber: '',
      carrier: '',
    });
    setSelectedOrder(null);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: '#ffc107', bg: '#fff3cd', label: 'Pending' },
      confirmed: { color: '#2196f3', bg: '#e3f2fd', label: 'Confirmed' },
      processing: { color: '#9c27b0', bg: '#f3e5f5', label: 'Processing' },
      shipped: { color: '#ff9800', bg: '#fff3e0', label: 'Shipped' },
      out_for_delivery: { color: '#00bcd4', bg: '#e0f7fa', label: 'Out for Delivery' },
      delivered: { color: '#4caf50', bg: '#e8f5e9', label: 'Delivered' },
      cancelled: { color: '#f44336', bg: '#ffebee', label: 'Cancelled' },
      refunded: { color: '#9e9e9e', bg: '#f5f5f5', label: 'Refunded' },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span
        style={{
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '600',
          color: config.color,
          backgroundColor: config.bg,
        }}
      >
        {config.label}
      </span>
    );
  };

  const getPaymentBadge = (status) => {
    const config = {
      pending: { color: '#ffc107', bg: '#fff3cd' },
      completed: { color: '#4caf50', bg: '#e8f5e9' },
      failed: { color: '#f44336', bg: '#ffebee' },
      refunded: { color: '#9e9e9e', bg: '#f5f5f5' },
    };

    const badgeConfig = config[status] || config.pending;

    return (
      <span
        style={{
          padding: '4px 8px',
          borderRadius: '8px',
          fontSize: '11px',
          fontWeight: '600',
          color: badgeConfig.color,
          backgroundColor: badgeConfig.bg,
        }}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  const formatPrice = (price) => {
    return `₹${price?.toLocaleString('en-IN') || 0}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && orders.length === 0) {
    return (
      <AdminLayout>
        <div className="admin-loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading orders...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-orders">
        <div className="page-header">
          <div>
            <h1>Orders Management</h1>
            <p>Manage and track all customer orders</p>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#e3f2fd' }}>
                <i className="fas fa-shopping-cart" style={{ color: '#2196f3' }}></i>
              </div>
              <div className="stat-info">
                <h3>{stats.totalOrders}</h3>
                <p>Total Orders</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fff3cd' }}>
                <i className="fas fa-clock" style={{ color: '#ffc107' }}></i>
              </div>
              <div className="stat-info">
                <h3>{stats.pendingOrders}</h3>
                <p>Pending Orders</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#e8f5e9' }}>
                <i className="fas fa-check-circle" style={{ color: '#4caf50' }}></i>
              </div>
              <div className="stat-info">
                <h3>{stats.deliveredOrders}</h3>
                <p>Delivered</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#f3e5f5' }}>
                <i className="fas fa-rupee-sign" style={{ color: '#9c27b0' }}></i>
              </div>
              <div className="stat-info">
                <h3>{formatPrice(stats.totalRevenue)}</h3>
                <p>Total Revenue</p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="orders-controls">
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by order number, customer name, or phone..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>

          <select
            value={filterPayment}
            onChange={(e) => {
              setFilterPayment(e.target.value);
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="all">All Payment Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {/* Orders Table */}
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">
                    <i className="fas fa-shopping-cart"></i>
                    <p>No orders found</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <strong>{order.orderNumber}</strong>
                    </td>
                    <td>
                      <div>
                        <strong>{order.shippingAddress.fullName}</strong>
                        <br />
                        <small style={{ color: '#666' }}>
                          {order.shippingAddress.mobileNumber}
                        </small>
                      </div>
                    </td>
                    <td>{order.items.length} item(s)</td>
                    <td>
                      <strong>{formatPrice(order.pricing.total)}</strong>
                    </td>
                    <td>
                      <div>
                        <div style={{ marginBottom: '4px' }}>
                          {order.payment.method.toUpperCase()}
                        </div>
                        {getPaymentBadge(order.payment.status)}
                      </div>
                    </td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>
                      <small>{formatDate(order.placedAt)}</small>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-action btn-view"
                          onClick={() => handleViewDetails(order)}
                          title="View Details"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          className="btn-action btn-edit"
                          onClick={() => handleChangeStatus(order)}
                          title="Update Status"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <i className="fas fa-chevron-left"></i> Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedOrder && (
        <div className="modal-overlay active" onClick={() => setShowStatusModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Update Order Status</h2>
              <button className="close-btn" onClick={() => setShowStatusModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '20px', padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>
                <strong>Order: {selectedOrder.orderNumber}</strong>
                <br />
                <small>Customer: {selectedOrder.shippingAddress.fullName}</small>
              </div>

              <form onSubmit={handleUpdateStatus}>
                <div className="form-group">
                  <label>Order Status *</label>
                  <select
                    value={statusFormData.status}
                    onChange={(e) =>
                      setStatusFormData({ ...statusFormData, status: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Comment/Notes</label>
                  <textarea
                    value={statusFormData.comment}
                    onChange={(e) =>
                      setStatusFormData({ ...statusFormData, comment: e.target.value })
                    }
                    placeholder="Add any notes about this status change..."
                    rows="3"
                  />
                </div>

                {(statusFormData.status === 'shipped' ||
                  statusFormData.status === 'out_for_delivery') && (
                  <>
                    <div className="form-group">
                      <label>Tracking Number</label>
                      <input
                        type="text"
                        value={statusFormData.trackingNumber}
                        onChange={(e) =>
                          setStatusFormData({
                            ...statusFormData,
                            trackingNumber: e.target.value,
                          })
                        }
                        placeholder="Enter tracking number"
                      />
                    </div>

                    <div className="form-group">
                      <label>Carrier</label>
                      <input
                        type="text"
                        value={statusFormData.carrier}
                        onChange={(e) =>
                          setStatusFormData({ ...statusFormData, carrier: e.target.value })
                        }
                        placeholder="e.g., Blue Dart, DTDC, Delhivery"
                      />
                    </div>
                  </>
                )}

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowStatusModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    <i className="fas fa-save"></i> Update Status
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="modal-overlay active" onClick={() => setShowDetailsModal(false)}>
          <div
            className="modal-container modal-large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Order Details - {selectedOrder.orderNumber}</h2>
              <button className="close-btn" onClick={() => setShowDetailsModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              {/* Order Info */}
              <div className="order-detail-section">
                <h3>Order Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Order Number:</label>
                    <strong>{selectedOrder.orderNumber}</strong>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  <div className="detail-item">
                    <label>Payment Method:</label>
                    <span>{selectedOrder.payment.method.toUpperCase()}</span>
                  </div>
                  <div className="detail-item">
                    <label>Payment Status:</label>
                    {getPaymentBadge(selectedOrder.payment.status)}
                  </div>
                  <div className="detail-item">
                    <label>Order Date:</label>
                    <span>{formatDate(selectedOrder.placedAt)}</span>
                  </div>
                  {selectedOrder.tracking?.trackingNumber && (
                    <div className="detail-item">
                      <label>Tracking Number:</label>
                      <span>{selectedOrder.tracking.trackingNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Details */}
              <div className="order-detail-section">
                <h3>Shipping Address</h3>
                <div className="address-box">
                  <strong>{selectedOrder.shippingAddress.fullName}</strong>
                  <p>{selectedOrder.shippingAddress.shippingAddress}</p>
                  {selectedOrder.shippingAddress.landmark && (
                    <p>Landmark: {selectedOrder.shippingAddress.landmark}</p>
                  )}
                  <p>
                    {selectedOrder.shippingAddress.city},{' '}
                    {selectedOrder.shippingAddress.state} -{' '}
                    {selectedOrder.shippingAddress.pinCode}
                  </p>
                  <p>Phone: {selectedOrder.shippingAddress.mobileNumber}</p>
                  <p>Email: {selectedOrder.shippingAddress.email}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="order-detail-section">
                <h3>Order Items</h3>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Color</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <strong>{item.productSnapshot.name}</strong>
                          <br />
                          <small style={{ color: '#666' }}>
                            {item.productSnapshot.category}
                          </small>
                        </td>
                        <td>{item.selectedColor?.name || '-'}</td>
                        <td>{formatPrice(item.price.selling)}</td>
                        <td>{item.quantity}</td>
                        <td>
                          <strong>{formatPrice(item.subtotal)}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pricing Summary */}
              <div className="order-detail-section">
                <h3>Payment Summary</h3>
                <div className="pricing-summary">
                  <div className="pricing-row">
                    <span>Subtotal:</span>
                    <span>{formatPrice(selectedOrder.pricing.subtotal)}</span>
                  </div>
                  <div className="pricing-row">
                    <span>Delivery Charges:</span>
                    <span>
                      {selectedOrder.pricing.deliveryCharges === 0
                        ? 'FREE'
                        : formatPrice(selectedOrder.pricing.deliveryCharges)}
                    </span>
                  </div>
                  {selectedOrder.pricing.tax > 0 && (
                    <div className="pricing-row">
                      <span>Tax:</span>
                      <span>{formatPrice(selectedOrder.pricing.tax)}</span>
                    </div>
                  )}
                  {selectedOrder.pricing.discount > 0 && (
                    <div className="pricing-row">
                      <span>Discount:</span>
                      <span style={{ color: '#4caf50' }}>
                        -{formatPrice(selectedOrder.pricing.discount)}
                      </span>
                    </div>
                  )}
                  <hr />
                  <div className="pricing-row total">
                    <strong>Total:</strong>
                    <strong>{formatPrice(selectedOrder.pricing.total)}</strong>
                  </div>
                </div>
              </div>

              {/* Status History */}
              {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                <div className="order-detail-section">
                  <h3>Status History</h3>
                  <div className="status-timeline">
                    {selectedOrder.statusHistory.map((history, index) => (
                      <div key={index} className="timeline-item">
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                          <div>{getStatusBadge(history.status)}</div>
                          {history.comment && <p>{history.comment}</p>}
                          <small>{formatDate(history.updatedAt)}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;