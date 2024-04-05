import React, {useState, useEffect} from 'react';
import './soldierMenu.css'
import heavyInfantry3 from "./assets/templar.png";
import heavyInfantry2 from "./assets/knight.png";
import heavyInfantry1 from "./assets/swordman.png"
import horseman1 from "./assets/Horseman.png"
import horseman2 from "./assets/Knight.png"
import horseman3 from "./assets/War elephant.png"
import bowman1 from "./assets/bowman.png"
import bowman2 from "./assets/Longbowman.png"
import bowman3 from "./assets/Crossbowman.png"
import ambush1 from "./assets/bandit.png"
import ambush2 from "./assets/militia.png"
import ambush3 from "./assets/assassin.png"
import spear1 from "./assets/guardian.png"
import spear2 from "./assets/Pikeman.png"
import spear3 from "./assets/Halbardier.png"

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
    const handleTroopTrain = (troop) => {
        console.log(troop)
    };
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
                    <button className="button"><img src={heavyInfantry1} alt="Armored footman" className="soldier-icon" onClick={() => handleTroopTrain('hi1')}/> </button>
                        <div className="soldierCount">1</div>
                    <button className="button"><img src={heavyInfantry2} alt="Huskarl" className="soldier-icon" onClick={() => handleTroopTrain('hi2')}/> </button>
                        <div className="soldierCount">1</div>
                    <button className="button"><img src={heavyInfantry3} alt="Order Knights" className="soldier-icon" onClick={() => handleTroopTrain('hi3')}/> </button>
                        <div className="soldierCount">1</div>
                </div>
                <div className="soldierSection">
                    <button className="button"><img src={spear1} alt="Guardsman" className="soldier-icon" onClick={() => handleTroopTrain('s1')}/> </button>
                        <div className="soldierCount">0</div>
                    <button className="button"><img src={spear2} alt="Pike man" className="soldier-icon" onClick={() => handleTroopTrain('s2')}/> </button>
                        <div className="soldierCount">0</div>
                    <button className="button"><img src={spear3} alt="Halbardier" className="soldier-icon" onClick={() => handleTroopTrain('s3')}/> </button>
                        <div className="soldierCount">0</div>
                </div>
                <div className="soldierSection">
                    <button className="button"><img src={horseman1} alt="Horseman" className="soldier-icon" onClick={() => handleTroopTrain('h1')}/> </button>
                        <div className="soldierCount">0</div>
                    <button className="button"><img src={horseman2} alt="Knight" className="soldier-icon" onClick={() => handleTroopTrain('h2')}/> </button>
                        <div className="soldierCount">0</div>
                    <button className="button"><img src={horseman3} alt="War elephant" className="soldier-icon" onClick={() => handleTroopTrain('h3')}/> </button>
                        <div className="soldierCount">0</div>
                </div>
                <div className="soldierSection">
                    <button className="button"><img src={bowman1} alt="Bowman" className="soldier-icon" onClick={() => handleTroopTrain('b1')}/> </button>
                        <div className="soldierCount">0</div>
                    <button className="button"><img src={bowman2} alt="Longbowman" className="soldier-icon" onClick={() => handleTroopTrain('b2')}/> </button>
                        <div className="soldierCount">0</div>
                    <button className="button"><img src={bowman3} alt="Crossbowman" className="soldier-icon" onClick={() => handleTroopTrain('b3')}/> </button>
                        <div className="soldierCount">0</div>
                </div>
                <div className="soldierSection">
                    <button className="button"><img src={ambush1} alt="Bandit" className="soldier-icon" onClick={() => handleTroopTrain('a1')}/> </button>
                        <div className="soldierCount">0</div>
                    <button className="button"><img src={ambush2} alt="Militia" className="soldier-icon" onClick={() => handleTroopTrain('a2')}/> </button>
                        <div className="soldierCount">0</div>
                    <button className="button"><img src={ambush3} alt="Skirmishers" className="soldier-icon" onClick={() => handleTroopTrain('a3')}/> </button>
                        <div className="soldierCount">0</div>
                </div>
            </div>
        </div>

    )
}

function TroopTrainPage() {
    return (
        <div className="soldier-primair-input">
            <div className="army-title"> Training Queue</div>
            <div className="trainingQueue"></div>
        </div>
    )
}