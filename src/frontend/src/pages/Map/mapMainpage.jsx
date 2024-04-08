import React, {useState} from 'react';
import Map from "./map/map.jsx";
import './mapMainpage.css'
import TransferMenu from "./mapMenu/transfers/transfers.jsx";
import InformationTab from "./mapMenu/information/informationTab.jsx";

function MapMainpage()
{
    const [menuVisible, setMenuVisible] = useState(false)
    const [selectedSettlement, setSelectedSettlement] = useState(null)
    return (
        <div className={"map-mainpage"}>
            {
                menuVisible &&
                (<div className={"menu-info-container"}>
                    <TransferMenu setMenuVisible={setMenuVisible}/>
                </div>)
            }
            <Map setMenuVisible={setMenuVisible} setSelectedSettlement={setSelectedSettlement}/>
        </div>
    );
}

export default MapMainpage;