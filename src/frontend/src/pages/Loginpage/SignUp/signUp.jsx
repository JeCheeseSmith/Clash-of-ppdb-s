import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import POST from "../../../api/POST.jsx"; // Importing React library
import { AiOutlineExclamationCircle } from 'react-icons/ai';


// Code for signing up
function RegistrationPage() {

    // States for username, password & error
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errormessage, setErrorMessage] = useState('');

    // Handler for username change
    function handleUsernameChange(event) {
        setUsername(event.target.value);
    }

    // Handler for password change
    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    let navigate = useNavigate();

    const handleSaveClick = async () => {
        const username2 = username.trim();

        if (username2) {
            // Calls the API and stores the returned value in data
            const data = await POST({ name: username, password: password }, "/signup");
            console.log(data);
         // If the data is true (account already exists), then navigate to main page
            if (data.success) {
            localStorage.setItem('sid', data.sid); // Store the sid for the resource bar
            navigate('/MainPage', { state: { username } });
            }
          // Display error
            else {
            setErrorMessage('User already exists');
            }
        }
        else {
            setErrorMessage('Username cannot be empty');
        }

    }

    return (
        <div className="login-container">
          <h1 className="gametitle">TRAVISIA</h1>
          <h2 className="subtitle">FALLEN EMPIRE</h2>
          <div className="login-form">
              {errormessage && (
          <div className="error-message">
            <AiOutlineExclamationCircle /> {errormessage}
          </div>
        )}
            <div>
              {/* <div> groupes the label and input together on one line */}
              <label htmlFor="username">Username:</label>
              {/* When you click on the Label "Username", the input box is selected */}
              <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              {/* When you click on the Label "Password", the input box is selected*/}
              <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
              />
            </div>
            {/* Save button */}
            <button className="login-button" onClick={handleSaveClick}>Make Account</button>
          </div>
        </div>
    );
}

export default RegistrationPage; // Exporting the MainPage component