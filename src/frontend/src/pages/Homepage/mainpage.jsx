import React from 'react'; // Importing React library
import './mainpage.css'; // Importing the CSS file for styling
import Chat from './Communication/chat/chatBox/chat.jsx';
import SocialBox from "./Communication/social/social.jsx";
import Grid from "./GridView/grid3D.jsx";
import Buildmenu from "./BuildMenu/buildmenu.jsx";
import ResourceBar from "./RecourceBar/resourcebar.jsx";
import LogOut from "./LogOut/logout.jsx";
import Map from "./Map/map.jsx";

/**
 * Functional component representing the main page of the application.
 * Displays a full-bleed background image.
 */
function MainPage()
{
  return (
      <div className="background"> {/* Container for the background image */}
          <Chat/>
          <LogOut/>
          <SocialBox/>
          <Buildmenu/>
          <Grid/>
          <ResourceBar/>

          {/*<Map/>*/}
      </div>
  );
}

export default MainPage; // Exporting the MainPage component
