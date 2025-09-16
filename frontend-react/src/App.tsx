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
    const { isLoggedIn, user, logout } = useAuth();

    return (
        <>
            {/* Cart only shows after login for customers */}
            {isLoggedIn && user?.role === "CUSTOMER" && <Cart />}

            <Routes>
                {/* Login route - redirect if already logged in */}
                <Route
                    path="/login"
                    element={
                        !isLoggedIn ? (
                            <Auth onAuthSuccess={() => {}} />
                        ) : user?.role === "ADMIN" ? (
                            <Navigate to="/admin-dashboard" />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />

                {/* Protected admin route */}
                <Route
                    path="/admin-dashboard"
                    element={
                        isLoggedIn && user?.role === "ADMIN" ? (
                            <AdminDashboard onLogout={logout} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                {/* Protected customer routes */}
                <Route path="/test-api" element={<TestApi />} />
                <Route path="/customer-test-api" element={<CustomerTestApi />} />
                <Route path="/customer-demo" element={<CustomerDemo />} />
                <Route
                    path="/tshirt-designer"
                    element={
                        isLoggedIn && user?.role === "CUSTOMER" ? (
                            <TShirtDesignerMain />
                        ) : (
                            <Auth onAuthSuccess={() => {}} />
                        )
                    }
                />

                <Route path="/placement-test-api" element={<PlacementDataTestApi />} />
                <Route path="/scale-test-api" element={<ScaleTestApi />} />
                <Route path="/position-test-api" element={<PositionTestApi />} />
                <Route path="/rotation-test-api" element={<RotationTestApi />} />
                <Route
                    path="/checkout"
                    element={
                        isLoggedIn && user?.role === "CUSTOMER" ? (
                            <Checkout />
                        ) : (
                            <Auth onAuthSuccess={() => {}} />
                        )
                    }
                />

                {/* Default route */}
                <Route
                    path="/"
                    element={
                        isLoggedIn ? (
                            user?.role === "ADMIN" ? (
                                <Navigate to="/admin-dashboard" />
                            ) : (
                                <TShirtDesignerMain />
                            )
                        ) : (
                            <Auth onAuthSuccess={() => {}} />
                        )
                    }
                />
            </Routes>
        </>
    );
}

export default App;
