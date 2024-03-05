import React from 'react'; // Importing React library
import './login_signup.css';
import { useNavigate } from 'react-router-dom';

// Code for login page
function LoginPage() {

    let navigate = useNavigate();
    // Handles the navigation from login page to sign-up page
    function handleSignUpClick() {
        navigate('/signup');
    }

    function handleLoginClick() {
        navigate('/MainPage');
    }

  return (
      // Makes a form
      <div className="login-container">
          <h1 className="gametitle">TRAVISIA</h1>
          <h2 className="subtitle">FALLEN EMPIRE</h2>
          <form className="login-form">
              <div>
                  {/* <div> groupes the label and input together on one line */}
                  <label htmlFor="username">Username:</label>
                  {/* When you click on the Label "Username", the input box is selected */}
                  <input
                      id="username"
                      type="text"
                  />
              </div>
              <div>
                  <label htmlFor="password">Password:</label>
                  {/* When you click on the Label "Password", the input box is selected */}
                  <input
                      id="password"
                      type="password"
                  />
              </div>
              {/* Login button */}
              <button className="login-button" onClick={handleLoginClick}>Login</button>
              {/* Sign-up button */}
              <button className="signup-button" onClick={handleSignUpClick}>Sign Up</button>
          </form>
      </div>
  );
}

export default LoginPage; // Exporting the MainPage component