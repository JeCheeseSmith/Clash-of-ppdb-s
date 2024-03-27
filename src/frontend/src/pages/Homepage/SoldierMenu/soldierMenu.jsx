import React, {useState} from 'react';
import './soldierMenu.css'
import CommunicationButton from "../Communication/communication.jsx";
import SocialOption from "../Communication/social/socialOptionContents.jsx";

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
            {soldierVisible? SoldierMenuBox(soldierVisible):null}
        </>
    );
}
export default SoldierMenuButton;

function SoldierMenuBox(soldierVisible) {
    return (
        <div className="box-container">
            <SoldierNavbar soldierVisible={soldierVisible}/>
        </div>
    )
}

function SoldierNavbar(soldierVisible) {
    const [currentPage, setCurrentPage] = useState('troopoverview');

    const handleButtonClick = (pageName) => {
      setCurrentPage(pageName);
      playOption();
    };

    return (
        <div className="navbar-container">
            {soldierVisible && (
            <nav className="navbar visible">
                <ul className="navbar-links">
                    <li>
                        <button onClick={() => handleButtonClick('troopoverview')} className={"socialOption"}>Troop Overview
                        </button>
                    </li>
                    <li>
                        <button onClick={() => handleButtonClick('traintroopoverview')} className={"socialOption"}>Troop Training
                        </button>
                    </li>
                </ul>
            </nav>
        )}
        {
            soldierVisible && currentPage &&
            (<SoldierMenuOptions pageName={currentPage}/>)
        }
        </div>
    )
}

function SoldierMenuOptions({pageName, requests, sendData}){
    return (
        <div className="page-content">
            {pageName === 'troopoverview' && <troopoverviewPage/>}
            {pageName === 'traintroop' && <traintroopPage/>}
        </div>
    )
}


function troopoverviewPage() {
    return (
        <div className="troopoverview">

        </div>
    )
}

function trooptrainPage() {
    return (
        <div className="traintroopview">

        </div>
    )
}