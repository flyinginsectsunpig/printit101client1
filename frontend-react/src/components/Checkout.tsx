import React, { useState } from "react";
import { useCart } from "../context/CartContext";

export const Checkout = () => {
    const { cart, total, clearCart } = useCart();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [method, setMethod] = useState("BANK_TRANSFER");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const order = {
            userName: name,
            email,
            paymentMethod: method,
            totalAmount: total,
            orderItems: cart.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
                pricePerUnit: item.price,
            })),
        };

        try {
            const res = await fetch("http://localhost:8080/api/orders/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(order),
            });

            if (res.ok) {
                alert("Order placed successfully!");
                clearCart();
            }
        } catch (err) {
            console.error("Checkout failed", err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Checkout</h2>
            <p>Total: R{total}</p>

            <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <select value={method} onChange={(e) => setMethod(e.target.value)}>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="PAYPAL">PayPal</option>
            </select>

            <button type="submit">Place Order</button>
        </form>
    );
};
