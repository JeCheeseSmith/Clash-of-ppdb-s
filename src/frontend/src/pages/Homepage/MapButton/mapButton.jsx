import React from 'react';
import './mapButton.css'
import {useLocation, useNavigate} from "react-router-dom";

/**
 * Represents a button component for navigating to the map.
 * @returns {JSX.Element} MapButton component.
 */
function MapButton()
{
    const {sid, username} = useLocation().state
    let navigate = useNavigate();
    const handleMapButton = () =>
    {
        navigate('/Map', { state: { sid, username}});
    };
    return (
        <button className={"map-button"} onClick={handleMapButton}>Map</button>
    );
}

export default MapButton;