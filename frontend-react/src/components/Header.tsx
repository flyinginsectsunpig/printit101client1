import React from 'react';
import {Shirt} from 'lucide-react';

interface HeaderProps {
    page: 'login' | 'register';
    onButtonClick: () => void;
}

const Header: React.FC<HeaderProps> = ({page, onButtonClick}) => {
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
          <span style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #2563eb, #9333ea)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
          }}>
            {page === 'login' ? 'Login' : 'Register'}
          </span>
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
                        {page === 'login' ? 'Register' : 'Login'}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;