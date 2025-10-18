import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Cart: React.FC = () => {
    const { cart, removeFromCart, clearCart } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <>
            <button
                id="cart-toggle"
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed',
                    top: '1rem',
                    right: '1rem',
                    zIndex: 60,
                    background: 'linear-gradient(to right, #2563eb, #9333ea)',
                    borderRadius: '9999px',
                    padding: '0.75rem',
                    border: 'none',
                    cursor: 'pointer'
                }}
            >
                <ShoppingBag style={{ color: 'white', height: '1.5rem', width: '1.5rem' }} />
            </button>

            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    width: '400px',
                    height: '100vh',
                    background: 'white',
                    boxShadow: '-4px 0 15px rgba(0,0,0,0.1)',
                    zIndex: 70,
                    display: 'flex',
                    flexDirection: 'column',
                    borderTopLeftRadius: '1rem',
                    borderBottomLeftRadius: '1rem'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        borderBottom: '1px solid #e5e7eb'
                    }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Your Cart</h2>
                        <button onClick={() => setIsOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                            <X style={{ height: '1.25rem', width: '1.25rem' }} />
                        </button>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                        {cart.length === 0 ? (
                            <p>Your cart is empty.</p>
                        ) : (
                            cart.map((item) => (
                                <div key={item.id} style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    alignItems: 'center',
                                    marginBottom: '1rem',
                                    background: '#f9fafb',
                                    padding: '0.75rem',
                                    borderRadius: '0.75rem'
                                }}>
                                    <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '0.5rem', objectFit: 'cover' }} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: '600' }}>{item.name}</p>
                                        <p>{item.color} | {item.size}</p>
                                        <p>Qty: {item.quantity}</p>
                                        <p>R {(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#dc2626' }}>
                                        Remove
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {cart.length > 0 && (
                        <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                            <p style={{ fontWeight: 'bold' }}>Total: R {total.toFixed(2)}</p>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    navigate('/checkout');
                                }}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    marginTop: '0.75rem',
                                    background: 'linear-gradient(to right, #2563eb, #9333ea)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.75rem',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};