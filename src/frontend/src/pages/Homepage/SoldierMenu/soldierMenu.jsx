import React, {useState, useEffect} from 'react';
import './soldierMenu.css'
import heavyInfantry3 from "./assets/templar.png";
import heavyInfantry2 from "./assets/knight.png";
import heavyInfantry1 from "./assets/swordman.png"
import horseman1 from "./assets/Horseman.png"
import horseman2 from "./assets/HorseKnight.png"
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
import * as API from "../../../api/EndPoints/EndPoints.jsx"
import {useLocation} from "react-router-dom";
import {empty} from "leaflet/src/dom/DomUtil.js";

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
    const { sid, username } = useLocation().state;
    // default value for soldier counts
    const [soldiers, setSoldierCount] = useState({
        heavyInfantry1: 1,
        heavyInfantry2: 1,
        heavyInfantry3: 1,
        spear1: 0,
        spear2: 0,
        spear3: 0,
        horseman1: 0,
        horseman2: 0,
        horseman3: 0,
        bowman1: 0,
        bowman2: 0,
        bowman3: 0,
        ambush1: 0,
        ambush2: 0,
        ambush3: 0
    });
    const [soldiersAvailable, setSoldierAvailable] = useState({
        heavyInfantry1: false,
        heavyInfantry2: false,
        heavyInfantry3: false,
        spear1: false,
        spear2: false,
        spear3: false,
        horseman1: false,
        horseman2: false,
        horseman3: false,
        bowman1: false,
        bowman2: false,
        bowman3: false,
        ambush1: false,
        ambush2: false,
        ambush3: false
    });

    function APIcalls(sid){
    API.get_unlockedTroops(sid).then(data => setSoldierAvailable(
        {
            heavyInfantry1: data.ArmoredFootman,
            heavyInfantry2: data.Huskarl,
            heavyInfantry3: data.OrderKnight,
            spear1: data.Guardsman,
            spear2: data.Pikeman,
            spear3: data.Halbardier,
            horseman1: data.Horseman,
            horseman2: data.Knight,
            horseman3: data.WarElephant,
            bowman1: data.Bowman,
            bowman2: data.LongbowMan,
            bowman3: data.CrossbowMan,
            ambush1: data.Bandit,
            ambush2: data.Militia,
            ambush3: data.Skirmisher
        }))
        API.get_getTroops(sid).then(data => setSoldierCount(
            {
            heavyInfantry1: data.ArmoredFootman,
            heavyInfantry2: data.Huskarl,
            heavyInfantry3: data.OrderKnight,
            spear1: data.Guardsman,
            spear2: data.Pikeman,
            spear3: data.Halbardier,
            horseman1: data.Horseman,
            horseman2: data.Knight,
            horseman3: data.WarElephant,
            bowman1: data.Bowman,
            bowman2: data.LongbowMan,
            bowman3: data.CrossbowMan,
            ambush1: data.Bandit,
            ambush2: data.Militia,
            ambush3: data.Skirmisher
        }))

}
    // Function that gets the availability of every soldier and sends a request for the soldier counts by calling the API
    useEffect(() =>
    {
        APIcalls(sid);
        const intervalId = setInterval(() =>
        {
            APIcalls(sid)
        }, 5 * 60 * 1000); // 15 minutes in milliseconds
        return () => clearInterval(intervalId);
    }, []);

    // Function that sends a request for a soldier to be trained
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
                    {soldiersAvailable.heavyInfantry1 ?
                        <button className="button"><img src={heavyInfantry1} alt="Armored footman" className="soldier-icon" onClick={() => handleTroopTrain(1)}/></button>
                        : <button className="button"><div id="wrapper"><img src={heavyInfantry1} alt="Armored footman" className="soldier-icon"/></div></button>}
                        <p className="soldierCount">{soldiers.heavyInfantry1}</p>
                    {soldiersAvailable.heavyInfantry2 ?
                        <button className="button"><img src={heavyInfantry2} alt="Huskarl" className="soldier-icon" onClick={() => handleTroopTrain(2)}/></button>
                        : <button className="button"><div id="wrapper"><img src={heavyInfantry2} alt="Huskarl" className="soldier-icon"/></div></button>}
                        <p className="soldierCount">{soldiers.heavyInfantry2}</p>
                    {soldiersAvailable.heavyInfantry3 ?
                    <button className="button"><img src={heavyInfantry3} alt="Order Knights" className="soldier-icon" onClick={() => handleTroopTrain(3)}/> </button>
                        : <button className="button"><div id="wrapper"><img src={heavyInfantry3} alt="Order Knights" className="soldier-icon"/></div></button>}
                        <p className="soldierCount">{soldiers.heavyInfantry3}</p>
                </div>
                <div className="soldierSection">
                    {soldiersAvailable.spear1 ?
                    <button className="button"><img src={spear1} alt="Guardsman" className="soldier-icon" onClick={() => handleTroopTrain(4)}/> </button>
                        : <button className="button"><div id="wrapper"><img src={spear1} alt="Guardsman" className="soldier-icon"/></div></button>}
                        <p className="soldierCount">{soldiers.spear1}</p>
                    {soldiersAvailable.spear2 ?
                    <button className="button"><img src={spear2} alt="Pike man" className="soldier-icon" onClick={() => handleTroopTrain(5)}/> </button>
                        : <button className="button"><div id="wrapper"><img src={spear2} alt="Pike man" className="soldier-icon"/></div></button>}
                        <p className="soldierCount">{soldiers.spear2}</p>
                    {soldiersAvailable.spear3 ?
                    <button className="button"><img src={spear3} alt="Halbardier" className="soldier-icon" onClick={() => handleTroopTrain(6)}/> </button>
                        : <button className="button"><div id="wrapper"><img src={spear3} alt="Halbardier" className="soldier-icon"/></div></button>}
                        <p className="soldierCount">{soldiers.spear3}</p>
                </div>
                <div className="soldierSection">
                    {soldiersAvailable.horseman1 ?
                    <button className="button"><img src={horseman1} alt="Horseman" className="soldier-icon" onClick={() => handleTroopTrain(7)}/> </button>
                        : <button className="button"><div id="wrapper"><img src={horseman1} alt="Horseman" className="soldier-icon"/></div></button>}
                        <p className="soldierCount">{soldiers.horseman1}</p>
                    {soldiersAvailable.horseman2 ?
                    <button className="button"><img src={horseman2} alt="Knight" className="soldier-icon" onClick={() => handleTroopTrain(8)}/> </button>
                        : <button className="button"><div id="wrapper"><img src={horseman2} alt="Knight" className="soldier-icon"/></div></button>}
                        <p className="soldierCount">{soldiers.horseman2}</p>
                    {soldiersAvailable.horseman3 ?
                    <button className="button"><img src={horseman3} alt="War elephant" className="soldier-icon" onClick={() => handleTroopTrain(9)}/> </button>
                        : <button className="button"><div id="wrapper"><img src={horseman3} alt="War elephant" className="soldier-icon"/></div></button>}
                        <p className="soldierCount">{soldiers.horseman3}</p>
                </div>
                <div className="soldierSection">
                    {soldiersAvailable.bowman1 ?
                    <button className="button"><img src={bowman1} alt="Bowman" className="soldier-icon" onClick={() => handleTroopTrain(10)}/> </button>
                    : <button className="button"><div id="wrapper"><img src={bowman1} alt="Bowman" className="soldier-icon"/></div></button>}
                        <p className="soldierCount">{soldiers.bowman1}</p>
                    {soldiersAvailable.bowman2 ?
                    <button className="button"><img src={bowman2} alt="Longbowman" className="soldier-icon" onClick={() => handleTroopTrain(11)}/> </button>
                        : <button className="button"><div id="wrapper"><img src={bowman2} alt="Longbowman" className="soldier-icon"/></div></button>}
                        <p className="soldierCount">{soldiers.bowman2}</p>
                    {soldiersAvailable.bowman3 ?
                    <button className="button"><img src={bowman3} alt="Crossbowman" className="soldier-icon" onClick={() => handleTroopTrain(12)}/> </button>
                        : <button className="button"><div id="wrapper"><img src={bowman3} alt="Crossbowman" className="soldier-icon"/></div></button>}
                        <p className="soldierCount">{soldiers.bowman3}</p>
                </div>
                <div className="soldierSection">
                    {soldiersAvailable.ambush1 ?
                    <button className="button"><img src={ambush1} alt="Bandit" className="soldier-icon" onClick={() => handleTroopTrain(13)}/> </button>
                        : <button className="button"><div id="wrapper"><img src={ambush1} alt="Bandit" className="soldier-icon"/></div></button>}
                        <p className="soldierCount">{soldiers.ambush1}</p>
                    {soldiersAvailable.ambush2 ?
                    <button className="button"><img src={ambush2} alt="Militia" className="soldier-icon" onClick={() => handleTroopTrain(14)}/> </button>
                        : <button className="button"><div id="wrapper"><img src={ambush2} alt="Militia" className="soldier-icon"/></div></button> }
                        <p className="soldierCount">{soldiers.ambush2}</p>
                    {soldiersAvailable.ambush3 ?
                    <button className="button"><img src={ambush3} alt="Skirmishers" className="soldier-icon" onClick={() => handleTroopTrain(15)}/> </button>
                        : <button className="button"><div id="wrapper"><img src={ambush3} alt="Skirmishers" className="soldier-icon"/></div></button> }
                        <p className="soldierCount">{soldiers.ambush3}</p>
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
