import React, {useEffect, useState} from 'react';
import Map from "./map/map.jsx";
import './mapMainpage.css'
import TransferMenu from "./mapMenu/transfers/transfers.jsx";
import Outpost from "./outpost/outpost.jsx";
import {Loader} from "@react-three/drei";
import {loaderStyles} from "../../globalComponents/loadingScreen/loadingScreen.jsx";
import compass from './map/assets/image-removebg-preview.png'
import Chat from "../Homepage/Communication/chat/chat.jsx";
import Account from "../Homepage/Account/account.jsx";
import LocalTimers from "../../globalComponents/backgroundFunctions/localTimers.jsx";
import ResourceBar from "../Homepage/RecourceBar/resourcebar.jsx";
import backgroundMusic from "../../globalComponents/audioComponent/assets/BackgroundMusicMap.mp3";

/**
 * Represents the main page of the map component.
 *
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
    const [instantCallForUpdate, setInstantCallForUpdate] = useState(false)
    const [refresh, setRefresh] = useState(true)
    const intro = false
    const [fadeIn, setFadeIn] = useState(false);
    const [isBackgroundAudioEnabled, setIsBackgroundAudioEnabled] = useState(true)
    const handleOutpostButton = () =>
    {
        setOutpostChosen(!outpostChosen)
        setMenuVisible(false)
    }
    useEffect(() =>
    {
        if (!intro)
        {
            setFadeIn(true);
        }
    }, [intro]);
    useEffect(() =>
    {
        if (!intro && isBackgroundAudioEnabled)
        {
            const audio = new Audio(backgroundMusic);
            audio.loop = true; // Loop the audio
            audio.play();
            return () =>
            {
                audio.pause(); // Pause the audio when component unmounts
            };
        }
    }, [backgroundMusic, intro, isBackgroundAudioEnabled]);
    return (
        <div className={`map-mainpage fade-in ${fadeIn ? 'fade-in-visible' : ''}`}>
            <Loader {...loaderStyles} />
            {
                menuVisible &&
                (<div className={"menu-info-container"}>
                    <TransferMenu selectedObject={selectedObject}
                                  setMenuVisible={setMenuVisible}
                                  outpostChosen={outpostChosen}
                                  setInstantCallForUpdate={setInstantCallForUpdate}
                    />
                </div>)
            }
            <ResourceBar resources={resources} refresh={refresh} refreshFunction={() =>
            {
                setCallForUpdate(true)
                setRefresh(false)
            }}
            />
            <Outpost onClickFunction={handleOutpostButton}/>
            <Chat/>
            <Account isBackgroundAudioEnabled={isBackgroundAudioEnabled} setIsBackgroundAudioEnabled={setIsBackgroundAudioEnabled}/>
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
                         instantCallForUpdate={instantCallForUpdate}
                         setInstantCallForUpdate={setInstantCallForUpdate}
                         refresh={refresh}
                         setRefresh={setRefresh}
            />
        </div>
    );
}

export default MapMainpage;