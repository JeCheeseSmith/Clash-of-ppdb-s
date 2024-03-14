import React from 'react'; // Importing React library
import './logout.css'
import {useNavigate} from "react-router-dom";


// Code for log out button
function LogOut() {



    let navigate = useNavigate();
    // Handles the navigation from login page to sign-up page
    function handleLogOutClick() {
        navigate('/signup');
    }

    return (
        // Resource-bar section
        <div className="logout">
            {/* Logout button */}
              <button onClick={() => {handleLogOutClick(); console.log("hit")} }>Log out</button>
        </div>
    )
}

export default LogOut;