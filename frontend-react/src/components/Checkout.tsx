import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export const Checkout: React.FC = () => {
    const { cart, clearCart } = useCart();
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER');

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handlePlaceOrder = () => {
        alert(`Order placed with ${paymentMethod}. Total: R${total.toFixed(2)}. Delivery: ${deliveryAddress}`);
        clearCart();
    };

    return (
        <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Checkout</h2>

            {/* Orders */}
            <div style={{ marginBottom: '2rem' }}>
                {cart.map(item => (
                    <div key={item.id} style={{
                        display: 'flex',
                        gap: '1rem',
                        marginBottom: '1rem',
                        background: '#f9fafb',
                        padding: '1rem',
                        borderRadius: '0.75rem'
                    }}>
                        <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', borderRadius: '0.5rem', objectFit: 'cover' }} />
                        <div>
                            <p style={{ fontWeight: '600' }}>{item.name}</p>
                            <p>{item.color} | {item.size}</p>
                            <p>Qty: {item.quantity}</p>
                            <p>R {(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Delivery */}
            <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Delivery Address</label>
                <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    rows={3}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                />
            </div>

            {/* Payment */}
            <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Payment Method</label>
                <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                >
                    <option value="BANK_TRANSFER">Bank Transfer (Absa)</option>
                    <option value="CASH_SEND">CashSend (0781266606)</option>
                    <option value="PAY_ON_DELIVERY">Pay on Delivery</option>
                </select>

                {paymentMethod === 'BANK_TRANSFER' && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#f3f4f6', borderRadius: '0.75rem' }}>
                        <p><strong>Bank:</strong> Absa</p>
                        <p><strong>Account Name:</strong> Gcina Mbabe</p>
                        <p><strong>Account No:</strong> 4107186684</p>
                        <p><strong>Branch Code:</strong> 632005</p>
                        <p><strong>Type:</strong> Current</p>
                    </div>
                )}
                {paymentMethod === 'CASH_SEND' && (
                    <p style={{ marginTop: '1rem' }}>Send CashSend to: <strong>0781266606</strong></p>
                )}
            </div>

            <div style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Total: R {total.toFixed(2)}</div>
            <button
                onClick={handlePlaceOrder}
                style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'linear-gradient(to right, #2563eb, #9333ea)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.75rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                }}
            >
                Place Order
            </button>
        </div>
    );
};
