import React from "react";
import "./transferOptionContents.css"
import wood from '../assets/wood.png';
import stone from '../assets/stone.png';
import metal from '../assets/metal.png';
import food from '../assets/food.png';
import Soldiers from "../assets/soldiers.jsx";
import InformationTab from "../information/informationTab.jsx";


/**
 * Component for social options.
 * @param {Object} props - The props object.
 * @param {string} props.pageName - The name of the page ('createClan', 'joinClan', 'requests', 'searchPerson').
 * @returns {JSX.Element} - The JSX for social options.
 */
function TransferOption({pageName})
{
    return(
        <div className={"option-content"}>
            {pageName === 'Transfer' && <TransferPage/>}
            {pageName === 'Attack' && <AttackPage/>}
            {pageName === 'Espionage' && <EspionagePage/>}
            {pageName === 'Information' && <InformationTab/>}
        </div>
    )
}

export default TransferOption;

function TransferPage()
{
    return (
        <div className={"transferMenu-container"}>
            <div className={"soldierTransfer-container"}>
                {Object.entries(Soldiers).map(([category, images]) => (
                    <div>
                        {Object.entries(images).map((image) => (
                            <div key={image[0]} className={"iconWithAmount"}>
                                <img src={image[1]} className={"soldier-image"} alt={"Soldier"}/>
                                <input className={"amount"}/>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <hr/>
            <div className={"resourcesTransfer-container"}>
                <div className={"iconWithAmount"}>
                    <img src={wood} className={"resource-image"} alt={"Resource"}/>
                    <input className={"amount"}/>
                </div>
                <div className={"iconWithAmount"}>
                    <img src={stone} className={"resource-image"} alt={"Resource"}/>
                    <input className={"amount"} />
                </div>
                <div className={"iconWithAmount"}>
                    <img src={metal} className={"resource-image"} alt={"Resource"}/>
                    <input className={"amount"} />
                </div>
                <div className={"iconWithAmount"}>
                    <img src={food} className={"resource-image"} alt={"Resource"}/>
                    <input className={"amount"} />
                </div>
            </div>
            <button className={"send-transferTYPE"}> Send Soldier and Resources! </button>
        </div>
    );

}

function AttackPage() {
    return (
        <div className={"transferMenu-container"}>
            <div className={"soldierTransfer-container"}>
                {Object.entries(Soldiers).map(([category, images]) => (
                    <div>
                        {Object.entries(images).map((image) => (
                            <div key={image[0]} className={"iconWithAmount"}>
                                <img src={image[1]} className={"soldier-image"} alt={"Soldier"}/>
                                <input className={"amount"}/>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <button className={"send-transferTYPE"}> Send Troops and Attack!</button>
        </div>
    )
}


function EspionagePage() {
    return (
        <button className={"espionage-button"}> ESPIONAGE </button>
    )
}