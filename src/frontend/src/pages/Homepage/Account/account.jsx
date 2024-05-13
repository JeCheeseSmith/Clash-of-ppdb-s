import React from 'react';
import './account.css'
import {useLocation, useNavigate} from "react-router-dom";
import POST from "../../../api/POST.jsx";

/**
 * Component for managing user account.
 * @returns {JSX.Element} - The JSX for managing user account.
 */
function Account()
{
    const username = useLocation().state.username || {};
    let navigate = useNavigate();
    /** Navigate to the login page */

    const handleLogOutClick = async () =>
    {
        await POST({"name":username}, "/logout")
        navigate('/', { replace: true, state: null });
    };
    return (
        <button className={"username"} onClick={() => {handleLogOutClick()}}>{username}</button>
    );
}

export default Account;