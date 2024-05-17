import React, {useState} from "react";
import "./transferOptionContents.css"
import wood from '../assets/wood.png';
import stone from '../assets/stone.png';
import metal from '../assets/metal.png';
import food from '../assets/food.png';
import Soldiers from "../assets/soldiers.jsx";
import InformationTab from "../information/informationTab.jsx";
import * as API from '../../../../api/EndPoints.jsx'
import {useLocation} from "react-router-dom";
import PopUp from "../../../../globalComponents/popupMessage/popup.jsx";


/**
 * Component for social options.
 * @param {Object} props - The props object.
 * @param {string} props.pageName - The name of the page ('createClan', 'joinClan', 'requests', 'searchPerson').
 * @returns {JSX.Element} - The JSX for social options.
 */
function TransferOption({pageName, selectedObject, outpostChosen, setCallForUpdate})
{
    return(
        <div className={"option-content"}>
            {pageName === 'Transfer' && <TransferPage selectedObject={selectedObject} outpostChosen={outpostChosen} setCallForUpdate={setCallForUpdate}/>}
            {pageName === 'Attack' && <AttackPage selectedObject={selectedObject} setCallForUpdate={setCallForUpdate}/>}
            {pageName === 'Espionage' && <EspionagePage selectedObject={selectedObject}/>}
            {pageName === 'Information' && <InformationTab selectedObject={selectedObject}/>}
        </div>
    )
}

export default TransferOption;

function TransferPage({selectedObject, outpostChosen, setCallForUpdate})
{
    const {username, sid} = useLocation().state
    const [popup, setPopup] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [outpostName, setOutpostName] = useState(null)
    const [soldiers, setSoldiers] = useState([/*[name, amount], ...*/]);
    let resources = [0,0,0,0,0,0,0]
    const handleSoldierChange = (name, amount) =>
    {
        if (isNaN(amount) || amount === null)
        {
             setSoldiers(prevState => prevState.filter(soldier => soldier[0] !== name));
        }
        else
        {
            const soldierIndex = soldiers.findIndex(soldier => soldier[0] === name);
            if (soldierIndex !== -1)
            {
                setSoldiers(prevState =>
                {
                    const updatedSoldiers = [...prevState]
                    updatedSoldiers[soldierIndex] = [name, amount]
                    return updatedSoldiers
                });
            }
            else
            {
                setSoldiers(prevState => [...prevState, [name, amount]])
            }
        }
    };
    const handleResourceChange = (index, amount) =>
    {
        resources[index] = amount
    }

    const handleTransferButton = () =>
    {
        if (!outpostChosen)
        {
            API.transfer(selectedObject.idTO, selectedObject.toType, sid, soldiers, resources, 'transfer', username).then(data =>
            {
                if (!data.success)
                {
                    setErrorMessage(data.error)
                }
                else
                {
                    setErrorMessage("We're dispatching our forces and provisions to aid our ally's stronghold.")
                    setCallForUpdate(true)
                }
                setPopup(true)
            })
        }
        else
        {
            API.createOutpost(selectedObject, sid, outpostName, soldiers, resources).then(data =>
            {
                if (!data.success)
                {
                    setErrorMessage(data.error)
                }
                else
                {
                    setErrorMessage("We're sending troops and supplies to bolster our outpost!")
                    setCallForUpdate(true)
                }
                setPopup(true)
            })
        }
    }

    return (
        <div className={"transferMenu-container"} key={"TransferPage"}>
            <div className={"soldierTransfer-container"} key={"TransferPage"}>
                {Object.entries(Soldiers).map(([category, images]) => (
                    <div key={category}>
                        {Object.entries(images).map((image) => (
                            <div key={image[0]} className={"iconWithAmount"}>
                                <img src={image[1]} className={"soldier-image"} alt={"Soldier"}/>
                                <input className={"amount"}
                                       onChange={(e) => handleSoldierChange(image[0], parseInt(e.target.value))}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <hr/>
            <div className={"resourcesTransfer-container"}>
                <div className={"iconWithAmount"}>
                    <img src={wood} className={"resource-image"} alt={"Resource"}/>
                    <input className={"amount"} onChange={(e) => handleResourceChange(2, parseInt(e.target.value))}/>
                </div>
                <div className={"iconWithAmount"}>
                    <img src={stone} className={"resource-image"} alt={"Resource"}/>
                    <input className={"amount"} onChange={(e) => handleResourceChange(1, parseInt(e.target.value))}/>
                </div>
                <div className={"iconWithAmount"}>
                    <img src={metal} className={"resource-image"} alt={"Resource"}/>
                    <input className={"amount"} onChange={(e) => handleResourceChange(3, parseInt(e.target.value))}/>
                </div>
                <div className={"iconWithAmount"}>
                    <img src={food} className={"resource-image"} alt={"Resource"}/>
                    <input className={"amount"} onChange={(e) => handleResourceChange(4, parseInt(e.target.value))}/>
                </div>
            </div>
            <button className={"send-transferTYPE"} onClick={handleTransferButton}> Send Soldier and Resources! </button>
            {outpostChosen && <input className={"outpost-Name"} placeholder={"Settlement Name..."} onChange={(e) => setOutpostName(e.target.value)}/>}
            {popup && <PopUp message={errorMessage} setPopup={setPopup}/>}
        </div>
    );
}

function AttackPage({selectedObject, setCallForUpdate})
{
    const {username, sid} = useLocation().state
    const [popup, setPopup] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [soldiers, setSoldiers] = useState([/*[name, amount], ...*/]);
    let resources = [0,0,0,0,0,0,0]
    const handleSoldierChange = (name, amount) =>
    {
        if (isNaN(amount) || amount === null)
        {
             setSoldiers(prevState => prevState.filter(soldier => soldier[0] !== name));
        }
        else
        {
            const soldierIndex = soldiers.findIndex(soldier => soldier[0] === name);
            if (soldierIndex !== -1)
            {
                setSoldiers(prevState =>
                {
                    const updatedSoldiers = [...prevState]
                    updatedSoldiers[soldierIndex] = [name, amount]
                    return updatedSoldiers
                });
            }
            else
            {
                setSoldiers(prevState => [...prevState, [name, amount]])
            }
        }
    };
    const handleAttack = () =>
    {
        API.transfer(selectedObject.idTO, selectedObject.toType, sid, soldiers, resources, 'attack', username).then(data =>
        {
            if (!data.success)
            {
                setErrorMessage(data.error)
            }
            else
            {
                setErrorMessage("We're laying siege to the enemy stronghold.")
                setCallForUpdate(true)
            }
            setPopup(true)
        })
    }
    return (
        <div className={"transferMenu-container"} key={"AttackPage"}>
            <div className={"soldierTransfer-container"} key={"AttackPage"}>
                {Object.entries(Soldiers).map(([category, images]) => (
                    <div key={category}>
                        {Object.entries(images).map((image) => (
                            <div key={image[0]} className={"iconWithAmount"}>
                                <img src={image[1]} className={"soldier-image"} alt={"Soldier"}/>
                                <input className={"amount"} onChange={(e) => handleSoldierChange(image[0], parseInt(e.target.value))}/>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <button className={"send-transferTYPE"} onClick={handleAttack}> Send Troops and Attack!</button>
            {popup && <PopUp message={errorMessage} setPopup={setPopup}/>}
        </div>
    )
}


function EspionagePage({selectedObject})
{
    const {sid} = useLocation().state
    const handleEspionageButton = () =>
    {
        API.espionage(selectedObject.idTO, sid, selectedObject.toType).then(data =>
        {
            console.log("Espionage Started: ", data)
        })
    }
    return (
        <button className={"espionage-button"} onClick={handleEspionageButton}> ESPIONAGE </button>
    )
}