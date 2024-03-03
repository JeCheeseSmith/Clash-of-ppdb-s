import React, { useState } from 'react';
import './login_signup.css';

function LoginPage() {


  return (
    <div className="login-container">
      <h1 className="gametitle">TRAVISIA</h1>
      <h2 className="subtitle">FALLEN EMPIRE</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            name="username"
            type="text"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            id="password"
            name="password"
            type="password"
          />
        </div>
        <button className="login-button" type="submit">Login</button>
        <button className="signup-button"> Sign Up</button>
      </form>
    </div>
  );
}

export default LoginPage;
