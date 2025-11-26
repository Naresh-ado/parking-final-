import React, { useRef, useState, useEffect } from 'react';
import './CameraScanner.css';

const CameraScanner = ({ onClose }) => {
    const videoRef = useRef(null);
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please allow camera permissions.");
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
    };

    const handleScan = async () => {
        setScanning(true);

        // Simulate processing delay
        setTimeout(async () => {
            try {
                // In a real app, we would capture a frame and send it to the backend
                // const imageBlob = captureFrame(videoRef.current);
                // const formData = new FormData();
                // formData.append('image', imageBlob);

                const response = await fetch('http://localhost:5000/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ simulated: true })
                });

                const data = await response.json();
                setResult(data.availability);
            } catch (error) {
                console.error("Analysis failed:", error);
            } finally {
                setScanning(false);
            }
        }, 2000);
    };

    return (
        <div className="scanner-overlay">
            <div className="scanner-modal glass-panel">
                <button className="close-btn" onClick={onClose}>&times;</button>
                <h3>Scan Parking Area</h3>

                <div className="camera-view">
                    {!result ? (
                        <>
                            <video ref={videoRef} autoPlay playsInline muted className="video-feed" />
                            <div className="scan-overlay-box"></div>
                        </>
                    ) : (
                        <div className="scan-result">
                            <h4>Analysis Result</h4>
                            <div className="result-grid">
                                <div className={`result-item ${result.bike ? 'avail' : 'full'}`}>Bike: {result.bike ? 'Open' : 'Full'}</div>
                                <div className={`result-item ${result.car ? 'avail' : 'full'}`}>Car: {result.car ? 'Open' : 'Full'}</div>
                                <div className={`result-item ${result.van ? 'avail' : 'full'}`}>Van: {result.van ? 'Open' : 'Full'}</div>
                                <div className={`result-item ${result.bus ? 'avail' : 'full'}`}>Bus: {result.bus ? 'Open' : 'Full'}</div>
                            </div>
                            <p className="result-note">Live availability updated!</p>
                            <button className="btn btn-primary" onClick={() => setResult(null)}>Scan Again</button>
                        </div>
                    )}
                </div>

                {!result && (
                    <button
                        className="btn btn-primary scan-action-btn"
                        onClick={handleScan}
                        disabled={scanning}
                    >
                        {scanning ? 'Analyzing...' : 'Capture & Analyze'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default CameraScanner;
