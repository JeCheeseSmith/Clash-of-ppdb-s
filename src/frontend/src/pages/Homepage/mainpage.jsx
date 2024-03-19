import React, {useState} from 'react'; // Importing React library
import './mainpage.css'; // Importing the CSS file for styling
import Chat from './Communication/chat/chat.jsx';
import SocialBox from "./Communication/social/social.jsx";
import Grid from "./GridBuilder/GridView/grid3D.jsx";
import Buildmenu from "./GridBuilder/BuildMenu/buildmenu.jsx";
import ResourceBar from "./RecourceBar/resourcebar.jsx";
import Map from "./Map/map.jsx";
import Account from "./Account/account.jsx";

/**
 * Functional component representing the main page of the application.
 * Displays a full-bleed background image.
 */
function MainPage()
{
    const [clicked, setClicked] = useState(false)
    const [type, setType] = useState("") // update type voor de juiste model jsx file te pakken in grid3D.jsx
    const [position, setPosition] = useState("")
    const [buildings, setBuildings] = useState([/*{type:"WoodCuttersCamp", position:[5,5]}*/])
    const addBuilding = (type, position) =>
    {
        const isDuplicate = buildings.some(building => building.type === type);
        if (!isDuplicate)
        {
            setBuildings([...buildings, { type, position }]);
        }
    }


    return (
        <div className="background"> {/* Container for the background image */}
            <Chat/>
            <SocialBox/>
            <Account/>
            <Buildmenu setClicked={setClicked} addBuilding={addBuilding} setType={setType} setPosition={setPosition}/>
            <Grid setClicked={setClicked} clicked={clicked} buildings={buildings} type={type} position={position}/>
            <ResourceBar/>

            {/*<Map/>*/}
        </div>
    );
}

export default MainPage; // Exporting the MainPage component
