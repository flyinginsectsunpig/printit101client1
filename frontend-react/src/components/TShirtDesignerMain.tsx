import React, { useState } from "react";
import { useCart } from "../context/CartContext";

const TShirtDesignerMain: React.FC = () => {
    const { addToCart } = useCart();

    const BASE_PRICE = 150;

    const [tshirtName, setTshirtName] = useState("Custom T-Shirt");
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        addToCart({
            id: Date.now(),
            name: tshirtName,
            price: BASE_PRICE,
            quantity,
        });
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Design Your T-Shirt</h2>

            <div>
                <label>Design Name: </label>
                <input
                    type="text"
                    value={tshirtName}
                    onChange={(e) => setTshirtName(e.target.value)}
                />
            </div>

            <div>
                <label>Quantity: </label>
                <input
                    type="number"
                    value={quantity}
                    min={1}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                />
            </div>

            <p>
                Price per shirt:{" "}
                <span style={{ fontWeight: 'bold', color: '#2563eb' }}>
                    R{BASE_PRICE || '299.99'}
                </span>
            </p>

            <p>
                Total:{" "}
                <span style={{ fontWeight: 'bold', color: '#2563eb' }}>
                    R{BASE_PRICE * quantity || '299.99'}
                </span>
            </p>

            <button onClick={handleAddToCart}>Add to Cart</button>
        </div>
    );
};

export default TShirtDesignerMain;
