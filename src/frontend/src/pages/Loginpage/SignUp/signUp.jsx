import React from 'react';
import {useNavigate} from "react-router-dom"; // Importing React library

// Code for signing up
function RegistrationPage() {

    let navigate = useNavigate();
    // Handles the navigation from login page to sign-up page
    function handleSaveClick() {
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
              {/* When you click on the Label "Password", the input box is selected*/}
              <input
                  id="password"
                  type="password"
              />
            </div>
            {/* Save button */}
            <button className="login-button" onClick={handleSaveClick}>Make Account</button>
          </form>
        </div>
    );
}

export default RegistrationPage; // Exporting the MainPage component