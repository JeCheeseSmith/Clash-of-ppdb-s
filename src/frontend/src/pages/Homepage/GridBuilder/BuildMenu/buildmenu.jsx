import React, { useState, useEffect, useRef } from 'react';
import './buildmenu.css'
import './buildmenuOptionsContents.css'
import WoodCuttersCamp from './Assets/house.png';
import Quarry from './Assets/quarry.png';
import SteelMine from './Assets/steelmine.png';
import Farm from './Assets/farm.png';
import Stables from './Assets/stable.png';
import ArcherTower from './Assets/archertower.png';
import LookoutTower from './Assets/lookouttower.png';
import BlackSmith from './Assets/blacksmith.png';
import Tavern from './Assets/tavern.png';
import TrainingYard from './Assets/trainingyard.png';

/**
 * BuildMenu component function definition.
 * This component represents a button that toggles the visibility of a build menu.
 * @returns {JSX.Element} JSX representation of the BuildMenu component.
 */

function BuildMenu({setClicked, setType})
{
  // State variable to track the visibility of the build menu
  const [menuVisible, setMenuVisible] = useState(false);

  const buildType = (type) =>
  {
      setClicked(true)
      setType(type)
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
        <BuildOptions menuVisible={menuVisible} setMenuVisible={setMenuVisible} buildType={buildType}/>
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
function BuildOptions({ menuVisible, setMenuVisible, buildType}) {
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
      {menuVisible && (
          <div>
            {currentPage === 'Production' && <Production buildType={buildType}/>}
            {currentPage === 'Defense' && <Defense buildType={buildType}/>}
            {currentPage === 'Storage' && <Storage buildType={buildType}/>}
            {currentPage === 'Governmental' && <Governmental buildType={buildType}/>}
            {currentPage === 'Military' && <Military buildType={buildType}/>}
        </div>
      )}
    </div>
  );
}



function Production({buildType})
{
  return (
    <div className="type-container">
      <div className="image-scroll-container">
        <img src={WoodCuttersCamp} className="small-image" onClick={() => buildType("WoodCuttersCamp")}/>
        <img src={Quarry} className="small-image" onClick={() => buildType("Quarry")}/>
        <img src={SteelMine} className="small-image" onClick={() => buildType("SteelMine")}/>
        <img src={Farm} className="small-image" onClick={() => buildType("Farm")}/>
      </div>
    </div>
  );
}

function Defense({buildType}) {
  return (
      <div className="type-container">
        <div className="image-scroll-container">
        <img src={Stables} className="small-image"  onClick={() => buildType("Stables")}/>
        <img src={ArcherTower} className="small-image" onClick={() => buildType("ArcherTower")}/>
        <img src={LookoutTower} className="small-image" onClick={() => buildType("LookoutTower")}/>
        <img src={BlackSmith} className="small-image" onClick={() => buildType("BlackSmith")}/>
        <img src={Tavern} className="small-image" onClick={() => buildType("Tavern")}/>
        <img src={TrainingYard} className="small-image" onClick={() => buildType("TrainingYard")}/>
      </div>
    </div>
  );
}

function Storage({buildType})
{
  return (
    <div className="type-container">
      <div className="image-scroll-container">
        <img src={ArcherTower} className="small-image" onClick={() => buildType("GrainSilo")}/>
        <img src={ArcherTower} className="small-image" onClick={() => buildType("StoneStockpile")}/>
        <img src={ArcherTower} className="small-image" onClick={() => buildType("Armory")}/>
        <img src={ArcherTower} className="small-image" onClick={() => buildType("Wood Stockpile")}/>
      </div>
    </div>
  );
}

function Governmental({buildType})
{
  return (
    <div className="type-container">
        <div className="image-scroll-container">
            <img src={Stables} className="small-image" onClick={() => buildType("Castle")}/>
        </div>
    </div>
  );
}

function Military({buildType})
{
  return (
    <div className="type-container">
      <div className="image-scroll-container">
        <img src={Farm} className="small-image" onClick={() => buildType("Barracks")}/>
      </div>
    </div>
  );
}
export default BuildMenu;
