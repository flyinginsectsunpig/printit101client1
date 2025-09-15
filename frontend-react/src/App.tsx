import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import TestApi from './views/TestApi';
import CustomerTestApi from './views/CustomerTestApi';
import CustomerDemo from './components/CustomerDemo';
import TShirtDesigner from './components/TShirtDesigner';
import ScaleTestApi from './views/ScaleTestApi';
import PositionTestApi from './views/PositionTestApi';
import RotationTestApi from './views/RotationTestApi';
import PlacementDataTestApi from './views/PlacementDataTestApi';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import Profile from './components/Profile';
import Auth from './components/Auth';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected route component to redirect to /login if not logged in
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isLoggedIn } = useAuth();
    return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
};

// Main layout with cart and routes
function MainLayout() {
    const { isLoggedIn, login } = useAuth(); // Move useAuth to top level
    const navigate = useNavigate();

    // Handle successful auth and redirect to /tshirt-designer
    const handleAuthSuccess = (userData: any) => {
        login(userData); // Use login from top-level useAuth
        navigate('/tshirt-designer');
    };

    return (
        <>
            {isLoggedIn && <Cart />}
            <Routes>
                <Route path="/login" element={<Auth onAuthSuccess={handleAuthSuccess} />} />
                <Route path="/test-api" element={<TestApi />} />
                <Route path="/customer-test-api" element={<CustomerTestApi />} />
                <Route path="/customer-demo" element={<CustomerDemo />} />
                <Route path="/tshirt-designer" element={<TShirtDesigner />} />
                <Route path="/" element={<TShirtDesigner />} />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                <Route path="/placement-test-api" element={<PlacementDataTestApi />} />
                <Route path="/scale-test-api" element={<ScaleTestApi />} />
                <Route path="/position-test-api" element={<PositionTestApi />} />
                <Route path="/rotation-test-api" element={<RotationTestApi />} />
                <Route
                    path="/checkout"
                    element={
                        <ProtectedRoute>
                            <Checkout />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<div>404 - Page Not Found</div>} />
            </Routes>
        </>
    );
}

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                    <MainLayout />
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;