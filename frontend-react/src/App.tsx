import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TestApi from "./views/TestApi";
import CustomerTestApi from "./views/CustomerTestApi";
import CustomerDemo from "./components/CustomerDemo";
import TShirtDesignerMain from "./components/TShirtDesignerMain"; // Updated import
import Profile from "./components/Profile";
import ScaleTestApi from "./views/ScaleTestApi";
import PositionTestApi from "./views/PositionTestApi";
import RotationTestApi from "./views/RotationTestApi";
import PlacementDataTestApi from "./views/PlacementDataTestApi";
import Auth from "./components/Auth";

import { Cart } from "./components/Cart";
import { Checkout } from "./components/Checkout";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Auth from "./components/Auth";
import AdminDashboard from "./components/AdminDashboard";

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
    const { isLoggedIn, user } = useAuth();

    const handleAuthSuccess = (user: any) => {
        // Authentication is handled in the Login component
        // This will redirect to the main app
    };

    // Ensure we wait for auth state to be properly initialized
    if (isLoggedIn && !user) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {/* Cart only shows after login for customers */}
            {isLoggedIn && user?.role === "CUSTOMER" && <Cart />}

            <Routes>
                {/* Show auth page if not logged in */}
                {!isLoggedIn ? (
                    <>
                        <Route path="/*" element={<Auth onAuthSuccess={handleAuthSuccess} />} />
                    </>
                ) : (
                    <>
                        <Route path="/test-api" element={<TestApi />} />
                        <Route path="/customer-test-api" element={<CustomerTestApi />} />
                        <Route path="/customer-demo" element={<CustomerDemo />} />
                        <Route path="/tshirt-designer" element={<TShirtDesignerMain />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/placement-test-api" element={<PlacementDataTestApi />} />
                        <Route path="/scale-test-api" element={<ScaleTestApi />} />
                        <Route path="/position-test-api" element={<PositionTestApi />} />
                        <Route path="/rotation-test-api" element={<RotationTestApi />} />
                        <Route path="/checkout" element={<Checkout />} />
                        {/* Default route to the t-shirt designer */}
                        <Route path="/" element={<TShirtDesignerMain />} />
                    </>
                )}
            </Routes>
        </>
    );
}

export default App;
