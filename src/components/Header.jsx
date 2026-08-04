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

  const fetchCartCount = async (e) => {
    // If the event carries the new count directly, use it instantly — no API call needed
    if (e?.detail?.count !== undefined) {
      setCartCount(e.detail.count);
      return;
    }
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
        {/* Logo — far left */}
        <div className="header__logo">
          <Link to="/">
            <img src="/headerrmax.png" alt="RMAX Logo" style={{ background: '#ffffff' }} />
          </Link>
        </div>

        {/* Navigation — center (pushed by margin-left:auto on nav) */}
        <nav className={`header__nav ${isMenuOpen ? "active" : ""}`} id="navMenu">
          <ul className="nav-list">
            <li>
              <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>HOME</Link>
            </li>
            <li>
              <Link to="/our-products" className="nav-link" onClick={() => setIsMenuOpen(false)}>OUR PRODUCT</Link>
            </li>
            <li>
              <Link to="/contact-us" className="nav-link" onClick={() => setIsMenuOpen(false)}>CONTACT US</Link>
            </li>
            <li>
              <Link to="/about-us" className="nav-link" onClick={() => setIsMenuOpen(false)}>ABOUT US</Link>
            </li>

            {/* Mobile Login */}
            {!isLoggedIn && (
              <li className="mobile-login-item">
                <Link to="/login" className="mobile-login-btn" onClick={() => setIsMenuOpen(false)}>Log in</Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Search Bar */}
        <div className="header__search">
          <div className="search-wrapper">
            <i className="fas fa-search search-icon"></i>
            <input type="text" placeholder="Search Products" />
          </div>
        </div>

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
                <div className="header-icon-group">
                  {/* Cart Icon */}
                  <button
                    className="header-icon-btn"
                    onClick={() => navigate("/cart")}
                    title="Cart"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    {cartCount > 0 && (
                      <span className="header-badge">{cartCount}</span>
                    )}
                  </button>

                  {/* Wishlist Icon */}
                  <button
                    className="header-icon-btn wishlist-btn"
                    onClick={() => navigate("/wishlist")}
                    title="Wishlist"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    {wishlistCount > 0 && (
                      <span className="header-badge">{wishlistCount}</span>
                    )}
                  </button>
                </div>
              )}

              {/* Profile Icon */}
              <button className="header-icon-btn profile-btn" onClick={() => navigate("/profile")} title="My Profile">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
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