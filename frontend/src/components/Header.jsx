import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { cartAPI, wishlistAPI } from '../services/api';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
  }, [location.pathname]);

  const fetchCartCount = async () => {
    try {
      const response = await cartAPI.getCartCount();
      if (response.data.success) {
        setCartCount(response.data.count);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const fetchWishlistCount = async () => {
    try {
      const response = await wishlistAPI.getWishlistCount();
      if (response.data.success) {
        setWishlistCount(response.data.count);
      }
    } catch (error) {
      console.error('Error fetching wishlist count:', error);
    }
  };

  // Check login status on mount and when localStorage changes
  useEffect(() => {
    checkLoginStatus();

    // listen custom auth event
    window.addEventListener("authChange", checkLoginStatus);

    // storage event (other tabs)
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("authChange", checkLoginStatus);
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchCartCount();
      fetchWishlistCount();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    // Listen for cart and wishlist updates
    window.addEventListener('cartUpdated', fetchCartCount);
    window.addEventListener('wishlistUpdated', fetchWishlistCount);

    return () => {
      window.removeEventListener('cartUpdated', fetchCartCount);
      window.removeEventListener('wishlistUpdated', fetchWishlistCount);
    };
  }, []);

  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // trigger event
    window.dispatchEvent(new Event("authChange"));

    setIsLoggedIn(false);
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="main-header">
      <div className="header-container">
        {/* Logo */}
        <div className="header__logo">
          <Link to="/">
            <img src="/headerrmax.png" alt="RMAX Logo" />
          </Link>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="header__search">
          <div className="search-wrapper">
            <i className="fas fa-search search-icon"></i>
            <input type="text" placeholder="Search Products" />
          </div>
        </div>

        {/* Navigation */}
        <nav className={`header__nav ${isMenuOpen ? "active" : ""}`} id="navMenu">
          <ul className="nav-list">
            <li>
              <Link to="/" className="nav-link">
                HOME
              </Link>
            </li>
            <li>
              <Link to="/our-products" className="nav-link">
                OUR PRODUCT
              </Link>
            </li>
            <li>
              <Link to="/contact-us" className="nav-link">
                CONTACT US
              </Link>
            </li>
            <li>
              <Link to="/about-us" className="nav-link">
                ABOUT US
              </Link>
            </li>

            {/* Mobile Login Item - Visible only in mobile menu when not logged in */}
            {!isLoggedIn && (
              <li className="mobile-login-item">
                <Link to="/login" className="mobile-login-btn">
                  Log in
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Right Actions */}
        <div className="header__actions">


          {/* Login/User Menu */}
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="btn-login">
                Log in
              </Link>
              <div className="mobile-menu-btn" id="menuBtn" onClick={toggleMenu}>
                <span>☰</span>
              </div>
            </>
          ) : (
            <div className="user-menu">
              {isLoggedIn && (
                <>
                  <button
                    className="action-icon cart-icon"
                    onClick={() => navigate("/cart")}
                    title="Cart"
                    style={{ position: 'relative' }}
                  >
                    <img src="/Vector.png" alt="Cart" />
                    {cartCount > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: '#ff4444',
                        color: 'white',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {cartCount}
                      </span>
                    )}
                  </button>

                  <button
                    className="action-icon wishlist-icon"
                    onClick={() => navigate("/wishlist")}
                    title="Wishlist"
                    style={{ position: 'relative' }}
                  >
                    <img src="/heart.png" alt="Wishlist" />
                    {wishlistCount > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: '#ff4444',
                        color: 'white',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {wishlistCount}
                      </span>
                    )}
                  </button>
                </>
              )}
              <button className="user-profile-btn" onClick={() => navigate("/profile")}>
                <i className="fas fa-user-circle"></i>
              </button>

              {/* Mobile Menu Button */}
              <div className="mobile-menu-btn" id="menuBtn" onClick={toggleMenu}>
                <span>☰</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;