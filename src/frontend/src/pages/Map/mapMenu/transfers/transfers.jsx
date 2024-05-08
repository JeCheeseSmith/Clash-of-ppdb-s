import React, {useState} from 'react';
import "./transfers.css"
import TransferOption from "./transferOptionContents.jsx";

/**
 * Represents a component for displaying transfer options in a menu.
 * @param {object} props - The props object.
 * @param {boolean} props.outpostChosen - A boolean indicating if an outpost is chosen.
 * @param {object} props.selectedObject - The selected object.
 * @param {Function} props.setMenuVisible - A function to set the visibility of the menu.
 * @returns {JSX.Element} TransferMenu component.
 */
function TransferMenu({outpostChosen, selectedObject, setMenuVisible})
{
    return(
        <div>
            <Navbar outpostChosen={outpostChosen} selectedObject={selectedObject}/>
            <button className={"close-transfer-menu"} onClick={() => setMenuVisible(false)}>
                <span className="transition"></span>
                <span className="gradient"></span>
                <span className="label">CLOSE</span>
            </button>
        </div>
    )
}

export default TransferMenu;


/**
 * Represents a navigation bar component for the transfer menu.
 * @param {object} props - The props object.
 * @param {boolean} props.outpostChosen - A boolean indicating if an outpost is chosen.
 * @param {object} props.selectedObject - The selected object.
 * @returns {JSX.Element} Navbar component.
 */
function Navbar({outpostChosen, selectedObject})
{
    const [currentPage, setCurrentPage] = useState('Transfer');

    const handleButtonClick = (pageName) =>
    {
      setCurrentPage(pageName);
    };

    return (
        <div>
            {
                <nav className="menu-navbar">
                    <ul className="menu-navbar-links">
                        <li>
                            <button onClick={() => handleButtonClick('Transfer')} className={"transferOption"}>Transfer</button>
                        </li>
                        <li>
                            {!outpostChosen && <button onClick={() => handleButtonClick('Attack')} className={"transferOption"}>Attack</button>}
                        </li>
                        <li>
                            {!outpostChosen && <button onClick={() => handleButtonClick('Espionage')} className={"transferOption"}>Espionage</button>}
                        </li>
                        <li>
                            {!outpostChosen && <button onClick={() => handleButtonClick('Information')} className={"transferOption"}>Information</button>}
                        </li>
                    </ul>
                </nav>
            }
            {
                currentPage && (<TransferOption pageName={currentPage} selectedObject={selectedObject} outpostChosen={outpostChosen}/>)
            }
        </div>
    );
}

