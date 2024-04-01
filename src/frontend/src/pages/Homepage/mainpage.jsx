import React, {useEffect, useState} from 'react'; // Importing React library
import './mainpage.css'; // Importing the CSS file for styling
import Chat from './Communication/chat/chat.jsx';
import SocialBox from "./Communication/social/social.jsx";
import Grid from "./GridBuilder/GridView/grid3D.jsx";
import Buildmenu from "./GridBuilder/BuildMenu/buildmenu.jsx";
import ResourceBar from "./RecourceBar/resourcebar.jsx";
import Map from "./Map/map.jsx";
import Account from "./Account/account.jsx";
import SoldierMenu from "./SoldierMenu/soldierMenu.jsx";
import GET from "../../api/GET.jsx";
import POST from "../../api/POST.jsx";
import Buildings from "./GridBuilder/buildings.jsx";

/**
 * Functional component representing the main page of the application.
 * Displays a full-bleed background image.
 */
function MainPage()
{
    const sid = localStorage.getItem('sid');
    const [buildings, setBuildings] = useState([])
    const [resources, setResources] = useState({
        wood: 0,
        stone: 0,
        steel: 0,
        food: 0
    });
    const getBuildings = async () =>
    {
        const data = await GET({"sid":sid}, "/getGrid")
        setBuildings(data.grid)
    }
    const getResources = async () =>
    {
        const data = await POST({ id: sid }, '/resources');
        // The values of the resources are changed
        setResources({
          wood: data.wood,
          stone: data.stone,
          steel: data.steel,
          food: data.food
        });
    }
    useEffect(() =>
    {
        getResources();
        getBuildings();
    }, []);
    const addBuilding = (type, position, size, occupiedCells) =>
    {
        setBuildings([...buildings, {type, position, size, occupiedCells}]);
    }
    return (
        <div className="background"> {/* Container for the background image */}
            <Chat/>
            <SocialBox/>
            <Account/>
            <Buildmenu buildings={buildings} addBuilding={addBuilding} updateRecources={getResources}/>
            <Grid buildings={buildings}/>
            <ResourceBar resources={resources}/>
            <SoldierMenu/>

            {/*<Map/>*/}
        </div>
    );
}

export default MainPage; // Exporting the MainPage component
