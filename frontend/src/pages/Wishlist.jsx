import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { wishlistAPI, cartAPI } from "../services/api";
import "../styles/wishlist.css";
import defaultProduct from '../assets/default-product.png';

const Wishlist = () => {
  const navigate = useNavigate();
  
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLoginAndFetchWishlist();
  }, []);

  const checkLoginAndFetchWishlist = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to view wishlist");
      navigate("/login");
      return;
    }
    fetchWishlist();
  };

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistAPI.getWishlist();

      if (response.data.success) {
        setWishlist(response.data.wishlist);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast.error("Failed to load wishlist");
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const response = await wishlistAPI.removeFromWishlist(productId);

      if (response.data.success) {
        setWishlist(response.data.wishlist);
        toast.success("Removed from wishlist");
        // Update wishlist count in header
        window.dispatchEvent(new Event("wishlistUpdated"));
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove from wishlist");
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      // Add to cart
      const response = await cartAPI.addToCart(productId, 1, null);

      if (response.data.success) {
        toast.success("Added to cart");
        // Update cart count in header
        window.dispatchEvent(new Event("cartUpdated"));
        
        // Optionally remove from wishlist after adding to cart
        handleRemoveFromWishlist(productId);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  const getImageUrl = (filename) => {
    const apiUrl =
      import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";
    return `${apiUrl}/uploads/products/${filename}`;
  };

  const formatPrice = (price) => {
    return price?.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  };

  const calculateDiscount = (mrp, selling) => {
    if (!mrp || !selling) return 0;
    return Math.round(((mrp - selling) / mrp) * 100);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-stroke"></i>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="fas fa-star gray"></i>);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="containerwish">
        <div style={{ textAlign: "center", padding: "50px" }}>
          <i
            className="fas fa-spinner fa-spin"
            style={{ fontSize: "40px", color: "#667eea" }}
          ></i>
          <p>Loading wishlist...</p>
        </div>
      </div>
    );
  }

  if (!wishlist || wishlist.items.length === 0) {
    return (
      <div className="containerwish">
        <div className="wishlist-header">
          <i className="fas fa-heart"></i>
          <span>My Wishlist (0)</span>
        </div>

        <div style={{ textAlign: "center", padding: "50px" }}>
          <i
            className="fas fa-heart-broken"
            style={{ fontSize: "60px", color: "#ccc", marginBottom: "20px" }}
          ></i>
          <h2>Your wishlist is empty</h2>
          <p>Add some products you love!</p>
          <button
            onClick={() => navigate("/products")}
            style={{
              marginTop: "20px",
              padding: "12px 24px",
              background: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Continue Shopping
          </button>
        </div>

        {/* Bottom Features */}
        <div className="features-footer">
          <div className="feature-item">
            <i className="fas fa-bolt icon-green"></i> Low Power Consumption
          </div>
          <div className="feature-item">
            <i className="fas fa-gear icon-blue"></i> Easy Installation
          </div>
          <div className="feature-item">
            <i className="fas fa-leaf icon-green"></i> Eco-Friendly
          </div>
          <div className="feature-item">
            <i className="fas fa-id-card icon-blue"></i> Government Approved
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="containerwish">
      {/* Header */}
      <div className="wishlist-header">
        <i className="fas fa-heart"></i>
        <span>My Wishlist ({wishlist.items.length})</span>
      </div>

      {/* Item List */}
      <div className="wishlist-content">
        {wishlist.items.map((item) => {
          const discount = calculateDiscount(
            item.product?.price?.mrp,
            item.product?.price?.selling
          );

          return (
            <div key={item._id} className="wishlist-item">
              <Link
                to={`/products/${item.product?.slug || item.product?._id}`}
                className="product-img-box"
              >
                <img
                  src={
                    item.product?.images?.[0]
                      ? getImageUrl(item.product.images[0])
                      : item.product?.thumbnail
                      ? getImageUrl(item.product.thumbnail)
                      : defaultProduct
                  }
                  alt={item.product?.name || "Product"}
                  onError={(e) => {
                    e.target.src =
                      defaultProduct;
                  }}
                />
              </Link>

              <div className="product-details">
                <Link to={`/products/${item.product?.slug || item.product?._id}`}>
                  <h3 className="product-title">{item.product?.name || "Product"}</h3>
                </Link>

                {item.product?.rating && (
                  <div className="rating">
                    <div className="stars">
                      {renderStars(item.product.rating.average)}
                    </div>
                    <span className="rating-text">
                      ({item.product.rating.average} rating)
                    </span>
                  </div>
                )}

                <div className="price-info">
                  <div className="mrp-row">
                    <span className="mrp">
                      MRP ₹{formatPrice(item.product?.price?.mrp)}
                    </span>
                    {discount > 0 && (
                      <span className="discount-badge">{discount}% Off</span>
                    )}
                  </div>

                  <div className="final-price-row">
                    <span className="current-price">
                      ₹{formatPrice(item.product?.price?.selling)}
                    </span>
                    <span className="tax-info">(inclusive of all taxes)</span>
                    <span
                      className={`stock-status ${
                        item.product?.stock?.status === "In Stock"
                          ? "in-stock"
                          : "out-of-stock"
                      }`}
                    >
                      {item.product?.stock?.status || "Unknown"}
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                {/* <button
                  onClick={() => handleAddToCart(item.product._id)}
                  disabled={item.product?.stock?.status !== "In Stock"}
                  style={{
                    marginTop: "10px",
                    padding: "8px 16px",
                    background:
                      item.product?.stock?.status === "In Stock"
                        ? "#667eea"
                        : "#ccc",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor:
                      item.product?.stock?.status === "In Stock"
                        ? "pointer"
                        : "not-allowed",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  {item.product?.stock?.status === "In Stock"
                    ? "Add to Cart"
                    : "Out of Stock"}
                </button> */}
              </div>

              <div
                className="delete-btn"
                onClick={() => handleRemoveFromWishlist(item.product._id)}
                style={{ cursor: "pointer" }}
              >
                <i className="fas fa-trash-can"></i>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Features */}
      <div className="features-footer">
        <div className="feature-item">
          <i className="fas fa-bolt icon-green"></i> Low Power Consumption
        </div>
        <div className="feature-item">
          <i className="fas fa-gear icon-blue"></i> Easy Installation
        </div>
        <div className="feature-item">
          <i className="fas fa-leaf icon-green"></i> Eco-Friendly
        </div>
        <div className="feature-item">
          <i className="fas fa-id-card icon-blue"></i> Government Approved
        </div>
      </div>
    </div>
  );
};

export default Wishlist;