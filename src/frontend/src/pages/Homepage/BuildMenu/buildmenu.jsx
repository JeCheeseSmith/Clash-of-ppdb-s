import React, { useState, useEffect, useRef } from 'react';
import './buildmenu.css'
import './buildmenuOptionsContents.css'
import castleIcon1 from '../../../assets/castle-icon.png';
function BuildMenu()
{
    const [menuVisible, setMenuVisible] = useState(false); // State variable to track build menu visibility
    const toggleMenuVisibility = () =>
    {
        setMenuVisible(!menuVisible);
    };
    return (
        <div>
            <button onClick={toggleMenuVisibility} className={`toggle-menu-button ${menuVisible ? 'visible' : 'hidden'}`}>
                <div>
                    <span className="build">Build</span>
                    <br/>
                    <span className="menu">Menu</span>
                </div>
                <div className="image-container"></div>
            </button>
            <div>
                <BuildOptions menuVisible={menuVisible} setMenuVisible={setMenuVisible}/>
            </div>
        </div>
    );
}

function BuildOptions({ menuVisible, setMenuVisible})
{
    const [currentPage, setCurrentPage] = useState('Type1');
    const handleButtonClick = (pageName) =>
    {
        setCurrentPage(pageName);
    };
    const handleCloseButton = () =>
    {
        setMenuVisible(false);
    };
    return (
      <div className="buildoptions-container">
          <button className={`closeMenu ${menuVisible ? 'visible' : 'hidden'}`} onClick={handleCloseButton}>close</button>
          {menuVisible && (
              <nav className="options-content">
                  <ul className="buildoptions-links">
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
          {
              menuVisible &&
              (<div>
                  {currentPage === 'Type1' && <Type1/>}
                  {currentPage === 'Type2' && <Type2/>}
                  {currentPage === 'Type3' && <Type3/>}
                  {currentPage === 'Type4' && <Type4/>}
              </div>)
          }
      </div>
    );
}

function Type1()
{
  const handleClick = (imageNumber) =>
  {
      console.log(`Image ${imageNumber} clicked`);
  };

  return (
    <div className="type-container">
      <div className="image-scroll-container">
        <img src={castleIcon1} alt="Image 1" className="small-image" onClick={() => handleClick(1)} />
        <img src={castleIcon1} alt="Image 2" className="small-image" onClick={() => handleClick(2)} />
        <img src={castleIcon1} alt="Image 3" className="small-image" onClick={() => handleClick(3)} />
        <img src={castleIcon1} alt="Image 3" className="small-image" onClick={() => handleClick(3)} />
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
