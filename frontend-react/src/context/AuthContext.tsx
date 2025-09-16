import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../domain/User';

interface AuthContextType {
    isLoggedIn: boolean;
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    // Check for existing session on mount
    useEffect(() => {
        const savedUser = sessionStorage.getItem('currentUser');
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                setUser(userData);
                setIsLoggedIn(true);
                console.log('AuthContext: Restored user session:', userData);
            } catch (error) {
                console.error('AuthContext: Failed to parse saved user data:', error);
                sessionStorage.removeItem('currentUser');
            }
        }
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        setIsLoggedIn(true);
        sessionStorage.setItem('currentUser', JSON.stringify(userData));
        console.log('AuthContext: User logged in:', userData);
    };

    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);
        sessionStorage.removeItem('currentUser');
        console.log('AuthContext: User logged out');
    };

    const updateUser = (userData: User) => {
        setUser(userData);
        sessionStorage.setItem('currentUser', JSON.stringify(userData));
        console.log('AuthContext: User data updated:', userData);
    };

    return (
        <AuthContext.Provider value={{
            isLoggedIn,
            user,
            login,
            logout,
            updateUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};