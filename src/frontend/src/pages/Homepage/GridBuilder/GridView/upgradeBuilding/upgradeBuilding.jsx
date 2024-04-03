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
        console.log("(2)(a) Timers at getTimer: ", timers)
        for (let timer of timers) {
            console.log("(2)(b) Timer found at getTimer: ", timer.ID)
            console.log("(2)(b) ID requested at getTimer: ", ID)
            if (timer.ID[0] === ID[0] && timer.ID[1] === ID[1]) {
                return [true, timer.duration, timer.totalDuration]
            }
        }
        return duration
    }

    useEffect(() => {
        const selected = `${selectedBuilding[0].type}, ${selectedBuilding[0].position}`
        console.log(`(1) Currently Selected Building IS ->   ${selected}`)
        const timer = getTimer(selectedBuilding[0].position)
        console.log("(3) Timer found for: ", selected, " IS THIS: ", timer)
        if (timer[0])
        {
            console.log("(4) Timer found for: ",timer, " AND CLICK -> TRUE")
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