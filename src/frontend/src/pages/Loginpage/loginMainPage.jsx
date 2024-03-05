import React from 'react';
import './loginMainPage.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from "../Loginpage/Login/login.jsx";
import RegistrationPage from "../Loginpage/SignUp/signUp.jsx";


/**
 * Functional component representing the main page of the application.
 * Displays a full-bleed background image.
 */
function LoginMainPage() {
  return (
     <div className="background">
     <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<RegistrationPage />} />
      </Routes>
    </Router>
     </div>
  );
}

export default LoginMainPage; // Exporting the MainPage component
