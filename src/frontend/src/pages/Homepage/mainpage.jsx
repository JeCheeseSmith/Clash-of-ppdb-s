import React, {useState} from 'react'; // Importing React library
import './mainpage.css'; // Importing the CSS file for styling
import Chat from './Communication/chat/chat.jsx';
import SocialBox from "./Communication/social/social.jsx";
import Grid from "./GridBuilder/GridView/grid3D.jsx";
import Buildmenu from "./GridBuilder/BuildMenu/buildmenu.jsx";
import ResourceBar from "./RecourceBar/resourcebar.jsx";
import Map from "./Map/map.jsx";
import Account from "./Account/account.jsx";
import SoldierMenu from "./SoldierMenu/soldierMenu.jsx";

/**
 * Functional component representing the main page of the application.
 * Displays a full-bleed background image.
 */
function MainPage()
{
    const [buildings, setBuildings] = useState([])
    const addBuilding = (type, position, size, occupiedCells) =>
    {
        setBuildings([...buildings, { type, position, size, occupiedCells}]);
    }

    return (
        <div className="background"> {/* Container for the background image */}
            <Chat/>
            <SocialBox/>
            <Account/>
            <Buildmenu buildings={buildings} addBuilding={addBuilding} updateBuildings={setBuildings}/>
            <Grid buildings={buildings} updateBuildings={setBuildings}/>
            <ResourceBar/>
            <SoldierMenu/>

            {/*<Map/>*/}
        </div>
    );
}

export default MainPage; // Exporting the MainPage component
