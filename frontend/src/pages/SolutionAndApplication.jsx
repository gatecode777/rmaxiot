import React from 'react';
import '../styles/solutionandapplication.css'; // Make sure to import your CSS

// Icon Imports (you can replace these with actual imports if using real images)
import SclclgIcon from '/Sclclg.png';
import HospitalIcon from '/hospital 1.png';
import FactoryIcon from '/factory.png';
import OfficesIcon from '/offices.png';
import BankIcon from '/Bank.png';
import GovtIcon from '/govt.png';
import ChallengesIcon from '/Challenges.png';
import HygienicIcon from '/Hygienic.png';
import UserFriendlyIcon from '/userfrendd.png';
import LowMaintenanceIcon from '/lowmain.png';
import CustomisableIcon from '/customisable.png';
import HighFootfallIcon from '/football.png';

const Solutions = () => {
    // Solution cards data
    const solutionCards = [
        {
            id: 1,
            theme: 'theme-blue',
            icon: '/Sclclg.png',
            title: 'Schools & Colleges',
            challenges: ['Menstrual hygiene management', 'Safe waste disposal', 'Easy access to sanitary pads'],
            solutions: ['Sanitary Pad Incinerator Machine', 'Sanitary Pad Disposal Machine', 'Push Button / Coin Operated Pad Vending Machines'],
            benefits: ['Hygienic washrooms', 'Promotes dignity & awareness', 'Low maintenance']
        },
        {
            id: 2,
            theme: 'theme-orange',
            icon: '/hospital 1.png',
            title: 'Hospitals & Healthcare Centers',
            challenges: ['Bio-waste & diaper disposal', 'High hygiene standards'],
            solutions: ['Napkin Incinerator Machine', 'Diaper Incinerator Machine'],
            benefits: ['Safe disposal', 'Odour-free operation', 'Compliance-friendly design']
        },
        {
            id: 3,
            theme: 'theme-navy',
            icon: '/factory.png',
            title: 'Factories & Industrial Units',
            challenges: ['High footfall usage', 'Rugged environment needs'],
            solutions: ['Heavy-duty Napkin & Diaper Incinerators', 'Coin Operated Vending Machines'],
            benefits: ['Industrial-grade durability', 'Handles high load', 'Cost-effective operation']
        },
        {
            id: 4,
            theme: 'theme-orange',
            icon: '/offices.png',
            title: 'Offices & Corporate Spaces',
            challenges: ['Employee hygiene facilities', 'CSR & ESG goals'],
            solutions: ['Sanitary Pad Disposal / Incinerator Machine', 'Automatic Sanitary Pad Vending Machine'],
            benefits: ['Professional washroom setup', 'Supports women workforce', 'Improves workplace wellbeing']
        },
        {
            id: 5,
            theme: 'theme-blue',
            icon: '/Bank.png',
            title: 'Banks & Financial Institutions',
            challenges: ['Secure customer interaction points', 'Self-service infrastructure'],
            solutions: ['GEOSAT (Bank Kiosk Device)', 'Bluestar GPS (Aadhaar GPS)'],
            benefits: ['Secure transactions', 'Smart automation', 'Easy integration']
        },
        {
            id: 6,
            theme: 'theme-orange',
            icon: '/govt.png',
            title: 'Government & Public Places',
            challenges: ['Public hygiene', 'Large-scale implementation', 'Monitoring & accountability'],
            solutions: ['Sanitary Pad Incinerators', 'Coin Operated Vending Machines', 'GPS & Aadhaar-based Devices'],
            benefits: ['Scalable solutions', 'CSR & public welfare aligned', 'Long-term reliability']
        }
    ];

    // Benefits data
    const benefits = [
        { id: 1, icon: '/Hygienic.png', text: 'Hygienic & Safe' },
        { id: 2, icon: '/UserFriendly.png', text: 'User - Friendly' },
        { id: 3, icon: '/LowMaintenance.png', text: 'Low Maintenance' },
        { id: 4, icon: '/Customisable.png', text: 'Customisable' },
        { id: 5, icon: '/HighFootfall.png', text: 'High Footfall Ready' }
    ];

    // How We Work steps
    const workSteps = [
        { id: 1, number: '1', title: 'Understand', subtitle: 'Your Requirement' },
        { id: 2, number: '2', title: 'Recommend', subtitle: 'Right Solution' },
        { id: 3, number: '3', title: 'Installation', subtitle: '& Demo' },
        { id: 4, number: '4', title: 'Ongoing', subtitle: 'Support' }
    ];

    return (
        <section className="solapp">
            <div className="main-wrapper">
                {/* Section Header */}
                <div className="header-section">
                    <h1>One-Stop Solutions for Hygiene, Automation & Smart Infrastructure</h1>
                    <p>We provide purpose-built machines designed for schools, hospitals, offices, banks, public spaces, and government projects.</p>
                </div>

                {/* Solutions Grid */}
                <div className="solutions-grid">
                    {solutionCards.map(card => (
                        <div key={card.id} className={`sol-card ${card.theme}`}>
                            <div className="sol-header">
                                <div className="main-icon">
                                    <img src={card.icon} alt={`${card.title} icon`} />
                                </div>
                                <h2>{card.title}</h2>
                                <div className="header-divider"></div>
                            </div>
                            
                            <div className="sol-body">
                                {/* Challenges Section */}
                                <div className="sol-segment">
                                    <div className="seg-left">
                                        <img src="/Challenges.png" alt="Challenges" />
                                        <span>Challenges</span>
                                    </div>
                                    <div className="seg-right">
                                        <ul>
                                            {card.challenges.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                
                                <div className="thick-bar"></div>
                                
                                {/* Recommended Solutions Section */}
                                <div className="sol-segment">
                                    <div className="seg-left">
                                        <img src="/Challenges.png" alt="Solutions" />
                                        <span>Recommended Solutions</span>
                                    </div>
                                    <div className="seg-right">
                                        <ul>
                                            {card.solutions.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                
                                <div className="thick-bar"></div>
                                
                                {/* Benefits Section */}
                                <div className="sol-segment">
                                    <div className="seg-left">
                                        <img src="/Challenges.png" alt="Benefits" />
                                        <span>Benefits:</span>
                                    </div>
                                    <div className="seg-right">
                                        <ul>
                                            {card.benefits.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section 2: Benefits */}
            <div className="benefits-wrapper">
                <div className="benefits-header">
                    <hr className="line" />
                    <span className="benefits-title">Key Benefits of Our Solutions</span>
                    <hr className="line" />
                </div>

                <div className="benefits-grid">
                    {benefits.map(benefit => (
                        <div key={benefit.id} className="benefit-card">
                            <div className="benefit-icon">
                                <img src={benefit.icon} alt={benefit.text} />
                            </div>
                            <p>{benefit.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section 3: How We Work */}
            <div className="how-we-work-section">
                <h2 className="work-title">How We Work</h2>

                <div className="steps-wrapper">
                    {workSteps.map(step => (
                        <div key={step.id} className="work-card">
                            <div className="step-number">{step.number}</div>
                            <h3>
                                {step.title} <br /> {step.subtitle}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section 4: Consultation */}
            <div className="consultation-wrapper">
                <div className="consult-header">
                    <hr className="divider-line" />
                    <span className="consult-title">Not Sure Which Solution You Need ?</span>
                    <hr className="divider-line" />
                </div>

                <div className="consult-buttons">
                    <a href="#" className="btn-item btn-dark-blue">Get Expert Consultations</a>
                    <a href="#" className="btn-item btn-bright-green">Book A Demo</a>
                    <a href="#" className="btn-item btn-vivid-orange">Contact us</a>
                </div>
            </div>
        </section>
    );
};

export default Solutions;