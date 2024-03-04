import React, { useState, useEffect } from 'react';

// Code for signing up

function RegistrationPage() {

    const [name, setName] = useState('Kars');
    const [password, setPassword] = useState('hallo');

    const dataToSend = { username: name, password: password };

    fetch('http://127.0.0.1:5000/test2', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    });

    return (
        // Make a form
        <div className="login-container">
            <h1 className="gametitle">TRAVISIA</h1>
            <h2 className="subtitle">FALLEN EMPIRE</h2>
            <form className="login-form">
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                    />
                </div>
                <button className="save-button"> Save</button>
            </form>
        </div>
    );
}

export default RegistrationPage; // Exporting the MainPage component
