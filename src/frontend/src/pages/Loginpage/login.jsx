import React from 'react'; // Importing React library
import './login.css';
import swordImage from './sword2.png'

// Code for login page
function LoginPage() {

  return (
      // Makes a form<!-- Voeg dit toe in de <head> van je HTML-bestand -->
      <div className="login-container">
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
                  <label htmlFor="password">Password:</label>
                  {/* When you click on the Label "Password", the input box is selected*/}
                  <input
                      id="password"
                      name="username"
                      type="password"
                  />
              </div>
              <button type="submit">Login</button>
              <p className="signup">Don't have an account yet? <a href="./signUp.jsx">Sign up</a></p>
          </form>
          <img src={swordImage} alt="Sword" className="sword-image"/>
      </div>
  );
}

export default LoginPage; // Exporting the MainPage component