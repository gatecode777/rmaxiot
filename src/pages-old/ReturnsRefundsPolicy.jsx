import React from 'react';
import "../styles/refundpolicy.css";

const ReturnsRefundsPolicy = () => {
    return (
        <div className="policy-main-container">
            {/* Main Title */}
            <h1 className="policy-page-title">Rmax Solutions – Authenticity, Returns, Refunds & Cancellation Policy</h1>

            <div className="policy-content-wrapper">
                
                {/* Section 1: Authenticity Assurance */}
                <div className="policy-section">
                    <h2 className="policy-heading">Authenticity Assurance</h2>
                    <p className="policy-para">At Rmax Solutions, we are committed to delivering 100% genuine and original products. All items available on our platform are sourced directly from verified manufacturers or their authorized supply partners.</p>
                    <p className="policy-para">Each product undergoes multiple quality inspection checks before dispatch to ensure authenticity, performance, and reliability. We strictly do not deal in counterfeit, duplicate, or unauthorized products.</p>
                    <p className="policy-para">For consumable, electronic, or personal-use items, customers are advised to carefully review usage instructions and, where applicable, conduct basic safety or compatibility checks before use.</p>
                    <p className="policy-para">If you have any questions or concerns regarding product authenticity, please reach out to our support team through the Contact Us page on our website. Our team will be happy to assist you.</p>
                </div>

                {/* Section 2: Returns & Replacement Policy */}
                <div className="policy-section">
                    <h2 className="policy-heading">Returns & Replacement Policy</h2>
                    <p className="policy-para">Rmax Solutions offers an easy and transparent return policy to ensure customer satisfaction.</p>
                    <p className="policy-sub-heading">Eligibility for Returns or Replacements</p>
                    <p className="policy-para">A return or replacement request can be raised within 48 hours of delivery only under the following conditions:</p>
                    <ul className="policy-list">
                        <li>Product received is damaged</li>
                        <li>Product received is incorrect</li>
                        <li>Product is missing components</li>
                    </ul>
                    <p className="policy-warning">⚠️ Unboxing video is mandatory for all return or replacement claims.</p>
                </div>

                {/* Section 3: Return Process */}
                <div className="policy-section">
                    <h2 className="policy-heading">Return Process</h2>
                    <p className="policy-step"><strong>Step 1:</strong> Contact us through the Contact Us form on our website within 48 hours of receiving the product.</p>
                    
                    <p className="policy-step"><strong>Step 2:</strong> Share your Order ID, reason for return/replacement/refund, and upload:</p>
                    <ul className="policy-list">
                        <li>Clear images of the product</li>
                        <li>Images of the outer shipping box</li>
                        <li>Invoice copy</li>
                        <li>Complete uncut unboxing video (if applicable)</li>
                    </ul>

                    <p className="policy-step"><strong>Step 3:</strong> Once approved, a reverse pickup will be scheduled within 24–48 hours, and the product will be collected within 2–4 working days.</p>
                    <p className="policy-para">Refunds or replacements are initiated only after the returned item is received and verified in its original condition, with:</p>
                    <ul className="policy-list">
                        <li>Original packaging</li>
                        <li>Labels, seals, and barcodes intact</li>
                        <li>All accessories and complimentary items included</li>
                    </ul>
                </div>

                {/* Section 4: Replacement Availability */}
                <div className="policy-section">
                    <h2 className="policy-heading">Replacement Availability</h2>
                    <p className="policy-para">Replacements are subject to stock availability. If a replacement is unavailable, a refund will be issued as per the invoice value.</p>
                </div>

                {/* Section 5: Important Return Guidelines */}
                <div className="policy-section">
                    <h2 className="policy-heading">Important Return Guidelines</h2>
                    <ul className="policy-list">
                        <li>Complimentary or free items must be returned along with the main product.</li>
                        <li>If multiple products are defective in a single order, only one consolidated request should be raised.</li>
                        <li>Returns can be initiated at item level, but returned items must be complete with all included components.</li>
                    </ul>
                </div>

                {/* Section 6: Non-Returnable Conditions */}
                <div className="policy-section">
                    <h2 className="policy-heading">Non-Returnable Conditions</h2>
                    <p className="policy-para">Returns or replacements will not be accepted if:</p>
                    <ul className="policy-list">
                        <li>Product is used, altered, or damaged due to misuse.</li>
                        <li>Sealed or packaged items are opened.</li>
                        <li>Return request is raised after 48 hours of delivery.</li>
                        <li>Product is returned without original packaging, labels, invoice, or freebies.</li>
                        <li>Serial number or identification label is tampered.</li>
                        <li>Product is received under sale, clearance, or promotional offers (unless damaged or incorrect).</li>
                        <li>Items from kits, sets, or combos (must be returned as a complete unit).</li>
                        <li>Free promotional products.</li>
                    </ul>
                </div>

                {/* Section 7: Unboxing Video Guidelines */}
                <div className="policy-section">
                    <h2 className="policy-heading">Unboxing Video Guidelines (Mandatory)</h2>
                    <p className="policy-para">To resolve delivery-related issues, an unboxing video is compulsory.</p>
                    <p className="policy-sub-heading">Guidelines:</p>
                    <ol className="policy-numbered-list">
                        <li>Inspect the package before accepting delivery. If tampered, reject it and report immediately.</li>
                        <li>Record a continuous, unedited video showing:
                            <ul className="policy-list" style={{ marginTop: '5px' }}>
                                <li>Shipping label</li>
                                <li>360° view of the sealed package</li>
                                <li>Entire unboxing process</li>
                                <li>All items clearly visible</li>
                            </ul>
                        </li>
                        <li>In case of damage or incorrect items, capture close-up shots in the same video.</li>
                    </ol>
                    <p className="policy-warning">⚠️ Videos with cuts, pauses, or poor visibility will not be accepted.</p>
                </div>

                {/* Section 8: Freebies & Promotional Items */}
                <div className="policy-section">
                    <h2 className="policy-heading">Freebies & Promotional Items</h2>
                    <ul className="policy-list">
                        <li>Free items or promotional gifts are subject to availability.</li>
                        <li>Rmax Solutions reserves the right to change or substitute freebies.</li>
                        <li>Free items are not eligible for refund or replacement.</li>
                        <li>These terms apply to bundled kits, promotional packs, and custom offers.</li>
                    </ul>
                </div>

                {/* Section 9: Refund Policy */}
                <div className="policy-section">
                    <h2 className="policy-heading">Refund Policy</h2>
                    <p className="policy-para">Refunds are processed within 15 working days from the date the returned product is received and approved.</p>
                    <p className="policy-sub-heading">Refund Modes:</p>
                    <ul className="policy-list">
                        <li><strong>Prepaid Orders:</strong> Refunds are credited to the original payment method within 7–10 business days.</li>
                        <li><strong>Cash on Delivery Orders:</strong> Refunds are processed via bank transfer or UPI after receiving valid account details. The amount may take an additional 2–3 business days to reflect.</li>
                    </ul>
                    <p className="policy-warning">⚠️ Shipping charges and COD fees (if applicable) are non-refundable.</p>
                </div>

                {/* Section 10: Cancellation Policy */}
                <div className="policy-section">
                    <h2 className="policy-heading">Cancellation Policy</h2>
                    <p className="policy-para">Orders can be cancelled only before dispatch.</p>
                    <ul className="policy-list">
                        <li>Cancellation requests must be raised within 2 hours of order placement.</li>
                        <li>Requests can be submitted through the website or by contacting customer support during business hours.</li>
                        <li>Once approved, cancellation is processed within 24 hours.</li>
                        <li>Refunds are initiated within 24–48 business hours.</li>
                    </ul>
                    <p className="policy-para">If an order is already dispatched, refunds will be processed only after the product is returned and verified at our warehouse.</p>
                    <p className="policy-warning">⚠️ Individual items from kits or combo products cannot be cancelled separately.</p>
                </div>

                {/* Section 11: Damaged Package at Delivery */}
                <div className="policy-section">
                    <h2 className="policy-heading">Damaged Package at Delivery (Acceptance Disclaimer)</h2>
                    <p className="policy-para">If a package appears tampered, opened, or damaged at the time of delivery, customers are advised not to accept the shipment. Accepted shipments without prior remarks may not be eligible for damage-related claims unless supported by a valid unboxing video.</p>
                </div>

                {/* Section 12: Force Majeure */}
                <div className="policy-section">
                    <h2 className="policy-heading">Force Majeure (Delivery Delays Beyond Control)</h2>
                    <p className="policy-para">Rmax Solutions shall not be held liable for delays or failures in delivery caused by circumstances beyond reasonable control, including but not limited to:</p>
                    <ul className="policy-list">
                        <li>Natural disasters</li>
                        <li>Government restrictions or lockdowns</li>
                        <li>Strikes or transportation disruptions</li>
                        <li>Courier partner delays</li>
                        <li>Acts of God or force majeure events</li>
                    </ul>
                </div>

                {/* Section 13: Address Accuracy & Failed Delivery */}
                <div className="policy-section">
                    <h2 className="policy-heading">Address Accuracy & Failed Delivery</h2>
                    <p className="policy-para">Customers are responsible for providing complete and accurate shipping details at the time of order placement.</p>
                    <ul className="policy-list">
                        <li>Orders delayed or returned due to incorrect or incomplete address information may incur additional re-shipping charges.</li>
                        <li>Rmax Solutions will not be responsible for delivery failures caused by incorrect contact or address details.</li>
                    </ul>
                </div>

                {/* Section 14: Partial Shipments */}
                <div className="policy-section">
                    <h2 className="policy-heading">Partial Shipments</h2>
                    <p className="policy-para">In certain cases, an order may be shipped in multiple packages depending on product availability or logistics requirements. Customers will receive separate tracking details for each shipment where applicable.</p>
                </div>

                {/* Section 15: Quality Check & Verification Rights */}
                <div className="policy-section">
                    <h2 className="policy-heading">Quality Check & Verification Rights</h2>
                    <p className="policy-para">Rmax Solutions reserves the right to:</p>
                    <ul className="policy-list">
                        <li>Inspect and verify returned products before approving refunds or replacements.</li>
                        <li>Reject return requests if products fail internal quality verification or do not meet return eligibility conditions.</li>
                    </ul>
                </div>

                {/* Section 16: Refund Amount Calculation */}
                <div className="policy-section">
                    <h2 className="policy-heading">Refund Amount Calculation</h2>
                    <p className="policy-para">Refunds are issued strictly as per the invoice value of the returned product. Any discounts, coupons, or promotional benefits applied at the time of purchase will be proportionately adjusted.</p>
                </div>

                {/* Section 17: Business Use / Bulk Orders Disclaimer */}
                <div className="policy-section">
                    <h2 className="policy-heading">Business Use / Bulk Orders Disclaimer</h2>
                    <p className="policy-para">Products purchased for commercial, bulk, or resale purposes may be subject to different return, refund, or replacement terms, which will be communicated at the time of order confirmation.</p>
                </div>

                {/* Section 18: Digital / Service-Based Orders */}
                <div className="policy-section">
                    <h2 className="policy-heading">Digital / Service-Based Orders (If Applicable to Rmax)</h2>
                    <p className="policy-para">For digital services, software, consulting, or IT-related deliverables, once the service has commenced or access has been provided, cancellation, refund, or return requests will not be entertained, unless otherwise stated in a written agreement.</p>
                </div>

                {/* Section 19: Policy Updates & Modifications */}
                <div className="policy-section">
                    <h2 className="policy-heading">Policy Updates & Modifications</h2>
                    <p className="policy-para">Rmax Solutions reserves the right to update, modify, or amend this policy at any time without prior notice. Changes will be effective immediately upon posting on the website, and continued use of the platform constitutes acceptance of the revised terms.</p>
                </div>

                {/* Section 20: Governing Law & Jurisdiction */}
                <div className="policy-section">
                    <h2 className="policy-heading">Governing Law & Jurisdiction</h2>
                    <p className="policy-para">This policy shall be governed by and interpreted in accordance with the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts located in India.</p>
                </div>

                {/* Section 21: Customer Support Escalation */}
                <div className="policy-section">
                    <h2 className="policy-heading">Customer Support Escalation</h2>
                    <p className="policy-para">If a concern remains unresolved, customers may request escalation to senior support by submitting a follow-up request through the Contact Us page.</p>
                </div>

            </div>
        </div>
    );
};

export default ReturnsRefundsPolicy;