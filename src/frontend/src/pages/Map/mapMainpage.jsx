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

/**
 * Represents the main page of the map component.
 * @returns {JSX.Element} MapMainpage component.
 */
function MapMainpage()
{
    const [menuVisible, setMenuVisible] = useState(false)
    const [selectedObject, setSelectedObject] = useState(null)
    const [outpostChosen, setOutpostChosen] = useState(false)

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
                    />
                </div>)
            }
            <Outpost onClickFunction={handleOutpostButton}/>
            <Chat/>
            <SocialBox/>
            <Account/>
            <img src={compass} alt={"compass"} className={"compass"}/>
            <Map setMenuVisible={setMenuVisible}
                 setSelectedObject={setSelectedObject}
                 outpostChosen={outpostChosen}
                 setOutpostChosen={setOutpostChosen}/>
        </div>
    );
}

export default MapMainpage;