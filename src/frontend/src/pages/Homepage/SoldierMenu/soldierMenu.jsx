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
import RequestMassagePopUp from "../../../globalComponents/popupMessage/popup.jsx";

/**
 * React component for the troop screen button
 */

function SoldierMenuButton(getTimer) {
    const [soldierVisible, setsoldierVisible] = useState(false);
    return (
        <>
            <button onClick={() => {
                setsoldierVisible(!soldierVisible);
            }} className={"trainMenu"}>Troop Menu
                <div className="soldierMenuButton-icon"></div>
            </button>
            {soldierVisible ? SoldierMenuBox(soldierVisible, getTimer):null}
        </>
    );
}
export default SoldierMenuButton;

function SoldierMenuBox(soldierVisible, timer) {
    return (
        <div className="box-container">
            <SoldierNavbar soldierVisible={soldierVisible} timer={timer}/>
        </div>
    )
}

function SoldierNavbar(soldierVisible, timer) {
    const [currentPage, setCurrentPage] = useState('troopOverview');
    const [TroopAmount, setTroopAmount] = useState(1);

    const handleButtonClick = (pageName) => {
      setCurrentPage(pageName);
    };

    const handleTroopAmountChange = (amount) => {
        setTroopAmount(amount);
    }

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
            (<SoldierMenuOptions pageName={currentPage} TroopAmount={TroopAmount} timer={timer}/>)
        }
        <SoldierAmountSelectBar soldierVisible={soldierVisible} TroopAmount={TroopAmount} onTroopAmountChange={handleTroopAmountChange}/>
        </div>
    )
}

function SoldierMenuOptions({pageName, TroopAmount, timer ,requests, sendData}){
    return (
        <div className="soldier-page-content">
            {pageName === 'troopOverview' && <TroopOverviewPage TroopAmount={TroopAmount}/>}
            {pageName === 'trainTroopOverview' && <TroopTrainPage getTimer={timer}/>}
        </div>
    )
}

function SoldierAmountSelectBar({soldierVisible, TroopAmount, onTroopAmountChange}) {
     const handleButtonClick = (amount) => {
      onTroopAmountChange(amount);
    };

    return (
        <div className="TroopAmountbar">
            <table>
                <td>
                    <button onClick={() => handleButtonClick(1)} className={"AmountMenuOption"}>1x</button>
                    <button onClick={() => handleButtonClick(5)} className={"AmountMenuOption"}>5x</button>
                    <button onClick={() => handleButtonClick(10)} className={"AmountMenuOption"}>10x</button>
                    <button onClick={() => handleButtonClick(25)} className={"AmountMenuOption"}>25x</button>
                    <button onClick={() => handleButtonClick(100)} className={"AmountMenuOption"}>100x</button>
                </td>
            </table>
        </div>
    )
}


function TroopOverviewPage({TroopAmount}) {
    const { sid, username } = useLocation().state;
    const [consumption, setConsumption] = useState(0);
    const [errorMessage, setErrorMessage] = useState("")
    const [popup, setPopup] = useState(false)
    // default value for soldier counts
    const [soldiers, setSoldierCount] = useState({
        heavyInfantry1: 0,
        heavyInfantry2: 0,
        heavyInfantry3: 0,
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
            heavyInfantry1: data.ArmoredFootman.amount,
            heavyInfantry2: data.Huskarl.amount,
            heavyInfantry3: data.OrderKnight.amount,
            spear1: data.Guardsman.amount,
            spear2: data.Pikeman.amount,
            spear3: data.Halbardier.amount,
            horseman1: data.Horseman.amount,
            horseman2: data.Knight.amount,
            horseman3: data.WarElephant.amount,
            bowman1: data.Bowman.amount,
            bowman2: data.LongbowMan.amount,
            bowman3: data.CrossbowMan.amount,
            ambush1: data.Bandit.amount,
            ambush2: data.Militia.amount,
            ambush3: data.Skirmisher.amount
        }))
    API.get_getConsumption(sid).then(


        data => {setConsumption(data),
        console.log(data)}
    )
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
        const data = API.trainTroop(sid, troop).then();
        if (data.success) {}
        else
        {
            setErrorMessage(data.error);
            setPopup(true)
        }
    };

    return (
        <div className="soldier-primair-input">
            <div className="soldier-primair-input">
                <nobr className="food-icon"></nobr>
                consumption: {consumption}
            </div>
            <div className="army-title"> Army</div>
            <div className="soldier-primair-input">
                {/* Each soldier has a symbol and a count */}
                <div className="soldierSection">
                    {soldiersAvailable.heavyInfantry1 ?
                        <button className="button"><img src={heavyInfantry1} alt="Armored footman" className="soldier-icon" onClick={() => handleTroopTrain("ArmoredFootman")}/></button>
                        : <button className="button"><div id="wrapper"><img src={heavyInfantry1} alt="Armored footman" className="soldier-icon"/></div></button>}
                        <p className="soldierCount">{soldiers.heavyInfantry1}</p>
                    {soldiersAvailable.heavyInfantry2 ?
                        <button className="button"><img src={heavyInfantry2} alt="Huskarl" className="soldier-icon" onClick={() => handleTroopTrain("Huskarl")}/></button>
                        : <button className="button"><div id="wrapper"><img src={heavyInfantry2} alt="Huskarl" className="soldier-icon"/></div></button>}
                        <p className="soldierCount">{soldiers.heavyInfantry2}</p>
                    {soldiersAvailable.heavyInfantry3 ?
                    <button className="button"><img src={heavyInfantry3} alt="Order Knights" className="soldier-icon" onClick={() => handleTroopTrain("OrderKnight")}/> </button>
                        : <button className="button"><div id="wrapper"><img src={heavyInfantry3} alt="Order Knights" className="soldier-icon"/></div></button>}
                        <p className="soldierCount">{soldiers.heavyInfantry3}</p>
                </div>
                <div className="soldierSection">
                    {soldiersAvailable.spear1 ?
                    <button className="button"><img src={spear1} alt="Guardsman" className="soldier-icon" onClick={() => handleTroopTrain("Guardsman")}/> </button>
                        : <button className="button"><div id="wrapper"><img src={spear1} alt="Guardsman" className="soldier-icon"/></div></button>}
                        <p className="soldierCount">{soldiers.spear1}</p>
                    {soldiersAvailable.spear2 ?
                    <button className="button"><img src={spear2} alt="Pike man" className="soldier-icon" onClick={() => handleTroopTrain("Pikeman")}/> </button>
                        : <button className="button"><div id="wrapper"><img src={spear2} alt="Pike man" className="soldier-icon"/></div></button>}
                        <p className="soldierCount">{soldiers.spear2}</p>
                    {soldiersAvailable.spear3 ?
                    <button className="button"><img src={spear3} alt="Halbardier" className="soldier-icon" onClick={() => handleTroopTrain("Halbardier")}/> </button>
                        : <button className="button"><div id="wrapper"><img src={spear3} alt="Halbardier" className="soldier-icon"/></div></button>}
                        <p className="soldierCount">{soldiers.spear3}</p>
                </div>
                <div className="soldierSection">
                    {soldiersAvailable.horseman1 ?
                    <button className="button"><img src={horseman1} alt="Horseman" className="soldier-icon" onClick={() => handleTroopTrain("Horseman")}/> </button>
                        : <button className="button"><div id="wrapper"><img src={horseman1} alt="Horseman" className="soldier-icon"/></div></button>}
                        <p className="soldierCount">{soldiers.horseman1}</p>
                    {soldiersAvailable.horseman2 ?
                    <button className="button"><img src={horseman2} alt="Knight" className="soldier-icon" onClick={() => handleTroopTrain("Knight")}/> </button>
                        : <button className="button"><div id="wrapper"><img src={horseman2} alt="Knight" className="soldier-icon"/></div></button>}
                        <p className="soldierCount">{soldiers.horseman2}</p>
                    {soldiersAvailable.horseman3 ?
                    <button className="button"><img src={horseman3} alt="War elephant" className="soldier-icon" onClick={() => handleTroopTrain("WarElephant")}/> </button>
                        : <button className="button"><div id="wrapper"><img src={horseman3} alt="War elephant" className="soldier-icon"/></div></button>}
                        <p className="soldierCount">{soldiers.horseman3}</p>
                </div>
                <div className="soldierSection">
                    {soldiersAvailable.bowman1 ?
                    <button className="button"><img src={bowman1} alt="Bowman" className="soldier-icon" onClick={() => handleTroopTrain("Bowman")}/> </button>
                    : <button className="button"><div id="wrapper"><img src={bowman1} alt="Bowman" className="soldier-icon"/></div></button>}
                        <p className="soldierCount">{soldiers.bowman1}</p>
                    {soldiersAvailable.bowman2 ?
                    <button className="button"><img src={bowman2} alt="Longbowman" className="soldier-icon" onClick={() => handleTroopTrain("LongbowMan")}/> </button>
                        : <button className="button"><div id="wrapper"><img src={bowman2} alt="Longbowman" className="soldier-icon"/></div></button>}
                        <p className="soldierCount">{soldiers.bowman2}</p>
                    {soldiersAvailable.bowman3 ?
                    <button className="button"><img src={bowman3} alt="Crossbowman" className="soldier-icon" onClick={() => handleTroopTrain("CrossbowMan")}/> </button>
                        : <button className="button"><div id="wrapper"><img src={bowman3} alt="Crossbowman" className="soldier-icon"/></div></button>}
                        <p className="soldierCount">{soldiers.bowman3}</p>
                </div>
                <div className="soldierSection">
                    {soldiersAvailable.ambush1 ?
                    <button className="button"><img src={ambush1} alt="Bandit" className="soldier-icon" onClick={() => handleTroopTrain("Bandit")}/> </button>
                        : <button className="button"><div id="wrapper"><img src={ambush1} alt="Bandit" className="soldier-icon"/></div></button>}
                        <p className="soldierCount">{soldiers.ambush1}</p>
                    {soldiersAvailable.ambush2 ?
                    <button className="button"><img src={ambush2} alt="Militia" className="soldier-icon" onClick={() => handleTroopTrain("Militia")}/> </button>
                        : <button className="button"><div id="wrapper"><img src={ambush2} alt="Militia" className="soldier-icon"/></div></button> }
                        <p className="soldierCount">{soldiers.ambush2}</p>
                    {soldiersAvailable.ambush3 ?
                    <button className="button"><img src={ambush3} alt="Skirmishers" className="soldier-icon" onClick={() => handleTroopTrain("Skirmisher")}/> </button>
                        : <button className="button"><div id="wrapper"><img src={ambush3} alt="Skirmishers" className="soldier-icon"/></div></button> }
                        <p className="soldierCount">{soldiers.ambush3}</p>
                </div>
            </div>
            {popup && <RequestMassagePopUp message={errorMessage} setPopup={setPopup}/>}
        </div>
    )
}

function TroopTrainPage(getTimer) {

    useEffect(() => {
        //const timer = getTimer(1, "soldier")
    }, []);
    return (
        <div className="soldier-primair-input">
            <div className="army-title"> Training Queue</div>
            <div className="trainingQueue">
                <table>
                    <button className="button"><img src={heavyInfantry1} alt="Armored footman" className="training-icon"/><span className="caption"></span></button>
                </table>
            </div>
        </div>
    )
}
