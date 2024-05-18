import React, {useState} from 'react';
import Map from "./map/map.jsx";
import './mapMainpage.css'
import TransferMenu from "./mapMenu/transfers/transfers.jsx";
import Outpost from "./outpost/outpost.jsx";
import {Loader} from "@react-three/drei";
import {loaderStyles} from "../../globalComponents/loadingScreen/loadingScreen.jsx";
import compass from './map/assets/image-removebg-preview.png'
import Chat from "../Homepage/Communication/chat/chat.jsx";
import SocialBox from "../Homepage/Communication/social/social.jsx";
import Account from "../Homepage/Account/account.jsx";
import LocalTimers from "../../globalComponents/backgroundFunctions/localTimers.jsx";
import ResourceBar from "../Homepage/RecourceBar/resourcebar.jsx";

/**
 * Represents the main page of the map component.
 * @returns {JSX.Element} MapMainpage component.
 */
function MapMainpage()
{
    const [menuVisible, setMenuVisible] = useState(false)
    const [selectedObject, setSelectedObject] = useState(null)
    const [outpostChosen, setOutpostChosen] = useState(false)
    const [resources, setResources] = useState({wood: 0,stone: 0,steel: 0,food: 0});
    const [settlements, setSettlements] = useState([])
    const [timers, setTimers] = useState([])
    const [callForUpdate, setCallForUpdate] = useState(false)

    const handleOutpostButton = () =>
    {
        setOutpostChosen(!outpostChosen)
        setMenuVisible(false)
    }
    return (
        <div className={"map-mainpage"}>
            <Loader {...loaderStyles} />
            {
                menuVisible &&
                (<div className={"menu-info-container"}>
                    <TransferMenu selectedObject={selectedObject}
                                  setMenuVisible={setMenuVisible}
                                  outpostChosen={outpostChosen}
                                  setCallForUpdate={setCallForUpdate}
                                  setTimers={setTimers}
                    />
                </div>)
            }
            <ResourceBar resources={resources} setCallForUpdate={setCallForUpdate}/>
            <Outpost onClickFunction={handleOutpostButton}/>
            <Chat/>
            <Account/>
            <img src={compass} alt={"compass"} className={"compass"}/>
            <Map setMenuVisible={setMenuVisible}
                 setSelectedObject={setSelectedObject}
                 outpostChosen={outpostChosen}
                 setOutpostChosen={setOutpostChosen}
                 timers={timers}
                 settlements={settlements}
            />
            <LocalTimers setResources={setResources}
                         setSettlements={setSettlements}
                         timers={timers}
                         setTimers={setTimers}
                         callForUpdate={callForUpdate}
                         setCallForUpdate={setCallForUpdate}
            />
        </div>
    );
}

export default MapMainpage;