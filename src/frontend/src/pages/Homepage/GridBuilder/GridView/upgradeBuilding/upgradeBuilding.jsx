import React, {useEffect, useState} from 'react';
import './upgradeBuilding.css'
import '../../../../../globalComponents/timeComponent/TimerProgressBar.jsx'
import TimerProgressBar from "../../../../../globalComponents/timeComponent/TimerProgressBar.jsx";
import DisplayAvatarName from "../../../../../globalComponents/avatarWithName/avatarWithName.jsx";
import {useLocation} from "react-router-dom";
import * as API from "../../../../../api/EndPoints/EndPoints.jsx";
import RequestMassagePopUp from "../../../../../globalComponents/popupMessage/popup.jsx";
import PlaySound from "../../../../../globalComponents/audioComponent/audio.jsx";


function UpgradeBuilding({selectedBuilding, timers, addTimer}) {

    const { sid, username } = useLocation().state;
    const [click, setClick] = useState(false);
    const [errormessage, setErrorMessage] = useState(null);
    const [popup, setPopup] = useState(false);
    const [currentTimeValue, setCurrentTimeValue] = useState(null)
    const [currentTotalDuration, setCurrentTotalDuration] = useState(null)

    const getTimer = (ID) =>
    {
        let duration = [false, 0, 0]
        for (let timer of timers) {
            if (timer.ID === ID) {
                return [true, timer.duration, timer.totalDuration]
            }
        }
        return duration
    }

    useEffect(() => {
        const timer = getTimer(selectedBuilding[0].position)
        if (timer[0])
        {
            setClick(true)
            setCurrentTimeValue(timer[1])
            setCurrentTotalDuration(timer[2])
        }
    }, []);

    function HandleUpgradeClick() {
        if (!click)
        {
            API.upgradeBuilding(selectedBuilding[0].position, sid).then(data =>
            {
                if (data.success)
                {
                    addTimer(selectedBuilding[0].position, data.duration, data.duration)
                    setCurrentTimeValue(data.duration)
                    setCurrentTotalDuration(data.duration)
                    setClick(true)
                }
                else
                {
                    setErrorMessage(data.error);
                    setPopup(true)
                    const promise = PlaySound("ResourcesError")
                }
            })
        }
    }

    return (
        <div>
            <div className="button-container">
                <DisplayAvatarName type={"building-selected"} name={selectedBuilding[0].type}/>
                {!click && <button className="upgrade-button" onClick={HandleUpgradeClick}> Upgrade</button>}
                {click && <TimerProgressBar timeValue={currentTimeValue}  totalTimeValue={currentTotalDuration} finished={setClick}/>}
            </div>
            {popup && <RequestMassagePopUp message={errormessage} setPopup={setPopup}/>}
        </div>
    );
}

export default UpgradeBuilding;