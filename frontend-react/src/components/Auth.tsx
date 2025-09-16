import React, { useState } from 'react';
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