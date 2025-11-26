import React, { useState } from 'react';
import './SpotDetails.css';

const SpotDetails = ({ spot, onClose }) => {
    const [activeTab, setActiveTab] = useState('info'); // info, reviews, photos
    const [reviewText, setReviewText] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');

    const handleAddReview = async () => {
        if (!reviewText) return;
        await fetch(`http://localhost:5000/api/spot/${spot.id}/review`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: 'Guest User', rating: 5, comment: reviewText })
        });
        setReviewText('');
        alert('Review added!');
    };

    const handleAddPhoto = async () => {
        if (!photoUrl) return;
        await fetch(`http://localhost:5000/api/spot/${spot.id}/photo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: 'Guest User', imageUrl: photoUrl })
        });
        setPhotoUrl('');
        alert('Photo added!');
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-panel spot-details-modal">
                <button className="close-btn" onClick={onClose}>&times;</button>
                <h2>{spot.place}</h2>
                <p className="location-sub">{spot.location}</p>

                <div className="tabs">
                    <button className={`tab ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>Info</button>
                    <button className={`tab ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews</button>
                    <button className={`tab ${activeTab === 'photos' ? 'active' : ''}`} onClick={() => setActiveTab('photos')}>Photos</button>
                </div>

                <div className="tab-content">
                    {activeTab === 'info' && (
                        <div className="info-tab">
                            <div className="stat-box">
                                <span>Total Area</span>
                                <strong>{spot.totalArea} sq units</strong>
                            </div>
                            <div className="stat-box">
                                <span>Occupied</span>
                                <strong>{spot.occupiedArea} sq units</strong>
                            </div>
                            <div className="stat-box">
                                <span>Status</span>
                                <strong className={spot.isOpen ? 'text-success' : 'text-danger'}>{spot.isOpen ? 'Open' : 'Closed'}</strong>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="reviews-tab">
                            <div className="review-list">
                                {spot.reviews && spot.reviews.length > 0 ? (
                                    spot.reviews.map((r, i) => (
                                        <div key={i} className="review-item">
                                            <strong>{r.user}</strong>: {r.comment}
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-data">No reviews yet.</p>
                                )}
                            </div>
                            <div className="add-review">
                                <input
                                    type="text"
                                    placeholder="Write a review..."
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                />
                                <button className="btn btn-primary btn-sm" onClick={handleAddReview}>Post</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'photos' && (
                        <div className="photos-tab">
                            <div className="photo-grid">
                                {spot.images && spot.images.length > 0 ? (
                                    spot.images.map((img, i) => (
                                        <img key={i} src={img.url} alt="User upload" className="spot-img" />
                                    ))
                                ) : (
                                    <p className="no-data">No photos yet.</p>
                                )}
                            </div>
                            <div className="add-photo">
                                <input
                                    type="text"
                                    placeholder="Paste image URL..."
                                    value={photoUrl}
                                    onChange={(e) => setPhotoUrl(e.target.value)}
                                />
                                <button className="btn btn-primary btn-sm" onClick={handleAddPhoto}>Add Photo</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SpotDetails;
