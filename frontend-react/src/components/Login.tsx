
import React, { useState, useEffect } from 'react';
import api from '../service/api';
import Header from './Header';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
    onLoginSuccess: (user: any) => void;
    onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
    const { login, setUser } = useAuth();
    const [formData, setFormData] = useState({
        userName: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Reset form data when component mounts or switches to login
    useEffect(() => {
        setFormData({ userName: '', password: '' });
    }, [onSwitchToRegister]); // Re-run when switching to login screen

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            console.log('Attempting login with:', formData);
            const response = await api.post('/auth/login', formData);
            onLoginSuccess(response.data);
        } catch (error: any) {
            console.error('Login error:', error);
            setError(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper" style={{
            minHeight: '100vh',
            width: '100%',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #faf5ff 100%)',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            <Header page="login" onButtonClick={onSwitchToRegister} />
            <div className="auth-container" style={{
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '2.5rem 1rem',
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden'
            }}>
                <div className="auth-form" style={{
                    width: '100%',
                    maxWidth: '400px',
                    maxHeight: 'calc(100vh - 72px)',
                    overflowY: 'auto'
                }}>
                    {error && <div className="error-message" style={{ color: '#dc2626', padding: '0.5rem', backgroundColor: '#fee2e2', borderRadius: '4px', marginBottom: '1rem' }}>{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label htmlFor="userName" style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>Username:</label>
                            <input
                                type="text"
                                id="userName"
                                name="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                required
                                placeholder="Enter your username"
                                autoComplete="off" // Disable browser autofill
                                style={{ width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '6px', fontSize: '1rem' }}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>Password:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Enter your password"
                                autoComplete="new-password" // Prevent autofill for password
                                style={{ width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '6px', fontSize: '1rem' }}
                            />
                        </div>
                        <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer' }}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    <p style={{ marginTop: '1rem', textAlign: 'center', color: '#6b7280' }}>
                        Don't have an account?{' '}
                        <button type="button" className="link-button" onClick={onSwitchToRegister} style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                            Register here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
