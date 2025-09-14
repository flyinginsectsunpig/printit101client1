import React from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

export const Cart = () => {
  const { items, removeItem, updateQuantity, total } = useCart();
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20 }}>
      <h2>Your cart</h2>
      {items.length === 0 ? (
        <div>
          <p>Cart is empty.</p>
          <Link to="/">Continue shopping</Link>
        </div>
      ) : (
        <>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Item</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th>
              </tr>
            </thead>
            <tbody>
              {items.map(it => (
                <tr key={it.id}>
                  <td>{it.name}</td>
                  <td>{it.price.toFixed(2)}</td>
                  <td>
                    <input type="number" min={1} value={it.quantity} onChange={e => updateQuantity(it.id!, Math.max(1, parseInt(e.target.value || "1")))} />
                  </td>
                  <td>{(it.price * it.quantity).toFixed(2)}</td>
                  <td><button onClick={() => removeItem(it.id!)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 20, textAlign: "right" }}>
            <strong>Total: R{total.toFixed(2)}</strong>
          </div>

          <div style={{ marginTop: 20 }}>
            <button onClick={() => navigate("/checkout")}>Proceed to checkout</button>
          </div>
        </>
      )}
    </div>
  );
};
