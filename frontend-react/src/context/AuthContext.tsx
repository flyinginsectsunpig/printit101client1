import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Customer } from "../domain/Customer";

interface AuthContextType {
    isLoggedIn: boolean;
    user: Customer | null;
    login: () => void;
    logout: () => void;
    setUser: (user: Customer | null) => void;
    setCurrentUser: (user: Customer | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // Initialize state synchronously from localStorage
    const getInitialAuthState = () => {
        const storedUser = localStorage.getItem('user');
        const storedIsLoggedIn = localStorage.getItem('isLoggedIn');

        if (storedUser && storedIsLoggedIn === 'true') {
            try {
                const parsedUser = JSON.parse(storedUser);
                // Validate token exists
                if (parsedUser && parsedUser.token) {
                    return { isLoggedIn: true, user: parsedUser };
                }
            } catch (error) {
                console.error('Error parsing stored user:', error);
            }
            // Clear invalid data
            localStorage.removeItem('user');
            localStorage.removeItem('isLoggedIn');
        }
        return { isLoggedIn: false, user: null };
    };

    const initialState = getInitialAuthState();
    const [isLoggedIn, setIsLoggedIn] = useState(initialState.isLoggedIn);
    const [user, setUser] = useState<Customer | null>(initialState.user);

    // Effect to update isLoggedIn when user state changes, and persist to localStorage
    useEffect(() => {
        if (user) {
            setIsLoggedIn(true);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isLoggedIn', 'true');
        } else {
            setIsLoggedIn(false);
            localStorage.removeItem('user');
            localStorage.removeItem('isLoggedIn');
        }
    }, [user]);

    const login = () => {
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
    };

    const setUserWithPersistence = (user: Customer | null) => {
        setUser(user);
    };

    const setCurrentUser = (user: Customer | null) => {
        setUser(user);
        if (user) {
            setIsLoggedIn(true);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isLoggedIn', 'true');
        } else {
            setIsLoggedIn(false);
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('isLoggedIn');
        }
    };


    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout, setUser: setUserWithPersistence, setCurrentUser: setCurrentUser }}>
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