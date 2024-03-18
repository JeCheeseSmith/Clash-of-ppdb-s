import React from 'react';
import './account.css'
import {useLocation, useNavigate} from "react-router-dom";

function Account()
{
    let navigate = useNavigate();
    /** Navigate to the homepage */
    function handleLogOutClick() {
        navigate('/');
    }

    const username = useLocation().state.username || {};
    return (
        <button className={"username"} onClick={() => {handleLogOutClick();}}>{username}</button>
    );
}

export default Account;