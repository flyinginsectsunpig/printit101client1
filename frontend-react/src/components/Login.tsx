import React, { useState } from 'react';
import api from '../service/api';
import Header from './Header';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
    onLoginSuccess: (user: any) => void;
    onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        userName: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
            console.log('Login successful:', response.data);

            // Update auth context
            login(response.data);

            // Call the callback
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
                    {error && <div className="error-message">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="userName">Username:</label>
                            <input
                                type="text"
                                id="userName"
                                name="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                required
                                placeholder="Enter your username"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Enter your password"
                            />
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    <p>
                        Don't have an account?{' '}
                        <button type="button" className="link-button" onClick={onSwitchToRegister}>
                            Register here
                        </button>
                    </p>

                    {/* Test accounts info */}
                    <div style={{
                        marginTop: '2rem',
                        padding: '1rem',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '8px',
                        fontSize: '0.875rem'
                    }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>Test Accounts:</h4>
                        <p style={{ margin: '0.25rem 0', color: '#059669' }}>
                            <strong>Admin:</strong> superadmin / supersecretpassword
                        </p>
                        <p style={{ margin: '0.25rem 0', color: '#6b7280', fontSize: '0.75rem' }}>
                            (Register as customer to test customer features)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;