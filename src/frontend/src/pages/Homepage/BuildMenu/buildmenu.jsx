import React, { useState, useEffect, useRef } from 'react';
import './buildmenu.css'
import './buildmenuOptionsContents.css'
import castleIcon1 from '../../../assets/castle-icon.png';

/**
 * BuildMenu component function definition.
 * This component represents a button that toggles the visibility of a build menu.
 * @returns {JSX.Element} JSX representation of the BuildMenu component.
 */
function BuildMenu() {
  // State variable to track the visibility of the build menu
  const [menuVisible, setMenuVisible] = useState(false);

  /**
   * Function to toggle the visibility of the build menu.
   */
  const toggleMenuVisibility = () => {
    setMenuVisible(!menuVisible);
  };

  // Rendering the BuildMenu component
  return (
    <div>
      {/* Button to toggle the visibility of the build menu */}
      <button onClick={toggleMenuVisibility} className={`toggle-menu-button ${menuVisible ? 'visible' : 'hidden'}`}>
        {/* Content of the toggle menu button */}
        <div>
          {/* Text indicating the action */}
          <span className="build">Build</span>
          <br />
          {/* Text indicating the type of menu */}
          <span className="menu">Menu</span>
        </div>
        {/* Container for an image */}
        <div className="image-container"></div>
      </button>
      {/* Rendering the BuildOptions component with visibility controlled by the 'menuVisible' state */}
      <div>
        <BuildOptions menuVisible={menuVisible} setMenuVisible={setMenuVisible} />
      </div>
    </div>
  );
}

/**
 * BuildOptions component function definition.
 * This component renders a set of options based on the current page.
 * @param {Object} props - Properties passed to the component.
 * @param {boolean} props.menuVisible - Indicates whether the menu is visible or not.
 * @param {Function} props.setMenuVisible - Function to set the visibility of the menu.
 * @returns {JSX.Element} JSX representation of the BuildOptions component.
 */
function BuildOptions({ menuVisible, setMenuVisible }) {
  // State variable to track the current page
  const [currentPage, setCurrentPage] = useState('Type1');

  /**
   * Function to handle button click event and change the current page.
   * @param {string} pageName - Name of the page to set as current.
   */
  const handleButtonClick = (pageName) => {
    setCurrentPage(pageName);
  };

  /**
   * Function to handle close button click event and hide the menu.
   */
  const handleCloseButton = () => {
    setMenuVisible(false);
  };

  // Rendering the BuildOptions component
  return (
    <div className="buildoptions-container">
      {/* Button to close the menu */}
      <button className={`closeMenu ${menuVisible ? 'visible' : 'hidden'}`} onClick={handleCloseButton}>close</button>
      {/* Rendering options if menu is visible */}
      {menuVisible && (
        <nav className="options-content">
          <ul className="buildoptions-links">
            {/* List of options */}
            <li>
              <button onClick={() => handleButtonClick('Type1')} className={"type-button"}>
                Army
              </button>
            </li>
            <li>
              <button onClick={() => handleButtonClick('Type2')} className={"type-button"}>
                Defences
              </button>
            </li>
            <li>
              <button onClick={() => handleButtonClick('Type3')} className={"type-button"}>
                Traps
              </button>
            </li>
            <li>
              <button onClick={() => handleButtonClick('Type4')} className={"type-button"}>
                Decorations
              </button>
            </li>
          </ul>
        </nav>
      )}
      {/* Rendering content based on the current page */}
      {menuVisible && (
        <div>
          {currentPage === 'Type1' && <Type1 />}
          {currentPage === 'Type2' && <Type2 />}
          {currentPage === 'Type3' && <Type3 />}
          {currentPage === 'Type4' && <Type4 />}
        </div>
      )}
    </div>
  );
}



function Type1()
{
  const handleClick = (type) =>
  {
      console.log(`${type} clicked`);
  };

  return (
    <div className="type-container">
      <div className="image-scroll-container">
        <img src={castleIcon1} alt="Image 1" className="small-image" onClick={() => handleClick("House")} />
        <img src={castleIcon1} alt="Image 2" className="small-image" onClick={() => handleClick("House")} />
        <img src={castleIcon1} alt="Image 3" className="small-image" onClick={() => handleClick("House")} />
        <img src={castleIcon1} alt="Image 3" className="small-image" onClick={() => handleClick("House")} />
      </div>
    </div>
  );
}

function Type2()
{
  return (
    <div className="type-container">
      <div className="image-scroll-container">
        <img src={castleIcon1} alt="Image 4" className="small-image"/>
        <img src={castleIcon1} alt="Image 5" className="small-image"/>
      </div>
    </div>
  );
}

function Type3()
{
  return (
    <div className="type-container">
      <div className="image-scroll-container">
        <img src={castleIcon1} alt="Image 7" className="small-image"/>
        <img src={castleIcon1} alt="Image 8" className="small-image"/>
        <img src={castleIcon1} alt="Image 9" className="small-image"/>
      </div>
    </div>
  );
}

function Type4()
{
  return (
    <div className="type-container">
      <div className="image-scroll-container">
        <img src={castleIcon1} alt="Image 10" className="small-image"/>
        <img src={castleIcon1} alt="Image 11" className="small-image"/>
        <img src={castleIcon1} alt="Image 12" className="small-image"/>
        <img src={castleIcon1} alt="Image 12" className="small-image"/>
        <img src={castleIcon1} alt="Image 12" className="small-image"/>
        <img src={castleIcon1} alt="Image 12" className="small-image"/>
        <img src={castleIcon1} alt="Image 12" className="small-image"/>
        <img src={castleIcon1} alt="Image 12" className="small-image"/>
        <img src={castleIcon1} alt="Image 12" className="small-image"/>
      </div>
    </div>
  );
}

export default BuildMenu;
