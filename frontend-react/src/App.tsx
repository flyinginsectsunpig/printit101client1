import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TestApi from "./views/TestApi";
import CustomerTestApi from "./views/CustomerTestApi";
import CustomerDemo from "./components/CustomerDemo";
import TShirtDesignerMain from "./components/TShirtDesignerMain";
import ScaleTestApi from "./views/ScaleTestApi";
import PositionTestApi from "./views/PositionTestApi";
import RotationTestApi from "./views/RotationTestApi";
import PlacementDataTestApi from "./views/PlacementDataTestApi";

import { Cart } from "./components/Cart";
import { Checkout } from "./components/Checkout";
import OrderPage from "./components/OrderPage";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                    <Layout />
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    );
}

function Layout() {
    const { isLoggedIn } = useAuth();

    return (
        <>
            <Routes>
                {/* Public route: login */}
                <Route path="/login" element={<Login onLoginSuccess={function(user: any): void {
                    throw new Error("Function not implemented.");
                } } onSwitchToRegister={function(): void {
                    throw new Error("Function not implemented.");
                } } />} />

                {/* Protected routes */}
                <Route
                    path="/"
                    element={
                        isLoggedIn ? <TShirtDesignerMain /> : <Navigate to="/login" replace />
                    }
                />
                <Route
                    path="/tshirt-designer"
                    element={
                        isLoggedIn ? <TShirtDesignerMain /> : <Navigate to="/login" replace />
                    }
                />
                <Route
                    path="/checkout"
                    element={isLoggedIn ? <Checkout /> : <Navigate to="/login" replace />}
                />
                <Route
                    path="/order"
                    element={isLoggedIn ? <OrderPage /> : <Navigate to="/login" replace />}
                />

                {/* Other test API routes */}
                <Route path="/test-api" element={<TestApi />} />
                <Route path="/customer-test-api" element={<CustomerTestApi />} />
                <Route path="/customer-demo" element={<CustomerDemo />} />
                <Route path="/placement-test-api" element={<PlacementDataTestApi />} />
                <Route path="/scale-test-api" element={<ScaleTestApi />} />
                <Route path="/position-test-api" element={<PositionTestApi />} />
                <Route path="/rotation-test-api" element={<RotationTestApi />} />

                {/* Redirect unknown routes to / */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Only show cart when logged in */}
            {isLoggedIn && <Cart />}
        </>
    );
}

export default App;
