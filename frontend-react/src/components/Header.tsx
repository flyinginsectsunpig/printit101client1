import React from 'react';
import {Shirt, LogOut} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
    page: 'login' | 'register' | 'profile' | 'designer';
    onButtonClick: () => void;
    onProfileClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({page, onButtonClick, onProfileClick}) => {
    const { user, logout, isLoggedIn } = useAuth();

    const handleLogout = () => {
        logout();
        // Redirect to login or reload page
        window.location.href = '/';
    };

    return (
        <header style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            borderBottom: '1px solid #f3f4f6',
            position: 'sticky',
            top: 0,
            zIndex: 40,
            width: '100%', // Ensure full width
            padding: '0 1rem' // Add padding instead of fixed maxWidth
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '72px'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #2563eb, #9333ea)',
                        padding: '0.5rem',
                        borderRadius: '0.75rem'
                    }}>
                        <Shirt style={{height: '2rem', width: '2rem', color: 'white'}}/>
                    </div>
                    <span style={{
                        fontSize: '1.875rem',
                        fontWeight: 'bold',
                        background: 'linear-gradient(to right, #2563eb, #9333ea)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        TeeDesign Pro
                    </span>
                </div>

                <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    {isLoggedIn && user && (
                        <span style={{
                            fontSize: '1rem',
                            fontWeight: '500',
                            color: '#374151'
                        }}>
                            Welcome, {user.firstName} {user.lastName}
                        </span>
                    )}
                    {page === 'designer' && onProfileClick && (
                        <button
                            onClick={onProfileClick}
                            style={{
                                background: 'linear-gradient(to right, #9333ea, #7c3aed)',
                                color: 'white',
                                padding: '0.5rem 1.5rem',
                                borderRadius: '0.75rem',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                transition: 'all 0.2s',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                marginRight: '0.5rem'
                            }}
                        >
                            Profile
                        </button>
                    )}
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            style={{
                                background: 'linear-gradient(to right, #dc2626, #b91c1c)',
                                color: 'white',
                                padding: '0.5rem 1.5rem',
                                borderRadius: '0.75rem',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                transition: 'all 0.2s',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <LogOut style={{ height: '1rem', width: '1rem' }} />
                            Logout
                        </button>
                    ) : (
                        <button
                            onClick={onButtonClick}
                            style={{
                                background: 'linear-gradient(to right, #1e90ff, #0000ff)',
                                color: 'white',
                                padding: '0.5rem 1.5rem',
                                borderRadius: '0.75rem',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                transition: 'all 0.2s',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            {page === 'login' ? 'Register' : page === 'register' ? 'Login' : 'Login'}
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;