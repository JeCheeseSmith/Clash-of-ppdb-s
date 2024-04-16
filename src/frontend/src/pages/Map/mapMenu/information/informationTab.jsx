import React, {useEffect, useState} from 'react';
import './informationTab.css'
import Soldiers from "../assets/soldiers.jsx";
import wood from "../assets/wood.png";
import stone from "../assets/stone.png";
import metal from "../assets/metal.png";
import food from "../assets/food.png";
import * as API from '../../../../api/EndPoints/EndPoints.jsx'
import {useLocation} from "react-router-dom";

/**
 * Represents a component for displaying information about a selected object.
 * @param {object} props - The props object.
 * @param {object} props.selectedObject - The selected object.
 * @returns {JSX.Element} InformationTab component.
 */
function InformationTab({selectedObject})
{
    const [dictionary, setDictionary] = useState({})
    const {sid, username} = useLocation().state

    useEffect(() =>
    {
        console.log(selectedObject)
        API.getInfo(selectedObject.idTO, username, selectedObject.toType).then(data =>
        {
            setDictionary(data)
        })
    }, []);

    const resources = resourcesFound(dictionary)
    return (
        <div className={"transferMenu-container"}>
            <div className={"soldierTransfer-container"}>
                {Object.entries(Soldiers).map(([category, images]) => (
                    <div key={category}>
                        {Object.entries(images).map((image) => {
                            const found = soldierFound(dictionary, image[0]);
                            if (found[0])
                            {
                                return (
                                    <div key={image[0]} className={"iconWithAmount"}>
                                        <img src={image[1]} className={"soldier-image"} alt={"Soldier"} />
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
                    <div className={"amount"}>{resources.metal}</div>
                </div>
                <div className={"iconWithAmount"}>
                    <img src={food} className={"resource-image"} alt={"Soldier"}/>
                    <div className={"amount"}>{resources.food}</div>
                </div>
            </div>
        </div>
    );
}

function soldierFound(dictionary, soldierName)
{
    for (let key in dictionary)
    {
        if (key === soldierName)
        {
            return [true, dictionary[key]]
        }
    }
    return [true, null]
}

function resourcesFound(dictionary)
{
    const resourcesDict = {wood: null, stone: null, metal: null, food: null};
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