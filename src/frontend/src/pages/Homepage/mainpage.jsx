import React from 'react'; // Importing React library
import './mainpage.css'; // Importing the CSS file for styling
import Chat from './Communication/chat/chat.jsx';
import SocialBox from "./Communication/social/social.jsx";
import Grid from "./GridView/grid3D.jsx";
import Buildmenu from "./BuildMenu/buildmenu.jsx";
import ResourceBar from "./RecourceBar/resourcebar.jsx";
import Map from "./Map/map.jsx";
import Account from "./Account/account.jsx";

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
          <Account/>
          <Buildmenu/>
          <Grid/>
          <ResourceBar/>

          {/*<Map/>*/}
      </div>
  );
}

export default MainPage; // Exporting the MainPage component
