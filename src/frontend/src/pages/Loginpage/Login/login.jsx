import React, { useState} from 'react'; // Importing React library
import './login_signup.css';
import { useNavigate } from 'react-router-dom';
import POST from "../../../api/POST.jsx";
import { AiOutlineExclamationCircle } from 'react-icons/ai';


// Code for login page
function LoginPage() {

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

    // Handles the navigation from login page to sign-up page
    function handleSignUpClick() {
        navigate('/Signup');
    }

    // Handles the navigation from login page to mainpage
    const handleLoginClick = async () => {

        if (username) {
            // Calls the 'login' API and stores the returned value in data
            const data = await POST({ name: username, password: password }, "/login");
            // When the admin is logging in, navigate to admin-page
            if (username === "admin" && password === "1234") {
                navigate('/AdminPage');
            }
            else {
                // If the data is true (account exists), then navigate to main page.
                if (data.success) {
                    let sid = data.sid
                    // sid and username are given to main page
                    navigate('/MainPage', { state: { sid, username }});
                }
                // Display error
                else {
                    setErrorMessage('Wrong login credentials');
                }
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
                  {/* When you click on the Label "Password", the input box is selected */}
                  <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={handlePasswordChange}
                  />
              </div>
              {/* Login button */}
              <button className="login-button" onClick={handleLoginClick}>Login</button>
              {/* Sign-up button */}
              <button className="signup-button" onClick={handleSignUpClick}>Sign Up</button>
          </div>
      </div>
  );
}

export default LoginPage; // Exporting the MainPage component