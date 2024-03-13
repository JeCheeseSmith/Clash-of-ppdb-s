import React, { useState} from 'react'; // Importing React library
import './login_signup.css';
import { useNavigate } from 'react-router-dom';
import POST from "../../../api/POST.jsx";

// Code for login page
function LoginPage() {

    // State for username & password
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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
        navigate('/signup');
    }

    // Handles the navigation from login page to mainpage
    const handleLoginClick = async () => {
        const data = await POST({name:username, password: password}, "/login");
        console.log(data);
        if (data.succes) {
            navigate('/MainPage', { state: { username } });
        }

    }

  return (
      // Makes a form
      <div className="login-container">
          <h1 className="gametitle">TRAVISIA</h1>
          <h2 className="subtitle">FALLEN EMPIRE</h2>
          <div className="login-form">
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