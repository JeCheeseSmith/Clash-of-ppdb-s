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

/**
 * Functional component representing the main page of the application.
 * Displays a full-bleed background image.
 */
function MainPage()
{
    const [buildings, setBuildings] = useState([])
    const sid = localStorage.getItem('sid');
    useEffect(() =>
    {
        const returnData = async () =>
        {
            const data = await GET({"sid":sid}, "/getGrid")
            setBuildings(data)
        }
        returnData();
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
            <Buildmenu buildings={buildings} addBuilding={addBuilding}/>
            <Grid buildings={buildings}/>
            <ResourceBar/>
            <SoldierMenu/>

            {/*<Map/>*/}
        </div>
    );
}

export default MainPage; // Exporting the MainPage component
