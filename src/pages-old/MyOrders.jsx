import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderAPI } from '../services/api';
import '../styles/orderslist.css';

const MyOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);

    useEffect(() => {
        checkLoginAndFetchOrders();
    }, [currentPage]);

    const checkLoginAndFetchOrders = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login to view orders');
            navigate('/login');
            return;
        }
        fetchOrders();
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await orderAPI.getMyOrders({ page: currentPage, limit: 10 });

            if (response.data.success) {
                setOrders(response.data.orders);
                setTotalPages(response.data.totalPages);
                setTotalOrders(response.data.totalOrders);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleViewDetails = (orderId) => {
        navigate(`/order-details/${orderId}`);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const getStatusClass = (status) => {
        const statusMap = {
            pending: 'mo-status-pending',
            confirmed: 'mo-status-processing',
            processing: 'mo-status-processing',
            shipped: 'mo-status-shipped',
            out_for_delivery: 'mo-status-shipped',
            delivered: 'mo-status-delivered',
            cancelled: 'mo-status-cancelled',
            refunded: 'mo-status-refunded',
        };
        return statusMap[status] || 'mo-status-processing';
    };

    const getStatusLabel = (status) => {
        const statusLabels = {
            pending: 'Pending',
            confirmed: 'Confirmed',
            processing: 'Processing',
            shipped: 'Shipped',
            out_for_delivery: 'Out for Delivery',
            delivered: 'Delivered',
            cancelled: 'Cancelled',
            refunded: 'Refunded',
        };
        return statusLabels[status] || status;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const getTotalItems = (items) => {
        return items.reduce((total, item) => total + item.quantity, 0);
    };

    const formatPrice = (price) => {
        return `₹${price.toLocaleString('en-IN')}`;
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    if (loading) {
        return (
            <>
                <div className="mo-orders-page">
                    <header className="mo-main-header">
                        <div className="mo-container mo-header-flex">
                            <div className="mo-title-area">
                                <h1>My Orders</h1>
                                <p>View, track, and manage your product orders in one place.</p>
                            </div>
                            <button className="mo-back-btn" onClick={handleBack}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="19" y1="12" x2="5" y2="12"></line>
                                    <polyline points="12 19 5 12 12 5"></polyline>
                                </svg>
                                Back
                            </button>
                        </div>
                    </header>

                    <main className="mo-content-body">
                        <div className="mo-container">
                            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                                <i className="fas fa-spinner fa-spin" style={{ fontSize: '40px', color: '#667eea', marginBottom: '16px' }}></i>
                                <p style={{ fontSize: '16px', color: '#666' }}>Loading your orders...</p>
                            </div>
                        </div>
                    </main>
                </div>
            </>
        );
    }

    return (
        <>            
            <div className="mo-orders-page">
                {/* Header */}
                <header className="mo-main-header">
                    <div className="mo-container mo-header-flex">
                        <div className="mo-title-area">
                            <h1>My Orders</h1>
                            <p>View, track, and manage your product orders in one place.</p>
                            {totalOrders > 0 && (
                                <small style={{ color: '#666', fontSize: '14px', marginTop: '8px', display: 'block' }}>
                                    Total Orders: {totalOrders}
                                </small>
                            )}
                        </div>
                        <button className="mo-back-btn" onClick={handleBack}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                            Back
                        </button>
                    </div>
                </header>

                {/* Main Orders List */}
                <main className="mo-content-body">
                    <div className="mo-container">
                        {orders.length === 0 ? (
                            <div style={{ 
                                textAlign: 'center', 
                                padding: '80px 20px',
                                background: 'white',
                                borderRadius: '12px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                            }}>
                                <i className="fas fa-shopping-cart" style={{ 
                                    fontSize: '64px', 
                                    color: '#ddd', 
                                    marginBottom: '24px' 
                                }}></i>
                                <h3 style={{ fontSize: '24px', marginBottom: '12px', color: '#333' }}>
                                    No Orders Yet
                                </h3>
                                <p style={{ fontSize: '16px', color: '#666', marginBottom: '24px' }}>
                                    You haven't placed any orders yet.
                                </p>
                                <button 
                                     className="mo-details-btn"
                                     onClick={() => navigate('/our-products')}
                                     style={{ padding: '12px 32px' }}
                                 >
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Map through orders */}
                                {orders.map((order) => (
                                    <div className="mo-order-card" key={order._id}>
                                        <div className="mo-card-row">
                                            <div className="mo-info-text">
                                                <span className="mo-lbl-blue">Order ID:</span> {order.orderNumber}
                                            </div>
                                            <div className={`mo-status ${getStatusClass(order.status)}`}>
                                                {getStatusLabel(order.status)}
                                            </div>
                                        </div>
                                        <div className="mo-card-row">
                                            <div className="mo-info-text">
                                                <span className="mo-lbl-blue">Order Date:</span> {formatDate(order.placedAt || order.createdAt)}
                                            </div>
                                            <div className="mo-info-text">
                                                <span className="mo-lbl-blue">Total:</span> <strong>{formatPrice(order.pricing.total)}</strong>
                                            </div>
                                        </div>
                                        
                                        {/* Order Items */}
                                        {order.items && order.items.length > 0 && (
                                            <div className="mo-card-row">
                                                <div className="mo-product-info">
                                                    <span className="mo-prod-title">{order.items[0].productSnapshot.name}</span>
                                                    {order.items[0].selectedColor && (
                                                        <span className="mo-info-text">
                                                            <span className="mo-lbl-blue">Color:</span> {order.items[0].selectedColor.name}
                                                        </span>
                                                    )}
                                                    {order.items.length > 1 && (
                                                        <span className="mo-info-text" style={{ color: '#667eea', fontWeight: '600' }}>
                                                            +{order.items.length - 1} more item(s)
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="mo-card-row">
                                            <div className="mo-info-text">
                                                <span className="mo-lbl-blue">Total Items:</span> {getTotalItems(order.items)}
                                            </div>
                                            <button 
                                                className="mo-details-btn"
                                                onClick={() => handleViewDetails(order._id)}
                                            >
                                                View Order Details
                                            </button>
                                        </div>

                                        {/* Tracking Info */}
                                        {order.tracking?.trackingNumber && (
                                            <div className="mo-card-row" style={{ 
                                                background: '#f0f7ff', 
                                                margin: '12px -16px -16px -16px', 
                                                padding: '12px 16px',
                                                borderBottomLeftRadius: '12px',
                                                borderBottomRightRadius: '12px'
                                            }}>
                                                <div className="mo-info-text">
                                                    <i className="fas fa-shipping-fast" style={{ color: '#667eea', marginRight: '8px' }}></i>
                                                    <span className="mo-lbl-blue">Tracking:</span> {order.tracking.trackingNumber}
                                                    {order.tracking.carrier && (
                                                        <span style={{ marginLeft: '12px', color: '#666' }}>
                                                            ({order.tracking.carrier})
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="pagination">
                                        <button 
                                            className={`arrow ${currentPage === 1 ? 'disabled' : ''}`}
                                            onClick={handlePrevPage}
                                            disabled={currentPage === 1}
                                        >
                                            <i className="fa-solid fa-chevron-left"></i>
                                        </button>
                                        
                                        {getPageNumbers().map((page, index) => (
                                            page === '...' ? (
                                                <span key={`ellipsis-${index}`} className="page-ellipsis">...</span>
                                            ) : (
                                                <button
                                                    key={page}
                                                    className={`page-num ${currentPage === page ? 'active' : ''}`}
                                                    onClick={() => handlePageChange(page)}
                                                >
                                                    {page}
                                                </button>
                                            )
                                        ))}
                                        
                                        <button 
                                            className={`arrow ${currentPage === totalPages ? 'disabled' : ''}`}
                                            onClick={handleNextPage}
                                            disabled={currentPage === totalPages}
                                        >
                                            <i className="fa-solid fa-chevron-right"></i>
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </main>

                {/* Footer Badges */}
                <footer className="mo-footer-features">
                    <div className="mo-container mo-features-grid">
                        <div className="mo-feat-item">
                            <svg className="mo-feat-icon" viewBox="0 0 24 24">
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                            </svg>
                            <span className="mo-feat-text">Secure Payments</span>
                        </div>
                        <div className="mo-feat-item">
                            <svg className="mo-feat-icon" viewBox="0 0 24 24">
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                            </svg>
                            <span className="mo-feat-text">Verified Products</span>
                        </div>
                        <div className="mo-feat-item">
                            <svg className="mo-feat-icon" viewBox="0 0 24 24">
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                            </svg>
                            <span className="mo-feat-text">Warranty Available</span>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default MyOrders;