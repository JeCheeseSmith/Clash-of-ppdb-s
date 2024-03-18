import React from 'react';
import './account.css'
import {useLocation} from "react-router-dom";

function Account()
{
    const username = useLocation().state.username || {};
    return (
        <button className={"username"}>
            {username}
        </button>
    );
}

export default Account;