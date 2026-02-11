import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { cartAPI } from '../services/api';
import "../styles/cart.css";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    checkLoginAndFetchCart();
  }, []);

  const checkLoginAndFetchCart = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to view cart');
      navigate('/login');
      return;
    }
    fetchCart();
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      
      if (response.data.success) {
        setCart(response.data.cart);
        setSelectedItems(response.data.cart.items.map(item => item._id));
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId, productId, selectedColor, change) => {
    const item = cart.items.find(i => i._id === itemId);
    const newQuantity = item.quantity + change;

    if (newQuantity < 1) return;
    if (newQuantity > item.product.stock?.available) {
      toast.error('Not enough stock available');
      return;
    }

    try {
      const response = await cartAPI.updateQuantity(productId, newQuantity, selectedColor);
      
      if (response.data.success) {
        setCart(response.data.cart);
        toast.success('Quantity updated');
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error(error.response?.data?.message || 'Failed to update quantity');
    }
  };

  const handleRemoveItem = async (itemId, productId, colorName) => {
    try {
      const response = await cartAPI.removeItem(productId, colorName);
      
      if (response.data.success) {
        setCart(response.data.cart);
        setSelectedItems(selectedItems.filter(id => id !== itemId));
        toast.success('Item removed from cart');
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  const handleSelectItem = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cart.items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.items.map(item => item._id));
    }
  };

  const getImageUrl = (filename) => {
    const apiUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${apiUrl}/uploads/products/${filename}`;
  };

  const formatPrice = (price) => {
    return price?.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  };

  const calculateSubtotal = () => {
    if (!cart) return 0;
    return cart.items
      .filter(item => selectedItems.includes(item._id))
      .reduce((total, item) => total + (item.priceAtAdd * item.quantity), 0);
  };

  const getSelectedItemsCount = () => {
    return cart?.items
      .filter(item => selectedItems.includes(item._id))
      .reduce((total, item) => total + item.quantity, 0) || 0;
  };

  const handleProceedToBuy = () => {
    if (selectedItems.length === 0) {
      toast.warning('Please select items to checkout');
      return;
    }
    localStorage.setItem('checkoutItems', JSON.stringify(selectedItems));
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="rmax-cart-section">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '40px', color: '#667eea' }}></i>
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="rmax-cart-section">
        <div className="rmax-cart-container">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <i className="fas fa-shopping-cart" style={{ fontSize: '60px', color: '#ccc', marginBottom: '20px' }}></i>
            <h2>Your cart is empty</h2>
            <p>Add some products to get started!</p>
            <button 
              className="proceed-btn" 
              style={{ marginTop: '20px' }}
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const deliveryFee = subtotal >= 5000 ? 0 : 250;
  const totalAmount = subtotal + deliveryFee;

  return (
    <div className="rmax-cart-section">
      <div className="rmax-cart-container">
        <div className="cart-header">
          <div className="title-area">
            <h1>Shopping Cart</h1>
            <a href="#" onClick={handleSelectAll}>
              {selectedItems.length === cart.items.length ? 'Deselect all items' : 'Select all items'}
            </a>
          </div>
          <div className="price-heading">Price</div>
        </div>

        <div className="items-list">
          {cart.items.map((item) => (
            <div key={item._id} className="cart-card">
              <div className="card-left">
                <input 
                  type="checkbox" 
                  checked={selectedItems.includes(item._id)}
                  onChange={() => handleSelectItem(item._id)}
                />

                <div className="product-img">
                  <img
                    src={
                      item.product?.images?.[0]
                        ? getImageUrl(item.product.images[0])
                        : item.product?.thumbnail
                        ? getImageUrl(item.product.thumbnail)
                        : 'https://via.placeholder.com/150x150?text=No+Image'
                    }
                    alt={item.product?.name || 'Product'}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
                    }}
                  />
                </div>

                <div className="product-info">
                  <h3>
                    <Link to={`/products/${item.product?.slug || item.product?._id}`}>
                      {item.product?.name || 'Product'}
                    </Link>
                  </h3>

                  {item.product?.rating && (
                    <div className="stars">
                      {'★'.repeat(Math.floor(item.product.rating.average))}
                      {'☆'.repeat(5 - Math.floor(item.product.rating.average))}
                      <span className="rating-text">
                        ({item.product.rating.average} rating)
                      </span>
                    </div>
                  )}

                  {item.selectedColor && (
                    <p className="variation">
                      Color: 
                      {item.selectedColor.hexCode && (
                        <span 
                          className="dot" 
                          style={{ 
                            backgroundColor: item.selectedColor.hexCode,
                            display: 'inline-block',
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            marginLeft: '8px',
                            marginRight: '4px',
                            border: '1px solid #ddd'
                          }}
                        ></span>
                      )}
                      {item.selectedColor.name}
                    </p>
                  )}

                  <p className="delivery">
                    {item.product?.shipping?.freeShipping || subtotal >= 5000 ? (
                      <>
                        <span style={{ color: 'green', fontWeight: '600' }}>FREE delivery</span>
                        <b> available at checkout</b>
                      </>
                    ) : (
                      <>Delivery charges: ₹250</>
                    )}
                  </p>

                  {item.product?.specifications?.dimensions && (
                    <p className="dims">
                      Product Dimensions: {item.product.specifications.dimensions}
                      {item.product.specifications.weight && ` | Weight: ${item.product.specifications.weight}`}
                    </p>
                  )}

                  <div className="actions">
                    <div className="qty-box">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(
                          item._id, 
                          item.product._id, 
                          item.selectedColor, 
                          -1
                        )}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={item.quantity}
                        readOnly
                      />
                      <button 
                        type="button" 
                        onClick={() => handleQuantityChange(
                          item._id, 
                          item.product._id, 
                          item.selectedColor, 
                          1
                        )}
                        disabled={item.quantity >= item.product?.stock?.available}
                      >
                        +
                      </button>
                    </div>

                    <div className="links">
                      <a 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveItem(item._id, item.product._id, item.selectedColor?.name);
                        }}
                      >
                        Delete
                      </a>
                      {' | '}
                      <Link to={`/products/${item.product?.slug || item.product?._id}`}>
                        View Product
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-right">
                <span className="price">₹{formatPrice(item.priceAtAdd * item.quantity)}</span>
                {item.priceAtAdd < item.product?.price?.mrp && (
                  <small style={{ 
                    color: '#666', 
                    textDecoration: 'line-through',
                    display: 'block',
                    fontSize: '12px'
                  }}>
                    MRP: ₹{formatPrice(item.product.price.mrp * item.quantity)}
                  </small>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="fill" 
                style={{ width: `${Math.min((subtotal / 5000) * 100, 100)}%` }}
              ></div>
            </div>
            <span className="progress-price">₹{formatPrice(subtotal)}</span>
          </div>

          <p className="delivery-status">
            {subtotal >= 5000 ? (
              <>
                <span className="green-tick">✔</span> Your order qualifies for FREE Delivery!
              </>
            ) : (
              <>Add ₹{formatPrice(5000 - subtotal)} more to qualify for FREE Delivery</>
            )}
          </p>

          <div className="subtotal-area">
            <div style={{ marginBottom: '10px' }}>
              <h2>
                Subtotal ({getSelectedItemsCount()} {getSelectedItemsCount() === 1 ? 'item' : 'items'}): 
                <span> ₹{formatPrice(subtotal)}</span>
              </h2>
              {deliveryFee > 0 && (
                <p style={{ color: '#666', fontSize: '14px', margin: '5px 0' }}>
                  Delivery Charges: ₹{formatPrice(deliveryFee)}
                </p>
              )}
              <p style={{ 
                fontWeight: '600', 
                fontSize: '18px', 
                color: '#333',
                margin: '10px 0'
              }}>
                Total: ₹{formatPrice(totalAmount)}
              </p>
            </div>
            
            <button 
              onClick={handleProceedToBuy} 
              className="proceed-btn"
              disabled={selectedItems.length === 0}
            >
              Proceed to Buy ({selectedItems.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;