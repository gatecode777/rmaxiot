import React from 'react';
import "../styles/shippingpolicy.css";

const ShippingPolicy = () => {
    return (
        <div className="shipping-policy-container">
            {/* Page Title */}
            <h1 className="shipping-main-title">Shipping Policy</h1>

            <div className="shipping-content-card">
                {/* Sub Header */}
                <h2 className="shipping-sub-header">Shipping & Delivery Policy – Rmax Solutions</h2>
                <p className="shipping-para">
                    At Rmax Solutions, we are committed to providing a smooth, transparent, and reliable shipping experience. This Shipping & Delivery Policy outlines how orders are processed, dispatched, and delivered, along with related timelines, charges, and customer support information.
                </p>

                {/* Section 1 */}
                <div className="shipping-section">
                    <h3 className="shipping-heading">1. Order Processing & Dispatch</h3>
                    <p className="shipping-para">
                        All confirmed orders placed through our website or official sales channels are processed and prepared for dispatch within 1–2 working days, subject to successful payment confirmation and product availability.
                    </p>
                    <p className="shipping-para">
                        Orders placed on weekends or public holidays will be processed on the next working business day. Dispatch timelines may vary in case of customised products, bulk orders, or unforeseen operational constraints.
                    </p>
                </div>

                {/* Section 2 */}
                <div className="shipping-section">
                    <h3 className="shipping-heading">2. Estimated Delivery Time</h3>
                    <p className="shipping-para">
                        Once an order has been dispatched, delivery is typically completed within 2–7 business days. Please note that delivery timelines are indicative and may vary depending on several factors, including but not limited to:
                    </p>
                    <ul className="shipping-list">
                        <li>Customer's location and pin code</li>
                        <li>Shipping destination and distance</li>
                        <li>Availability of the ordered product</li>
                        <li>Courier partner serviceability</li>
                        <li>Local delivery conditions, weather, or unforeseen disruptions</li>
                    </ul>
                    <p className="shipping-para">
                        Rmax Solutions shall not be held responsible for delays caused by courier partners or circumstances beyond our reasonable control.
                    </p>
                </div>

                {/* Section 3 */}
                <div className="shipping-section">
                    <h3 className="shipping-heading">3. Serviceable Locations</h3>
                    <p className="shipping-para">
                        Rmax Solutions currently delivers products across India, covering all locations supported by our authorized logistics and courier partners. Service availability may vary for certain remote or non-serviceable pin codes, in which case our team will inform you during order processing.
                    </p>
                </div>

                {/* Section 4 */}
                <div className="shipping-section">
                    <h3 className="shipping-heading">4. Shipping Charges</h3>
                    <p className="shipping-para">
                        Shipping charges are applied based on the total order value as follows:
                    </p>
                    <ul className="shipping-list">
                        <li>₹50 shipping charge on orders valued below ₹399</li>
                        <li>Free shipping on orders valued at ₹1299 or above</li>
                    </ul>
                    <p className="shipping-para">
                        Any applicable shipping charges will be clearly displayed at checkout before order confirmation.
                    </p>
                </div>

                {/* Section 5 */}
                <div className="shipping-section">
                    <h3 className="shipping-heading">5. Order Tracking</h3>
                    <p className="shipping-para">
                        Once your order has been shipped, you will receive shipment and tracking details via email and/or SMS using the contact information provided at the time of purchase.
                    </p>
                    <p className="shipping-para">Customers can also track their orders by:</p>
                    <ul className="shipping-list">
                        <li>Logging into their Rmax Solutions account</li>
                        <li>Navigating to the "My Orders" section on our website</li>
                    </ul>
                    <p className="shipping-para">
                        Tracking information may take a few hours to become active after dispatch.
                    </p>
                </div>

                {/* Section 6 */}
                <div className="shipping-section">
                    <h3 className="shipping-heading">6. Order Marked as Delivered but Not Received</h3>
                    <p className="shipping-para">
                        If your order status shows "Delivered" but you have not received the package, you must notify us within 48 hours of the delivery update.
                    </p>
                    <p className="shipping-para">You can report the issue by:</p>
                    <ul className="shipping-list">
                        <li>Submitting a request through our Contact Us page</li>
                        <li>Reaching out via website chat support</li>
                    </ul>
                    <p className="shipping-para">
                        Timely reporting helps us coordinate with the courier partner for investigation. Claims raised after 48 hours may not be eligible for resolution, subject to courier partner policies.
                    </p>
                </div>

                {/* Section 7 */}
                <div className="shipping-section">
                    <h3 className="shipping-heading">7. Customer Support</h3>
                    <p className="shipping-para">
                        For any questions related to shipping, delivery status, or order assistance, our support team is happy to help. You can contact us through:
                    </p>
                    <ul className="shipping-list">
                        <li>The Contact Us form on our website</li>
                        <li>Live chat support available on the website</li>
                        <li>Calling our customer support team during business hours</li>
                    </ul>
                    <p className="shipping-para">
                        We strive to respond to all queries promptly and ensure a satisfactory resolution.
                    </p>
                </div>

                {/* Section 8 */}
                <div className="shipping-section">
                    <h3 className="shipping-heading">8. Policy Updates</h3>
                    <p className="shipping-para">
                        Rmax Solutions reserves the right to modify or update this Shipping & Delivery Policy at any time without prior notice. Any changes will be effective immediately upon being published on the website.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ShippingPolicy;