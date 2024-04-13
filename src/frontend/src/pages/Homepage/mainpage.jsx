import React, {useEffect, useState} from 'react'; // Importing React library
import './mainpage.css'; // Importing the CSS file for styling
import Chat from './Communication/chat/chat.jsx';
import SocialBox from "./Communication/social/social.jsx";
import Grid from "./GridBuilder/GridView/grid3D.jsx";
import Buildmenu from "./GridBuilder/BuildMenu/buildmenu.jsx";
import ResourceBar from "./RecourceBar/resourcebar.jsx";
import Account from "./Account/account.jsx";
import SoldierMenu from "./SoldierMenu/soldierMenu.jsx";
import LevelBar from "../Homepage/Level/Level.jsx"
import * as API from "../../api/EndPoints/EndPoints.jsx"
import {useLocation} from "react-router-dom";
import QuestButton from "./Quest/Quest.jsx";
/**
 * Functional component representing the main page of the application.
 * Displays a full-bleed background image.
 */
function MainPage()
{
    const { sid, username } = useLocation().state;
    const [buildings, setBuildings] = useState([])
    const [resources, setResources] = useState({
        wood: 0,
        stone: 0,
        steel: 0,
        food: 0
    });
    useEffect(() =>
    {
        API.getGrid(sid).then(data => setBuildings(data))
        API.get_resources(sid).then(data => setResources(data)) // do this twice, because without the first time, resources are going to be 0
        const intervalId = setInterval(() =>
        {
            API.get_resources(sid).then(data => setResources(data))
        }, 5 * 60 * 1000); // 15 minutes in milliseconds
        return () => clearInterval(intervalId);
    }, []);
    const addBuilding = (type, position, size, occupiedCells) =>
    {
        setBuildings([...buildings, {type, position, size, occupiedCells}]);
    }
    return (
        <div className="background"> {/* Container for the background image */}
            <LevelBar/>
            <QuestButton/>
            <Chat/>
            <SocialBox/>
            <Account/>
            <Buildmenu buildings={buildings} addBuilding={addBuilding} updateRecources={() => API.get_resources(sid).then(data => setResources(data))}/>
            <Grid buildings={buildings} updateResources={() => API.get_resources(sid).then(data => setResources(data))}/>
            <ResourceBar resources={resources}/>
            <SoldierMenu/>

            {/*<Map/>*/}
        </div>
    );
}

export default MainPage; // Exporting the MainPage component
