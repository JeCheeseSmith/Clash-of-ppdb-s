import React, {useState} from 'react';
import './soldierMenu.css'
import CommunicationButton from "../Communication/communication.jsx";

/**
 * React component for the troop screen button
 */
function SoldierMenuButton(props) {
    const [soldierVisible, setsoldierVisible] = useState(false);
    return (
        <>
            <button onClick={() => {
                setsoldierVisible(!soldierVisible);
            }} className={"trainMenu"}>Troop Menu
            </button>
        </>
    );
}
export default SoldierMenuButton;

function SoldierMenuBox({soldierVisible}) {
    return(
        <div className="SoldierMenubox">
        </div>
    )
}