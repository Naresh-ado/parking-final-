import React, { useEffect, useState } from 'react';
import './ParkingTable.css';

const ParkingTable = ({ searchQuery, onSpotClick }) => {
    const [parkingData, setParkingData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/parking');
                const data = await response.json();
                setParkingData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching parking data:', error);
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);

        return () => clearInterval(interval);
    }, []);

    const filteredData = parkingData.filter(spot =>
        spot.place.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div className="loading">Loading live parking data...</div>;

    return (
        <div className="parking-table-container glass-panel">
            <table className="parking-table">
                <thead>
                    <tr>
                        <th>Place</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th className="availability-header">
                            Availability
                            <div className="vehicle-types">
                                <span>Bike</span>
                                <span>Car</span>
                                <span>Van</span>
                                <span>Bus</span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map(spot => (
                        <tr key={spot.id}>
                            <td className="place-cell clickable" onClick={() => onSpotClick && onSpotClick(spot)}>
                                {spot.place} ℹ️
                            </td>
                            <td className="location-cell">{spot.location}</td>
                            <td>
                                <span className={`status-badge ${spot.isOpen ? 'open' : 'closed'}`}>
                                    {spot.isOpen ? 'Open' : 'Closed'}
                                </span>
                            </td>
                            <td>
                                <div className="availability-grid">
                                    <AvailabilityIndicator available={spot.availability.bike} type="Bike" />
                                    <AvailabilityIndicator available={spot.availability.car} type="Car" />
                                    <AvailabilityIndicator available={spot.availability.van} type="Van" />
                                    <AvailabilityIndicator available={spot.availability.bus} type="Bus" />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const AvailabilityIndicator = ({ available, type }) => (
    <div className={`indicator ${available ? 'available' : 'full'}`} title={`${type}: ${available ? 'Available' : 'Full'}`}>
        <span className="indicator-icon">{type === 'Bike' ? '🏍️' : type === 'Car' ? '🚗' : type === 'Van' ? '🚐' : '🚌'}</span>
    </div>
);

export default ParkingTable;
