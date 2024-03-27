import React, {useState, useEffect} from 'react';
import './soldierMenu.css'
import warrior from "./assets/knight.png";

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
                <div className="soldierMenuButton-icon"></div>
            </button>
            {soldierVisible ? SoldierMenuBox(soldierVisible):null}
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
        <div className="soldier-page-content">
            {pageName === 'troopOverview' && <TroopOverviewPage/>}
            {pageName === 'trainTroopOverview' && <TroopTrainPage/>}
        </div>
    )
}


function TroopOverviewPage() {
    return (
        <div className="soldier-primair-input">
            <div className="soldier-primair-input">
                <nobr className="food-icon"></nobr>
                consumption: 10
            </div>
            <div className="army-title"> Army</div>
            <div className="soldier-primair-input">
                {/* Each soldier has a symbol and a count */}
                <div className="soldierSection">
                    <img src={warrior} alt="Armored footman" className="soldier-icon"/>
                    <div className="soldierCount">1</div>
                </div>
                <div className="soldierSection">
                    <img src={warrior} alt="Huskarl" className="soldier-icon"/>
                    <span className="soldierCount">0</span>
                </div>
                <div className="soldierSection">
                    <img src={warrior} alt="Order Knights" className="soldier-icon"/>
                    <span className="soldierCount">2</span>
                </div>
            </div>
        </div>
    )
}

function TroopTrainPage() {
    return (
        <div className="soldier-primair-input">
            <div className="army-title"> Training Queue</div>
        </div>
    )
}