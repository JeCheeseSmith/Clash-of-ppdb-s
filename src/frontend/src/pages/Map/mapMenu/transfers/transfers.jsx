import React, {useState} from 'react';
import "./transfers.css"
import TransferOption from "./transferOptionContents.jsx";
import PopUp from "../../../../globalComponents/popupMessage/popup.jsx";

/**
 * Represents a component for displaying transfer options in a menu.
 *
 * @param {object} props - The props object.
 * @param {boolean} props.outpostChosen - A boolean indicating if an outpost is chosen.
 * @param {object} props.selectedObject - The selected object.
 * @param {Function} props.setMenuVisible - A function to set the visibility of the menu.
 * @param {Function} props.setInstantCallForUpdate - A function to trigger an update.
 * @returns {JSX.Element} TransferMenu component.
 */

function TransferMenu({outpostChosen, selectedObject, setMenuVisible, setInstantCallForUpdate})
{
    const renderedOutpostChosen = !!(!outpostChosen && selectedObject[2])
    const [popUp, setPopup] = useState(!!(!outpostChosen && selectedObject[2]));
    return(
        <>
            {!renderedOutpostChosen &&
                <div>
                    <Navbar outpostChosen={outpostChosen} selectedObject={selectedObject} setInstantCallForUpdate={setInstantCallForUpdate}/>
                    <button className={"close-transfer-menu"} onClick={() => setMenuVisible(false)}>
                        <span className="transition"></span>
                        <span className="gradient"></span>
                        <span className="label">CLOSE</span>
                    </button>
                </div>}
            {popUp && <PopUp message={"Choose Another Place!"} setPopup={setPopup}/>}
        </>
    )
}

export default TransferMenu;


/**
 * Represents a navigation bar component for the transfer menu.
 *
 * @param {object} props - The props object.
 * @param {boolean} props.outpostChosen - A boolean indicating if an outpost is chosen.
 * @param {object} props.selectedObject - The selected object.
 * @param {Function} props.setInstantCallForUpdate - A function to trigger an update.
 * @returns {JSX.Element} Navbar component.
 */

function Navbar({outpostChosen, selectedObject, setInstantCallForUpdate})
{
    const [currentPage, setCurrentPage] = useState(outpostChosen ? 'Transfer' : 'Information');

    const handleButtonClick = (pageName) =>
    {
      setCurrentPage(pageName);
    };

    return (
        <div>
            {
                <nav className="menu-navbar">
                    <ul className="menu-navbar-links">
                        {outpostChosen &&
                                <li>
                                    <button onClick={() => handleButtonClick('Transfer')}
                                            className={"transferOption"}>
                                        Outpost
                                    </button>
                                </li>
                        }
                        {!outpostChosen &&
                            <>
                                <li>
                                    <button onClick={() => handleButtonClick('Information')}
                                            className={currentPage === "Information" ? "transferOption selected" : "transferOption"}>
                                        Details
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => handleButtonClick('Transfer')}
                                            className={currentPage === "Transfer" ? "transferOption selected" : "transferOption"}>
                                        Transfer
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => handleButtonClick('Attack')}
                                            className={currentPage === "Attack" ? "transferOption selected" : "transferOption"}>
                                        Attack!
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => handleButtonClick('Espionage')}
                                            className={currentPage === "Espionage" ? "transferOption selected" : "transferOption"}>
                                        Espionage...
                                    </button>
                                </li>
                            </>
                        }
                    </ul>
                </nav>
            }
            {
                currentPage && (<TransferOption pageName={currentPage}
                                                selectedObject={selectedObject}
                                                outpostChosen={outpostChosen}
                                                setInstantCallForUpdate={setInstantCallForUpdate}
                />)
            }
        </div>
    );
}

