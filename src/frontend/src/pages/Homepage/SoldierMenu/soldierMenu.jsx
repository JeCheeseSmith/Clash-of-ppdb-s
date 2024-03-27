import React, {useState} from 'react';
import './soldierMenu.css'
import CommunicationButton from "../Communication/communication.jsx";
import SocialOption from "../Communication/social/socialOptionContents.jsx";
import {useLocation} from "react-router-dom";
import POST from "../../../api/POST.jsx";
import DisplayAvatarName from "../../../globalComponents/avatarWithName/avatarWithName.jsx";

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
    const [currentPage, setCurrentPage] = useState('troopOverview');

    const handleButtonClick = (pageName) => {
      setCurrentPage(pageName);
      //playOption();

    };

    return (
        <div className="navbar-container">
            {soldierVisible && (
            <nav className="navbar visible">
                <ul className="navbar-links">
                    <li>
                        <button onClick={() => handleButtonClick('troopOverview')} className={"soldierMenuOption"}>Troop Overview
                        </button>
                    </li>
                    <li>
                        <button onClick={() => handleButtonClick('trainTroopOverview')} className={"soldierMenuOption"}>Troop Training
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
            {pageName === 'troopOverview' && <TroopOverviewPage/>}
            {pageName === 'trainTroopOverview' && <TroopTrainPage/>}
        </div>
    )
}


function TroopOverviewPage() {
    return (
        <div className="soldier-primair-input">
            test
        </div>
    )
}

function TroopTrainPage() {
    return (
        <div className="soldier-primair-input">
            test 2
        </div>
    )
}