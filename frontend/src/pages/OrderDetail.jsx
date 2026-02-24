import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderAPI } from '../services/api';
import '../styles/singleorder.css';
import defaultProduct from '../assets/default-product.png';

const OrderDetailPage = () => {
    const navigate = useNavigate();
    const { orderId } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkLoginAndFetchOrder();
    }, [orderId]);

    const checkLoginAndFetchOrder = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login to view order details');
            navigate('/login');
            return;
        }
        fetchOrderDetails();
    };

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await orderAPI.getOrderById(orderId);

            if (response.data.success) {
                setOrder(response.data.order);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching order:', error);
            toast.error('Failed to load order details');
            setLoading(false);
            navigate('/my-orders');
        }
    };

    const handleBack = () => {
        navigate('/my-orders');
    };

    const handleDownloadInvoice = () => {
        console.log('Downloading invoice for order:', order?.orderNumber);
        toast.info('Invoice download feature coming soon!');
    };

    const handleDownloadManual = () => {
        console.log('Downloading manual');
        toast.info('Manual download feature coming soon!');
    };

    const handleReorder = () => {
        if (!order) return;
        
        // Navigate to products or add to cart
        console.log('Reordering products from order:', order.orderNumber);
        toast.info('Reorder feature coming soon!');
    };

    const handleContactSupport = () => {
        navigate('/support');
    };

    // Map backend status to display status
    const mapStatusToDisplay = (status) => {
        const statusMap = {
            pending: 'Orders Placed',
            confirmed: 'Confirmed',
            processing: 'In Packaging',
            shipped: 'Dispatched',
            out_for_delivery: 'Dispatched',
            delivered: 'Delivered',
            cancelled: 'Cancelled',
            refunded: 'Refunded',
        };
        return statusMap[status] || 'In Packaging';
    };

    // Helper function to determine progress percentage based on status
    const getProgressWidth = (status) => {
        const progressMap = {
            pending: '0%',
            confirmed: '25%',
            processing: '50%',
            shipped: '75%',
            out_for_delivery: '87%',
            delivered: '100%',
            cancelled: '0%',
            refunded: '0%',
        };
        return progressMap[status] || '50%';
    };

    // Helper function to determine which steps are done
    const isStepDone = (stepName, currentStatus) => {
        const steps = ['Orders Placed', 'Confirmed', 'In Packaging', 'Dispatched', 'Delivered'];
        const displayStatus = mapStatusToDisplay(currentStatus);
        
        const currentIndex = steps.indexOf(displayStatus);
        const stepIndex = steps.indexOf(stepName);
        
        return stepIndex <= currentIndex;
    };

    const getProductImageUrl = (filename) => {
        if (!filename) return defaultProduct;
        const apiUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';
        return `${apiUrl}/uploads/products/${filename}`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatPrice = (price) => {
        return `₹${price.toLocaleString('en-IN')}`;
    };

    const getPaymentMethodLabel = (method) => {
        const methods = {
            card: 'Credit/Debit Card',
            netbanking: 'Net Banking',
            upi: 'UPI',
            other_upi: 'UPI',
            emi: 'EMI',
            cod: 'Cash on Delivery',
        };
        return methods[method] || method;
    };

    const getPaymentStatusLabel = (status) => {
        const statuses = {
            pending: 'Pending',
            completed: 'Paid',
            failed: 'Failed',
            refunded: 'Refunded',
        };
        return statuses[status] || status;
    };

    if (loading) {
        return (
            <>
                <header className="odp-top-header">
                    <div className="odp-content-container">
                        <div className="odp-header-flex">
                            <div className="odp-header-left">
                                <h1 className="odp-main-heading">My Orders</h1>
                                <p className="odp-sub-heading">View, track, and manage your product orders in one place.</p>
                            </div>
                            <div className="odp-header-right">
                                <button onClick={handleBack} className="odp-back-link">
                                    <span>&larr;</span> Back
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="odp-main-content">
                    <div className="odp-content-container">
                        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                            <i className="fas fa-spinner fa-spin" style={{ fontSize: '40px', color: '#667eea', marginBottom: '16px' }}></i>
                            <p style={{ fontSize: '16px', color: '#666' }}>Loading order details...</p>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    if (!order) {
        return (
            <>
                <header className="odp-top-header">
                    <div className="odp-content-container">
                        <div className="odp-header-flex">
                            <div className="odp-header-left">
                                <h1 className="odp-main-heading">My Orders</h1>
                                <p className="odp-sub-heading">View, track, and manage your product orders in one place.</p>
                            </div>
                            <div className="odp-header-right">
                                <button onClick={handleBack} className="odp-back-link">
                                    <span>&larr;</span> Back
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="odp-main-content">
                    <div className="odp-content-container">
                        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                            <i className="fas fa-exclamation-triangle" style={{ fontSize: '48px', color: '#ff4444', marginBottom: '16px' }}></i>
                            <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>Order Not Found</h3>
                            <p style={{ fontSize: '16px', color: '#666', marginBottom: '24px' }}>
                                The order you're looking for doesn't exist or you don't have permission to view it.
                            </p>
                            <button className="odp-back-link" onClick={handleBack}>
                                Go Back to Orders
                            </button>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    const progressWidth = getProgressWidth(order.status);

    return (
        <>
            <header className="odp-top-header">
                <div className="odp-content-container">
                    <div className="odp-header-flex">
                        <div className="odp-header-left">
                            <h1 className="odp-main-heading">My Orders</h1>
                            <p className="odp-sub-heading">View, track, and manage your product orders in one place.</p>
                        </div>
                        <div className="odp-header-right">
                            <button onClick={handleBack} className="odp-back-link">
                                <span>&larr;</span> Back
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Section */}
            <main className="odp-main-content">
                <div className="odp-content-container">

                    {/* Order Tracking Section */}
                    <section className="odp-tracking-card">
                        <h2 className="odp-section-label">Order Details</h2>
                        <div className="odp-stepper-wrapper">
                            <div className="odp-progress-line">
                                <div className="odp-line-fill" style={{ width: progressWidth }}></div>
                            </div>
                            <div className="odp-steps-container">
                                {['Orders Placed', 'Confirmed', 'In Packaging', 'Dispatched', 'Delivered'].map((step) => (
                                    <div key={step} className={`odp-step-item ${isStepDone(step, order.status) ? 'odp-done' : ''}`}>
                                        <div className="odp-step-circle">✓</div>
                                        <span className="odp-step-text">{step}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Show cancelled/refunded message */}
                        {(order.status === 'cancelled' || order.status === 'refunded') && (
                            <div style={{
                                marginTop: '20px',
                                padding: '16px',
                                background: '#ffebee',
                                border: '1px solid #f44336',
                                borderRadius: '8px',
                                color: '#c62828'
                            }}>
                                <strong>Order {order.status === 'cancelled' ? 'Cancelled' : 'Refunded'}</strong>
                                {order.cancellation?.reason && (
                                    <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
                                        Reason: {order.cancellation.reason}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Show tracking info if available */}
                        {order.tracking?.trackingNumber && (
                            <div style={{
                                marginTop: '20px',
                                padding: '16px',
                                background: '#e3f2fd',
                                border: '1px solid #2196f3',
                                borderRadius: '8px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <i className="fas fa-shipping-fast" style={{ fontSize: '24px', color: '#2196f3' }}></i>
                                    <div>
                                        <strong style={{ display: 'block', marginBottom: '4px' }}>Tracking Information</strong>
                                        <p style={{ margin: 0, fontSize: '14px' }}>
                                            Tracking Number: <strong>{order.tracking.trackingNumber}</strong>
                                            {order.tracking.carrier && ` (${order.tracking.carrier})`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Product Items List */}
                    <div className="odp-products-list">
                        {order.items.map((item, index) => (
                            <div key={index} className="odp-item-card">
                                <div className="odp-item-img">
                                    <img 
                                        src={getProductImageUrl(item.productSnapshot.image)} 
                                        alt={item.productSnapshot.name}
                                        onError={(e) => {
                                            e.target.src = defaultProduct;
                                        }}
                                    />
                                </div>
                                <div className="odp-item-details">
                                    <h3 className="odp-item-title">{item.productSnapshot.name}</h3>
                                    <p className="odp-item-variant">Category: <strong>{item.productSnapshot.category}</strong></p>

                                    <div className="odp-info-grid">
                                        <div className="odp-info-row"><span>Order ID:</span> <strong>{order.orderNumber}</strong></div>
                                        <div className="odp-info-row"><span>Order Date:</span> <strong>{formatDate(order.placedAt || order.createdAt)}</strong></div>
                                        {item.selectedColor && (
                                            <div className="odp-info-row"><span>Color:</span> <strong>{item.selectedColor.name}</strong></div>
                                        )}
                                        <div className="odp-info-row"><span>Quantity:</span> <strong>{item.quantity} Unit(s)</strong></div>
                                        <div className="odp-info-row"><span>Price:</span> <strong>{formatPrice(item.price.selling)}</strong></div>
                                        <div className="odp-info-row"><span>Subtotal:</span> <strong>{formatPrice(item.subtotal)}</strong></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Info Cards */}
                    <div className="odp-summary-grid">
                        <div className="odp-summary-box">
                            <h4 className="odp-box-title">Product Details</h4>
                            {order.items.map((item, index) => (
                                <div key={index} className="odp-mini-prod">
                                    <div className="odp-mini-img">
                                        <img 
                                            src={getProductImageUrl(item.productSnapshot.image)} 
                                            alt="product"
                                            onError={(e) => {
                                                e.target.src = defaultProduct;
                                            }}
                                        />
                                    </div>
                                    <div className="odp-mini-info-text">
                                        <p className="odp-text-blue">{item.productSnapshot.name}</p>
                                        <p className="odp-text-small">Qty: {item.quantity} | {formatPrice(item.subtotal)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="odp-summary-box">
                            <h4 className="odp-box-title">Shipping Information</h4>
                            <p className="odp-text-blue">{order.shippingAddress.fullName}</p>
                            <p className="odp-text-address">
                                {order.shippingAddress.shippingAddress}
                                {order.shippingAddress.landmark && `, ${order.shippingAddress.landmark}`}
                                <br />
                                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}
                            </p>
                            <p className="odp-text-address">{order.shippingAddress.mobileNumber}</p>
                            <p className="odp-text-address">{order.shippingAddress.email}</p>
                        </div>

                        <div className="odp-summary-box">
                            <h4 className="odp-box-title">Payment Information</h4>
                            <div className="odp-row-space">
                                <span>Subtotal:</span>
                                <span>{formatPrice(order.pricing.subtotal)}</span>
                            </div>
                            <div className="odp-row-space">
                                <span>Delivery Charges:</span>
                                <span>{order.pricing.deliveryCharges === 0 ? 'FREE' : formatPrice(order.pricing.deliveryCharges)}</span>
                            </div>
                            {order.pricing.tax > 0 && (
                                <div className="odp-row-space">
                                    <span>Tax:</span>
                                    <span>{formatPrice(order.pricing.tax)}</span>
                                </div>
                            )}
                            {order.pricing.discount > 0 && (
                                <div className="odp-row-space">
                                    <span>Discount:</span>
                                    <span style={{ color: '#4caf50' }}>-{formatPrice(order.pricing.discount)}</span>
                                </div>
                            )}
                            <hr style={{ margin: '12px 0' }} />
                            <div className="odp-row-space" style={{ fontWeight: '600', fontSize: '16px' }}>
                                <span>Total:</span>
                                <span>{formatPrice(order.pricing.total)}</span>
                            </div>
                            <hr style={{ margin: '12px 0' }} />
                            <div className="odp-row-space">
                                <span>Payment Method:</span>
                                <span>{getPaymentMethodLabel(order.payment.method)}</span>
                            </div>
                            <div className="odp-row-space">
                                <span>Payment Status:</span>
                                <span style={{ 
                                    color: order.payment.status === 'completed' ? '#4caf50' : 
                                           order.payment.status === 'failed' ? '#f44336' : '#ff9800'
                                }}>
                                    {getPaymentStatusLabel(order.payment.status)}
                                </span>
                            </div>
                            <button onClick={handleDownloadInvoice} className="odp-invoice-btn">
                                Download Invoice
                            </button>
                        </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="odp-actions-container">
                        <button onClick={handleDownloadManual} className="odp-btn-outline">
                            Download Manual
                        </button>
                        <button onClick={handleReorder} className="odp-btn-outline">
                            Reorder Product
                        </button>
                        <button onClick={handleContactSupport} className="odp-btn-outline">
                            Contact Support
                        </button>
                    </div>

                </div>
            </main>

            {/* Footer Section */}
            <footer className="odp-bottom-footer">
                <div className="odp-content-container">
                    <div className="odp-footer-badges">
                        <div className="odp-badge-item"><span className="odp-check-icon">✓</span> Secure Payments</div>
                        <div className="odp-badge-item"><span className="odp-check-icon">✓</span> Verified Products</div>
                        <div className="odp-badge-item"><span className="odp-check-icon">✓</span> Warranty Available</div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default OrderDetailPage;