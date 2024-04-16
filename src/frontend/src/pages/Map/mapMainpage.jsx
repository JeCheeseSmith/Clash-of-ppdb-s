import React, {useState} from 'react';
import Map from "./map/map.jsx";
import './mapMainpage.css'
import TransferMenu from "./mapMenu/transfers/transfers.jsx";
import Outpost from "./outpost/outpost.jsx";

function MapMainpage()
{
    const [menuVisible, setMenuVisible] = useState(false)
    const [selectedObject, setSelectedObject] = useState(null)
    const [outpostChosen, setOutpostChosen] = useState(false)

    const handleOutpostButton = () =>
    {
        setOutpostChosen(!outpostChosen)
    }
    return (
        <div className={"map-mainpage"}>
            {
                menuVisible &&
                (<div className={"menu-info-container"}>
                    <TransferMenu selectedObject={selectedObject}
                                  setMenuVisible={setMenuVisible}
                                  outpostChosen={outpostChosen}
                                  setOutpostChosen={setOutpostChosen}
                    />
                </div>)
            }
            <Outpost onClickFunction={handleOutpostButton}/>
            <Map setMenuVisible={setMenuVisible}
                 setSelectedObject={setSelectedObject}
                 outpostChosen={outpostChosen}
                 setOutpostChosen={setOutpostChosen}/>
        </div>
    );
}

export default MapMainpage;