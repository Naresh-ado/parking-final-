import React from 'react';
import './HeroSection.css';

const HeroSection = ({ searchQuery, setSearchQuery, onScanClick }) => {
    return (
        <section className="hero">
            <div className="container hero-content">
                <h2 className="hero-title">Find Your Perfect <span className="highlight">Parking Spot</span></h2>
                <p className="hero-subtitle">Real-time availability updates for all vehicle types.</p>

                <div className="search-container glass-panel">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search location or spot name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="btn btn-primary search-btn">Search</button>
                </div>

                <div className="action-area">
                    <button className="btn btn-outline" onClick={onScanClick}>
                        📸 Scan Parking Spot
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
