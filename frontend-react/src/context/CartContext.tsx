import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { CartItem } from "../types/CartItem";
import { v4 as uuidv4 } from "uuid";

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const raw = localStorage.getItem("cart");
    return raw ? JSON.parse(raw) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    // give item an id
    const id = item.id ?? uuidv4();
    setItems(prev => {
      const found = prev.find(i => i.productId === item.productId && i.size === item.size && i.color === item.color);
      if (found) {
        return prev.map(i => i.productId === item.productId && i.size === item.size && i.color === item.color ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, { ...item, id }];
    });
  };

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
  const updateQuantity = (id: string, qty: number) => setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  const clearCart = () => setItems([]);
  const total = items.reduce((s, i) => s + (i.price * i.quantity), 0);

  return <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total }}>{children}</CartContext.Provider>;
};
