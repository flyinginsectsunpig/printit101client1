
import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

interface AuthProps {
    onAuthSuccess: (user: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);

    const handleSwitchToRegister = () => {
        setIsLogin(false);
    };

    const handleSwitchToLogin = () => {
        setIsLogin(true);
    };

    return (
        <div>
            {isLogin ? (
                <Login
                    onLoginSuccess={onAuthSuccess}
                    onSwitchToRegister={handleSwitchToRegister}
                />
            ) : (
                <Register
                    onRegisterSuccess={onAuthSuccess}
                    onSwitchToLogin={handleSwitchToLogin}
                />
            )}
        </div>
    );
};

export default Auth;
