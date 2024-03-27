import React, {useState} from 'react';
import './buildmenu.css'
import BuildmenuOptionsContents from "./buildmenuOptionsContents.jsx";

/**
 * BuildMenu component function definition.
 * This component represents a button that toggles the visibility of a build menu.
 * @returns {JSX.Element} JSX representation of the BuildMenu component.
 */

function BuildMenu({addBuilding, buildings})
{
  // State variable to track the visibility of the build menu
  const [menuVisible, setMenuVisible] = useState(false);

  const addBuildable = (type, position, size, occupiedCells) =>
  {
      addBuilding(type, position, size, occupiedCells)
  };


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
        <BuildOptions menuVisible={menuVisible} setMenuVisible={setMenuVisible} addBuildable={addBuildable} buildings={buildings}/>
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
function BuildOptions({ menuVisible, setMenuVisible, addBuildable, buildings}) {
  // State variable to track the current page
  const [currentPage, setCurrentPage] = useState('Production');

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
              <button onClick={() => handleButtonClick('Production')} className={"type-button"}>
                Production
              </button>
            </li>
            <li>
              <button onClick={() => handleButtonClick('Defense')} className={"type-button"}>
                Defense
              </button>
            </li>
            <li>
              <button onClick={() => handleButtonClick('Storage')} className={"type-button"}>
                Storage
              </button>
            </li>
            <li>
              <button onClick={() => handleButtonClick('Governmental')} className={"type-button"}>
                Governmental
              </button>
            </li>
            <li>
              <button onClick={() => handleButtonClick('Military')} className={"type-button"}>
                Military
              </button>
            </li>
          </ul>
        </nav>
      )}
      {/* Rendering content based on the current page */}
      {menuVisible && (<BuildmenuOptionsContents currentPage={currentPage} addBuildable={addBuildable} buildings={buildings}/>)}
    </div>
  );
}

export default BuildMenu;
