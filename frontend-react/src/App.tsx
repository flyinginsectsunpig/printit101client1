import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestApi from "./views/TestApi";
import CustomerTestApi from "./views/CustomerTestApi";
import Auth from "./components/Auth";
import "./styles.css";

function App() {
  const [user, setUser] = useState<any>(null);

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    console.log("User authenticated:", userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="App">
      {user ? (
        <Router>
          <header className="dashboard-header">
            <h1>
              Welcome, {user.firstName} {user.lastName}!
            </h1>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </header>

          <div className="user-info">
            <p><strong>Username:</strong> {user.userName}</p>
            <p><strong>Email:</strong> {user.contact?.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>

          <Routes>
            <Route path="/test-api" element={<TestApi />} />
            <Route path="/customer-test-api" element={<CustomerTestApi />} />
          </Routes>
        </Router>
      ) : (
        <Auth onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}

export default App;
