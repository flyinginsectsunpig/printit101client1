import React, { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import { useAuth } from '../context/AuthContext';

interface AuthProps {
    onAuthSuccess: (user: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const { login, setCurrentUser } = useAuth();

    const handleSwitchToRegister = () => {
        setIsLoginMode(false);
    };

    const handleSwitchToLogin = () => {
        setIsLoginMode(true);
    };

    const handleAuthSuccess = (user: any) => {
        // setCurrentUser already handles both user and login state
        setCurrentUser(user);
        onAuthSuccess(user);
    };

    const handleLogout = () => {
        console.log('Auth: Logging out user');
        setUser(null);
        setIsLogin(true);
        logout(); // Clear from context as well
        window.location.href = '/'; // Redirect to home
    };

    // Check for existing session on component mount
    useEffect(() => {
        const savedUser = sessionStorage.getItem('currentUser');
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                console.log('Auth: Restored user session:', userData);
                setUser(userData);
                onAuthSuccess(userData);
            } catch (error) {
                console.error('Auth: Failed to parse saved user data:', error);
                sessionStorage.removeItem('currentUser');
            }
        }
    }, [onAuthSuccess]);

    // If user is admin, show admin dashboard
    if (user && user.role === 'ADMIN') {
        return <AdminDashboard onLogout={handleLogout} />;
    }

    // If user is customer, show welcome message (or redirect to main app)
    if (user && user.role === 'CUSTOMER') {
        // For customers, we'll redirect to the main T-shirt designer
        // But first show a brief welcome
        setTimeout(() => {
            window.location.href = '/tshirt-designer';
        }, 1000);

        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #faf5ff 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem'
            }}>
                <div style={{
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    maxWidth: '500px'
                }}>
                    <h2 style={{ marginBottom: '1rem', color: '#111827' }}>
                        Welcome, {user.firstName} {user.lastName}!
                    </h2>
                    <p style={{ marginBottom: '2rem', color: '#6b7280' }}>
                        Redirecting to T-Shirt Designer...
                    </p>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '4px solid #f3f4f6',
                        borderTop: '4px solid #3b82f6',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto'
                    }} />
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            </div>
        );
    }

    // Show login/register forms
    return (
        <>
            {isLoginMode ? (
                <Login
                    onLoginSuccess={handleAuthSuccess}
                    onSwitchToRegister={handleSwitchToRegister}
                />
            ) : (
                <Register
                    onRegisterSuccess={handleAuthSuccess}
                    onSwitchToLogin={handleSwitchToLogin}
                />
            )}
        </>
    );
};

export default Auth;