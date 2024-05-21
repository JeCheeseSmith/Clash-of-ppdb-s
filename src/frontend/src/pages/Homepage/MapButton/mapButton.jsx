import React from 'react';
import './mapButton.css'
import {useLocation, useNavigate} from "react-router-dom";
import map from '../../../assets/mapLogo.png'

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
        <button onClick={() => {handleMapButton()}} className={"map-button"}>
            <div className={"map-button-name"}>Map</div>
            <img src={map} className="map-button-icon"/>
        </button>
    );
}

export default MapButton;