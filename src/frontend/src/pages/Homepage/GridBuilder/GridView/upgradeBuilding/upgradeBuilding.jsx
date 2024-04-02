import React, { useState, useEffect } from 'react';
import './upgradeBuilding.css'
import '../../../../../globalComponents/timeComponent/TimerProgressBar.jsx'
import TimerProgressBar from "../../../../../globalComponents/timeComponent/TimerProgressBar.jsx";
import DisplayAvatarName from "../../../../../globalComponents/avatarWithName/avatarWithName.jsx";
import {useLocation} from "react-router-dom";
import * as API from "../../../../../api/EndPoints/EndPoints.jsx";
import RequestMassagePopUp from "../../../../../globalComponents/popupMessage/popup.jsx";
import notEnough from "../../../../../assets/notEnough.mp3";


function UpgradeBuilding({selectedBuilding}) {

    const { sid, username } = useLocation().state;
    const [upgrade, setUpgrade] = useState(false)
    const [time, setTime] = useState(null);
    const [click, setClick] = useState(false);
    const [errormessage, setErrorMessage] = useState(null);
    const [popup, setPopup] = useState(false);

    async function HandleUpgradeClick() {
        API.upgradeBuilding(selectedBuilding[0].position, sid).then(data => {
            console.log(data);
            setUpgrade(data.succes);
            if (upgrade) {
                setTime(data.duration)
            }
        })
        if (upgrade) {
            setClick(true);
        }
        else {
            setErrorMessage('Not enough resources');
            setPopup(true)
            const sound = new Audio(notEnough);
            await sound.play();
        }
    }

    return (
        <div className="button-container">
            <DisplayAvatarName type={"building-selected"} name={selectedBuilding[0].type}/>
            {popup && <RequestMassagePopUp message={errormessage} setPopup={setPopup}/>}
            {click && <TimerProgressBar timeValue={time} finished={setClick}/>}
            {!click && <button className="upgrade-button" onClick={HandleUpgradeClick}> Upgrade</button>}
        </div>
    );
}

export default UpgradeBuilding;