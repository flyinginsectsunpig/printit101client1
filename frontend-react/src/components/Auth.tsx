import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import AdminDashboard from './AdminDashboard';
import '../styles.css';

interface AuthProps {
    onAuthSuccess: (user: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [user, setUser] = useState<any>(null);

    const handleAuthSuccess = (userData: any) => {
        setUser(userData);
        onAuthSuccess(userData);
    };

    const handleLogout = () => {
        setUser(null);
        setIsLogin(true);
    };

    // If user is logged in and is an admin, show admin dashboard
    if (user && user.role === 'ADMIN') {
        return <AdminDashboard onLogout={handleLogout} />;
    }

    return (
        <div className="auth-wrapper">
            {isLogin ? (
                <Login
                    onLoginSuccess={handleAuthSuccess}
                    onSwitchToRegister={() => setIsLogin(false)}
                />
            ) : (
                <Register
                    onRegisterSuccess={handleAuthSuccess}
                    onSwitchToLogin={() => setIsLogin(true)}
                />
            )}
        </div>
    );
};

export default Auth;