import React, {useEffect, useState} from 'react';
import './informationTab.css'
import Soldiers from "../assets/soldiers.jsx";
import wood from "../assets/wood.png";
import stone from "../assets/stone.png";
import metal from "../assets/metal.png";
import food from "../assets/food.png";
import * as API from '../../../../api/EndPoints.jsx'
import {useLocation, useNavigate} from "react-router-dom";

/**
 * Represents a component for displaying information about a selected object and navigating to it (if outpost).
 * @param {Object} props - The props object.
 * @param {Object} props.selectedObject - The selected object.
 * @returns {JSX.Element} InformationTab component.
 */
function InformationTab({selectedObject})
{
    let {sid, username} = useLocation().state
    const [dictionary, setDictionary] = useState({})
    const [outpostSelected, setOutpostSelected] = useState(false)
    const [mainSettlementSelected, setMainSettlementSelected] = useState(false)
    const [sidSettlementSelected, setSidSettlementSelected] = useState(null)
    let navigate = useNavigate();
    useEffect(() =>
    {
        API.getInfo(selectedObject.idTO, username, selectedObject.toType).then(data =>
        {
            setDictionary(data)
            if (data.me && data.outpost) // outpost settlement
            {
                setOutpostSelected(true)
            }
            if (data.me && !data.outpost) // main settlement
            {
                setMainSettlementSelected(true)
            }
            setSidSettlementSelected(data.id)
        })
    }, []);

    const handleNavigationButton = () =>
    {
        navigate('/MainPage', { state: { sid:parseInt(sidSettlementSelected), username }});
    }
    const resources = resourcesFound(dictionary)
    return (
        <div className={"transferMenu-container"}>
            <div className={"mapMenu-info"}>
                Unearth hidden armies and treasures awaiting liberation. Engage in ESPIONAGE for further enlightenment!
            </div>
            <div className={"soldierTransfer-container"}>
                {Object.entries(Soldiers).map(([category, images]) => (
                    <div key={category}>
                        {Object.entries(images).map((image) => {
                            const found = soldierFound(dictionary, image[0], sid, sidSettlementSelected);
                            if (found[0]) {
                                return (
                                    <div key={image[0]} className={"iconWithAmount"}>
                                        <img src={image[1]} className={"soldier-image"} alt={"Soldier"}/>
                                        <div className={"amount"}>{found[1]}</div>
                                    </div>
                                );
                            }
                        })}
                    </div>
                ))}
            </div>
            <hr/>
            <div className={"resourcesTransfer-container"}>
                <div className={"iconWithAmount"}>
                    <img src={wood} className={"resource-image"} alt={"Soldier"}/>
                    <div className={"amount"}>{resources.wood}</div>
                </div>
                <div className={"iconWithAmount"}>
                    <img src={stone} className={"resource-image"} alt={"Soldier"}/>
                    <div className={"amount"}>{resources.stone}</div>
                </div>
                <div className={"iconWithAmount"}>
                    <img src={metal} className={"resource-image"} alt={"Soldier"}/>
                    <div className={"amount"}>{resources.steel}</div>
                </div>
                <div className={"iconWithAmount"}>
                    <img src={food} className={"resource-image"} alt={"Soldier"}/>
                    <div className={"amount"}>{resources.food}</div>
                </div>
            </div>
            {outpostSelected && !selectedObject.toType && <button className={"navigation outpost"} onClick={handleNavigationButton}> Adventure Awaits at your Outpost! </button>}
            {mainSettlementSelected && !selectedObject.toType && <button className={"navigation main"} onClick={handleNavigationButton}> Go Back To Your Main Settlement! </button>}
        </div>
    );
}

function soldierFound(dictionary, soldierName, sid, sidSettlementSelected)
{
    for (let key in dictionary)
    {
        if (key === soldierName)
        {
            return [true, dictionary[key]]
        }
        else if (sid === parseInt(sidSettlementSelected))
        {
            return [true, "Zzz...   "];
        }
    }
    return [true, "?"]
}

function resourcesFound(dictionary)
{
    const resourcesDict = {wood: null, stone: null, steel: null, food: null};
    for (let key in dictionary)
    {
        if (resourcesDict.hasOwnProperty(key))
        {
            resourcesDict[key] = dictionary[key];
        }
    }
    return resourcesDict;
}

export default InformationTab;