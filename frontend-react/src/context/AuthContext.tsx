import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Customer } from "../domain/Customer";

interface AuthContextType {
    isLoggedIn: boolean;
    user: Customer | null;
    login: () => void;
    logout: () => void;
    setUser: (user: Customer | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<Customer | null>(null);

    useEffect(() => {
        // Check localStorage on component mount
        const storedUser = localStorage.getItem('user');
        const storedIsLoggedIn = localStorage.getItem('isLoggedIn');

        if (storedUser && storedIsLoggedIn === 'true') {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setIsLoggedIn(true);
            } catch (error) {
                // Clear invalid data
                localStorage.removeItem('user');
                localStorage.removeItem('isLoggedIn');
            }
        }
    }, []);

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
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout, setUser: setUserWithPersistence }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};