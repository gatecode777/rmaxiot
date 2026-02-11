import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Profile from './pages/MyProfile';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import TermsAndCondition from './pages/TermsAndCondition';
import ShippingPolicy from './pages/ShippingPolicy';
import ReturnsRefundsPolicy from './pages/ReturnsRefundsPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import OurProducts from './pages/OurProducts';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';
import ProductForm from './pages/admin/ProductForm';
import AdminCategories from './pages/admin/AdminCategories';

function App() {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!window.Swiper) return;

      new window.Swiper(".testimonial-swiper", {
        slidesPerView: 1,
        spaceBetween: 20,
        speed: 500,
        navigation: {
          nextEl: ".testimonial-next",
          prevEl: ".testimonial-prev",
        },
        breakpoints: {
          768: { slidesPerView: 2 },
          1200: { slidesPerView: 3 },
        },
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Routes>
      {/* Public Routes with Header/Footer */}
      <Route
        path="/"
        element={
          <div className="app">
            <Header />
            <Home />
            <Footer />
          </div>
        }
      />

      <Route
        path="/products/:slug"
        element={
          <div className="app">
            <Header />
            <ProductDetail />
            <Footer />
          </div>
        }
      />
      <Route
        path="/cart"
        element={
          <div className="app">
            <Header />
            <Cart />
            <Footer />
          </div>
        }
      />
      <Route
        path="/profile"
        element={
          <div className="app">
            <Header />
            <Profile />
            <Footer />
          </div>
        }
      />
      <Route
        path="/our-products"
        element={
          <div className="app">
            <Header />
            <OurProducts />
            <Footer />
          </div>
        }
      />
      <Route
        path="/about-us"
        element={
          <div className="app">
            <Header />
            <AboutUs />
            <Footer />
          </div>
        }
      />
      <Route
        path="/contact-us"
        element={
          <div className="app">
            <Header />
            <ContactUs />
            <Footer />
          </div>
        }
      />
      <Route
        path="/terms-and-condition"
        element={
          <div className="app">
            <Header />
            <TermsAndCondition />
            <Footer />
          </div>
        }
      />
      <Route
        path="/shipping-policy"
        element={
          <div className="app">
            <Header />
            <ShippingPolicy />
            <Footer />
          </div>
        }
      />
      <Route
        path="/returns-refunds-policy"
        element={
          <div className="app">
            <Header />
            <ReturnsRefundsPolicy />
            <Footer />
          </div>
        }
      />
      <Route
        path="/privacy-policy"
        element={
          <div className="app">
            <Header />
            <PrivacyPolicy />
            <Footer />
          </div>
        }
      />
      <Route
        path="/wishlist"
        element={
          <div className="app">
            <Header />
            <Wishlist />
            <Footer />
          </div>
        }
      />
      <Route
        path="/checkout"
        element={
          <div className="app">
            <Header />
            <Checkout />
          </div>
        }
      />

      <Route
        path="/login"
        element={
          <div className="app">
            <Header />
            <Login />
          </div>
        }
      />

      <Route
        path="/signup"
        element={
          <div className="app">
            <Header />
            <Signup />
          </div>
        }
      />

      {/* Admin Routes (No Header/Footer) */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/products" element={<AdminProducts />} />
      <Route path="/admin/products/new" element={<ProductForm />} />
      <Route path="/admin/products/edit/:id" element={<ProductForm />} />
      <Route path="/admin/categories" element={<AdminCategories />} />
    </Routes>
  );
}

export default App;
