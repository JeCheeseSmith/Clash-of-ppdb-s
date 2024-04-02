import React, { useState, useEffect } from 'react';
import './upgradeBuilding.css'
import '../../../../../globalComponents/timeComponent/TimerProgressBar.jsx'
import TimerProgressBar from "../../../../../globalComponents/timeComponent/TimerProgressBar.jsx";
import DisplayAvatarName from "../../../../../globalComponents/avatarWithName/avatarWithName.jsx";

function UpgradeBuilding({selectedBuilding}) {

    const [time, setTime] = useState(null);
    const [click, setClick] = useState(false);

    async function HandleUpgradeClick() {
        //const data = await GET({}, '/update');
        if (true) {
            setClick(true);
            setTime(20);
        }
    }

    return (
        <div className="button-container">
            <DisplayAvatarName type={"building-selected"} name={selectedBuilding[0].type}/>
            {click && <TimerProgressBar timeValue={time} finished={setClick}/>}
            {!click && <button className="upgrade-button" onClick={HandleUpgradeClick}> Upgrade</button>}
        </div>
    );
}

export default UpgradeBuilding;