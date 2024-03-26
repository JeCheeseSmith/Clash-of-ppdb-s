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
            {soldierVisible? SoldierMenuBox():null}
        </>
    );
}
export default SoldierMenuButton;

function SoldierMenuBox() {
    return(
        <div className="SoldierMenubox">
        </div>
    )
}