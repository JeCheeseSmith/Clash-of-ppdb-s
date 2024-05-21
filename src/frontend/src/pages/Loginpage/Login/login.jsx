import React, { useState} from 'react'; // Importing React library
import './login_signup.css';
import { useNavigate } from 'react-router-dom';
import POST from "../../../api/POST.jsx";
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import {isMobile, isTablet, isDesktop} from 'react-device-detect';
import {Loader} from "@react-three/drei";
import {loaderStyles} from "../../../globalComponents/loadingScreen/loadingScreen.jsx";
import Information from "../../../globalComponents/developersInfo/information.jsx";


/**
 * Represents the login page of the application.
 *
 * @returns {JSX.Element} The login page component.
 */

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
                const signUp = false
                // sid and username are given to main page
                navigate('/MainPage', { state: { sid, username, signUp}});
            }
            // Display error
            else {
                setErrorMessage('Wrong login credentials');
            }
        }
    }

  return (
      <>
          {!isMobile && !isTablet && isDesktop ?
              <div className="login-container">
                  <Information/>
                  {/* no mobile and tablet, isDesktop = {windows, ubuntu, mac, ...} */}
                  <Loader {...loaderStyles} />
                  <h1 className="gametitle">TRAVISIA</h1>
                  <h2 className="subtitle">FALLEN EMPIRE</h2>
                  <div className="login-form">
                      {errormessage && (
                          <div className="error-message">
                              <AiOutlineExclamationCircle/> {errormessage}
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
                              onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                      handleLoginClick()
                                  }
                              }}
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
                              onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                      handleLoginClick()
                                  }
                              }}
                          />
                      </div>
                      {/* Login button */}
                      <button className="login-button" onClick={handleLoginClick}>Login</button>
                      {/* Sign-up button */}
                      <button className="signup-button" onClick={handleSignUpClick}>Sign Up</button>
                  </div>
              </div>
              : // else
              <div>
                  <Loader {...loaderStyles} />
                  {/* smaller text for smaller device resolution */}
                  <h1 className="gametitle-wrong-device">TRAVISIA</h1>
                  <h2 className="subtitle-wrong-device">FALLEN EMPIRE</h2>
                  <br/>
                  <br/>
                  <br/>
                  <h3 className="wrong-device">Your Device Is Not Compatible For This Game!</h3>
              </div>
          }
      </>
  );
}

export default LoginPage; // Exporting the MainPage component