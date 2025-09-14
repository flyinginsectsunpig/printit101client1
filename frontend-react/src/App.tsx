import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TestApi from "./views/TestApi";
import CustomerTestApi from "./views/CustomerTestApi";
import CustomerDemo from "./components/CustomerDemo";
import TShirtDesigner from "./components/TShirtDesigner";
import ScaleTestApi from "./views/ScaleTestApi";
import PositionTestApi from "./views/PositionTestApi";
import RotationTestApi from "./views/RotationTestApi";
import PlacementDataTestApi from "./views/PlacementDataTestApi";

import { Cart } from "./components/Cart";
import { Checkout } from "./components/Checkout";
import { CartProvider } from "./context/CartContext";

function App() {
    return (
        <CartProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/test-api" element={<TestApi />} />
                    <Route path="/customer-test-api" element={<CustomerTestApi />} />
                    <Route path="/customer-demo" element={<CustomerDemo />} />
                    <Route path="/tshirt-designer" element={<TShirtDesigner />} />
                    <Route path="/placement-test-api" element={<PlacementDataTestApi />} />
                    <Route path="/scale-test-api" element={<ScaleTestApi />} />
                    <Route path="/position-test-api" element={<PositionTestApi />} />
                    <Route path="/rotation-test-api" element={<RotationTestApi />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                </Routes>
            </BrowserRouter>
        </CartProvider>
    );
}

export default App;
