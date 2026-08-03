import React from 'react';
import "../styles/privacypolicy.css";

const PrivacyPolicy = () => {
    return (
        <div className="privacy-main-container">
            {/* Main Title */}
            <h1 className="privacy-page-title">Privacy Policy – Rmax Solutions</h1>

            <div className="privacy-content-wrapper">
                
                {/* Dates */}
                <div className="privacy-dates">
                    <p>Effective Date: [Add Date]</p>
                    <p>Last Updated: [Add Date]</p>
                </div>

                {/* Section: Commitment */}
                <div className="privacy-section">
                    <h2 className="privacy-heading">Our Commitment to Your Privacy</h2>
                    <p className="privacy-para">Rmax Solutions ("Rmax", "Company", "we", "our", or "us") is an India-based company providing IT services, digital solutions, consulting, and business support services through its website and digital platforms (collectively, the "Platform").</p>
                    <p className="privacy-para">We value your trust and are committed to protecting the privacy, confidentiality, and security of your personal data. This Privacy Policy explains how we collect, use, store, share, and protect your information when you visit or interact with our website, applications, or services.</p>
                    <p className="privacy-para">This policy is prepared in accordance with the <strong>Digital Personal Data Protection Act, 2023</strong>, related rules, and other applicable Indian and international data protection laws.</p>
                </div>

                {/* Section: Scope */}
                <div className="privacy-section">
                    <h2 className="privacy-heading">Scope of This Privacy Policy</h2>
                    <p className="privacy-para">This Privacy Policy applies to:</p>
                    <ul className="privacy-list">
                        <li>Visitors to our website</li>
                        <li>Clients, partners, and vendors</li>
                        <li>Users who contact us or submit information through our Platform</li>
                    </ul>
                    <p className="privacy-para">This policy does not apply to information that is:</p>
                    <ul className="privacy-list">
                        <li>Publicly available by law</li>
                        <li>Voluntarily made public by you</li>
                        <li>Obtained from lawful public sources</li>
                    </ul>
                    <p className="privacy-para">This Privacy Policy forms part of Rmax Solutions' Terms of Use and should be read together with them.</p>
                </div>

                {/* Section: Information We Collect */}
                <div className="privacy-section">
                    <h2 className="privacy-heading">Information We Collect</h2>
                    <p className="privacy-para">We collect personal information only when it is necessary for legitimate business purposes.</p>
                    
                    <p className="privacy-sub-heading">1. Information You Provide Voluntarily</p>
                    <p className="privacy-para">This includes information shared when you:</p>
                    <ul className="privacy-list">
                        <li>Fill out contact or enquiry forms</li>
                        <li>Register for services</li>
                        <li>Communicate with us via email, phone, or chat</li>
                    </ul>
                    <p className="privacy-para"><strong>Examples:</strong> Name, Email address, Phone number, Company name, Job title, Project or service requirements.</p>

                    <p className="privacy-sub-heading">2. Information Collected Automatically</p>
                    <p className="privacy-para">When you visit our Platform, we may automatically collect:</p>
                    <ul className="privacy-list">
                        <li>IP address</li>
                        <li>Browser type and device details</li>
                        <li>Operating system</li>
                        <li>Pages visited and time spent</li>
                        <li>Referral URLs</li>
                    </ul>
                    <p className="privacy-para">This data helps us improve website performance, security, and user experience.</p>

                    <p className="privacy-sub-heading">3. Information from Third Parties</p>
                    <p className="privacy-para">We may receive limited data from:</p>
                    <ul className="privacy-list">
                        <li>Business partners</li>
                        <li>Marketing platforms</li>
                        <li>Public or professional sources</li>
                    </ul>
                    <p className="privacy-para">Rmax Solutions is not responsible for the privacy practices of third-party platforms.</p>
                </div>

                {/* Section: Purpose */}
                <div className="privacy-section">
                    <h2 className="privacy-heading">Purpose of Collecting Personal Information</h2>
                    <p className="privacy-para">We use your information to:</p>
                    <ul className="privacy-list">
                        <li>Provide and manage our services</li>
                        <li>Respond to enquiries and requests</li>
                        <li>Improve our website, services, and user experience</li>
                        <li>Communicate service updates and business information</li>
                        <li>Conduct analytics and internal research</li>
                        <li>Ensure platform security and prevent fraud</li>
                        <li>Comply with legal and regulatory obligations</li>
                    </ul>
                    <p className="privacy-para">We do not collect unnecessary or excessive personal data.</p>
                </div>

                {/* Section: Legal Basis */}
                <div className="privacy-section">
                    <h2 className="privacy-heading">Legal Basis for Processing Data</h2>
                    <p className="privacy-para">We process your personal data based on one or more of the following lawful grounds:</p>
                    <ul className="privacy-list">
                        <li>Your consent</li>
                        <li>Performance of a contract</li>
                        <li>Compliance with legal obligations</li>
                        <li>Rmax Solutions' legitimate business interests, balanced with your rights</li>
                    </ul>
                    <p className="privacy-para">You may withdraw your consent at any time.</p>
                </div>

                {/* Section: Cookies */}
                <div className="privacy-section">
                    <h2 className="privacy-heading">Cookies and Tracking Technologies</h2>
                    <p className="privacy-para">Our website uses cookies and similar technologies to:</p>
                    <ul className="privacy-list">
                        <li>Enhance user experience</li>
                        <li>Analyse website traffic</li>
                        <li>Improve functionality and performance</li>
                    </ul>
                    <p className="privacy-para">You can manage or disable cookies through your browser settings. Some features may not function correctly if cookies are disabled.</p>
                </div>

                {/* Section: Data Retention */}
                <div className="privacy-section">
                    <h2 className="privacy-heading">Data Retention</h2>
                    <p className="privacy-para">We retain personal data only for as long as:</p>
                    <ul className="privacy-list">
                        <li>It is required to fulfil the stated purpose</li>
                        <li>It is required under applicable laws</li>
                    </ul>
                    <p className="privacy-para">Once the data is no longer needed, it is securely deleted or anonymised.</p>
                </div>

                {/* Section: Protection */}
                <div className="privacy-section">
                    <h2 className="privacy-heading">How We Protect Your Information</h2>
                    <p className="privacy-para">Rmax Solutions follows industry-standard security practices to protect your data, including:</p>
                    <ul className="privacy-list">
                        <li>Secure servers and firewalls</li>
                        <li>Access controls and authentication measures</li>
                        <li>Data encryption where appropriate</li>
                        <li>Regular monitoring and security audits</li>
                    </ul>
                    <p className="privacy-para">While we take reasonable steps to safeguard data, no system can be guaranteed to be 100% secure.</p>
                </div>

                {/* Section: Sharing */}
                <div className="privacy-section">
                    <h2 className="privacy-heading">Data Sharing and Disclosure</h2>
                    <p className="privacy-para">We do not sell or rent your personal data. We may share information only with:</p>
                    <ul className="privacy-list">
                        <li>Authorized employees and contractors</li>
                        <li>Trusted service providers working on our behalf</li>
                        <li>Legal or regulatory authorities, when required by law</li>
                    </ul>
                    <p className="privacy-para">All third parties are required to maintain confidentiality and data protection standards.</p>
                </div>

                {/* Section: Rights */}
                <div className="privacy-section">
                    <h2 className="privacy-heading">Your Rights Under Data Protection Laws</h2>
                    <p className="privacy-para">You have the right to:</p>
                    <ol className="privacy-numbered-list">
                        <li>Access your personal data</li>
                        <li>Request correction or update of inaccurate data</li>
                        <li>Request deletion of your data (subject to legal requirements)</li>
                        <li>Withdraw consent</li>
                        <li>Object to certain types of processing</li>
                        <li>Restrict processing in specific circumstances</li>
                        <li>Nominate a representative in case of incapacity</li>
                        <li>File a grievance or complaint</li>
                    </ol>
                    <p className="privacy-para">To exercise your rights, please contact us using the details below.</p>
                </div>

                {/* Section: Marketing */}
                <div className="privacy-section">
                    <h2 className="privacy-heading">Marketing Communications</h2>
                    <p className="privacy-para">You may receive service-related or business communications from us. You can opt out of promotional communications at any time by contacting us or using the unsubscribe option provided.</p>
                </div>

                {/* Section: Others */}
                <div className="privacy-section">
                    <h2 className="privacy-heading">Third-Party Links</h2>
                    <p className="privacy-para">Our Platform may contain links to third-party websites. Rmax Solutions is not responsible for the privacy practices or content of external websites.</p>
                </div>

                <div className="privacy-section">
                    <h2 className="privacy-heading">Children's Privacy</h2>
                    <p className="privacy-para">Our services are not intended for individuals under the age of 18. We do not knowingly collect personal data from minors. If such data is identified, it will be deleted promptly.</p>
                </div>

                <div className="privacy-section">
                    <h2 className="privacy-heading">Changes to This Privacy Policy</h2>
                    <p className="privacy-para">We may update this Privacy Policy from time to time. Any changes will be effective upon posting on our website. Continued use of our Platform signifies acceptance of the updated policy.</p>
                </div>

                {/* Section: Grievance */}
                <div className="privacy-section">
                    <h2 className="privacy-heading">Grievance Redressal & Contact Information</h2>
                    <p className="privacy-para">If you have any questions, concerns, or complaints regarding this Privacy Policy or your personal data, please contact:</p>
                    
                    <div className="privacy-contact-box">
                        <p><strong>Grievance Officer / Data Protection Officer</strong></p>
                        <p>Rmax Solutions</p>
                        <p>Email: sales@rmaxsolutions.com</p>
                        <p>Phone: +91-XXXXXXXXXX</p>
                    </div>
                    
                    <p className="privacy-para" style={{ marginTop: '15px' }}>We aim to resolve all grievances within the timelines prescribed under applicable law.</p>
                    <p className="privacy-para">If your concern is not resolved satisfactorily, you may escalate it to the <strong>Data Protection Board of India</strong>, as per the Digital Personal Data Protection Act, 2023.</p>
                </div>

            </div>
        </div>
    );
};

export default PrivacyPolicy;