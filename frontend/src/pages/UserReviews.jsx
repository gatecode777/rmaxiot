import React, { useState } from 'react';
import '../styles/reviews.css'; // Make sure to import your CSS

const UserReviews = () => {
    // State for sort selection
    const [sortOption, setSortOption] = useState('Top Rated Reviews');

    // Satisfaction metrics data
    const satisfactionMetrics = [
        { id: 1, label: 'Response', percentage: 46 },
        { id: 2, label: 'Quality', percentage: 42 },
        { id: 3, label: 'Delivery', percentage: 28 }
    ];

    // Star breakdown data
    const starBreakdown = [
        { stars: 5, percentage: 75 },
        { stars: 4, percentage: 10 },
        { stars: 3, percentage: 5 },
        { stars: 2, percentage: 10 },
        { stars: 1, percentage: 0 }
    ];

    // Reviews data
    const reviews = [
        {
            id: 1,
            rating: 4.5,
            date: '29 September 2025',
            text: 'Yes, this is a good platform for online business. We can make business easy by India mart my company is satisfy by India mart we have good experience by hi this platform we have made good business by this app we can do out bound and in bound business.',
            userName: 'Jyoti Rajawat',
            location: 'Jaipur, Rajasthan.',
            avatar: 'jyoti.jpg'
        },
        {
            id: 2,
            rating: 4,
            date: '29 September 2025',
            text: 'Yes, this is a good platform for online business. We can make business easy by India mart my company is satisfy by India mart we have good experience...',
            userName: 'Jyoti Rajawat',
            location: 'Jaipur, Rajasthan.',
            avatar: 'jyoti.jpg'
        },
        {
            id: 3,
            rating: 4,
            date: '29 September 2025',
            text: 'Yes, this is a good platform for online business. We can make business easy by India mart my company is satisfy by India mart we have good experience...',
            userName: 'Jyoti Rajawat',
            location: 'Jaipur, Rajasthan.',
            avatar: 'jyoti.jpg'
        }
    ];

    // Pagination state
    const [activePage, setActivePage] = useState(0);
    const totalPages = 5;

    // Function to render stars based on rating
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

    // Handle sort change
    const handleSortChange = (e) => {
        setSortOption(e.target.value);
        // Here you would typically fetch sorted reviews from API
    };

    // Handle pagination click
    const handlePageClick = (pageIndex) => {
        setActivePage(pageIndex);
        // Here you would typically fetch reviews for selected page
    };

    return (
        <div className="rmx-rv-main-wrapper">
            <div className="rmx-rv-container">
                
                {/* LEFT SIDE: Stats & Filters */}
                <aside className="rmx-rv-sidebar">
                    <div className="rmx-rv-sort-section">
                        <label>Sort by :</label>
                        <select 
                            className="rmx-rv-select"
                            value={sortOption}
                            onChange={handleSortChange}
                        >
                            <option>Top Rated Reviews</option>
                            <option>Most Recent</option>
                            <option>Critical Reviews</option>
                        </select>
                    </div>

                    {/* User Satisfaction Section */}
                    <div className="rmx-rv-stats-card">
                        <div className="rmx-rv-stats-header">
                            <i className="fa-solid fa-thumbs-up"></i>
                            <h4>User Satisfaction</h4>
                        </div>
                        
                        {satisfactionMetrics.map(metric => (
                            <div key={metric.id} className="rmx-rv-progress-item">
                                <span className="rmx-rv-label">{metric.label}</span>
                                <div className="rmx-rv-bar-bg">
                                    <div 
                                        className="rmx-rv-bar-fill" 
                                        style={{ width: `${metric.percentage}%` }}
                                    ></div>
                                </div>
                                <span className="rmx-rv-percent">{metric.percentage}%</span>
                            </div>
                        ))}
                    </div>

                    {/* Star Breakdown Section */}
                    <div className="rmx-rv-breakdown">
                        {starBreakdown.map(item => (
                            <div key={item.stars} className="rmx-rv-star-row">
                                <span>
                                    {item.stars} <i className="fa-solid fa-star"></i>
                                </span>
                                <div className="rmx-rv-bar-bg">
                                    <div 
                                        className="rmx-rv-bar-fill" 
                                        style={{ width: `${item.percentage}%` }}
                                    ></div>
                                </div>
                                <span className="rmx-rv-percent">{item.percentage}%</span>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* RIGHT SIDE: Reviews Feed */}
                <main className="rmx-rv-feed">
                    
                    {/* Review Cards */}
                    {reviews.map(review => (
                        <div key={review.id} className="rmx-rv-card">
                            <div className="rmx-rv-card-top">
                                <div className="rmx-rv-stars">
                                    {renderStars(review.rating)}
                                </div>
                                <span className="rmx-rv-date">{review.date}</span>
                            </div>
                            <p className="rmx-rv-text">
                                {review.text}
                            </p>
                            <div className="rmx-rv-user">
                                <img 
                                    src={review.avatar} 
                                    alt={review.userName} 
                                    className="rmx-rv-avatar"
                                />
                                <div className="rmx-rv-user-info">
                                    <strong>{review.userName}</strong> 
                                    <span> | {review.location}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Pagination Dots */}
                    <div className="rmx-rv-pagination">
                        {[...Array(totalPages)].map((_, index) => (
                            <span 
                                key={index}
                                className={`rmx-rv-dot ${activePage === index ? 'rmx-rv-active' : ''}`}
                                onClick={() => handlePageClick(index)}
                            ></span>
                        ))}
                    </div>

                </main>
            </div>
        </div>
    );
};

export default UserReviews;