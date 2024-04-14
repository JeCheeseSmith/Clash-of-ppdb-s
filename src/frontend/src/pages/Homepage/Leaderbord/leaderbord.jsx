import React, {useState} from 'react';
import './leaderbord.css'


function Leaderboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
      <div>
            <button onClick={toggleMenu} className="toggle-leaderbord-button">Leaderboard</button>
          {isMenuOpen && (
            <div className={`bo-container ${isMenuOpen  ? 'visible' : 'hidden'}`}>
                <div className="leaderboardmenu">
                    <h1 className="Lchat-title">Leaderboard</h1>
                    <ul>
                        <li>Player 1</li>
                        <li>player 2</li>
                        <li>Player 3</li>
                    </ul>
                </div>
            </div>
            )}
        </div>
    );
}


export default Leaderboard;