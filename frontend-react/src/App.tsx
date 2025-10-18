import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TestApi from "./views/TestApi";
import CustomerTestApi from "./views/CustomerTestApi";
import CustomerDemo from "./components/CustomerDemo";
import TShirtDesignerMain from "./components/TShirtDesignerMain";
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
        console.log('App: handleAuthSuccess called with user:', user);
    };

    console.log('Layout render - isLoggedIn:', isLoggedIn, 'user:', user);

    // Show loading if we're logged in but user data hasn't loaded yet
    if (isLoggedIn && !user) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '1.5rem'
            }}>
                Loading...
            </div>
        );
    }

    return (
        <>
            {/* Cart only shows after login for customers */}
            {isLoggedIn && user?.role === "CUSTOMER" && <Cart />}

            <Routes>
                {!isLoggedIn ? (
                    /* Show auth page for all routes when not logged in */
                    <Route path="*" element={<Auth onAuthSuccess={handleAuthSuccess} />} />
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
                        {/* Default route - redirect to designer */}
                        <Route path="/" element={<Navigate to="/tshirt-designer" replace />} />
                        <Route path="*" element={<Navigate to="/tshirt-designer" replace />} />
                    </>
                )}
            </Routes>
        </>
    );
}

export default App;