import React, { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
    id?: string; // uuid, optional
    productId: number;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
    image?: string;
}

interface CartContextType {
    cart: CartItem[];
    items: CartItem[]; // alias for cart
    total: number; // total price in Rands
    addToCart: (item: CartItem) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = (item: CartItem) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.productId === item.productId);
            if (existing) {
                return prev.map((i) =>
                    i.productId === item.productId ? {
                        ...i,
                        quantity: (i.quantity || 1) + (item.quantity || 1)
                    } : i
                );
            }
            return [...prev, {
                ...item,
                id: item.id || `${item.productId}-${Date.now()}`,
                quantity: item.quantity || 1,
                price: item.price || 0
            }];
        });
    };

    const removeFromCart = (productId: number) => {
        setCart((prev) => prev.filter((i) => i.productId !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart((prev) =>
            prev.map((item) =>
                item.productId === productId
                    ? { ...item, quantity: quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    // calculate total in Rands
    const total = cart.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
        0
    );

    return (
        <CartContext.Provider
            value={{ cart, items: cart, total, addToCart, removeFromCart, updateQuantity, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};
