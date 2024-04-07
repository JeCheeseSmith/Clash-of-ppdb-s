// Importing necessary components from the specified paths
import MainPage from "./pages/Homepage/mainpage.jsx";
import LoginPage from "./pages/Loginpage/Login/login.jsx";
import SignUp from "./pages/Loginpage/SignUp/signUp.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import './App.css';
import Map from "./pages/Map/map.jsx";
/**
 * Main application component responsible for routing and rendering different pages.
 * @component
 * @example
 * // Usage:
 * <App />
 */
function App()
{
    return (
        // Wrapping the entire application with a div having a specific CSS class
        <div className="background">
            {/* BrowserRouter component to enable routing */}
            <Router>
                {/* Routes component to define different routes */}
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/SignUp" element={<SignUp />} />
                    <Route path="/MainPage" element={<MainPage />} />
                    <Route path="/Map" element={<Map />} />
                </Routes>
            </Router>
        </div>
    );
}

// Exporting the App component as default
export default App;
