import React, {useState} from 'react';
import './account.css'
import {useLocation, useNavigate} from "react-router-dom";
import POST from "../../../api/POST.jsx";
import Settings from "./settings/settings.jsx";

/**
 * Component for managing user account.
 * @returns {JSX.Element} - The JSX for managing user account.
 */
function Account({isBackgroundAudioEnabled, setIsBackgroundAudioEnabled})
{
    const username = useLocation().state.username || {};
    let navigate = useNavigate();
    const [navbar, setNavbar] = useState(false)
    const [settings, setSettings] = useState(false)

    const handleSettingsButton = () =>
    {
        setSettings(!settings)
    }
    const handleAccountButton = () =>
    {
        setNavbar(!navbar)
    }
    const handleLogOutClick = async () =>
    {
        await POST({"name":username}, "/logout")
        navigate('/', { replace: true, state: null });
    };
    return (
        <>
            <button className={"username"} onClick={handleAccountButton}>User: {username}</button>
            <div className={navbar ? 'account-hidden account-visible' : 'account-hidden'}>
                <button className={"account-button"} onClick={handleSettingsButton}>SETTINGS</button>
                <button className={"account-button"} onClick={handleLogOutClick}>LOGOUT</button>
            </div>
            {settings && <Settings isBackgroundAudioEnabled={isBackgroundAudioEnabled}
                                   setIsBackgroundAudioEnabled={setIsBackgroundAudioEnabled}
                                   settings={settings}
                                   setSettings={setSettings}
            />}
        </>
    );
}

export default Account;