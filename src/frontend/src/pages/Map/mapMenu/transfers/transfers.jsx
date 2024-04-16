import React, {useState} from 'react';
import "./transfers.css"
import TransferOption from "./transferOptionContents.jsx";
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

