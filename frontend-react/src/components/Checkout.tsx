import React, { useState, useEffect } from "react";
import { useCart, CartItem } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../service/orderService";
import { OrderDTO, OrderItemDTO } from "../types/Order";

export const Checkout = () => {
    const { items, total, clearCart } = useCart();
    const { user } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-fill form with user data when component loads
    useEffect(() => {
        if (user) {
            setName(`${user.firstName || ''} ${user.lastName || ''}`.trim());
            setEmail(user.contact?.email || "");
            setPhone(user.contact?.phoneNumber || "");

            // Format address as a string for display
            if (user.address) {
                const addressStr = typeof user.address === 'string'
                    ? user.address
                    : `${user.address.buildingName || ''} ${user.address.unitNumber || ''} ${user.address.street || ''}, ${user.address.municipality || ''}, ${user.address.province || ''} ${user.address.postalCode || ''}`.trim();
                setAddress(addressStr);
            }
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!items.length) {
            setMessage("Cart is empty");
            return;
        }

        if (!user) {
            setMessage("Please log in to place an order");
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare order items for backend
            const orderItems: OrderItemDTO[] = items.map((item: CartItem) => ({
                productId: item.productId,
                quantity: item.quantity || 1,
                pricePerUnit: item.price || 0
            }));

            // Create order payload
            const orderPayload: OrderDTO = {
                userId: user.customerId || user.userId, // Use customerId as primary, fallback to userId
                orderItems: orderItems,
                orderStatus: 'PENDING'
            };

            console.log('Creating order with payload:', orderPayload);

            // Call order service to create order in database
            const createdOrder = await createOrder(orderPayload);
            console.log('Order created successfully:', createdOrder);

            // Clear cart after successful order
            clearCart();
            setMessage(`Order confirmed! Order ID: ${createdOrder.orderId}. We have received your order for R${total.toFixed(2)}. We will contact you at ${phone} to arrange delivery to: ${address}`);

            // Clear form
            setName(`${user.firstName || ''} ${user.lastName || ''}`.trim());
            setEmail(user.contact?.email || "");
            setPhone(user.contact?.phoneNumber || "");

            // Format address as a string for display
            if (user.address) {
                const addressStr = typeof user.address === 'string'
                    ? user.address
                    : `${user.address.buildingName || ''} ${user.address.unitNumber || ''} ${user.address.street || ''}, ${user.address.municipality || ''}, ${user.address.province || ''} ${user.address.postalCode || ''}`.trim();
                setAddress(addressStr);
            }

        } catch (error: any) {
            console.error('Error creating order:', error);
            setMessage(`Failed to place order: ${error.response?.data?.message || error.message || 'Please try again.'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div style={{ padding: 20, textAlign: 'center' }}>
                <h2>Please log in to checkout</h2>
                <p>You need to be logged in to place an order.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: 20, maxWidth: '600px', margin: '0 auto' }}>
            <h2>Checkout</h2>

            {/* Order Summary */}
            <div style={{
                padding: 20,
                border: "1px solid #e5e7eb",
                borderRadius: '8px',
                marginBottom: 20,
                backgroundColor: '#f9fafb'
            }}>
                <h3>Order Summary</h3>
                {items.map((item: CartItem) => (
                    <div key={item.id || item.productId} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 0',
                        borderBottom: '1px solid #e5e7eb'
                    }}>
                        <div>
                            <div style={{ fontWeight: '500' }}>{item.name}</div>
                            {item.size && <small>Size: {item.size}</small>}
                            {item.color && <small style={{ marginLeft: '10px' }}>Color: {item.color}</small>}
                        </div>
                        <div>x {item.quantity || 1} - R{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</div>
                    </div>
                ))}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '16px',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    paddingTop: '16px',
                    borderTop: '2px solid #374151'
                }}>
                    <span>Total</span>
                    <span>R{total.toFixed(2)}</span>
                </div>
            </div>

            {/* Customer Details Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Full Name *</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        placeholder={user ? `${user.firstName} ${user.lastName}` : "Enter your full name"}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px'
                        }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Email *</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email address"
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px'
                        }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Phone Number *</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        required
                        placeholder="Enter your phone number"
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px'
                        }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Delivery Address *</label>
                    <textarea
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        required
                        rows={3}
                        placeholder="Enter your delivery address"
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            resize: 'vertical'
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                        background: isSubmitting ? '#9ca3af' : 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 24px',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        fontWeight: '500',
                        fontSize: '16px',
                        marginTop: '16px'
                    }}
                >
                    {isSubmitting ? 'Placing Order...' : 'Place Order'}
                </button>
            </form>

            {message && (
                <div style={{
                    marginTop: 16,
                    padding: '12px',
                    borderRadius: '6px',
                    backgroundColor: message.includes('confirmed') ? '#d1fae5' : '#fee2e2',
                    color: message.includes('confirmed') ? '#065f46' : '#991b1b',
                    border: `1px solid ${message.includes('confirmed') ? '#6ee7b7' : '#fca5a5'}`
                }}>
                    {message}
                </div>
            )}
        </div>
    );
};
