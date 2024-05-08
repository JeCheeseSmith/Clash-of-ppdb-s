import React, {useState} from 'react';
import './leaderboard.css'
import POST from "../../../api/POST.jsx";
import GET from "../../../api/GET.jsx";


function Leaderboard() {
     const [leaderboard, setLeaderboard] = useState([]);

    // Variable to check if the toggle-leaderboard-button has been clicked, initially set to false
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // This function handles the toggle-leaderboard-button click
    const toggleMenu = async () => {
        setIsMenuOpen(!isMenuOpen);
        const data = await GET({}, "/getleaderboard");
        setLeaderboard(data)
    };

    return (
        <div>
            <button onClick={toggleMenu} className="toggle-leaderboard-button"></button>
             {/* If click is true (toggle-leaderboard-button has been clicked), then the leaderboard will open up */}
            {isMenuOpen && (
                <div className={`leaderboard-container ${isMenuOpen  ? 'visible' : 'hidden'}`}>
                    <div className="leaderboardmenu">
                        <h1 className="leaderboard-title">Leaderboard</h1>
                        <ul>
                             {leaderboard.map((player, index) => (
                                <li key={index}> {`Player: ${player[0]}  Level: ${player[1]}`}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                )}
        </div>
    );
}


export default Leaderboard;