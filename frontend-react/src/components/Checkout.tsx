import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../service/api';
import Header from './Header';

export const Checkout: React.FC = () => {
    const { cart, clearCart } = useCart();
    const { user } = useAuth();

    // Autofill address from user data
    const getDefaultAddress = () => {
        if (user?.address) {
            const addr = user.address;
            const parts = [
                addr.propertyNumber && `${addr.propertyNumber}`,
                addr.buildingName,
                addr.unitNumber && `Unit ${addr.unitNumber}`,
                addr.street,
                addr.municipality,
                addr.province,
                addr.country
            ].filter(Boolean);
            return parts.join(', ');
        }
        return '';
    };

    const [deliveryAddress, setDeliveryAddress] = useState(getDefaultAddress());
    const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handlePlaceOrder = async () => {
        if (!user) {
            setError('You must be logged in to place an order');
            return;
        }

        if (!deliveryAddress.trim()) {
            setError('Please enter a delivery address');
            return;
        }

        if (cart.length === 0) {
            setError('Your cart is empty');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // First, create a payment record
            const paymentData = {
                paymentMethod: paymentMethod,
                amount: total
            };

            const paymentResponse = await api.post('/payment/create', paymentData);
            const payment = paymentResponse.data;
            console.log('Payment created:', payment);

            // Create order items from cart
            const orderItems = cart.map(item => ({
                tshirtId: item.id,
                quantity: item.quantity,
                price: item.price
            }));

            // Create the order
            const orderData = {
                userId: user.userId,
                paymentId: payment.paymentId,
                addressId: user.address?.addressId || 1,
                orderItems: orderItems,
                orderStatus: 'PENDING'
            };

            console.log('Creating order with data:', orderData);
            const orderResponse = await api.post('/api/orders/checkout', orderData);
            const order = orderResponse.data;
            console.log('Order created successfully:', order);

            alert(`Order placed successfully! Order ID: ${order.orderId}\nTotal: R${total.toFixed(2)}\nPayment Method: ${paymentMethod}`);
            clearCart();
            setDeliveryAddress('');
        } catch (err: any) {
            console.error('Error placing order:', err);
            setError(err.response?.data?.message || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header page="designer" onButtonClick={() => {}} />
            <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Checkout</h2>

                {error && (
                    <div style={{
                        padding: '1rem',
                        marginBottom: '1rem',
                        backgroundColor: '#fee2e2',
                        color: '#991b1b',
                        borderRadius: '0.5rem',
                        border: '1px solid #fecaca'
                    }}>
                        {error}
                    </div>
                )}

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
                        <option value="BANK_TRANSFER">Bank Transfer</option>
                        <option value="CASH_SEND">CashSend</option>
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
                    disabled={loading || cart.length === 0}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        background: loading || cart.length === 0 ? '#9ca3af' : 'linear-gradient(to right, #2563eb, #9333ea)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.75rem',
                        fontWeight: '600',
                        cursor: loading || cart.length === 0 ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Placing Order...' : 'Place Order'}
                </button>
            </div>
        </>
    );
};