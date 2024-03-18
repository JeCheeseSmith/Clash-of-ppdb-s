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
    const [type, setType] = useState("")
    return (
        <div className="background"> {/* Container for the background image */}
            <Chat/>
            <SocialBox/>
            <Account/>
            <Buildmenu setClicked={setClicked} setType={setType}/>
            <Grid typeChosen={clicked} type={type}/>
            <ResourceBar/>

            {/*<Map/>*/}
        </div>
    );
}

export default MainPage; // Exporting the MainPage component
