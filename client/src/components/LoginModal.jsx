import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './LoginModal.css';

const LoginModal = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.includes('@')) {
            setError('Please enter a valid email');
            return;
        }

        setLoading(true);
        try {
            const success = await login(email);
            if (success) {
                onClose();
            } else {
                setError('Login failed. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-panel">
                <button className="close-btn" onClick={onClose}>&times;</button>
                <h2>Login / Sign Up</h2>
                <p className="modal-subtitle">Enter your email to continue</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        className="auth-input"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {error && <p className="error-text">{error}</p>}
                    <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
                        {loading ? 'Logging in...' : 'Continue'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
