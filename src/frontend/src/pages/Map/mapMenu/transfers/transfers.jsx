import React, {useState} from 'react';
import "./transfers.css"
import TransferOption from "./transferOptionContents.jsx";
function TransferMenu({menuVisible, setMenuVisible})
{
    return(
        <div>
            <Navbar/>
        </div>
    )
}

export default TransferMenu;

function Navbar() {
    const [currentPage, setCurrentPage] = useState('Transfer');

    const handleButtonClick = (pageName) =>
    {
      setCurrentPage(pageName);
    };

    return (
        <div className="menu-navbar-container">
            {
                <nav className="menu-navbar">
                    <ul className="menu-navbar-links">
                        <li>
                            <button onClick={() => handleButtonClick('Transfer')} className={"transferOption"}>Transfer</button>
                        </li>
                        <li>
                            <button onClick={() => handleButtonClick('Attack')} className={"transferOption"}>Attack</button>
                        </li>
                        <li>
                            <button onClick={() => handleButtonClick('Espionage')} className={"transferOption"}>Espionage</button>
                        </li>
                    </ul>
                </nav>
            }
            {
                currentPage && (<TransferOption pageName={currentPage}/>)
            }
        </div>
    );
}

