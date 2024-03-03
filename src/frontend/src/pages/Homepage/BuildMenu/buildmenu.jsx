import React, { useState, useEffect, useRef } from 'react';
import './buildmenu.css'

function BuildMenu()
{
    const [menuVisible, setMenuVisible] = useState(true); // State variable to track build menu visibility
    const [buildOptions, setBuildOptions] = useState([]); // Initialize buildOptions
    const toggleMenuVisibility = () =>
    {
        setMenuVisible(!menuVisible);
    };

    return (
        <div>
            <button onClick={toggleMenuVisibility}
                    className={`toggle-menu-button ${menuVisible ? 'visible' : 'hidden'}`}>
                {
                    <>
                        <div>
                            <span className="build">Build</span>
                            <br/>
                            <span className="menu">Menu</span>
                        </div>
                        <div className="image-container"></div>
                    </>
                }
            </button>
        </div>
    );
}

function BuildOptionsDisplay({buildOptions}) {

    return (
        <div className="buildOptions-display">

        </div>
    );
}

export default BuildMenu;
