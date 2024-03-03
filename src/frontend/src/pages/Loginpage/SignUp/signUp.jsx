import React, { useState, useEffect } from 'react';

// Code for signing up

function RegistrationPage() {

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
