import React, {useState} from 'react';
import './leaderboard.css'


function Leaderboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
      <div>
            <button onClick={toggleMenu} className="toggle-leaderboard-button"></button>
          {isMenuOpen && (
            <div className={`leaderboard-container ${isMenuOpen  ? 'visible' : 'hidden'}`}>
                <div className="leaderboardmenu">
                    <h1 className="leaderboard-title">Leaderboard</h1>
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