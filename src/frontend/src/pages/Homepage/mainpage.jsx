import React from 'react'; // Importing React library
import './mainpage.css'; // Importing the CSS file for styling
import Chat from './Communication/chat/chat.jsx';
import SocialBox from "./Communication/social/social.jsx";
import Grid from "./GridView/grid3D.jsx";
import Buildmenu from "./BuildMenu/buildmenu.jsx";
import ResourceBar from "./RecourceBar/resourcebar.jsx";

/**
 * Functional component representing the main page of the application.
 * Displays a full-bleed background image.
 */
function MainPage()
{
    return (
        <div className="background"> {/* Container for the background image */}
            <Chat/>
            <SocialBox/>
            <Buildmenu/>
            <Grid/>
            <ResourceBar/>
        </div>
    );
}

export default MainPage; // Exporting the MainPage component
