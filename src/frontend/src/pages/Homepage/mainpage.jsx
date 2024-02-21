import React from 'react'; // Importing React library
import gameBackground from '../../assets/background.jpg'; // Importing the background image
import './mainpage.css'; // Importing the CSS file for styling

/**
 * Functional component representing the main page of the application.
 * Displays a full-bleed background image.
 */
function MainPage() {
  return (
    <div className="image-container"> {/* Container for the background image */}
      <img src={gameBackground} alt="" /> {/* Background image */}
    </div>
  );
}

export default MainPage; // Exporting the MainPage component
