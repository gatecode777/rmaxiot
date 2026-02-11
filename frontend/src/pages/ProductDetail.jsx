import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI, cartAPI, wishlistAPI } from '../services/api';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [error, setError] = useState('');

  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getBySlug(slug);

      if (response.data.success) {
        setProduct(response.data.product);
      } else {
        setError('Product not found');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Set default color when product loads
    if (product?.specifications?.colors?.length > 0 && !selectedColor) {
      setSelectedColor(product.specifications.colors[0]);
    }
    if (product) {
      checkWishlist();
    }
  }, [product]);

  const checkWishlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await wishlistAPI.checkWishlist(product._id);
      if (response.data.success) {
        setInWishlist(response.data.inWishlist);
      }
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const handleToggleWishlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to add to wishlist');
      navigate('/login');
      return;
    }

    try {
      if (inWishlist) {
        await wishlistAPI.removeFromWishlist(product._id);
        toast.success('Removed from wishlist');
        setInWishlist(false);
      } else {
        await wishlistAPI.addToWishlist(product._id);
        toast.success('Added to wishlist');
        setInWishlist(true);
      }
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error(error.response?.data?.message || 'Failed to update wishlist');
    }
  };

  const handleBuyNow = () => {
    setShowBuyModal(true);
    if (!selectedColor && product?.specifications?.colors?.length > 0) {
      setSelectedColor(product.specifications.colors[0]);
    }
  };

  const handleCloseBuyModal = () => {
    setShowBuyModal(false);
    setQuantity(1);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock?.available || 999)) {
      setQuantity(newQuantity);
    }
  };

  const handleConfirmPurchase = async () => {
    if (!checkLogin()) return;

    try {
      // Add to cart
      const response = await cartAPI.addToCart(
        product._id,
        quantity,
        selectedColor
      );

      if (response.data.success) {
        // Navigate to checkout
        navigate('/checkout');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to proceed');
    }
  };

  const checkLogin = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to continue');
      navigate('/login');
      return false;
    }
    return true;
  };

  const handleAddToCart = async () => {
    if (!checkLogin()) return;

    try {
      const response = await cartAPI.addToCart(
        product._id,
        1,
        product.specifications?.colors?.[0] || null
      );

      if (response.data.success) {
        toast.success('Item added to cart!');
        // Refresh cart count in header
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const getImageUrl = (filename) => {
    const apiUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${apiUrl}/uploads/products/${filename}`;
  };

  const getYouTubeEmbedUrl = (url) => {
    // Extract video ID from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }

    return url; // Return original if can't parse
  };

  const formatPrice = (price) => {
    return price?.toLocaleString() || '0';
  };

  const calculateDiscount = () => {
    if (product?.price?.mrp && product?.price?.selling) {
      return Math.round(((product.price.mrp - product.price.selling) / product.price.mrp) * 100);
    }
    return 0;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fa-solid fa-star"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fa-solid fa-star-half-stroke"></i>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="fa-regular fa-star"></i>);
    }

    return stars;
  };

  if (loading) {
    return (
      <main className="product-page-main">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading product...</p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="product-page-main">
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error || 'Product not found'}</p>
          <button className="btn buy-now" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="product-page-main">
      {/* Product Details Section */}
      <section>
        <div className="product-container">
          {/* Left Section: Image Gallery */}
          <div className="image-section">
            <div className="thumbnails">
              {product.images && product.images.length > 0 ? (
                product.images.map((image, index) => (
                  <img
                    key={index}
                    src={getImageUrl(image)}
                    alt={`${product.name} ${index + 1}`}
                    className={selectedImage === index ? 'active' : ''}
                    onClick={() => setSelectedImage(index)}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                    }}
                  />
                ))
              ) : (
                <img src="https://via.placeholder.com/100x100?text=No+Image" alt="No image" />
              )}
            </div>
            <div className="main-image"><button
                className="btn wishlist-btn"
                onClick={handleToggleWishlist}
                style={{
                  background: inWishlist ? '#ff4444' : 'white',
                  color: inWishlist ? 'white' : '#333',
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  cursor: 'pointer',
                  padding: '5px 10px',
                  fontSize: '20px',
                }}
              >
                <i className={`fa${inWishlist ? 's' : 'r'} fa-heart`}></i>
              </button>
              <img
                src={product.images?.[selectedImage] ? getImageUrl(product.images[selectedImage]) : 'https://via.placeholder.com/500x500?text=No+Image'}
                alt={product.name}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
                }}
              />
            </div>
          </div>

          {/* Right Section: Details */}
          <div className="details-section">
            <h1 className="product-title">{product.name}</h1>

            <div className="rating">
              {renderStars(product.rating?.average || 0)}
              <span className="rating-text">({product.rating?.average || 0} rating)</span>
            </div>

            <div className="pricing">
              <span className="mrp">MRP ₹{formatPrice(product.price?.mrp)}</span>
              {calculateDiscount() > 0 && (
                <span className="discount-badge">{calculateDiscount()}% Off</span>
              )}
            </div>
            <div className="final-price">
              ₹{formatPrice(product.price?.selling)} <span className="tax-info">(inclusive of all taxes)</span>
            </div>

            <div className="content-flex">
              {/* Features and Applications */}
              <div className="features-apps">
                {product.features && product.features.length > 0 && (
                  <>
                    <h3>Key Features:</h3>
                    <ul>
                      {product.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </>
                )}

                {product.applications && product.applications.length > 0 && (
                  <>
                    <h3>Applications:</h3>
                    <ul>
                      {product.applications.map((app, index) => (
                        <li key={index}>{app}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {/* Info Box */}
              <div className="info-box">
                {product.specifications?.colors && (
                  <div className="info-row">
                    <strong>Color:</strong>{" "}
                    {product.specifications.colors.map(c => c.name).join(" / ")}
                  </div>
                )}
                {product.specifications?.material && (
                  <div className="info-row"><strong>Material:</strong> {product.specifications.material}</div>
                )}
                {product.specifications?.itemCode && (
                  <div className="info-row"><strong>Item Code:</strong> {product.specifications.itemCode}</div>
                )}
                {product.specifications?.burningCapacity && (
                  <div className="info-row no-border"><strong>Burning Capacity:</strong> {product.specifications.burningCapacity}</div>
                )}
              </div>
            </div>

            <div className="action-buttons">
              <button className="btn buy-now" onClick={handleBuyNow}>
                Buy Now
              </button>
              <button className="btn add-to-cart" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <button className="btn demo">
                <i className="fa-solid fa-calendar-check"></i> Book Session For Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Description */}
      {product.description?.long && (
        <section className="product-description-container">
          <div className="desc-content">
            <p className="intro-text">{product.description.long}</p>
          </div>
        </section>
      )}

      {/* Service Info Bar */}
      <section className="service-info-bar">
        <div className="info-item">
          <div className="info-icon">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <div className="info-text">
            <p>{product.policies?.noRefund ? 'No Refund Policy' : product.policies?.exchangeOnly ? 'Exchange Only' : 'Refund Available'}</p>
          </div>
        </div>

        <div className="info-item">
          <div className="info-icon">
            <i className="fa-solid fa-truck-fast"></i>
          </div>
          <div className="info-text">
            <h3>Shipping Time</h3>
            <p>{product.shipping?.time || product.additionalInfo?.deliveryTime || '7-10 days'}</p>
          </div>
        </div>

        {product.policies?.inHouseManufacturing && (
          <div className="info-item">
            <div className="info-icon">
              <i className="fa-solid fa-gears"></i>
            </div>
            <div className="info-text">
              <p>In-house Manufacturing (OEM)</p>
            </div>
          </div>
        )}
      </section>

      {/* Product Specifications */}
      {product.specifications && (
        <section className="product-containerab">
          <div className="details-column">
            <h2 className="title">Product Details:</h2>
            <div className="details-grid">
              {product.specifications.typeOfMachine && (
                <>
                  <div className="label">Type of machine:</div>
                  <div className="value">{product.specifications.typeOfMachine}</div>
                </>
              )}
              {product.specifications.voltage && (
                <>
                  <div className="label">Voltage:</div>
                  <div className="value">{product.specifications.voltage}</div>
                </>
              )}
              {product.specifications.frequency && (
                <>
                  <div className="label">Frequency:</div>
                  <div className="value">{product.specifications.frequency}</div>
                </>
              )}
              {product.specifications.powerSource && (
                <>
                  <div className="label">Power Source:</div>
                  <div className="value">{product.specifications.powerSource}</div>
                </>
              )}
              {product.specifications.burningAbility && (
                <>
                  <div className="label">Burning Ability:</div>
                  <div className="value">{product.specifications.burningAbility}</div>
                </>
              )}
              {product.specifications.weight && (
                <>
                  <div className="label">Weight:</div>
                  <div className="value">{product.specifications.weight}</div>
                </>
              )}
              {product.specifications.dimensions && (
                <>
                  <div className="label">Product Dimensions:</div>
                  <div className="value">{product.specifications.dimensions}</div>
                </>
              )}
              {product.specifications.warranty && (
                <>
                  <div className="label">Warranty:</div>
                  <div className="value">{product.specifications.warranty}</div>
                </>
              )}
            </div>
          </div>

          {/* Additional Info Box */}
          {product.additionalInfo?.customizationAvailable && (
            <div className="info-box-wrapper">
              <div className="info-card">
                <h3 className="info-title">Additional Information</h3>
                <div className="dark-overlay">
                  <p>For bulk orders of 10 or more machines, customization is available as per customer requirements.</p>
                </div>
                <button className="interest-btn">Yes! I'm Interested</button>
              </div>
              <img src="/pointergirl.png" alt="Information Guide" className="woman-image" />
            </div>
          )}
        </section>
      )}

      {/* YouTube Videos Section */}
      {product.youtubeUrls && product.youtubeUrls.length > 0 && (
        <section className="featured-section">
          <div className="utubecontainer">
            <h2 className="main-title">Featured Videos</h2>
            <p className="subtitle">Watch our detailed product demonstrations and step-by-step tutorials to understand features, functionality, and usage with ease.</p>

            <div className="video-grid">
              {product.youtubeUrls.map((video, index) => (
                <div className="video-card" key={index}>
                  <div className="video-wrapper">
                    <iframe
                      src={getYouTubeEmbedUrl(video.url)}
                      title={video.title || `Product Video ${index + 1}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="card-content">
                    <h3>{video.title || 'Product Demo Video'}</h3>
                    {video.description && <p>{video.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      {product.rating && product.rating.count > 0 && (
        <section className="reviews-section">
          <div className="reviews-container">
            <div className="overall-rating">
              <h2 className="section-title">Ratings & Reviews:</h2>
              <div className="rating-number">
                <h3>{product.rating.average}/5 Rating</h3>
                <div className="stars">
                  {renderStars(product.rating.average)}
                </div>
              </div>
              <p className="review-count">{product.rating.count} Verified Customer Reviews</p>
              <button className="view-reviews-btn">View Reviews</button>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="newsletter-bar">
        <div className="newsletter-container">
          <div className="newsletter-text">
            <p>Receive our offers, releases and promos!</p>
          </div>
          <div className="newsletter-form">
            <input type="text" placeholder="Name" className="news-input" />
            <input type="email" placeholder="E-mail" className="news-input" />
          </div>
          <div className="newsletter-action">
            <p className="terms-text">
              By subscribing the newsletter, you agree to our <a href="#">Terms & Conditions.</a>
            </p>
            <button className="register-btn">Register Now</button>
          </div>
        </div>
      </section>
      {/* Buy Now Modal */}
      {showBuyModal && (
        <div className="modal-overlay" onClick={handleCloseBuyModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={handleCloseBuyModal}>&times;</span>

            <h2>{product.name}</h2>

            <div className="product-info-list">
              <p><strong>Item Code:</strong> {product.specifications?.itemCode || 'N/A'}</p>
              {product.specifications?.burningCapacity && (
                <p><strong>Product Capacity:</strong> {product.specifications.burningCapacity}</p>
              )}
              <p><strong>Price:</strong> ₹{formatPrice(product.price?.selling)} <span style={{ fontSize: '12px', color: '#666' }}>(inclusive of all taxes)</span></p>
              <p><strong>Delivery Charges:</strong> {product.shipping?.freeShipping ? 'FREE' : '₹250'}</p>
            </div>

            {/* Color Selection */}
            {product.specifications?.colors?.length > 0 && (
              <div className="color-selection-container">
                <label style={{
                  display: 'block',
                  marginBottom: '12px',
                  fontWeight: '600',
                  fontSize: '14px',
                  color: '#333'
                }}>
                  Select Color:
                </label>
                <div className="color-options" style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap',
                  marginBottom: '20px'
                }}>
                  {product.specifications.colors.map((color, index) => (
                    <div
                      key={index}
                      className={`color-option ${selectedColor?.name === color.name ? 'active' : ''}`}
                      onClick={() => setSelectedColor(color)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        border: selectedColor?.name === color.name ? '2px solid #667eea' : '2px solid #ddd',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        background: selectedColor?.name === color.name ? '#f0f4ff' : 'white',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {color.hexCode && (
                        <div style={{
                          width: '24px',
                          height: '24px',
                          backgroundColor: color.hexCode,
                          border: '2px solid #ddd',
                          borderRadius: '50%',
                          flexShrink: 0
                        }}></div>
                      )}
                      <span style={{
                        fontWeight: selectedColor?.name === color.name ? '600' : '400',
                        color: selectedColor?.name === color.name ? '#667eea' : '#333'
                      }}>
                        {color.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="modal-action-row">
              <div className="quantity-selector">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  readOnly
                />
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </button>
              </div>

              <button
                className="back-to-product-btn"
                onClick={handleCloseBuyModal}
              >
                Back to Product
              </button>
            </div>

            {/* Total Price */}
            <div style={{
              padding: '16px',
              background: '#f9f9f9',
              borderRadius: '8px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '20px'
            }}>
              <span style={{ fontWeight: '600', fontSize: '16px' }}>Total Amount:</span>
              <span style={{ fontWeight: '700', fontSize: '20px', color: '#667eea' }}>
                ₹{formatPrice((product.price?.selling || 0) * quantity)}
              </span>
            </div>

            {/* Confirm Button */}
            <button
              className="confirm-buy-btn"
              onClick={handleConfirmPurchase}
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              Confirm Purchase
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProductDetail;