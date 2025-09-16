
import React, { useState } from "react";
import { useCart, CartItem } from "../context/CartContext";
import { Link } from "react-router-dom";
import { ShoppingCart, X, Plus, Minus } from "lucide-react";

export const Cart: React.FC = () => {
    const { cart, removeFromCart, updateQuantity, total } = useCart();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{ position: "fixed", top: "80px", right: "20px", zIndex: 1000 }}>
            {/* Cart Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: 'linear-gradient(135deg, #2563eb, #9333ea)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '56px',
                    height: '56px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    position: 'relative'
                }}
            >
                <ShoppingCart size={24} />
                {cart.length > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: '#dc2626',
                        color: 'white',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {cart.length}
                    </span>
                )}
            </button>

            {/* Cart Dropdown */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '64px',
                    right: '0',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                    padding: '16px',
                    minWidth: '320px',
                    maxHeight: '400px',
                    overflowY: 'auto'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Shopping Cart</h3>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            <X size={20} />
                        </button>
                    </div>

                    {cart.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#6b7280', margin: '20px 0' }}>Your cart is empty</p>
                    ) : (
                        <>
                            {cart.map((item: CartItem) => (
                                <div key={item.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '12px 0',
                                    borderBottom: '1px solid #f3f4f6'
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '500', fontSize: '14px' }}>{item.name || 'Custom T-Shirt'}</div>
                                        {item.size && <div style={{ fontSize: '12px', color: '#6b7280' }}>Size: {item.size}</div>}
                                        {item.color && <div style={{ fontSize: '12px', color: '#6b7280' }}>Color: {item.color}</div>}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                            <span style={{ fontSize: '12px', color: '#6b7280' }}>Qty:</span>
                                            <button
                                                onClick={() => updateQuantity(item.productId, (item.quantity || 1) - 1)}
                                                style={{
                                                    background: '#f3f4f6',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '4px',
                                                    width: '20px',
                                                    height: '20px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <span style={{ fontSize: '12px', fontWeight: '500', minWidth: '20px', textAlign: 'center' }}>
                                                {item.quantity || 1}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.productId, (item.quantity || 1) + 1)}
                                                style={{
                                                    background: '#f3f4f6',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '4px',
                                                    width: '20px',
                                                    height: '20px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: '500' }}>R{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                                        <button
                                            onClick={() => removeFromCart(item.productId)}
                                            style={{
                                                background: '#dc2626',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                padding: '4px 8px',
                                                cursor: 'pointer',
                                                fontSize: '12px'
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: '16px',
                                padding: '12px 0',
                                borderTop: '2px solid #e5e7eb'
                            }}>
                                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Total: R{total.toFixed(2)}</span>
                            </div>
                            <Link to="/checkout" style={{ textDecoration: 'none' }}>
                                <button style={{
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '12px 24px',
                                    cursor: 'pointer',
                                    width: '100%',
                                    fontWeight: '500',
                                    fontSize: '16px',
                                    marginTop: '8px'
                                }}>
                                    Proceed to Checkout
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
