import React from 'react';
import './loginMainPage.css'
import LoginPage from "./Login/login.jsx";
import SignUp from "./SignUp/signUp.jsx"; // Importing React library

/**
 * Functional component representing the main page of the application.
 * Displays a full-bleed background image.
 */
function LoginMainPage() {
  return (
    <div className="background"> {/* Container for the background image */}
        <LoginPage/>
    </div>
  );
}

export default LoginMainPage; // Exporting the MainPage component
