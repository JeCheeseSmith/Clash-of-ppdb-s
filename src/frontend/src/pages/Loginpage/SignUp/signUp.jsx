import React from 'react'; // Importing React library

// Code for signing up
function RegistrationPage() {

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
                  type="text"
              />
            </div>
            {/* Save button */}
            <button className="login-button"> Save</button>
          </form>
        </div>
    );
}

export default RegistrationPage; // Exporting the MainPage component