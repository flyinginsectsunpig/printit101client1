// import React, { useState } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import TestApi from "./views/TestApi";
// import CustomerTestApi from "./views/CustomerTestApi";
// import Homepage from "./views/Homepage";
// import Auth from "./components/Auth";
// import "./styles.css";
//
// function App() {
//   const [user, setUser] = useState<any>(null);
//
//   const handleAuthSuccess = (userData: any) => {
//     setUser(userData);
//     console.log("User authenticated:", userData);
//   };
//
//   const handleLogout = () => {
//     setUser(null);
//   };
//
//   return (
//     <div className="App">
//       {user ? (
//         <Router>
//           <header className="dashboard-header">
//             <h1>
//               Welcome, {user.firstName} {user.lastName}!
//             </h1>
//             <button onClick={handleLogout} className="logout-button">
//               Logout
//             </button>
//           </header>
//
//           <div className="user-info">
//             <p><strong>Username:</strong> {user.userName}</p>
//             <p><strong>Email:</strong> {user.contact?.email}</p>
//             <p><strong>Role:</strong> {user.role}</p>
//           </div>
//
//           <Routes>
//             <Route path="/test-api" element={<TestApi />} />
//             <Route path="/customer-test-api" element={<CustomerTestApi />} />
//             <Route path="/tshirt-designer" element={<Homepage />} />
//           </Routes>
//         </Router>
//       ) : (
//         <Auth onAuthSuccess={handleAuthSuccess} />
//       )}
//     </div>
//   );
// }
//
// export default App;


import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import TestApi from "./views/TestApi";
import CustomerTestApi from "./views/CustomerTestApi";
import Homepage from "./views/Homepage";
import Auth from "./components/Auth";
import "./styles.css";

// Component to conditionally render header based on route
function AppContent({ user, handleLogout }: { user: any, handleLogout: () => void }) {
    const location = useLocation();
    const isDesignerRoute = location.pathname === "/" || location.pathname === "/tshirt-designer";

    return (
        <div className="App">
            {/* Only show header and user info if NOT on designer routes */}
            {!isDesignerRoute && (
                <>
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
                </>
            )}

            <Routes>
                <Route path="/test-api" element={<TestApi />} />
                <Route path="/customer-test-api" element={<CustomerTestApi />} />
                <Route path="/tshirt-designer" element={<Homepage />} />
                <Route path="/" element={<Homepage />} />
            </Routes>
        </div>
    );
}

function App() {
    // For development, set a mock user to bypass authentication
    const [user, setUser] = useState<any>({
        firstName: "Developer",
        lastName: "User",
        userName: "devuser",
        contact: { email: "dev@example.com" },
        role: "developer"
    });

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
                    <AppContent user={user} handleLogout={handleLogout} />
                </Router>
            ) : (
                <Auth onAuthSuccess={handleAuthSuccess} />
            )}
        </div>
    );
}

export default App;

