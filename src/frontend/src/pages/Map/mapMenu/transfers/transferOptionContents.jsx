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
 * Component for displaying different transfer options based on the provided page name.
 *
 * @param {Object} props - The props object.
 * @param {string} props.pageName - The name of the page ('Transfer', 'Attack', 'Espionage', 'Information').
 * @param {Object} props.selectedObject - The selected object for transfer.
 * @param {boolean} props.outpostChosen - Flag indicating if an outpost is chosen.
 * @param {function} props.setInstantCallForUpdate - Function to set a flag to trigger an update.
 * @returns {JSX.Element} - The JSX for displaying transfer options.
 */
function TransferOption({pageName, selectedObject, outpostChosen, setInstantCallForUpdate})
{
    return(
        <div className={"option-content"}>
            {pageName === 'Transfer' && <TransferPage selectedObject={selectedObject} outpostChosen={outpostChosen} setInstantCallForUpdate={setInstantCallForUpdate}/>}
            {pageName === 'Attack' && <AttackPage selectedObject={selectedObject} setInstantCallForUpdate={setInstantCallForUpdate}/>}
            {pageName === 'Espionage' && <EspionagePage selectedObject={selectedObject}/>}
            {pageName === 'Information' && <InformationTab selectedObject={selectedObject}/>}
        </div>
    )
}

export default TransferOption;


/**
 * Component for the transfer page within TransferOption.
 *
 * @param {Object} props - The props object.
 * @param {Object} props.selectedObject - The selected object for transfer.
 * @param {boolean} props.outpostChosen - Flag indicating if an outpost is chosen.
 * @param {function} props.setInstantCallForUpdate - Function to set a flag to trigger an update.
 * @returns {JSX.Element} - The JSX for the transfer page.
 */

function TransferPage({selectedObject, outpostChosen, setInstantCallForUpdate})
{
    const {username, sid} = useLocation().state
    const [popup, setPopup] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [outpostName, setOutpostName] = useState(null)
    const [soldiers, setSoldiers] = useState([/*[name, amount], ...*/]);
    const [resources, setResources] = useState([0,0,0,0,0,0,0])
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
        const updatedResources = [...resources]
        updatedResources[index] = amount
        setResources(updatedResources)
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
                    setInstantCallForUpdate(true)
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
                    setInstantCallForUpdate(true)
                }
                setPopup(true)
            })
        }
    }

    return (
        <div className={"transferMenu-container"} key={"TransferPage"}>
            <div className={"mapMenu-info"}>
                Dispatch Your Warriors and Treasures to Aid Your Noble Ally or Comrade!
            </div>
            <div className={"soldierTransfer-container"} key={"TransferPage"}>
                {Object.entries(Soldiers).map(([category, images]) => (
                    <div key={category}>
                        {Object.entries(images).map((image) => (
                            <div key={image[0]} className={"iconWithAmount"}>
                                <img src={image[1]} className={"soldier-image"} alt={"Soldier"}/>
                                <input className={"amount"}
                                       onChange={(e) => handleSoldierChange(image[0], parseInt(e.target.value))}
                                       placeholder={"amount..."}
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
                    <input className={"amount"} onChange={(e) => handleResourceChange(2, parseInt(e.target.value))} placeholder={"amount..."}/>
                </div>
                <div className={"iconWithAmount"}>
                    <img src={stone} className={"resource-image"} alt={"Resource"}/>
                    <input className={"amount"} onChange={(e) => handleResourceChange(1, parseInt(e.target.value))} placeholder={"amount..."}/>
                </div>
                <div className={"iconWithAmount"}>
                    <img src={metal} className={"resource-image"} alt={"Resource"}/>
                    <input className={"amount"} onChange={(e) => handleResourceChange(3, parseInt(e.target.value))} placeholder={"amount..."}/>
                </div>
                <div className={"iconWithAmount"}>
                    <img src={food} className={"resource-image"} alt={"Resource"}/>
                    <input className={"amount"} onChange={(e) => handleResourceChange(4, parseInt(e.target.value))} placeholder={"amount..."}/>
                </div>
            </div>
            <button className={"send-transferTYPE"} onClick={handleTransferButton}> Start Transfer!</button>
            {outpostChosen && <input className={"outpost-Name"} placeholder={"Settlement Name..."}
                                     onChange={(e) => setOutpostName(e.target.value)}/>}
            {popup && <PopUp message={errorMessage} setPopup={setPopup}/>}
        </div>
    );
}

/**
 * Component for the attack page within TransferOption.
 *
 * @param {Object} props - The props object.
 * @param {Object} props.selectedObject - The selected object for transfer.
 * @param {function} props.setInstantCallForUpdate - Function to set a flag to trigger an update.
 * @returns {JSX.Element} - The JSX for the attack page.
 */
function AttackPage({selectedObject, setInstantCallForUpdate})
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
                setInstantCallForUpdate(true)
            }
            setPopup(true)
        })
    }
    return (
        <div className={"transferMenu-container"} key={"AttackPage"}>
            <div className={"mapMenu-info"}>
                Gather your stalwart warriors, don your armor, and set forth to conquer! The hour of battle is upon us!
            </div>
            <div className={"soldierTransfer-container"} key={"AttackPage"}>
                {Object.entries(Soldiers).map(([category, images]) => (
                    <div key={category}>
                        {Object.entries(images).map((image) => (
                            <div key={image[0]} className={"iconWithAmount"}>
                                <img src={image[1]} className={"soldier-image"} alt={"Soldier"}/>
                                <input className={"amount"}
                                       onChange={(e) => handleSoldierChange(image[0], parseInt(e.target.value))}
                                       placeholder={"amount..."}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <button className={"send-transferTYPE"} onClick={handleAttack}> Start Attack!</button>
            {popup && <PopUp message={errorMessage} setPopup={setPopup}/>}
        </div>
    )
}

/**
 * Component for the espionage page within TransferOption.
 *
 * @param {Object} props - The props object.
 * @param {Object} props.selectedObject - The selected object for transfer.
 * @returns {JSX.Element} - The JSX for the espionage page.
 */

function EspionagePage({selectedObject})
{
    const {sid} = useLocation().state
    const [popup, setPopup] = useState(false)
    const handleEspionageButton = () =>
    {
        API.espionage(selectedObject.idTO, sid, selectedObject.toType).then(() =>
        {
            setPopup(true)
        })
    }
    return (
        <>
            <button className={"espionage-button"} onClick={handleEspionageButton}> ESPIONAGE </button>
            {popup && <PopUp message={"Espial in the city commenced. Our agent is embedded. Awaiting further commands."} setPopup={setPopup}/>}
        </>
    )
}