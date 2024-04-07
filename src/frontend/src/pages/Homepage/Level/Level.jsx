import React from 'react';
import './level.css'

function LevelBar() {

    const xpPercentage = 50;

    return (
        <div className="level-xp-container">
            <div className="level-container">
                <div className="level-count">1</div>
            </div>
            <div className="xp-bar-container">
                <div className="xp-bar" style={{width: `${xpPercentage}%`}}></div>
            </div>
        </div>
    );
}

export default LevelBar;