import React from 'react'; // Importing React library
import './login_signup.css';

// Code for login page
function LoginPage() {

  return (
      // Makes a form<!-- Voeg dit toe in de <head> van je HTML-bestand -->
      <div className="login-container">
          <h1 className="gametitle">TRAVISIA</h1>
          <h2 className="subtitle">FALLEN EMPIRE</h2>
          <form className="login-form">
              <div>
                  {/* <div> groupes the label and input together on one line*/}
                  <label htmlFor="username">Username:</label>
                  {/* When you click on the Label "Username", the input box is selected*/}
                  <input
                      id="username"
                      name="username"
                      type="text"
                  />
              </div>
              <div>
                  <label >Password:</label>
                  {/* When you click on the Label "Password", the input box is selected*/}
                  <input
                      id="password"
                      name="username"
                      type="password"
                  />
              </div>
              <button className="login-button">Login</button>
              <button className="signup-button"> Sign Up</button>
          </form>
      </div>
  );
}

export default LoginPage; // Exporting the MainPage component