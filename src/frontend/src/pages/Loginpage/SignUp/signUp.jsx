import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import POST from "../../../api/POST.jsx";
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import Information from "../../../globalComponents/developersInfo/information.jsx";
import Filter from 'bad-words';

/**
 * Represents the registration page for creating a new account.
 *
 * @returns {JSX.Element} The registration page component.
 */

function RegistrationPage() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errormessage, setErrorMessage] = useState('');
    const filter = new Filter();

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
        if (username.trim() !== "" && password.trim() !== "" && !filter.isProfane(username)) {
            // Calls the API and stores the returned value in data
            const data = await POST({ name: username, password: password }, "/signup");
            // If the data is true (account doesn't exist), then navigate to main page
            if (data.success) {
                let sid = data.sid
                // sid and username are given to main page
                navigate('/MainPage', { state: { sid, username }});
            }
            // Display error
            else {
                setErrorMessage('User already exists');
            }
        }
        else if (filter.isProfane(username)) {
            setErrorMessage('Please choose a more suitable username to continue.')
        }
        else {
            setErrorMessage('Username Or Password Can Not be Empty!');
        }

    }

    return (
        <div className="login-container">
            <Information/>
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
                                handleSaveClick()
                            }
                        }}
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
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSaveClick()
                            }
                        }}
                    />
                </div>
                {/* make account button */}
                <button className="make-account-button" onClick={handleSaveClick}>Make Account</button>
            </div>
        </div>
    );
}

export default RegistrationPage;