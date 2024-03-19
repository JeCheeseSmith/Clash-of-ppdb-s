import React, {useState} from 'react';
import './buildmenu.css'
import './buildmenuOptionsContents.css'
import WoodCuttersCamp from './Assets/woodcutterscamp.png';
import Quarry from './Assets/quarry.png';
import SteelMine from './Assets/steelmine.png';
import Farm from './Assets/farm.png';
import Stables from './Assets/stable.png';
import ArcherTower from './Assets/archertower.png';
import LookoutTower from './Assets/lookouttower.png';
import BlackSmith from './Assets/blacksmith.png';
import Tavern from './Assets/tavern.png';
import TrainingYard from './Assets/trainingyard.png';
import GrainSilo from './Assets/grainsilo.png'
import StoneStockpile from './Assets/stonestockpile.png'
import Armory from './Assets/armory.png'
import WoodStockpile from './Assets/woodstockpile.png'
import Castle from './Assets/castle.png'
import Chancery from './Assets/chancery.png'
import Barracks from './Assets/barracks.png'

/**
 * BuildMenu component function definition.
 * This component represents a button that toggles the visibility of a build menu.
 * @returns {JSX.Element} JSX representation of the BuildMenu component.
 */

function BuildMenu({addBuilding, setPosition})
{
  // State variable to track the visibility of the build menu
  const [menuVisible, setMenuVisible] = useState(false);

  const buildType = (type, position) =>
  {
      addBuilding(type, position)
      setPosition(position)
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



function getRandomPosition()
{
  return [Math.floor(Math.random() * 36) + 2, Math.floor(Math.random() * 36) + 2];
}


function Production({buildType}) {
  return (
    <div className="type-container">
      <div className="image-scroll-container">
        <Building buildType={buildType} name="WoodCuttersCamp" image={WoodCuttersCamp} />
        <Building buildType={buildType} name="Quarry" image={Quarry} />
        <Building buildType={buildType} name="SteelMine" image={SteelMine} />
        <Building buildType={buildType} name="Farm" image={Farm} />
      </div>
    </div>
  );
}

function Defense({buildType}) {
  return (
    <div className="type-container">
      <div className="image-scroll-container">
        <Building buildType={buildType} name="Stables" image={Stables} />
        <Building buildType={buildType} name="ArcherTower" image={ArcherTower} />
        <Building buildType={buildType} name="LookoutTower" image={LookoutTower} />
        <Building buildType={buildType} name="BlackSmith" image={BlackSmith} />
        <Building buildType={buildType} name="Tavern" image={Tavern} />
        <Building buildType={buildType} name="TrainingYard" image={TrainingYard} />
      </div>
    </div>
  );
}

function Storage({buildType}) {
  return (
    <div className="type-container">
      <div className="image-scroll-container">
        <Building buildType={buildType} name="GrainSilo" image={GrainSilo} />
        <Building buildType={buildType} name="StoneStockpile" image={StoneStockpile} />
        <Building buildType={buildType} name="Armory" image={Armory} />
        <Building buildType={buildType} name="WoodStockpile" image={WoodStockpile} />
      </div>
    </div>
  );
}

function Governmental({buildType}) {
  return (
    <div className="type-container">
      <div className="image-scroll-container">
        <Building buildType={buildType} name="Castle" image={Castle} />
        <Building buildType={buildType} name="Chancery" image={Chancery} />
      </div>
    </div>
  );
}

function Military({buildType}) {
  return (
    <div className="type-container">
      <div className="image-scroll-container">
        <Building buildType={buildType} name="Barracks" image={Barracks} />
      </div>
    </div>
  );
}


function Building({buildType, name, image})
{
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div className="building-container">
      <img
        src={image}
        className="small-image"
        onClick={() => buildType(name, getRandomPosition())}
        alt={name}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      {showTooltip && <div className="tooltip">{name}</div>}
    </div>
  );
}

export default BuildMenu;
