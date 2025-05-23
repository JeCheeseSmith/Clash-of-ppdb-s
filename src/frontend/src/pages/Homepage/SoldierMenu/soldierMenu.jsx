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
import * as API from "../../../api/EndPoints.jsx"
import {useLocation} from "react-router-dom";
import PopUp from "../../../globalComponents/popupMessage/popup.jsx";
import {empty} from "leaflet/src/dom/DomUtil.js";
import {updateResources} from "../../../globalComponents/backgroundFunctions/updateFunctions.jsx";
import {updateTimers} from "../../../globalComponents/backgroundFunctions/updateFunctions.jsx";
import {div} from "three/examples/jsm/nodes/math/OperatorNode.js";

/**
 * React component for the troop screen button
 */
let SoldierTimers;


function SoldierMenuButton({setResources, timers, setTimers, }) {
    const [soldierVisible, setsoldierVisible] = useState(false);

    return (
        <>
            <button onClick={() => {
                setsoldierVisible(!soldierVisible);
                SoldierTimers = timers
            }} className={"trainMenu"}>Troop Menu
                <div className="soldierMenuButton-icon"></div>
            </button>
            {soldierVisible ? <SoldierMenuBox soldierVisible={soldierVisible} setResources={setResources} setTimers={setTimers} timers={timers}  />: null}
        </>
    );
}
export default SoldierMenuButton;

function SoldierMenuBox({soldierVisible, setTimers, setResources, timers, }) {
    return (
        <div className="box-container">
            <SoldierNavbar soldierVisible={soldierVisible} setResources={setResources} setTimers={setTimers} timers={timers} />
        </div>
    )
}

function SoldierNavbar({soldierVisible, setTimers, setResources, timers, }) {
    const [currentPage, setCurrentPage] = useState('troopOverview');
    const [TroopAmount, setTroopAmount] = useState(1);
    const [consumption, setConsumption] = useState(0);
    const { sid,  } = useLocation().state;

    const handleButtonClick = (pageName) => {
      setCurrentPage(pageName);
    };

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
    const [trainees, setTraineeCount] = useState({
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
    const handleTraineeAmountChange = (change) => {
        setTraineeCount({
            heavyInfantry1: change.ArmoredFootman,
            heavyInfantry2: change.Huskarl,
            heavyInfantry3: change.OrderKnight,
            spear1: change.Guardsman,
            spear2: change.Pikeman,
            spear3: change.Halbardier,
            horseman1: change.Horseman,
            horseman2: change.Knight,
            horseman3: change.WarElephant,
            bowman1: change.Bowman,
            bowman2: change.LongbowMan,
            bowman3: change.CrossbowMan,
            ambush1: change.Bandit,
            ambush2: change.Militia,
            ambush3: change.Skirmisher})
    }
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
        data => {setConsumption(data)}
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

    return (
        <div className="navbar-container">
            {soldierVisible && (
            <nav className="navbar visible">
                <ul className="navbar-links">
                    <li>
                        <button onClick={() => handleButtonClick('troopOverview')}
                                className={currentPage === "troopOverview" ? "soldierMenuOption selected" : "soldierMenuOption"}>Troop Overview
                        </button>
                    </li>
                    <li>
                        <button onClick={() => handleButtonClick('trainTroopOverview')}
                                className={currentPage === "trainTroopOverview" ? "soldierMenuOption selected" : "soldierMenuOption"}>Troop Training
                        </button>
                    </li>
                </ul>
            </nav>
        )}
        {
            soldierVisible && currentPage &&
            (<SoldierMenuOptions pageName={currentPage} setTimers={setTimers} setResources={setResources} timers={timers} soldiers={soldiers}
            consumption={consumption} traineesAmount={trainees} soldiersAvailable={soldiersAvailable} TraineesUpdate={handleTraineeAmountChange} update={APIcalls} />)
        }
        {/*<SoldierAmountSelectBar soldierVisible={soldierVisible} TroopAmount={TroopAmount} onTroopAmountChange={handleTroopAmountChange}/>*/}
        </div>
    )
}

function SoldierMenuOptions({pageName, setTimers, setResources, timers, soldiers, consumption, traineesAmount, soldiersAvailable, TraineesUpdate, update}){
    const { sid,  } = useLocation().state;
    return (
        <div className="soldier-page-content">
            {pageName === 'troopOverview' && <TroopOverviewPage setResources={setResources} soldiers={soldiers} setTimers={setTimers}
                                                                soldiersAvailable={soldiersAvailable} consumption={consumption} update={update}/>}
            {pageName === 'trainTroopOverview' && <TroopTrainPage timers={timers} traineesAvailable={soldiersAvailable} traineesAmount={traineesAmount} TraineesUpdate={TraineesUpdate} />}
        </div>
    )
}

function TroopOverviewPage({setResources, soldiersAvailable, soldiers, consumption, setTimers, update}) {
    const {sid, username} = useLocation().state;
    const [errorMessage, setErrorMessage] = useState("")
    const [popup, setPopup] = useState(false)
    const [showTooltip, setShowTooltip] = useState(false);
    const [name, setTooltipName] = useState("");


    useEffect(() => {
        update(sid);
    }, []);
    // Function that sends a request for a soldier to be trained
    const handleTroopTrain = (troop) => {
        API.trainTroop(sid, troop, 1).then(data => {
                if (data.success) {
                    updateTimers(username, setTimers)
                    updateResources(sid, setResources)
                } else {
                    setErrorMessage(data.error);
                    setPopup(true)
                }
            }
        );
    };
    const handleMouseEnter = (name) =>
    {
        setShowTooltip(true);
        setTooltipName(name)
    };
    const handleMouseLeave = () =>
    {
        setShowTooltip(false);
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
                        <button className="button"><img src={heavyInfantry1} alt="Armored footman" className="soldier-icon"
                                                        onClick={() => handleTroopTrain("ArmoredFootman")} onMouseEnter={() => handleMouseEnter("Armored Footman")}
                onMouseLeave={handleMouseLeave} />
                        </button>
                        : <button className="button">
                            <div id="wrapper"><img src={heavyInfantry1} alt="Armored footman"
                                                   className="soldier-icon"
                                                   onClick={() => handleTroopTrain("ArmoredFootman")} onMouseEnter={() => handleMouseEnter("Armored Footman")}
                onMouseLeave={handleMouseLeave}/></div>
                        </button>}
                    <p className="soldierCount">{soldiers.heavyInfantry1}</p>
                    {soldiersAvailable.heavyInfantry2 ?
                        <button className="button"><img src={heavyInfantry2} alt="Huskarl" className="soldier-icon"
                                                        onClick={() => handleTroopTrain("Huskarl")} onMouseEnter={() => handleMouseEnter("Huskarl")}
                onMouseLeave={handleMouseLeave}/></button>
                        : <button className="button">
                            <div id="wrapper"><img src={heavyInfantry2} alt="Huskarl" className="soldier-icon"
                                                   onClick={() => handleTroopTrain("ArmoredFootman")} onMouseEnter={() => handleMouseEnter("Huskarl")}
                onMouseLeave={handleMouseLeave}/></div>
                        </button>}
                    <p className="soldierCount">{soldiers.heavyInfantry2}</p>
                    {soldiersAvailable.heavyInfantry3 ?
                        <button className="button"><img src={heavyInfantry3} alt="Order Knights" className="soldier-icon"
                                                        onClick={() => handleTroopTrain("OrderKnight")} onMouseEnter={() => handleMouseEnter("Order Knights")}
                onMouseLeave={handleMouseLeave}/></button>
                        : <button className="button">
                            <div id="wrapper"><img src={heavyInfantry3} alt="Order Knights" className="soldier-icon"
                                                   onClick={() => handleTroopTrain("ArmoredFootman")} onMouseEnter={() => handleMouseEnter("Order Knights")}
                onMouseLeave={handleMouseLeave}/></div>
                        </button>}
                    <p className="soldierCount">{soldiers.heavyInfantry3}</p>
                </div>
                <div className="soldierSection">
                    {soldiersAvailable.spear1 ?
                        <button className="button"><img src={spear1} alt="Guardsman" className="soldier-icon"
                                                        onClick={() => handleTroopTrain("Guardsman")} onMouseEnter={() => handleMouseEnter("Guardsman")}
                onMouseLeave={handleMouseLeave}/></button>
                        : <button className="button">
                            <div id="wrapper"><img src={spear1} alt="Guardsman" className="soldier-icon"
                                                   onClick={() => handleTroopTrain("ArmoredFootman")} onMouseEnter={() => handleMouseEnter("Guardsman")}
                onMouseLeave={handleMouseLeave}/></div>
                        </button>}
                    <p className="soldierCount">{soldiers.spear1}</p>
                    {soldiersAvailable.spear2 ?
                        <button className="button"><img src={spear2} alt="Pike man" className="soldier-icon"
                                                        onClick={() => handleTroopTrain("Pikeman")} onMouseEnter={() => handleMouseEnter("Pike man")}
                onMouseLeave={handleMouseLeave}/></button>
                        : <button className="button">
                            <div id="wrapper"><img src={spear2} alt="Pike man" className="soldier-icon"
                                                   onClick={() => handleTroopTrain("ArmoredFootman")} onMouseEnter={() => handleMouseEnter("Pike man")}
                onMouseLeave={handleMouseLeave}/></div>
                        </button>}
                    <p className="soldierCount">{soldiers.spear2}</p>
                    {soldiersAvailable.spear3 ?
                        <button className="button"><img src={spear3} alt="Halbardier" className="soldier-icon"
                                                        onClick={() => handleTroopTrain("Halbardier")} onMouseEnter={() => handleMouseEnter("Halbardier")}
                onMouseLeave={handleMouseLeave}/></button>
                        : <button className="button">
                            <div id="wrapper"><img src={spear3} alt="Halbardier" className="soldier-icon"
                                                   onClick={() => handleTroopTrain("ArmoredFootman")} onMouseEnter={() => handleMouseEnter("Halbardier")}
                onMouseLeave={handleMouseLeave}/></div>
                        </button>}
                    <p className="soldierCount">{soldiers.spear3}</p>
                </div>
                <div className="soldierSection">
                    {soldiersAvailable.horseman1 ?
                        <button className="button"><img src={horseman1} alt="Horseman" className="soldier-icon"
                                                        onClick={() => handleTroopTrain("Horseman")} onMouseEnter={() => handleMouseEnter("Horseman")}
                onMouseLeave={handleMouseLeave}/></button>
                        : <button className="button">
                            <div id="wrapper"><img src={horseman1} alt="Horseman" className="soldier-icon"
                                                   onClick={() => handleTroopTrain("ArmoredFootman")} onMouseEnter={() => handleMouseEnter("Horseman")}
                onMouseLeave={handleMouseLeave}/></div>
                        </button>}
                    <p className="soldierCount">{soldiers.horseman1}</p>
                    {soldiersAvailable.horseman2 ?
                        <button className="button"><img src={horseman2} alt="Knight" className="soldier-icon"
                                                        onClick={() => handleTroopTrain("Knight")} onMouseEnter={() => handleMouseEnter("Knight")}
                onMouseLeave={handleMouseLeave}/></button>
                        : <button className="button">
                            <div id="wrapper"><img src={horseman2} alt="Knight" className="soldier-icon"
                                                   onClick={() => handleTroopTrain("ArmoredFootman")} onMouseEnter={() => handleMouseEnter("Knight")}
                onMouseLeave={handleMouseLeave}/></div>
                        </button>}
                    <p className="soldierCount">{soldiers.horseman2}</p>
                    {soldiersAvailable.horseman3 ?
                        <button className="button"><img src={horseman3} alt="War elephant" className="soldier-icon"
                                                        onClick={() => handleTroopTrain("WarElephant")} onMouseEnter={() => handleMouseEnter("War elephant")}
                onMouseLeave={handleMouseLeave}/></button>
                        : <button className="button">
                            <div id="wrapper"><img src={horseman3} alt="War elephant" className="soldier-icon"
                                                   onClick={() => handleTroopTrain("ArmoredFootman")} onMouseEnter={() => handleMouseEnter("War elephant")}
                onMouseLeave={handleMouseLeave}/></div>
                        </button>}
                    <p className="soldierCount">{soldiers.horseman3}</p>
                </div>
                <div className="soldierSection">
                    {soldiersAvailable.bowman1 ?
                        <button className="button"><img src={bowman1} alt="Bowman" className="soldier-icon"
                                                        onClick={() => handleTroopTrain("Bowman")} onMouseEnter={() => handleMouseEnter("Bowman")}
                onMouseLeave={handleMouseLeave}/></button>
                        : <button className="button">
                            <div id="wrapper"><img src={bowman1} alt="Bowman" className="soldier-icon"
                                                   onClick={() => handleTroopTrain("ArmoredFootman")} onMouseEnter={() => handleMouseEnter("Bowman")}
                onMouseLeave={handleMouseLeave}/></div>
                        </button>}
                    <p className="soldierCount">{soldiers.bowman1}</p>
                    {soldiersAvailable.bowman2 ?
                        <button className="button"><img src={bowman2} alt="Longbowman" className="soldier-icon"
                                                        onClick={() => handleTroopTrain("LongbowMan")} onMouseEnter={() => handleMouseEnter("Longbowman")}
                onMouseLeave={handleMouseLeave}/></button>
                        : <button className="button">
                            <div id="wrapper"><img src={bowman2} alt="Longbowman" className="soldier-icon"
                                                   onClick={() => handleTroopTrain("ArmoredFootman")} onMouseEnter={() => handleMouseEnter("Longbowman")}
                onMouseLeave={handleMouseLeave}/></div>
                        </button>}
                    <p className="soldierCount">{soldiers.bowman2}</p>
                    {soldiersAvailable.bowman3 ?
                        <button className="button"><img src={bowman3} alt="Crossbowman" className="soldier-icon"
                                                        onClick={() => handleTroopTrain("CrossbowMan")} onMouseEnter={() => handleMouseEnter("Crossbowman")}
                onMouseLeave={handleMouseLeave}/></button>
                        : <button className="button">
                            <div id="wrapper"><img src={bowman3} alt="Crossbowman" className="soldier-icon"
                                                   onClick={() => handleTroopTrain("ArmoredFootman")} onMouseEnter={() => handleMouseEnter("Crossbowman")}
                onMouseLeave={handleMouseLeave}/></div>
                        </button>}
                    <p className="soldierCount">{soldiers.bowman3}</p>
                </div>
                <div className="soldierSection">
                    {soldiersAvailable.ambush1 ?
                        <button className="button"><img src={ambush1} alt="Bandit" className="soldier-icon"
                                                        onClick={() => handleTroopTrain("Bandit")} onMouseEnter={() => handleMouseEnter("Bandit")}
                onMouseLeave={handleMouseLeave}/></button>
                        : <button className="button">
                            <div id="wrapper"><img src={ambush1} alt="Bandit" className="soldier-icon"
                                                   onClick={() => handleTroopTrain("ArmoredFootman")} onMouseEnter={() => handleMouseEnter("Bandit")}
                onMouseLeave={handleMouseLeave}/></div>
                        </button>}
                    <p className="soldierCount">{soldiers.ambush1}</p>
                    {soldiersAvailable.ambush2 ?
                        <button className="button"><img src={ambush2} alt="Militia" className="soldier-icon"
                                                        onClick={() => handleTroopTrain("Militia")} onMouseEnter={() => handleMouseEnter("Militia")}
                onMouseLeave={handleMouseLeave}/></button>
                        : <button className="button">
                            <div id="wrapper"><img src={ambush2} alt="Militia" className="soldier-icon"
                                                   onClick={() => handleTroopTrain("ArmoredFootman")} onMouseEnter={() => handleMouseEnter("Militia")}
                onMouseLeave={handleMouseLeave}/></div>
                        </button>}
                    <p className="soldierCount">{soldiers.ambush2}</p>
                    {soldiersAvailable.ambush3 ?
                        <button className="button"><img src={ambush3} alt="Skirmishers" className="soldier-icon"
                                                        onClick={() => handleTroopTrain("Skirmisher")} onMouseEnter={() => handleMouseEnter("Skirmishers")}
                onMouseLeave={handleMouseLeave}/></button>
                        : <button className="button">
                            <div id="wrapper"><img src={ambush3} alt="Skirmishers" className="soldier-icon"
                                                   onClick={() => handleTroopTrain("ArmoredFootman")} onMouseEnter={() => handleMouseEnter("Skirmishers")}
                onMouseLeave={handleMouseLeave}/></div>
                        </button>}
                    <p className="soldierCount">{soldiers.ambush3}</p>
                </div>
            </div>
            {showTooltip && <div className="soldier-primair-input">{name}</div>}
            {popup && <PopUp message={errorMessage} setPopup={setPopup}/>}
        </div>
    )
}

function calcTrainees(timers, TraineesUpdate){
    const countById2 = {};
    for (let timer of timers.timers)
    {
        if (timer.type === "soldier")
        {
            countById2[timer.sname] = (countById2[timer.sname] || 0) + 1;
        }
    }
    TraineesUpdate.TraineesUpdate(countById2)
}

function TroopTrainPage({timers, traineesAvailable, traineesAmount, TraineesUpdate}) {
    const {sid} = useLocation().state;
    const initialized = useState(false)
    const [showTooltip, setShowTooltip] = useState(false);
    const [name, setTooltipName] = useState("");
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            calcTrainees(timers = {timers}, TraineesUpdate = {TraineesUpdate})
        }
    }, []);
    const handleMouseEnter = (name) =>
    {
        setShowTooltip(true);
        setTooltipName(name)
    };
    const handleMouseLeave = () =>
    {
        setShowTooltip(false);
    };
    return (
        <div className="soldier-primair-input">
            <div className="army-title"> Training Queue</div>
            <div className="soldierSection">
                {traineesAvailable.heavyInfantry1 ?
                    <button className="button"><img src={heavyInfantry1} alt="Armored footman"
                                                    className="soldier-icon" onMouseEnter={() => handleMouseEnter("Armored Footman")} onMouseLeave={handleMouseLeave}/></button>
                    : <button className="button">
                        <div id="wrapper"><img src={heavyInfantry1} alt="Armored footman" className="soldier-icon" onMouseEnter={() => handleMouseEnter("Armored Footman")}
                onMouseLeave={handleMouseLeave}/>
                        </div>
                    </button>}
                <p className="soldierCount">{traineesAmount.heavyInfantry1}</p>
                {traineesAvailable.heavyInfantry2 ?
                    <button className="button"><img src={heavyInfantry2} alt="Huskarl" className="soldier-icon" onMouseEnter={() => handleMouseEnter("Huskarl")}
                onMouseLeave={handleMouseLeave}/>
                    </button>
                    : <button className="button">
                        <div id="wrapper"><img src={heavyInfantry2} alt="Huskarl" className="soldier-icon" onMouseEnter={() => handleMouseEnter("Huskarl")}
                onMouseLeave={handleMouseLeave}/></div>
                    </button>}
                <p className="soldierCount">{traineesAmount.heavyInfantry2}</p>
                {traineesAvailable.heavyInfantry3 ?
                    <button className="button"><img src={heavyInfantry3} alt="Order Knights"
                                                    className="soldier-icon" onMouseEnter={() => handleMouseEnter("Order Knights")}
                onMouseLeave={handleMouseLeave}/>
                    </button>
                    : <button className="button">
                        <div id="wrapper"><img src={heavyInfantry3} alt="Order Knights" className="soldier-icon" onMouseEnter={() => handleMouseEnter("Order Knights")}
                onMouseLeave={handleMouseLeave}/>
                        </div>
                    </button>}
                <p className="soldierCount">{traineesAmount.heavyInfantry3}</p>
            </div>
            <div className="soldierSection">
                {traineesAvailable.spear1 ?
                    <button className="button"><img src={spear1} alt="Guardsman" className="soldier-icon" onMouseEnter={() => handleMouseEnter("Guardsman")}
                onMouseLeave={handleMouseLeave}/></button>
                    : <button className="button">
                        <div id="wrapper"><img src={spear1} alt="Guardsman" className="soldier-icon" onMouseEnter={() => handleMouseEnter("Guardsman")}
                onMouseLeave={handleMouseLeave}/></div>
                    </button>}
                <p className="soldierCount">{traineesAmount.spear1}</p>
                {traineesAvailable.spear2 ?
                    <button className="button"><img src={spear2} alt="Pike man" className="soldier-icon" onMouseEnter={() => handleMouseEnter("Pike man")}
                onMouseLeave={handleMouseLeave}/></button>
                    : <button className="button">
                        <div id="wrapper"><img src={spear2} alt="Pike man" className="soldier-icon" onMouseEnter={() => handleMouseEnter("Pike man")}
                onMouseLeave={handleMouseLeave}/></div>
                    </button>}
                <p className="soldierCount">{traineesAmount.spear2}</p>
                {traineesAvailable.spear3 ?
                    <button className="button"><img src={spear3} alt="Halbardier" className="soldier-icon" onMouseEnter={() => handleMouseEnter("Halbardier")}
                onMouseLeave={handleMouseLeave}/>
                    </button>
                    : <button className="button">
                        <div id="wrapper"><img src={spear3} alt="Halbardier" className="soldier-icon" onMouseEnter={() => handleMouseEnter("Halbardier")}
                onMouseLeave={handleMouseLeave}/></div>
                    </button>}
                <p className="soldierCount">{traineesAmount.spear3}</p>
            </div>
            <div className="soldierSection">
                {traineesAvailable.horseman1 ?
                    <button className="button"><img src={horseman1} alt="Horseman" className="soldier-icon" onMouseEnter={() => handleMouseEnter("Guardsman")}
                onMouseLeave={handleMouseLeave}/>
                    </button>
                    : <button className="button">
                        <div id="wrapper"><img src={horseman1} alt="Horseman" className="soldier-icon" onMouseEnter={() => handleMouseEnter("Guardsman")}
                onMouseLeave={handleMouseLeave}/></div>
                    </button>}
                <p className="soldierCount">{traineesAmount.horseman1}</p>
                {traineesAvailable.horseman2 ?
                    <button className="button"><img src={horseman2} alt="Knight" className="soldier-icon" onMouseEnter={() => handleMouseEnter("Knight")}
                onMouseLeave={handleMouseLeave}/></button>
                    : <button className="button">
                        <div id="wrapper"><img src={horseman2} alt="Knight" className="soldier-icon" onMouseEnter={() => handleMouseEnter("Knight")}
                onMouseLeave={handleMouseLeave}/></div>
                    </button>}
                <p className="soldierCount">{traineesAmount.horseman2}</p>
                {traineesAvailable.horseman3 ?
                    <button className="button"><img src={horseman3} alt="War elephant" className="soldier-icon" onMouseEnter={() => handleMouseEnter("War elephant")}
                onMouseLeave={handleMouseLeave}/>
                    </button>
                    : <button className="button">
                        <div id="wrapper"><img src={horseman3} alt="War elephant" className="soldier-icon" onMouseEnter={() => handleMouseEnter("War elephant")}
                onMouseLeave={handleMouseLeave}/></div>
                    </button>}
                <p className="soldierCount">{traineesAmount.horseman3}</p>
            </div>
            <div className="soldierSection">
                {traineesAvailable.bowman1 ?
                    <button className="button"><img src={bowman1} alt="Bowman" className="soldier-icon" onMouseEnter={() => handleMouseEnter("Bowman")}
                onMouseLeave={handleMouseLeave}/></button>
                    : <button className="button">
                        <div id="wrapper"><img src={bowman1} alt="Bowman" className="soldier-icon" onMouseEnter={() => handleMouseEnter("Bowman")}
                onMouseLeave={handleMouseLeave}/></div>
                    </button>}
                <p className="soldierCount">{traineesAmount.bowman1}</p>
                {traineesAvailable.bowman2 ?
                    <button className="button"><img src={bowman2} alt="Longbowman" className="soldier-icon" onMouseEnter={() => handleMouseEnter("Longbowman")}
                onMouseLeave={handleMouseLeave}/>
                    </button>
                    : <button className="button">
                        <div id="wrapper"><img src={bowman2} alt="Longbowman" className="soldier-icon" onMouseEnter={() => handleMouseEnter("Longbowman")}
                onMouseLeave={handleMouseLeave}/></div>
                    </button>}
                <p className="soldierCount">{traineesAmount.bowman2}</p>
                {traineesAvailable.bowman3 ?
                    <button className="button"><img src={bowman3} alt="Crossbowman" className="soldier-icon" onMouseEnter={() => handleMouseEnter("Crossbowman")}
                onMouseLeave={handleMouseLeave}/>
                    </button>
                    : <button className="button">
                        <div id="wrapper"><img src={bowman3} alt="Crossbowman" className="soldier-icon" onMouseEnter={() => handleMouseEnter("Crossbowman")}
                onMouseLeave={handleMouseLeave}/></div>
                    </button>}
                <p className="soldierCount">{traineesAmount.bowman3}</p>
            </div>
            <div className="soldierSection">
                {traineesAvailable.ambush1 ?
                    <button className="button"><img src={ambush1} alt="Bandit" className="soldier-icon" onMouseEnter={() => handleMouseEnter("Bandit")}
                onMouseLeave={handleMouseLeave}/></button>
                    : <button className="button">
                        <div id="wrapper"><img src={ambush1} alt="Bandit" className="soldier-icon" onMouseEnter={() => handleMouseEnter("Bandit")}
                onMouseLeave={handleMouseLeave}/></div>
                    </button>}
                <p className="soldierCount">{traineesAmount.ambush1}</p>
                {traineesAvailable.ambush2 ?
                    <button className="button"><img src={ambush2} alt="Militia" className="soldier-icon" onMouseEnter={() => handleMouseEnter("Militia")}
                onMouseLeave={handleMouseLeave}/></button>
                    : <button className="button">
                        <div id="wrapper"><img src={ambush2} alt="Militia" className="soldier-icon" onMouseEnter={() => handleMouseEnter("Militia")}
                onMouseLeave={handleMouseLeave}/></div>
                    </button>}
                <p className="soldierCount">{traineesAmount.ambush2}</p>
                {traineesAvailable.ambush3 ?
                    <button className="button"><img src={ambush3} alt="Skirmishers" className="soldier-icon" onMouseEnter={() => handleMouseEnter("Skirmishers")}
                onMouseLeave={handleMouseLeave}/>
                    </button>
                    : <button className="button">
                        <div id="wrapper"><img src={ambush3} alt="Skirmishers" className="soldier-icon" onMouseEnter={() => handleMouseEnter("Skirmishers")}
                onMouseLeave={handleMouseLeave}/></div>
                    </button>}
                <p className="soldierCount">{traineesAmount.ambush3}</p>
            </div>
            {showTooltip && <div className="soldier-primair-input">{name}</div>}
        </div>
    )
}
