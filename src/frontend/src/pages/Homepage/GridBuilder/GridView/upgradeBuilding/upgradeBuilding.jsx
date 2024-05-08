import React, {useEffect, useState} from 'react';
import './upgradeBuilding.css'
import '../../../../../globalComponents/timeComponent/TimerProgressBar.jsx'
import TimerProgressBar from "../../../../../globalComponents/timeComponent/TimerProgressBar.jsx";
import DisplayAvatarName from "../../../../../globalComponents/avatarWithName/avatarWithName.jsx";
import {useLocation} from "react-router-dom";
import * as API from "../../../../../api/EndPoints/EndPoints.jsx";
import RequestMassagePopUp from "../../../../../globalComponents/popupMessage/popup.jsx";
import PlaySound from "../../../../../globalComponents/audioComponent/audio.jsx";

/**
 * UpgradeBuilding component for upgrading selected building.
 *
 * @param {Object} props - Component props.
 * @param {Object[]} props.selectedBuilding - Information about the selected building.
 * @param {Function} props.updateResources - Function to update resources.
 * @param {Function} props.updateTimers - Function to update timers.
 * @param {Function} props.getTimer - Function to get timer information.
 * @param {number} props.oldPosition - Old position of the building.
 * @returns {JSX.Element} React component.
 */

function UpgradeBuilding({selectedBuilding, updateResources, updateTimers, getTimer, oldPosition}) {

    const { sid, username } = useLocation().state;
    const [click, setClick] = useState(false);
    const [errormessage, setErrorMessage] = useState(null);
    const [popup, setPopup] = useState(false);
    const [currentTimeValue, setCurrentTimeValue] = useState(null)
    const [currentTotalDuration, setCurrentTotalDuration] = useState(null)

    useEffect(() => {
        const timer = getTimer(selectedBuilding[0].position, "building")
        if (timer[0])
        {
            setClick(true)
            setCurrentTimeValue(timer[1])
            setCurrentTotalDuration(timer[2])
        }
    }, []);

    function HandleUpgradeClick() {
        updateResources()
        if (!click)
        {
            API.upgradeBuilding(oldPosition, sid).then(data =>
            {
                if (data.success)
                {
                    updateTimers()
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