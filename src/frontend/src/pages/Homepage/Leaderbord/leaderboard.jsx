import React, {useState} from 'react';
import './leaderboard.css'


function Leaderboard() {

    // Variable to check if the toggle-leaderboard-button has been clicked, initially set to false
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // This function handles the toggle-leaderboard-button click
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div>
            <button onClick={toggleMenu} className="toggle-leaderboard-button"></button>
             {/* If click is true (toggle-leaderboard-button has been clicked), then the leaderboard will open up */}
            {isMenuOpen && (
                <div className={`leaderboard-container ${isMenuOpen  ? 'visible' : 'hidden'}`}>
                    <div className="leaderboardmenu">
                        <h1 className="leaderboard-title">Leaderboard</h1>
                         {/* just hardcoded for the demo but it will be connected with an api */}
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