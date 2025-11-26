import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [spots, setSpots] = useState([]);
    const [formData, setFormData] = useState({
        place: '',
        location: '',
        totalArea: '',
        isOpen: true
    });
    const [editingId, setEditingId] = useState(null);

    // Fetch spots
    const fetchSpots = async () => {
        const res = await fetch('http://localhost:5000/api/parking');
        const data = await res.json();
        setSpots(data);
    };

    useEffect(() => {
        fetchSpots();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = "nareshs@student.tce.edu"; // Hardcoded for demo as per requirement context

        const payload = { ...formData };
        if (editingId) payload.id = editingId;

        try {
            const res = await fetch('http://localhost:5000/api/admin/spot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                fetchSpots();
                resetForm();
            } else {
                alert('Failed to save spot');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        const token = "nareshs@student.tce.edu";

        await fetch(`http://localhost:5000/api/admin/spot/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchSpots();
    };

    const handleEdit = (spot) => {
        setFormData({
            place: spot.place,
            location: spot.location,
            totalArea: spot.totalArea,
            isOpen: spot.isOpen
        });
        setEditingId(spot.id);
    };

    const resetForm = () => {
        setFormData({ place: '', location: '', totalArea: '', isOpen: true });
        setEditingId(null);
    };

    return (
        <div className="admin-dashboard container glass-panel">
            <h2>Admin Dashboard</h2>

            <div className="admin-grid">
                <div className="admin-form-section">
                    <h3>{editingId ? 'Edit Spot' : 'Add New Spot'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Place Name</label>
                            <input
                                type="text"
                                value={formData.place}
                                onChange={e => setFormData({ ...formData, place: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Location</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Total Area (sq units)</label>
                            <input
                                type="number"
                                value={formData.totalArea}
                                onChange={e => setFormData({ ...formData, totalArea: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={formData.isOpen}
                                    onChange={e => setFormData({ ...formData, isOpen: e.target.checked })}
                                />
                                Is Open?
                            </label>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Add'}</button>
                            {editingId && <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>}
                        </div>
                    </form>
                </div>

                <div className="admin-list-section">
                    <h3>Existing Spots</h3>
                    <div className="spot-list">
                        {spots.map(spot => (
                            <div key={spot.id} className="spot-item">
                                <div className="spot-info">
                                    <h4>{spot.place}</h4>
                                    <p>{spot.location}</p>
                                    <small>Area: {spot.totalArea} | Occupied: {spot.occupiedArea}</small>
                                </div>
                                <div className="spot-actions">
                                    <button onClick={() => handleEdit(spot)} className="btn-icon">✏️</button>
                                    <button onClick={() => handleDelete(spot.id)} className="btn-icon delete">🗑️</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
