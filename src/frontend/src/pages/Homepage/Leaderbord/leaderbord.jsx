import React, {useState} from 'react';
import './leaderbord.css'


function Leaderboard() {
  // State to manage the visibility of the menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle the menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
      <div>
            <button onClick={toggleMenu} className="toggle-leaderbord-button">Leaderboard</button>
          {isMenuOpen && (
            <div className={`box-container ${isMenuOpen  ? 'visible' : 'hidden'}`}>
                <h1 className="chat-title">CHAT</h1>
                <ul>
                    <li>Menu Item 1</li>
                    <li>Menu Item 2</li>
                    <li>Menu Item 3</li>
                </ul>
            </div>
               )}
        </div>
    );
}


export default Leaderboard;