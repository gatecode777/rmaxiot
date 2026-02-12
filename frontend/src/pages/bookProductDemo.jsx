import React, { useState } from 'react';
import '../styles/bookproductdemo.css';

const BookProductDemo = () => {
    // State for form inputs
    const [formData, setFormData] = useState({
        selectedProduct: 'Select Product for Demo',
        fullName: '',
        mobileNumber: '',
        email: '',
        organization: '',
        city: '',
        preferredDate: '',
        sessionTypes: [],
        demoModes: [],
        types: [],
        timeSlots: [],
        message: ''
    });

    // State for modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle checkbox changes
    const handleCheckboxChange = (e, category) => {
        const { value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [category]: checked 
                ? [...prev[category], value]
                : prev[category].filter(item => item !== value)
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsModalOpen(true);
        console.log('Form Data:', formData);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="demo-page-wrapper">
            {/* Header Section */}
            <header className="demo-header">
                <h1>Book a Product Demo & Training Session</h1>
                <p>Get in-depth product knowledge, live working demonstration, complete installation guidance, and step-by-step usage training from our certified experts — available both before and after purchase.</p>
                
                <div className="header-controls">
                    <select 
                        className="product-dropdown"
                        name="selectedProduct"
                        value={formData.selectedProduct}
                        onChange={handleInputChange}
                    >
                        <option>Select Product for Demo</option>
                        <option>Napkin Incinerator Machine</option>
                        <option>Vending Machine</option>
                    </select>
                    <div className="meta-info">
                        <span>🕒 Duration: 15-30 Minutes</span>
                        <p><span>Mode: Online / On-site (Product dependent)</span></p>
                    </div>
                </div>
            </header>

            <div className="main-content-grid">
                {/* Left Side: Selection Options */}
                <div className="options-column">
                    <div className="option-group">
                        <h3>Type of Session</h3>
                        <label className="check-item">
                            <input 
                                type="checkbox" 
                                value="Product Overview & Features"
                                onChange={(e) => handleCheckboxChange(e, 'sessionTypes')}
                            /> Product Overview & Features
                        </label>
                        <label className="check-item">
                            <input 
                                type="checkbox" 
                                value="How to Use the Product (Step-by-Step)"
                                onChange={(e) => handleCheckboxChange(e, 'sessionTypes')}
                            /> How to Use the Product (Step-by-Step)
                        </label>
                        <label className="check-item">
                            <input 
                                type="checkbox" 
                                value="Installation & Setup Guidance"
                                onChange={(e) => handleCheckboxChange(e, 'sessionTypes')}
                            /> Installation & Setup Guidance
                        </label>
                        <label className="check-item">
                            <input 
                                type="checkbox" 
                                value="Maintenance & Safety Instructions"
                                onChange={(e) => handleCheckboxChange(e, 'sessionTypes')}
                            /> Maintenance & Safety Instructions
                        </label>
                        <label className="check-item">
                            <input 
                                type="checkbox" 
                                value="Troubleshooting & Common Issues"
                                onChange={(e) => handleCheckboxChange(e, 'sessionTypes')}
                            /> Troubleshooting & Common Issues
                        </label>
                        <label className="check-item">
                            <input 
                                type="checkbox" 
                                value="Commercial / Institutional Use Explanation"
                                onChange={(e) => handleCheckboxChange(e, 'sessionTypes')}
                            /> Commercial / Institutional Use Explanation
                        </label>
                        <label className="check-item">
                            <input 
                                type="checkbox" 
                                value="Pre-Purchase Demo"
                                onChange={(e) => handleCheckboxChange(e, 'sessionTypes')}
                            /> Pre-Purchase Demo
                        </label>
                        <label className="check-item">
                            <input 
                                type="checkbox" 
                                value="Product Overview & Post-Purchase Training"
                                onChange={(e) => handleCheckboxChange(e, 'sessionTypes')}
                            /> Product Overview & Post-Purchase Training
                        </label>
                    </div>

                    <div className="option-group">
                        <h3>Preferred Demo Mode</h3>
                        <label className="check-item">
                            <input 
                                type="checkbox" 
                                value="Online Video Demo (Recommended)"
                                onChange={(e) => handleCheckboxChange(e, 'demoModes')}
                            /> Online Video Demo (Recommended)
                        </label>
                        <label className="check-item">
                            <input 
                                type="checkbox" 
                                value="Telephonic Explanation (Quick guidance)"
                                onChange={(e) => handleCheckboxChange(e, 'demoModes')}
                            /> Telephonic Explanation (Quick guidance)
                        </label>
                    </div>

                    <div className="message-area">
                        <p className="textarea-label">Please mention any specific doubts, problems, or features you want us to explain during the session.</p>
                        <textarea 
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Type here..."
                        ></textarea>
                    </div>
                </div>

                {/* Right Side: Yellow Form */}
                <div className="form-column-yellow">
                    <h3>Fill the Details</h3>
                    <form onSubmit={handleSubmit}>
                        <input 
                            type="text" 
                            placeholder="Full Name" 
                            className="form-input"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                        />
                        <input 
                            type="text" 
                            placeholder="Mobile Number" 
                            className="form-input"
                            name="mobileNumber"
                            value={formData.mobileNumber}
                            onChange={handleInputChange}
                            required
                        />
                        <input 
                            type="email" 
                            placeholder="Email ID" 
                            className="form-input"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                        <input 
                            type="text" 
                            placeholder="Organization / Institution Name" 
                            className="form-input"
                            name="organization"
                            value={formData.organization}
                            onChange={handleInputChange}
                            required
                        />

                        <div className="type-selection">
                            <p>Type:</p>
                            <div className="type-grid">
                                <label>
                                    <input 
                                        type="checkbox" 
                                        value="School"
                                        onChange={(e) => handleCheckboxChange(e, 'types')}
                                    /> School
                                </label>
                                <label>
                                    <input 
                                        type="checkbox" 
                                        value="Bank"
                                        onChange={(e) => handleCheckboxChange(e, 'types')}
                                    /> Bank
                                </label>
                                <label>
                                    <input 
                                        type="checkbox" 
                                        value="College"
                                        onChange={(e) => handleCheckboxChange(e, 'types')}
                                    /> College
                                </label>
                                <label>
                                    <input 
                                        type="checkbox" 
                                        value="Government"
                                        onChange={(e) => handleCheckboxChange(e, 'types')}
                                    /> Government
                                </label>
                                <label>
                                    <input 
                                        type="checkbox" 
                                        value="Hospital"
                                        onChange={(e) => handleCheckboxChange(e, 'types')}
                                    /> Hospital
                                </label>
                                <label>
                                    <input 
                                        type="checkbox" 
                                        value="NGO"
                                        onChange={(e) => handleCheckboxChange(e, 'types')}
                                    /> NGO
                                </label>
                                <label>
                                    <input 
                                        type="checkbox" 
                                        value="Office"
                                        onChange={(e) => handleCheckboxChange(e, 'types')}
                                    /> Office
                                </label>
                                <label>
                                    <input 
                                        type="checkbox" 
                                        value="Individual"
                                        onChange={(e) => handleCheckboxChange(e, 'types')}
                                    /> Individual
                                </label>
                            </div>
                        </div>

                        <input 
                            type="text" 
                            placeholder="City/ Location" 
                            className="form-input"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                        />
                        
                        <div className="date-field">
                            <input 
                                type="date" 
                                placeholder="Preferred Date" 
                                className="form-input"
                                name="preferredDate"
                                value={formData.preferredDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="time-selection">
                            <p>Preferred Time Slot:</p>
                            <label className="check-item">
                                <input 
                                    type="checkbox" 
                                    value="Morning (10 AM – 12 PM)"
                                    onChange={(e) => handleCheckboxChange(e, 'timeSlots')}
                                /> Morning (10 AM – 12 PM)
                            </label>
                            <label className="check-item">
                                <input 
                                    type="checkbox" 
                                    value="Afternoon (12 PM – 3 PM)"
                                    onChange={(e) => handleCheckboxChange(e, 'timeSlots')}
                                /> Afternoon (12 PM – 3 PM)
                            </label>
                            <label className="check-item">
                                <input 
                                    type="checkbox" 
                                    value="Evening (3 PM – 6 PM)"
                                    onChange={(e) => handleCheckboxChange(e, 'timeSlots')}
                                /> Evening (3 PM – 6 PM)
                            </label>
                        </div>
                    </form>
                </div>
            </div>

            {/* Bottom Submit Button */}
            <div className="submit-container">
                <button className="book-btn" onClick={handleSubmit}>Book Demo Session</button>
            </div>

            {/* Success Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <span className="close-btn" onClick={closeModal}>&times;</span>
                        
                        <div className="success-icon">
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        
                        <h3>Your Demo Session Request Is Submitted!</h3>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookProductDemo;