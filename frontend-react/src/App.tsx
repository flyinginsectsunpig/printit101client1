import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestApi from "./views/TestApi";
import CustomerTestApi from "./views/CustomerTestApi"; // <-- import your new file
import CustomerDemo from "./components/CustomerDemo";
import TShirtDesigner from "./components/TShirtDesigner";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/test-api" element={<TestApi />} />
                <Route path="/customer-test-api" element={<CustomerTestApi />} />
                <Route path="/customer-demo" element={<CustomerDemo />} />
                <Route path="/tshirt-designer" element={<TShirtDesigner />} /> {/* 👈 new route */}
                {/* <-- new route */}
            </Routes>
        </Router>
    );
}

export default App;