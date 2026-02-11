import React from 'react';
import "../styles/termsandcondition.css";

const TermsConditions = () => {
    return (
        <main className="tc-main-container">
            <h1 className="tc-page-title">Terms & Conditions – Rmax Solutions</h1>

            <div className="tc-dates">
                <p>Effective Date: [Add Date]</p>
                <p>Last Updated: [Add Date]</p>
            </div>

            <p className="tc-paragraph">
                Welcome to <strong>Rmax Solutions</strong> ("Rmax", "Company", "we", "our", or "us"). These Terms & Conditions govern your access to and use of our website, digital platforms, and services. By visiting or using our website, you agree to comply with and be bound by these Terms. If you do not agree, please discontinue use of the website.
            </p>

            {/* Section 1 */}
            <section className="tc-section">
                <h2 className="tc-heading">1. About Rmax Solutions</h2>
                <p className="tc-paragraph">
                    Rmax Solution is an India-based company engaged in providing IT services, digital solutions, BPO support, consulting, and other related business services to clients through its website and associated digital platforms.
                </p>
            </section>

            {/* Section 2 */}
            <section className="tc-section">
                <h2 className="tc-heading">2. Products & Information</h2>
                <p className="tc-paragraph">
                    Our company specializes in the manufacturing, distribution, and supply of a wide range of technology-enabled and utility-based products, including GPS tracking devices, sanitary napkin vending machines, sanitary napkin disposal and incinerator machines, and other related equipment and solutions.
                </p>
                <p className="tc-paragraph">
                    All product details displayed on our website, digital platforms, brochures, or marketing materials—including images, descriptions, technical specifications, features, and pricing—are provided to help customers make informed decisions. While we regularly update this information to maintain accuracy, minor differences in appearance, color, size, design, or technical configuration may occur due to product upgrades, manufacturing improvements, or availability of components. Such variations are standard in the manufacturing process and do not affect the core functionality or intended use of the product.
                </p>
                <p className="tc-paragraph">
                    We reserve the right to revise, enhance, replace, suspend, or permanently discontinue any product, service, feature, specification, or pricing at any time without prior notice. These changes may be made to improve performance, comply with regulatory requirements, or reflect market conditions. Any confirmed orders will be governed by the terms agreed upon at the time of order placement, subject to applicable laws.
                </p>
            </section>

            {/* Section 3 */}
            <section className="tc-section">
                <h2 className="tc-heading">3. Orders, Acceptance & Cancellation</h2>
                
                <div className="tc-sub-block">
                    <h3 className="tc-sub-heading">A. Order Placement & Acceptance</h3>
                    <p className="tc-paragraph">Any order, purchase request, or enquiry submitted through our website, email, phone, or other communication channels constitutes an offer by you to purchase products from us. Submission of an order does not automatically guarantee acceptance.</p>
                    <p className="tc-paragraph">We reserve the right, at our sole discretion, to accept, reject, or place conditions on any order. Orders may be declined due to reasons including but not limited to product availability, stock limitations, pricing or typographical errors, payment issues, technical inaccuracies, or regulatory and compliance requirements.</p>
                    <p className="tc-paragraph">An order shall be considered officially accepted only when we provide written confirmation through email, message, official quotation acceptance, invoice issuance, or when we begin processing, manufacturing, or dispatching the products—whichever occurs first.</p>
                </div>

                <div className="tc-sub-block">
                    <h3 className="tc-sub-heading">B. Customer-Initiated Cancellation</h3>
                    <p className="tc-paragraph"><strong>1. Cancellation Before Dispatch:</strong> Customers may request cancellation of an order prior to dispatch or commencement of manufacturing or processing. Approval of such cancellation and any applicable refund or adjustment shall be subject to our discretion and dependent on administrative, processing, material, or other costs already incurred. Any approved refund may be processed after deducting applicable charges.</p>
                    <p className="tc-paragraph"><strong>2. Cancellation After Dispatch:</strong> Once the product has been dispatched, shipped, or handed over to a logistics provider, cancellation requests are generally not permitted. In such cases, customers are advised to refer to the Returns & Warranty section of these Terms & Conditions for applicable policies and procedures.</p>
                </div>

                <div className="tc-sub-block">
                    <h3 className="tc-sub-heading">C. Company-Initiated Cancellation</h3>
                    <p className="tc-paragraph">In the event that we are unable to fulfill an order due to circumstances such as product unavailability, supply chain disruptions, incorrect pricing, technical errors, regulatory restrictions, or any other unforeseen reason, we reserve the right to cancel the order at any stage prior to delivery.</p>
                    <p className="tc-paragraph">If an order is cancelled by us after payment has been received, any amount paid by the customer for that specific order shall be refunded in accordance with our refund process and within a reasonable timeframe, subject to applicable laws.</p>
                </div>
            </section>

            {/* Section 4 */}
            <section className="tc-section">
                <h2 className="tc-heading">4. Delivery & Risk</h2>
                <div className="tc-sub-block">
                    <h3 className="tc-sub-heading">A. Dispatch & Delivery Timelines</h3>
                    <p className="tc-paragraph">We will arrange the dispatch of products through our authorized logistics partners or as otherwise mutually agreed with you at the time of order confirmation. Any delivery timelines or estimated shipping dates shared with you are provided for reference purposes only and should be considered indicative rather than guaranteed.</p>
                    <p className="tc-paragraph">Actual delivery may vary depending on factors such as the delivery location, availability of the product, logistics partner schedules, transportation conditions, force majeure events, or other circumstances beyond our reasonable control. We shall not be held liable for delays caused by third-party carriers or unforeseen events affecting transit.</p>
                </div>
                <div className="tc-sub-block">
                    <h3 className="tc-sub-heading">B. Transfer of Risk</h3>
                    <p className="tc-paragraph">All risk of loss, theft, or damage to the products shall pass to you upon delivery of the products to the shipping address provided by you, or upon handover of the products to your nominated transporter, courier, or logistics service provider, whichever occurs earlier.</p>
                    <p className="tc-paragraph">Once the risk has transferred, we shall not be responsible for any loss, damage, or delay occurring during transit, except as required under applicable law or expressly agreed in writing.</p>
                </div>
                <div className="tc-sub-block">
                    <h3 className="tc-sub-heading">C. Inspection & Reporting of Issues</h3>
                    <p className="tc-paragraph">You are responsible for carefully inspecting the shipment at the time of delivery. In the event of any visible damage, tampering, or shortage, you must immediately note the issue on the delivery receipt or proof of delivery and report the same to the transporter.</p>
                    <p className="tc-paragraph">Additionally, you must notify us in writing within a reasonable period—generally within 48 hours of delivery—along with supporting photographs or documentation. Failure to report such issues within this timeframe may result in the claim being declined, subject to applicable laws.</p>
                </div>
            </section>

            {/* Section 5 */}
            <section className="tc-section">
                <h2 className="tc-heading">5. Installation, Usage & Customer Responsibilities</h2>
                <div className="tc-sub-block">
                    <h3 className="tc-sub-heading">A. Installation & Configuration</h3>
                    <p className="tc-paragraph">Certain products supplied by us—including but not limited to sanitary napkin vending machines, sanitary napkin disposal or incinerator machines, GPS tracking devices, and related equipment—may require installation, configuration, calibration, or initial setup to function correctly.</p>
                    <p className="tc-paragraph">At the time of order confirmation, we will inform you whether installation services are included in the product price, available at an additional cost, or required to be arranged by you through your own qualified technicians or service providers. Where installation is carried out by us or our authorized partners, it will be subject to mutually agreed timelines, site readiness, and access availability.</p>
                </div>
                <div className="tc-sub-block">
                    <h3 className="tc-sub-heading">B. Customer Responsibilities</h3>
                    <p className="tc-paragraph">You acknowledge and agree that you are solely responsible for ensuring the following:</p>
                    <ul className="tc-list">
                        <li>Site Readiness: Providing a suitable installation location, including adequate space, structural support, ventilation (where applicable), and an uninterrupted power supply that meets the product's technical requirements.</li>
                        <li>Compliance & Environment: Ensuring that the installation site complies with applicable safety standards, local regulations, and environmental conditions necessary for proper operation of the product.</li>
                        <li>Proper Usage: Operating the products strictly in accordance with the user manual, operating instructions, safety guidelines, and any training or documentation provided by us.</li>
                        <li>Maintenance & Safety: Performing basic maintenance, routine cleaning, and safety checks as specified in the product documentation, and ensuring that the product is not misused, altered, or operated negligently.</li>
                        <li>Authorized Handling: Allowing only trained or authorized personnel to operate, service, or repair the products, unless otherwise approved by us in writing.</li>
                    </ul>
                </div>
                <div className="tc-sub-block">
                    <h3 className="tc-sub-heading">C. Limitation of Responsibility</h3>
                    <p className="tc-paragraph">We shall not be responsible for any malfunction, damage, performance issues, or safety risks arising from improper installation, inadequate site conditions, misuse, unauthorized modifications, failure to follow operating instructions, or lack of basic maintenance by the customer or third parties.</p>
                    <p className="tc-paragraph">Any such issues may result in voiding of applicable warranties or service obligations, subject to the terms outlined in the Warranty & Support section of these Terms & Conditions.</p>
                </div>
            </section>

            {/* Section 6 */}
            <section className="tc-section">
                <h2 className="tc-heading">6. Warranty, Returns & Limitation of Liability</h2>
                <div className="tc-sub-block">
                    <h3 className="tc-sub-heading">Limitation of Liability</h3>
                    <p className="tc-paragraph">To the fullest extent permitted under applicable law, Rmax Solutions shall not be liable for any direct, indirect, incidental, consequential, special, or punitive damages arising out of or related to the use of our products, services, website, or digital platforms.</p>
                    <p className="tc-paragraph">We shall not be responsible for any loss of data, loss of profits, business interruption, system downtime, technical failures, or any other commercial or operational losses, whether arising from contract, negligence, system errors, theft, or otherwise.</p>
                    <p className="tc-paragraph">The use of our website, products, and services is entirely at your own discretion and risk. While we take reasonable measures to ensure quality, security, and reliability, we do not guarantee that our website or services will be uninterrupted, error-free, or free from technical issues at all times.</p>
                </div>
                <div className="tc-sub-block">
                    <h3 className="tc-sub-heading">Product Warranty</h3>
                    <p className="tc-paragraph">
                        Certain products supplied by us may be covered by a limited warranty, the details of which shall be clearly stated in the applicable quotation, invoice, warranty card, or product documentation provided at the time of purchase.
                    </p>
                    <p className="tc-paragraph">
                        Warranty terms may include, but are not limited to:
                    </p>
                    <ul className="tc-list">
                        <li>Warranty duration</li>
                        <li>Scope of coverage</li>
                        <li>Applicable exclusions</li>
                        <li>Claim procedures</li>
                    </ul>
                    <p className="tc-paragraph">
                        Only the warranty terms expressly communicated at the time of sale shall be valid and binding.
                    </p>
                </div>
                <div className="tc-sub-block">
                    <h3 className="tc-sub-heading">Warranty Exclusions</h3>
                    <p className="tc-paragraph">Unless otherwise agreed in writing, the warranty shall not cover damage or defects resulting from:</p>
                    <ul className="tc-list">
                        <li>Improper use, misuse, abuse, or negligence</li>
                        <li>Incorrect or unauthorised installation</li>
                        <li>Repairs, servicing, or modifications carried out by unauthorised personnel</li>
                        <li>Use of the product in conditions not recommended in the user manual</li>
                        <li>Electrical fluctuations, power surges, environmental factors, or external damage</li>
                        <li>Normal wear and tear, consumable parts, or accessories with limited life expectancy</li>
                    </ul>
                </div>
                <div className="tc-sub-block">
                    <h3 className="tc-sub-heading">Returns Policy</h3>
                    <p className="tc-paragraph">As our products consist primarily of customised or specialised equipment, returns are accepted only in limited and specific circumstances, such as:</p>
                    <ul className="tc-list">
                        <li>Manufacturing defects</li>
                        <li>Incorrect product supplied by us</li>
                    </ul>
                    <p className="tc-paragraph">All returns are subject to our return policy as communicated at the time of sale or shared separately with you. Any product return must receive prior written approval from us. Products returned without authorization, incomplete documentation, or non-compliance with return instructions may be rejected and sent back at the customer's cost.</p>
                </div>
                <div className="tc-sub-block">
                    <h3 className="tc-sub-heading">Remedy Limitation</h3>
                    <p className="tc-paragraph">In the event of a valid and accepted warranty or return claim, our total responsibility shall be strictly limited—at our sole discretion—to one of the following remedies:</p>
                    <ul className="tc-list">
                        <li>Repair of the product</li>
                        <li>Replacement of the product (or defective part)</li>
                        <li>Issuance of a credit note</li>
                    </ul>
                    <p className="tc-paragraph">Under no circumstances shall our liability exceed the original invoice value of the affected product.</p>
                </div>
            </section>

            {/* Section 7 */}
            <section className="tc-section">
                <h2 className="tc-heading">7. Intellectual Property Rights</h2>
                <p className="tc-paragraph">All content available on this website and across our digital platforms—including but not limited to text, descriptions, trademarks, logos, brand names, graphics, images, product photographs, designs, layouts, audio/video materials, software, source code, and downloadable files (collectively referred to as "Content")—is the exclusive property of Rmax Solution or is lawfully licensed to us, unless expressly stated otherwise.</p>
                <p className="tc-paragraph">Such Content is protected by applicable intellectual property laws, including copyright, trademark, and other proprietary rights under Indian law and international conventions.</p>
                <p className="tc-paragraph">You are granted a limited, non-exclusive, non-transferable, and revocable right to access and use the website and its Content solely for personal, informational, and non-commercial purposes. You may not, without our prior written consent:</p>
                <ul className="tc-list">
                    <li>Copy, reproduce, duplicate, or republish any Content</li>
                    <li>Modify, adapt, translate, or create derivative works</li>
                    <li>Distribute, transmit, display, or perform the Content publicly</li>
                    <li>Use any Content for commercial, promotional, or competitive purposes</li>
                    <li>Remove or alter any copyright, trademark, or proprietary notices</li>
                </ul>
                <p className="tc-paragraph">Any unauthorized use, reproduction, or exploitation of the Content may result in legal action and shall be considered a violation of our intellectual property rights.</p>
                <p className="tc-paragraph">All rights not expressly granted herein are reserved by Rmax Solutions.</p>
            </section>

            {/* Section 8 */}
            <section className="tc-section">
                <h2 className="tc-heading">8. User Conduct</h2>
                <p className="tc-paragraph">When accessing, browsing, or using our website, products, services, or when communicating with us through any channel, you agree to act responsibly and in compliance with these Terms & Conditions and all applicable laws and regulations.</p>
                <p className="tc-paragraph">You agree that you shall not engage in any of the following activities:</p>
                <ul className="tc-list">
                    <li><strong>False or Misleading Information:</strong> Submit, publish, or communicate any information that is false, inaccurate, misleading, incomplete, or deceptive.</li>
                    <li><strong>Disruption or Harmful Activities:</strong> Engage in any activity that interferes with, damages, disables, overburdens, or disrupts the proper functioning of the website, servers, or networks.</li>
                    <li><strong>Unauthorised Access:</strong> Attempt to gain unauthorised access to any part of the website, user accounts, databases, or systems.</li>
                    <li><strong>Unlawful or Prohibited Use:</strong> Use the website or services for any unlawful, fraudulent, or prohibited purpose, or in violation of applicable laws, regulations, or third-party rights.</li>
                </ul>
                <p className="tc-paragraph">We reserve the right to monitor usage, restrict access, suspend or terminate services, and take appropriate legal action if we believe that any user has violated these conduct requirements or misused the website or services.</p>
            </section>

            {/* Section 9 */}
            <section className="tc-section">
                <h2 className="tc-heading">9. Privacy & Data Protection</h2>
                <p className="tc-paragraph">Our access to and use of our website, products, and services are also governed by our Privacy Policy, which forms an integral part of these Terms & Conditions.</p>
                <p className="tc-paragraph">The Privacy Policy explains how Rmax Solutions collects, processes, stores, uses, and protects your personal information and data when you interact with us through our website, communication channels, or services. It also outlines your rights and choices regarding your personal data.</p>
                <p className="tc-paragraph">By using the website or availing our services, you acknowledge that you have read, understood, and agreed to the terms of our Privacy Policy. We encourage you to review the Privacy Policy periodically to stay informed about any updates or changes, as continued use of the website or services constitutes acceptance of the revised policy.</p>
            </section>

            {/* Section 10 */}
            <section className="tc-section">
                <h2 className="tc-heading">10. Governing Law & Dispute Resolution</h2>
                <p className="tc-paragraph">These Terms & Conditions, along with any policies, notices, or agreements referenced herein, shall be governed by and interpreted in accordance with the laws of the Republic of India, without regard to its conflict of law principles.</p>
                <p className="tc-paragraph">Any dispute, claim, controversy, or difference arising out of or relating to these Terms & Conditions, your use of the website, our products or services, or any transaction entered into with Rmax Solution shall be subject to the exclusive jurisdiction of the competent courts located in Jaipur, Rajasthan, India.</p>
                <p className="tc-paragraph">You expressly agree that you submit to the jurisdiction of such courts and waive any objection relating to venue, jurisdiction, or inconvenience of forum.</p>
            </section>

            {/* Section 11 */}
            <section className="tc-section">
                <h2 className="tc-heading">11. Acceptance of Terms</h2>
                <p className="tc-paragraph">Your use of the website is conditional upon acceptance of these Terms without modification. Rmax Solution reserves the right to update, revise, or replace these Terms at any time. Continued use of the website after changes are posted will be considered acceptance of the updated Terms.</p>
                <p className="tc-paragraph">We also reserve the right to refuse access to the website or services to any user at our sole discretion, without prior notice.</p>
            </section>

            {/* Section 12 */}
            <section className="tc-section">
                <h2 className="tc-heading">12. Eligibility to Use the Website</h2>
                <p className="tc-paragraph">You may use this website only if:</p>
                <ul className="tc-list">
                    <li>You are 18 years of age or older</li>
                    <li>You are legally capable of entering into a binding contract under Indian law</li>
                    <li>You are accessing the website for lawful purposes.</li>
                </ul>
                <p className="tc-paragraph">If you are under 18, you may use the website only under the supervision of a parent or legal guardian.</p>
            </section>

            {/* Section 13 */}
            <section className="tc-section">
                <h2 className="tc-heading">13. User Accounts & Security</h2>
                <p className="tc-paragraph">Certain features of our website or services may require account creation.</p>
                <p className="tc-paragraph">You are responsible for:</p>
                <ul className="tc-list">
                    <li>Maintaining the confidentiality of your login credentials</li>
                    <li>All activities conducted through your account.</li>
                </ul>
                <p className="tc-paragraph">You agree to notify Rmax Solutions immediately of any unauthorized access or security breach. We are not responsible for any loss resulting from failure to secure your account information.</p>
            </section>

            {/* Section 14 */}
            <section className="tc-section">
                <h2 className="tc-heading">14. Acceptable Use of Website</h2>
                <p className="tc-paragraph">You agree not to use the website to:</p>
                <ul className="tc-list">
                    <li>Upload or share false, misleading, or unlawful information</li>
                    <li>Violate intellectual property rights of others</li>
                    <li>Harass, abuse, defame, or harm any person</li>
                    <li>Introduce malware, viruses, or harmful code.</li>
                </ul>
                <p className="tc-paragraph">Any misuse may result in suspension or permanent termination of access.</p>
            </section>

            {/* Section 15 */}
            <section className="tc-section">
                <h2 className="tc-heading">15. Communications & Marketing</h2>
                <p className="tc-paragraph">By submitting your contact details, you agree that Rmax Solution may contact you via:</p>
                <ul className="tc-list">
                    <li>Email</li>
                    <li>Phone calls</li>
                    <li>WhatsApp or SMS</li>
                </ul>
                <p className="tc-paragraph">These communications may include service updates, business inquiries, or promotional information. You may opt out of marketing communications at any time.</p>
            </section>

            {/* Section 16 */}
            <section className="tc-section">
                <h2 className="tc-heading">16. Information Sharing</h2>
                <p className="tc-paragraph">Rmax Solution may share limited information only when:</p>
                <ul className="tc-list">
                    <li>You provide explicit consent</li>
                    <li>Required by law or government authorities</li>
                    <li>Necessary to protect our legal rights or prevent fraud</li>
                    <li>Working with trusted service providers under confidentiality agreements</li>
                    <li>In case of business restructuring, merger, or acquisition</li>
                </ul>
                <p className="tc-paragraph">We do not sell your personal information to third parties.</p>
            </section>

            {/* Section 17 */}
            <section className="tc-section">
                <h2 className="tc-heading">17. Services & Usage Limitations</h2>
                <p className="tc-paragraph">All services, information, or materials provided on the website are intended for business or professional use only.</p>
                <p className="tc-paragraph">You may not:</p>
                <ul className="tc-list">
                    <li>Resell or commercially exploit our services or content</li>
                    <li>Use our materials without written authorization</li>
                </ul>
                <p className="tc-paragraph">Service details are subject to change without notice.</p>
            </section>

            {/* Section 18 */}
            <section className="tc-section">
                <h2 className="tc-heading">18. Accuracy of Information</h2>
                <p className="tc-paragraph">While we make reasonable efforts to ensure accuracy:</p>
                <ul className="tc-list">
                    <li>Website content is provided for general informational purposes</li>
                    <li>Rmax Solution does not guarantee that all information is complete, error-free, or up to date</li>
                </ul>
                <p className="tc-paragraph">We reserve the right to correct errors or update content at any time.</p>
            </section>

            {/* Section 19 */}
            <section className="tc-section">
                <h2 className="tc-heading">19. Third-Party Links</h2>
                <p className="tc-paragraph">Our website may include links to external websites or platforms.</p>
                <p className="tc-paragraph">Rmax Solutions does not control or endorse these third-party sites and is not responsible for their content, policies, or practices. Accessing third-party links is at your own risk.</p>
            </section>

            {/* Section 20 */}
            <section className="tc-section">
                <h2 className="tc-heading">20. Privacy Policy</h2>
                <p className="tc-paragraph">Your use of the website is also governed by our Privacy Policy.</p>
                <p className="tc-paragraph">By using the website, you acknowledge that you have read and accepted the Privacy Policy.</p>
            </section>

            {/* Section 21 */}
            <section className="tc-section">
                <h2 className="tc-heading">21. Indemnity</h2>
                <p className="tc-paragraph">You agree to indemnify and hold harmless Rmax Solution, its employees, partners, and affiliates from any claims or losses arising due to:</p>
                <ul className="tc-list">
                    <li>Your violation of these Terms;</li>
                    <li>Misuse of the website or services</li>
                    <li>Violation of applicable laws or third-party rights</li>
                </ul>
            </section>

            {/* Section 22 */}
            <section className="tc-section">
                <h2 className="tc-heading">22. Termination of Access</h2>
                <p className="tc-paragraph">Rmax Solutions reserves the right to suspend or terminate your access to the website at any time, without notice, if these Terms are violated.</p>
            </section>

            {/* Section 23 */}
            <section className="tc-section">
                <h2 className="tc-heading">23. Governing Law & Jurisdiction</h2>
                <p className="tc-paragraph">These Terms & Conditions shall be governed by the laws of India.</p>
                <p className="tc-paragraph">All disputes shall be subject to the exclusive jurisdiction of Indian courts.</p>
            </section>

            {/* Section 24 */}
            <section className="tc-section">
                <h2 className="tc-heading">24. Force Majeure</h2>
                <p className="tc-paragraph">Rmax Solutions shall not be held responsible for delays or failures caused by events beyond reasonable control, including natural disasters, system failures, government actions, or internet disruptions.</p>
            </section>

            {/* Section 25: Grievance & Contact */}
            <section className="tc-section">
                <h2 className="tc-heading">25. Grievance & Contact Information</h2>
                <p className="tc-paragraph">For any questions, concerns, or complaints regarding these Terms & Conditions, you may contact:</p>
                <div className="contact-info-box">
                    <p><strong>Rmax Solutions</strong></p>
                    <p>📧 Email: [your official email]</p>
                    <p>📞 Phone: [your contact number]</p>
                    <p>🌐 Website: [your website URL]</p>
                </div>
                <p className="tc-paragraph" style={{ marginTop: '15px' }}>We will make reasonable efforts to resolve grievances in a timely manner.</p>
            </section>
        </main>
    );
};

export default TermsConditions;