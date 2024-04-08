import React, {useState} from 'react';
import './informationTab.css'
import Soldiers from "../assets/soldiers.jsx";
import wood from "../assets/wood.png";
import stone from "../assets/stone.png";
import metal from "../assets/metal.png";
import food from "../assets/food.png";

function InformationTab()
{
    const dictionary = {ArmoredFootman:1, Huskarl:2, OrderKnight:3, Horseman:10, Knight:5, Militia:18, food:5, wood:25}
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
    const resourcesDict = {wood: 0, stone: 0, metal: 0, food: 0};
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