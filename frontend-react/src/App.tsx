import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestApi from "./views/TestApi";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/test-api" element={<TestApi />} />
            </Routes>
        </Router>
    );
}

export default App;
