import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestApi from "./views/TestApi";
import CustomerTestApi from "./views/CustomerTestApi";
import CustomerDemo from "./components/CustomerDemo";
import TShirtDesignerMain from "./components/TShirtDesignerMain"; // Updated import
import ScaleTestApi from "./views/ScaleTestApi";
import PositionTestApi from "./views/PositionTestApi";
import RotationTestApi from "./views/RotationTestApi";
import PlacementDataTestApi from "./views/PlacementDataTestApi";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/test-api" element={<TestApi />} />
                <Route path="/customer-test-api" element={<CustomerTestApi />} />
                <Route path="/customer-demo" element={<CustomerDemo />} />
                <Route path="/tshirt-designer" element={<TShirtDesignerMain />} /> {/* Updated component */}
                <Route path="/placement-test-api" element={<PlacementDataTestApi />} />
                <Route path="/scale-test-api" element={<ScaleTestApi />} />
                <Route path="/position-test-api" element={<PositionTestApi />} />
                <Route path="/rotation-test-api" element={<RotationTestApi />} />
                {/* Add a default route to the t-shirt designer */}
                <Route path="/" element={<TShirtDesignerMain />} />
            </Routes>
        </Router>
    );
}

export default App;