import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { productAPI, wishlistAPI } from "../services/api";
import "../styles/style.css";
import "../styles/product.css";

const Home = () => {
    const navigate = useNavigate();

    const [bestSellerProducts, setBestSellerProducts] = useState([]);
    const [newArrivalProducts, setNewArrivalProducts] = useState([]);
    const [moreProducts, setMoreProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('best-seller');

    // Wishlist tracking
    const [wishlistItems, setWishlistItems] = useState(new Set());

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts();
        fetchWishlist();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);

            // Fetch best sellers
            const bestSellersRes = await productAPI.getAll({
                limit: 8,
            });

            if (bestSellersRes.data.success) {
                setBestSellerProducts(bestSellersRes.data.products);
            }

            // Fetch new arrivals (isNewArrival = true)
            const newArrivalsRes = await productAPI.getAll({
                isNewArrival: true,
                status: 'active',
                limit: 8,
            });

            if (newArrivalsRes.data.success) {
                setNewArrivalProducts(newArrivalsRes.data.products);
            }

            // Fetch featured products for "More Products" section
            const featuredRes = await productAPI.getAll({
                isFeatured: true,
                status: 'active',
                limit: 4,
            });

            if (featuredRes.data.success) {
                setMoreProducts(featuredRes.data.products);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    const fetchWishlist = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await wishlistAPI.getWishlist();
            if (response.data.success) {
                const wishlistProductIds = new Set(
                    response.data.wishlist.items.map(item => item.product._id)
                );
                setWishlistItems(wishlistProductIds);
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    };

    const handleToggleWishlist = async (productId, event) => {
        // Prevent navigation to product page
        event.stopPropagation();

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login to add to wishlist');
            navigate('/login');
            return;
        }

        try {
            const isInWishlist = wishlistItems.has(productId);

            if (isInWishlist) {
                await wishlistAPI.removeFromWishlist(productId);
                setWishlistItems(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(productId);
                    return newSet;
                });
                toast.success('Removed from wishlist');
            } else {
                await wishlistAPI.addToWishlist(productId);
                setWishlistItems(prev => new Set([...prev, productId]));
                toast.success('Added to wishlist');
            }

            // Update wishlist count in header
            window.dispatchEvent(new Event('wishlistUpdated'));
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            toast.error(error.response?.data?.message || 'Failed to update wishlist');
        }
    };

    const getImageUrl = (product) => {
        if (product.images && product.images.length > 0) {
            const apiUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
            return `${apiUrl}/uploads/products/${product.images[0]}`;
        }
        return 'https://via.placeholder.com/300x300?text=Product';
    };

    const formatPrice = (price) => {
        return `₹${price?.selling?.toLocaleString() || 0}/-`;
    };

    const renderColorDots = (product) => {
        if (product.specifications?.colors && product.specifications.colors.length > 0) {
            return product.specifications.colors.slice(0, 2).map((color, index) => (
                <span
                    key={index}
                    className="dot"
                    style={{
                        backgroundColor: color.hexCode || '#ccc',
                        border: '1px solid #ddd',
                    }}
                    title={color.name}
                ></span>
            ));
        }
        return (
            <>
                <span className="dot blue"></span>
                <span className="dot pink"></span>
            </>
        );
    };

    const openTab = (tabName) => {
        setActiveTab(tabName);
    };

    const testimonials = [
        {
            name: "Jyoti Rajawat",
            location: "Jaipur, Rajasthan",
            date: "29 September 2025",
            review:
                "Yes, this is a good platform for online business. We can make business easy by India mart...",
            img: "/jyoti.jpg",
        },
        {
            name: "Jyoti Rajawat",
            location: "Jaipur, Rajasthan",
            date: "29 September 2025",
            review:
                "Yes, this is a good platform for online business. We can make business easy by India mart...",
            img: "/jyoti.jpg",
        },
        {
            name: "Jyoti Rajawat",
            location: "Jaipur, Rajasthan",
            date: "29 September 2025",
            review:
                "Yes, this is a good platform for online business. We can make business easy by India mart...",
            img: "/jyoti.jpg",
        },
        {
            name: "Jyoti Rajawat",
            location: "Jaipur, Rajasthan",
            date: "29 September 2025",
            review:
                "Yes, this is a good platform for online business. We can make business easy by India mart...",
            img: "/jyoti.jpg",
        },
        {
            name: "Jyoti Rajawat",
            location: "Jaipur, Rajasthan",
            date: "29 September 2025",
            review:
                "Yes, this is a good platform for online business. We can make business easy by India mart...",
            img: "/jyoti.jpg",
        },
    ];

    return (
        <main id="main-content">
            {/* Hero Section */}
            <section className="hero-hygiene">
                <div className="container hero-hygiene__container">
                    <div className="hero-hygiene__content">
                        <div className="hero-text-col">
                            <h1 className="hero-hygiene__title">
                                Smart Hygiene & Automation Solutions
                            </h1>
                            <p className="hero-hygiene__description">
                                Trusted machines for sanitary waste management, vending systems, and smart service infrastructure.
                            </p>
                        </div>

                        <div className="hero-btn-col">
                            <a href="#" className="hero-hygiene__btn" onClick={(e) => {
                                e.preventDefault();
                                navigate('/products');
                            }}>
                                Explore Our Products
                            </a>
                        </div>
                    </div>

                    <div className="hero-hygiene__image-wrapper">
                        <img src="/hero-banner.png" alt="Smart Automation" className="hero-hygiene__img" />
                    </div>
                </div>
            </section>

            {/* Image Grid Section */}
            <section className="image-grid-section">
                <div className="grid-wrapper">
                    <div className="grid-item">
                        <img src="/image_1.png" alt="Service 1" />
                        <div className="grid-overlay">
                            <h2 className="stat-number">20000+</h2>
                        </div>
                    </div>

                    <div className="grid-item">
                        <img src="/image_3.png" alt="Service 2" />
                    </div>

                    <div className="grid-item">
                        <img src="/image_2.png" alt="Service 3" />
                        <div className="grid-overlaya">
                            <h2 className="stat-numbera">14+</h2>
                        </div>
                    </div>

                    <div className="grid-item">
                        <img src="/image_4.png" alt="Service 4" />
                    </div>
                </div>
            </section>

            {/* Product Tabs Section */}
            <section>
                <div className="containerab">
                    {/* Tabs Navigation */}
                    <div className="tabs-container">
                        <span
                            className={`tab ${activeTab === 'best-seller' ? 'active' : ''}`}
                            onClick={() => openTab('best-seller')}
                        >
                            Best Seller
                        </span>
                        <span
                            className={`tab ${activeTab === 'new-arrival' ? 'active' : ''}`}
                            onClick={() => openTab('new-arrival')}
                        >
                            New Arrival
                        </span>
                    </div>

                    <div className="tabs-content-wrap">
                        {/* Best Seller Content */}
                        <div id="best-seller" className={`tab-content ${activeTab === 'best-seller' ? 'active-content' : ''}`}>
                            {loading ? (
                                <div className="loading-spinner">
                                    <i className="fas fa-spinner fa-spin"></i>
                                    <p>Loading products...</p>
                                </div>
                            ) : bestSellerProducts.length > 0 ? (
                                <div className="product-grid">
                                    {bestSellerProducts.map((product) => (
                                        <div className="product-card" key={product._id}>
                                            <div className="image-box">
                                                <div 
                                                    className="wishlist"
                                                    onClick={(e) => handleToggleWishlist(product._id, e)}
                                                    style={{ cursor: 'pointer', top: '15px', right: '15px' }}
                                                >
                                                    <i 
                                                        className={`fa-${wishlistItems.has(product._id) ? 'solid' : 'regular'} fa-heart`}
                                                        style={{
                                                            color: wishlistItems.has(product._id) ? '#ff4757' : 'inherit',
                                                            fontSize: '20px',
                                                        }}
                                                    ></i>
                                                </div>
                                                <img
                                                    src={getImageUrl(product)}
                                                    alt={product.name}
                                                    onClick={() => navigate(`/products/${product.slug || product._id}`)}
                                                    style={{ cursor: 'pointer' }}
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/300x300?text=Product';
                                                    }}
                                                />
                                            </div>
                                            <div className="product-info">
                                                <h3 
                                                    className="product-title"
                                                    onClick={() => navigate(`/products/${product.slug || product._id}`)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {product.name}
                                                </h3>
                                                <div className="color-dots">
                                                    {renderColorDots(product)}
                                                </div>
                                                <p className="price">{formatPrice(product.price)}</p>
                                                <button
                                                    className="buy-btn"
                                                    onClick={() => navigate(`/products/${product.slug || product._id}`)}
                                                >
                                                    VIEW DETAILS
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-products">
                                    <p>No best seller products available</p>
                                </div>
                            )}
                        </div>

                        {/* New Arrival Content */}
                        <div id="new-arrival" className={`tab-content ${activeTab === 'new-arrival' ? 'active-content' : ''}`}>
                            {loading ? (
                                <div className="loading-spinner">
                                    <i className="fas fa-spinner fa-spin"></i>
                                    <p>Loading products...</p>
                                </div>
                            ) : newArrivalProducts.length > 0 ? (
                                <div className="product-grid">
                                    {newArrivalProducts.map((product) => (
                                        <div className="product-card" key={product._id}>
                                            <div className="image-box">
                                                <div 
                                                    className="wishlist"
                                                    onClick={(e) => handleToggleWishlist(product._id, e)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <i 
                                                        className={`fa-${wishlistItems.has(product._id) ? 'solid' : 'regular'} fa-heart`}
                                                        style={{
                                                            color: wishlistItems.has(product._id) ? '#ff4757' : 'inherit',
                                                            fontSize: '20px',
                                                        }}
                                                    ></i>
                                                </div>
                                                <img
                                                    src={getImageUrl(product)}
                                                    alt={product.name}
                                                    onClick={() => navigate(`/products/${product.slug || product._id}`)}
                                                    style={{ cursor: 'pointer' }}
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/300x300?text=Product';
                                                    }}
                                                />
                                            </div>
                                            <div className="product-info">
                                                <h3 
                                                    className="product-title"
                                                    onClick={() => navigate(`/products/${product.slug || product._id}`)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {product.name}
                                                </h3>
                                                <div className="color-dots">
                                                    {renderColorDots(product)}
                                                </div>
                                                <p className="price">{formatPrice(product.price)}</p>
                                                <button
                                                    className="buy-btn"
                                                    onClick={() => navigate(`/products/${product.slug || product._id}`)}
                                                >
                                                    BUY NOW
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-products">
                                    <p>No new arrival products available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* More Products Section */}
            <section className="more-products">
                <div className="card-container">
                    {loading ? (
                        <div className="loading-spinner">
                            <i className="fas fa-spinner fa-spin"></i>
                            <p>Loading products...</p>
                        </div>
                    ) : moreProducts.length > 0 ? (
                        moreProducts.map((product) => (
                            <div className="item-card" key={product._id}>
                                <div className="item-img-bg">
                                    <img
                                        src={getImageUrl(product)}
                                        alt={product.name}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x300?text=Product';
                                        }}
                                    />
                                </div>
                                <div className="item-info">
                                    <h3 className="item-name">{product.name}</h3>
                                    <p className="item-price">{formatPrice(product.price)}</p>
                                    <p className="item-desc">
                                        {product.description?.short || product.description?.long?.substring(0, 150) + '...'}
                                    </p>
                                    <a
                                        href="#"
                                        className="shop-now-btn"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigate(`/products/${product.slug || product._id}`);
                                        }}
                                    >
                                        SHOP NOW
                                    </a>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-products">
                            <p>No featured products available</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Why Partner Section */}
            <section className="why-partner-new">
                <div className="container-main">
                    <div className="partner-visuals">
                        <div className="header-text">
                            <h1>Why We Are the Right Partner ?</h1>
                            <p>We specialize in government projects such as the Pink Toilet Scheme, delivering compliant, large-scale solutions. As a manufacturer and OEM, we ensure quality, customization, and timely delivery at competitive pricing. Focused on women hygiene and public welfare, our reliable sanitary pad vending and disposal solutions are trusted by government bodies and institutions for scalable, future-ready implementation.</p>
                        </div>

                        <div className="image-stack">
                            <div className="img-box curved-right">
                                <span className="golden-bar"></span>
                                <img src="/Team working.png" alt="Team working" />
                            </div>

                            <div className="img-box curved-left">
                                <img src="/Team discussing.png" alt="Team discussing" />
                                <span className="golden-bara"></span>
                            </div>
                        </div>
                    </div>

                    <div className="partner-list">
                        {partnerReasons.map((reason, index) => (
                            <div className="list-item" key={index}>
                                <div className={index === 0 ? "number-boxa" : "number-box"}>{reason.number}</div>
                                <div className="content-box">
                                    <h3>{reason.title}</h3>
                                    {reason.description && <p>{reason.description}</p>}
                                    <ul>
                                        {reason.points.map((point, i) => (
                                            <li key={i}>{point}</li>
                                        ))}
                                    </ul>
                                    <span className="highlight-text">{reason.highlight}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-container">
                    <div className="cta-heading">
                        <span className="light-text">Ready to Upgrade Hygiene</span> <br />
                        <span className="bold-text">& Technology in your Facility?</span>
                        <p className="cta-description">
                            Contact us today to get expert guidance, competitive pricing, and reliable <br /> solutions tailored to your needs.
                        </p>
                        <div className="cta-buttons">
                            <a href="tel:+911234567890" className="btn-call">Call Us</a>
                            <a href="https://wa.me/911234567890" className="btn-whatsapp">Whatsapp ↗</a>
                        </div>
                    </div>

                    <div className="cta-image">
                        <img src="/young women.png" alt="Customer Support" />
                    </div>
                </div>
            </section>

            {/* Testimonial Section */}
            <section className="testimonial-section">
                <div className="testimonial-header">
                    <h2>What Our Clients Say</h2>
                </div>

                <div className="slider-wrapper">
                    <button className="slide-btn prev testimonial-prev">❮</button>

                    <div className="testimonial-container testimonial-swiper swiper">
                        <div className="swiper-wrapper">

                            {testimonials.map((item, index) => (
                                <div className="testimonial-card swiper-slide" key={index}>
                                    <div className="card-head">
                                        <div className="stars">⭐⭐⭐⭐☆</div>
                                        <span className="date">{item.date}</span>
                                    </div>

                                    <p className="review">{item.review}</p>

                                    <div className="user-meta">
                                        <img src={item.img} alt="User" />
                                        <div className="user-text">
                                            <strong>{item.name}</strong> |{" "}
                                            <span>{item.location}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>

                    <button className="slide-btn next testimonial-next">❯</button>
                </div>
                <div className="view-more-box">
                    <button className="view-more-btn">View More Review</button>
                </div>
            </section>


        </main>
    );
};

export default Home;

// Partner Reasons Data
const partnerReasons = [
    {
        number: "1",
        title: "Specialized Product Range",
        description: "We offer a carefully engineered portfolio of 8 essential machines, covering:",
        points: [
            "Menstrual & diaper waste management",
            "Sanitary pad vending solutions",
            "GPS & Aadhaar-enabled devices",
            "Bank kiosk & smart infrastructure systems"
        ],
        highlight: "👉 One partner for multiple institutional needs."
    },
    {
        number: "2",
        title: "Industrial-Grade Quality",
        points: [
            "Built with durable materials",
            "Designed for high-usage environments",
            "Tested for safety, hygiene & performance",
            "Perfect for schools, hospitals, offices, banks, factories, and public places."
        ],
        highlight: "👉 Perfect for schools, hospitals, offices, banks, factories and public places."
    },
    {
        number: "3",
        title: "Customization as per Your Requirement",
        points: [
            "We understand every project is different.",
            "Capacity customization",
            "Manual / Coin / Automatic options",
            "Branding & usage-based configurations"
        ],
        highlight: "👉 You get what fits your environment, not a one-size-fits-all product."
    },
    {
        number: "4",
        title: "Trusted by Institutions & Organizations",
        description: "Our products are suitable for:",
        points: [
            "Government projects",
            "CSR initiatives",
            "Educational institutions",
            "Healthcare & corporate spaces"
        ],
        highlight: "👉 We understand institutional standards and compliance."
    },
    {
        number: "5",
        title: "End-to-End Support",
        description: "From enquiry to after-sales:",
        points: [
            "Product consultation",
            "Demo & guidance",
            "After-sales service & technical support",
            "Bank kiosk & smart infrastructure systems"
        ],
        highlight: "👉 We stay with you even after the sale."
    },
    {
        number: "6",
        title: "Supporting Hygiene, Dignity & Sustainability",
        description: "Our solutions actively contribute to:",
        points: [
            "Menstrual hygiene awareness",
            "Safe waste disposal",
            "Cleaner & healthier public spaces"
        ],
        highlight: "👉 You're not just buying a machine—you're creating social impact."
    },
    {
        number: "7",
        title: "Easy Installation & User-Friendly Design",
        points: [
            "Simple operation",
            "Low maintenance",
            "Quick installation support"
        ],
        highlight: "👉 Your staff and users can operate our machines without technical complexity."
    }
];