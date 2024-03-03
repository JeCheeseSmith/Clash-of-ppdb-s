import React, { useState, useEffect, useRef } from 'react';
import './buildmenu.css'

import buttonOption from "../../../assets/socialOptionSound.mp3";

function BuildMenu()
{
    const [menuVisible, setMenuVisible] = useState(false); // State variable to track build menu visibility
    const [buildOptions, setBuildOptions] = useState([]); // Initialize buildOptions
    const toggleMenuVisibility = () =>
    {
        setMenuVisible(!menuVisible);
    };

    return (
        <div>
            <button onClick={toggleMenuVisibility}
                    className={`toggle-menu-button ${menuVisible ? 'visible' : 'hidden'}`}>
                <div>
                    <span className="build">Build</span>
                    <br/>
                    <span className="menu">Menu</span>
                </div>
                <div className="image-container"></div>
            </button>
            <div className="options-container">
                <BuildOptions menuVisible={menuVisible}/>
            </div>
        </div>
    );
}

function BuildOptions({ menuVisible }) {
    const [currentPage, setCurrentPage] = useState('Type1');

    const handleButtonClick = (pageName) =>
    {
        setCurrentPage(pageName);
    };

    return (
      <div className="buildoptions-container">
          {menuVisible && (
              <nav className="page-content">
                  <ul className="buildoptions-links">
                      <li>
                          <button onClick={() => handleButtonClick('Type1')} className={"type"}>
                              Type1
                          </button>
                      </li>
                      <li>
                          <button onClick={() => handleButtonClick('Type2')} className={"type"}>
                              Type2
                          </button>
                      </li>
                      <li>
                          <button onClick={() => handleButtonClick('Type3')} className={"type"}>
                              Type3
                          </button>
                      </li>
                      <li>
                          <button onClick={() => handleButtonClick('Type4')} className={"type"}>
                              Type4
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

function Type1() {
    return (
        <div className={"Type1"}>

        </div>
    )
}
function Type2() {
    return (
        <div className={"Type2"}>

        </div>
    )
}
function Type3() {
    return (
        <div className={"Type3"}>

        </div>
    )
}
function Type4() {
    return (
        <div className={"Type4"}>

        </div>
    )
}

export default BuildMenu;
