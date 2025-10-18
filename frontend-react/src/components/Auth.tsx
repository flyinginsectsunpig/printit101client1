import React, { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import AdminDashboard from './AdminDashboard';
import { useAuth } from '../context/AuthContext';

interface AuthProps {
    onAuthSuccess: (user: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const { user, setCurrentUser, logout } = useAuth();

    const handleSwitchToRegister = () => {
        setIsLoginMode(false);
    };

    const handleSwitchToLogin = () => {
        setIsLoginMode(true);
    };

    const handleAuthSuccess = (user: any) => {
        console.log('Auth: handleAuthSuccess called with user:', user);
        // setCurrentUser already handles both user and login state
        setCurrentUser(user);
        onAuthSuccess(user);
    };

    const handleLogout = () => {
        console.log('Auth: Logging out user');
        logout(); // Clear from context as well
        window.location.href = '/'; // Redirect to home
    };

    // If user is admin, show admin dashboard
    if (user && user.role === 'ADMIN') {
        return <AdminDashboard onLogout={handleLogout} />;
    }

    // For customers, App.tsx routing will handle the redirect
    // We don't render anything here to avoid showing forms
    if (user && user.role === 'CUSTOMER') {
        return null;
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