import React from 'react';
import './mapButton.css'
import {useLocation, useNavigate} from "react-router-dom";
function MapButton({timers,updateTimers})
{
    const {sid, username} = useLocation().state
    let navigate = useNavigate();
    const handleMapButton = async () =>
    {
        updateTimers()
        navigate('/Map', { state: { sid, username, timers}});
    };
    return (
        <button className={"map-button"} onClick={() => {handleMapButton();}}>Open Map</button>
    );
}

export default MapButton;