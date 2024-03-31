import React, { useState, useEffect } from 'react';
import './upgradeBuilding.css'
import '../../../../../globalComponents/timeComponent/TimerProgressBar.jsx'
import TimerProgressBar from "../../../../../globalComponents/timeComponent/TimerProgressBar.jsx";

function UpgradeBuilding() {

    const [time, setTime] = useState(null);
    const [click, setClick] = useState(false);

    async function HandleUpgradeClick() {
        //const data = await GET({}, '/update');
        if (true) {
            setClick(true);
            setTime(20);
        }
    }

    console.log(click)

    return (
        <div className="button-container">
            {click && <TimerProgressBar timeValue={time} finished={setClick}/>}
            {!click && <button className="upgrade-button" onClick={HandleUpgradeClick}> Upgrade</button>}
        </div>
    );
}

export default UpgradeBuilding;